import { NextRequest, NextResponse } from 'next/server';

// Webhook事件类型
interface DifyWebhookEvent {
  event: 'analysis_started' | 'analysis_progress' | 'analysis_completed' | 'analysis_error';
  conversation_id: string;
  message_id: string;
  result?: {
    answer: string;
    metadata?: {
      usage?: {
        total_tokens?: number;
        prompt_tokens?: number;
        completion_tokens?: number;
      };
    };
  };
  error?: {
    code: string;
    message: string;
  };
  timestamp: string;
}

// 存储分析结果的全局变量（在生产环境中应该使用数据库）
const analysisResults = new Map<string, DifyWebhookEvent>();

export async function POST(request: NextRequest) {
  try {
    const body: DifyWebhookEvent = await request.json();
    
    console.log('Dify Webhook Received:', {
      event: body.event,
      conversation_id: body.conversation_id,
      message_id: body.message_id,
      timestamp: body.timestamp
    });

    // 验证webhook签名（可选，增加安全性）
    const signature = request.headers.get('x-dify-signature');
    if (signature) {
      // 这里可以添加签名验证逻辑
      console.log('Webhook signature:', signature);
    }

    // 根据事件类型处理
    switch (body.event) {
      case 'analysis_started':
        console.log('Analysis started for conversation:', body.conversation_id);
        break;
        
      case 'analysis_progress':
        console.log('Analysis progress for conversation:', body.conversation_id);
        break;
        
      case 'analysis_completed':
        console.log('Analysis completed for conversation:', body.conversation_id);
        // 存储分析结果
        analysisResults.set(body.conversation_id, body);
        
        // 这里可以触发前端更新
        // 例如通过WebSocket或Server-Sent Events推送结果
        break;
        
      case 'analysis_error':
        console.error('Analysis error for conversation:', body.conversation_id, body.error);
        break;
        
      default:
        console.warn('Unknown webhook event:', body.event);
    }

    // 返回成功响应
    return NextResponse.json({ 
      success: true, 
      message: 'Webhook received successfully',
      conversation_id: body.conversation_id 
    });

  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to process webhook' 
      },
      { status: 500 }
    );
  }
}

// GET端点用于查询分析结果
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const conversationId = searchParams.get('conversation_id');
  
  if (!conversationId) {
    // 如果没有conversation_id，返回成功响应（用于连接测试）
    return NextResponse.json(
      { 
        success: true, 
        message: 'Webhook endpoint is ready',
        available_methods: ['POST', 'GET'],
        note: 'Use POST for webhook events, GET with conversation_id to query results'
      },
      { status: 200 }
    );
  }

  const result = analysisResults.get(conversationId);
  
  if (!result) {
    return NextResponse.json(
      { error: 'Analysis result not found' },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    result: result
  });
}

// 获取所有分析结果（用于调试）
export async function PUT() {
  const results = Array.from(analysisResults.entries()).map(([id, result]) => ({
    conversation_id: id,
    event: result.event,
    timestamp: result.timestamp,
    has_result: !!result.result
  }));

  return NextResponse.json({
    success: true,
    count: results.length,
    results: results
  });
} 