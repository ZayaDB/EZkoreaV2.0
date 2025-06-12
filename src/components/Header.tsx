"use client";

import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./LanguageSwitcher";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
  const { t } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <header className="sticky top-0 z-50 border-b border-secondary bg-background/80 backdrop-blur-sm">
        <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8">
          <div className="flex lg:flex-1">
            <Link href="/" className="-m-1.5 p-1.5 group">
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-200 inline-block">
                EZKorea
              </span>
            </Link>
          </div>
        </nav>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 border-b border-secondary bg-background/80 backdrop-blur-sm">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8">
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5 group">
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-200 inline-block">
              EZKorea
            </span>
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className="sr-only">메뉴 열기</span>
            {mobileMenuOpen ? (
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            ) : (
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            )}
          </button>
        </div>

        {/* Desktop menu */}
        <div className="hidden lg:flex lg:items-center lg:gap-x-8">
          <div className="flex items-center gap-x-8">
            <Link href="/courses" className="nav-link">
              {t("nav.courses")}
            </Link>
            <Link href="/about" className="nav-link">
              {t("nav.about")}
            </Link>
            <Link href="/contact" className="nav-link">
              {t("nav.contact")}
            </Link>
          </div>
          <div className="flex items-center gap-x-4">
            <ThemeToggle />
            <LanguageSwitcher />
            <Link href="/login" className="btn-primary text-sm">
              {t("nav.login")}
            </Link>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <div
        className={`lg:hidden ${mobileMenuOpen ? "animate-fade-in" : "hidden"}`}
      >
        <div className="space-y-4 px-6 pb-6">
          <div className="space-y-2">
            <Link
              href="/courses"
              className="block py-2 text-base font-semibold hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t("nav.courses")}
            </Link>
            <Link
              href="/about"
              className="block py-2 text-base font-semibold hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t("nav.about")}
            </Link>
            <Link
              href="/contact"
              className="block py-2 text-base font-semibold hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t("nav.contact")}
            </Link>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <Link
              href="/login"
              className="block w-full btn-primary text-center mb-4"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t("nav.login")}
            </Link>
            <div className="flex items-center justify-between">
              <ThemeToggle />
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
