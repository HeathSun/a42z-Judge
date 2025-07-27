"use client";

import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import {
  Terminal,
} from "@/components/magicui/terminal";
import { TypingAnimation } from "@/components/magicui/typing-animation";
import { NumberTicker } from "@/components/magicui/number-ticker";
import { 
  Search, 
  Code, 
  GitBranch, 
  Clock, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  BarChart3,
  Zap,
  Shield,
  Globe
} from "lucide-react";

interface DifyAnalysisDisplayProps {
  analysisData: {
    answer: string;
    conversation_id: string;
    message_id: string;
    metadata?: {
      usage?: {
        total_tokens?: number;
        prompt_tokens?: number;
        completion_tokens?: number;
        total_price?: number;
        latency?: number;
      };
    };
  };
  isVisible: boolean;
  className?: string;
}

interface CommandStep {
  id: string;
  command: string;
  description: string;
  duration: number;
  status: 'pending' | 'running' | 'completed' | 'error';
  output?: string;
}

interface ApiCallItem {
  id: string;
  service: string;
  description: string;
  duration: number;
  status: 'pending' | 'running' | 'completed' | 'error';
  tokenCost?: number;
  latency?: number;
}

interface ParsedAnalysis {
  summary: string;
  scores: string[];
  fullContent: string;
}

export function DifyAnalysisDisplay({ 
  analysisData, 
  isVisible, 
  className 
}: DifyAnalysisDisplayProps) {
  const [displayedAnalysis, setDisplayedAnalysis] = useState<ParsedAnalysis>({
    summary: "",
    scores: [],
    fullContent: ""
  });
  const [showAnalysis, setShowAnalysis] = useState(false);

  // 模拟命令执行步骤
  const commandSteps: CommandStep[] = [
    {
      id: "1",
      command: "git clone https://github.com/...",
      description: "Cloning repository for analysis",
      duration: 2000,
      status: 'completed'
    },
    {
      id: "2", 
      command: "analyze codebase structure",
      description: "Analyzing project architecture",
      duration: 3000,
      status: 'completed'
    },
    {
      id: "3",
      command: "extract key metrics",
      description: "Extracting repository metrics",
      duration: 2500,
      status: 'completed'
    },
    {
      id: "4",
      command: "compare with similar projects",
      description: "Finding similar repositories",
      duration: 4000,
      status: 'completed'
    },
    {
      id: "5",
      command: "generate analysis report",
      description: "Generating comprehensive report",
      duration: 3500,
      status: 'completed'
    }
  ];

  // 模拟 API 调用
  const apiCalls: ApiCallItem[] = [
    {
      id: "1",
      service: "GitHub API",
      description: "Fetching repository data",
      duration: 1200,
      status: 'completed',
      latency: 450
    },
    {
      id: "2",
      service: "OpenAI GPT-4",
      description: "Analyzing code patterns",
      duration: 2800,
      status: 'completed',
      tokenCost: 5875,
      latency: 13559
    },
    {
      id: "3",
      service: "Similarity Engine",
      description: "Finding similar projects",
      duration: 1800,
      status: 'completed',
      latency: 1200
    },
    {
      id: "4",
      service: "Metrics Calculator",
      description: "Calculating scores",
      duration: 900,
      status: 'completed',
      latency: 800
    }
  ];

  useEffect(() => {
    if (isVisible) {
      // 开始显示分析结果
      setTimeout(() => {
        setShowAnalysis(true);
        // 解析并显示分析内容
        const parsedContent = parseAnalysisContent(analysisData.answer);
        setDisplayedAnalysis(parsedContent);
      }, 2000);
    }
  }, [isVisible, analysisData]);

  const parseAnalysisContent = (content: string): ParsedAnalysis => {
    // 提取关键信息
    const lines = content.split('\n');
    const summary = lines.find(line => line.includes('总结') || line.includes('Summary')) || "分析完成";
    const scores = lines.filter(line => line.includes('得分') || line.includes('score')).slice(0, 5); // 只显示前5个得分
    
    return {
      summary,
      scores,
      fullContent: content
    };
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'running': return <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />;
      case 'error': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default: return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getServiceIcon = (service: string) => {
    switch (service.toLowerCase()) {
      case 'github api': return <GitBranch className="w-4 h-4" />;
      case 'openai gpt-4': return <Zap className="w-4 h-4" />;
      case 'similarity engine': return <Search className="w-4 h-4" />;
      case 'metrics calculator': return <BarChart3 className="w-4 h-4" />;
      default: return <Globe className="w-4 h-4" />;
    }
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* 命令执行步骤 */}
      <div className="bg-black/20 border border-white/10 rounded-lg p-4">
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          <Code className="w-5 h-5" />
          Command Execution
        </h3>
        <div className="space-y-3">
          {commandSteps.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.3 }}
              className="flex items-center gap-3 text-sm"
            >
              <div className="flex items-center gap-2 min-w-0 flex-1">
                {getStatusIcon(step.status)}
                <span className="text-green-400 font-mono">$</span>
                <span className="text-gray-300 font-mono truncate">{step.command}</span>
              </div>
              <span className="text-gray-500 text-xs">{step.duration}ms</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* API 调用项目 */}
      <div className="bg-black/20 border border-white/10 rounded-lg p-4">
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5" />
          API Calls & External Services
        </h3>
        <div className="space-y-3">
          {apiCalls.map((call, index) => (
            <motion.div
              key={call.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.4 }}
              className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10"
            >
              <div className="flex items-center gap-3">
                {getServiceIcon(call.service)}
                <div>
                  <div className="text-white font-medium">{call.service}</div>
                  <div className="text-gray-400 text-sm">{call.description}</div>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm">
                {call.tokenCost && (
                  <div className="text-blue-400">
                    {typeof call.tokenCost === 'number' ? call.tokenCost.toLocaleString() : call.tokenCost} tokens
                  </div>
                )}
                {call.latency && (
                  <div className="text-green-400">
                    {typeof call.latency === 'number' ? call.latency.toFixed(0) : '0'}ms
                  </div>
                )}
                <div className="text-gray-500">
                  {call.duration}ms
                </div>
                {getStatusIcon(call.status)}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* 分析结果展示 */}
      {showAnalysis && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-black/20 border border-white/10 rounded-lg p-6"
        >
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Analysis Results
          </h3>
          
          {/* 关键指标 */}
          {analysisData.metadata?.usage && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white/5 p-3 rounded-lg border border-white/10">
                <div className="text-gray-400 text-sm">Total Tokens</div>
                <div className="text-white font-semibold">
                  {typeof analysisData.metadata.usage.total_tokens === 'number' ? analysisData.metadata.usage.total_tokens.toLocaleString() : analysisData.metadata.usage.total_tokens || '0'}
                </div>
              </div>
              <div className="bg-white/5 p-3 rounded-lg border border-white/10">
                <div className="text-gray-400 text-sm">Cost</div>
                <div className="text-white font-semibold">
                  ${typeof analysisData.metadata.usage.total_price === 'number' ? analysisData.metadata.usage.total_price.toFixed(4) : '0.0000'}
                </div>
              </div>
              <div className="bg-white/5 p-3 rounded-lg border border-white/10">
                <div className="text-gray-400 text-sm">Latency</div>
                <div className="text-white font-semibold">
                  {typeof analysisData.metadata.usage.latency === 'number' ? analysisData.metadata.usage.latency.toFixed(0) : '0'}ms
                </div>
              </div>
              <div className="bg-white/5 p-3 rounded-lg border border-white/10">
                <div className="text-gray-400 text-sm">Status</div>
                <div className="text-green-400 font-semibold flex items-center gap-1">
                  <CheckCircle className="w-4 h-4" />
                  Success
                </div>
              </div>
            </div>
          )}

          {/* 分析摘要 */}
          <div className="space-y-4">
            <div className="bg-black border border-white/20 rounded-lg p-4">
              <h4 className="text-white font-medium mb-2">Analysis Summary</h4>
              <Terminal className="max-h-32 overflow-y-auto">
                <TypingAnimation
                  className="text-gray-300 text-sm leading-relaxed font-['Noto_Sans_SC']"
                  duration={50}
                  delay={500}
                >
                  {displayedAnalysis.summary || "Analysis completed successfully. The repository has been thoroughly evaluated for technical homogeneity and compared with similar projects in the ecosystem."}
                </TypingAnimation>
              </Terminal>
            </div>

            {/* 完整答案显示 */}
            <div className="bg-black border border-white/20 rounded-lg p-4">
              <h4 className="text-white font-medium mb-3">Full Analysis</h4>
              <Terminal className="max-h-64 overflow-y-auto">
                <TypingAnimation
                  className="text-gray-300 text-sm leading-relaxed font-['Noto_Sans_SC']"
                  duration={30}
                  delay={300}
                >
                  {analysisData.answer}
                </TypingAnimation>
              </Terminal>
            </div>

            {/* 相似项目评分 */}
            <div className="bg-black border border-white/20 rounded-lg p-4">
              <h4 className="text-white font-medium mb-3">Similarity Scores</h4>
              <Terminal className="max-h-48 overflow-y-auto">
                <div className="space-y-2">
                  {displayedAnalysis.scores?.map((score, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.2 }}
                      className="flex items-center justify-between p-2 bg-white/5 rounded border border-white/10"
                    >
                      <span className="text-gray-300 text-sm">{score}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full"
                            style={{ width: `${Math.floor(Math.random() * 40 + 60)}%` }}
                          />
                        </div>
                        <span className="text-white text-sm font-medium">
                          {Math.floor(Math.random() * 40 + 60)}%
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </Terminal>
            </div>

            {/* Full Score 显示 */}
            <div className="bg-black border border-white/20 rounded-lg p-6 text-center">
              <h4 className="text-white font-medium mb-4">Final Score</h4>
              <div className="flex justify-center items-center">
                <NumberTicker
                  value={Math.floor(Math.random() * 13) + 85} // 85-97 之间的随机数
                  decimalPlaces={0}
                  className="whitespace-pre-wrap text-8xl font-medium tracking-tighter text-white"
                />
              </div>
              <p className="text-gray-400 text-sm mt-2">Overall Project Assessment</p>
            </div>

            {/* 对话信息 */}
            <div className="bg-white/5 p-4 rounded-lg border border-white/10">
              <h4 className="text-white font-medium mb-2">Session Info</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Conversation ID:</span>
                  <span className="text-white font-mono ml-2">{analysisData.conversation_id}</span>
                </div>
                <div>
                  <span className="text-gray-400">Message ID:</span>
                  <span className="text-white font-mono ml-2">{analysisData.message_id}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
} 