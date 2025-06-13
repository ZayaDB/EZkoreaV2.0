"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Course, InstructorStats } from "@/types/api";
import { instructorApi } from "@/lib/api";

export default function InstructorDashboard() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [stats, setStats] = useState<InstructorStats>({
    totalStudents: 0,
    totalRevenue: 0,
    totalCourses: 0,
    activeStudents: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsResponse, coursesResponse] = await Promise.all([
          instructorApi.getStats(),
          instructorApi.getCourses(),
        ]);

        if (statsResponse.success && statsResponse.data) {
          setStats(statsResponse.data);
        } else {
          setError(statsResponse.error || "통계를 불러오는데 실패했습니다.");
        }

        if (coursesResponse.success && coursesResponse.data) {
          setCourses(coursesResponse.data);
        } else {
          setError(
            coursesResponse.error || "강의 목록을 불러오는데 실패했습니다."
          );
        }
      } catch (err) {
        setError("알 수 없는 오류가 발생했습니다.");
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 dark:bg-red-900/50 p-4 rounded-lg">
          <p className="text-red-800 dark:text-red-200">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">강사 대시보드</h1>
        <button
          onClick={() => router.push("/instructor/courses/new")}
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
        >
          새 강의 만들기
        </button>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
            총 수강생
          </h3>
          <p className="text-2xl font-bold mt-2">{stats.totalStudents}명</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
            활성 수강생
          </h3>
          <p className="text-2xl font-bold mt-2">{stats.activeStudents}명</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
            총 수익
          </h3>
          <p className="text-2xl font-bold mt-2">
            {stats.totalRevenue.toLocaleString()}원
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
            총 강의 수
          </h3>
          <p className="text-2xl font-bold mt-2">{stats.totalCourses}개</p>
        </div>
      </div>

      {/* 강의 목록 */}
      <div>
        <h2 className="text-xl font-bold mb-4">내 강의</h2>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          {courses.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    강의명
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    수강생
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    수익
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    상태
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    관리
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {courses.map((course) => (
                  <tr key={course._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium">{course.title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">{course.students}명</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">
                        {course.revenue.toLocaleString()}원
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          course.status === "published"
                            ? "bg-green-100 text-green-800"
                            : course.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {course.status === "published"
                          ? "게시됨"
                          : course.status === "pending"
                          ? "검토중"
                          : "임시저장"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() =>
                          router.push(`/instructor/courses/${course._id}`)
                        }
                        className="text-blue-600 hover:text-blue-900 dark:hover:text-blue-400"
                      >
                        관리
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">
                아직 등록된 강의가 없습니다.
              </p>
              <button
                onClick={() => router.push("/instructor/courses/new")}
                className="mt-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
              >
                첫 강의 만들기
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
