import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { i18n, isValidLocale, type Locale } from "@/lib/i18n/config";
import type {
  NavigationItem,
  Navigation,
} from "@/lib/strapi/client";
import { getGlobal } from "@/lib/strapi/client";

// Default navigation fallback
const defaultNav: Navigation = {
  home: "Home",
  posts: "Posts",
  about: "About",
  readMore: "Read More",
  backToHome: "Back to Home",
  backToPosts: "Back to Posts",
  loading: "Loading...",
  notFound: "Not Found",
  noPostsFound: "No posts found.",
};

export async function generateStaticParams() {
  return i18n?.locales?.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const locale: Locale = isValidLocale(lang) ? lang : i18n?.defaultLocale;
  const global = await getGlobal(locale);

  return {
    title: {
      template: `%s | ${global?.siteName || "Next.js"}`,
      default: global?.siteName || "Next.js Self-Hosting",
    },
    description: global?.siteDescription || "",
  };
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  if (!isValidLocale(lang)) {
    notFound();
  }

  const global = await getGlobal(lang);
  const nav = global?.navigation || defaultNav;
  const navigationItems: NavigationItem[] = global?.navigationItems || [];

  // Nested layouts should NOT render <html> or <body> tags
  // Only the root layout should render those
  return (
    <>
      <Header lang={lang} navigationItems={navigationItems} />
      <main className="flex-1">{children}</main>
      <Footer lang={lang} nav={nav} />
    </>
  );
}
