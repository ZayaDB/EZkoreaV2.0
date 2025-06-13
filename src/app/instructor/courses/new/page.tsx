"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewCourse() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const token = localStorage.getItem("token");
    const res = await fetch(
      "https://ezkoreav20-production.up.railway.app/api/courses",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, description }),
      }
    );
    const data = await res.json();
    if (!res.ok) {
      setError(data.message || "등록 실패");
      return;
    }
    setSuccess(true);
    setTimeout(() => router.push("/profile"), 1500);
  };

  return (
    <div className="max-w-md mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">강의 등록</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="input"
          placeholder="강의 제목"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          className="input"
          placeholder="강의 설명"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        {error && <div className="text-red-500">{error}</div>}
        {success ? (
          <div className="text-green-600">
            강의 등록 완료! 승인 대기 중입니다.
          </div>
        ) : (
          <button type="submit" className="btn-primary w-full">
            등록
          </button>
        )}
      </form>
    </div>
  );
}
