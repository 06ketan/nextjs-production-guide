import { NextResponse } from "next/server";
import type { NextRequest, NextFetchEvent } from "next/server";
import type { CustomMiddleware } from "./chain";

/**
 * Security Middleware
 *
 * Adds security headers and basic protections:
 * - XSS Protection
 * - Content Security Policy
 * - Frame Options
 * - Referrer Policy
 */
export function securityMiddleware(
  middleware: CustomMiddleware
): CustomMiddleware {
  return async (request: NextRequest, event: NextFetchEvent) => {
    const response = await middleware(request, event, NextResponse.next());

    // Add security headers
    if (response instanceof NextResponse) {
      response.headers.set("X-Content-Type-Options", "nosniff");
      response.headers.set("X-Frame-Options", "DENY");
      response.headers.set("X-XSS-Protection", "1; mode=block");
      response.headers.set(
        "Referrer-Policy",
        "strict-origin-when-cross-origin"
      );
      response.headers.set(
        "Permissions-Policy",
        "camera=(), microphone=(), geolocation=()"
      );

      // CSP - adjust based on your needs
      const cspDirectives = [
        "default-src 'self'",
        "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
        "style-src 'self' 'unsafe-inline'",
        "img-src 'self' data: https:",
        "font-src 'self' data:",
        "connect-src 'self' https://cdn.jsdelivr.net",
      ].join("; ");

      response.headers.set("Content-Security-Policy", cspDirectives);
    }

    return response;
  };
}
