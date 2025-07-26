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

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_DIFY_API_URL || 'https://api.dify.ai/v1';
    this.apiKey = process.env.NEXT_PUBLIC_DIFY_API_KEY || '';
    this.webhookURL = process.env.NEXT_PUBLIC_WEBHOOK_URL || 'http://localhost:3000/api/webhook/dify';
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

  // 分析GitHub仓库
  async analyzeGitHubRepo(repoUrl: string): Promise<DifyResponse> {
    const message = `请分析这个GitHub仓库的技术同质化程度：${repoUrl}。请从以下方面进行分析：
1. 技术栈的独特性
2. 架构模式的创新性
3. 代码实现的相似性
4. 与其他项目的差异化程度
5. 技术债务和可维护性
请给出详细的分析报告和评分。`;

    return this.sendMessage(message);
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