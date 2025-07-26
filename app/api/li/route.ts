import { NextRequest, NextResponse } from 'next/server';

// Li API 数据接口
interface LiData {
  user_id?: string;
  repo_url?: string;
  repo_pdf?: string;
  timestamp?: string;
  [key: string]: unknown;
}

// 存储接收到的数据（用于调试和临时存储）
const liData = new Map<string, LiData>();

export async function POST(request: NextRequest) {
  try {
    const body: LiData = await request.json();
    const { repo_url, repo_pdf, user_id } = body;
    
    console.log('📥 Li API Called:', {
      user_id: body.user_id,
      repo_url: body.repo_url,
      repo_pdf: body.repo_pdf,
      timestamp: body.timestamp || new Date().toISOString()
    });

    // 调用 Dify 聊天机器人
    const response = await fetch('https://udify.app/chat/iOjmqrK3tPqx2gZS', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: { repo_url, repo_pdf },
        user: user_id || 'anonymous'
      }),
    });

    if (!response.ok) {
      throw new Error(`Dify API error: ${response.status}`);
    }

    const result = await response.json();
    
    // 存储数据用于调试
    const dataId = user_id || `li_${Date.now()}`;
    liData.set(dataId, {
      ...body,
      timestamp: body.timestamp || new Date().toISOString()
    });
    
    return NextResponse.json({
      success: true,
      data: result,
      source: 'li'
    });

  } catch (error) {
    console.error('❌ Li API Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to process Li analysis',
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
        message: 'Li API endpoint is ready',
        available_methods: ['POST', 'GET'],
        note: 'Use POST to send Li analysis request, GET with data_id to query received data',
        endpoint: 'https://www.a42z.ai/api/li'
      },
      { status: 200 }
    );
  }

  const data = liData.get(dataId);
  
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