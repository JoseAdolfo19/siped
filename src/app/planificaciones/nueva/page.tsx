import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import Navbar from "@/components/layout/Navbar"
import PlanEditorHTML from "@/components/planificacion/PlanEditorHTML"

export default async function NuevaPlanificacionPage() {
  const session = await auth()
  if (!session) redirect("/login")

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <PlanEditorHTML />
    </div>
  )
}
