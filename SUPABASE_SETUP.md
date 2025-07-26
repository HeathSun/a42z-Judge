# Supabase 数据库配置

## 数据库表结构

### 1. judge_comments 表（评委评论表）

```sql
-- 创建评委评论表
CREATE TABLE judge_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- 基础信息
  conversation_id TEXT NOT NULL,
  github_repo_url TEXT NOT NULL,
  gmail TEXT NOT NULL,
  
  -- 分析结果
  analysis_result TEXT,
  analysis_metadata JSONB,
  
  -- 评委评论（中英文）
  comment_cn_ng TEXT,
  comment_en_ng TEXT,
  comment_cn_paul TEXT,
  comment_en_paul TEXT,
  comment_cn_li TEXT,
  comment_en_li TEXT,
  comment_cn_sam TEXT,
  comment_en_sam TEXT,
  
  -- 时间戳
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引
CREATE INDEX idx_judge_comments_conversation_id ON judge_comments(conversation_id);
CREATE INDEX idx_judge_comments_gmail ON judge_comments(gmail);
CREATE INDEX idx_judge_comments_created_at ON judge_comments(created_at);

-- 创建更新时间触发器
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_judge_comments_updated_at 
    BEFORE UPDATE ON judge_comments 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
```

### 2. 表字段说明

| 字段名 | 类型 | 说明 |
|--------|------|------|
| `id` | UUID | 主键，自动生成 |
| `conversation_id` | TEXT | Dify 对话ID |
| `github_repo_url` | TEXT | GitHub 仓库链接 |
| `gmail` | TEXT | 用户邮箱 |
| `analysis_result` | TEXT | Dify 分析结果 |
| `analysis_metadata` | JSONB | 分析元数据（token使用等） |
| `comment_cn_ng` | TEXT | Andrew Ng 中文评论 |
| `comment_en_ng` | TEXT | Andrew Ng 英文评论 |
| `comment_cn_paul` | TEXT | Paul Graham 中文评论 |
| `comment_en_paul` | TEXT | Paul Graham 英文评论 |
| `comment_cn_li` | TEXT | Feifei Li 中文评论 |
| `comment_en_li` | TEXT | Feifei Li 英文评论 |
| `comment_cn_sam` | TEXT | Sam Altman 中文评论 |
| `comment_en_sam` | TEXT | Sam Altman 英文评论 |
| `created_at` | TIMESTAMP | 创建时间 |
| `updated_at` | TIMESTAMP | 更新时间 |

## 环境变量配置

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

## 权限设置

### 1. 行级安全策略 (RLS)

```sql
-- 启用 RLS
ALTER TABLE judge_comments ENABLE ROW LEVEL SECURITY;

-- 允许所有用户读取（用于公开展示）
CREATE POLICY "Allow public read access" ON judge_comments
    FOR SELECT USING (true);

-- 允许认证用户插入
CREATE POLICY "Allow authenticated insert" ON judge_comments
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- 允许用户更新自己的记录
CREATE POLICY "Allow users to update own records" ON judge_comments
    FOR UPDATE USING (gmail = auth.jwt() ->> 'email');
```

### 2. API 访问权限

确保你的 Supabase 项目设置中：
- 启用 "Enable Row Level Security (RLS)"
- 配置适当的 CORS 策略
- 设置正确的 API 密钥权限

## 使用示例

### 1. 插入分析结果

```typescript
const { data, error } = await supabase
  .from('judge_comments')
  .insert({
    conversation_id: 'conv_123456',
    github_repo_url: 'https://github.com/user/repo',
    gmail: 'user@gmail.com',
    analysis_result: 'Dify analysis result...',
    analysis_metadata: { tokens: 1500 }
  });
```

### 2. 查询分析结果

```typescript
const { data, error } = await supabase
  .from('judge_comments')
  .select('*')
  .eq('conversation_id', 'conv_123456')
  .single();
```

### 3. 更新评委评论

```typescript
const { data, error } = await supabase
  .from('judge_comments')
  .update({
    comment_cn_ng: 'Andrew Ng 中文评论',
    comment_en_ng: 'Andrew Ng English comment'
  })
  .eq('conversation_id', 'conv_123456');
```

## 部署注意事项

1. **生产环境**：确保使用正确的 Supabase 项目 URL 和密钥
2. **CORS 配置**：在 Supabase 设置中配置允许的域名
3. **数据库备份**：定期备份重要数据
4. **监控**：设置数据库查询监控和错误告警

## 故障排除

### 常见问题

1. **权限错误**：检查 RLS 策略和用户权限
2. **连接失败**：验证 Supabase URL 和密钥
3. **数据不显示**：检查查询条件和索引
4. **插入失败**：验证必填字段和数据类型

### 调试命令

```sql
-- 检查表结构
\d judge_comments

-- 查看数据
SELECT * FROM judge_comments LIMIT 10;

-- 检查索引
\di judge_comments*

-- 查看 RLS 策略
SELECT * FROM pg_policies WHERE tablename = 'judge_comments';
``` 