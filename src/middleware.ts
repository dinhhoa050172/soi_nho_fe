import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { authRoutes, privateRoutes, publicRoutes } from "./router/route";

// Helper functions
function isPublicRoute(pathname: string): boolean {
  return publicRoutes.some((route) => {
    if (route === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(route);
  });
}

function isAuthRoute(pathname: string): boolean {
  return authRoutes.some((route) => pathname.startsWith(route));
}

function isProtectedRoute(pathname: string): boolean {
  return privateRoutes.some((route) => pathname.startsWith(route));
}

export function middleware(request: NextRequest) {
  const token = request.cookies.get("accessToken")?.value;
  const userRole = request.cookies.get("userRole")?.value;
  const pathname = request.nextUrl.pathname;

  // Cho phép truy cập route công khai
  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  // Xử lý auth routes
  if (isAuthRoute(pathname) && token) {
    
    const redirectUrl =
      userRole === "Admin" ? "/dashboard" : "/";
    return NextResponse.redirect(new URL(redirectUrl, request.url));
  }

  
  // Xử lý protected routes
  if (isProtectedRoute(pathname) && !token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  

  // Xử lý admin routes
  // if (isAdminRoute(pathname)) {
  //   if (!token) {
  //     const loginUrl = new URL("/login", request.url);
  //     loginUrl.searchParams.set("redirect", pathname);
  //     return NextResponse.redirect(loginUrl);
  //   }
  //   if (userRole !== "admin") {
  //     return NextResponse.redirect(new URL("/dashboard", request.url));
  //   }
  // }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
