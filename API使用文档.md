# 🚀 黑客松评委系统 - API使用文档

## 📋 目录
1. [服务概述](#服务概述)
2. [快速开始](#快速开始)
3. [认证方式](#认证方式)
4. [核心API接口](#核心api接口)
5. [响应格式](#响应格式)
6. [错误处理](#错误处理)
7. [使用示例](#使用示例)
8. [SDK和工具](#sdk和工具)

---

## 🎯 服务概述

### 服务信息
- **服务名称**: 黑客松评委系统 - 代码质量分析服务
- **版本**: v1.0.0
- **基础URL**: `http://localhost:3001` (本地) / `https://your-domain.com` (生产)
- **API版本**: v1
- **文档类型**: RESTful API

### 核心功能
- 🔍 **GitHub仓库分析** - 支持任意公开GitHub仓库的代码质量分析
- 📊 **多维度评分** - 提供0-100分综合评分和A+到F等级评定
- 🐛 **问题检测** - 详细的代码问题分析和分类
- 💡 **智能建议** - 针对性的代码改进建议
- ⚡ **实时状态** - 异步分析处理和实时状态跟踪

---

## 🚀 快速开始

### 1. 检查服务状态
```bash
curl http://localhost:3001/api/v1/health
```

### 2. 分析GitHub仓库
```bash
curl -X POST http://localhost:3001/api/v1/code-quality/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "repository_url": "https://github.com/sindresorhus/is",
    "project_name": "测试项目"
  }'
```

### 3. 获取分析结果
```bash
# 使用返回的project_id
curl http://localhost:3001/api/v1/code-quality/projects/{project_id}/score
```

---

## 🔐 认证方式

### 当前版本
- **认证方式**: 暂无认证要求（开发阶段）
- **访问限制**: 基于IP的限流保护

### 生产环境（计划）
- **JWT Token**: `Authorization: Bearer <token>`
- **API Key**: `X-API-Key: <api_key>`

---

## 🛠️ 核心API接口

### 1. 健康检查
```http
GET /api/v1/health
```

**响应示例**:
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "services": {
      "database": "healthy",
      "redis": "healthy",
      "codacy_api": "healthy"
    },
    "version": "1.0.0",
    "uptime": "2h 15m"
  }
}
```

### 2. 分析GitHub仓库
```http
POST /api/v1/code-quality/analyze
Content-Type: application/json
```

**请求参数**:
```json
{
  "repository_url": "https://github.com/user/repo",
  "repository_type": "github",
  "branch": "main",
  "project_name": "项目名称",
  "callback_url": "https://your-app.com/webhook"
}
```

**参数说明**:
- `repository_url` (必需): GitHub仓库URL
- `repository_type` (可选): 仓库类型，默认"github"
- `branch` (可选): 分支名，默认"main"
- `project_name` (可选): 项目名称
- `callback_url` (可选): 分析完成回调URL

**响应示例**:
```json
{
  "success": true,
  "data": {
    "analysis_id": "uuid-analysis-id",
    "project_id": "uuid-project-id",
    "status": "queued",
    "estimated_duration": "5-10 minutes"
  }
}
```

### 3. 查看分析状态
```http
GET /api/v1/code-quality/analysis/{analysis_id}/status
```

**响应示例**:
```json
{
  "success": true,
  "data": {
    "analysis_id": "uuid-analysis-id",
    "project_id": "uuid-project-id",
    "status": "completed",
    "progress": 100,
    "started_at": "2025-07-26T06:21:03.931Z",
    "completed_at": "2025-07-26T06:21:07.522Z"
  }
}
```

**状态值**:
- `queued`: 排队中
- `running`: 分析中
- `completed`: 已完成
- `failed`: 分析失败

### 4. 获取质量评分
```http
GET /api/v1/code-quality/projects/{project_id}/score
```

**响应示例**:
```json
{
  "success": true,
  "data": {
    "overall_score": 85,
    "grade": "B+",
    "scores": {
      "code_quality": 88.0,
      "security": 82.0,
      "maintainability": 87.0,
      "reliability": 85.0,
      "coverage": 78.5
    },
    "improvement_suggestions": [
      "增加单元测试覆盖率",
      "修复3个高优先级安全问题",
      "重构复杂度过高的函数"
    ],
    "last_analyzed": "2025-07-26T06:21:07.397Z"
  }
}
```

### 5. 获取问题列表
```http
GET /api/v1/code-quality/projects/{project_id}/issues?level=error&page=1&limit=20
```

**查询参数**:
- `level` (可选): 问题级别 (error|warning|info)
- `category` (可选): 问题类别 (security|performance|maintainability)
- `page` (可选): 页码，默认1
- `limit` (可选): 每页数量，默认20

**响应示例**:
```json
{
  "success": true,
  "data": {
    "issues": [
      {
        "id": "issue-uuid",
        "level": "error",
        "category": "security",
        "pattern_id": "SQL_INJECTION",
        "message": "潜在的SQL注入风险",
        "file_path": "src/database/query.js",
        "line_number": 45,
        "column_number": 10,
        "suggestion": "使用参数化查询防止SQL注入"
      }
    ],
    "summary": {
      "total": 25,
      "error": 3,
      "warning": 15,
      "info": 7,
      "security": 2
    }
  },
  "meta": {
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 25,
      "totalPages": 2,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

### 6. 获取详细报告
```http
GET /api/v1/code-quality/projects/{project_id}/report?format=json
```

**查询参数**:
- `format` (可选): 报告格式 (json|pdf|html)，默认json

**响应示例**:
```json
{
  "success": true,
  "data": {
    "report_id": "report-uuid",
    "project_info": {
      "name": "测试项目",
      "repository_url": "https://github.com/user/repo",
      "analyzed_at": "2025-07-26T06:21:07.397Z"
    },
    "summary": {
      "overall_score": 85,
      "grade": "B+",
      "total_lines": 15420,
      "total_files": 156
    },
    "metrics": {
      "complexity": {
        "average": 3.2,
        "max": 15,
        "files_over_threshold": 8
      },
      "duplication": {
        "percentage": 2.1,
        "duplicated_lines": 324
      },
      "coverage": {
        "percentage": 78.5,
        "covered_lines": 12105,
        "total_lines": 15420
      }
    }
  }
}
```

### 7. 重新分析项目
```http
POST /api/v1/code-quality/projects/{project_id}/reanalyze
Content-Type: application/json
```

**请求参数**:
```json
{
  "branch": "main",
  "force": false
}
```

---

## 📤 响应格式

### 成功响应
```json
{
  "success": true,
  "data": {
    // 具体数据内容
  },
  "meta": {
    "timestamp": "2025-07-26T06:21:07.397Z",
    "requestId": "req_uuid",
    "version": "v1",
    "pagination": {  // 分页数据时包含
      "page": 1,
      "limit": 20,
      "total": 100,
      "hasNext": true
    }
  }
}
```

### 错误响应
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "请求参数验证失败",
    "details": {
      "repository_url": "仓库URL格式不正确"
    }
  },
  "meta": {
    "timestamp": "2025-07-26T06:21:07.397Z",
    "requestId": "req_uuid",
    "version": "v1"
  }
}
```

---

## ❌ 错误处理

### 错误代码表
| 错误代码 | HTTP状态码 | 描述 | 解决方案 |
|----------|------------|------|----------|
| `VALIDATION_ERROR` | 400 | 请求参数验证失败 | 检查请求参数格式 |
| `UNAUTHORIZED` | 401 | 未授权访问 | 提供有效的认证信息 |
| `FORBIDDEN` | 403 | 权限不足 | 检查API权限设置 |
| `NOT_FOUND` | 404 | 资源不存在 | 验证URL和资源ID |
| `RATE_LIMITED` | 429 | 请求频率超限 | 等待后重试 |
| `INTERNAL_ERROR` | 500 | 服务器内部错误 | 联系技术支持 |

### 重试策略
- **网络错误**: 指数退避重试，最多3次
- **限流错误**: 等待60秒后重试
- **服务器错误**: 等待5分钟后重试

---

## 💡 使用示例

### JavaScript/Node.js
```javascript
const axios = require('axios');

// 分析GitHub仓库
async function analyzeRepository(repoUrl) {
  try {
    // 1. 发起分析
    const analyzeResponse = await axios.post(
      'http://localhost:3001/api/v1/code-quality/analyze',
      {
        repository_url: repoUrl,
        project_name: '我的项目'
      }
    );
    
    const { analysis_id, project_id } = analyzeResponse.data.data;
    
    // 2. 轮询状态
    let status = 'queued';
    while (status !== 'completed' && status !== 'failed') {
      await new Promise(resolve => setTimeout(resolve, 5000)); // 等待5秒
      
      const statusResponse = await axios.get(
        `http://localhost:3001/api/v1/code-quality/analysis/${analysis_id}/status`
      );
      
      status = statusResponse.data.data.status;
      console.log(`分析状态: ${status}`);
    }
    
    // 3. 获取结果
    if (status === 'completed') {
      const scoreResponse = await axios.get(
        `http://localhost:3001/api/v1/code-quality/projects/${project_id}/score`
      );
      
      console.log('质量评分:', scoreResponse.data.data);
      return scoreResponse.data.data;
    }
    
  } catch (error) {
    console.error('分析失败:', error.response?.data || error.message);
  }
}

// 使用示例
analyzeRepository('https://github.com/sindresorhus/is');
```

### Python
```python
import requests
import time

def analyze_repository(repo_url):
    base_url = 'http://localhost:3001/api/v1/code-quality'
    
    # 1. 发起分析
    response = requests.post(f'{base_url}/analyze', json={
        'repository_url': repo_url,
        'project_name': '我的项目'
    })
    
    if not response.ok:
        print(f'分析请求失败: {response.text}')
        return
    
    data = response.json()['data']
    analysis_id = data['analysis_id']
    project_id = data['project_id']
    
    # 2. 轮询状态
    while True:
        status_response = requests.get(f'{base_url}/analysis/{analysis_id}/status')
        status_data = status_response.json()['data']
        status = status_data['status']
        
        print(f'分析状态: {status}')
        
        if status == 'completed':
            break
        elif status == 'failed':
            print('分析失败')
            return
        
        time.sleep(5)  # 等待5秒
    
    # 3. 获取结果
    score_response = requests.get(f'{base_url}/projects/{project_id}/score')
    score_data = score_response.json()['data']
    
    print(f"质量评分: {score_data['overall_score']}/100 ({score_data['grade']})")
    return score_data

# 使用示例
analyze_repository('https://github.com/sindresorhus/is')
```

### cURL脚本
```bash
#!/bin/bash

REPO_URL="https://github.com/sindresorhus/is"
BASE_URL="http://localhost:3001/api/v1/code-quality"

# 1. 发起分析
echo "🚀 开始分析仓库: $REPO_URL"
RESPONSE=$(curl -s -X POST "$BASE_URL/analyze" \
  -H "Content-Type: application/json" \
  -d "{\"repository_url\": \"$REPO_URL\", \"project_name\": \"测试项目\"}")

ANALYSIS_ID=$(echo $RESPONSE | jq -r '.data.analysis_id')
PROJECT_ID=$(echo $RESPONSE | jq -r '.data.project_id')

echo "📋 分析ID: $ANALYSIS_ID"
echo "📋 项目ID: $PROJECT_ID"

# 2. 轮询状态
while true; do
  STATUS_RESPONSE=$(curl -s "$BASE_URL/analysis/$ANALYSIS_ID/status")
  STATUS=$(echo $STATUS_RESPONSE | jq -r '.data.status')
  
  echo "⏳ 当前状态: $STATUS"
  
  if [ "$STATUS" = "completed" ]; then
    echo "✅ 分析完成!"
    break
  elif [ "$STATUS" = "failed" ]; then
    echo "❌ 分析失败!"
    exit 1
  fi
  
  sleep 5
done

# 3. 获取结果
echo "📊 获取质量评分..."
SCORE_RESPONSE=$(curl -s "$BASE_URL/projects/$PROJECT_ID/score")
echo $SCORE_RESPONSE | jq '.data'
```

---

## 🛠️ SDK和工具

### Postman Collection
- **导入URL**: `http://localhost:3001/api-docs/swagger.json`
- **使用方法**: 在Postman中导入OpenAPI规范

### 在线API文档
- **Swagger UI**: http://localhost:3001/api-docs
- **特点**: 交互式测试界面

### 开发工具
- **API测试**: 推荐使用Postman或Insomnia
- **监控**: 可集成Sentry或其他APM工具
- **日志**: 支持结构化JSON日志输出

---

## 📞 技术支持

### 问题反馈
- **GitHub Issues**: 在项目仓库提交问题
- **邮箱支持**: support@hackathon-judge.com
- **文档更新**: 本文档会随API更新同步维护

### 更新日志
- **v1.0.0** (2025-07-26): 初始版本发布
  - 支持GitHub仓库分析
  - 多维度质量评分
  - 问题检测和建议

---

**文档版本**: v1.0.0  
**最后更新**: 2025-07-26  
**维护团队**: 黑客松评委系统开发团队
