import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import Backend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";

// 서버 사이드에서는 i18next를 초기화하지 않음
if (typeof window !== "undefined") {
  i18n
    .use(Backend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      fallbackLng: "ko",
      debug: process.env.NODE_ENV === "development",

      interpolation: {
        escapeValue: false,
      },

      backend: {
        loadPath: "/locales/{{lng}}/translation.json",
      },
    });
}

export default i18n;
