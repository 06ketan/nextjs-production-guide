"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { BannerBlockProps } from "@/lib/engine/types";

export default function BannerBlock({ content }: BannerBlockProps) {
  const { title, subtitle, ctaText, ctaLink } = content;

  return (
    <section className="section-spacing bg-card border-y border-border">
      <div className="container-wide">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            {title}
          </h2>

          {subtitle && (
            <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto leading-relaxed">
              {subtitle}
            </p>
          )}

          {ctaText && ctaLink && (
            <Button
              asChild
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-10 h-12 text-base rounded-lg transition-colors"
            >
              <Link href={ctaLink}>{ctaText}</Link>
            </Button>
          )}
        </motion.div>
      </div>
    </section>
  );
}
