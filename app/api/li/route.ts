import { NextRequest, NextResponse } from 'next/server';

// 存储接收到的数据（用于调试和临时存储）
const receivedData = new Map<string, Record<string, unknown>>();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { repo_url, user_id } = body;

    console.log('📥 Li Analysis Request:', {
      user_id,
      repo_url,
      timestamp: new Date().toISOString()
    });

    // 调用 Dify 聊天机器人
    const response = await fetch('https://udify.app/chat/iOjmqrK3tPqx2gZS', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: { repo_url },
        user: user_id || 'anonymous'
      }),
    });

    if (!response.ok) {
      throw new Error(`Dify API error: ${response.status}`);
    }

    const result = await response.json();
    
    // 生成唯一ID用于存储
    const dataId = typeof user_id === 'string' ? user_id : `li_${Date.now()}`;
    
    // 存储到内存（用于调试）
    receivedData.set(dataId, {
      user_id,
      repo_url,
      result,
      source: 'feifei_li',
      timestamp: new Date().toISOString()
    });

    // 返回成功响应
    return NextResponse.json({ 
      success: true, 
      message: 'Li analysis completed successfully',
      data: result,
      data_id: dataId,
      source: 'feifei_li',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Li API Error:', error);
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
        message: 'Li analysis endpoint is ready',
        available_methods: ['POST', 'GET'],
        note: 'Use POST to send Li analysis request, GET with data_id to query results',
        endpoint: 'https://www.a42z.ai/api/li'
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
    repo_url: data.repo_url,
    source: data.source,
    timestamp: data.timestamp,
    has_result: !!data.result
  }));

  return NextResponse.json({
    success: true,
    count: allData.length,
    data: allData
  });
} 