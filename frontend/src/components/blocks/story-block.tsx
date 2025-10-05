"use client";

import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import type { StoryBlockProps } from "@/lib/engine/types";

export default function StoryBlock({ content }: StoryBlockProps) {
  const { storyInfo, media, showShareButton } = content;

  const handleShare = () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      navigator.share({ url: window.location.href });
    }
  };

  return (
    <article className="container-narrow section-spacing">
      <div className="flex flex-col gap-10">
        {storyInfo?.map((section, sectionIndex) => (
          <div key={sectionIndex} className="flex flex-col gap-6">
            {/* Section Header */}
            {section.header && (
              <div className="flex flex-col gap-4">
                {section.header.title && (
                  <h2 className="text-2xl font-bold text-foreground">
                    {section.header.title}
                  </h2>
                )}
                {section.header.description && (
                  <div
                    className="text-muted-foreground leading-relaxed"
                    dangerouslySetInnerHTML={{
                      __html: section.header.description,
                    }}
                  />
                )}
              </div>
            )}

            {/* Story Content */}
            {section.storyContent?.map((contentBlock, contentIndex) => (
              <div key={contentIndex} className="flex flex-col gap-4">
                {contentBlock.content?.map((item, itemIndex) => (
                  <div key={itemIndex} className="flex flex-col gap-2">
                    {item.title && (
                      <h3 className="text-lg font-semibold text-foreground">
                        {item.title}
                      </h3>
                    )}
                    {item.description && (
                      <div
                        className="text-muted-foreground leading-relaxed [&_ul]:ml-4 [&_ul]:list-disc [&_ol]:ml-4 [&_ol]:list-decimal"
                        dangerouslySetInnerHTML={{ __html: item.description }}
                      />
                    )}
                  </div>
                ))}

                {contentBlock.disclaimer && (
                  <p className="text-sm text-muted-foreground/70 italic mt-4">
                    {contentBlock.disclaimer}
                  </p>
                )}
              </div>
            ))}

            {/* Divider */}
            {section.addDivider && <Separator className="bg-border my-4" />}
          </div>
        ))}

        {/* Media */}
        {media?.url && (
          <div className="relative mt-8 aspect-video rounded-xl overflow-hidden border border-border">
            <Image
              src={
                media.url.startsWith("http")
                  ? media.url
                  : `http://localhost:1337${media.url}`
              }
              alt={media.alternativeText || "Story media"}
              fill
              className="object-cover"
            />
          </div>
        )}

        {/* Share Button */}
        {showShareButton && (
          <div className="flex justify-end mt-4">
            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                <polyline points="16 6 12 2 8 6" />
                <line x1="12" y1="2" x2="12" y2="15" />
              </svg>
              Share
            </button>
          </div>
        )}
      </div>
    </article>
  );
}
