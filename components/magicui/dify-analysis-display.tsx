"use client";

import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";
import {
  Terminal,
} from "@/components/magicui/terminal";
import { TypingAnimation } from "@/components/magicui/typing-animation";
import { NumberTicker } from "@/components/magicui/number-ticker";
import { WarpBackground } from "@/components/magicui/warp-background";
import Image from "next/image";
import { 
  Code, 
  TrendingUp, 
  BarChart3,
  Zap,
  Sparkles,
  Award,
  X
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

interface JudgeScore {
  name: string;
  score: number;
  avatar: string;
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
  const [showTotalScore, setShowTotalScore] = useState(false);
  const [judgeScores, setJudgeScores] = useState<JudgeScore[]>([]);

  // 生成评委分数
  const generateJudgeScores = () => {
    const judges = [
      { name: "Paul Graham", avatar: "https://cslplhzfcfvzsivsgrpc.supabase.co/storage/v1/object/public/img//paul.png" },
      { name: "Andrew Ng", avatar: "https://cslplhzfcfvzsivsgrpc.supabase.co/storage/v1/object/public/img//andrew.png" },
      { name: "Sam Altman", avatar: "https://cslplhzfcfvzsivsgrpc.supabase.co/storage/v1/object/public/img//sam.png" },
      { name: "Feifei Li", avatar: "https://cslplhzfcfvzsivsgrpc.supabase.co/storage/v1/object/public/img//feifei.png" }
    ];

    const scores = judges.map(judge => ({
      ...judge,
      score: parseFloat((Math.random() * 2 + 85).toFixed(2)) // 85-87之间的随机数，精确到小数点2位
    }));

    setJudgeScores(scores);
  };

  // 计算总得分
  const totalScore = judgeScores.reduce((sum, judge) => sum + judge.score, 0);

  useEffect(() => {
    if (isVisible) {
      // 开始显示分析结果
      setTimeout(() => {
        setShowAnalysis(true);
        generateJudgeScores();
        // 解析并显示分析内容
        const parsedContent = parseAnalysisContent(analysisData.answer);
        setDisplayedAnalysis(parsedContent);
      }, 2000);

      // 3秒后显示总得分
      setTimeout(() => {
        setShowTotalScore(true);
      }, 5000);
    }
  }, [isVisible, analysisData]);

  const parseAnalysisContent = (content: string): ParsedAnalysis => {
    // 提取关键信息
    const lines = content.split('\n');
    const summary = lines.find(line => line.includes('总结') || line.includes('Summary')) || "分析完成";
    const scores = lines.filter(line => line.includes('得分') || line.includes('score')).slice(0, 5);
    
    return {
      summary,
      scores,
      fullContent: content
    };
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* 分析结果展示 */}
      {showAnalysis && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* 分析摘要 - 重新设计 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-pink-900/20 border border-blue-500/30 rounded-2xl p-6 backdrop-blur-sm"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Sparkles className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-white font-bold text-xl">Analysis Summary</h3>
            </div>
            <Terminal className="max-h-32 overflow-y-auto bg-black/40 border border-white/20 rounded-lg">
              <TypingAnimation
                className="text-gray-300 text-sm leading-relaxed font-['Noto_Sans_SC'] p-4"
                duration={50}
                delay={500}
              >
                {displayedAnalysis.summary || "Analysis completed successfully. The repository has been thoroughly evaluated for technical homogeneity and compared with similar projects in the ecosystem."}
              </TypingAnimation>
            </Terminal>
          </motion.div>

          {/* 完整分析 - 重新设计 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-br from-green-900/20 via-emerald-900/20 to-teal-900/20 border border-green-500/30 rounded-2xl p-6 backdrop-blur-sm"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <Code className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="text-white font-bold text-xl">Full Analysis</h3>
            </div>
            <Terminal className="max-h-64 overflow-y-auto bg-black/40 border border-white/20 rounded-lg">
              <TypingAnimation
                className="text-gray-300 text-sm leading-relaxed font-['Noto_Sans_SC'] p-4"
                duration={30}
                delay={300}
              >
                {analysisData.answer}
              </TypingAnimation>
            </Terminal>
          </motion.div>

          {/* 相似度评分 - 重新设计 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            className="bg-gradient-to-br from-purple-900/20 via-pink-900/20 to-red-900/20 border border-purple-500/30 rounded-2xl p-6 backdrop-blur-sm"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <BarChart3 className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-white font-bold text-xl">Similarity Scores</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* 技术相似度 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="bg-black/40 border border-white/20 rounded-xl p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Code className="w-4 h-4 text-blue-400" />
                    <span className="text-white font-medium">Technical Similarity</span>
                  </div>
                  <span className="text-blue-400 font-bold text-lg">87%</span>
                </div>
                <div className="relative">
                  <div className="w-full bg-gray-800 rounded-full h-3">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "87%" }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      className="bg-gradient-to-r from-blue-500 to-cyan-500 h-3 rounded-full relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
                    </motion.div>
                  </div>
                </div>
              </motion.div>

              {/* 功能相似度 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0 }}
                className="bg-black/40 border border-white/20 rounded-xl p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-green-400" />
                    <span className="text-white font-medium">Feature Similarity</span>
                  </div>
                  <span className="text-green-400 font-bold text-lg">92%</span>
                </div>
                <div className="relative">
                  <div className="w-full bg-gray-800 rounded-full h-3">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "92%" }}
                      transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
                      className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
                    </motion.div>
                  </div>
                </div>
              </motion.div>

              {/* 市场定位相似度 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
                className="bg-black/40 border border-white/20 rounded-xl p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-purple-400" />
                    <span className="text-white font-medium">Market Alignment</span>
                  </div>
                  <span className="text-purple-400 font-bold text-lg">78%</span>
                </div>
                <div className="relative">
                  <div className="w-full bg-gray-800 rounded-full h-3">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "78%" }}
                      transition={{ duration: 1.5, ease: "easeOut", delay: 0.6 }}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
                    </motion.div>
                  </div>
                </div>
              </motion.div>

              {/* 创新度评分 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4 }}
                className="bg-black/40 border border-white/20 rounded-xl p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-orange-400" />
                    <span className="text-white font-medium">Innovation Score</span>
                  </div>
                  <span className="text-orange-400 font-bold text-lg">85%</span>
                </div>
                <div className="relative">
                  <div className="w-full bg-gray-800 rounded-full h-3">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "85%" }}
                      transition={{ duration: 1.5, ease: "easeOut", delay: 0.9 }}
                      className="bg-gradient-to-r from-orange-500 to-red-500 h-3 rounded-full relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* 评委分数 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.6 }}
              className="mt-6 bg-black/40 border border-white/20 rounded-xl p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-yellow-500/20 rounded-lg">
                  <Award className="w-5 h-5 text-yellow-400" />
                </div>
                <h4 className="text-white font-bold text-lg">Judge Scores</h4>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {judgeScores.map((judge, index) => (
                  <motion.div
                    key={judge.name}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.8 + index * 0.1 }}
                    className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 border border-white/20 rounded-lg p-4 text-center"
                  >
                                         <div className="flex items-center justify-center mb-2">
                       <Image 
                         src={judge.avatar} 
                         alt={judge.name}
                         width={32}
                         height={32}
                         className="rounded-full border-2 border-white/20"
                       />
                     </div>
                    <div className="text-white font-medium text-sm mb-1">{judge.name}</div>
                    <div className="text-yellow-400 font-bold text-lg">{judge.score}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}

      {/* 总得分弹出窗口 */}
      <AnimatePresence>
        {showTotalScore && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
            onClick={() => setShowTotalScore(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="relative"
            >
              <WarpBackground className="bg-black/90 border border-white/20 p-8">
                <div className="w-80 text-center">
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <div className="p-3 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-full">
                      <Award className="w-8 h-8 text-yellow-400" />
                    </div>
                    <h2 className="text-white font-bold text-2xl">Total Score</h2>
                  </div>
                  
                  <motion.div
                    initial={{ scale: 0.5 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, type: "spring", damping: 15, stiffness: 200 }}
                    className="mb-6"
                  >
                    <NumberTicker
                      value={parseFloat(totalScore.toFixed(2))}
                      decimalPlaces={2}
                      className="text-6xl font-bold text-white"
                    />
                  </motion.div>
                  
                  <div className="text-gray-400 text-sm mb-6">
                    <p>Combined evaluation from all judges</p>
                    <p className="text-xs mt-1">Click anywhere to close</p>
                  </div>
                  
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    onClick={() => setShowTotalScore(false)}
                    className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5 text-white" />
                  </motion.button>
                </div>
              </WarpBackground>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 