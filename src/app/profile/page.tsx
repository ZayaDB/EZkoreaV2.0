"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

export default function ProfilePage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      router.replace("/login");
      return;
    }
    setUser(JSON.parse(userData));
  }, [router]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold mb-4">{t("profile.profile")}</h1>
        <div className="mb-4">
          <div className="font-semibold">
            {t("auth.name")}: {user.name}
          </div>
          <div className="font-semibold">
            {t("auth.email")}: {user.email}
          </div>
          <div className="font-semibold">Role: {user.role || "student"}</div>
          {user.bio && (
            <div className="mt-2">
              {t("auth.bio")}: {user.bio}
            </div>
          )}
        </div>
        {/* 추후 프로필 수정, 강사 전환 등 버튼 추가 가능 */}
      </div>
    </div>
  );
}

export function ProfileMain() {
  return (
    <div>
      {/* 대시보드 메인 컨텐츠: 내 강의실(수강중인 강좌) 등 */}
      <h2 className="text-xl font-bold mb-4">내 강의실</h2>
      <p>
        여기에 수강중인 강좌, 최근 학습 내역, 공지 등 대시보드 메인 컨텐츠를
        추가하세요.
      </p>
    </div>
  );
}
