"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { isValidLocale, i18n, type Locale } from "@/lib/i18n/config";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const params = useParams();
  const lang = params?.lang as string | undefined;
  const locale: Locale =
    lang && isValidLocale(lang) ? lang : i18n?.defaultLocale;

  useEffect(() => {
    console.error("Error:", error);
  }, [error]);

  const errorText =
    locale === "mr"
      ? {
          title: "काहीतरी चुकीचे झाले",
          description:
            "एक अनपेक्षित त्रुटी आली. काळजी करू नका, आमच्या टीमला सूचित केले गेले आहे आणि ते निराकरणावर काम करत आहेत.",
          tryAgain: "पुन्हा प्रयत्न करा",
          goHome: "मुख्यपृष्ठावर जा",
        }
      : {
          title: "Something Went Wrong",
          description:
            "An unexpected error occurred. Don't worry, our team has been notified and is working on a fix.",
          tryAgain: "Try Again",
          goHome: "Go Home",
        };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-background">
      <div className="container-narrow text-center">
        {/* Error Animation */}
        <div className="relative mb-8">
          <div className="text-9xl md:text-[12rem] font-bold text-foreground/10 select-none">
            500
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{
                opacity: 1,
                scale: 1,
                rotate: [0, 5, -5, 5, 0],
              }}
              transition={{
                duration: 0.5,
                rotate: {
                  duration: 1.5,
                  repeat: Infinity,
                  repeatDelay: 0.5,
                },
              }}
              className="text-6xl md:text-8xl"
            >
              ⚠️
            </motion.div>
          </div>
        </div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-4"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            {errorText.title}
          </h1>
          <p className="text-muted-foreground text-lg max-w-md mx-auto">
            {errorText.description}
          </p>
          {error.digest && (
            <p className="text-xs text-muted-foreground font-mono mt-2">
              Error ID: {error.digest}
            </p>
          )}
        </motion.div>

        {/* Actions */}
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
            {errorText.tryAgain}
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href={`/${locale}`}>{errorText.goHome}</Link>
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
