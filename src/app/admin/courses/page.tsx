"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { API } from "@/config";

interface Course {
  _id: string;
  instructorId: {
    _id: string;
    email: string;
    name: string;
  };
  title: string;
  description: string;
  status: string;
  createdAt: string;
}

export default function CourseApproval() {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      router.push("/admin");
      return;
    }
    fetchCourses(token);
  }, [router]);

  const fetchCourses = async (token: string) => {
    try {
      const res = await fetch(API.admin.courses.list, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          localStorage.removeItem("adminToken");
          router.push("/admin");
          return;
        }
        throw new Error("강의 목록을 불러오는데 실패했습니다.");
      }
      const data = await res.json();
      setCourses(data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleApprove = async (id: string) => {
    setLoading(true);
    const token = localStorage.getItem("adminToken");
    if (!token) {
      router.push("/admin");
      return;
    }
    try {
      const res = await fetch(API.admin.courses.approve(id), {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          localStorage.removeItem("adminToken");
          router.push("/admin");
          return;
        }
        throw new Error("승인 처리에 실패했습니다.");
      }
      await fetchCourses(token);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (id: string) => {
    setLoading(true);
    const token = localStorage.getItem("adminToken");
    if (!token) {
      router.push("/admin");
      return;
    }
    try {
      const res = await fetch(API.admin.courses.reject(id), {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          localStorage.removeItem("adminToken");
          router.push("/admin");
          return;
        }
        throw new Error("거절 처리에 실패했습니다.");
      }
      await fetchCourses(token);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">강의 승인 관리</h1>

      {courses.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center">
          대기 중인 강의가 없습니다.
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  강사
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  강의명
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  설명
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  등록일
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  작업
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {courses.map((course) => (
                <tr key={course._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium">
                      {course.instructorId.name}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {course.instructorId.email}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-300">
                      {course.title}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 dark:text-gray-300 line-clamp-2">
                      {course.description}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {new Date(course.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <button
                      onClick={() => handleApprove(course._id)}
                      disabled={loading}
                      className="text-green-600 hover:text-green-900 dark:hover:text-green-400"
                    >
                      승인
                    </button>
                    <button
                      onClick={() => handleReject(course._id)}
                      disabled={loading}
                      className="text-red-600 hover:text-red-900 dark:hover:text-red-400"
                    >
                      거절
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
