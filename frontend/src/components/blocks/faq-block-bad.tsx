"use client";

/**
 * ❌ BAD PATTERN: Conditional Rendering
 *
 * This component demonstrates the WRONG way to build an FAQ accordion.
 * FAQ answers are NOT included in server HTML because of conditional rendering.
 *
 * Problem: Google/SEO crawlers cannot see the answers!
 *
 * Used for: Blog comparison demonstration only
 */

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import type { FaqBlockProps } from "@/lib/engine/types";

export default function FaqBlockBad({ content }: FaqBlockProps) {
  const { title, faqs } = content;
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (!faqs || faqs.length === 0) return null;

  return (
    <section className="section-spacing bg-destructive/5 border-t border-b border-destructive/20">
      {/* Warning Banner */}
      <div className="container-narrow mb-12">
        <div className="bg-destructive/10 border border-destructive/30 rounded-xl p-4 text-center">
          <span className="text-destructive font-semibold">
            ❌ BAD PATTERN: Answers NOT in Server HTML (SEO Broken)
          </span>
        </div>
      </div>

      <div className="container-narrow">
        {title && (
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-12 text-center text-foreground"
          >
            {title}
          </motion.h2>
        )}

        <div className="flex flex-col gap-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              className="group"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className={`w-full text-left p-6 rounded-xl border transition-all duration-200 ${
                  openIndex === index
                    ? "bg-destructive/10 border-destructive/30"
                    : "bg-card border-border hover:border-destructive/20"
                }`}
              >
                <div className="flex items-center justify-between gap-4">
                  <h3 className="text-base font-medium text-foreground">
                    {faq.question}
                  </h3>
                  <motion.span
                    animate={{ rotate: openIndex === index ? 45 : 0 }}
                    transition={{ duration: 0.2 }}
                    className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                      openIndex === index
                        ? "bg-destructive/20 text-destructive"
                        : "bg-secondary text-muted-foreground"
                    }`}
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                  </motion.span>
                </div>

                {/* ❌ PROBLEM: Conditional rendering - NOT in server HTML! */}
                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <p className="pt-4 text-muted-foreground leading-relaxed text-sm">
                        {faq.answer}
                      </p>
                      <div className="mt-2 text-xs text-destructive">
                        ⚠️ This text is NOT in the server HTML!
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </motion.div>
          ))}
        </div>

        {/* Code snippet showing the problem */}
        <div className="mt-8 bg-card border border-border rounded-xl p-4 text-sm font-mono">
          <div className="text-destructive mb-2">
            ❌ Problem: Conditional rendering
          </div>
          <div className="text-muted-foreground">
            {`{openIndex === index && (`}
          </div>
          <div className="text-muted-foreground pl-4">
            {`<p>{faq.answer}</p>  `}
            <span className="text-destructive"> NOT IN HTML!</span>
          </div>
          <div className="text-muted-foreground">{`)}`}</div>
        </div>
      </div>
    </section>
  );
}
