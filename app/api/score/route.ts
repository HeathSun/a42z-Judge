import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { repo_url } = body;

    if (!repo_url) {
      return NextResponse.json(
        { error: 'repo_url is required' },
        { status: 400 }
      );
    }

    console.log('🔄 Calling Dify Score API...');

    // 调用 Dify API
    const response = await fetch('https://api.dify.ai/v1/chat-messages', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer app-LBGrJlLjB9w7C0Av4w85DGZf',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: { repo_url },
        query: `Please analyze and score this GitHub repository: ${repo_url}`,
        response_mode: 'blocking',
        user: 'a42z_score_user'
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Dify Score API Error:', errorText);
      return NextResponse.json(
        { error: `Dify API Error: ${response.status} - ${errorText}` },
        { status: response.status }
      );
    }

    const result = await response.json();
    console.log('✅ Dify Score API response received');

    return NextResponse.json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('❌ Score API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to get score from Dify',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Score API is running',
    usage: 'POST with { repo_url }'
  });
} 