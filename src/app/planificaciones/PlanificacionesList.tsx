"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

interface Plan {
  id: string; title: string; subject: string; grade: string; level: string; section: string; status: string; createdAt: string; updatedAt: string
}

const levelLabel: Record<string, string> = { inicial: "Inicial", primaria: "Primaria", secundaria: "Secundaria" }

export default function PlanificacionesList({ planificaciones }: { planificaciones: Plan[] }) {
  const router = useRouter()
  const [plans, setPlans] = useState(planificaciones)
  const [search, setSearch] = useState("")

  async function deletePlan(id: string) {
    if (!confirm("¿Eliminar esta planificación?")) return
    const res = await fetch(`/api/planificaciones/${id}`, { method: "DELETE" })
    if (res.ok) {
      setPlans(plans.filter((p) => p.id !== id))
      router.refresh()
    }
  }

  const filtered = plans.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.subject.toLowerCase().includes(search.toLowerCase()) ||
    (levelLabel[p.level] || "").toLowerCase().includes(search.toLowerCase())
  )

  const statusBadge = (status: string) => {
    const s = status === "published" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
    const l = status === "published" ? "Publicado" : "Borrador"
    return <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${s}`}>{l}</span>
  }

  return (
    <main className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Mis Planificaciones</h1>
          <p className="text-gray-500">{plans.length} planificación(es)</p>
        </div>
        <Link
          href="/planificaciones/nueva"
          className="bg-primary-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-primary-700"
        >
          + Nueva planificación
        </Link>
      </div>

      <input
        type="text"
        placeholder="Buscar por título o asignatura..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full px-4 py-3 border rounded-xl mb-6 focus:ring-2 focus:ring-primary focus:outline-none"
      />

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-lg font-medium">No hay planificaciones aún</p>
          <p className="text-sm mt-1">Crea tu primera planificación para empezar</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filtered.map((p) => (
            <div key={p.id} className="bg-white rounded-xl border p-5 flex items-center justify-between hover:shadow-sm transition">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h3 className="font-semibold text-lg">{p.title}</h3>
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700">{levelLabel[p.level] || p.level}</span>
                  {statusBadge(p.status)}
                </div>
                <p className="text-sm text-gray-500">
                  {p.subject} · {levelLabel[p.level] || p.level} · {p.grade}{p.section ? ` - ${p.section}` : ""} · {new Date(p.updatedAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-2 ml-4">
                <Link
                  href={`/planificaciones/${p.id}`}
                  className="text-sm text-primary-600 hover:underline px-3 py-1"
                >
                  Ver
                </Link>
                <Link
                  href={`/planificaciones/${p.id}/editar`}
                  className="text-sm text-blue-600 hover:underline px-3 py-1"
                >
                  Editar
                </Link>
                <button
                  onClick={() => deletePlan(p.id)}
                  className="text-sm text-red-500 hover:underline px-3 py-1"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}
