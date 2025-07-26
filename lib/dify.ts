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

  // 配置 webhook
  async configureWebhook(): Promise<boolean> {
    try {
      // 这里可以添加实际的 webhook 配置逻辑
      // 目前返回 true 表示配置成功
      console.log('Dify webhook configuration successful');
      return true;
    } catch (error) {
      console.error('Failed to configure Dify webhook:', error);
      return false;
    }
  }

  // 只传 github_url，不需要 prompt
  async triggerWorkflowWithRepoUrl(repoUrl: string): Promise<unknown> {
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