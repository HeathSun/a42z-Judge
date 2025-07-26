import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { repo_pdf, user_id } = body;

    // 调用 Dify 聊天机器人
    const response = await fetch('https://udify.app/chat/mABrKNb234D08oGx', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: { repo_pdf },
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
      source: 'summary'
    });

  } catch (error) {
    console.error('Summary API Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to process summary analysis',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 