import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import Navbar from "@/components/layout/Navbar"
import VisorHTML from "@/components/planificacion/VisorHTML"

export default async function VisorHTMLPage() {
  const session = await auth()
  if (!session) redirect("/login")
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <VisorHTML />
    </div>
  )
}
