import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { repo_url, repo_pdf, user_id } = body;

    // 调用 Dify 聊天机器人
    const response = await fetch('https://api.dify.ai/v1/workflows/iOjmqrK3tPqx2gZS', {
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
    
    return NextResponse.json({
      success: true,
      data: result,
      source: 'feifei_li'
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