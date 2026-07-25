import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { isAdmin } from "@/lib/permissions"
import Navbar from "@/components/layout/Navbar"
import AdminClient from "./AdminClient"

export default async function AdminPage() {
  const session = await auth()
  if (!session || !isAdmin(session.user.planType)) redirect("/dashboard")
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <AdminClient />
    </div>
  )
}
