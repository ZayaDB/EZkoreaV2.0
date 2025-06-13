"use client";
import { useEffect, useState } from "react";

interface SiteSettings {
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  supportPhone: string;
  maintenanceMode: boolean;
  allowRegistration: boolean;
  allowInstructorApplications: boolean;
}

export default function AdminSettings() {
  const [settings, setSettings] = useState<SiteSettings>({
    siteName: "",
    siteDescription: "",
    contactEmail: "",
    supportPhone: "",
    maintenanceMode: false,
    allowRegistration: true,
    allowInstructorApplications: true,
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("https://ezkoreav20-production.up.railway.app/api/admin/settings", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setSettings(data))
      .catch(() => setError("설정을 불러오는데 실패했습니다."));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const token = localStorage.getItem("token");
    try {
      const res = await fetch(
        "https://ezkoreav20-production.up.railway.app/api/admin/settings",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(settings),
        }
      );

      if (!res.ok) {
        throw new Error("설정 저장에 실패했습니다.");
      }

      setSuccess("설정이 저장되었습니다.");
    } catch (err) {
      setError("설정 저장에 실패했습니다.");
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">사이트 설정</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-1">사이트 이름</label>
          <input
            type="text"
            value={settings.siteName}
            onChange={(e) =>
              setSettings({ ...settings, siteName: e.target.value })
            }
            className="input w-full"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">사이트 설명</label>
          <textarea
            value={settings.siteDescription}
            onChange={(e) =>
              setSettings({ ...settings, siteDescription: e.target.value })
            }
            className="input w-full"
            rows={3}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            연락처 이메일
          </label>
          <input
            type="email"
            value={settings.contactEmail}
            onChange={(e) =>
              setSettings({ ...settings, contactEmail: e.target.value })
            }
            className="input w-full"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            고객지원 전화번호
          </label>
          <input
            type="tel"
            value={settings.supportPhone}
            onChange={(e) =>
              setSettings({ ...settings, supportPhone: e.target.value })
            }
            className="input w-full"
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="maintenanceMode"
              checked={settings.maintenanceMode}
              onChange={(e) =>
                setSettings({ ...settings, maintenanceMode: e.target.checked })
              }
              className="mr-2"
            />
            <label htmlFor="maintenanceMode">유지보수 모드</label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="allowRegistration"
              checked={settings.allowRegistration}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  allowRegistration: e.target.checked,
                })
              }
              className="mr-2"
            />
            <label htmlFor="allowRegistration">회원가입 허용</label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="allowInstructorApplications"
              checked={settings.allowInstructorApplications}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  allowInstructorApplications: e.target.checked,
                })
              }
              className="mr-2"
            />
            <label htmlFor="allowInstructorApplications">강사 신청 허용</label>
          </div>
        </div>

        {error && <div className="text-red-600">{error}</div>}
        {success && <div className="text-green-600">{success}</div>}

        <button type="submit" className="btn-primary">
          설정 저장
        </button>
      </form>
    </div>
  );
}
