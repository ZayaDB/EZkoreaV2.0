"use client";
import { useEffect, useState } from "react";

export default function AdminCourses() {
  const [courses, setCourses] = useState<any[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("https://ezkoreav20-production.up.railway.app/api/admin/courses", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setCourses(data))
      .catch(() => setError("불러오기 실패"));
  }, []);

  const handleAction = async (id: string, action: "approve" | "reject") => {
    const token = localStorage.getItem("token");
    await fetch(
      `https://ezkoreav20-production.up.railway.app/api/admin/courses/${id}/${action}`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    setCourses((courses) => courses.filter((course) => course._id !== id));
  };

  if (error) return <div>{error}</div>;
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">강의 승인 관리</h1>
      {courses.length === 0 ? (
        <div>강의가 없습니다.</div>
      ) : (
        <table className="w-full border">
          <thead>
            <tr>
              <th>강의명</th>
              <th>설명</th>
              <th>강사</th>
              <th>상태</th>
              <th>액션</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course._id}>
                <td>{course.title}</td>
                <td>{course.description}</td>
                <td>{course.instructorId?.name}</td>
                <td>{course.status}</td>
                <td>
                  {course.status === "pending" && (
                    <>
                      <button
                        onClick={() => handleAction(course._id, "approve")}
                        className="btn-primary mr-2"
                      >
                        승인
                      </button>
                      <button
                        onClick={() => handleAction(course._id, "reject")}
                        className="btn-secondary"
                      >
                        거절
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
