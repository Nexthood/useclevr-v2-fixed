import { NextResponse } from "next/server";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";

export async function middleware(req) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const url = req.nextUrl.pathname;

  // 1️⃣ Public routes (no login required)
  const publicRoutes = [
    "/login",
    "/signup",
    "/reset",
    "/update-password",
  ];

  const isPublic = publicRoutes.some((p) => url.startsWith(p));

  // Allow public routes
  if (isPublic) return res;

  // Allow Next.js internal + static files
  if (
    url.startsWith("/_next") ||
    url.startsWith("/api") ||
    url.startsWith("/favicon") ||
    url.startsWith("/public")
  ) {
    return res;
  }

  // 2️⃣ If NOT logged in → redirect to /login
  if (!session) {
    const redirectUrl = new URL("/login", req.url);
    return NextResponse.redirect(redirectUrl);
  }

  return res;
}

// 3️⃣ Match all pages except static files
export const config = {
  matcher: [
    "/((?!.*\\..*|_next).*)", // all routes
    "/",                      // home
  ],
};
