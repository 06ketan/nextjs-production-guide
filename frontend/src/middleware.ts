import { chain } from "./middleware/chain";
import { localeMiddleware } from "./middleware/locale-middleware";
import { securityMiddleware } from "./middleware/security-middleware";

/**
 * Production-Grade Middleware Chain
 *
 * Order matters:
 * 1. Security - Add security headers first
 * 2. Locale - Handle locale detection and redirects
 *
 * All requests go through this chain before reaching pages
 */
export default chain([securityMiddleware, localeMiddleware]);

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - robots.txt (robots file)
     * - sitemap.xml (sitemap file)
     * - .well-known (well-known files)
     * - Static files (images, fonts, etc.)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap|.well-known|.*\\.(?:ico|png|jpg|jpeg|svg|json|xml|txt)$).*)",
  ],
};
