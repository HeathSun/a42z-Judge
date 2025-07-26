import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { judgeType, message, inputs } = body;

    // 验证必需参数
    if (!judgeType || !message) {
      return NextResponse.json(
        { error: 'judgeType and message are required' },
        { status: 400 }
      );
    }

    // 定义评委配置
    const JUDGE_CONFIGS: Record<string, { apiKey: string; name: string }> = {
      receive_data: {
        apiKey: 'app-dhIC2LKWiF6txqsziyaAPvQy',
        name: 'Technical Analysis'
      },
      business: {
        apiKey: 'app-TNEgFjsjZlRSVLaMFtBOOMlr',
        name: 'Business Analysis'
      },
      sam: {
        apiKey: 'app-69wonwSInJYTocYMba4OhuYo',
        name: 'Sam Altman'
      },
      li: {
        apiKey: 'app-4hLOcPEUppVshp6ErJnD8JSX',
        name: 'Feifei Li'
      },
      ng: {
        apiKey: 'app-sorlsRwypHu0Fh67fXw47ZtV',
        name: 'Andrew Ng'
      },
      paul: {
        apiKey: 'app-1wc2KIN2OnhqxQYmDsIGgMXR',
        name: 'Paul Graham'
      }
    };

    const judgeConfig = JUDGE_CONFIGS[judgeType];
    if (!judgeConfig) {
      return NextResponse.json(
        { error: `Unknown judge type: ${judgeType}` },
        { status: 400 }
      );
    }

    console.log(`🔄 Proxying request to Dify for ${judgeConfig.name}...`);

    // 调用 Dify API
    const response = await fetch('https://api.dify.ai/v1/chat-messages', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${judgeConfig.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: inputs || {},
        query: message,
        response_mode: 'blocking',
        user: 'a42z_judge_user'
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ Dify API Error for ${judgeType}:`, errorText);
      return NextResponse.json(
        { error: `Dify API Error: ${response.status} - ${errorText}` },
        { status: response.status }
      );
    }

    const result = await response.json();
    console.log(`✅ Dify API response received for ${judgeConfig.name}`);

    return NextResponse.json({
      success: true,
      data: result,
      judgeType,
      judgeName: judgeConfig.name
    });

  } catch (error) {
    console.error('❌ Dify proxy error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to proxy request to Dify',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Dify API Proxy is running',
    available_judges: [
      'receive_data', 'business', 'sam', 'li', 'ng', 'paul'
    ],
    usage: 'POST with { judgeType, message, inputs }'
  });
} 