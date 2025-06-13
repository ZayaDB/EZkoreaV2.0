"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import { API } from "@/config";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  activeRole?: string;
  bio?: string;
  profileImage?: string;
}

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { t } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
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

  const handleRoleSwitch = async (newRole: string) => {
    if (!user) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API.users.switchRole}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role: newRole }),
      });

      if (!res.ok) {
        throw new Error("역할 전환에 실패했습니다.");
      }

      const updatedUser = { ...user, activeRole: newRole };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
    } catch (error) {
      console.error("역할 전환 실패:", error);
      alert("역할 전환에 실패했습니다. 다시 시도해주세요.");
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
                className={`block py-2 ${
                  pathname === "/profile"
                    ? "font-bold text-primary"
                    : "text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary"
                }`}
              >
                {t("nav.myCourses")}
              </Link>
            </li>
            <li>
              <Link
                href="/profile/favorites"
                className="block py-2 text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary"
              >
                {t("nav.favorites")}
              </Link>
            </li>
            <li>
              <Link
                href="/profile/payments"
                className="block py-2 text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary"
              >
                {t("nav.payments")}
              </Link>
            </li>
            <li>
              <Link
                href="/profile/qna"
                className="block py-2 text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary"
              >
                {t("nav.qna")}
              </Link>
            </li>
            <li>
              <Link
                href="/profile/notifications"
                className="block py-2 text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary"
              >
                {t("nav.notifications")}
              </Link>
            </li>
            <li>
              <Link
                href="/profile/settings"
                className="block py-2 text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary"
              >
                {t("nav.settings")}
              </Link>
            </li>
            {/* 강사 관련 메뉴 */}
            {user.role === "student" && (
              <li>
                <Link
                  href="/become-instructor"
                  className="block py-2 text-blue-600 hover:text-blue-700 font-medium"
                >
                  {t("nav.becomeInstructor")}
                </Link>
              </li>
            )}
            {user.role === "pending_instructor" && (
              <li>
                <div className="py-2 text-yellow-600 dark:text-yellow-500">
                  강사 승인 대기 중
                </div>
              </li>
            )}
            {user.role === "instructor" && (
              <>
                <li className="pt-4">
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                    강사 메뉴
                  </div>
                  {user.activeRole === "student" ? (
                    <button
                      onClick={() => handleRoleSwitch("instructor")}
                      className="w-full text-left py-2 text-blue-600 hover:text-blue-700 font-medium"
                    >
                      강사 모드로 전환
                    </button>
                  ) : (
                    <button
                      onClick={() => handleRoleSwitch("student")}
                      className="w-full text-left py-2 text-blue-600 hover:text-blue-700 font-medium"
                    >
                      학생 모드로 전환
                    </button>
                  )}
                </li>
                {user.activeRole === "instructor" && (
                  <>
                    <li>
                      <Link
                        href="/instructor/courses"
                        className="block py-2 text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary"
                      >
                        내 강의 관리
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/instructor/students"
                        className="block py-2 text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary"
                      >
                        수강생 관리
                      </Link>
                    </li>
                  </>
                )}
              </>
            )}
            <li>
              <button
                className="w-full text-left py-2 text-red-500 hover:text-red-600"
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
