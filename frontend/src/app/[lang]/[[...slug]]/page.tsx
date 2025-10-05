import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { renderBlocks, type BlockItem } from "@/lib/engine";
import { isValidLocale, i18n, type Locale } from "@/lib/i18n/config";
import { fetchStrapi, ApiEndpoints } from "@/lib/strapi/fetchStrapi";
import { extractSeoData } from "@/lib/strapi/seo";

export const revalidate = 31536000;

export async function generateStaticParams() {
  return [];
}

interface StrapiPage {
  id: number;
  pathName: string;
  title?: string;
  blocks?: BlockItem[];
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
  };
}

interface StrapiPost {
  id: number;
  pathName?: string;
  slug: string;
  title?: string;
  blocks?: BlockItem[];
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
  };
}

type PageData = StrapiPage | StrapiPost;

async function fetchPageOrPost(
  path: string,
  locale: Locale
): Promise<PageData | null> {
  // First try to find a Page with this pathName
  const pageResponse = await fetchStrapi<StrapiPage[]>(
    `${ApiEndpoints?.pages}?filters[pathName][$eq]=${path}&locale=${locale}`,
    {},
    {},
    "pages"
  );

  if (pageResponse?.data?.[0]) {
    return pageResponse?.data?.[0];
  }

  // If not a page, try to find a Post with this pathName
  const postResponse = await fetchStrapi<StrapiPost[]>(
    `${ApiEndpoints?.posts}?filters[pathName][$eq]=${path}&locale=${locale}`,
    {},
    {},
    "posts"
  );

  if (postResponse?.data?.[0]) {
    return postResponse?.data?.[0];
  }

  return null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug?: string[] }>;
}): Promise<Metadata> {
  const { lang, slug: slugArray = [] } = await params;
  const path = slugArray?.length > 0 ? "/" + slugArray?.join("/") : "/";

  // Skip special paths
  if (
    path?.startsWith("/.well-known") ||
    path?.startsWith("/_next") ||
    path?.startsWith("/api")
  ) {
    return { robots: "noindex, nofollow" };
  }

  const locale: Locale = isValidLocale(lang) ? lang : i18n?.defaultLocale;
  const pageData = await fetchPageOrPost(path, locale);
  const { seo } = extractSeoData(pageData);

  return seo;
}

export default async function DynamicPage({
  params,
}: {
  params: Promise<{ lang: string; slug?: string[] }>;
}) {
  const { lang, slug: slugArray = [] } = await params;
  const path = slugArray?.length > 0 ? "/" + slugArray?.join("/") : "/";
  const locale: Locale = isValidLocale(lang) ? lang : i18n?.defaultLocale;

  // Fetch page or post from Strapi
  const pageData = await fetchPageOrPost(path, locale);

  if (!pageData) {
    notFound();
  }

  // Render blocks from Strapi with locale context
  // This happens during build for SSG
  if (
    pageData?.blocks &&
    Array.isArray(pageData?.blocks) &&
    pageData?.blocks?.length > 0
  ) {
    const renderedBlocks = await renderBlocks(pageData?.blocks, { locale });
    return <div className="flex flex-col">{renderedBlocks}</div>;
  }

  return (
    <div className="p-8 text-center text-muted-foreground">
      No content available
    </div>
  );
}
