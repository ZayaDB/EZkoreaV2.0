export interface User {
  _id: string;
  email: string;
  name: string;
  role: "student" | "instructor" | "admin" | "pending_instructor";
  activeRole?: "student" | "instructor";
  createdAt: string;
  updatedAt: string;
}

export interface Course {
  _id: string;
  title: string;
  description: string;
  instructor: {
    _id: string;
    name: string;
  };
  price: number;
  status: "draft" | "pending" | "published";
  students: number;
  revenue: number;
  createdAt: string;
  updatedAt: string;
}

export interface EnrolledCourse extends Course {
  progress: number;
  lastAccessed?: string;
}

export interface InstructorStats {
  totalStudents: number;
  totalRevenue: number;
  totalCourses: number;
  activeStudents: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
