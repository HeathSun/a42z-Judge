'use client';

import { useState } from 'react';
import { difyAPI } from '@/lib/dify';

export default function DifyTestPage() {
  const [testResults, setTestResults] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [githubUrl, setGithubUrl] = useState('https://github.com/facebook/react');

  const testDifyWorkflow = async () => {
    setLoading(true);
    setTestResults('Testing Dify Workflow...\n');
    
    try {
      console.log('Testing with GitHub URL:', githubUrl);
      const result = await difyAPI.triggerWorkflowWithRepoUrl(githubUrl);
      
      setTestResults(prev => prev + `✅ Success!\n\nResponse:\n${JSON.stringify(result, null, 2)}`);
      console.log('Dify API Response:', result);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setTestResults(prev => prev + `❌ Error: ${errorMessage}\n`);
      console.error('Dify API Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const testAllWorkflows = async () => {
    setLoading(true);
    setTestResults('Testing all Dify Workflows...\n');
    
    const workflows = [
      { name: 'GitHub Analysis', method: () => difyAPI.triggerWorkflowWithRepoUrl(githubUrl) },
      { name: 'Business Analysis', method: () => difyAPI.triggerBusinessAnalysis(githubUrl) },
      { name: 'Sam Analysis', method: () => difyAPI.triggerSamAnalysis(githubUrl) },
      { name: 'Li Analysis', method: () => difyAPI.triggerLiAnalysis(githubUrl) },
      { name: 'Ng Analysis', method: () => difyAPI.triggerNgAnalysis(githubUrl) },
      { name: 'Paul Analysis', method: () => difyAPI.triggerPaulAnalysis(githubUrl) },
      { name: 'Summary Analysis', method: () => difyAPI.triggerSummaryAnalysis(githubUrl) }
    ];

    for (const workflow of workflows) {
      try {
        setTestResults(prev => prev + `\n🔄 Testing ${workflow.name}...\n`);
        const result = await workflow.method();
        setTestResults(prev => prev + `✅ ${workflow.name} Success!\n`);
        console.log(`${workflow.name} Response:`, result);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        setTestResults(prev => prev + `❌ ${workflow.name} Error: ${errorMessage}\n`);
        console.error(`${workflow.name} Error:`, error);
      }
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Dify Workflow API 测试
          </h1>
          <p className="text-lg text-gray-600">
            测试 Dify Workflow API 调用
          </p>
        </div>

        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">测试配置</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                GitHub URL:
              </label>
              <input
                type="text"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://github.com/facebook/react"
              />
            </div>

            <div className="flex space-x-4">
              <button
                onClick={testDifyWorkflow}
                disabled={loading}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? '测试中...' : '测试 GitHub 分析'}
              </button>
              
              <button
                onClick={testAllWorkflows}
                disabled={loading}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
              >
                {loading ? '测试中...' : '测试所有 Workflow'}
              </button>
            </div>
          </div>
        </div>

        {testResults && (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">测试结果</h2>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto max-h-96 whitespace-pre-wrap">
              {testResults}
            </pre>
          </div>
        )}

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">说明</h3>
          <div className="space-y-2 text-sm text-blue-800">
            <p><strong>GitHub 分析:</strong> 使用 retrieveData workflow 分析 GitHub 代码</p>
            <p><strong>商业分析:</strong> 使用 business workflow 分析商业潜力</p>
            <p><strong>专家分析:</strong> 使用不同的专家 workflow 进行分析</p>
            <p><strong>注意:</strong> 确保环境变量配置正确</p>
          </div>
        </div>
      </div>
    </div>
  );
} 