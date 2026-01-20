import type { Metadata } from "next";
import { cache } from "react";
import { notFound, permanentRedirect } from "next/navigation";
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

interface PageName {
  pathName: string;
  title: string;
}


const fetchPageNames = cache(async (locale: Locale): Promise<string[] | null> => {
  try {
    const response = await fetchStrapi<PageName[]>(
      `/pages/names?locale=${locale}`,
      {  }, // Cache for 1 minute
      {},
      "page-names"
    );
    return response?.data?.map((p) => p.pathName) || [];
  } catch (error) {
    console.warn("[Page] Failed to fetch page names, using fallback:", error);
    return null;
  }
});

async function fetchPage(
  path: string,
  locale: Locale
): Promise<StrapiPage | null> {
  const response = await fetchStrapi<StrapiPage[]>(
    `${ApiEndpoints?.pages}?filters[pathName][$eq]=${path}&locale=${locale}`,
    {},
    {},
    "pages"
  );
  return response?.data?.[0] || null;
}

async function fetchPost(
  slug: string,
  locale: Locale
): Promise<StrapiPost | null> {
  const response = await fetchStrapi<StrapiPost[]>(
    `${ApiEndpoints?.posts}?filters[slug][$eq]=${slug}&locale=${locale}`,
    {},
    {},
    "posts"
  );
  return response?.data?.[0] || null;
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
  const normalizedPath = path === "/" ? "" : path.replace(/^\//, "");

  const validPageNames = await fetchPageNames(locale);

  const isPostRoute =
    normalizedPath.startsWith("posts/") && validPageNames?.includes("posts");
  const postSlug = isPostRoute ? normalizedPath.replace("posts/", "") : null;

  let pageData: PageData | null = null;

  if (isPostRoute && postSlug) {
    pageData = await fetchPost(postSlug, locale);
  } else if (validPageNames?.includes(normalizedPath)) {
    pageData = await fetchPage(path, locale);
  }

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
  // Prevent infinite redirect loop: if already on not-found, use notFound()
  if (path === "/not-found") {
    notFound();
  }

  const validPageNames = await fetchPageNames(locale);

  const isPostRoute = path.startsWith("/posts/") && validPageNames?.includes("/posts");
  const postSlug = isPostRoute ? path.replace("/posts/", "") : null;

  const isValidPage = validPageNames?.includes(path);
  if (!isPostRoute && !isValidPage ) {
    permanentRedirect(`/${locale}/not-found`);
  }

  let pageData: PageData | null = null;

  if (isPostRoute && postSlug&& postSlug!==""&&postSlug!=="/") {
    pageData = await fetchPost(postSlug, locale);
  } else if (isValidPage) {
    pageData = await fetchPage(path, locale);
  }

  if (!pageData) {
    permanentRedirect(`/${locale}/not-found`);
  }

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
