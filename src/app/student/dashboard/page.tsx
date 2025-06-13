"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { EnrolledCourse } from "@/types/api";
import { studentApi } from "@/lib/api";

export default function StudentDashboard() {
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await studentApi.getEnrolledCourses();
        if (response.success && response.data) {
          setEnrolledCourses(response.data);
        } else {
          setError(response.error || "강의 목록을 불러오는데 실패했습니다.");
        }
      } catch (err) {
        setError("알 수 없는 오류가 발생했습니다.");
        console.error("Error fetching courses:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
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
      <h1 className="text-2xl font-bold mb-6">내 학습</h1>

      {/* 수강 중인 강의 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {enrolledCourses.length > 0 ? (
          enrolledCourses.map((course) => (
            <div
              key={course._id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <h3 className="text-lg font-semibold mb-2">{course.title}</h3>
              <div className="mb-4">
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                  진도율: {course.progress}%
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${course.progress}%` }}
                  />
                </div>
              </div>
              {course.lastAccessed && (
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  최근 학습:{" "}
                  {new Date(course.lastAccessed).toLocaleDateString()}
                </div>
              )}
              <button
                onClick={() => router.push(`/courses/${course._id}`)}
                className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
              >
                학습 계속하기
              </button>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              아직 수강 중인 강의가 없습니다.
            </p>
            <button
              onClick={() => router.push("/courses")}
              className="mt-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
            >
              강의 둘러보기
            </button>
          </div>
        )}
      </div>

      {/* 추천 강의 */}
      <div className="mt-12">
        <h2 className="text-xl font-bold mb-4">추천 강의</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* TODO: 추천 강의 목록 */}
        </div>
      </div>
    </div>
  );
}
