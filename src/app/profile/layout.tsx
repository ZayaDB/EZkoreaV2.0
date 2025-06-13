"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { t } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      router.replace("/login");
      return;
    }
    setUser(JSON.parse(userData));
  }, [router]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
      // TODO: 서버에 업로드 및 user 정보 갱신
    }
  };

  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-background">
      {/* LNB */}
      <aside className="w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col items-center py-8 px-4">
        {/* 프로필 사진 */}
        <div className="mb-4 flex flex-col items-center">
          <div
            className="w-20 h-20 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden mb-2 cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
            title="프로필 사진 변경"
          >
            <img
              src={preview || user.profileImage || "/img/default-profile.png"}
              alt="profile"
              className="object-cover w-full h-full"
            />
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleImageChange}
            />
          </div>
          <div className="font-bold text-lg">{user.name}</div>
          {user.bio && (
            <div className="text-sm text-gray-500 dark:text-gray-300 text-center">
              {user.bio}
            </div>
          )}
        </div>
        {/* LNB 메뉴 */}
        <nav className="flex-1 w-full">
          <ul className="space-y-2">
            <li>
              <Link
                href="/profile"
                className={
                  pathname === "/profile" ? "font-bold text-primary" : ""
                }
              >
                {t("nav.myCourses")}
              </Link>
            </li>
            <li>
              <Link href="/profile/favorites">{t("nav.favorites")}</Link>
            </li>
            <li>
              <Link href="/profile/payments">{t("nav.payments")}</Link>
            </li>
            <li>
              <Link href="/profile/qna">{t("nav.qna")}</Link>
            </li>
            <li>
              <Link href="/profile/notifications">
                {t("nav.notifications")}
              </Link>
            </li>
            <li>
              <Link href="/profile/settings">{t("nav.settings")}</Link>
            </li>
            <li>
              <Link href="/become-instructor">{t("nav.becomeInstructor")}</Link>
            </li>
            <li>
              <button
                className="text-red-500 mt-4"
                onClick={() => {
                  localStorage.removeItem("token");
                  localStorage.removeItem("user");
                  window.location.href = "/";
                }}
              >
                {t("profile.logout")}
              </button>
            </li>
          </ul>
        </nav>
      </aside>
      {/* 메인 컨텐츠 */}
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
