"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Star, Quote, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { InlineAnswerDisplay } from './answer-display';

interface JudgeComment {
  id: string;
  name: string;
  avatar: string;
  comment: string;
  status: 'pending' | 'completed' | 'error';
  timestamp?: string;
}

interface JudgeCommentsProps {
  comments: JudgeComment[];
  isVisible?: boolean;
  className?: string;
}

const JUDGE_AVATARS = {
  paul: "https://cslplhzfcfvzsivsgrpc.supabase.co/storage/v1/object/public/img//paul.png",
  andrew: "https://cslplhzfcfvzsivsgrpc.supabase.co/storage/v1/object/public/img//andrew.png", 
  sam: "https://cslplhzfcfvzsivsgrpc.supabase.co/storage/v1/object/public/img//sam.png",
  feifei: "https://cslplhzfcfvzsivsgrpc.supabase.co/storage/v1/object/public/img//feifei.png"
};

// 过滤特殊符号的函数
const filterSpecialSymbols = (text: string): string => {
  return text
    .replace(/[^\w\s\u4e00-\u9fff\u3000-\u303f\uff00-\uffef.,!?;:()[\]{}"'`~@#$%^&*+=|\\/<>]/g, '') // 移除特殊符号但保留中文、英文、数字和基本标点
    .replace(/\s+/g, ' ') // 合并多个空格
    .trim();
};

export function JudgeComments({ 
  comments, 
  isVisible = true,
  className 
}: JudgeCommentsProps) {
  if (!isVisible || comments.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.8, 
        ease: [0.25, 0.46, 0.45, 0.94],
        staggerChildren: 0.2
      }}
      className={cn(
        "space-y-6",
        className
      )}
    >
      {/* 标题 */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2 flex items-center justify-center gap-3">
          <MessageSquare className="w-6 h-6 text-blue-400" />
          Expert Panel Analysis
          <MessageSquare className="w-6 h-6 text-blue-400" />
        </h2>
        <p className="text-gray-400 text-sm">
          Comprehensive evaluation from industry experts
        </p>
      </div>

      {/* 评委评论网格 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {comments.map((comment, index) => (
          <motion.div
            key={comment.id}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ 
              duration: 0.6, 
              delay: index * 0.15,
              ease: [0.25, 0.46, 0.45, 0.94]
            }}
            className="relative group"
          >
            {/* 背景装饰 */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-cyan-900/20 rounded-xl" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            {/* 主容器 */}
            <div className="relative bg-black/40 backdrop-blur-sm border border-white/20 rounded-xl p-6 shadow-2xl hover:shadow-purple-500/20 transition-all duration-300">
              {/* 评委信息头部 */}
              <div className="flex items-start gap-4 mb-4">
                {/* 头像 */}
                <div className="relative">
                  <img
                    src={comment.avatar}
                    alt={`${comment.name} avatar`}
                    className="w-12 h-12 rounded-full border-2 border-white/20 shadow-lg"
                    onError={(e) => {
                      // 头像加载失败时的备用方案
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                  <div className="hidden w-12 h-12 rounded-full border-2 border-white/20 shadow-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold text-lg">
                    {comment.name.charAt(0)}
                  </div>
                  
                  {/* 状态指示器 */}
                  <div className={cn(
                    "absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white",
                    comment.status === 'completed' && "bg-green-500",
                    comment.status === 'pending' && "bg-yellow-500 animate-pulse",
                    comment.status === 'error' && "bg-red-500"
                  )} />
                </div>

                {/* 评委信息 */}
                <div className="flex-1">
                  <h3 className="text-white font-semibold text-lg flex items-center gap-2">
                    {comment.name}
                    {comment.status === 'completed' && (
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    )}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Star className="w-3 h-3" />
                    <span>Expert Judge</span>
                    {comment.timestamp && (
                      <>
                        <span>•</span>
                        <span>{comment.timestamp}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* 评论内容 */}
              <div className="relative">
                {/* 引号装饰 */}
                <Quote className="absolute -top-2 -left-2 w-6 h-6 text-blue-400/30" />
                
                {/* 评论文本 */}
                <div className="bg-white/5 p-4 rounded-lg border border-white/10 relative">
                  <InlineAnswerDisplay 
                    answer={filterSpecialSymbols(comment.comment)}
                    className="text-gray-200 leading-relaxed font-['Noto_Sans_SC'] text-sm"
                  />
                </div>
                
                <Quote className="absolute -bottom-2 -right-2 w-6 h-6 text-blue-400/30 rotate-180" />
              </div>

              {/* 底部装饰 */}
              <div className="mt-4 pt-4 border-t border-white/10">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>AI-Powered Analysis</span>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                    <span>{comment.status}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 外发光效果 */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-cyan-500/10 rounded-xl blur-xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </motion.div>
        ))}
      </div>

      {/* 底部总结 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="text-center mt-8"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-gray-300 text-sm">
            {comments.filter(c => c.status === 'completed').length} of {comments.length} analyses completed
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
}

// 简化的单个评委评论组件
export function SingleJudgeComment({ 
  name, 
  avatar, 
  comment, 
  className 
}: { 
  name: string; 
  avatar: string; 
  comment: string; 
  className?: string;
}) {
  return (
    <div className={cn("bg-black/40 backdrop-blur-sm border border-white/20 rounded-lg p-4", className)}>
      <div className="flex items-center gap-3 mb-3">
        <img
          src={avatar}
          alt={`${name} avatar`}
          className="w-10 h-10 rounded-full border border-white/20"
        />
        <div>
          <h4 className="text-white font-medium">{name}</h4>
          <div className="text-gray-400 text-sm">Expert Judge</div>
        </div>
      </div>
      <div className="text-gray-200 text-sm leading-relaxed">
        {filterSpecialSymbols(comment)}
      </div>
    </div>
  );
} 