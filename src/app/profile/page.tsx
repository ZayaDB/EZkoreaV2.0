"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import { API } from "@/config";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  activeRole?: string;
  bio?: string;
}

export default function ProfilePage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [activeRole, setActiveRole] = useState<string>("student");

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      router.replace("/login");
      return;
    }
    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);
    setActiveRole(parsedUser.activeRole || parsedUser.role || "student");
  }, [router]);

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
      setActiveRole(newRole);
    } catch (error) {
      console.error("역할 전환 실패:", error);
      alert("역할 전환에 실패했습니다. 다시 시도해주세요.");
    }
  };

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
        <div className="mb-6">
          <div className="font-semibold mb-2">
            {t("auth.name")}: {user.name}
          </div>
          <div className="font-semibold mb-2">
            {t("auth.email")}: {user.email}
          </div>
          <div className="font-semibold mb-2">
            현재 역할: {activeRole === "instructor" ? "강사" : "학생"}
          </div>
          {user.bio && (
            <div className="mt-2">
              {t("auth.bio")}: {user.bio}
            </div>
          )}
        </div>

        {/* 역할 전환 섹션 - 승인된 강사이고 현재 학생 모드일 때만 표시 */}
        {user.role === "instructor" && activeRole === "student" && (
          <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h2 className="text-lg font-semibold mb-3">강사 모드로 전환</h2>
            <button
              onClick={() => handleRoleSwitch("instructor")}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              강사 모드로 전환하기
            </button>
          </div>
        )}

        {/* 학생 모드로 전환 - 승인된 강사이고 현재 강사 모드일 때만 표시 */}
        {user.role === "instructor" && activeRole === "instructor" && (
          <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h2 className="text-lg font-semibold mb-3">학생 모드로 전환</h2>
            <button
              onClick={() => handleRoleSwitch("student")}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              학생 모드로 전환하기
            </button>
          </div>
        )}

        {/* 강사 신청 버튼 - 순수 학생인 경우에만 표시 */}
        {user.role === "student" && (
          <div className="mt-4">
            <Link
              href="/become-instructor"
              className="inline-block w-full text-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              강사 신청하기
            </Link>
          </div>
        )}

        {/* 강사 대기 중인 경우 메시지 표시 */}
        {user.role === "pending_instructor" && (
          <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded-lg">
            강사 신청이 검토 중입니다. 승인까지 잠시만 기다려주세요.
          </div>
        )}
      </div>
    </div>
  );
}

export function ProfileMain() {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">내 강의실</h2>
      <p>
        여기에 수강중인 강좌, 최근 학습 내역, 공지 등 대시보드 메인 컨텐츠를
        추가하세요.
      </p>
    </div>
  );
}
