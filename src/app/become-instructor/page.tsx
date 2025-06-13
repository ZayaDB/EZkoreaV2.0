"use client";
import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";

const FIELDS = [
  "IT/프로그래밍",
  "디자인",
  "비즈니스",
  "언어",
  "음악",
  "예술",
  "기타",
];

export default function BecomeInstructor() {
  const { t } = useTranslation();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  // 폼 상태
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [profileFile, setProfileFile] = useState<File | null>(null);
  const [intro, setIntro] = useState("");
  const [career, setCareer] = useState("");
  const [certificate, setCertificate] = useState("");
  const [fields, setFields] = useState<string[]>([]);
  const [motivation, setMotivation] = useState("");
  const [contact, setContact] = useState("");
  const [attachment, setAttachment] = useState<File | null>(null);
  const [attachmentName, setAttachmentName] = useState("");
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const attachInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      router.replace("/login");
      return;
    }
    setUser(JSON.parse(userData));
  }, [router]);

  // 프로필 사진 미리보기
  const handleProfileImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setProfileImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  // 첨부파일 미리보기
  const handleAttachment = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAttachment(file);
      setAttachmentName(file.name);
    }
  };

  const handleFieldChange = (field: string) => {
    setFields((prev) =>
      prev.includes(field) ? prev.filter((f) => f !== field) : [...prev, field]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!agree) {
      setError("개인정보 수집 및 이용에 동의해야 합니다.");
      return;
    }
    if (intro.length < 20) {
      setError("자기소개는 20자 이상 입력해 주세요.");
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      // 실제 파일 업로드/분야 등은 추후 서버 연동 필요
      const res = await fetch(
        "https://ezkoreav20-production.up.railway.app/api/apply-instructor",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            intro,
            career,
            certificate,
            fields,
            motivation,
            contact,
          }),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "강사 신청 실패");
        setLoading(false);
        return;
      }
      localStorage.setItem("user", JSON.stringify(data.user));
      setSuccess(true);
      setLoading(false);
      setTimeout(() => router.push("/"), 1500);
    } catch (err) {
      setError("서버 오류가 발생했습니다.");
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      <form
        className="max-w-lg w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 space-y-6"
        onSubmit={handleSubmit}
      >
        <h1 className="text-2xl font-bold mb-2">{t("nav.becomeInstructor")}</h1>
        <p className="mb-4 text-gray-700 dark:text-gray-200">
          아래 정보를 모두 입력해 주세요. (필수 항목 *)
        </p>
        {/* 프로필 사진 */}
        <div className="flex flex-col items-center">
          <div
            className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden mb-2 cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
            title="프로필 사진 업로드"
          >
            <img
              src={
                profileImage || user.profileImage || "/img/default-profile.png"
              }
              alt="profile"
              className="object-cover w-full h-full"
            />
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleProfileImage}
            />
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-300">
            프로필 사진(선택)
          </div>
        </div>
        {/* 이름/이메일 */}
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-xs font-semibold mb-1">이름</label>
            <input className="input" value={user.name} disabled />
          </div>
          <div className="flex-1">
            <label className="block text-xs font-semibold mb-1">이메일</label>
            <input className="input" value={user.email} disabled />
          </div>
        </div>
        {/* 자기소개 */}
        <div>
          <label className="block text-xs font-semibold mb-1">자기소개 *</label>
          <textarea
            className="input"
            placeholder="200자 이상 권장"
            value={intro}
            onChange={(e) => setIntro(e.target.value)}
            minLength={20}
            required
          />
        </div>
        {/* 경력 */}
        <div>
          <label className="block text-xs font-semibold mb-1">
            주요 경력/이력 *
          </label>
          <textarea
            className="input"
            placeholder="예: 00대학교 졸업, 00학원 강사 3년 등"
            value={career}
            onChange={(e) => setCareer(e.target.value)}
            required
          />
        </div>
        {/* 자격증/포트폴리오 */}
        <div>
          <label className="block text-xs font-semibold mb-1">
            자격증/포트폴리오(링크) *
          </label>
          <input
            className="input"
            placeholder="예: https://myportfolio.com"
            value={certificate}
            onChange={(e) => setCertificate(e.target.value)}
            required
          />
        </div>
        {/* 강의 분야 */}
        <div>
          <label className="block text-xs font-semibold mb-1">
            강의하고 싶은 분야(복수 선택 가능) *
          </label>
          <div className="flex flex-wrap gap-2">
            {FIELDS.map((field) => (
              <label key={field} className="flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={fields.includes(field)}
                  onChange={() => handleFieldChange(field)}
                />
                <span>{field}</span>
              </label>
            ))}
          </div>
        </div>
        {/* 지원 동기 */}
        <div>
          <label className="block text-xs font-semibold mb-1">
            지원 동기/비전 *
          </label>
          <textarea
            className="input"
            placeholder="강사로서의 목표, 학생에게 주고 싶은 가치 등"
            value={motivation}
            onChange={(e) => setMotivation(e.target.value)}
            required
          />
        </div>
        {/* 연락처 */}
        <div>
          <label className="block text-xs font-semibold mb-1">
            연락처(선택)
          </label>
          <input
            className="input"
            placeholder="010-0000-0000"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
          />
        </div>
        {/* 첨부파일 */}
        <div>
          <label className="block text-xs font-semibold mb-1">
            이력서/증빙자료(선택)
          </label>
          <input
            type="file"
            className="input"
            ref={attachInputRef}
            onChange={handleAttachment}
          />
          {attachmentName && (
            <div className="text-xs mt-1">{attachmentName}</div>
          )}
        </div>
        {/* 개인정보 동의 */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={agree}
            onChange={(e) => setAgree(e.target.checked)}
            required
          />
          <span className="text-xs">개인정보 수집 및 이용에 동의합니다. *</span>
        </div>
        {/* 에러/성공 메시지 */}
        {error && (
          <div className="mb-2 text-red-600 dark:text-red-300">{error}</div>
        )}
        {success ? (
          <div className="text-green-600 dark:text-green-300 font-semibold">
            강사 신청이 완료되었습니다! 관리자의 승인을 기다려주세요.
          </div>
        ) : (
          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary"
          >
            {loading ? "처리 중..." : t("nav.becomeInstructor")}
          </button>
        )}
      </form>
    </div>
  );
}
