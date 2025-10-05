import { MarkdownView } from "@/components/ui/markdown-view";
import type { RichTextBlockProps } from "@/lib/engine/types";

export default function RichTextBlock({ content }: RichTextBlockProps) {
  const { body } = content;

  if (!body) return null;

  return (
    <section className="section-spacing-sm">
      <div className="container-narrow">
        <MarkdownView content={body} />
      </div>
    </section>
  );
}
