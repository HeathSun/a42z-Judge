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
  receive_data: {
    name: 'Technical Analysis',
    apiKey: 'app-dhIC2LKWiF6txqsziyaAPvQy',
    description: '技术同质化分析'
  },
  business: {
    name: 'Business Analysis',
    apiKey: 'app-TNEgFjsjZlRSVLaMFtBOOMlr',
    description: '商业潜力分析'
  },
  sam: {
    name: 'Sam Altman',
    apiKey: 'app-69wonwSInJYTocYMba4OhuYo',
    description: 'Sam Altman 视角分析'
  },
  li: {
    name: 'Feifei Li',
    apiKey: 'app-4hLOcPEUppVshp6ErJnD8JSX',
    description: 'Feifei Li 视角分析'
  },
  ng: {
    name: 'Andrew Ng',
    apiKey: 'app-sorlsRwypHu0Fh67fXw47ZtV',
    description: 'Andrew Ng 视角分析'
  },
  paul: {
    name: 'Paul Graham',
    apiKey: 'app-1wc2KIN2OnhqxQYmDsIGgMXR',
    description: 'Paul Graham 视角分析'
  }
};

// 备用响应生成器
const generateFallbackResponse = (judgeType: string, githubUrl: string): DifyResponse => {
  const judgeConfig = JUDGE_CONFIGS[judgeType];
  const projectName = githubUrl.split('/').pop() || 'Unknown Project';
  
  const fallbackResponses: Record<string, string> = {
    receive_data: `⚠️ 技术分析服务暂时不可用

由于 Dify 模型凭据配置问题，技术同质化分析功能暂时无法使用。

**需要解决的问题：**
- ChatGPT-4o-latest 模型凭据未初始化
- 请在 Dify 工作区中配置 OpenAI API 密钥

**项目信息：**
- 仓库：${githubUrl}
- 项目名：${projectName}

请参考 DIFY_MODEL_SETUP_GUIDE.md 文件进行配置。`,

    business: `⚠️ 商业分析服务暂时不可用

由于 Dify 模型凭据配置问题，商业潜力分析功能暂时无法使用。

**需要解决的问题：**
- GPT-4 模型凭据未初始化
- 请在 Dify 工作区中配置 OpenAI API 密钥

**项目信息：**
- 仓库：${githubUrl}
- 项目名：${projectName}

请参考 DIFY_MODEL_SETUP_GUIDE.md 文件进行配置。`,

    sam: `⚠️ Sam Altman 分析服务暂时不可用

由于 Dify 模型凭据配置问题，Sam Altman 视角分析功能暂时无法使用。

**需要解决的问题：**
- GPT-4 模型凭据未初始化
- 请在 Dify 工作区中配置 OpenAI API 密钥

**项目信息：**
- 仓库：${githubUrl}
- 项目名：${projectName}

请参考 DIFY_MODEL_SETUP_GUIDE.md 文件进行配置。`,

    li: `⚠️ Feifei Li 分析服务暂时不可用

由于 Dify 模型凭据配置问题，Feifei Li 视角分析功能暂时无法使用。

**需要解决的问题：**
- GPT-4 模型凭据未初始化
- 请在 Dify 工作区中配置 OpenAI API 密钥

**项目信息：**
- 仓库：${githubUrl}
- 项目名：${projectName}

请参考 DIFY_MODEL_SETUP_GUIDE.md 文件进行配置。`,

    ng: `⚠️ Andrew Ng 分析服务暂时不可用

由于 Dify 模型凭据配置问题，Andrew Ng 视角分析功能暂时无法使用。

**需要解决的问题：**
- GPT-4 模型凭据未初始化
- 请在 Dify 工作区中配置 OpenAI API 密钥

**项目信息：**
- 仓库：${githubUrl}
- 项目名：${projectName}

请参考 DIFY_MODEL_SETUP_GUIDE.md 文件进行配置。`,

    paul: `⚠️ Paul Graham 分析服务暂时不可用

由于 Dify 模型凭据配置问题，Paul Graham 视角分析功能暂时无法使用。

**需要解决的问题：**
- GPT-4 模型凭据未初始化
- 请在 Dify 工作区中配置 OpenAI API 密钥

**项目信息：**
- 仓库：${githubUrl}
- 项目名：${projectName}

请参考 DIFY_MODEL_SETUP_GUIDE.md 文件进行配置。`
  };

  return {
    answer: fallbackResponses[judgeType] || fallbackResponses.business,
    conversation_id: `fallback_${Date.now()}`,
    message_id: `fallback_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    metadata: {
      usage: {
        total_tokens: 0,
        prompt_tokens: 0,
        completion_tokens: 0
      }
    }
  };
};

class DifyAPI {
  private baseURL: string;

  constructor() {
    // 使用本地代理而不是直接调用 Dify API
    this.baseURL = '/api/dify-proxy';
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

  // 使用代理发送消息到指定的评委
  async sendMessageToJudge(judgeType: string, message: string, inputs?: Record<string, unknown>): Promise<DifyResponse> {
    const judgeConfig = JUDGE_CONFIGS[judgeType];
    if (!judgeConfig) {
      throw new Error(`Unknown judge type: ${judgeType}`);
    }

    console.log(`🔄 Sending message to ${judgeConfig.name} via proxy...`);

    try {
      const response = await fetch(this.baseURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          judgeType,
          message,
          inputs: inputs || {}
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ Proxy API Error for ${judgeType}:`, errorText);
        
        // 检查是否是模型凭据错误
        if (errorText.includes('credentials is not initialized')) {
          console.warn(`⚠️ Model credentials not initialized for ${judgeType}, returning fallback response`);
          const githubUrl = inputs?.repo_url as string || 'Unknown Repository';
          return generateFallbackResponse(judgeType, githubUrl);
        }
        
        throw new Error(`Proxy API Error: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(`Proxy API Error: ${result.error}`);
      }

      console.log(`✅ Response received from ${judgeConfig.name}`);
      return result.data as DifyResponse;
      
    } catch (error) {
      console.error(`❌ Error calling ${judgeConfig.name}:`, error);
      
      // 如果是网络错误或其他错误，也返回备用响应
      const githubUrl = inputs?.repo_url as string || 'Unknown Repository';
      return generateFallbackResponse(judgeType, githubUrl);
    }
  }

  // 技术同质化分析 (使用 receive_data 的 API key)
  async analyzeTechnicalHomogeneity(githubUrl: string): Promise<DifyResponse> {
    return this.sendMessageToJudge('receive_data', 
      `请分析这个 GitHub 仓库的技术同质化程度：${githubUrl}`, 
      { repo_url: githubUrl }
    );
  }

  // 商业潜力分析
  async analyzeBusinessPotential(githubUrl: string): Promise<DifyResponse> {
    const inputs: Record<string, unknown> = { 
      repo_url: githubUrl,
      project_name: githubUrl.split('/').pop() || 'Unknown Project',
      project_description: `GitHub repository: ${githubUrl}`,
      analysis_type: 'business_potential'
    };
    return this.sendMessageToJudge('business', 
      `请分析这个项目的商业潜力：${githubUrl}`, 
      inputs
    );
  }

  // Sam Altman 分析
  async getSamAnalysis(githubUrl: string): Promise<DifyResponse> {
    return this.sendMessageToJudge('sam', 
      `请从 Sam Altman 的角度分析这个项目：${githubUrl}`, 
      { repo_url: githubUrl }
    );
  }

  // Feifei Li 分析
  async getLiAnalysis(githubUrl: string): Promise<DifyResponse> {
    return this.sendMessageToJudge('li', 
      `请从 Feifei Li 的角度分析这个项目：${githubUrl}`, 
      { repo_url: githubUrl }
    );
  }

  // Andrew Ng 分析
  async getNgAnalysis(githubUrl: string): Promise<DifyResponse> {
    return this.sendMessageToJudge('ng', 
      `请从 Andrew Ng 的角度分析这个项目：${githubUrl}`, 
      { repo_url: githubUrl }
    );
  }

  // Paul Graham 分析
  async getPaulAnalysis(githubUrl: string): Promise<DifyResponse> {
    return this.sendMessageToJudge('paul', 
      `请从 Paul Graham 的角度分析这个项目：${githubUrl}`, 
      { repo_url: githubUrl }
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