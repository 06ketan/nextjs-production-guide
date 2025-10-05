import type { Metadata } from "next";

interface SeoData {
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string;
  canonicalURL?: string;
}

interface PageData {
  title?: string;
  seo?: SeoData;
}

/**
 * Extract SEO metadata from Strapi response
 */
export function extractSeoData(pageData: PageData | null | undefined): {
  seo: Metadata;
} {
  if (!pageData) {
    return {
      seo: {
        title: "Page Not Found",
        description: "The requested page could not be found.",
      },
    };
  }

  const { title, seo } = pageData || {};

  return {
    seo: {
      title: seo?.metaTitle || title || "Untitled",
      description: seo?.metaDescription || "",
      keywords: seo?.keywords?.split(",")?.map((k) => k?.trim()),
      alternates: seo?.canonicalURL
        ? { canonical: seo?.canonicalURL }
        : undefined,
      openGraph: {
        title: seo?.metaTitle || title || "Untitled",
        description: seo?.metaDescription || "",
        type: "website",
      },
    },
  };
}
