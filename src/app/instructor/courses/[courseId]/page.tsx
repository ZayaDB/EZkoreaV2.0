"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Course } from "@/types/api";
import { instructorApi } from "@/lib/api";

interface CourseContent {
  _id: string;
  title: string;
  type: "video" | "quiz" | "assignment";
  duration?: number;
  status: "draft" | "published";
}

interface CourseStats {
  totalStudents: number;
  activeStudents: number;
  averageProgress: number;
  completionRate: number;
}

export default function InstructorCourseDetail({
  params,
}: {
  params: { courseId: string };
}) {
  const [course, setCourse] = useState<Course | null>(null);
  const [contents, setContents] = useState<CourseContent[]>([]);
  const [stats, setStats] = useState<CourseStats>({
    totalStudents: 0,
    activeStudents: 0,
    averageProgress: 0,
    completionRate: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const response = await instructorApi.getCourseDetails(params.courseId);
        if (response.success && response.data) {
          setCourse(response.data);
          // TODO: API 연동 - 강의 콘텐츠 및 통계 가져오기
          setContents([
            {
              _id: "1",
              title: "1강. 인사하기",
              type: "video",
              duration: 1200,
              status: "published",
            },
            {
              _id: "2",
              title: "2강. 자기소개하기",
              type: "video",
              duration: 1500,
              status: "published",
            },
            {
              _id: "3",
              title: "1강 퀴즈",
              type: "quiz",
              status: "draft",
            },
          ]);
          setStats({
            totalStudents: 80,
            activeStudents: 65,
            averageProgress: 75,
            completionRate: 60,
          });
        } else {
          setError(response.error || "강의 정보를 불러오는데 실패했습니다.");
        }
      } catch (err) {
        setError("알 수 없는 오류가 발생했습니다.");
        console.error("Error fetching course:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [params.courseId]);

  const handleDelete = async () => {
    if (!confirm("정말로 이 강의를 삭제하시겠습니까?")) return;

    try {
      const response = await instructorApi.deleteCourse(params.courseId);
      if (response.success) {
        router.push("/instructor/dashboard");
      } else {
        setError(response.error || "강의 삭제에 실패했습니다.");
      }
    } catch (err) {
      setError("알 수 없는 오류가 발생했습니다.");
      console.error("Error deleting course:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 dark:bg-red-900/50 p-4 rounded-lg">
          <p className="text-red-800 dark:text-red-200">
            {error || "강의를 찾을 수 없습니다."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* 강의 헤더 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-2xl font-bold mb-2">{course.title}</h1>
            <p className="text-gray-600 dark:text-gray-300">
              {course.description}
            </p>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={() =>
                router.push(`/instructor/courses/${course._id}/edit`)
              }
              className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
            >
              수정하기
            </button>
            <button
              onClick={handleDelete}
              className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition-colors"
            >
              삭제하기
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
              총 수강생
            </h3>
            <p className="text-2xl font-bold mt-2">{stats.totalStudents}명</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
              활성 수강생
            </h3>
            <p className="text-2xl font-bold mt-2">{stats.activeStudents}명</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
              평균 진도율
            </h3>
            <p className="text-2xl font-bold mt-2">{stats.averageProgress}%</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
              완료율
            </h3>
            <p className="text-2xl font-bold mt-2">{stats.completionRate}%</p>
          </div>
        </div>
      </div>

      {/* 강의 콘텐츠 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">강의 콘텐츠</h2>
            <button
              onClick={() =>
                router.push(`/instructor/courses/${course._id}/content/new`)
              }
              className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
            >
              새 콘텐츠 추가
            </button>
          </div>
          <div className="space-y-4">
            {contents.map((content) => (
              <div
                key={content._id}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      content.status === "published"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {content.status === "published" ? "✓" : "○"}
                  </div>
                  <div>
                    <h3 className="font-medium">{content.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {content.type === "video"
                        ? `동영상 ${Math.floor(content.duration! / 60)}분`
                        : content.type === "quiz"
                        ? "퀴즈"
                        : "과제"}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() =>
                      router.push(
                        `/instructor/courses/${course._id}/content/${content._id}/edit`
                      )
                    }
                    className="text-blue-600 hover:text-blue-800 dark:hover:text-blue-400"
                  >
                    수정
                  </button>
                  <button
                    onClick={() =>
                      router.push(
                        `/instructor/courses/${course._id}/content/${content._id}`
                      )
                    }
                    className="text-gray-600 hover:text-gray-800 dark:hover:text-gray-400"
                  >
                    미리보기
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
