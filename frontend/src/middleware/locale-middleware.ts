import { NextResponse } from "next/server";
import type { NextRequest, NextFetchEvent } from "next/server";
import { i18n, isValidLocale, type Locale } from "@/lib/i18n/config";
import type { CustomMiddleware } from "./chain";

/**
 * Locale Detection & Redirect Middleware
 *
 * Handles all URL patterns:
 * - /xyz -> /en/xyz (default locale)
 * - /xx/s/w/ -> /en/xx/s/w/ (default locale)
 * - /[lang]/xx -> /[lang]/xx (keep if valid locale)
 * - /[invalid-lang]/xx -> /en/xx (redirect to default)
 *
 * Excludes:
 * - Static files (_next, api, favicon, etc.)
 * - Already localized paths with valid locale
 */
export function localeMiddleware(
  middleware: CustomMiddleware
): CustomMiddleware {
  return async (request: NextRequest, event: NextFetchEvent) => {
    const { pathname, search } = request.nextUrl;
    const response = NextResponse.next();

    // Skip middleware for static files and API routes
    if (
      pathname.startsWith("/_next") ||
      pathname.startsWith("/api") ||
      pathname.startsWith("/favicon") ||
      pathname.startsWith("/robots.txt") ||
      pathname.startsWith("/sitemap") ||
      pathname.startsWith("/.well-known") ||
      pathname.match(/\.(ico|png|jpg|jpeg|svg|json|xml|txt)$/i)
    ) {
      return middleware(request, event, response);
    }

    // Extract potential locale from first segment
    const pathSegments = pathname.split("/").filter(Boolean);
    const firstSegment = pathSegments[0];

    // Check if first segment is a valid locale
    if (isValidLocale(firstSegment)) {
      // Path already has valid locale: /en/... or /mr/...
      // Set locale header for downstream use
      response.headers.set("x-locale", firstSegment);
      return middleware(request, event, response);
    }

    // No locale in path - redirect to default locale
    // Preserve the original path and query params
    const defaultLocale: Locale = i18n.defaultLocale;
    const newPath = `/${defaultLocale}${pathname === "/" ? "" : pathname}${search}`;
    const redirectUrl = new URL(newPath, request.url);

    // Set locale header
    response.headers.set("x-locale", defaultLocale);

    // Redirect to localized path
    return NextResponse.redirect(redirectUrl);
  };
}
