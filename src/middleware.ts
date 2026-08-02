import { NextResponse, type NextRequest } from "next/server"
import { createClient } from "@/lib/supabase/middleware"

export async function middleware(request: NextRequest) {
  const { supabase, supabaseResponse } = createClient(request)
  const { pathname } = request.nextUrl

  const { data: { user } } = await supabase.auth.getUser()

  const isPublic = pathname.startsWith("/login") || pathname.startsWith("/api/auth")
  const isStatic = pathname.startsWith("/_next/static") || pathname.startsWith("/_next/image") || pathname === "/favicon.ico"

  if (isStatic) return supabaseResponse

  if (!user && !isPublic) {
    return NextResponse.redirect(new URL("/login", request.url))
  }
  if (user && pathname === "/login") {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return supabaseResponse
}

export const config = { matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"] }
