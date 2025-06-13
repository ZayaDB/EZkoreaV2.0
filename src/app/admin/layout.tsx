"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    // 로그인 페이지가 아닌 경우에만 체크
    if (pathname !== "/admin/login") {
      if (!userData || !token) {
        router.replace("/admin/login");
        return;
      }

      const parsedUser = JSON.parse(userData);
      if (parsedUser.role !== "admin") {
        router.replace("/admin/login");
        return;
      }
      setUser(parsedUser);
    }
  }, [router, pathname]);

  // 로그인 페이지인 경우 레이아웃 없이 렌더링
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 min-h-screen bg-white dark:bg-gray-800 shadow-lg">
          <div className="p-4">
            <h1 className="text-xl font-bold mb-6">관리자 페이지</h1>
            <nav className="space-y-2">
              <Link
                href="/admin"
                className="block px-4 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                대시보드
              </Link>
              <Link
                href="/admin/courses"
                className="block px-4 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                강의 승인 관리
              </Link>
              <Link
                href="/admin/instructors"
                className="block px-4 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                강사 승인 관리
              </Link>
              <Link
                href="/admin/users"
                className="block px-4 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                회원 관리
              </Link>
              <Link
                href="/admin/settings"
                className="block px-4 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                사이트 설정
              </Link>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="p-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
