"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import type { FaqBlockProps } from "@/lib/engine/types";

/**
 * SEO-Optimized FAQ Block
 *
 * Key difference from conditional rendering:
 * - BEFORE: {openIndex === index && <p>{answer}</p>}  ❌ Answer NOT in HTML
 * - AFTER:  Always render <p>{answer}</p> with CSS hide  ✅ Answer IN HTML
 *
 * This ensures:
 * - SEO: Google crawls all answers (they're in the HTML)
 * - Accessibility: Screen readers can access all content
 * - No-JS fallback: Content visible even without JavaScript
 */
export default function FaqBlock({ content }: FaqBlockProps) {
  const { title, faqs } = content;
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (!faqs || faqs.length === 0) return null;

  return (
    <section className="section-spacing">
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

        {/* SEO: Using semantic <dl> for FAQ structure */}
        <dl className="flex flex-col gap-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                className="group"
              >
                <div
                  className={`w-full text-left p-6 rounded-xl border transition-all duration-200 ${
                    isOpen
                      ? "bg-primary/5 border-primary/20"
                      : "bg-card border-border hover:border-primary/20"
                  }`}
                >
                  {/* Question - clickable header */}
                  <dt>
                    <button
                      type="button"
                      onClick={() => setOpenIndex(isOpen ? null : index)}
                      aria-expanded={isOpen}
                      aria-controls={`faq-answer-${index}`}
                      className="w-full flex items-center justify-between gap-4 text-left"
                    >
                      <h3 className="text-base font-medium text-foreground">
                        {faq.question}
                      </h3>
                      <motion.span
                        animate={{ rotate: isOpen ? 45 : 0 }}
                        transition={{ duration: 0.2 }}
                        aria-hidden="true"
                        className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                          isOpen
                            ? "bg-primary/10 text-primary"
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
                    </button>
                  </dt>

                  {/* 
                    Answer - ALWAYS RENDERED IN HTML (SEO!) 
                    Uses CSS grid trick for smooth height animation
                    grid-rows-[0fr] = collapsed, grid-rows-[1fr] = expanded
                  */}
                  <dd
                    id={`faq-answer-${index}`}
                    className={`grid transition-all duration-200 ease-in-out ${
                      isOpen
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="pt-4 text-muted-foreground leading-relaxed text-sm">
                        {faq.answer}
                      </p>
                    </div>
                  </dd>
                </div>
              </motion.div>
            );
          })}
        </dl>
      </div>
    </section>
  );
}
