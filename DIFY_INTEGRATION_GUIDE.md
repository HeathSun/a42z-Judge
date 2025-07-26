# Dify 集成完整指南

## 概述

本指南将帮助你完成从 GitHub 链接上传到代码同质化分析的完整流程，包括 Dify 工作流配置、webhook 设置、数据库存储和前端展示。

## 1. Dify Workflow 配置

你已经在 Dify 后台（如 https://cloud.dify.ai/app/5ea00e48-8d67-4b22-922e-7d4a833a37ba/develop）配置好了 workflow，只需要前端传入 `repo_url`。

- **Workflow 触发 API**:  
  `POST https://api.dify.ai/v1/workflows/trigger`
- **Headers**:  
  `Authorization: Bearer <你的 Dify API Key>`  
  `Content-Type: application/json`
- **Body**:
  ```json
  {
    "inputs": {
      "repo_url": "https://github.com/xxx/yyy"
    }
  }
  ```

---

## 2. 前端代码修改（核心部分）

### 2.1 修改 Dify API 封装

**lib/dify.ts**  
只保留最简触发 workflow 的方法：

```ts
class DifyAPI {
  private baseURL: string;
  private apiKey: string;

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_DIFY_API_URL || 'https://api.dify.ai/v1';
    this.apiKey = process.env.NEXT_PUBLIC_DIFY_API_KEY || '';
  }

  // 只传 repo_url，不需要 prompt
  async triggerWorkflowWithRepoUrl(repoUrl: string): Promise<any> {
    const response = await fetch(`${this.baseURL}/workflows/trigger`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: { repo_url: repoUrl }
      }),
    });
    if (!response.ok) {
      throw new Error(await response.text());
    }
    return response.json();
  }
}

export const difyAPI = new DifyAPI();
```

---

### 2.2 前端上传时直接调用

**app/judge/page.tsx**  
在上传 GitHub URL 后，直接调用上面的方法：

```ts
const handleFileUpload = async (file: File | string, type: UploadedFile["type"]) => {
  // ...省略上传逻辑
  if (type === "github" && typeof file === "string") {
    try {
      setIsAnalyzingWithDify(true);
      // 只传 repo_url，不需要 prompt
      const result = await difyAPI.triggerWorkflowWithRepoUrl(file);
      setDifyAnalysis(result); // 这里 result.answer 就是分析结果
    } catch (error) {
      // 错误处理
    } finally {
      setIsAnalyzingWithDify(false);
    }
  }
};
```

---

### 2.3 Technical Homeomorphism Researcher 显示结果

**getStepContent** 只需这样：

```ts
const getStepContent = (stepId: string): string => {
  if (stepId === "technical-research") {
    if (difyAnalysis?.answer) return difyAnalysis.answer;
    return "Waiting for Dify analysis...";
  }
  // 其他步骤...
};
```

---

## 3. 环境变量配置

`.env.local`（或 Vercel 环境变量）

```
NEXT_PUBLIC_DIFY_API_URL=https://api.dify.ai/v1
NEXT_PUBLIC_DIFY_API_KEY=你的Dify密钥
```

---

## 4. 测试流程

1. 启动前端 (`npm run dev`)
2. 上传 GitHub Repo URL
3. 观察 Technical Homeomorphism Researcher 卡片下方出现 Dify 返回的分析结果

---

## 5. 你不需要做的事

- **不需要 prompt**，Dify workflow 里只要有 repo_url 输入即可
- **不需要 webhook**，直接用 blocking 模式拿结果
- **不需要复杂的输入映射**，只要前端传 url

---

## 6. 参考文档

- [Dify API 官方文档](https://cloud.dify.ai/app/5ea00e48-8d67-4b22-922e-7d4a833a37ba/develop)
- [Next.js 环境变量配置](https://nextjs.org/docs/app/api-reference/config/typescript)
- [no-explicit-any ESLint 说明](https://go.lightnode.com/nextjs/no-explicit-any)

---

如需完整代码片段或遇到任何报错，随时贴出来我帮你修！ 