# Dify 集成完整指南

## 概述

本指南将帮助你完成从 GitHub 链接上传到代码同质化分析的完整流程，包括 Dify 工作流配置、webhook 设置、数据库存储和前端展示。

## 1. Dify 工作流配置

### 1.1 访问 Dify 工作流
1. 登录 [Dify Cloud](https://cloud.dify.ai/)
2. 进入你的工作流：https://cloud.dify.ai/app/5ea00e48-8d67-4b22-922e-7d4a833a37ba/develop

### 1.2 配置 HTTP Request 工具
在你的 Dify 工作流中添加 HTTP Request 工具，配置如下：

**基本设置：**
- **Method**: `POST`
- **URL**: `https://www.a42z.ai/api/webhook/dify`
- **Headers**: 
  - `Content-Type: application/json`
  - `X-Dify-Signature: your_webhook_secret` (可选)

**Body (JSON):**
```json
{
  "event": "analysis_completed",
  "conversation_id": "{{conversation_id}}",
  "message_id": "{{message_id}}",
  "github_url": "{{github_repo_url}}",
  "user_email": "{{user_email}}",
  "result": {
    "answer": "{{llm_output}}",
    "metadata": {
      "usage": {
        "total_tokens": "{{token_count}}",
        "prompt_tokens": "{{prompt_tokens}}",
        "completion_tokens": "{{completion_tokens}}"
      }
    }
  },
  "timestamp": "{{timestamp}}"
}
```

### 1.3 工作流逻辑
1. **输入**: GitHub 仓库 URL
2. **处理**: LLM 分析代码同质化
3. **输出**: 通过 HTTP Request 推送到前端

## 2. 前端项目配置

### 2.1 环境变量设置
在 `.env.local` 文件中添加：

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Dify Configuration
NEXT_PUBLIC_DIFY_API_URL=https://api.dify.ai/v1
NEXT_PUBLIC_DIFY_API_KEY=app-dhIC2LKWiF6txqsziyaAPvQy
NEXT_PUBLIC_WEBHOOK_URL=https://www.a42z.ai/api/webhook/dify
```

### 2.2 Webhook 端点
确保 `/app/api/webhook/dify/route.ts` 文件存在并正确配置。

### 2.3 数据库集成
确保 Supabase 数据库表已创建（参考 `SUPABASE_SETUP.md`）。

## 3. 完整流程

### 3.1 用户操作流程
1. 用户访问 https://www.a42z.ai/judge
2. 上传 GitHub 仓库链接
3. 系统自动调用 Dify API 进行分析
4. Dify 通过 webhook 推送结果到前端
5. 前端将结果存储到 Supabase 数据库
6. 在 Technical Homeomorphism Researcher 步骤中显示分析结果

### 3.2 技术流程
```
GitHub URL → Dify API → LLM Analysis → Webhook → Frontend → Database → UI Display
```

## 4. 测试步骤

### 4.1 本地测试
1. 启动开发服务器：`npm run dev`
2. 访问 http://localhost:3000/judge
3. 上传 GitHub 链接测试

### 4.2 生产环境测试
1. 确保 https://www.a42z.ai/api/webhook/dify 可访问
2. 在 Dify 中测试 webhook 连接
3. 上传 GitHub 链接验证完整流程

## 5. 故障排除

### 5.1 常见问题

**Webhook 连接失败：**
- 检查 URL 是否正确：`https://www.a42z.ai/api/webhook/dify`
- 确认前端服务正常运行
- 检查防火墙和 CORS 设置

**数据库存储失败：**
- 验证 Supabase 连接配置
- 检查表结构和权限设置
- 查看浏览器控制台错误信息

**分析结果不显示：**
- 检查 Dify API 调用是否成功
- 验证 webhook 数据格式
- 确认数据库查询逻辑

### 5.2 调试方法

**查看日志：**
- 前端控制台：查看 API 调用和错误信息
- Vercel 日志：查看生产环境错误
- Supabase 日志：查看数据库操作

**测试端点：**
```bash
# 测试 webhook 端点
curl -X GET https://www.a42z.ai/api/webhook/dify

# 测试 Dify API
curl -X POST https://api.dify.ai/v1/chat-messages \
  -H "Authorization: Bearer app-dhIC2LKWiF6txqsziyaAPvQy" \
  -H "Content-Type: application/json" \
  -d '{"inputs":{},"query":"test","response_mode":"blocking","user":"user"}'
```

## 6. 监控和维护

### 6.1 性能监控
- 监控 webhook 响应时间
- 跟踪数据库查询性能
- 观察 Dify API 调用频率

### 6.2 数据备份
- 定期备份 Supabase 数据
- 监控存储空间使用情况
- 设置数据保留策略

### 6.3 安全考虑
- 验证 webhook 签名
- 限制 API 调用频率
- 保护用户隐私数据

## 7. 扩展功能

### 7.1 实时更新
- 使用 WebSocket 或 Server-Sent Events
- 实现分析进度实时显示
- 添加通知功能

### 7.2 多语言支持
- 支持中英文分析结果
- 国际化界面显示
- 多语言评委评论

### 7.3 高级分析
- 集成更多 AI 模型
- 添加代码质量分析
- 实现对比分析功能

## 8. 联系支持

如遇到问题，请：
1. 查看本文档的故障排除部分
2. 检查相关服务的状态页面
3. 联系技术支持团队

---

**最后更新**: 2025-01-20
**版本**: 1.0.0 