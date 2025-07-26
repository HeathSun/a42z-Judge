"use client";

import { LucideIcon, Hourglass } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";

interface ApiCallItemProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  status?: "pending" | "loading" | "completed" | "error";
  duration?: string;
  tokenCost?: number; // 新增：token消耗
  className?: string;
}

export function ApiCallItem({ 
  icon: Icon, 
  title, 
  description, 
  status = "pending",
  duration,
  tokenCost,
  className 
}: ApiCallItemProps) {
  const statusColors = {
    pending: "text-zinc-400",
    loading: "text-yellow-400",
    completed: "text-green-400",
    error: "text-red-400"
  };

  const statusIcons = {
    pending: "○",
    loading: "⟳",
    completed: "✓",
    error: "✗"
  };

  // 生成充能条颜色
  const getEnergyBarColor = (tokens: number) => {
    if (tokens < 1000) return "bg-blue-400";
    if (tokens < 2000) return "bg-green-400";
    if (tokens < 3000) return "bg-yellow-400";
    return "bg-red-400";
  };

  return (
    <div className={cn(
      "flex items-center gap-3 px-3 py-2 bg-zinc-800/30 rounded-md border border-zinc-700/50",
      "hover:bg-zinc-800/50 transition-colors duration-200",
      className
    )}>
      <div className="flex-shrink-0">
        <Icon className="w-4 h-4 text-zinc-400" />
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-zinc-300 truncate">
            {title}
          </span>
          <span className={cn("text-xs font-mono", statusColors[status])}>
            {statusIcons[status]}
          </span>
        </div>
        
        {description && (
          <div className="text-xs text-zinc-500 truncate mt-0.5">
            {description}
          </div>
        )}
      </div>
      
      <div className="flex-shrink-0 flex items-center gap-3">
        {tokenCost && (
          <div className="flex items-center gap-2">
            {/* Token消耗显示 */}
            <span className="text-xs text-zinc-400 font-mono">
              {typeof tokenCost === 'number' ? (tokenCost / 1000).toFixed(3) : '0.000'}K
            </span>
            
            {/* 充能条 */}
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }, (_, i) => (
                <motion.div
                  key={i}
                  className={cn(
                    "w-1 h-3 rounded-sm",
                    i < Math.min(5, Math.floor(tokenCost / 500)) 
                      ? getEnergyBarColor(tokenCost)
                      : "bg-zinc-700"
                  )}
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ 
                    duration: 0.3, 
                    delay: i * 0.1,
                    type: "spring",
                    stiffness: 200
                  }}
                />
              ))}
            </div>
          </div>
        )}
        
        {duration && (
          <div className="flex items-center gap-1">
            <Hourglass className="w-3 h-3 text-zinc-500" />
            <span className="text-xs text-zinc-500 font-mono">
              {duration}
            </span>
          </div>
        )}
      </div>
    </div>
  );
} 