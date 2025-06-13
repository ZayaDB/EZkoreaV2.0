"use client";
import { useEffect, useState } from "react";

export default function AdminInstructors() {
  const [applications, setApplications] = useState<any[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(
      "https://ezkoreav20-production.up.railway.app/api/admin/instructor-applications",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )
      .then((res) => res.json())
      .then((data) => setApplications(data))
      .catch(() => setError("불러오기 실패"));
  }, []);

  const handleAction = async (id: string, action: "approve" | "reject") => {
    const token = localStorage.getItem("token");
    await fetch(
      `https://ezkoreav20-production.up.railway.app/api/admin/instructor-applications/${id}/${action}`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    setApplications((apps) => apps.filter((app) => app._id !== id));
  };

  if (error) return <div>{error}</div>;
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">강사 신청 승인 관리</h1>
      {applications.length === 0 ? (
        <div>대기 중인 강사 신청이 없습니다.</div>
      ) : (
        <table className="w-full border">
          <thead>
            <tr>
              <th>이름</th>
              <th>이메일</th>
              <th>자기소개</th>
              <th>경력</th>
              <th>자격증/포트폴리오</th>
              <th>분야</th>
              <th>지원동기</th>
              <th>연락처</th>
              <th>액션</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => (
              <tr key={app._id}>
                <td>{app.user?.name}</td>
                <td>{app.user?.email}</td>
                <td>{app.intro}</td>
                <td>{app.career}</td>
                <td>{app.certificate}</td>
                <td>{(app.fields || []).join(", ")}</td>
                <td>{app.motivation}</td>
                <td>{app.contact}</td>
                <td>
                  {app.status === "pending" && (
                    <>
                      <button
                        onClick={() => handleAction(app._id, "approve")}
                        className="btn-primary mr-2"
                      >
                        승인
                      </button>
                      <button
                        onClick={() => handleAction(app._id, "reject")}
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
