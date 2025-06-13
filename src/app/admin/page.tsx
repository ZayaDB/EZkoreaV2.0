"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

interface DashboardStats {
  totalUsers: number;
  totalInstructors: number;
  totalCourses: number;
  pendingInstructorApplications: number;
  pendingCourseApplications: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalInstructors: 0,
    totalCourses: 0,
    pendingInstructorApplications: 0,
    pendingCourseApplications: 0,
  });
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("https://ezkoreav20-production.up.railway.app/api/admin/dashboard", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch(() => setError("데이터를 불러오는데 실패했습니다."));
  }, []);

  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">관리자 대시보드</h1>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">전체 회원</h3>
          <p className="text-3xl font-bold">{stats.totalUsers}명</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">전체 강사</h3>
          <p className="text-3xl font-bold">{stats.totalInstructors}명</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">전체 강의</h3>
          <p className="text-3xl font-bold">{stats.totalCourses}개</p>
        </div>
      </div>

      {/* 승인 대기 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Link
          href="/admin/instructors"
          className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold mb-2">강사 승인 대기</h3>
              <p className="text-3xl font-bold">
                {stats.pendingInstructorApplications}건
              </p>
            </div>
            <span className="text-blue-500">→</span>
          </div>
        </Link>
        <Link
          href="/admin/courses"
          className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold mb-2">강의 승인 대기</h3>
              <p className="text-3xl font-bold">
                {stats.pendingCourseApplications}건
              </p>
            </div>
            <span className="text-blue-500">→</span>
          </div>
        </Link>
      </div>

      {/* 빠른 링크 */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">빠른 링크</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/admin/users"
            className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600"
          >
            회원 관리
          </Link>
          <Link
            href="/admin/instructors"
            className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600"
          >
            강사 관리
          </Link>
          <Link
            href="/admin/courses"
            className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600"
          >
            강의 관리
          </Link>
          <Link
            href="/admin/settings"
            className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600"
          >
            사이트 설정
          </Link>
        </div>
      </div>
    </div>
  );
}
