"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ReactNode, useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface AnimatedListProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
  duration?: number;
}

export function AnimatedList({ 
  children, 
  className,
  staggerDelay = 0.1,
  duration = 0.3
}: AnimatedListProps) {
  const [items, setItems] = useState<ReactNode[]>([]);

    useEffect(() => {
    if (Array.isArray(children)) {
      setItems(children);
    } else {
      setItems([children]);
    }
  }, [children]);

    return (
    <div className={cn("space-y-1", className)}>
        <AnimatePresence>
        {items.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.95 }}
            transition={{
              duration,
              delay: index * staggerDelay,
              ease: "easeOut"
            }}
            className="transform-gpu"
          >
              {item}
          </motion.div>
          ))}
        </AnimatePresence>
      </div>
    );
}
