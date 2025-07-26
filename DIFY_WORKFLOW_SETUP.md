# Dify Workflow 配置说明

## 环境变量配置

在项目根目录创建 `.env.local` 文件，添加以下配置：

```bash
# Dify API Configuration
NEXT_PUBLIC_DIFY_API_URL=https://api.dify.ai/v1
NEXT_PUBLIC_DIFY_API_KEY=app-dhIC2LKWiF6txqsziyaAPvQy
NEXT_PUBLIC_DIFY_PUBLIC_URL=https://udify.app/chat/9Eiom2dpjU9WpUI7

# Webhook Configuration
NEXT_PUBLIC_WEBHOOK_URL=https://www.a42z.ai/api/webhook/dify

# Supabase Configuration (需要替换为实际值)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

## Dify Workflow 配置

### 1. Workflow 触发端点
- **URL**: `https://api.dify.ai/v1/workflows/trigger`
- **Method**: `POST`
- **Headers**: 
  - `Authorization: Bearer app-dhIC2LKWiF6txqsziyaAPvQy`
  - `Content-Type: application/json`

### 2. 请求体格式
```json
{
  "inputs": {
    "github_url": "https://github.com/user/repo"
  },
  "query": "分析GitHub仓库的技术同质化程度：https://github.com/user/repo",
  "response_mode": "blocking",
  "user": "a42z_judge_user"
}
```

### 3. 响应格式
```json
{
  "answer": "Dify分析结果内容",
  "conversation_id": "conv_xxx",
  "message_id": "msg_xxx",
  "metadata": {
    "usage": {
      "total_tokens": 1500,
      "prompt_tokens": 800,
      "completion_tokens": 700
    }
  }
}
```

## 前端集成

### 1. GitHub URL 上传触发
当用户上传GitHub URL时，系统会：
1. 调用 `difyAPI.analyzeGitHubRepo(githubUrl)`
2. 发送请求到Dify workflow触发端点
3. 等待分析结果返回
4. 将结果存储在 `difyAnalysis` 状态中

### 2. Technical Homeomorphism Researcher 显示
在Technical Homeomorphism Researcher步骤完成时：
1. 优先显示Dify API的分析结果
2. 如果没有Dify结果，显示数据库中的分析结果
3. 如果都没有，显示默认的分析内容

### 3. 处理流程
```
GitHub URL上传 → 触发Dify Workflow → 等待分析完成 → 显示在Technical Homeomorphism Researcher
```

## 故障排除

### 1. API调用失败
- 检查API密钥是否正确
- 确认workflow URL是否有效
- 查看浏览器控制台错误信息

### 2. 分析结果不显示
- 确认Dify workflow正常运行
- 检查网络连接
- 验证请求格式是否正确

### 3. 超时问题
- Technical Homeomorphism Researcher步骤设置了12秒的处理时间
- 如果Dify分析时间过长，可能需要调整超时设置

## 测试步骤

1. 启动开发服务器：`npm run dev`
2. 访问 http://localhost:3000/judge
3. 上传GitHub仓库链接
4. 观察Technical Homeomorphism Researcher步骤的分析结果
5. 检查浏览器控制台的API调用日志 