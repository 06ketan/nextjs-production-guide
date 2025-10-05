"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useMemo, memo } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import type { Locale } from "@/lib/i18n/config";
import type { NavigationItem } from "@/lib/strapi/client";

interface HeaderProps {
  lang: Locale;
  navigationItems?: NavigationItem[];
}

export function Header({ lang, navigationItems = [] }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Memoize sorted navigation items to prevent re-sorting on every render
  const sortedNavigationItems = useMemo(() => {
    return [...navigationItems].sort((a, b) => (a.order || 0) - (b.order || 0));
  }, [navigationItems]);

  const pathWithoutLocale = pathname?.replace(/^\/(en|mr)/, "") || "/";

  const getLocalizedPath = (targetLocale: Locale) => {
    return `/${targetLocale}${pathWithoutLocale === "/" ? "" : pathWithoutLocale}`;
  };

  // Check if a path is active
  // Compare paths without locale prefix (e.g., /en/about -> /about)
  const isActive = (href: string) => {
    // Remove locale prefix from href (e.g., /en/about -> /about)
    const hrefWithoutLocale = href.replace(/^\/(en|mr)/, "") || "/";
    const normalizedHref = hrefWithoutLocale.replace(/\/$/, "") || "/";
    const normalizedPath = pathWithoutLocale.replace(/\/$/, "") || "/";
    return normalizedPath === normalizedHref;
  };

  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-lg border-b border-border" />

      <div className="container-wide relative">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href={`/${lang}`} className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center font-bold text-primary-foreground text-sm">
              N
            </div>
            <span className="text-base font-semibold text-foreground group-hover:text-primary transition-colors">
              NextJS Demo
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {sortedNavigationItems.map((item) => {
              if (!item.route || !item.route.path) {
                console.warn(
                  `Navigation item "${item.label}" has no route or path`
                );
                return null;
              }
              const routePath = item.route.path;
              const href = `/${lang}${routePath === "/" ? "" : routePath}`;
              return (
                <NavLink
                  key={`${lang}-${item.id}-${item.route.path}`}
                  href={href}
                  label={item.label}
                  isActive={isActive(href)}
                />
              );
            })}

            {/* Language Switcher */}
            <div className="flex gap-1 ml-8 p-1 rounded-lg bg-secondary">
              <Link
                href={getLocalizedPath("en")}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  lang === "en"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                EN
              </Link>
              <Link
                href={getLocalizedPath("mr")}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  lang === "mr"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                MR
              </Link>
            </div>

            {/* Theme Toggle */}
            <div className="ml-4">
              <ThemeToggle />
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-secondary transition-colors"
          >
            <svg
              className="w-5 h-5 text-foreground"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-border bg-background/95 backdrop-blur-lg"
          >
            <nav className="container-wide py-6 flex flex-col gap-2">
              {sortedNavigationItems.map((item) => {
                if (!item.route || !item.route.path) {
                  console.warn(
                    `Navigation item "${item.label}" has no route or path`
                  );
                  return null;
                }
                const routePath = item.route.path;
                const href = `/${lang}${routePath === "/" ? "" : routePath}`;
                return (
                  <MobileNavLink
                    key={`${lang}-${item.id}-${item.route.path}`}
                    href={href}
                    label={item.label}
                    isActive={isActive(href)}
                    onClick={() => setMobileMenuOpen(false)}
                  />
                );
              })}

              <div className="flex gap-2 mt-6 pt-6 border-t border-border">
                <Button
                  asChild
                  variant={lang === "en" ? "default" : "outline"}
                  size="sm"
                  className="flex-1"
                >
                  <Link href={getLocalizedPath("en")}>English</Link>
                </Button>
                <Button
                  asChild
                  variant={lang === "mr" ? "default" : "outline"}
                  size="sm"
                  className="flex-1"
                >
                  <Link href={getLocalizedPath("mr")}>मराठी</Link>
                </Button>
              </div>

              <div className="flex justify-center mt-4 pt-4 border-t border-border">
                <ThemeToggle />
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

const NavLink = memo(
  ({
    href,
    label,
    isActive,
  }: {
    href: string;
    label?: string;
    isActive: boolean;
  }) => {
    return (
      <Link
        href={href}
        className={`px-4 py-2 text-sm rounded-lg transition-colors relative ${
          isActive
            ? "text-primary font-semibold"
            : "text-muted-foreground hover:text-foreground hover:bg-secondary"
        }`}
      >
        {label}
        {isActive && (
          <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
        )}
      </Link>
    );
  }
);

NavLink.displayName = "NavLink";

const MobileNavLink = memo(
  ({
    href,
    label,
    isActive,
    onClick,
  }: {
    href: string;
    label?: string;
    isActive: boolean;
    onClick: () => void;
  }) => {
    return (
      <Link
        href={href}
        onClick={onClick}
        className={`px-4 py-3 rounded-lg transition-colors relative ${
          isActive
            ? "text-primary font-semibold bg-primary/5"
            : "text-foreground hover:bg-secondary"
        }`}
      >
        {label}
        {isActive && (
          <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full" />
        )}
      </Link>
    );
  }
);

MobileNavLink.displayName = "MobileNavLink";
