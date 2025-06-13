"use client";

import { useEffect, useState } from "react";
import "../i18n";
import { useTranslation } from "react-i18next";

export default function I18nProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);
  const { i18n } = useTranslation();

  useEffect(() => {
    if (i18n.isInitialized) {
      setMounted(true);
    }
  }, [i18n.isInitialized]);

  // 서버와 클라이언트에서 동일한 초기 렌더링을 보장
  return (
    <div className="min-h-screen bg-background">
      {!mounted ? (
        <div className="h-16 border-b border-secondary bg-background/80" />
      ) : (
        children
      )}
    </div>
  );
}
