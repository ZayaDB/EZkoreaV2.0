"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { EnrolledCourse } from "@/types/api";
import { studentApi } from "@/lib/api";

interface CourseContent {
  _id: string;
  title: string;
  type: "video" | "quiz" | "assignment";
  duration?: number;
  completed: boolean;
}

export default function CourseDetail({
  params,
}: {
  params: { courseId: string };
}) {
  const [course, setCourse] = useState<EnrolledCourse | null>(null);
  const [contents, setContents] = useState<CourseContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const response = await studentApi.getCourseDetails(params.courseId);
        if (response.success && response.data) {
          setCourse(response.data);
          // TODO: API 연동 - 강의 콘텐츠 목록 가져오기
          setContents([
            {
              _id: "1",
              title: "1강. 인사하기",
              type: "video",
              duration: 1200,
              completed: true,
            },
            {
              _id: "2",
              title: "2강. 자기소개하기",
              type: "video",
              duration: 1500,
              completed: false,
            },
            {
              _id: "3",
              title: "1강 퀴즈",
              type: "quiz",
              completed: false,
            },
          ]);
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
        <h1 className="text-2xl font-bold mb-4">{course.title}</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          {course.description}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              강사: {course.instructor.name}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              진도율: {course.progress}%
            </div>
          </div>
          <div className="w-64 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full"
              style={{ width: `${course.progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* 강의 콘텐츠 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">강의 목차</h2>
          <div className="space-y-4">
            {contents.map((content) => (
              <div
                key={content._id}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                onClick={() =>
                  router.push(`/courses/${course._id}/content/${content._id}`)
                }
              >
                <div className="flex items-center space-x-4">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      content.completed
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {content.completed ? "✓" : "○"}
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
                <button className="text-blue-600 hover:text-blue-800 dark:hover:text-blue-400">
                  시작하기
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
