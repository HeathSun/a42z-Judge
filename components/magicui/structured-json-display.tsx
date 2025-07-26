"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TypingAnimation } from './typing-animation';
import { NumberTicker } from './number-ticker';
import { cn } from '@/lib/utils';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';

interface StructuredJsonDisplayProps {
  data: Record<string, unknown>;
  className?: string;
  isVisible?: boolean;
}

interface ScoreData {
  totalScore: number;
  maxPossibleScore: number;
  scorePercentage: number;
  scoreBreakdown: Array<{ key: string; value: number; label: string }>;
}

export function StructuredJsonDisplay({ 
  data, 
  className,
  isVisible = true 
}: StructuredJsonDisplayProps) {
  const [scoreData, setScoreData] = useState<ScoreData>({
    totalScore: 0,
    maxPossibleScore: 0,
    scorePercentage: 0,
    scoreBreakdown: []
  });

  // 解析数据并计算总分
  useEffect(() => {
    const numbers: Array<{ key: string; value: number; label: string }> = [];
    let total = 0;
    let maxPossible = 0;

    const extractNumbers = (obj: unknown, prefix = '') => {
      if (typeof obj !== 'object' || obj === null) return;
      Object.entries(obj as Record<string, unknown>).forEach(([key, value]) => {
        const fullKey = prefix ? `${prefix}.${key}` : key;
        
        if (typeof value === 'number') {
          numbers.push({ 
            key: fullKey, 
            value, 
            label: key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ')
          });
          total += value;
          maxPossible += 100; // 假设每个评分项满分100
        } else if (typeof value === 'object' && value !== null) {
          extractNumbers(value, fullKey);
        }
      });
    };

    extractNumbers(data);
    
    setScoreData({
      totalScore: total,
      maxPossibleScore: maxPossible,
      scorePercentage: maxPossible > 0 ? (total / maxPossible) * 100 : 0,
      scoreBreakdown: numbers
    });
  }, [data]);

  // 判断数据类型
  const getDataType = (value: unknown): 'array_object' | 'array_string' | 'string' | 'number' => {
    if (Array.isArray(value)) {
      if (value.length > 0 && typeof value[0] === 'object') {
        return 'array_object';
      }
      return 'array_string';
    }
    if (typeof value === 'number') {
      return 'number';
    }
    return 'string';
  };

  // 渲染数组对象（表格）
  const renderArrayObject = (key: string, value: unknown[]) => {
    if (value.length === 0) return null;
    
    const headers = Object.keys(value[0] as Record<string, unknown>);
    
    return (
      <Card key={key} className="bg-black/20 border-white/10">
        <CardHeader className="pb-3">
          <CardTitle className="text-white text-sm font-medium">
            {key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ')}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table className="w-full">
              <TableHeader>
                <TableRow className="border-white/10 hover:bg-white/5">
                  {headers.map((header) => (
                    <TableHead key={header} className="text-gray-300 text-xs font-medium px-3 py-2">
                      {header.charAt(0).toUpperCase() + header.slice(1).replace(/_/g, ' ')}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {value.map((item, index) => (
                  <TableRow key={index} className="border-white/5 hover:bg-white/5">
                    {headers.map((header) => (
                      <TableCell key={header} className="text-gray-200 text-xs px-3 py-2">
                        {typeof (item as Record<string, unknown>)[header] === 'number' ? (
                          <NumberTicker
                            value={(item as Record<string, unknown>)[header] as number}
                            decimalPlaces={2}
                            className="text-xs font-mono text-blue-400"
                          />
                        ) : (
                          String((item as Record<string, unknown>)[header])
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    );
  };

  // 渲染字符串数组（打字动画）
  const renderArrayString = (key: string, value: string[]) => {
    return (
      <Card key={key} className="bg-black/20 border-white/10">
        <CardHeader className="pb-2">
          <CardTitle className="text-white text-sm font-medium">
            {key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ')}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-2">
            {value.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-gray-200 text-xs leading-relaxed"
              >
                                 <TypingAnimation
                   className="text-gray-200 text-xs"
                   duration={30}
                   delay={index * 200}
                 >
                   {`• ${item}`}
                 </TypingAnimation>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  // 渲染字符串（涟漪按钮样式）
  const renderString = (key: string, value: string) => {
    return (
      <motion.div
        key={key}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="inline-block"
      >
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg blur-sm group-hover:blur-md transition-all duration-300" />
          <div className="relative bg-black/40 border border-white/20 rounded-lg px-4 py-2 hover:bg-black/60 transition-all duration-300 cursor-pointer">
            <div className="text-gray-400 text-xs mb-1">
              {key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ')}
            </div>
            <div className="text-white text-sm font-medium">
              {value}
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  // 渲染数字（数字动画）
  const renderNumber = (key: string, value: number) => {
    return (
      <motion.div
        key={key}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-black/30 border border-white/10 rounded-lg p-3 hover:bg-black/40 transition-all duration-300"
      >
        <div className="text-gray-400 text-xs mb-2">
          {key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ')}
        </div>
        <NumberTicker
          value={value}
          decimalPlaces={2}
          className="text-2xl font-bold text-white tracking-tight"
        />
      </motion.div>
    );
  };

  // 渲染总分
  const renderOverallScore = () => {
    const getScoreColor = (percentage: number) => {
      if (percentage >= 80) return 'from-green-500 to-emerald-500';
      if (percentage >= 60) return 'from-yellow-500 to-orange-500';
      if (percentage >= 40) return 'from-orange-500 to-red-500';
      return 'from-red-500 to-pink-500';
    };

    const getScoreLabel = (percentage: number) => {
      if (percentage >= 80) return 'Excellent';
      if (percentage >= 60) return 'Good';
      if (percentage >= 40) return 'Fair';
      return 'Poor';
    };

    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-8 p-6 bg-black/40 border border-white/20 rounded-lg"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white text-lg font-semibold">Overall Score</h3>
          <div className="text-right">
            <NumberTicker
              value={scoreData.totalScore}
              decimalPlaces={1}
              className="text-3xl font-bold text-white"
            />
            <div className="text-gray-400 text-sm">
              / {scoreData.maxPossibleScore.toFixed(1)}
            </div>
          </div>
        </div>

        {/* 充能条 */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm text-gray-300 mb-2">
            <span>{getScoreLabel(scoreData.scorePercentage)}</span>
            <span>{scoreData.scorePercentage.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${scoreData.scorePercentage}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className={cn(
                "h-full rounded-full bg-gradient-to-r",
                getScoreColor(scoreData.scorePercentage)
              )}
            />
          </div>
        </div>

        {/* 分数明细 */}
        {scoreData.scoreBreakdown.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {scoreData.scoreBreakdown.map((item) => (
              <div key={item.key} className="text-xs">
                <div className="text-gray-400">{item.label}</div>
                <div className="text-white font-medium">{item.value.toFixed(1)}</div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    );
  };

  if (!isVisible) return null;

  return (
    <div className={cn("space-y-4", className)}>
      {/* 数据展示 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(data).map(([key, value]) => {
          const dataType = getDataType(value);
          
                switch (dataType) {
        case 'array_object':
          return renderArrayObject(key, value as unknown[]);
        case 'array_string':
          return renderArrayString(key, value as string[]);
        case 'string':
          return renderString(key, value as string);
        case 'number':
          return renderNumber(key, value as number);
        default:
          return null;
      }
        })}
      </div>

      {/* 总分展示 */}
      {scoreData.totalScore > 0 && renderOverallScore()}
    </div>
  );
} 