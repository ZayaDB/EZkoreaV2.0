import {
  ApiResponse,
  Course,
  EnrolledCourse,
  InstructorStats,
  User,
} from "@/types/api";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "API 요청 실패");
    }

    return data;
  } catch (error) {
    console.error("API Error:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "알 수 없는 오류가 발생했습니다",
    };
  }
}

// 사용자 관련 API
export const userApi = {
  // 현재 사용자 정보 조회
  getCurrentUser: () => fetchApi<User>("/user/me"),

  // 역할 전환
  switchRole: (role: "student" | "instructor") =>
    fetchApi<User>("/user/switch-role", {
      method: "POST",
      body: JSON.stringify({ role }),
    }),
};

// 학생 관련 API
export const studentApi = {
  // 수강 중인 강의 목록 조회
  getEnrolledCourses: () => fetchApi<EnrolledCourse[]>("/student/courses"),

  // 강의 상세 정보 조회
  getCourseDetails: (courseId: string) =>
    fetchApi<EnrolledCourse>(`/student/courses/${courseId}`),

  // 강의 진도 업데이트
  updateProgress: (courseId: string, progress: number) =>
    fetchApi<void>(`/student/courses/${courseId}/progress`, {
      method: "PUT",
      body: JSON.stringify({ progress }),
    }),
};

// 강사 관련 API
export const instructorApi = {
  // 강사 통계 조회
  getStats: () => fetchApi<InstructorStats>("/instructor/stats"),

  // 강사 강의 목록 조회
  getCourses: () => fetchApi<Course[]>("/instructor/courses"),

  // 강의 상세 정보 조회
  getCourseDetails: (courseId: string) =>
    fetchApi<Course>(`/instructor/courses/${courseId}`),

  // 새 강의 생성
  createCourse: (courseData: Partial<Course>) =>
    fetchApi<Course>("/instructor/courses", {
      method: "POST",
      body: JSON.stringify(courseData),
    }),

  // 강의 수정
  updateCourse: (courseId: string, courseData: Partial<Course>) =>
    fetchApi<Course>(`/instructor/courses/${courseId}`, {
      method: "PUT",
      body: JSON.stringify(courseData),
    }),

  // 강의 삭제
  deleteCourse: (courseId: string) =>
    fetchApi<void>(`/instructor/courses/${courseId}`, {
      method: "DELETE",
    }),
};
