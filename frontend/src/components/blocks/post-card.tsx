"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import type { PostCardProps } from "@/lib/engine/types";

// Helper to extract URL from various cover formats
function getCoverUrl(cover: PostCardProps["content"]["cover"]): string | null {
  if (!cover) return null;

  // Direct format: { url: "..." }
  if ("url" in cover && cover.url) {
    return cover.url.startsWith("http")
      ? cover.url
      : `http://localhost:1337${cover.url}`;
  }

  // Strapi nested format: { data: { attributes: { url: "..." } } }
  if ("data" in cover && cover.data?.attributes?.url) {
    const url = cover.data.attributes.url;
    return url.startsWith("http") ? url : `http://localhost:1337${url}`;
  }

  return null;
}

function getCoverAlt(
  cover: PostCardProps["content"]["cover"],
  fallback: string
): string {
  if (!cover) return fallback;

  if ("alternativeText" in cover && cover.alternativeText) {
    return cover.alternativeText;
  }

  if ("data" in cover && cover.data?.attributes?.alternativeText) {
    return cover.data.attributes.alternativeText;
  }

  return fallback;
}

export default function PostCard({ content }: PostCardProps) {
  const { title, excerpt, slug, publishedDate, readTime, cover } = content;

  const coverUrl = getCoverUrl(cover);
  const coverAlt = getCoverAlt(cover, title);

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4 }}
      className="group relative rounded-xl bg-card border border-border overflow-hidden card-hover"
    >
      {/* Cover Image */}
      <div className="relative h-48 overflow-hidden bg-secondary">
        {coverUrl ? (
          <Image
            src={coverUrl}
            alt={coverAlt}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-4xl">📝</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Meta */}
        <div className="flex items-center gap-3 text-sm text-muted-foreground mb-3">
          {publishedDate && (
            <span className="flex items-center gap-1.5">
              <span className="w-1 h-1 bg-primary rounded-full" />
              {new Date(publishedDate).toLocaleDateString("en", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          )}
          {readTime && (
            <span className="flex items-center gap-1.5">
              <span className="w-1 h-1 bg-muted-foreground rounded-full" />
              {readTime} min read
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors">
          {title}
        </h3>

        {/* Excerpt */}
        {excerpt && (
          <p className="text-muted-foreground text-sm line-clamp-3 mb-4 leading-relaxed">
            {excerpt}
          </p>
        )}

        {/* Read More Link */}
        <Link
          href={`/en/posts/${slug}`}
          className="inline-flex items-center text-primary hover:text-primary/80 text-sm font-medium group/link"
        >
          Read Article
          <svg
            className="w-4 h-4 ml-1 group-hover/link:translate-x-1 transition-transform"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 8l4 4m0 0l-4 4m4-4H3"
            />
          </svg>
        </Link>
      </div>
    </motion.article>
  );
}
