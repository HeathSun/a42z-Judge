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
  private webhookURL: string;
  private publicURL: string;

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_DIFY_API_URL || 'https://api.dify.ai/v1';
    this.apiKey = process.env.NEXT_PUBLIC_DIFY_API_KEY || '';
    this.webhookURL = process.env.NEXT_PUBLIC_WEBHOOK_URL || 'http://localhost:3000/api/webhook/dify';
    this.publicURL = process.env.NEXT_PUBLIC_DIFY_PUBLIC_URL || 'https://udify.app/chat/9Eiom2dpjU9WpUI7';
  }

  // 发送消息到Dify workflow
  async sendMessage(
    message: string,
    conversationId?: string,
    user?: string
  ): Promise<DifyResponse> {
    try {
      const response = await fetch(`${this.baseURL}/chat-messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: {},
          query: message,
          response_mode: 'streaming',
          conversation_id: conversationId,
          user: user || 'default_user',
        }),
      });

      if (!response.ok) {
        const errorData: DifyError = await response.json();
        throw new Error(`Dify API Error: ${errorData.message || response.statusText}`);
      }

      const data: DifyResponse = await response.json();
      return data;
    } catch (error) {
      console.error('Dify API Error:', error);
      throw error;
    }
  }

  // 分析GitHub仓库 - 触发workflow
  async analyzeGitHubRepo(repoUrl: string): Promise<DifyResponse> {
    try {
      // 使用workflow触发端点
      const response = await fetch(`${this.baseURL}/workflows/trigger`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: {
            github_url: repoUrl
          },
          query: `分析GitHub仓库的技术同质化程度：${repoUrl}`,
          response_mode: 'blocking',
          user: 'a42z_judge_user'
        }),
      });

      if (!response.ok) {
        const errorData: DifyError = await response.json();
        throw new Error(`Dify Workflow Error: ${errorData.message || response.statusText}`);
      }

      const data: DifyResponse = await response.json();
      return data;
    } catch (error) {
      console.error('Dify Workflow Error:', error);
      throw error;
    }
  }

  // 配置webhook
  async configureWebhook(webhookUrl?: string): Promise<boolean> {
    try {
      const url = webhookUrl || this.webhookURL;
      
      const response = await fetch(`${this.baseURL}/webhooks`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: url,
          events: ['analysis_started', 'analysis_progress', 'analysis_completed', 'analysis_error'],
          description: 'a42z Judge - Technical Homogeneity Analysis Webhook'
        }),
      });

      if (!response.ok) {
        console.error('Failed to configure webhook:', response.statusText);
        return false;
      }

      console.log('Webhook configured successfully:', url);
      return true;
    } catch (error) {
      console.error('Error configuring webhook:', error);
      return false;
    }
  }

  // 获取webhook配置
  async getWebhookConfig(): Promise<unknown> {
    try {
      const response = await fetch(`${this.baseURL}/webhooks`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to get webhook config: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error getting webhook config:', error);
      throw error;
    }
  }

  // 获取对话历史
  async getConversationHistory(conversationId: string): Promise<DifyResponse[]> {
    try {
      const response = await fetch(`${this.baseURL}/conversations/${conversationId}/messages`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch conversation history: ${response.statusText}`);
      }

      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Error fetching conversation history:', error);
      throw error;
    }
  }
}

export const difyAPI = new DifyAPI(); 