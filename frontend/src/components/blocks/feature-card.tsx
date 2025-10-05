"use client";

import { motion } from "framer-motion";
import type { FeatureCardProps } from "@/lib/engine/types";

export default function FeatureCard({ content }: FeatureCardProps) {
  const { title, description, icon } = content;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4 }}
      className="group relative p-8 rounded-xl bg-card border border-border card-hover"
    >
      <div className="relative z-10">
        {icon && (
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-2xl mb-6">
            {icon}
          </div>
        )}

        <h3 className="text-lg font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">
          {title}
        </h3>

        <p className="text-muted-foreground text-sm leading-relaxed">
          {description}
        </p>
      </div>
    </motion.div>
  );
}
