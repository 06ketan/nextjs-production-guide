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
    "/((?!_next/static|_next/image|api|favicon\\.ico|robots\\.txt|\\.well-known|icon-\\d+x\\d+\\.png$|\\.(?:png|jpg|jpeg|json)$).*)",
  ],
};