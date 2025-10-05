"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SparklesText } from "@/components/ui/sparkles-text";
import type { HeroBlockProps } from "@/lib/engine/types";

export default function HeroBlock({ content }: HeroBlockProps) {
  const { title, subtitle, description, ctaText, ctaLink, useSparkles } =
    content;

  return (
    <section className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center overflow-hidden">
      {/* Subtle grid background */}
      <div className="absolute inset-0 grid-pattern opacity-30" />

      {/* Content */}
      <div className="relative z-10 container-wide py-24">
        <div className="max-w-4xl mx-auto text-center">
          {subtitle && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-8">
                <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                {subtitle}
              </span>
            </motion.div>
          )}

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-8 leading-[1.1] tracking-tight"
          >
            {useSparkles ? (
              <SparklesText>{title}</SparklesText>
            ) : (
              <span className="text-foreground">{title}</span>
            )}
          </motion.h1>

          {description && (
            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed"
            >
              {description}
            </motion.p>
          )}

          {ctaText && ctaLink && (
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Button
                asChild
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 h-12 text-base rounded-lg transition-colors"
              >
                <Link href={ctaLink}>{ctaText}</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-border hover:border-primary/40 hover:bg-primary/5 px-8 h-12 text-base rounded-lg transition-colors"
              >
                <Link href="#features">Learn More</Link>
              </Button>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
