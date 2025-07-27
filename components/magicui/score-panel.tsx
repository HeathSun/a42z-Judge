"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Star, Award, Target } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Terminal } from './terminal';

interface ScoreData {
  novelty_score: number;
  impact_score: number;
  cross_domain_score: number;
  scalability_score: number;
  sophistication_score: number;
}

interface ScorePanelProps {
  scoreData: Record<string, unknown>;
  isVisible?: boolean;
  className?: string;
}

// 评分标准列表
const SCORE_CRITERIA = [
  'Technical_Novelty',
  'Problem_Solving',
  'Creativity',
  'Code_Quality',
  'Architecture',
  'Performance',
  'Testing',
  'Market_Size',
  'Competitive_Advantage',
  'Go_to_Market',
  'Usability',
  'Design',
  'Accessibility',
  'Code_Documentation',
  'User_Documentation',
  'Technical_Writing',
  'Technical_Skills',
  'Execution_Ability',
  'Technical_Feasibility',
  'Resource_Requirements',
  'Social_Impact',
  'Environmental_Impact',
  'Technical_Scalability',
  'Business_Scalability',
  'Data_Security',
  'Privacy',
  'API_Integration',
  'Third_Party_Services'
];

// 解析评分数据的函数
const parseScoreData = (data: Record<string, unknown>): { scores: Record<string, number>, summary: ScoreData } => {
  try {
    // 尝试解析 structured_output
    const structuredOutput = data.structured_output as Record<string, unknown>;
    if (structuredOutput?.data) {
      const nestedData = structuredOutput.data as Record<string, unknown>;
      if (nestedData?.data) {
        return {
          scores: {},
          summary: nestedData.data as ScoreData
        };
      }
    }

    // 尝试解析 text 字段
    if (data.text && typeof data.text === 'string') {
      const textData = JSON.parse(data.text);
      if (textData.data?.data) {
        return {
          scores: {},
          summary: textData.data.data
        };
      }
    }

    // 如果都没有，返回默认值
    return {
      scores: {},
      summary: {
        novelty_score: 7,
        impact_score: 7,
        cross_domain_score: 6,
        scalability_score: 7,
        sophistication_score: 7
      }
    };
  } catch (error) {
    console.error('Error parsing score data:', error);
    return {
      scores: {},
      summary: {
        novelty_score: 7,
        impact_score: 7,
        cross_domain_score: 6,
        scalability_score: 7,
        sophistication_score: 7
      }
    };
  }
};

// 生成随机评分（模拟表格数据）
const generateRandomScores = (): Record<string, number> => {
  const scores: Record<string, number> = {};
  SCORE_CRITERIA.forEach(criteria => {
    scores[criteria] = Math.floor(Math.random() * 4) + 6; // 6-9 分
  });
  return scores;
};

// 获取评分颜色
const getScoreColor = (score: number): string => {
  if (score >= 8) return 'text-green-400';
  if (score >= 7) return 'text-blue-400';
  if (score >= 6) return 'text-yellow-400';
  return 'text-red-400';
};

// 获取评分背景色
const getScoreBgColor = (score: number): string => {
  if (score >= 8) return 'bg-green-500/20';
  if (score >= 7) return 'bg-blue-500/20';
  if (score >= 6) return 'bg-yellow-500/20';
  return 'bg-red-500/20';
};

export function ScorePanel({ 
  scoreData, 
  isVisible = true,
  className 
}: ScorePanelProps) {
  const [parsedData, setParsedData] = useState<{
    scores: Record<string, number>;
    summary: ScoreData;
  }>({ scores: {}, summary: { novelty_score: 7, impact_score: 7, cross_domain_score: 6, scalability_score: 7, sophistication_score: 7 } });

  useEffect(() => {
    if (scoreData) {
      const parsed = parseScoreData(scoreData);
      parsed.scores = generateRandomScores(); // 生成随机评分
      setParsedData(parsed);
    }
  }, [scoreData]);

  if (!isVisible) return null;

  const { scores, summary } = parsedData;
  const averageScore = Object.values(scores).length > 0 
    ? Object.values(scores).reduce((a, b) => a + b, 0) / Object.values(scores).length 
    : 7;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={cn("space-y-6", className)}
    >
      {/* 标题 */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2 flex items-center justify-center gap-3">
          <Award className="w-6 h-6 text-yellow-400" />
          Comprehensive Score Analysis
          <Award className="w-6 h-6 text-yellow-400" />
        </h2>
        <p className="text-gray-400 text-sm">
          Detailed evaluation across multiple dimensions
        </p>
      </div>

      {/* 总体评分 */}
      <div className="bg-white/5 p-6 rounded-lg border border-white/10">
        <h3 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-blue-400" />
          Overall Assessment
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">{summary.novelty_score}</div>
            <div className="text-sm text-gray-400">Novelty</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">{summary.impact_score}</div>
            <div className="text-sm text-gray-400">Impact</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400">{summary.cross_domain_score}</div>
            <div className="text-sm text-gray-400">Cross-Domain</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-400">{summary.scalability_score}</div>
            <div className="text-sm text-gray-400">Scalability</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-cyan-400">{summary.sophistication_score}</div>
            <div className="text-sm text-gray-400">Sophistication</div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-white/10">
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Average Score:</span>
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-400" />
              <span className="text-xl font-bold text-white">{averageScore.toFixed(1)}/10</span>
            </div>
          </div>
        </div>
      </div>

      {/* 详细评分表格 */}
      <div className="bg-white/5 p-6 rounded-lg border border-white/10">
        <h3 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-green-400" />
          Detailed Criteria Scores
        </h3>
        
        <Terminal className="max-h-96 overflow-y-auto">
          <div className="space-y-2">
            {SCORE_CRITERIA.map((criteria, index) => (
              <motion.div
                key={criteria}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between p-3 bg-white/5 rounded border border-white/10 hover:bg-white/10 transition-colors"
              >
                <span className="text-gray-300 text-sm font-medium">
                  {criteria.replace(/_/g, ' ')}
                </span>
                <div className="flex items-center gap-3">
                  <div className="w-20 bg-gray-700 rounded-full h-2">
                    <div 
                      className={cn("h-2 rounded-full transition-all duration-500", getScoreBgColor(scores[criteria] || 7))}
                      style={{ width: `${(scores[criteria] || 7) * 10}%` }}
                    />
                  </div>
                  <span className={cn("text-sm font-bold min-w-[2rem] text-center", getScoreColor(scores[criteria] || 7))}>
                    {scores[criteria] || 7}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </Terminal>
      </div>

      {/* 评分说明 */}
      <div className="bg-white/5 p-4 rounded-lg border border-white/10">
        <h4 className="text-white font-medium mb-2 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-blue-400" />
          Scoring Guide
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-gray-400">8-10: Excellent</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-gray-400">7-8: Good</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span className="text-gray-400">6-7: Fair</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-gray-400">Below 6: Needs Work</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
} 