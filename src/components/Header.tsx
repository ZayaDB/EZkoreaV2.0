"use client";

import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./LanguageSwitcher";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import {
  Bars3Icon,
  XMarkIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
  const { t } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    const checkLogin = () => {
      const token = localStorage.getItem("token");
      const userData = localStorage.getItem("user");
      if (token && userData) {
        setIsLoggedIn(true);
        setUser(JSON.parse(userData));
      } else {
        setIsLoggedIn(false);
        setUser(null);
      }
    };

    checkLogin();
    window.addEventListener("storage", checkLogin);
    return () => window.removeEventListener("storage", checkLogin);
  }, []);

  // 드롭다운 외부 클릭 시 닫힘
  useEffect(() => {
    if (!dropdownOpen) return;
    function handleClick(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [dropdownOpen]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUser(null);
    window.location.href = "/";
  };

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
            {isLoggedIn && (
              <Link href="/become-instructor" className="btn-secondary">
                {t("nav.becomeInstructor")}
              </Link>
            )}
            {isLoggedIn ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  onClick={() => setDropdownOpen((prev) => !prev)}
                  tabIndex={0}
                >
                  <UserCircleIcon className="h-6 w-6 text-foreground" />
                </button>
                {dropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50"
                    tabIndex={-1}
                  >
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => setDropdownOpen(false)}
                    >
                      {t("profile.profile")}
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setDropdownOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      {t("profile.logout")}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login" className="btn-primary text-sm">
                {t("nav.login")}
              </Link>
            )}
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
            {isLoggedIn ? (
              <>
                <Link
                  href="/profile"
                  className="block py-2 text-base font-semibold hover:text-primary transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t("profile.profile")}
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left py-2 text-base font-semibold hover:text-primary transition-colors"
                >
                  {t("profile.logout")}
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="block w-full btn-primary text-center mb-4"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t("nav.login")}
              </Link>
            )}
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
