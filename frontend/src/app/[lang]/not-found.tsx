"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { isValidLocale, i18n, type Locale } from "@/lib/i18n/config";

export default function NotFound() {
  const params = useParams();
  const lang = params?.lang as string | undefined;
  const locale: Locale =
    lang && isValidLocale(lang) ? lang : i18n?.defaultLocale;

  const notFoundText =
    locale === "en"
      ? {
          title: "Page Not Found",
          description:
            "The page you're looking for has vanished into the void. It might have been moved, deleted, or never existed.",
          home: "Go Home",
          posts: "Browse Posts",
        }
      : {
          title: "पृष्ठ सापडले नाही",
          description:
            "तुम्ही शोधत असलेले पृष्ठ नाहीसे झाले आहे. ते हलवले गेले असू शकते, हटवले गेले असू शकते किंवा कधीच अस्तित्वात नसू शकते.",
          home: "मुख्यपृष्ठावर जा",
          posts: "लेख ब्राउझ करा",
        };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-background">
      <div className="container-narrow text-center">
        {/* Ghost Animation */}
        <div className="relative mb-8">
          <div className="text-9xl md:text-[12rem] font-bold text-foreground/10 select-none">
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
                rotate: {
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 1,
                },
              }}
              className="text-6xl md:text-8xl"
            >
              👻
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
            {notFoundText.title}
          </h1>
          <p className="text-muted-foreground text-lg max-w-md mx-auto">
            {notFoundText.description}
          </p>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
            <Link href={`/${locale}`}>{notFoundText.home}</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href={`/${locale}/posts`}>{notFoundText.posts}</Link>
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
