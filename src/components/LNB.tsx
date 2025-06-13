"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { User } from "@/types/api";
import { userApi } from "@/lib/api";

interface MenuItem {
  label: string;
  href: string;
  icon?: string;
}

const studentMenu: MenuItem[] = [
  { label: "대시보드", href: "/student/dashboard" },
  { label: "내 강의", href: "/student/courses" },
  { label: "학습 현황", href: "/student/progress" },
  { label: "강사 신청", href: "/become-instructor" },
];

const instructorMenu: MenuItem[] = [
  { label: "대시보드", href: "/instructor/dashboard" },
  { label: "내 강의", href: "/instructor/courses" },
  { label: "수강생 관리", href: "/instructor/students" },
  { label: "수익 현황", href: "/instructor/revenue" },
];

export default function LNB() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserData = async () => {
    try {
      const response = await userApi.getCurrentUser();
      if (response.success && response.data) {
        setUser(response.data);
        localStorage.setItem("user", JSON.stringify(response.data));
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  // pathname이 변경될 때마다 사용자 정보를 다시 가져옵니다
  useEffect(() => {
    fetchUserData();
  }, [pathname]);

  const handleRoleSwitch = async (role: "student" | "instructor") => {
    try {
      setLoading(true);
      const response = await userApi.switchRole(role);
      if (response.success && response.data) {
        setUser(response.data);
        localStorage.setItem("user", JSON.stringify(response.data));
        const newPath =
          role === "instructor"
            ? "/instructor/dashboard"
            : "/student/dashboard";
        router.push(newPath);
      }
    } catch (error) {
      console.error("Error switching role:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="w-64 bg-white dark:bg-gray-800 h-screen border-r border-gray-200 dark:border-gray-700">
        <div className="p-4">
          <div className="animate-pulse h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const menuItems =
    user.activeRole === "instructor" ? instructorMenu : studentMenu;

  return (
    <div className="w-64 bg-white dark:bg-gray-800 h-screen border-r border-gray-200 dark:border-gray-700">
      <div className="p-4">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {user.name}
          </h2>
          <div className="flex items-center space-x-2 mt-2">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {user.activeRole === "instructor" ? "강사" : "학생"}
            </p>
            {user.role === "instructor" && (
              <button
                onClick={() =>
                  handleRoleSwitch(
                    user.activeRole === "instructor" ? "student" : "instructor"
                  )
                }
                className="text-xs text-blue-600 hover:text-blue-800 dark:hover:text-blue-400"
              >
                {user.activeRole === "instructor"
                  ? "학생으로 전환"
                  : "강사로 전환"}
              </button>
            )}
          </div>
        </div>
        <nav>
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.href}>
                <button
                  onClick={() => router.push(item.href)}
                  className={`w-full flex items-center px-4 py-2 text-sm rounded-lg transition-colors ${
                    pathname === item.href
                      ? "bg-blue-50 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400"
                      : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                  }`}
                >
                  {item.icon && <span className="mr-3">{item.icon}</span>}
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}
