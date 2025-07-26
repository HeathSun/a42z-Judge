'use client';

import { useState } from 'react';

export default function AgentTestPage() {
  const [testResult, setTestResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testAllAgents = async () => {
    setLoading(true);
    try {
      const testData = {
        repo_url: 'https://github.com/test/repo',
        repo_pdf: 'https://cslplhzfcfvzsivsgrpc.supabase.co/storage/v1/object/public/pdf/test@gmail.com.pdf',
        user_id: 'test_user'
      };

      const agents = [
        {
          id: 'receive-data',
          endpoint: '/api/receive-data',
          inputs: { repo_url: testData.repo_url }
        },
        {
          id: 'business',
          endpoint: '/api/business',
          inputs: { repo_url: testData.repo_url }
        },
        {
          id: 'summary',
          endpoint: '/api/summary',
          inputs: { repo_pdf: testData.repo_pdf }
        },
        {
          id: 'li',
          endpoint: '/api/li',
          inputs: { repo_url: testData.repo_url, repo_pdf: testData.repo_pdf }
        },
        {
          id: 'paul',
          endpoint: '/api/paul',
          inputs: { repo_url: testData.repo_url, repo_pdf: testData.repo_pdf }
        },
        {
          id: 'ng',
          endpoint: '/api/ng',
          inputs: { repo_url: testData.repo_url, repo_pdf: testData.repo_pdf }
        },
        {
          id: 'sam',
          endpoint: '/api/sam',
          inputs: { repo_url: testData.repo_url, repo_pdf: testData.repo_pdf }
        }
      ];

      const results = await Promise.allSettled(
        agents.map(async (agent) => {
          const response = await fetch(agent.endpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              ...agent.inputs,
              user_id: testData.user_id
            }),
          });

          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }

          const result = await response.json();
          return { agentId: agent.id, success: true, result };
        })
      );

      setTestResult({
        agents: agents.map((agent, index) => ({
          ...agent,
          result: results[index]
        }))
      });

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
            Agent Test Page
          </h1>
          <p className="text-lg text-gray-600">
            Test all AI agents with sample data
          </p>
        </div>

        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Test Configuration</h2>
          <div className="space-y-2 text-sm">
            <p><strong>Repo URL:</strong> https://github.com/test/repo</p>
            <p><strong>PDF URL:</strong> https://cslplhzfcfvzsivsgrpc.supabase.co/storage/v1/object/public/pdf/test@gmail.com.pdf</p>
            <p><strong>User ID:</strong> test_user</p>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold mb-4">Test All Agents</h3>
          <button
            onClick={testAllAgents}
            disabled={loading}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test All Agents'}
          </button>
        </div>

        {testResult && (
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Test Results</h3>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto max-h-96">
              {JSON.stringify(testResult, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
} 