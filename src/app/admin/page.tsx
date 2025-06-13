"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { API } from "@/config";

interface DashboardStats {
  userCount: number;
  instructorCount: number;
  pendingInstructorCount: number;
  courseCount: number;
  pendingCourseCount: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [error, setError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // 로컬 스토리지에서 토큰 확인
    const token = localStorage.getItem("adminToken");
    if (token) {
      setIsLoggedIn(true);
      fetchStats(token);
    }
  }, []);

  const fetchStats = async (token: string) => {
    try {
      const res = await fetch(API.admin.dashboard, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("통계 데이터를 불러오는데 실패했습니다.");
      const data = await res.json();
      setStats(data);
    } catch (err: any) {
      setError(err.message);
      if (err.message.includes("인증")) {
        setIsLoggedIn(false);
        localStorage.removeItem("adminToken");
      }
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      console.log("👉 로그인 시도:", { email, password });
      console.log("👉 API URL:", API.admin.login);

      const res = await fetch(API.admin.login, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      console.log("👉 응답 상태:", res.status);
      const data = await res.json();
      console.log("👉 응답 데이터:", data);

      if (!res.ok) {
        throw new Error(data.message || "로그인에 실패했습니다.");
      }

      localStorage.setItem("adminToken", data.token);
      setIsLoggedIn(true);
      fetchStats(data.token);
    } catch (err: any) {
      console.error("❌ 로그인 에러:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
              관리자 로그인
            </h2>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="email" className="sr-only">
                  이메일
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="이메일"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  비밀번호
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="비밀번호"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {error && (
              <div className="text-red-500 text-sm text-center">{error}</div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {loading ? "로그인 중..." : "로그인"}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  if (error) return <div className="text-red-500">{error}</div>;
  if (!stats) return <div>로딩 중...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">관리자 대시보드</h1>
        <button
          onClick={() => {
            localStorage.removeItem("adminToken");
            setIsLoggedIn(false);
          }}
          className="text-sm text-red-500 hover:text-red-700"
        >
          로그아웃
        </button>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">전체 회원</h3>
          <p className="text-3xl font-bold">{stats.userCount}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">승인된 강사</h3>
          <p className="text-3xl font-bold">{stats.instructorCount}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">전체 강의</h3>
          <p className="text-3xl font-bold">{stats.courseCount}</p>
        </div>
      </div>

      {/* 승인 대기 섹션 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">대기 중인 강사 신청</h3>
            <span className="text-2xl font-bold text-blue-500">
              {stats.pendingInstructorCount}
            </span>
          </div>
          <Link
            href="/admin/instructors"
            className="block w-full text-center bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
          >
            강사 승인 관리
          </Link>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">대기 중인 강의</h3>
            <span className="text-2xl font-bold text-blue-500">
              {stats.pendingCourseCount}
            </span>
          </div>
          <Link
            href="/admin/courses"
            className="block w-full text-center bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
          >
            강의 승인 관리
          </Link>
        </div>
      </div>
    </div>
  );
}
