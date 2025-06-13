export const API_URL = "https://ezkoreav20-production.up.railway.app";

export const API = {
  users: {
    switchRole: `${API_URL}/api/users/switch-role`,
  },
  admin: {
    login: `${API_URL}/api/admin/login`,
    dashboard: `${API_URL}/api/admin/dashboard`,
    users: {
      list: `${API_URL}/api/admin/users`,
      updateRole: (id: string) => `${API_URL}/api/admin/users/${id}/role`,
      updateStatus: (id: string) => `${API_URL}/api/admin/users/${id}/status`,
    },
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
