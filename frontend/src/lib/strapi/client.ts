import type { Locale } from "@/lib/i18n/config";

/**
 * Smart Strapi URL resolution
 * Uses STRAPI_URL env var in Docker, falls back to localhost for local dev
 */
function getStrapiUrl(): string {
  const envUrl = process.env.STRAPI_URL;
  if (!envUrl) return "http://localhost:1337";

  // Detect Docker environment
  if (envUrl.includes("host.docker.internal")) {
    const isInDocker =
      process.env.DOCKER_CONTAINER === "true" ||
      process.env.IN_DOCKER === "true" ||
      !!process.env.REDIS_URL ||
      !!process.env.REDIS_CLUSTER_URLS;

    if (!isInDocker) {
      console.warn(
        "[Strapi] host.docker.internal detected but not in Docker. Using localhost:1337"
      );
      return "http://localhost:1337";
    }
  }

  return envUrl;
}

const STRAPI_URL = getStrapiUrl();
const STRAPI_TOKEN = process.env.STRAPI_TOKEN;

interface StrapiResponse<T> {
  data: T;
  meta?: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

interface StrapiSingleResponse<T> {
  data: { id: number; attributes: T } | null;
}

interface StrapiCollectionResponse<T> {
  data: { id: number; attributes: T }[];
}

interface StrapiAttributes {
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  locale?: string;
}

export interface Post extends StrapiAttributes {
  id: number;
  title: string;
  slug: string;
  pathName?: string;
  excerpt?: string;
  blocks?: unknown[];
  cover?: {
    data?: {
      attributes: {
        url: string;
        alternativeText?: string;
      };
    };
  };
  publishedDate?: string;
  readTime?: string;
  seo?: SEO;
}

export interface About extends StrapiAttributes {
  id: number;
  title: string;
  description?: string;
  content?: string;
  seo?: SEO;
}

export interface Navigation {
  home: string;
  posts: string;
  about: string;
  faqExamples?: string;
  readMore?: string;
  backToHome?: string;
  backToPosts?: string;
  loading?: string;
  notFound?: string;
  noPostsFound?: string;
}

export interface Route {
  id: number;
  path: string;
  label: string;
  description?: string;
}

export interface NavigationItem {
  id: number;
  label: string;
  order: number;
  route: Route | null;
}

export interface Global extends StrapiAttributes {
  id: number;
  siteName: string;
  siteDescription?: string;
  navigation?: Navigation;
  navigationItems?: NavigationItem[];
  defaultSeo?: SEO;
}

interface SEO {
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string;
  canonicalURL?: string;
}

async function fetchStrapi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T | null> {
  const url = `${STRAPI_URL}/api${endpoint}`;
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(STRAPI_TOKEN && { Authorization: `Bearer ${STRAPI_TOKEN}` }),
  };

  try {
    const response = await fetch(url, {
      headers,
      ...options,
      next: {
        revalidate: 3600, // ISR: revalidate every hour
        tags: [endpoint?.split("?")?.[0]?.replace("/", "") || "strapi"],
      },
    });

    if (!response?.ok) {
      if (response?.status === 404) return null;
      console.error(
        `Strapi API error: ${response?.status} ${response?.statusText}`
      );
      return null;
    }

    return response?.json();
  } catch (error) {
    console.error(`Failed to fetch from Strapi: ${endpoint}`, error);
    return null;
  }
}

// Flatten Strapi v4 response for collection items
function flattenPostAttributes(data: {
  id: number;
  attributes: Omit<Post, "id">;
}): Post {
  return { id: data?.id, ...data?.attributes };
}

function flattenAboutAttributes(data: {
  id: number;
  attributes: Omit<About, "id">;
}): About {
  return { id: data?.id, ...data?.attributes };
}

function flattenRoute(route: any): Route | null {
  if (!route) return null;

  // Handle Strapi v4 structure variations:
  // 1. route.data.attributes (relation with populate)
  // 2. route.data (relation without attributes wrapper)
  // 3. route.attributes (direct)
  // 4. route (already flattened)

  let routeData = route;
  if (route.data) {
    routeData = route.data;
  }
  if (routeData?.attributes) {
    routeData = routeData.attributes;
  }

  if (!routeData || !routeData.path) {
    console.warn("Route data missing path:", route);
    return null;
  }

  return {
    id: routeData.id || route.id,
    path: routeData.path,
    label: routeData.label || "",
    description: routeData.description,
  };
}

function flattenNavigationItem(item: any): NavigationItem | null {
  if (!item) return null;

  // Handle component structure: item.attributes or item
  const itemData = item?.attributes || item;
  if (!itemData) return null;

  // Get route - could be in itemData.route or itemData.route.data
  const route = itemData.route || item.route;

  return {
    id: itemData.id || item.id,
    label: itemData.label || "",
    order: itemData.order ?? 0,
    route: flattenRoute(route),
  };
}

function flattenGlobalAttributes(data: {
  id: number;
  attributes: Omit<Global, "id">;
}): Global {
  const attributes = data?.attributes || {};
  const flattened: Global = {
    id: data?.id,
    ...attributes,
  };

  // Flatten navigationItems if they exist
  // Components can be in attributes.navigationItems directly or as an array
  if (attributes.navigationItems) {
    const items = Array.isArray(attributes.navigationItems)
      ? attributes.navigationItems
      : [];

    flattened.navigationItems = items
      .map((item) => flattenNavigationItem(item))
      .filter(
        (item: NavigationItem | null): item is NavigationItem =>
          item !== null && item.route !== null && item.route.path !== undefined
      );
  } else {
    flattened.navigationItems = [];
  }

  return flattened;
}

// Posts
export async function getPosts(locale: Locale = "en"): Promise<Post[]> {
  const response = await fetchStrapi<
    StrapiCollectionResponse<Omit<Post, "id">>
  >(`/posts?locale=${locale}&populate=*&sort=publishedDate:desc`);

  if (!response?.data) return [];
  return response?.data?.map((item) => flattenPostAttributes(item)) || [];
}

export async function getPostBySlug(
  slug: string,
  locale: Locale = "en"
): Promise<Post | null> {
  const response = await fetchStrapi<
    StrapiCollectionResponse<Omit<Post, "id">>
  >(`/posts?filters[slug][$eq]=${slug}&locale=${locale}&populate=*`);

  if (!response?.data?.[0]) return null;
  return flattenPostAttributes(response?.data?.[0]);
}

export async function getPostByPathName(
  pathName: string,
  locale: Locale = "en"
): Promise<Post | null> {
  const response = await fetchStrapi<
    StrapiCollectionResponse<Omit<Post, "id">>
  >(`/posts?filters[pathName][$eq]=${pathName}&locale=${locale}&populate=*`);

  if (!response?.data?.[0]) return null;
  return flattenPostAttributes(response?.data?.[0]);
}

export async function getAllPostSlugs(): Promise<
  { slug: string; locale: string }[]
> {
  const locales = ["en", "mr"];
  const allSlugs: { slug: string; locale: string }[] = [];

  for (const locale of locales) {
    const response = await fetchStrapi<
      StrapiResponse<{ id: number; attributes: { slug: string } }[]>
    >(`/posts?locale=${locale}&fields[0]=slug`);

    response?.data?.forEach((item) => {
      allSlugs?.push({ slug: item?.attributes?.slug, locale });
    });
  }

  return allSlugs;
}

// About
export async function getAbout(locale: Locale = "en"): Promise<About | null> {
  const response = await fetchStrapi<StrapiSingleResponse<Omit<About, "id">>>(
    `/about?locale=${locale}&populate=*`
  );

  if (!response?.data) return null;
  return flattenAboutAttributes(response?.data);
}

// Global
export async function getGlobal(locale: Locale = "en"): Promise<Global | null> {
  // Middleware handles populate, just need locale
  const response = await fetchStrapi<StrapiSingleResponse<Omit<Global, "id">>>(
    `/global?locale=${locale}`
  );

  if (!response?.data) return null;
  return flattenGlobalAttributes(response?.data);
}
