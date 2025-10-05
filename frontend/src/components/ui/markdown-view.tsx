"use client";

import MarkdownPreview from "@uiw/react-markdown-preview";
import { useTheme } from "next-themes";
import { useRef } from "react";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

interface MarkdownViewProps {
  content: string;
  className?: string;
}

export function MarkdownView({ content, className }: MarkdownViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();

  return (
    <div
      data-color-mode={resolvedTheme === "dark" ? "dark" : "light"}
      ref={containerRef}
      className={cn("markdown-content", className)}
    >
      <MarkdownPreview
        source={content.trim()}
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        style={{
          backgroundColor: "transparent",
          background: "transparent",
          color: "inherit",
        }}
        rehypeRewrite={(node: any, _index: number, parent: any) => {
          // Clean heading <a> tags
          if (
            node?.tagName === "a" &&
            parent?.tagName &&
            /^h(1|2|3|4|5|6)/.test(parent.tagName)
          ) {
            if (Array.isArray(parent.children)) {
              parent.children = parent.children.slice(1);
            }
          }

          // Handle external links - open in new tab
          if (
            node?.tagName === "a" &&
            node?.properties &&
            typeof node.properties.href === "string"
          ) {
            const href = node.properties.href;
            if (
              href.startsWith("http") ||
              href.startsWith("https") ||
              href.startsWith("www")
            ) {
              node.properties.target = "_blank";
              node.properties.rel = "noopener noreferrer";
            }
          }
        }}
      />
    </div>
  );
}
