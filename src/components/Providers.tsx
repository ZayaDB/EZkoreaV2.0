"use client";

import { ThemeProvider } from "next-themes";
import I18nProvider from "./I18nProvider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <I18nProvider>{children}</I18nProvider>
    </ThemeProvider>
  );
}
