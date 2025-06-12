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

  if (!mounted) {
    // Return a minimal loading state that matches the server-rendered content
    return (
      <div className="min-h-screen bg-background">
        <div className="h-16 border-b border-secondary bg-background/80" />
      </div>
    );
  }

  return children;
}
