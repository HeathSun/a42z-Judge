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
    
    // 存储数据
    const data = {
      id: requestId,
      timestamp: new Date().toISOString(),
      repo_url: body.repo_url,
      user_id: body.user_id || 'anonymous',
      analysis_type: 'paul_graham_perspective',
      status: 'received'
    };
    
    receivedData.set(requestId, data);

    // 返回成功响应
    return NextResponse.json({
      success: true,
      message: 'Paul analysis request received successfully',
      request_id: requestId,
      data: {
        repo_url: body.repo_url,
        analysis_type: 'paul_graham_perspective',
        status: 'processing'
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