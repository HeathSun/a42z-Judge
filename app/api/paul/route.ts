import { NextRequest, NextResponse } from 'next/server';

// 存储接收到的数据
const receivedData = new Map<string, Record<string, unknown>>();

export async function GET() {
  return NextResponse.json({
    message: 'Paul Analysis API is running',
    receivedData: Array.from(receivedData.entries())
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Paul Analysis Request:', body);

    // 验证必需字段
    if (!body.repo_url) {
      return NextResponse.json(
        { error: 'repo_url is required' },
        { status: 400 }
      );
    }

    // 生成唯一ID
    const requestId = `paul_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // 模拟 Paul Graham 的分析结果
    const analysisResult = {
      agent_name: 'Paul Graham',
      analysis_type: 'paul_graham_perspective',
      scores: {
        innovation_score: Math.floor(Math.random() * 40 + 60), // 60-100
        market_potential: Math.floor(Math.random() * 40 + 60),
        technical_quality: Math.floor(Math.random() * 40 + 60),
        business_model: Math.floor(Math.random() * 40 + 60)
      },
      insights: [
        "This project shows potential for solving real problems.",
        "The technical approach is sound but could be more innovative.",
        "Market timing appears favorable for this type of solution.",
        "The team's execution capability is a key factor to consider."
      ],
      recommendations: [
        "Focus on user acquisition and retention metrics",
        "Consider pivoting towards a more specific niche",
        "Build strong technical moats to prevent competition",
        "Prioritize revenue generation over feature development"
      ],
      risk_factors: [
        "Market saturation in this space",
        "Dependency on third-party APIs",
        "Scalability challenges with current architecture"
      ]
    };
    
    // 存储数据
    const data = {
      id: requestId,
      timestamp: new Date().toISOString(),
      repo_url: body.repo_url,
      user_id: body.user_id || 'anonymous',
      analysis_type: 'paul_graham_perspective',
      status: 'completed',
      result: analysisResult,
      metadata: {
        processing_time: Math.floor(Math.random() * 2000 + 1000), // 1-3 seconds
        tokens_used: Math.floor(Math.random() * 5000 + 2000), // 2000-7000 tokens
        cost: parseFloat((Math.random() * 0.1 + 0.05).toFixed(4)) // $0.05-$0.15
      }
    };
    
    receivedData.set(requestId, data);

    // 返回成功响应
    return NextResponse.json({
      success: true,
      message: 'Paul analysis completed successfully',
      request_id: requestId,
      data: {
        repo_url: body.repo_url,
        analysis_type: 'paul_graham_perspective',
        status: 'completed',
        agent_output: analysisResult,
        metadata: data.metadata
      }
    });

  } catch (error) {
    console.error('Paul Analysis API Error:', error);
    return NextResponse.json(
      { error: 'Invalid JSON payload' },
      { status: 400 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Paul Analysis Update Request:', body);

    if (!body.request_id) {
      return NextResponse.json(
        { error: 'request_id is required for updates' },
        { status: 400 }
      );
    }

    const existingData = receivedData.get(body.request_id);
    if (!existingData) {
      return NextResponse.json(
        { error: 'Request not found' },
        { status: 404 }
      );
    }

    // 更新数据
    const updatedData = {
      ...existingData,
      ...body,
      updated_at: new Date().toISOString()
    };
    
    receivedData.set(body.request_id, updatedData);

    return NextResponse.json({
      success: true,
      message: 'Paul analysis request updated successfully',
      data: updatedData
    });

  } catch (error) {
    console.error('Paul Analysis Update Error:', error);
    return NextResponse.json(
      { error: 'Invalid JSON payload' },
      { status: 400 }
    );
  }
} 