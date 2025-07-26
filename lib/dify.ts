// Dify API 服务
export interface DifyResponse {
  answer: string;
  conversation_id: string;
  message_id: string;
  metadata?: {
    usage?: {
      total_tokens?: number;
      prompt_tokens?: number;
      completion_tokens?: number;
    };
  };
}

export interface DifyError {
  code: string;
  message: string;
}

class DifyAPI {
  private baseURL: string;
  private apiKey: string;

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_DIFY_API_URL || 'https://api.dify.ai/v1';
    this.apiKey = process.env.NEXT_PUBLIC_DIFY_API_KEY || '';
  }

  // 只传 github_url，不需要 prompt
  async triggerWorkflowWithRepoUrl(repoUrl: string): Promise<any> {
    const response = await fetch(`${this.baseURL}/workflows/trigger`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: { github_url: repoUrl }
      }),
    });
    if (!response.ok) {
      throw new Error(await response.text());
    }
    return response.json();
  }
}

export const difyAPI = new DifyAPI(); 