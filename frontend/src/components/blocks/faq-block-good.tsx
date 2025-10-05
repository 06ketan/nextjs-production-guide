"use client";

/**
 * ✅ GOOD PATTERN: CSS-Based Visibility
 *
 * This component demonstrates the CORRECT way to build an FAQ accordion.
 * FAQ answers ARE included in server HTML using CSS to control visibility.
 *
 * Benefits:
 * - SEO: All answers visible to Google/crawlers
 * - Accessibility: Screen readers can access all content
 * - No-JS: Content visible even without JavaScript
 *
 * Used for: Blog comparison demonstration + Production use
 */

import { motion } from "framer-motion";
import { useState } from "react";
import type { FaqBlockProps } from "@/lib/engine/types";

export default function FaqBlockGood({ content }: FaqBlockProps) {
  const { title, faqs } = content;
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (!faqs || faqs.length === 0) return null;

  return (
    <section className="section-spacing bg-primary/5 border-t border-b border-primary/20">
      {/* Success Banner */}
      <div className="container-narrow mb-12">
        <div className="bg-primary/10 border border-primary/30 rounded-xl p-4 text-center">
          <span className="text-primary font-semibold">
            ✅ GOOD PATTERN: Answers ARE in Server HTML (SEO Working)
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

        {/* Using semantic <dl> for FAQ structure */}
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
                      ? "bg-primary/10 border-primary/30"
                      : "bg-card border-border hover:border-primary/20"
                  }`}
                >
                  <dt>
                    <button
                      type="button"
                      onClick={() => setOpenIndex(isOpen ? null : index)}
                      aria-expanded={isOpen}
                      aria-controls={`faq-good-answer-${index}`}
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
                            ? "bg-primary/20 text-primary"
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

                  {/* ✅ SOLUTION: Always rendered, CSS controls visibility */}
                  <dd
                    id={`faq-good-answer-${index}`}
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
                      <div className="mt-2 text-xs text-primary">
                        ✅ This text IS in the server HTML!
                      </div>
                    </div>
                  </dd>
                </div>
              </motion.div>
            );
          })}
        </dl>

        {/* Code snippet showing the solution */}
        <div className="mt-8 bg-card border border-border rounded-xl p-4 text-sm font-mono">
          <div className="text-primary mb-2">
            ✅ Solution: Always render, use CSS
          </div>
          <div className="text-muted-foreground">
            {`<dd className={isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}>`}
          </div>
          <div className="text-muted-foreground pl-4">
            {`<p>{faq.answer}</p>  `}
            <span className="text-primary">ALWAYS IN HTML!</span>
          </div>
          <div className="text-muted-foreground">{`</dd>`}</div>
        </div>
      </div>
    </section>
  );
}
