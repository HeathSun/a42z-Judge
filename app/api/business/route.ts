import { NextRequest, NextResponse } from 'next/server';

// 存储接收到的数据
const receivedData = new Map<string, Record<string, unknown>>();

export async function GET() {
  return NextResponse.json({
    message: 'Business Analysis API is running',
    receivedData: Array.from(receivedData.entries())
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Business Analysis Request:', body);

    // 验证必需字段
    if (!body.repo_url) {
      return NextResponse.json(
        { error: 'repo_url is required' },
        { status: 400 }
      );
    }

    // 生成唯一ID
    const requestId = `business_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // 模拟商业分析结果
    const analysisResult = {
      agent_name: 'Business Analyst',
      analysis_type: 'business_potential',
      scores: {
        market_size: Math.floor(Math.random() * 40 + 60), // 60-100
        competitive_advantage: Math.floor(Math.random() * 40 + 60),
        revenue_potential: Math.floor(Math.random() * 40 + 60),
        scalability: Math.floor(Math.random() * 40 + 60),
        market_timing: Math.floor(Math.random() * 40 + 60)
      },
      market_analysis: {
        target_market: "SaaS and Developer Tools",
        market_size: "$50B+",
        growth_rate: "15% annually",
        key_competitors: ["Competitor A", "Competitor B", "Competitor C"],
        market_trends: ["AI Integration", "Cloud Migration", "Developer Experience"]
      },
      business_model: {
        revenue_streams: ["Subscription", "Enterprise Licensing", "API Usage"],
        pricing_strategy: "Freemium with premium tiers",
        customer_acquisition_cost: "$150-300",
        lifetime_value: "$2000-5000",
        churn_rate: "5-8% monthly"
      },
      recommendations: [
        "Focus on enterprise sales for higher ARR",
        "Develop strategic partnerships with cloud providers",
        "Invest in customer success to reduce churn",
        "Consider international expansion in year 2"
      ],
      risk_assessment: {
        high_risk: ["Market saturation", "Regulatory changes"],
        medium_risk: ["Competition from incumbents", "Technology shifts"],
        low_risk: ["Team execution", "Product-market fit"]
      }
    };
    
    // 存储数据
    const data = {
      id: requestId,
      timestamp: new Date().toISOString(),
      repo_url: body.repo_url,
      user_id: body.user_id || 'anonymous',
      analysis_type: 'business_potential',
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
      message: 'Business analysis completed successfully',
      request_id: requestId,
      data: {
        repo_url: body.repo_url,
        analysis_type: 'business_potential',
        status: 'completed',
        agent_output: analysisResult,
        metadata: data.metadata
      }
    });

  } catch (error) {
    console.error('Business Analysis API Error:', error);
    return NextResponse.json(
      { error: 'Invalid JSON payload' },
      { status: 400 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Business Analysis Update Request:', body);

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
      message: 'Business analysis request updated successfully',
      data: updatedData
    });

  } catch (error) {
    console.error('Business Analysis Update Error:', error);
    return NextResponse.json(
      { error: 'Invalid JSON payload' },
      { status: 400 }
    );
  }
} 