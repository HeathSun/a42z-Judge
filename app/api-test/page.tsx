'use client';

import { useState } from 'react';

type ApiTestResult = string | Record<string, unknown> | null;

interface ApiEndpoint {
  name: string;
  path: string;
  description: string;
  color: string;
}

const apiEndpoints: ApiEndpoint[] = [
  {
    name: 'Receive Data',
    path: '/api/receive-data',
    description: '通用数据接收端点',
    color: 'bg-blue-600 hover:bg-blue-700'
  },
  {
    name: 'Business Analysis',
    path: '/api/business',
    description: '商业潜力分析',
    color: 'bg-green-600 hover:bg-green-700'
  },
  {
    name: 'Li Analysis',
    path: '/api/li',
    description: 'Feifei Li 分析',
    color: 'bg-purple-600 hover:bg-purple-700'
  },
  {
    name: 'Paul Analysis',
    path: '/api/paul',
    description: 'Paul Graham 分析',
    color: 'bg-orange-600 hover:bg-orange-700'
  },
  {
    name: 'Ng Analysis',
    path: '/api/ng',
    description: 'Andrew Ng 分析',
    color: 'bg-red-600 hover:bg-red-700'
  },
  {
    name: 'Sam Analysis',
    path: '/api/sam',
    description: 'Sam Altman 分析',
    color: 'bg-indigo-600 hover:bg-indigo-700'
  },
  {
    name: 'Summary Analysis',
    path: '/api/summary',
    description: '综合分析总结',
    color: 'bg-teal-600 hover:bg-teal-700'
  }
];

export default function ApiTestPage() {
  const [testResults, setTestResults] = useState<Record<string, ApiTestResult>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});

  const testApiEndpoint = async (endpoint: string, method: 'GET' | 'POST' | 'PUT') => {
    setLoading(prev => ({ ...prev, [endpoint]: true }));
    try {
      const response = await fetch(endpoint, {
        method,
        headers: method === 'POST' ? {
          'Content-Type': 'application/json',
        } : {},
        body: method === 'POST' ? JSON.stringify({
          user_id: 'test_user_123',
          repo_url: 'https://github.com/test/repo',
          workflow_result: `This is a test result from ${endpoint}`,
          analysis_type: 'test_analysis'
        }) : undefined
      });
      const data = await response.json();
      setTestResults(prev => ({ ...prev, [endpoint]: data as Record<string, unknown> }));
    } catch (error) {
      setTestResults(prev => ({ ...prev, [endpoint]: error instanceof Error ? error.message : 'Unknown error' }));
    } finally {
      setLoading(prev => ({ ...prev, [endpoint]: false }));
    }
  };

  const clearResults = () => {
    setTestResults({});
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            API 接口测试页面
          </h1>
          <p className="text-lg text-gray-600">
            测试所有 API 端点的功能
          </p>
        </div>

        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">API 端点列表</h2>
            <button
              onClick={clearResults}
              className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
            >
              清除结果
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {apiEndpoints.map((endpoint) => (
              <div key={endpoint.path} className="border rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-2">{endpoint.name}</h3>
                <p className="text-sm text-gray-600 mb-3">{endpoint.description}</p>
                <p className="text-xs text-gray-500 mb-4 font-mono">{endpoint.path}</p>
                
                <div className="space-y-2">
                  <button
                    onClick={() => testApiEndpoint(endpoint.path, 'GET')}
                    disabled={loading[endpoint.path]}
                    className={`w-full text-white px-3 py-2 rounded text-sm ${endpoint.color} disabled:opacity-50`}
                  >
                    {loading[endpoint.path] ? '测试中...' : '测试 GET'}
                  </button>
                  
                  <button
                    onClick={() => testApiEndpoint(endpoint.path, 'POST')}
                    disabled={loading[endpoint.path]}
                    className={`w-full text-white px-3 py-2 rounded text-sm ${endpoint.color} disabled:opacity-50`}
                  >
                    {loading[endpoint.path] ? '测试中...' : '测试 POST'}
                  </button>
                  
                  <button
                    onClick={() => testApiEndpoint(endpoint.path, 'PUT')}
                    disabled={loading[endpoint.path]}
                    className={`w-full text-white px-3 py-2 rounded text-sm ${endpoint.color} disabled:opacity-50`}
                  >
                    {loading[endpoint.path] ? '测试中...' : '测试 PUT'}
                  </button>
                </div>

                {testResults[endpoint.path] && (
                  <div className="mt-4">
                    <h4 className="font-medium text-sm mb-2">测试结果:</h4>
                    <pre className="bg-gray-100 p-3 rounded text-xs overflow-auto max-h-32">
                      {typeof testResults[endpoint.path] === 'string'
                        ? testResults[endpoint.path] as string
                        : JSON.stringify(testResults[endpoint.path], null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">使用说明</h3>
          <div className="space-y-3 text-sm text-blue-800">
            <p><strong>GET 请求:</strong> 测试接口是否可访问，返回接口状态信息</p>
            <p><strong>POST 请求:</strong> 发送测试数据到对应的 Dify 聊天机器人</p>
            <p><strong>PUT 请求:</strong> 获取所有已接收的数据（用于调试）</p>
            <p><strong>注意:</strong> 所有 API 端点现在都支持相同的请求格式和响应格式</p>
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mt-6">
          <h3 className="text-lg font-semibold text-green-900 mb-4">统一响应格式</h3>
          <div className="space-y-2 text-sm text-green-800">
            <p><strong>成功响应:</strong></p>
            <pre className="bg-white p-3 rounded text-xs overflow-auto">
{`{
  "success": true,
  "message": "Analysis completed successfully",
  "data": { /* Dify 返回的数据 */ },
  "data_id": "unique_id",
  "source": "judge_name",
  "timestamp": "2024-01-01T00:00:00.000Z"
}`}
            </pre>
            <p><strong>错误响应:</strong></p>
            <pre className="bg-white p-3 rounded text-xs overflow-auto">
{`{
  "success": false,
  "error": "Error description",
  "details": "Detailed error message"
}`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
} 