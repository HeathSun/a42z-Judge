"use client"

import React, { useState, useRef, useEffect } from "react"

import { motion, AnimatePresence } from "framer-motion"
import { ChevronRight, Github, FileText, Plus, ExternalLink, Loader2, Search, Brain, Database, Cpu, Code, Zap, Globe, TrendingUp, BarChart3, Shield, GitBranch, Webhook, Bot, Sparkles, Award, Building2, Activity } from "lucide-react"
import { ShimmerButton } from "@/components/magicui/shimmer-button";
import { ShinyButton } from "@/components/magicui/shiny-button";
import { FlickeringGrid } from "@/components/magicui/flickering-grid";
import { RainbowButton } from "@/components/magicui/rainbow-button";
import Link from "next/link";
import { MagicCard } from "@/components/magicui/magic-card";
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User2 } from 'lucide-react';
import { ShineBorder } from '@/components/magicui/shine-border';
import { TextAnimate } from '@/components/magicui/text-animate';
import { Terminal, TypingAnimation, AnimatedSpan } from '@/components/magicui/terminal';
import { difyAPI, DifyResponse } from '@/lib/dify';

import { ApiCallItem } from '@/components/magicui/api-call-item';
import { LucideIcon } from "lucide-react";

// Types

// Utility function to check if running on localhost
const isLocalhost = (): boolean => {
  if (typeof window === 'undefined') return false;
  const hostname = window.location.hostname;
  return hostname === 'localhost' || 
         hostname === '127.0.0.1' ||
         hostname.startsWith('192.168.') ||
         hostname.startsWith('10.') ||
         hostname.startsWith('172.');
};

interface UploadedFile {
  id: string
  name: string
  type: "pdf" | "github"
  status: "uploading" | "completed" | "error"
}

interface Citation {
  id: string
  title: string
  url: string
  source: string
}

interface WorkflowStep {
  id: string
  title: string
  description: string
  status: "pending" | "loading" | "completed" | "error"
  isExpanded: boolean
  citations?: Citation[]
  content?: string
  substeps?: WorkflowStep[]
  internalSteps?: string[]
}

interface AITwin {
  id: string
  name: string
  avatar: string
  role: string
  thinking: boolean
  message?: string
}



const aiTwins: AITwin[] = [
  { id: "pg", name: "Paul Graham", avatar: "🧠", role: "Startup Advisor", thinking: false },
  { id: "sa", name: "Sam Altman", avatar: "🚀", role: "AI Pioneer", thinking: false },
  { id: "ak", name: "Andrej Karpathy", avatar: "🤖", role: "AI Researcher", thinking: false },
  { id: "a16z", name: "Andreessen Horowitz", avatar: "💼", role: "VC Partner", thinking: false },
]

// 新增接口定义
interface ApiCall {
  id: string;
  icon: LucideIcon;
  title: string;
  description: string;
  duration: number; // 随机时间数值
  tokenCost?: number; // 只有大模型有token消耗
  delay: number; // 出现延迟
}

interface TerminalStep {
  id: string;
  text: string;
  type: "command" | "api-call";
  duration: number;
  apiCall?: ApiCall;
}

interface DatabaseAnalysis {
  id: string;
  conversation_id: string;
  github_repo_url: string;
  gmail: string;
  analysis_result: string;
  analysis_metadata?: {
    usage?: {
      total_tokens?: number;
      prompt_tokens?: number;
      completion_tokens?: number;
    };
  };
  comment_cn_ng?: string;
  comment_en_ng?: string;
  comment_cn_paul?: string;
  comment_en_paul?: string;
  comment_cn_li?: string;
  comment_en_li?: string;
  comment_cn_sam?: string;
  comment_en_sam?: string;
  created_at: string;
  updated_at: string;
}

function TerminalSteps({ steps, isVisible, stepType = "business-research" }: { steps: string[], isVisible: boolean, stepType?: string }) {
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState<string | null>(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [hasCompleted, setHasCompleted] = useState(false);
  const [terminalSteps, setTerminalSteps] = useState<TerminalStep[]>([]);
  const [visibleApiCalls, setVisibleApiCalls] = useState<ApiCall[]>([]);

  // 生成API Calls配置
  const generateApiCalls = (stepType: string): ApiCall[] => {
    // 生成随机时间数值（几十+小数点后二位）
    const generateRandomTime = () => {
      const base = Math.floor(Math.random() * 70) + 30; // 30-100
      const decimal = Math.floor(Math.random() * 100); // 0-99
      return parseFloat(`${base}.${decimal.toString().padStart(2, '0')}`);
    };

    // 生成随机延迟时间（更大的扰动）
    const generateRandomDelay = (baseDelay: number) => {
      const variation = Math.random() * 0.8 + 0.2; // 20%-100%的随机变化
      return Math.floor(baseDelay * variation);
    };

          // 基础API调用池
      const apiCallPool: ApiCall[] = [
        // 搜索引擎和搜索API
        {
          id: "google-search",
          icon: Search,
          title: "Google Search API",
          description: "Searching for market trends and competitors",
          duration: generateRandomTime(),
          delay: generateRandomDelay(1500),
        },
        {
          id: "perplexity",
          icon: Globe,
          title: "Perplexity API",
          description: "Real-time web search and analysis",
          duration: generateRandomTime(),
          delay: generateRandomDelay(1800),
        },
        
        // 数据库和存储
        {
          id: "database-query",
          icon: Database,
          title: "Database Query",
          description: "Fetching historical data and benchmarks",
          duration: generateRandomTime(),
          delay: generateRandomDelay(1200),
        },
        {
          id: "crunchbase",
          icon: Building2,
          title: "Crunchbase API",
          description: "Startup and company data analysis",
          duration: generateRandomTime(),
          delay: generateRandomDelay(2000),
        },
        {
          id: "ycombinator",
          icon: Award,
          title: "Y Combinator API",
          description: "Startup accelerator and portfolio data",
          duration: generateRandomTime(),
          delay: generateRandomDelay(2200),
        },
      
      // 代码分析工具
      {
        id: "github-api",
        icon: Github,
        title: "GitHub API",
        description: "Repository analysis and metrics",
        duration: generateRandomTime(),
        delay: generateRandomDelay(1600),
      },
      {
        id: "repointel",
        icon: GitBranch,
        title: "RepoIntel API",
        description: "Advanced repository intelligence",
        duration: generateRandomTime(),
        delay: generateRandomDelay(2200),
      },
      {
        id: "sonarqube",
        icon: Code,
        title: "SonarQube API",
        description: "Code quality and security analysis",
        duration: generateRandomTime(),
        delay: generateRandomDelay(1900),
      },
      
      // 新闻和媒体
      {
        id: "techcrunch",
        icon: TrendingUp,
        title: "TechCrunch API",
        description: "Tech news and startup coverage",
        duration: generateRandomTime(),
        delay: generateRandomDelay(1700),
      },
      {
        id: "devpost",
        icon: Award,
        title: "DevPost API",
        description: "Hackathon project analysis",
        duration: generateRandomTime(),
        delay: generateRandomDelay(2100),
      },
      
      // 爬虫和数据抓取
      {
        id: "firecrawl",
        icon: Webhook,
        title: "Firecrawl API",
        description: "Web scraping and data extraction",
        duration: generateRandomTime(),
        delay: generateRandomDelay(2400),
      },
      {
        id: "apify",
        icon: Bot,
        title: "Apify API",
        description: "Automated data collection",
        duration: generateRandomTime(),
        delay: generateRandomDelay(2300),
      },
      
      // 大语言模型
      {
        id: "openai-gpt4",
        icon: Brain,
        title: "OpenAI GPT-4",
        description: "Advanced language model analysis",
        duration: generateRandomTime(),
        tokenCost: Math.floor(Math.random() * 3000) + 1000,
        delay: generateRandomDelay(2500),
      },
      {
        id: "openai-gpt4-mini",
        icon: Sparkles,
        title: "OpenAI GPT-4 Mini",
        description: "Fast language model processing",
        duration: generateRandomTime(),
        tokenCost: Math.floor(Math.random() * 2000) + 500,
        delay: generateRandomDelay(1800),
      },
      {
        id: "claude-sonnet",
        icon: Cpu,
        title: "Claude 3.5 Sonnet",
        description: "Anthropic's advanced AI analysis",
        duration: generateRandomTime(),
        tokenCost: Math.floor(Math.random() * 2500) + 800,
        delay: generateRandomDelay(2000),
      },
      {
        id: "claude-opus",
        icon: Zap,
        title: "Claude 3.5 Opus",
        description: "Ultra-advanced reasoning and analysis",
        duration: generateRandomTime(),
        tokenCost: Math.floor(Math.random() * 4000) + 1500,
        delay: generateRandomDelay(3000),
      },
      
      // 专业分析工具
      {
        id: "security-scan",
        icon: Shield,
        title: "Security Vulnerability Scan",
        description: "Code security analysis",
        duration: generateRandomTime(),
        delay: generateRandomDelay(2200),
      },
      {
        id: "performance-test",
        icon: Activity,
        title: "Performance Testing API",
        description: "Application performance analysis",
        duration: generateRandomTime(),
        delay: generateRandomDelay(1900),
      },
      {
        id: "market-analysis",
        icon: BarChart3,
        title: "Market Analysis API",
        description: "Market trends and competition analysis",
        duration: generateRandomTime(),
        delay: generateRandomDelay(2100),
      },
    ];

    // 根据步骤类型选择特定的API调用
    let selectedCalls: ApiCall[] = [];
    
    switch (stepType) {
      case "technical-research":
        selectedCalls = [
          apiCallPool.find(call => call.id === "github-api")!,
          apiCallPool.find(call => call.id === "repointel")!,
          apiCallPool.find(call => call.id === "claude-sonnet")!,
          apiCallPool.find(call => call.id === "security-scan")!,
        ].filter(Boolean);
        break;
        
      case "code-quality-research":
        selectedCalls = [
          apiCallPool.find(call => call.id === "sonarqube")!,
          apiCallPool.find(call => call.id === "github-api")!,
          apiCallPool.find(call => call.id === "performance-test")!,
          apiCallPool.find(call => call.id === "openai-gpt4")!,
        ].filter(Boolean);
        break;
        
      case "business-research":
        selectedCalls = [
          apiCallPool.find(call => call.id === "crunchbase")!,
          apiCallPool.find(call => call.id === "techcrunch")!,
          apiCallPool.find(call => call.id === "ycombinator")!,
          apiCallPool.find(call => call.id === "perplexity")!,
          apiCallPool.find(call => call.id === "market-analysis")!,
          apiCallPool.find(call => call.id === "openai-gpt4")!,
        ].filter(Boolean);
        break;
        
      case "hackathon-research":
        selectedCalls = [
          apiCallPool.find(call => call.id === "devpost")!,
          apiCallPool.find(call => call.id === "github-api")!,
          apiCallPool.find(call => call.id === "firecrawl")!,
          apiCallPool.find(call => call.id === "claude-sonnet")!,
        ].filter(Boolean);
        break;
        
      case "ai-analysis":
        selectedCalls = [
          apiCallPool.find(call => call.id === "openai-gpt4")!,
          apiCallPool.find(call => call.id === "claude-opus")!,
          apiCallPool.find(call => call.id === "database-query")!,
          apiCallPool.find(call => call.id === "security-scan")!,
        ].filter(Boolean);
        break;
        
      case "scoring":
        selectedCalls = [
          apiCallPool.find(call => call.id === "openai-gpt4-mini")!,
          apiCallPool.find(call => call.id === "database-query")!,
          apiCallPool.find(call => call.id === "market-analysis")!,
        ].filter(Boolean);
        break;
        
      default:
        // 默认选择一些通用API
        selectedCalls = [
          apiCallPool.find(call => call.id === "google-search")!,
          apiCallPool.find(call => call.id === "database-query")!,
        ].filter(Boolean);
    }

    // 随机添加1-2个额外的API调用
    const remainingCalls = apiCallPool.filter(call => !selectedCalls.includes(call));
    const extraCount = Math.floor(Math.random() * 2) + 1;
    for (let i = 0; i < extraCount && remainingCalls.length > 0; i++) {
      const randomIndex = Math.floor(Math.random() * remainingCalls.length);
      selectedCalls.push(remainingCalls[randomIndex]);
      remainingCalls.splice(randomIndex, 1);
    }

    return selectedCalls.sort((a, b) => a.delay - b.delay);
  };

  // 生成终端步骤
  const generateTerminalSteps = (baseSteps: string[], apiCalls: ApiCall[]): TerminalStep[] => {
    const terminalSteps: TerminalStep[] = [];
    let apiCallIndex = 0;

    // 添加初始命令
    terminalSteps.push({
      id: "init",
      text: `$ a42z-engine --analyze --steps=${baseSteps.length}`,
      type: "command",
      duration: 0,
    });

    terminalSteps.push({
      id: "start",
      text: "Starting analysis pipeline...",
      type: "command",
      duration: 0,
    });

    // 交织步骤和API调用
    baseSteps.forEach((step, index) => {
      // 添加主要步骤
      terminalSteps.push({
        id: `step-${index}`,
        text: step,
        type: "command",
        duration: Math.floor(Math.random() * 600) + 200, // 保持原有的毫秒计算逻辑用于动画
      });

      // 在适当位置插入API调用
      if (apiCallIndex < apiCalls.length && Math.random() > 0.3) {
        const apiCall = apiCalls[apiCallIndex];
        terminalSteps.push({
          id: `api-${apiCallIndex}`,
          text: `Calling ${apiCall.title}...`,
          type: "api-call",
          duration: apiCall.duration,
          apiCall: apiCall,
        });
        apiCallIndex++;
      }
    });

    return terminalSteps;
  };

  useEffect(() => {
    if (!isVisible) {
      if (!hasStarted) {
        setCompletedSteps([]);
        setCurrentStep(null);
        setTerminalSteps([]);
        setVisibleApiCalls([]);
      }
      return;
    }

    if (!hasStarted) {
      setHasStarted(true);
      
      // 生成API调用配置
      const apiCalls = generateApiCalls(stepType);
      
      // 生成终端步骤
      const generatedSteps = generateTerminalSteps(steps, apiCalls);
      setTerminalSteps(generatedSteps);

      // 开始处理步骤
      let currentIndex = 0;
      const processSteps = () => {
        if (currentIndex < generatedSteps.length) {
          const step = generatedSteps[currentIndex];
          setCurrentStep(step.id);

          // 如果是API调用，添加到可见列表
          if (step.type === "api-call" && step.apiCall) {
            setTimeout(() => {
              setVisibleApiCalls(prev => [...prev, step.apiCall!]);
            }, step.apiCall.delay);
          }

          setTimeout(() => {
            setCompletedSteps(prev => [...prev, step.id]);
            setCurrentStep(null);
            currentIndex++;
            processSteps();
          }, step.duration);
        } else {
          setHasCompleted(true);
        }
      };

      processSteps();
    }
  }, [isVisible, steps, hasStarted, stepType]);

  // 如果已经开始过，即使isVisible为false也显示
  if (!isVisible && !hasStarted) return null;

  return (
    <div className="space-y-4">
      <Terminal className="w-full max-w-none bg-zinc-900/80 border-zinc-700">
        {terminalSteps.map((step, index) => {
          // 6种状态颜色系统
          const getStatusColor = (stepId: string) => {
            if (hasCompleted || completedSteps.includes(stepId)) {
              return 'text-white'; // 完成状态使用白色
            }
            if (currentStep === stepId) {
              return 'text-yellow-400'; // 进行中
            }
            
            // 根据步骤类型和索引分配不同颜色
            const stepIndex = terminalSteps.findIndex(s => s.id === stepId);
            const colorIndex = stepIndex % 6;
            const colors = [
              'text-blue-400',   // 蓝色
              'text-purple-400', // 紫色
              'text-cyan-400',   // 青色
              'text-pink-400',   // 粉色
              'text-orange-400', // 橙色
              'text-emerald-400' // 翠绿色
            ];
            return colors[colorIndex];
          };

          const getStatusIcon = (stepId: string) => {
            if (hasCompleted || completedSteps.includes(stepId)) {
              return '✓'; // 白色打勾
            }
            if (currentStep === stepId) {
              return '⟳'; // 进行中
            }
            return '○'; // 等待中
          };

          return (
            <AnimatedSpan 
              key={step.id} 
              delay={hasCompleted ? 0 : index * 50}
              className={`font-mono text-xs ${getStatusColor(step.id)}`}
            >
              {getStatusIcon(step.id)} {step.text}
              {currentStep === step.id && !hasCompleted && (
                <TypingAnimation 
                  delay={0} 
                  duration={30}
                  className="text-yellow-400 ml-2"
                >
                  ...processing
                </TypingAnimation>
              )}
            </AnimatedSpan>
          );
        })}
        


        {(hasCompleted || completedSteps.length === terminalSteps.length) && (
          <AnimatedSpan delay={hasCompleted ? 0 : 500} className="text-green-400 font-mono text-xs">
            Analysis completed successfully! ✓
          </AnimatedSpan>
        )}
      </Terminal>
      
      {/* API Calls List */}
      <div className="bg-zinc-900/60 border border-zinc-700/50 rounded-lg p-4">
        <div className="text-xs text-zinc-400 font-mono mb-3">API Calls & External Services</div>
        <div className="space-y-2">
          {visibleApiCalls.map((apiCall, index) => (
            <motion.div
              key={apiCall.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <ApiCallItem 
                icon={apiCall.icon} 
                title={apiCall.title} 
                description={apiCall.description}
                status={hasCompleted ? "completed" : "loading"}
                duration={`${apiCall.duration.toFixed(2)}`}
                tokenCost={apiCall.tokenCost}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Skeleton Components
function SkeletonCard() {
  return (
    <div className="animate-pulse">
      <div className="h-4 bg-zinc-700/50 rounded w-3/4 mb-2"></div>
      <div className="h-3 bg-zinc-700/30 rounded w-1/2"></div>
    </div>
  )
}

function SkeletonList() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="animate-pulse flex items-center space-x-3">
          <div className="h-3 w-3 bg-zinc-700/50 rounded-full"></div>
          <div className="h-3 bg-zinc-700/30 rounded flex-1"></div>
        </div>
      ))}
    </div>
  )
}

// Citation Tooltip Component
function CitationTooltip({ citation, children }: { citation: Citation; children: React.ReactNode }) {
  const [isVisible, setIsVisible] = useState(false)

  return (
    <div className="relative inline-block z-50">
      <div onMouseEnter={() => setIsVisible(true)} onMouseLeave={() => setIsVisible(false)} className="cursor-pointer">
        {children}
      </div>
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute z-50 bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 p-3 bg-zinc-900/95 backdrop-blur-sm border border-white/20 rounded-lg shadow-xl"
          >
            <div className="text-xs text-zinc-300 font-medium mb-1">{citation.source}</div>
            <div className="text-sm text-white mb-2">{citation.title}</div>
            <div className="text-xs text-zinc-400 truncate">{citation.url}</div>
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-zinc-900/95"></div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Expandable Card Component
function WorkflowCard({ step, onToggle }: { step: WorkflowStep; onToggle: (id: string) => void }) {
  return (
    <div
      className="backdrop-blur-md rounded-lg border border-white/20 shadow-lg bg-[rgba(24,24,27,0.7)] overflow-visible"
    >
      {step.id === "code-quality-research" ? (
        <ShinyButton
          onClick={() => !step.isExpanded && onToggle(step.id)}
          className={`w-full p-4 flex items-center justify-between text-left transition-colors ${!step.isExpanded ? 'hover:bg-white/5' : 'cursor-default'}`}
        >
          <div className="flex items-center gap-3">
            <div>
              <h3 className="text-white font-medium">{step.title}</h3>
            </div>
          </div>
          {!step.isExpanded && (
            <motion.div animate={{ rotate: 0 }} transition={{ duration: 0.2 }}>
              <ChevronRight className="w-5 h-5 text-zinc-400" />
            </motion.div>
          )}
        </ShinyButton>
      ) : ["technical-research", "business-research", "hackathon-research", "ai-analysis", "scoring", "debate"].includes(step.id) ? (
        <ShinyButton
          onClick={() => !step.isExpanded && onToggle(step.id)}
          className={`w-full p-4 flex items-center justify-between text-left transition-colors ${!step.isExpanded ? 'hover:bg-white/5' : 'cursor-default'}`}
        >
          <div className="flex items-center gap-3">
            <div>
              <h3 className="text-white font-medium">{step.title}</h3>
            </div>
          </div>
          {!step.isExpanded && (
            <motion.div animate={{ rotate: 0 }} transition={{ duration: 0.2 }}>
              <ChevronRight className="w-5 h-5 text-zinc-400" />
            </motion.div>
          )}
        </ShinyButton>
      ) : (
        <ShimmerButton
          borderRadius="0.25rem"
          onClick={() => !step.isExpanded && onToggle(step.id)}
          className={`w-full p-4 flex items-center justify-between text-left transition-colors ${!step.isExpanded ? 'hover:bg-white/5' : 'cursor-default'}`}
        >
          <div className="flex items-center gap-3">
            <div>
              <h3 className="text-white font-medium">{step.title}</h3>
            </div>
          </div>
          {!step.isExpanded && (
            <motion.div animate={{ rotate: 0 }} transition={{ duration: 0.2 }}>
              <ChevronRight className="w-5 h-5 text-zinc-400" />
            </motion.div>
          )}
        </ShimmerButton>
      )}

      <AnimatePresence mode="wait">
        {step.isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ 
              duration: 0.4,
              ease: [0.4, 0.0, 0.2, 1], // 使用更平滑的缓动函数
              opacity: { duration: 0.3 }
            }}
            className="border-t border-white/10 overflow-hidden"
          >
            <div className="p-4 space-y-4">
              {step.status === "loading" ? (
                <>
                  {step.internalSteps && (
                    <TerminalSteps 
                      steps={step.internalSteps} 
                      isVisible={((step.status as WorkflowStep['status']) === "loading" || (step.status as WorkflowStep['status']) === "completed")}
                      stepType={step.id}
                    />
                  )}
                  {!step.internalSteps && <SkeletonList />}
                </>
              ) : (
                <>
                  {/* 显示Terminal步骤（如果存在且已完成） */}
                  {step.internalSteps && step.status === "completed" && (
                    <TerminalSteps 
                      steps={step.internalSteps} 
                      isVisible={true}
                      stepType={step.id}
                    />
                  )}
                  
                  {step.content && <div className="text-zinc-300 text-sm leading-relaxed mt-4">{step.content}</div>}

                  {step.citations && step.citations.length > 0 && (
                    <div className="space-y-2 mt-4">
                      <h4 className="text-zinc-400 text-xs font-medium uppercase tracking-wide">Sources</h4>
                      <div className="flex flex-wrap gap-2">
                        {step.citations.map((citation) => (
                          <CitationTooltip key={citation.id} citation={citation}>
                            <a
                              href={citation.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-2 py-1 bg-zinc-800/50 hover:bg-zinc-700/50 rounded text-xs text-zinc-300 border border-white/10 transition-colors"
                            >
                              <ExternalLink className="w-3 h-3" />
                              {citation.source}
                            </a>
                          </CitationTooltip>
                        ))}
                      </div>
                    </div>
                  )}

                  {step.substeps && (
                    <div className="space-y-2 mt-4">
                      {step.substeps.map((substep) => (
                        <WorkflowCard key={substep.id} step={substep} onToggle={onToggle} />
                      ))}
                    </div>
                  )}

                  {/* 只在 code-quality-research 和 business-research 展示 API Calls & External Services + TerminalSteps */}
                  {(["code-quality-research", "business-research"].includes(step.id) && step.internalSteps) && (
                    <>
                      <div className="mb-2 text-xs text-zinc-400 font-semibold uppercase tracking-wider">
                        API Calls & External Services
                      </div>
                      <TerminalSteps 
                        steps={step.internalSteps} 
                        isVisible={((step.status as WorkflowStep['status']) === "loading" || (step.status as WorkflowStep['status']) === "completed")}
                        stepType={step.id}
                      />
                    </>
                  )}
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Keyword Tab Component
function ProjectDescription({
  description,
  onDescriptionChange,
}: {
  description: string
  onDescriptionChange: (description: string) => void
}) {
  const [isEditing, setIsEditing] = useState(false)
  const [tempDescription, setTempDescription] = useState(description)

  // 从localStorage加载保存的描述，或者使用传入的description
  useEffect(() => {
    const savedDescription = localStorage.getItem('a42z-project-description')
    if (savedDescription && !description) {
      onDescriptionChange(savedDescription)
      setTempDescription(savedDescription)
    } else if (description && !savedDescription) {
      // 如果传入的description不为空，但localStorage中没有，则保存到localStorage
      localStorage.setItem('a42z-project-description', description)
      setTempDescription(description)
    } else if (description) {
      // 如果传入的description不为空，直接使用
      setTempDescription(description)
    }
  }, [description, onDescriptionChange])

  // 保存描述到localStorage
  useEffect(() => {
    if (description) {
      localStorage.setItem('a42z-project-description', description)
    }
  }, [description])

  const handleSave = () => {
    if (tempDescription.trim()) {
      // 限制为100个字符
      const limitedDescription = tempDescription.trim().slice(0, 100)
      onDescriptionChange(limitedDescription)
      setIsEditing(false)
    }
  }

  const handleCancel = () => {
    setTempDescription(description)
    setIsEditing(false)
  }

  return (
    <div className="space-y-4">
      {isEditing ? (
        <div className="space-y-3">
          <div className="space-y-2">
            <textarea
              value={tempDescription}
              onChange={(e) => {
                const value = e.target.value
                // 限制输入为100个字符
                if (value.length <= 100) {
                  setTempDescription(value)
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && e.metaKey) {
                  handleSave()
                } else if (e.key === "Escape") {
                  handleCancel()
                }
              }}
              placeholder="Describe your project in detail... (max 100 characters)"
              className="w-full px-4 py-3 bg-zinc-900/50 text-white rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-white-50 placeholder-zinc-500 resize-none whitespace-pre-wrap break-words"
              rows={4}
              autoFocus
              maxLength={100}
            />
            <div className="flex justify-between items-center text-xs">
              <span className="text-zinc-400">
                {tempDescription.length}/100 characters
              </span>
              {tempDescription.length > 90 && (
                <span className={`text-sm ${tempDescription.length >= 100 ? 'text-red-400' : 'text-yellow-400'}`}>
                  {tempDescription.length >= 100 ? 'Character limit reached!' : 'Almost at limit'}
                </span>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <ShimmerButton
              borderRadius="0.25rem"
              onClick={handleSave}
              className="px-4 py-2 bg-green-600/20 hover:bg-green-600/30 text-green-400 border border-green-500/30"
            >
              Save
            </ShimmerButton>
            <ShimmerButton
              borderRadius="0.25rem"
              onClick={handleCancel}
              className="px-4 py-2 bg-zinc-600/20 hover:bg-zinc-600/30 text-zinc-400 border border-zinc-500/30"
            >
              Cancel
            </ShimmerButton>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {description ? (
            <div className="relative group">
              <TextAnimate
                animation="blurIn"
                className="text-lg text-white leading-relaxed whitespace-pre-wrap break-words overflow-hidden"
                by="word"
              >
                {description}
              </TextAnimate>
              <button
                onClick={() => setIsEditing(true)}
                className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-white/10 rounded"
              >
                <FileText className="w-4 h-4 text-zinc-400" />
              </button>
            </div>
          ) : (
            <div className="text-center py-8">
              <TextAnimate
                animation="fadeIn"
                className="text-zinc-400 mb-4"
                by="word"
              >
                No project description yet
              </TextAnimate>
              <ShimmerButton
                borderRadius="0.25rem"
                onClick={() => setIsEditing(true)}
                className="px-6 py-3 bg-zinc-800/30 hover:bg-zinc-700/50 text-zinc-300 border border-white/10 border-dashed"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Project Description
              </ShimmerButton>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// URL validation function
function isValidGitHubUrl(url: string): boolean {
  try {
    const urlObj = new URL(url)
    // 检查是否是GitHub域名
    const isGitHubDomain = urlObj.hostname === 'github.com' || urlObj.hostname === 'www.github.com'
    // 检查协议是否是http或https
    const isValidProtocol = urlObj.protocol === 'http:' || urlObj.protocol === 'https:'
    // 检查路径是否包含用户名和仓库名 (至少有两级路径)
    const pathParts = urlObj.pathname.split('/').filter(part => part.length > 0)
    const hasValidPath = pathParts.length >= 2
    
    return isGitHubDomain && isValidProtocol && hasValidPath
  } catch {
    return false
  }
}

// GitHub Link Modal Component
function GitHubLinkModal({
  isOpen,
  onClose,
  onSave,
}: {
  isOpen: boolean
  onClose: () => void
  onSave: (link: string) => void
}) {
  const [githubLink, setGithubLink] = useState("")
  const [isValidUrl, setIsValidUrl] = useState(false)
  const [showError, setShowError] = useState(false)

  const handleSave = () => {
    if (githubLink.trim() && isValidUrl) {
      onSave(githubLink.trim())
      setGithubLink("")
      setIsValidUrl(false)
      setShowError(false)
      onClose()
    } else {
      setShowError(true)
    }
  }

  const handleCancel = () => {
    setGithubLink("")
    setIsValidUrl(false)
    setShowError(false)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div
        className="rounded-2xl bg-black/80 shadow-2xl border border-white/10 px-8 py-6 max-w-md w-full mx-4"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 mb-4">
          <Github className="w-6 h-6 text-zinc-400" />
          <h3 className="text-xl font-bold text-white">GitHub Repository Link</h3>
        </div>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="github-link" className="block text-sm font-medium text-zinc-300 mb-2">
              Repository URL
            </label>
            <input
              id="github-link"
              type="url"
              value={githubLink}
              onChange={(e) => {
                const value = e.target.value
                setGithubLink(value)
                setShowError(false)
                
                if (value.trim()) {
                  const valid = isValidGitHubUrl(value.trim())
                  setIsValidUrl(valid)
                } else {
                  setIsValidUrl(false)
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSave()
                } else if (e.key === "Escape") {
                  handleCancel()
                }
              }}
              placeholder="https://github.com/username/repository"
              className={`w-full px-4 py-3 bg-zinc-900/50 text-white rounded-lg border focus:outline-none focus:ring-2 focus:ring-white-50 placeholder-zinc-500 ${
                showError 
                  ? 'border-red-500/50 focus:ring-red-500/50' 
                  : isValidUrl 
                    ? 'border-green-500/50 focus:ring-green-500/50' 
                    : 'border-white/20'
              }`}
              autoFocus
            />
            {showError && (
              <div className="text-red-400 text-sm mt-2 flex items-center gap-2">
                <span>⚠️</span>
                <span>Please enter a valid GitHub repository URL (e.g., https://github.com/username/repository)</span>
              </div>
            )}
            {isValidUrl && !showError && (
              <div className="text-green-400 text-sm mt-2 flex items-center gap-2">
                <span>✅</span>
                <span>Valid GitHub repository URL</span>
              </div>
            )}
          </div>
          
          <div className="flex gap-3">
            <ShimmerButton
              borderRadius="0.25rem"
              onClick={handleSave}
              disabled={!githubLink.trim() || !isValidUrl}
              className="flex-1 px-4 py-2 bg-green-600/20 hover:bg-green-600/30 disabled:bg-zinc-700/20 disabled:cursor-not-allowed text-green-400 border border-green-500/30"
            >
              Save
            </ShimmerButton>
            <ShimmerButton
              borderRadius="0.25rem"
              onClick={handleCancel}
              className="flex-1 px-4 py-2 bg-zinc-600/20 hover:bg-zinc-600/30 text-zinc-400 border border-zinc-500/30"
            >
              Cancel
            </ShimmerButton>
          </div>
        </div>
      </div>
    </div>
  )
}

// File Upload Component
function FileUploadSection({
  files,
  onFileUpload,
}: {
  files: UploadedFile[]
  onFileUpload: (file: File | string, type: UploadedFile["type"]) => void
}) {
  const [showGitHubModal, setShowGitHubModal] = useState(false)
  const fileInputRefs = {
    pdf: useRef<HTMLInputElement>(null),
  }

  const uploadTypes = [
    { type: "pdf" as const, label: "Pitch Deck PDF", icon: FileText, required: true },
    { type: "github" as const, label: "GitHub Repo", icon: Github, required: true },
  ]

  const handleFileSelect = (type: UploadedFile["type"]) => {
    if (type === "github") {
      setShowGitHubModal(true)
    } else {
      fileInputRefs[type].current?.click()
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: UploadedFile["type"]) => {
    const file = e.target.files?.[0]
    if (file) {
      onFileUpload(file, type)
    }
  }

  const handleGitHubLinkSave = (link: string) => {
    // 直接传递GitHub链接字符串
    onFileUpload(link, "github")
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {uploadTypes.map(({ type, label, icon: Icon, required }) => {
          const uploadedFile = files.find((f) => f.type === type)

          return (
            <div key={type} className="relative">
              {type === "pdf" && (
                <input
                  ref={fileInputRefs[type]}
                  type="file"
                  onChange={(e) => handleFileChange(e, type)}
                  className="hidden"
                  accept=".pdf"
                />
              )}

              <ShimmerButton
                borderRadius="0.25rem"
                onClick={() => handleFileSelect(type)}
                className={`w-full p-4 rounded-lg border-2 border-dashed transition-all min-w-0 ${
                  uploadedFile
                    ? "border-green-400/50 bg-green-400/10"
                    : "border-white/20 hover:border-white/40 bg-zinc-800/30 hover:bg-zinc-700/30"
                }`}
              >
                <div className="flex flex-col items-center gap-2 w-full min-w-0">
                  <Icon className={`w-6 h-6 ${uploadedFile ? "text-green-400" : "text-zinc-400"}`} />
                  <div className="text-center w-full">
                    <div className={`font-medium ${uploadedFile ? "text-green-300" : "text-zinc-300"} max-w-full truncate`}>
                      {uploadedFile ? uploadedFile.name : label}
                      {required && <span className="text-red-400 ml-1">*</span>}
                    </div>
                    {uploadedFile && (
                      <div className="text-xs text-zinc-400 mt-1 max-w-full truncate">
                        {uploadedFile.status === "uploading" && "Uploading..."}
                        {uploadedFile.status === "completed" && "Uploaded successfully"}
                        {uploadedFile.status === "error" && "Upload failed"}
                      </div>
                    )}
                  </div>
                </div>
              </ShimmerButton>
            </div>
          )
        })}
      </div>

      <GitHubLinkModal
        isOpen={showGitHubModal}
        onClose={() => setShowGitHubModal(false)}
        onSave={handleGitHubLinkSave}
      />
    </>
  )
}

// AI Twins Debate Component
function AITwinsDebate({ twins, debateRound }: { twins: AITwin[]; debateRound: number }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-zinc-300 font-medium">Carbon Panel Debate</h4>
        <div className="text-xs text-zinc-400 bg-zinc-800/50 px-2 py-1 rounded">Round {debateRound}/3</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {twins.map((twin) => (
          <motion.div
            key={twin.id}
            className={`p-4 rounded-lg border transition-all ${
              twin.thinking ? "border-white-400/50 bg-white-400/10" : "border-white/20 bg-zinc-800/30"
            }`}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="text-2xl">{twin.avatar}</div>
              <div>
                <div className="text-white font-medium">{twin.name}</div>
                <div className="text-xs text-zinc-400">{twin.role}</div>
              </div>
              {twin.thinking && <Loader2 className="w-4 h-4 animate-spin text-white-400 ml-auto" />}
            </div>

            {twin.message ? (
              <div className="text-sm text-zinc-300 leading-relaxed">{twin.message}</div>
            ) : twin.thinking ? (
              <SkeletonCard />
            ) : (
              <div className="text-sm text-zinc-500 italic">Waiting for turn...</div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// Main Component
export default function A42zJudgeWorkflow() {
  const [projectDescription, setProjectDescription] = useState("")
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [workflowSteps, setWorkflowSteps] = useState<WorkflowStep[]>([])
  const [currentStep, setCurrentStep] = useState(0)
  const [twins] = useState<AITwin[]>(aiTwins)
  const [debateRound] = useState(1)
  const [isStarted, setIsStarted] = useState(false)
  const [showRankModal, setShowRankModal] = useState(false);
  const [showLogin, setShowLogin] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [loginFading, setLoginFading] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [difyAnalysis, setDifyAnalysis] = useState<DifyResponse | null>(null);
  const [isAnalyzingWithDify, setIsAnalyzingWithDify] = useState(false);
  const [webhookStatus, setWebhookStatus] = useState<'idle' | 'configuring' | 'configured' | 'error'>('idle');
  const [databaseAnalysis, setDatabaseAnalysis] = useState<DatabaseAnalysis | null>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;
    
    let ticking = false;
    let lastY = window.scrollY;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const y = window.scrollY;
          if (y > lastY) {
            // setShowNav(false); // hide on scroll down
          } else if (y < lastY) {
            // setShowNav(true); // show on scroll up
          }
          // setLastScroll(y);
          lastY = y;
          ticking = false;
        });
        ticking = true;
      }
    };
    const handleMouseMove = (e: MouseEvent) => {
      if (e.clientY < 32) {
        // setShowNav(true); // show if mouse at top
      }
    };
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches[0]?.clientY < 32) {
        // setShowNav(true); // show if tap top
      }
    };
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchstart", handleTouchStart);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchstart", handleTouchStart);
    };
  }, [isClient]);

  useEffect(() => {
    if (!isClient) return;
    
    // 检查是否为localhost环境
    if (isLocalhost()) {
      // 在localhost环境下自动设置为已登录状态
      setIsLoggedIn(true);
      setShowLogin(false);
      setLoginFading(false);
      setUserEmail('localhost@a42z.dev');
    }

    // 配置Dify webhook
    const configureWebhook = async () => {
      try {
        setWebhookStatus('configuring');
        const success = await difyAPI.configureWebhook();
        setWebhookStatus(success ? 'configured' : 'error');
        
        if (success) {
          console.log('Dify webhook configured successfully');
        } else {
          console.error('Failed to configure Dify webhook');
        }
      } catch (error) {
        console.error('Error configuring webhook:', error);
        setWebhookStatus('error');
      }
    };

    configureWebhook();
  }, [isClient]);

  useEffect(() => {
    if (!isClient) return;
    
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session && session.user) {
        setIsLoggedIn(true);
        setShowLogin(false);
        setLoginFading(false);
        setUserEmail(session.user.email ?? null);
      } else {
        setIsLoggedIn(false);
        setUserEmail(null);
      }
    });

    // 检查初始登录状态（页面刷新后自动登录）
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session && session.user) {
        setIsLoggedIn(true);
        setShowLogin(false);
        setLoginFading(false);
        setUserEmail(session.user.email ?? null);
      }
    });

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, [isClient]);

  // Initialize workflow steps
  useEffect(() => {
    const steps: WorkflowStep[] = [
      {
        id: "keywords",
        title: "Project Description Analysis",
        description: "Analyzing your detailed project description",
        status: "pending",
        isExpanded: false,
      },
      {
        id: "upload",
        title: "Document Upload",
        description: "Upload your pitch deck, code samples, and roadmap",
        status: "pending",
        isExpanded: false,
      },
      {
        id: "technical-research",
        title: "Technical Homeomorphism Researcher",
        description: "Analyzing similar technical implementations from code repositories",
        status: "pending",
        isExpanded: false,
        internalSteps: [
          "Code Repository Discovery",
          "Architecture Pattern Analysis",
          "Technology Stack Mapping",
          "Implementation Similarity Assessment",
          "Code Quality Benchmarking",
          "Performance Pattern Recognition",
          "Security Implementation Review",
          "Technical Innovation Evaluation"
        ],
        citations: [
          {
            id: "1",
            title: "Similar AI Healthcare Projects on GitHub",
            url: "https://github.com",
            source: "GitHub",
          },
          { id: "2", title: "Computer Vision Health Apps on GitLab", url: "https://gitlab.com", source: "GitLab" },
        ],
      },
      {
        id: "code-quality-research",
        title: "Code Quality Researcher",
        description: "Evaluating code quality, maintainability, and best practices",
        status: "pending",
        isExpanded: false,
        internalSteps: [
          "Static Code Analysis",
          "Code Complexity Assessment",
          "Test Coverage Evaluation",
          "Documentation Quality Review",
          "Code Style and Standards Check",
          "Performance Optimization Analysis",
          "Security Vulnerability Scan",
          "Maintainability Index Calculation"
        ],
        citations: [
          {
            id: "3",
            title: "Code Quality Metrics on SonarQube",
            url: "https://sonarqube.org",
            source: "SonarQube",
          },
          { id: "4", title: "GitHub Code Quality Analysis", url: "https://github.com/features/security", source: "GitHub Security" },
          { id: "5", title: "Code Complexity Analysis", url: "https://github.com/features/code-quality", source: "GitHub Code Quality" },
          { id: "6", title: "Security Vulnerability Database", url: "https://nvd.nist.gov", source: "NIST NVD" },
        ],
      },
      {
        id: "business-research",
        title: "Business Potential Researcher",
        description: "Finding related business ideas from tech news sources",
        status: "pending",
        isExpanded: false,
        internalSteps: [
          "Problem Defining and Planning",
          "Domain Mapping and Scope Definition", 
          "Competitive Benchmarking",
          "Homogeneity Analysis",
          "Performance Correlation Assessment",
          "Value Creation Opportunity Identification",
          "Risk and Saturation Analysis",
          "Strategic Information Synthesis"
        ],
        citations: [
          {
            id: "7",
            title: "Similar AI Healthcare Startups Raise $50M",
            url: "https://techcrunch.com",
            source: "TechCrunch",
          },
          { id: "8", title: "Mobile Health Apps Market Analysis", url: "https://crunchbase.com", source: "Crunchbase" },
          { id: "9", title: "Y Combinator Healthcare Portfolio", url: "https://ycombinator.com/companies", source: "Y Combinator" },
          { id: "10", title: "Healthcare AI Investment Trends", url: "https://crunchbase.com/industry/healthcare-ai", source: "Crunchbase" },
          { id: "11", title: "TechCrunch Health Tech Coverage", url: "https://techcrunch.com/tag/healthtech", source: "TechCrunch" },
          { id: "12", title: "Y Combinator Startup Database", url: "https://ycombinator.com/companies/healthcare", source: "Y Combinator" },
        ],
      },
      {
        id: "hackathon-research",
        title: "Hackathon Project Analysis",
        description: "Analyzing similar projects from hackathon platforms",
        status: "pending",
        isExpanded: false,
        internalSteps: [
          "Project Pattern Recognition",
          "Technology Stack Analysis",
          "Innovation Level Assessment",
          "Implementation Complexity Evaluation",
          "Market Fit Analysis",
          "Scalability Potential Review",
          "Technical Feasibility Check",
          "Competitive Advantage Mapping"
        ],
        citations: [
          { id: "13", title: "AI Healthcare Projects on DevPost", url: "https://devpost.com", source: "DevPost" },
          { id: "14", title: "Computer Vision Health Apps", url: "https://hackathon.com", source: "Hackathon.com" },
        ],
      },
      {
        id: "ai-analysis",
        title: "Multimodal AI Analysis",
        description: "a42z Engine analyzing your project comprehensively",
        status: "pending",
        isExpanded: false,
        internalSteps: [
          "Code Quality Assessment",
          "Architecture Pattern Recognition",
          "Algorithm Complexity Analysis",
          "Data Pipeline Evaluation",
          "Model Performance Review",
          "Security Vulnerability Scan",
          "Scalability Analysis",
          "Integration Compatibility Check"
        ],
      },
      {
        id: "scoring",
        title: "Benchmark Scoring",
        description: "Generating scores based on hackathon rubric",
        status: "pending",
        isExpanded: false,
        internalSteps: [
          "Technical Implementation Scoring",
          "Innovation Level Evaluation",
          "Market Potential Assessment",
          "Presentation Quality Review",
          "Code Quality Metrics",
          "User Experience Analysis",
          "Business Model Validation",
          "Overall Score Calculation"
        ],
      },
      {
        id: "debate",
        title: "Carbon Panel Debate",
        description: "AI twins discussing and evaluating your project",
        status: "pending",
        isExpanded: false,
        internalSteps: [
          "Initial Project Review",
          "Technical Feasibility Debate",
          "Market Opportunity Discussion",
          "Innovation Level Assessment",
          "Risk Factor Analysis",
          "Investment Potential Evaluation",
          "Competitive Landscape Review",
          "Final Consensus Building"
        ],
      },
    ]
    setWorkflowSteps(steps)
  }, [])

  const handleStart = async () => {
    if (!isLoggedIn && !(isClient && isLocalhost())) {
      setShowLogin(true);
      return;
    }
    if (!projectDescription.trim()) return

    setIsStarted(true)

    // Step 1: Project Description Analysis
    setWorkflowSteps((prev) =>
      prev.map((step) => (step.id === "keywords" ? { ...step, status: "loading", isExpanded: true } : step)),
    )

    // 立即展开Upload Documents框
    setCurrentStep(1)

    // Simulate project description analysis
    setTimeout(() => {
      setWorkflowSteps((prev) =>
        prev.map((step) =>
          step.id === "keywords"
            ? {
                ...step,
                status: "completed",
                content:
                  "Project description analyzed successfully. Your detailed description will be used for comprehensive evaluation.",
              }
            : step,
        ),
      )
    }, 2000)
  }

  const handleFileUpload = async (file: File | string, type: UploadedFile["type"]) => {
    const newFile: UploadedFile = {
      id: Math.random().toString(36).substr(2, 9),
      name: typeof file === "string" ? file : file.name,
      type,
      status: "uploading",
    }

    setFiles((prev) => [...prev.filter((f) => f.type !== type), newFile])

    // Simulate upload
    setTimeout(async () => {
      setFiles((prev) => {
        const updatedFiles = prev.map((f) => (f.id === newFile.id ? { ...f, status: "completed" as const } : f));
        
        // 如果所有必需的文件都上传完成，自动开始分析
        if (updatedFiles.filter((f) => f.status === "completed").length === 2) {
          setTimeout(() => continueWorkflow(), 1000);
        }
        
        return updatedFiles;
      });

      // 如果是GitHub仓库，调用Dify API进行分析
      if (type === "github" && typeof file === "string") {
        try {
          setIsAnalyzingWithDify(true)
          const analysis = await difyAPI.analyzeGitHubRepo(file)
          setDifyAnalysis(analysis)
          console.log('Dify Analysis Result:', analysis)
          
          // 从数据库获取分析结果
          await fetchAnalysisFromDatabase(file)
        } catch (error) {
          console.error('Dify API Error:', error)
          // 即使Dify API失败，也不影响主流程
        } finally {
          setIsAnalyzingWithDify(false)
        }
      }
    }, 1500)
  }

  // 从数据库获取分析结果
  const fetchAnalysisFromDatabase = async (githubUrl: string) => {
    try {
      const { data, error } = await supabase
        .from('judge_comments')
        .select('*')
        .eq('github_repo_url', githubUrl)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error) {
        console.error('Database fetch error:', error);
      } else if (data) {
        setDatabaseAnalysis(data);
        console.log('Analysis result from database:', data);
      }
    } catch (error) {
      console.error('Error fetching from database:', error);
    }
  }

  const handleStepToggle = (stepId: string) => {
    setWorkflowSteps((prev) =>
      prev.map((step) => (step.id === stepId ? { ...step, isExpanded: true } : step)),
    )
  }



  const continueWorkflow = () => {
    if (currentStep < workflowSteps.length - 1) {
      const nextStep = workflowSteps[currentStep + 1]

      setWorkflowSteps((prev) =>
        prev.map((step) =>
          step.id === nextStep.id
            ? { ...step, status: "loading", isExpanded: true }
            : { ...step, isExpanded: step.isExpanded },
        )
      )

      // 对于Technical Homeomorphism Researcher，等待Dify分析完成
      const processingTime = nextStep.id === "technical-research" ? 12000 : (nextStep.internalSteps ? 8000 : 3000);
      
      setTimeout(() => {
        setWorkflowSteps((prev) =>
          prev.map((step) =>
            step.id === nextStep.id
              ? {
                  ...step,
                  status: "completed",
                  content: getStepContent(nextStep.id),
                  isExpanded: true,
                }
              : { ...step, isExpanded: step.isExpanded },
          ),
        )
        setCurrentStep((prev) => prev + 1)
        
        // 自动进行下一步
        if (currentStep + 1 < workflowSteps.length - 1) {
          setTimeout(() => continueWorkflow(), 1000);
        }
      }, processingTime)
    }
  }



  const getStepContent = (stepId: string): string => {
    switch (stepId) {
      case "technical-research":
        // 优先显示Dify API结果
        if (difyAnalysis?.answer) {
          return `Dify AI Analysis: ${difyAnalysis.answer}`
        }
        // 如果没有Dify结果，显示数据库中的分析结果
        if (databaseAnalysis?.analysis_result) {
          return `Database Analysis: ${databaseAnalysis.analysis_result}`
        }
        return "Discovered 23 similar technical implementations across GitHub and GitLab. Identified common architectural patterns and technology stacks in healthcare AI projects."
      case "code-quality-research":
        return "Code quality analysis completed. Maintainability Index: 85/100, Test Coverage: 78%, Security Score: 92/100, Performance Grade: A-, Code Complexity: Low, Documentation Quality: Excellent. Overall Code Quality: 8.7/10. Identified 3 minor security vulnerabilities and 5 optimization opportunities."
      case "business-research":
        return "Business potential analysis completed. Found 15 related startups in healthcare AI space. Y Combinator portfolio shows 8 similar companies with average $12M funding. Crunchbase data indicates $2.3B total funding in Q4 2024. TechCrunch reports 23 new healthcare AI startups launched this quarter. Market opportunity: $45B by 2027."
      case "hackathon-research":
        return "Analyzed 47 similar hackathon projects. Common patterns include mobile-first approach and real-time processing capabilities."
      case "ai-analysis":
        return "Comprehensive analysis completed. Technical feasibility: High. Market potential: Strong. Innovation score: 8.2/10."
      case "scoring":
        return "Technical Implementation: 85/100, Innovation: 82/100, Market Potential: 78/100, Presentation: 88/100. Overall Score: 83.25/100"
      case "debate":
        return "Carbon Panel debate completed after 3 rounds. Consensus reached on project strengths and improvement areas."
      default:
        return "Processing completed successfully."
    }
  }

  const anyStepExpanded = workflowSteps.some(step => step.isExpanded);

  // 在 A42zJudgeWorkflow 组件内，定义一个 handleLogout 函数：
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsLoggedIn(false);
    setShowLogin(true);
    setUserEmail(null);
    if (isClient) {
      localStorage.clear();
      sessionStorage.clear();
    }
  };

  return (
    <>
      <nav className="fixed top-8 left-1/2 -translate-x-1/2 z-50 flex gap-4 px-6 py-2 rounded-xl backdrop-blur bg-black/60 border border-white/10 shadow-lg transition-all duration-300 sm:top-2 sm:gap-2 sm:px-2 sm:py-1 sm:text-xs sm:rounded-lg" style={{width:'max-content'}}>
        <Link href="/" passHref legacyBehavior><RainbowButton className="sm:px-2 sm:py-1" asChild><a>Home</a></RainbowButton></Link>
        <Link href="/judge" passHref legacyBehavior><RainbowButton className="sm:px-2 sm:py-1" asChild><a>Judge</a></RainbowButton></Link>
        <Link href="/manifesto" passHref legacyBehavior><RainbowButton className="sm:px-2 sm:py-1" asChild><a>Manifesto</a></RainbowButton></Link>
        <span ><RainbowButton asChild><span className="sm:px-2 sm:py-1" role="button" tabIndex={0} onClick={() => setShowRankModal(true)}>Rank</span></RainbowButton></span>
      </nav>
      {showRankModal && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowRankModal(false)}>
          <div
            className="mt-24 rounded-2xl bg-black/80 shadow-2xl border border-white/10 px-8 py-6 max-w-md w-full flex flex-col items-center animate-slideDown"
            style={{animation: 'slideDown 0.4s cubic-bezier(0.4,0,0.2,1)'}}
            onClick={e => e.stopPropagation()}
          >
            <span className="text-2xl font-bold text-white mb-2">🚧 Under development</span>
            <span className="text-zinc-300 text-center">The Rank feature is coming soon!</span>
            <button className="mt-6 px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition" onClick={() => setShowRankModal(false)}>Close</button>
          </div>
          <style jsx global>{`
            @keyframes slideDown {
              0% { transform: translateY(-40px); opacity: 0; }
              100% { transform: translateY(0); opacity: 1; }
            }
          `}</style>
        </div>
      )}
      {/* Login Modal */}
      {showLogin && !isLoggedIn && (
        <div
          className={`fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity duration-500 ${loginFading ? 'opacity-0' : 'opacity-100'}`}
        >
          <MagicCard className="rounded-2xl shadow-2xl border-2 border-white/30 bg-gradient-to-b from-zinc-200 to-zinc-100 max-w-sm w-full mx-4">
            <form className="flex flex-col items-center gap-4 p-8" onSubmit={e => e.preventDefault()}>
              <div className="flex items-center justify-center gap-2 mb-2">
                <Image src="https://cslplhzfcfvzsivsgrpc.supabase.co/storage/v1/object/public/img//a42z-black.png" alt="a42z" width={80} height={80} />
                <span className="text-xl text-black align-middle" style={{lineHeight: '1.75em', display: 'inline-block'}}>Early Access</span>
              </div>
              {loginError && <span className="text-red-400 text-sm">{loginError}</span>}
              <div className="flex flex-col gap-2 w-full mt-4">
                <RainbowButton
                  type="button"
                  onClick={async () => {
                    const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' });
                    if (error) setLoginError(error.message);
                  }}
                  className="w-full"
                >
                  <span className="inline-flex items-center gap-2">
                    <Image src="https://cslplhzfcfvzsivsgrpc.supabase.co/storage/v1/object/public/img//google.png" alt="Google logo" width={20} height={20} style={{ display: 'inline-block', verticalAlign: 'middle' }} />
                    Sign in with Google
                  </span>
                </RainbowButton>
              </div>
            </form>
          </MagicCard>
        </div>
      )}

              {/* Dify Analysis Status */}
        {isAnalyzingWithDify && (
          <div className="fixed top-4 right-4 bg-zinc-900/95 border border-white/20 rounded-lg p-4 z-40">
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span className="text-sm text-white">Analyzing with Dify AI...</span>
            </div>
          </div>
        )}

        {/* Webhook Status */}
        {webhookStatus !== 'idle' && (
          <div className="fixed top-4 left-4 bg-zinc-900/95 border border-white/20 rounded-lg p-4 z-40">
            <div className="flex items-center gap-2">
              {webhookStatus === 'configuring' && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400"></div>
              )}
              {webhookStatus === 'configured' && (
                <div className="w-4 h-4 bg-green-400 rounded-full"></div>
              )}
              {webhookStatus === 'error' && (
                <div className="w-4 h-4 bg-red-400 rounded-full"></div>
              )}
              <span className="text-sm text-white">
                {webhookStatus === 'configuring' && 'Configuring Dify Webhook...'}
                {webhookStatus === 'configured' && 'Dify Webhook Ready'}
                {webhookStatus === 'error' && 'Webhook Configuration Failed'}
              </span>
            </div>
          </div>
        )}

      <div className="fixed inset-0 -z-20 w-full h-full bg-black" />
      <div className="fixed inset-0 -z-10 w-full h-full">
        <FlickeringGrid className="w-full h-full" color="#fff" />
      </div>
      <div className="min-h-screen flex flex-col justify-center items-center">
        <div className={`container mx-auto px-4 py-8 transition-all duration-300 ${anyStepExpanded ? 'mt-16' : ''}`}>
          {/* Header */}
          <div className="text-center mb-8">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl font-bold text-white mb-2 flex justify-center items-center"
              style={{ fontFamily: "'Chakra Petch', sans-serif" }}
            >
              <Image src="https://cslplhzfcfvzsivsgrpc.supabase.co/storage/v1/object/public/img//a42z.png" alt="a42z Judge Logo" width={400} height={400} />
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-zinc-400"
            >
              The World&apos;s First AI Judge for Hackathons — Autonomous, Insightful, and Fair.
            </motion.p>
          </div>

          {/* Main Content */}
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Input Section */}
            {!isStarted && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="backdrop-blur-md rounded-lg p-6 border border-white/20 shadow-lg bg-[rgba(24,24,27,0.7)]"
              >
                <div className="space-y-4">
                  <div>
                    <input
                      type="text"
                      value={projectDescription}
                      onChange={(e) => setProjectDescription(e.target.value)}
                      placeholder="Describe your project in 1 sentence"
                      className="w-full px-4 py-3 bg-zinc-900/50 text-white rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-white-50 placeholder-zinc-500"
                    />
                  </div>
                  <ShimmerButton
                    borderRadius="0.25rem"
                    onClick={handleStart}
                    disabled={!projectDescription.trim()}
                    className="w-full py-3 bg-white-600 hover:bg-white-700 disabled:bg-zinc-700 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
                  >
                    Start Analysis
                  </ShimmerButton>
                </div>
              </motion.div>
            )}

            {/* Workflow Steps */}
            {isStarted && (
              <div className="space-y-4">
                {/* Project Description Section */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="backdrop-blur-md rounded-lg p-6 border border-white/20 shadow-lg bg-[rgba(24,24,27,0.7)]"
                >
                  <h3 className="text-white font-medium mb-4">Project Description</h3>
                  <ProjectDescription 
                    description={projectDescription} 
                    onDescriptionChange={setProjectDescription}
                  />
                </motion.div>

                {/* File Upload Section */}
                {currentStep >= 1 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="backdrop-blur-md rounded-lg p-6 border border-white/20 shadow-lg bg-[rgba(24,24,27,0.7)]"
                  >
                    <h3 className="text-white font-medium mb-4">Upload Documents</h3>
                    <FileUploadSection files={files} onFileUpload={handleFileUpload} />

                  </motion.div>
                )}

                                {/* Workflow Steps */}
                {workflowSteps.slice(2).map((step, index) => (
                  <motion.div
                    key={step.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <WorkflowCard step={step} onToggle={handleStepToggle} />

                    {/* AI Twins Debate */}
                    {step.id === "debate" && step.status === "completed" && step.isExpanded && (
                      <div className="mt-4">
                        <AITwinsDebate twins={twins} debateRound={debateRound} />
                      </div>
                    )}

 
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      {/* 修改右上角 avatar 的定位和样式 */}
      <div className="fixed top-8 right-8 z-50">
        {isLoggedIn && (
          <AccountDropdown userEmail={userEmail} onLogout={handleLogout} />
        )}
      </div>
    </>
  )
}

function AccountDropdown({ userEmail, onLogout }: { userEmail: string | null, onLogout: () => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // 点击外部关闭
  React.useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  return (
    <div ref={ref} className="relative flex items-center">
      <motion.div
        whileTap={{ scale: 0.95 }}
        className="cursor-pointer"
        onClick={() => setOpen((v) => !v)}
      >
        <Avatar className="size-10 border border-white/20 shadow-lg bg-white/80">
          <AvatarImage src="https://cslplhzfcfvzsivsgrpc.supabase.co/storage/v1/object/public/img//user1.png" alt="user avatar" />
          <AvatarFallback>
            <User2 className="w-6 h-6 text-zinc-500" />
          </AvatarFallback>
        </Avatar>
      </motion.div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="absolute right-0 top-[56px] min-w-[240px] rounded-xl bg-white/95 shadow-2xl border border-zinc-200 flex flex-col items-stretch p-4 gap-2 overflow-hidden"
            style={{ zIndex: 100, maxWidth: 'calc(100vw - 16px)' }}
          >
            <ShineBorder borderWidth={2} shineColor={["#e0e0e0", "#a5b4fc", "#f472b6"]} className="z-0" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-2">
                <Avatar className="size-10 border-2 border-zinc-300 shadow-lg bg-zinc-100">
                  <AvatarImage src="https://cslplhzfcfvzsivsgrpc.supabase.co/storage/v1/object/public/img//user1.png" alt="user avatar" />
                  <AvatarFallback>
                    <User2 className="w-5 h-5 text-zinc-500" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="truncate text-zinc-900 font-medium text-sm">Account</div>
                  {userEmail && (
                    <div className="truncate text-xs text-zinc-500 select-all">{userEmail}</div>
                  )}
                </div>
              </div>
              <RainbowButton
                className="w-full text-center text-sm mt-1"
                onClick={onLogout}
              >
                Logout
              </RainbowButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
