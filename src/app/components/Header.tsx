"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";

export default function Header() {
  const { t, i18n } = useTranslation();
  const [user, setUser] = useState<any>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem("language", lng);
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-xl font-bold">
            EZ Korea
          </Link>

          <div className="flex items-center space-x-4">
            {/* Language Switcher */}
            <div className="flex space-x-2">
              <button
                onClick={() => changeLanguage("ko")}
                className={`w-8 h-8 rounded-full overflow-hidden ${
                  i18n.language === "ko" ? "ring-2 ring-blue-500" : ""
                }`}
              >
                <img src="/img/kr.png" alt="Korean" className="w-full h-full" />
              </button>
              <button
                onClick={() => changeLanguage("en")}
                className={`w-8 h-8 rounded-full overflow-hidden ${
                  i18n.language === "en" ? "ring-2 ring-blue-500" : ""
                }`}
              >
                <img
                  src="/img/us.png"
                  alt="English"
                  className="w-full h-full"
                />
              </button>
            </div>

            {/* User Menu */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="flex items-center space-x-2"
                >
                  <img
                    src={user.profileImage || "/img/default-profile.png"}
                    alt="profile"
                    className="w-8 h-8 rounded-full"
                  />
                  <span>{user.name}</span>
                </button>
                {isOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-2">
                    <Link
                      href="/profile"
                      className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      마이페이지
                    </Link>
                    {user.role === "admin" && (
                      <Link
                        href="/admin"
                        className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        관리자 페이지
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      로그아웃
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-x-4">
                <Link
                  href="/login"
                  className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                >
                  {t("nav.login")}
                </Link>
                <Link href="/signup" className="btn-primary">
                  {t("nav.signup")}
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
