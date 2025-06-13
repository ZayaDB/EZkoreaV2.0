export const API_URL = "http://localhost:3000";

export const API = {
  admin: {
    login: `${API_URL}/api/admin/login`,
    dashboard: `${API_URL}/api/admin/dashboard`,
    instructors: {
      list: `${API_URL}/api/admin/instructor-applications`,
      approve: (id: string) =>
        `${API_URL}/api/admin/instructor-applications/${id}/approve`,
      reject: (id: string) =>
        `${API_URL}/api/admin/instructor-applications/${id}/reject`,
    },
    courses: {
      list: `${API_URL}/api/admin/courses`,
      approve: (id: string) => `${API_URL}/api/admin/courses/${id}/approve`,
      reject: (id: string) => `${API_URL}/api/admin/courses/${id}/reject`,
    },
  },
};
