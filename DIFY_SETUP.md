# Dify API 集成配置

## 概述
本项目已集成Dify API，用于技术同质化分析。当用户上传GitHub仓库链接时，系统会自动调用Dify的技术同质化分析智能体workflow进行分析。

## 配置步骤

### 1. 创建环境变量文件
在项目根目录创建 `.env.local` 文件：

```bash
# Dify API Configuration
NEXT_PUBLIC_DIFY_API_URL=https://api.dify.ai/v1
NEXT_PUBLIC_DIFY_API_KEY=app-dhIC2LKWiF6txqsziyaAPvQy

# Dify Public URL (for reference)
NEXT_PUBLIC_DIFY_PUBLIC_URL=https://api.dify.ai/v1/workflows/9Eiom2dpjU9WpUI7

# Webhook Configuration
NEXT_PUBLIC_WEBHOOK_URL=http://localhost:3000/api/webhook/dify
```

### 2. API密钥已配置
✅ **API密钥**：`app-dhIC2LKWiF6txqsziyaAPvQy` 已配置完成

### 3. Webhook配置
系统已配置webhook端点，用于接收Dify的实时分析结果。

## API集成详情

### 功能特性
- ✅ **自动分析**：上传GitHub仓库时自动触发分析
- ✅ **智能提示**：使用专门的分析提示词
- ✅ **错误处理**：API失败不影响主流程
- ✅ **结果展示**：分析结果在技术同质化分析步骤中显示
- ✅ **Webhook支持**：实时接收分析结果推送

### 分析维度
Dify API会从以下维度分析GitHub仓库：
1. 技术栈的独特性
2. 架构模式的创新性
3. 代码实现的相似性
4. 与其他项目的差异化程度
5. 技术债务和可维护性

### 技术实现
- **API端点**：`https://api.dify.ai/v1/chat-messages`
- **认证方式**：Bearer Token
- **响应格式**：JSON
- **错误处理**：完整的错误捕获和日志记录
- **Webhook端点**：`/api/webhook/dify`

## Webhook配置详情

### 前端Webhook端点
系统已创建webhook端点来接收Dify的实时推送：

**端点URL**：`http://localhost:3000/api/webhook/dify`

**支持的推送类型**：
- 分析开始通知
- 分析进度更新
- 分析完成结果
- 错误状态通知

### Webhook数据结构
```json
{
  "event": "analysis_completed",
  "conversation_id": "conv_123456",
  "message_id": "msg_789012",
  "result": {
    "answer": "分析结果内容...",
    "metadata": {
      "usage": {
        "total_tokens": 1500,
        "prompt_tokens": 800,
        "completion_tokens": 700
      }
    }
  },
  "timestamp": "2025-01-20T10:30:00Z"
}
```

## 需要的信息

如果你需要配置webhook或其他高级功能，请提供以下信息：

1. **Webhook URL**：用于接收实时分析结果 ✅ 已配置
2. **API权限**：确保API密钥有足够的权限 ✅ 已验证
3. **Rate Limits**：了解API调用频率限制
4. **自定义提示词**：如果需要修改分析提示词

## 故障排除

### 常见问题
1. **API密钥无效**：检查密钥是否正确配置 ✅ 已解决
2. **网络错误**：确保能够访问 `api.dify.ai`
3. **权限不足**：确认API密钥有足够的权限
4. **Webhook失败**：检查webhook端点是否可访问

### 调试方法
1. 查看浏览器控制台的错误信息
2. 检查网络请求的响应状态
3. 验证环境变量是否正确加载
4. 监控webhook端点的访问日志

## 联系信息
如需技术支持或配置帮助，请联系开发团队。 