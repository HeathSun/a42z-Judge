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

// Workflow ID 配置
const WORKFLOW_IDS = {
  summary: 'app-QpOXxX44VNrttLlryhEz8P3v',
  sam: 'app-69wonwSInJYTocYMba4OhuYo',
  li: 'app-4hLOcPEUppVshp6ErJnD8JSX',
  ng: 'app-sorlsRwypHu0Fh67fXw47ZtV',
  paul: 'app-1wc2KIN2OnhqxQYmDsIGgMXR',
  business: 'app-TNEgFjsjZlRSVLaMFtBOOMlr',
  retrieveData: 'app-dhIC2LKWiF6txqsziyaAPvQy'
} as const;

type WorkflowType = keyof typeof WORKFLOW_IDS;

class DifyAPI {
  private baseURL: string;
  private apiKey: string;

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_DIFY_API_URL || 'https://api.dify.ai/v1';
    this.apiKey = process.env.NEXT_PUBLIC_DIFY_API_KEY || 'app-dhIC2LKWi6txqsziyaAPvQy';
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

  // 通用 Workflow 触发方法
  private async triggerWorkflow(workflowType: WorkflowType, inputs: Record<string, any>): Promise<DifyResponse> {
    const workflowId = WORKFLOW_IDS[workflowType];
    const response = await fetch(`${this.baseURL}/workflows/${workflowId}/run`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ inputs }),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Dify API Error (${workflowType}):`, errorText);
      throw new Error(`Dify API Error: ${response.status} - ${errorText}`);
    }
    
    const result = await response.json();
    return result as DifyResponse;
  }

  // GitHub 代码分析 (使用 retrieveData workflow)
  async triggerWorkflowWithRepoUrl(repoUrl: string): Promise<DifyResponse> {
    return this.triggerWorkflow('retrieveData', { github_url: repoUrl });
  }

  // PDF 分析 (使用 summary workflow)
  async triggerWorkflowWithPdf(pdfUrl: string): Promise<DifyResponse> {
    return this.triggerWorkflow('summary', { pdf_url: pdfUrl });
  }

  // 商业分析
  async triggerBusinessAnalysis(githubUrl: string): Promise<DifyResponse> {
    return this.triggerWorkflow('business', { github_url: githubUrl });
  }

  // Sam Altman 分析
  async triggerSamAnalysis(githubUrl: string): Promise<DifyResponse> {
    return this.triggerWorkflow('sam', { github_url: githubUrl });
  }

  // Feifei Li 分析
  async triggerLiAnalysis(githubUrl: string): Promise<DifyResponse> {
    return this.triggerWorkflow('li', { github_url: githubUrl });
  }

  // Andrew Ng 分析
  async triggerNgAnalysis(githubUrl: string): Promise<DifyResponse> {
    return this.triggerWorkflow('ng', { github_url: githubUrl });
  }

  // Paul Graham 分析
  async triggerPaulAnalysis(githubUrl: string): Promise<DifyResponse> {
    return this.triggerWorkflow('paul', { github_url: githubUrl });
  }

  // 综合分析
  async triggerSummaryAnalysis(githubUrl: string): Promise<DifyResponse> {
    return this.triggerWorkflow('summary', { github_url: githubUrl });
  }
}

export const difyAPI = new DifyAPI(); 