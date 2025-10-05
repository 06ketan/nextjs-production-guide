"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Locale } from "@/lib/i18n/config";
import type { Navigation } from "@/lib/strapi/client";

interface FooterProps {
  lang: Locale;
  nav: Navigation;
}

export function Footer({ lang, nav }: FooterProps) {
  const pathname = usePathname();

  const pathWithoutLocale = pathname?.replace(/^\/(en|mr)/, "") || "/";

  const getLocalizedPath = (targetLocale: Locale) => {
    return `/${targetLocale}${pathWithoutLocale === "/" ? "" : pathWithoutLocale}`;
  };

  return (
    <footer className="border-t border-border bg-card">
      <div className="container-wide py-16">
        <div className="grid md:grid-cols-3 gap-12">
          {/* Brand */}
          <div>
            <Link
              href={`/${lang}`}
              className="flex items-center gap-3 mb-4 group"
            >
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center font-bold text-primary-foreground text-sm">
                N
              </div>
              <span className="text-base font-semibold text-foreground">
                NextJS Demo
              </span>
            </Link>
            <p className="text-muted-foreground text-sm max-w-xs leading-relaxed">
              A production-ready Next.js 15 application with Strapi CMS, Redis
              caching, and i18n support.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4">
              Navigation
            </h4>
            <nav className="flex flex-col gap-3">
              <FooterLink href={`/${lang}`} label={nav?.home} />
              <FooterLink href={`/${lang}/posts`} label={nav?.posts} />
              <FooterLink href={`/${lang}/about`} label={nav?.about} />
            </nav>
          </div>

          {/* Language */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4">
              Language
            </h4>
            <div className="flex gap-2">
              <Link
                href={getLocalizedPath("en")}
                className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                  lang === "en"
                    ? "bg-primary/10 text-primary border border-primary/20"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                English
              </Link>
              <Link
                href={getLocalizedPath("mr")}
                className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                  lang === "mr"
                    ? "bg-primary/10 text-primary border border-primary/20"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                मराठी
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-16 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-muted-foreground text-sm">
            © {new Date()?.getFullYear()} Next.js Self-Hosting Demo. All rights
            reserved.
          </p>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span>Built with</span>
            <span className="flex items-center gap-2">
              <span className="text-foreground font-medium">Next.js 15</span>
              <span>·</span>
              <span className="text-foreground font-medium">Strapi</span>
              <span>·</span>
              <span className="text-foreground font-medium">Redis</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ href, label }: { href: string; label?: string }) {
  return (
    <Link
      href={href}
      className="text-muted-foreground hover:text-primary text-sm transition-colors"
    >
      {label}
    </Link>
  );
}
