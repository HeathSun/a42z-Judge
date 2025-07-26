// Dify Chatflow API 服务
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

// 定义每个评委的 API 配置
interface JudgeConfig {
  name: string;
  apiKey: string;
  description: string;
}

const JUDGE_CONFIGS: Record<string, JudgeConfig> = {
  summary: {
    name: 'Summary',
    apiKey: 'app-QpOXxX44VNrttLlryhEz8P3v',
    description: '综合分析总结'
  },
  sam: {
    name: 'Sam Altman',
    apiKey: 'app-69wonwSInJYTocYMba4OhuYo',
    description: 'Sam Altman 分析'
  },
  li: {
    name: 'Feifei Li',
    apiKey: 'app-4hLOcPEUppVshp6ErJnD8JSX',
    description: 'Feifei Li 分析'
  },
  ng: {
    name: 'Andrew Ng',
    apiKey: 'app-sorlsRwypHu0Fh67fXw47ZtV',
    description: 'Andrew Ng 分析'
  },
  paul: {
    name: 'Paul Graham',
    apiKey: 'app-1wc2KIN2OnhqxQYmDsIGgMXR',
    description: 'Paul Graham 分析'
  },
  business: {
    name: 'Business Analysis',
    apiKey: 'app-TNEgFjsjZlRSVLaMFtBOOMlr',
    description: '商业潜力分析'
  },
  receive_data: {
    name: 'Receive Data',
    apiKey: 'app-dhIC2LKWiF6txqsziyaAPvQy',
    description: '数据接收'
  }
};

class DifyAPI {
  private baseURL: string;

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_DIFY_API_URL || 'https://api.dify.ai/v1';
  }

  // 配置 webhook (placeholder)
  async configureWebhook(): Promise<boolean> {
    try {
      console.log('Dify webhook configuration successful');
      return true;
    } catch (error) {
      console.error('Failed to configure Dify webhook:', error);
      return false;
    }
  }

  // 使用 Chatflow API 发送消息到指定的评委
  async sendMessageToJudge(judgeType: string, message: string, inputs?: Record<string, unknown>): Promise<DifyResponse> {
    const judgeConfig = JUDGE_CONFIGS[judgeType];
    if (!judgeConfig) {
      throw new Error(`Unknown judge type: ${judgeType}`);
    }

    const response = await fetch(`${this.baseURL}/chat-messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${judgeConfig.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: inputs || {},
        query: message,
        response_mode: 'blocking',
        user: 'a42z_judge_user'
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Dify API Error for ${judgeType}:`, errorText);
      throw new Error(`Dify API Error: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    return result as DifyResponse;
  }

  // 技术同质化分析 (使用 receive_data 的 API key)
  async analyzeTechnicalHomogeneity(githubUrl: string): Promise<DifyResponse> {
    return this.sendMessageToJudge('receive_data', 
      `请分析这个 GitHub 仓库的技术同质化程度：${githubUrl}`, 
      { github_url: githubUrl }
    );
  }

  // 商业潜力分析
  async analyzeBusinessPotential(githubUrl: string): Promise<DifyResponse> {
    return this.sendMessageToJudge('business', 
      `请分析这个项目的商业潜力：${githubUrl}`, 
      { github_url: githubUrl }
    );
  }

  // Sam Altman 分析
  async getSamAnalysis(githubUrl: string): Promise<DifyResponse> {
    return this.sendMessageToJudge('sam', 
      `请从 Sam Altman 的角度分析这个项目：${githubUrl}`, 
      { github_url: githubUrl }
    );
  }

  // Feifei Li 分析
  async getLiAnalysis(githubUrl: string): Promise<DifyResponse> {
    return this.sendMessageToJudge('li', 
      `请从 Feifei Li 的角度分析这个项目：${githubUrl}`, 
      { github_url: githubUrl }
    );
  }

  // Andrew Ng 分析
  async getNgAnalysis(githubUrl: string): Promise<DifyResponse> {
    return this.sendMessageToJudge('ng', 
      `请从 Andrew Ng 的角度分析这个项目：${githubUrl}`, 
      { github_url: githubUrl }
    );
  }

  // Paul Graham 分析
  async getPaulAnalysis(githubUrl: string): Promise<DifyResponse> {
    return this.sendMessageToJudge('paul', 
      `请从 Paul Graham 的角度分析这个项目：${githubUrl}`, 
      { github_url: githubUrl }
    );
  }

  // 综合分析总结
  async getSummaryAnalysis(githubUrl: string): Promise<DifyResponse> {
    return this.sendMessageToJudge('summary', 
      `请对这个项目进行综合分析总结：${githubUrl}`, 
      { github_url: githubUrl }
    );
  }

  // 获取所有评委配置
  getJudgeConfigs(): Record<string, JudgeConfig> {
    return JUDGE_CONFIGS;
  }

  // 获取特定评委配置
  getJudgeConfig(judgeType: string): JudgeConfig | null {
    return JUDGE_CONFIGS[judgeType] || null;
  }
}

export const difyAPI = new DifyAPI(); 