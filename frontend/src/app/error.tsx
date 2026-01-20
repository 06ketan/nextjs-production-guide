"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { i18n } from "@/lib/i18n/config";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * Root Error Boundary
 * Catches errors at the root level (outside [lang] routes)
 */
export default function RootError({ error, reset }: ErrorProps) {
  const defaultLocale = i18n?.defaultLocale || "en";

  useEffect(() => {
    console.error("[Root Error Boundary]", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md text-center px-4">
        {/* Error Animation */}
        <div className="relative mb-8">
          <div className="text-9xl font-bold text-destructive/10 select-none">
            500
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-6xl"
            >
              ⚠️
            </motion.div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-4"
        >
          <h1 className="text-3xl font-bold text-foreground">
            Something went wrong
          </h1>
          <p className="text-muted-foreground">
            An unexpected error occurred. Please try again.
          </p>
          {error?.digest && (
            <p className="text-xs text-muted-foreground/60 font-mono">
              Error ID: {error.digest}
            </p>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Button
            onClick={reset}
            size="lg"
            className="bg-primary hover:bg-primary/90"
          >
            Try Again
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href={`/${defaultLocale}`}>Go Home</Link>
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
