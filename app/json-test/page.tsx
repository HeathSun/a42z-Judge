"use client";

import { StructuredJsonDisplay } from '@/components/magicui/structured-json-display';

export default function JsonTestPage() {
  // 模拟 Dify 的结构化输出数据
  const sampleData = {
    // 数字类型 - 使用 NumberTicker 动画
    technical_score: 85.7,
    business_score: 72.3,
    innovation_score: 91.2,
    market_potential: 68.9,
    code_quality: 88.5,
    
    // 字符串类型 - 使用涟漪按钮样式
    project_name: "AI-Powered Code Analyzer",
    repository_url: "https://github.com/example/ai-analyzer",
    analysis_status: "Completed",
    
    // 字符串数组 - 使用 TypingAnimation
    recommendations: [
      "Implement comprehensive unit testing",
      "Add API documentation",
      "Optimize database queries",
      "Enhance error handling",
      "Consider microservices architecture"
    ],
    
    // 对象数组 - 使用表格展示
    key_metrics: [
      { metric: "Repository Size", value: 1250, unit: "files" },
      { metric: "Commit Frequency", value: 45, unit: "commits/week" },
      { metric: "Contributor Count", value: 12, unit: "developers" },
      { metric: "Issue Resolution Time", value: 3.2, unit: "days" },
      { metric: "Code Coverage", value: 78.5, unit: "%" }
    ],
    
    // 更多字符串数组
    strengths: [
      "Excellent code organization",
      "Strong documentation",
      "Active community",
      "Modern tech stack"
    ],
    
    weaknesses: [
      "Limited test coverage",
      "Missing CI/CD pipeline",
      "No performance monitoring"
    ],
    
    // 更多数字
    performance_score: 82.1,
    security_score: 76.8,
    maintainability_score: 89.3,
    
    // 更多字符串
    primary_language: "TypeScript",
    framework: "Next.js",
    deployment_platform: "Vercel"
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            Structured JSON Display Test
          </h1>
          <p className="text-gray-300 text-lg">
            Testing different data types with appropriate UI components
          </p>
        </div>
        
        <StructuredJsonDisplay 
          data={sampleData}
          isVisible={true}
        />
      </div>
    </div>
  );
} 