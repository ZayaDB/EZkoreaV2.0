"use client";

import { useTranslation } from "react-i18next";
import Image from "next/image";

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const nextLang = i18n.language === "ko" ? "en" : "ko";
    i18n.changeLanguage(nextLang);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="relative group p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 active:scale-95"
      aria-label={
        i18n.language === "ko" ? "Switch to English" : "한국어로 전환"
      }
    >
      <div className="w-8 h-6 relative overflow-hidden rounded-sm shadow-sm">
        <Image
          src={
            i18n.language === "ko"
              ? "/img/england.svg"
              : "/img/img_koreanFlag_02.jpg"
          }
          alt={i18n.language === "ko" ? "English" : "한국어"}
          fill
          style={{ objectFit: "cover" }}
          className="transform group-hover:scale-105 transition-transform duration-200"
          sizes="32px"
          priority
        />
      </div>
    </button>
  );
}
