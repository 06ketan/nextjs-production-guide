import dynamic from "next/dynamic";
import type { ComponentType as ReactComponentType } from "react";

// Block item interface from Strapi
export interface BlockItem {
  id: number;
  __component: string;
  [key: string]: unknown;
}

// Strapi media type
export interface StrapiMedia {
  url?: string;
  alternativeText?: string;
}

// Component props interfaces
export interface HeroBlockProps {
  content: {
    title: string;
    subtitle?: string;
    description?: string;
    ctaText?: string;
    ctaLink?: string;
    backgroundImage?: string;
    useSparkles?: boolean;
  };
}

export interface RichTextBlockProps {
  content: {
    body: string;
  };
}

export interface PostCardContent {
  id?: number;
  title: string;
  excerpt?: string;
  slug: string;
  pathName?: string;
  publishedDate?: string;
  readTime?: string;
  cover?: StrapiMedia | { data?: { attributes: StrapiMedia } };
}

export interface PostCardProps {
  content: PostCardContent;
}

export interface PostListProps {
  content: {
    posts?: PostCardContent[];
    title?: string;
    subtitle?: string;
    locale?: string;
  };
}

export interface StoryBlockProps {
  content: {
    storyInfo: Array<{
      header?: {
        title?: string;
        description?: string;
      };
      storyContent?: Array<{
        content?: Array<{
          title?: string;
          description?: string;
        }>;
        disclaimer?: string;
      }>;
      addDivider?: boolean;
    }>;
    media?: StrapiMedia;
    showShareButton?: boolean;
  };
}

export interface FeatureCardProps {
  content: {
    title: string;
    description: string;
    icon?: string;
  };
}

export interface FeaturesSectionProps {
  content: {
    heading?: string;
    subheading?: string;
    features: Array<{
      title: string;
      description: string;
      icon?: string;
    }>;
  };
}

export interface FaqBlockProps {
  content: {
    title?: string;
    faqs: Array<{
      question: string;
      answer: string;
    }>;
  };
}

export interface BannerBlockProps {
  content: {
    title: string;
    subtitle?: string;
    backgroundImage?: string;
    ctaText?: string;
    ctaLink?: string;
  };
}

// Component types union
export type ComponentType =
  | "blocks.hero"
  | "blocks.rich-text"
  | "blocks.post-card"
  | "blocks.post-list"
  | "blocks.story"
  | "blocks.feature-card"
  | "blocks.features"
  | "blocks.faq"
  | "blocks.faq-bad"
  | "blocks.faq-good"
  | "blocks.banner";

// All component props union
export type ComponentProps =
  | HeroBlockProps
  | RichTextBlockProps
  | PostCardProps
  | PostListProps
  | StoryBlockProps
  | FeatureCardProps
  | FeaturesSectionProps
  | FaqBlockProps
  | BannerBlockProps;

// Props map for type safety
export type ComponentsPropsMap = {
  "blocks.hero": HeroBlockProps;
  "blocks.rich-text": RichTextBlockProps;
  "blocks.post-card": PostCardProps;
  "blocks.post-list": PostListProps;
  "blocks.story": StoryBlockProps;
  "blocks.feature-card": FeatureCardProps;
  "blocks.features": FeaturesSectionProps;
  "blocks.faq": FaqBlockProps;
  "blocks.faq-bad": FaqBlockProps;
  "blocks.faq-good": FaqBlockProps;
  "blocks.banner": BannerBlockProps;
};

// Dynamic component imports with SSR
const HeroBlock = dynamic(() => import("@/components/blocks/hero-block"), {
  ssr: true,
});
const RichTextBlock = dynamic(
  () => import("@/components/blocks/rich-text-block"),
  { ssr: true }
);
const PostCard = dynamic(() => import("@/components/blocks/post-card"), {
  ssr: true,
});
const PostList = dynamic(() => import("@/components/blocks/post-list"), {
  ssr: true,
});
const StoryBlock = dynamic(() => import("@/components/blocks/story-block"), {
  ssr: true,
});
const FeatureCard = dynamic(() => import("@/components/blocks/feature-card"), {
  ssr: true,
});
const FeaturesSection = dynamic(
  () => import("@/components/blocks/features-section"),
  { ssr: true }
);
const FaqBlock = dynamic(() => import("@/components/blocks/faq-block"), {
  ssr: true,
});
const FaqBlockBad = dynamic(() => import("@/components/blocks/faq-block-bad"), {
  ssr: true,
});
const FaqBlockGood = dynamic(
  () => import("@/components/blocks/faq-block-good"),
  { ssr: true }
);
const BannerBlock = dynamic(() => import("@/components/blocks/banner-block"), {
  ssr: true,
});

// Component view map
export const componentViewMap: Record<
  ComponentType,
  ReactComponentType<ComponentProps>
> = {
  "blocks.hero": HeroBlock as ReactComponentType<ComponentProps>,
  "blocks.rich-text": RichTextBlock as ReactComponentType<ComponentProps>,
  "blocks.post-card": PostCard as ReactComponentType<ComponentProps>,
  "blocks.post-list": PostList as ReactComponentType<ComponentProps>,
  "blocks.story": StoryBlock as ReactComponentType<ComponentProps>,
  "blocks.feature-card": FeatureCard as ReactComponentType<ComponentProps>,
  "blocks.features": FeaturesSection as ReactComponentType<ComponentProps>,
  "blocks.faq": FaqBlock as ReactComponentType<ComponentProps>,
  "blocks.faq-bad": FaqBlockBad as ReactComponentType<ComponentProps>,
  "blocks.faq-good": FaqBlockGood as ReactComponentType<ComponentProps>,
  "blocks.banner": BannerBlock as ReactComponentType<ComponentProps>,
};

// Prop mappings - transform Strapi data to component props
// BlockItem contains component data at runtime; TypeScript can't verify structure
export const componentPropMappings: Record<
  ComponentType,
  (data: BlockItem) => ComponentProps
> = {
  "blocks.hero": (data) => ({ content: data }) as unknown as HeroBlockProps,
  "blocks.rich-text": (data) =>
    ({ content: data }) as unknown as RichTextBlockProps,
  "blocks.post-card": (data) => ({ content: data }) as unknown as PostCardProps,
  "blocks.post-list": (data) => ({ content: data }) as unknown as PostListProps,
  "blocks.story": (data) => ({ content: data }) as unknown as StoryBlockProps,
  "blocks.feature-card": (data) =>
    ({ content: data }) as unknown as FeatureCardProps,
  "blocks.features": (data) =>
    ({ content: data }) as unknown as FeaturesSectionProps,
  "blocks.faq": (data) => ({ content: data }) as unknown as FaqBlockProps,
  "blocks.faq-bad": (data) => ({ content: data }) as unknown as FaqBlockProps,
  "blocks.faq-good": (data) => ({ content: data }) as unknown as FaqBlockProps,
  "blocks.banner": (data) => ({ content: data }) as unknown as BannerBlockProps,
};
