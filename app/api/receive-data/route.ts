import { NextRequest, NextResponse } from 'next/server';

// Dify Workflow 数据接口
interface DifyWorkflowData {
  user_id?: string;
  workflow_result?: string;
  github_url?: string;
  repo_url?: string;
  repo_pdf?: string;
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
    
    console.log('📥 Receive Data API Called:', {
      user_id: body.user_id,
      repo_url: body.repo_url,
      timestamp: body.timestamp || new Date().toISOString()
    });

    // 调用 Dify 聊天机器人
    const response = await fetch('https://udify.app/chat/9Eiom2dpjU9WpUI7', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: { repo_url: body.repo_url },
        user: body.user_id || 'anonymous'
      }),
    });

    if (!response.ok) {
      throw new Error(`Dify API error: ${response.status}`);
    }

    const result = await response.json();
    
    return NextResponse.json({
      success: true,
      data: result,
      source: 'receive_data'
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