"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { i18n } from "@/lib/i18n/config";

/**
 * Root Not Found Page
 * Catches 404s for routes without locale prefix (e.g., /invalid-path)
 * Redirects to default locale home
 */
export default function RootNotFound() {
  const defaultLocale = i18n?.defaultLocale || "en";

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md text-center px-4">
        {/* Ghost Animation */}
        <div className="relative mb-8">
          <div className="text-9xl font-bold text-foreground/10 select-none">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{
                opacity: 1,
                y: 0,
                rotate: [0, -10, 10, -10, 0],
              }}
              transition={{
                duration: 0.5,
                rotate: { duration: 2, repeat: Infinity, repeatDelay: 1 },
              }}
              className="text-6xl"
            >
              👻
            </motion.div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-4"
        >
          <h1 className="text-3xl font-bold text-foreground">Page Not Found</h1>
          <p className="text-muted-foreground">
            The page you&apos;re looking for doesn&apos;t exist.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-8"
        >
          <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
            <Link href={`/${defaultLocale}`}>Go Home</Link>
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
