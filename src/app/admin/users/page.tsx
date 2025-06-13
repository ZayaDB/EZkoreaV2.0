"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminUsers() {
  const router = useRouter();
  const [users, setUsers] = useState<any[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("https://ezkoreav20-production.up.railway.app/api/admin/users", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch(() => setError("불러오기 실패"));
  }, []);

  const handleRoleChange = async (userId: string, newRole: string) => {
    const token = localStorage.getItem("token");
    try {
      await fetch(
        `https://ezkoreav20-production.up.railway.app/api/admin/users/${userId}/role`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ role: newRole }),
        }
      );
      setUsers((users) =>
        users.map((user) =>
          user._id === userId ? { ...user, role: newRole } : user
        )
      );
    } catch (err) {
      setError("권한 변경 실패");
    }
  };

  const handleStatusChange = async (userId: string, newStatus: string) => {
    const token = localStorage.getItem("token");
    try {
      await fetch(
        `https://ezkoreav20-production.up.railway.app/api/admin/users/${userId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );
      setUsers((users) =>
        users.map((user) =>
          user._id === userId ? { ...user, status: newStatus } : user
        )
      );
    } catch (err) {
      setError("상태 변경 실패");
    }
  };

  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">회원 관리</h1>
      {users.length === 0 ? (
        <div>회원이 없습니다.</div>
      ) : (
        <table className="w-full border">
          <thead>
            <tr>
              <th>이름</th>
              <th>이메일</th>
              <th>가입일</th>
              <th>역할</th>
              <th>상태</th>
              <th>액션</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                <td>
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user._id, e.target.value)}
                    className="input"
                  >
                    <option value="student">학생</option>
                    <option value="instructor">강사</option>
                    <option value="admin">관리자</option>
                  </select>
                </td>
                <td>
                  <select
                    value={user.status}
                    onChange={(e) =>
                      handleStatusChange(user._id, e.target.value)
                    }
                    className="input"
                  >
                    <option value="active">활성</option>
                    <option value="suspended">정지</option>
                    <option value="banned">차단</option>
                  </select>
                </td>
                <td>
                  <button
                    onClick={() => router.push(`/admin/users/${user._id}`)}
                    className="btn-secondary"
                  >
                    상세보기
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
