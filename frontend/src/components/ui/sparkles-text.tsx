"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useCallback, useMemo } from "react";
import { cn } from "@/lib/utils";

interface Sparkle {
  id: string;
  x: string;
  y: string;
  size: number;
  delay: number;
  duration: number;
}

interface SparklesTextProps {
  children: React.ReactNode;
  className?: string;
  sparklesCount?: number;
  colors?: {
    first: string;
    second: string;
  };
}

export function SparklesText({
  children,
  className,
  sparklesCount = 12, // Increased default count for more sparkles
  colors = { first: "#10b981", second: "#34d399" },
}: SparklesTextProps) {
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);

  const generateSparkle = useCallback((): Sparkle => {
    return {
      id: Math.random().toString(36).substr(2, 9),
      x: `${Math.random() * 100}%`,
      y: `${Math.random() * 100}%`,
      size: Math.random() * 16 + 12, // Increased from 4-12 to 12-28
      delay: Math.random() * 2,
      duration: Math.random() * 1.5 + 1.5,
    };
  }, []);

  const initialSparkles = useMemo(() => {
    return Array.from({ length: sparklesCount }, () => generateSparkle());
  }, [sparklesCount, generateSparkle]);

  useEffect(() => {
    setSparkles(initialSparkles);

    const interval = setInterval(() => {
      setSparkles((current) =>
        current.map((sparkle) => ({
          ...sparkle,
          id: Math.random().toString(36).substr(2, 9),
          x: `${Math.random() * 100}%`,
          y: `${Math.random() * 100}%`,
        }))
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [initialSparkles]);

  return (
    <span className={cn("relative inline-block", className)}>
      <span className="relative z-10">{children}</span>
      <AnimatePresence>
        {sparkles.map((sparkle, index) => (
          <motion.span
            key={sparkle.id}
            className="pointer-events-none absolute"
            style={{
              left: sparkle.x,
              top: sparkle.y,
              zIndex: 20,
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1.2, 0], // Increased max scale for more prominence
            }}
            transition={{
              duration: sparkle.duration,
              delay: sparkle.delay,
              repeat: Infinity,
              repeatDelay: Math.random() * 2,
            }}
          >
            <svg
              width={sparkle.size}
              height={sparkle.size}
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"
                fill={index % 2 === 0 ? colors.first : colors.second}
              />
            </svg>
          </motion.span>
        ))}
      </AnimatePresence>
    </span>
  );
}
