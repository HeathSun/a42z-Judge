# Supabase Storage 设置指南

## 创建 PDF Bucket

在 Supabase Dashboard 中创建名为 "pdf" 的存储桶：

1. 登录 Supabase Dashboard
2. 进入 Storage 部分
3. 点击 "Create a new bucket"
4. 输入 bucket 名称：`pdf`
5. 选择 "Public" 或 "Private"（根据你的需求）

## 配置 RLS 策略

### 允许上传 PDF 文件

```sql
-- 允许认证用户上传 PDF 文件
CREATE POLICY "Allow authenticated users to upload PDFs" ON storage.objects 
FOR INSERT WITH CHECK (
  bucket_id = 'pdf' AND 
  auth.role() = 'authenticated' AND
  (storage.extension(name)) = 'pdf'
);
```

### 允许读取 PDF 文件

```sql
-- 允许公开读取 PDF 文件（如果 bucket 是 public）
CREATE POLICY "Allow public read access to PDFs" ON storage.objects 
FOR SELECT USING (
  bucket_id = 'pdf'
);
```

### 允许用户更新自己的 PDF 文件

```sql
-- 允许用户更新自己的 PDF 文件（基于文件名匹配邮箱）
CREATE POLICY "Allow users to update their own PDFs" ON storage.objects 
FOR UPDATE USING (
  bucket_id = 'pdf' AND 
  auth.role() = 'authenticated' AND
  name = auth.jwt() ->> 'email' || '.pdf'
);
```

### 允许用户删除自己的 PDF 文件

```sql
-- 允许用户删除自己的 PDF 文件
CREATE POLICY "Allow users to delete their own PDFs" ON storage.objects 
FOR DELETE USING (
  bucket_id = 'pdf' AND 
  auth.role() = 'authenticated' AND
  name = auth.jwt() ->> 'email' || '.pdf'
);
```

## 文件命名规则

- 文件名格式：`{user_email}.pdf`
- 例如：`user@gmail.com.pdf`
- 使用 `upsert: true` 选项，如果文件已存在则覆盖

## 访问文件

上传成功后，可以通过以下 URL 访问文件：
```
https://{project_ref}.supabase.co/storage/v1/object/public/pdf/{user_email}.pdf
```

## 注意事项

1. 确保用户已登录（`userEmail` 不为空）
2. 文件类型验证在客户端和服务器端都要进行
3. 考虑文件大小限制（Supabase 默认 50MB）
4. 定期清理未使用的文件以节省存储空间 