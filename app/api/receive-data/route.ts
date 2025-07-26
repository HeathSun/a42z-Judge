import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Dify Workflow 数据接口
interface DifyWorkflowData {
  user_id?: string;
  workflow_result?: string;
  github_url?: string;
  analysis_type?: string;
  metadata?: Record<string, unknown>;
  timestamp?: string;
  [key: string]: unknown; // 允许其他字段
}

// 存储接收到的数据（用于调试和临时存储）
const receivedData = new Map<string, DifyWorkflowData>();

export async function POST(request: NextRequest) {
  try {
    const body: DifyWorkflowData = await request.json();
    
    console.log('📥 Dify Workflow Data Received:', {
      user_id: body.user_id,
      workflow_result: typeof body.workflow_result === 'string' ? body.workflow_result.substring(0, 100) + '...' : '',
      github_url: body.github_url,
      analysis_type: body.analysis_type,
      timestamp: body.timestamp || new Date().toISOString()
    });

    // 验证webhook签名（可选，增加安全性）
    const signature = request.headers.get('x-dify-signature');
    if (signature) {
      console.log('🔐 Webhook signature:', signature);
      // 这里可以添加签名验证逻辑
    }

    // 生成唯一ID用于存储
    const dataId = typeof body.user_id === 'string' ? body.user_id : `data_${Date.now()}`;
    
    // 存储到内存（用于调试）
    receivedData.set(dataId, {
      ...body,
      timestamp: body.timestamp || new Date().toISOString()
    });

    // 存储到 Supabase 数据库（如果配置了的话）
    if (body.github_url && body.workflow_result && typeof body.workflow_result === 'string') {
      try {
        const { data, error } = await supabase
          .from('judge_comments')
          .insert({
            conversation_id: dataId,
            github_repo_url: body.github_url,
            gmail: typeof body.user_id === 'string' ? body.user_id : '',
            analysis_result: body.workflow_result,
            analysis_metadata: body.metadata,
            created_at: new Date().toISOString()
          });

        if (error) {
          console.error('❌ Supabase insert error:', error);
        } else {
          console.log('✅ Data saved to database:', data);
        }
      } catch (dbError) {
        console.error('❌ Database error:', dbError);
      }
    }

    // 返回成功响应
    return NextResponse.json({ 
      success: true, 
      message: 'Data received successfully',
      data_id: dataId,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Data processing error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to process data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// GET 端点用于查询接收到的数据
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const dataId = searchParams.get('data_id');
  
  if (!dataId) {
    // 返回接口状态信息
    return NextResponse.json(
      { 
        success: true, 
        message: 'Data receiver endpoint is ready',
        available_methods: ['POST', 'GET'],
        note: 'Use POST to send data from Dify Workflow, GET with data_id to query received data',
        endpoint: 'https://www.a42z.ai/api/receive-data'
      },
      { status: 200 }
    );
  }

  const data = receivedData.get(dataId);
  
  if (!data) {
    return NextResponse.json(
      { error: 'Data not found' },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    data: data
  });
}

// PUT 端点用于获取所有接收到的数据（用于调试）
export async function PUT() {
  const allData = Array.from(receivedData.entries()).map(([id, data]) => ({
    data_id: id,
    user_id: data.user_id,
    github_url: data.github_url,
    analysis_type: data.analysis_type,
    timestamp: data.timestamp,
    has_result: !!data.workflow_result
  }));

  return NextResponse.json({
    success: true,
    count: allData.length,
    data: allData
  });
} 