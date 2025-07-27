# Dify 模型凭据配置指南

## 问题描述

你遇到的错误信息：
```
"Run failed: Model chatgpt-4o-latest credentials is not initialized."
"Run failed: Model gpt-4 credentials is not initialized."
```

这表明在 Dify 工作区中，GPT-4 和 ChatGPT-4o-latest 模型的 API 密钥没有正确配置。

## 解决方案

### 1. 登录 Dify 工作区

访问你的 Dify 工作区：
- 主工作区：https://cloud.dify.ai/app/5ea00e48-8d67-4b22-922e-7d4a833a37ba/develop
- 或者访问各个评委应用的工作区

### 2. 配置模型凭据

对于每个评委应用，需要配置相应的模型凭据：

#### 2.1 Technical Analysis (receive_data)
- **应用 ID**: `app-dhIC2LKWiF6txqsziyaAPvQy`
- **使用模型**: `chatgpt-4o-latest`
- **配置步骤**:
  1. 进入应用设置
  2. 找到 "Model Configuration" 或 "模型配置"
  3. 选择 `chatgpt-4o-latest` 模型
  4. 输入你的 OpenAI API 密钥
  5. 保存配置

#### 2.2 Business Analysis (business)
- **应用 ID**: `app-TNEgFjsjZlRSVLaMFtBOOMlr`
- **使用模型**: `gpt-4`
- **配置步骤**: 同上，但选择 `gpt-4` 模型

#### 2.3 Sam Altman (sam)
- **应用 ID**: `app-69wonwSInJYTocYMba4OhuYo`
- **使用模型**: `gpt-4`
- **配置步骤**: 同上

#### 2.4 Feifei Li (li)
- **应用 ID**: `app-4hLOcPEUppVshp6ErJnD8JSX`
- **使用模型**: `gpt-4`
- **配置步骤**: 同上

#### 2.5 Andrew Ng (ng)
- **应用 ID**: `app-sorlsRwypHu0Fh67fXw47ZtV`
- **使用模型**: `gpt-4`
- **配置步骤**: 同上

#### 2.6 Paul Graham (paul)
- **应用 ID**: `app-1wc2KIN2OnhqxQYmDsIGgMXR`
- **使用模型**: `gpt-4`
- **配置步骤**: 同上

### 3. 获取 OpenAI API 密钥

如果你还没有 OpenAI API 密钥：

1. 访问 https://platform.openai.com/api-keys
2. 登录你的 OpenAI 账户
3. 点击 "Create new secret key"
4. 复制生成的密钥（注意：密钥只显示一次）

### 4. 验证配置

配置完成后，你可以通过以下方式验证：

1. 在 Dify 工作区中测试对话
2. 检查模型状态是否显示为 "Active" 或 "已激活"
3. 尝试发送测试消息

### 5. 常见问题

#### 5.1 API 密钥无效
- 确保密钥格式正确（以 `sk-` 开头）
- 检查密钥是否已过期
- 确认账户有足够的余额

#### 5.2 模型不可用
- 某些模型可能需要特定的 OpenAI 计划
- 检查你的 OpenAI 账户是否有访问权限

#### 5.3 配额限制
- 检查 OpenAI 账户的使用配额
- 考虑升级计划或等待配额重置

### 6. 测试步骤

配置完成后，按以下步骤测试：

1. 重启你的 Next.js 应用
2. 访问评委页面
3. 上传一个 GitHub 仓库链接
4. 观察是否还有错误信息
5. 检查控制台是否显示成功响应

### 7. 备用方案

如果配置模型凭据有困难，可以考虑：

1. **使用免费模型**: 将模型改为 `gpt-3.5-turbo`
2. **使用其他提供商**: 配置 Anthropic Claude 或其他支持的模型
3. **简化测试**: 先配置一个评委应用进行测试

## 联系支持

如果按照以上步骤仍然无法解决问题，请：

1. 检查 Dify 官方文档
2. 联系 Dify 技术支持
3. 在 Dify 社区论坛寻求帮助

---

**注意**: 确保你的 OpenAI API 密钥安全，不要将其提交到版本控制系统中。 