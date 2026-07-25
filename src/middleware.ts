import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const { pathname } = req.nextUrl
  const isPublic = pathname.startsWith("/login") || pathname.startsWith("/api/auth")
  if (!req.auth && !isPublic) return NextResponse.redirect(new URL("/login", req.url))
  if (req.auth && pathname.startsWith("/admin") && req.auth.user?.planType !== "admin") return NextResponse.redirect(new URL("/dashboard", req.url))
  return NextResponse.next()
})

export const config = { matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"] }
