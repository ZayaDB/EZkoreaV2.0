import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // 공개 경로 확인
  const publicPaths = ["/login", "/signup", "/", "/about", "/contact"];
  const isPublicPath = publicPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );

  if (isPublicPath) {
    return NextResponse.next();
  }

  // 토큰 확인
  const token = request.cookies.get("token")?.value;
  const userData = request.cookies.get("user")?.value;

  if (!token || !userData) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    const user = JSON.parse(userData);

    // 관리자 페이지 접근 제한
    if (
      request.nextUrl.pathname.startsWith("/admin") &&
      user.role !== "admin"
    ) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    // 강사 페이지 접근 제한
    if (
      request.nextUrl.pathname.startsWith("/instructor") &&
      (user.role !== "instructor" || user.activeRole !== "instructor")
    ) {
      return NextResponse.redirect(new URL("/student/dashboard", request.url));
    }

    // 강사 신청 페이지 접근 제한
    if (
      request.nextUrl.pathname === "/become-instructor" &&
      (user.role === "instructor" || user.role === "pending_instructor")
    ) {
      return NextResponse.redirect(new URL("/student/dashboard", request.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Middleware error:", error);
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/profile/:path*",
    "/instructor/:path*",
    "/student/:path*",
    "/become-instructor",
  ],
};
