"use client"

import Link from "next/link"
import { signOut, useSession } from "next-auth/react"
import { usePathname } from "next/navigation"

export default function Navbar() {
  const { data: session } = useSession()
  const pathname = usePathname()
  const user = session?.user
  const isAdminPage = pathname.startsWith("/admin")

  return (
    <nav className="bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/dashboard" className="text-xl font-bold text-primary-600">SIPED</Link>
        <div className="flex items-center gap-4">
          <Link href="/planificaciones" className="text-sm text-gray-600 hover:text-primary-600">Planificaciones</Link>
          <Link href="/evaluacion" className="text-sm text-gray-600 hover:text-primary-600">Evaluación</Link>
          <Link href="/materiales" className="text-sm text-gray-600 hover:text-primary-600">Materiales</Link>
          {user?.planType === "admin" && (
            <Link href={isAdminPage ? "/dashboard" : "/admin"} className="text-sm text-gray-600 hover:text-primary-600">{isAdminPage ? "Dashboard" : "Admin"}</Link>
          )}
          <span className="hidden sm:inline text-sm text-gray-500">{user?.name || user?.email}</span>
          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${user?.planType === "vip" ? "bg-amber-100 text-amber-800" : user?.planType === "admin" ? "bg-red-100 text-red-800" : user?.planType === "free" ? "bg-gray-100 text-gray-600" : "bg-blue-100 text-blue-800"}`}>
            {user?.planType === "admin" ? "Admin" : user?.planType === "vip" ? "VIP" : user?.planType === "weekly" ? "Semanal" : user?.planType === "monthly" ? "Mensual" : "Free"}
          </span>
          <button onClick={() => signOut({ callbackUrl: "/login" })} className="text-sm text-red-500 hover:text-red-700">Salir</button>
        </div>
      </div>
    </nav>
  )
}
