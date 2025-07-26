'use client';

import { useState } from 'react';

export default function ApiTestPage() {
  const [testResult, setTestResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testApiEndpoint = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/receive-data', {
        method: 'GET'
      });
      const data = await response.json();
      setTestResult(data);
    } catch (error) {
      setTestResult({ error: error instanceof Error ? error.message : 'Unknown error' });
    } finally {
      setLoading(false);
    }
  };

  const testPostData = async () => {
    setLoading(true);
    try {
      const testData = {
        user_id: 'test_user_123',
        workflow_result: 'This is a test result from Dify Workflow',
        github_url: 'https://github.com/test/repo',
        analysis_type: 'technical_homogeneity',
        metadata: {
          tokens_used: 1500,
          model: 'gpt-4'
        }
      };

      const response = await fetch('/api/receive-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testData)
      });
      const data = await response.json();
      setTestResult(data);
    } catch (error) {
      setTestResult({ error: error instanceof Error ? error.message : 'Unknown error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            API 接口测试页面
          </h1>
          <p className="text-lg text-gray-600">
            测试 Dify Workflow 到前端的数据传输
          </p>
        </div>

        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">接口信息</h2>
          <div className="space-y-2 text-sm">
            <p><strong>POST 接口:</strong> <code className="bg-gray-100 px-2 py-1 rounded">https://www.a42z.ai/api/receive-data</code></p>
            <p><strong>GET 接口:</strong> <code className="bg-gray-100 px-2 py-1 rounded">https://www.a42z.ai/api/receive-data</code></p>
            <p><strong>Content-Type:</strong> <code className="bg-gray-100 px-2 py-1 rounded">application/json</code></p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">测试 GET 请求</h3>
            <p className="text-sm text-gray-600 mb-4">
              测试接口是否可访问
            </p>
            <button
              onClick={testApiEndpoint}
              disabled={loading}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? '测试中...' : '测试 GET'}
            </button>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">测试 POST 请求</h3>
            <p className="text-sm text-gray-600 mb-4">
              模拟 Dify Workflow 发送数据
            </p>
            <button
              onClick={testPostData}
              disabled={loading}
              className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? '发送中...' : '测试 POST'}
            </button>
          </div>
        </div>

        {testResult && (
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">测试结果</h3>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
              {JSON.stringify(testResult, null, 2)}
            </pre>
          </div>
        )}

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">Dify Workflow 配置说明</h3>
          <div className="space-y-3 text-sm text-blue-800">
            <p><strong>1. HTTP 请求模块配置:</strong></p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li><strong>Method:</strong> POST</li>
              <li><strong>URL:</strong> https://www.a42z.ai/api/receive-data</li>
              <li><strong>Headers:</strong> Content-Type: application/json</li>
            </ul>
            
            <p><strong>2. Body 配置 (JSON):</strong></p>
            <pre className="bg-white p-3 rounded text-xs overflow-auto">
{`{
  "user_id": "{{user_id}}",
  "workflow_result": "{{workflow.result}}",
  "github_url": "{{github_url}}",
  "analysis_type": "technical_homogeneity",
  "metadata": {
    "tokens_used": "{{usage.total_tokens}}",
    "model": "{{model}}"
  }
}`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
} 