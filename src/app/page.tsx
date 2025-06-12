"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import {
  GlobeAltIcon,
  AcademicCapIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

export default function Home() {
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-screen bg-background" />;
  }

  return (
    <div className="relative">
      {/* Hero Section */}
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent animate-float">
            {t("home.hero.title")}
          </h1>
          <p className="mt-6 text-lg leading-8 text-secondary-foreground animate-fade-in">
            {t("home.hero.subtitle")}
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link href="/courses" className="btn-primary">
              {t("home.hero.findCourses")}
            </Link>
            <Link href="/become-instructor" className="btn-secondary group">
              {t("home.hero.becomeInstructor")}{" "}
              <span className="inline-block transition-transform group-hover:translate-x-1">
                →
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-secondary py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-primary">
              {t("home.features.title")}
            </h2>
            <p className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              {t("home.features.subtitle")}
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              <div className="card group">
                <div className="flex items-center gap-x-3">
                  <GlobeAltIcon className="h-6 w-6 text-primary group-hover:text-accent transition-colors" />
                  <dt className="text-base font-semibold leading-7">
                    {t("home.features.customLearning.title")}
                  </dt>
                </div>
                <dd className="mt-4 text-base leading-7 text-secondary-foreground">
                  {t("home.features.customLearning.description")}
                </dd>
              </div>
              <div className="card group">
                <div className="flex items-center gap-x-3">
                  <AcademicCapIcon className="h-6 w-6 text-primary group-hover:text-accent transition-colors" />
                  <dt className="text-base font-semibold leading-7">
                    {t("home.features.expertLectures.title")}
                  </dt>
                </div>
                <dd className="mt-4 text-base leading-7 text-secondary-foreground">
                  {t("home.features.expertLectures.description")}
                </dd>
              </div>
              <div className="card group">
                <div className="flex items-center gap-x-3">
                  <ClockIcon className="h-6 w-6 text-primary group-hover:text-accent transition-colors" />
                  <dt className="text-base font-semibold leading-7">
                    {t("home.features.flexibleLearning.title")}
                  </dt>
                </div>
                <dd className="mt-4 text-base leading-7 text-secondary-foreground">
                  {t("home.features.flexibleLearning.description")}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
