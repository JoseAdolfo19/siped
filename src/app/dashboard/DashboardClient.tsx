"use client"

import { useState } from "react"
import StatsCard from "@/components/admin/StatsCard"
import Link from "next/link"

interface Props {
  user: { name?: string | null; email?: string | null; planType: string; status: string }
  isAdmin: boolean
  limits: { sessions: number; evaluations: number; exportWatermark: boolean }
  stats: { userCount: number; vipCount: number; subCount: number; planCount: number }
}

export default function DashboardClient({ user, isAdmin, limits, stats }: Props) {
  const [loading, setLoading] = useState<string | null>(null)

  async function handleCheckout(planType: string) {
    setLoading(planType)
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planType }),
      })
      const data = await res.json()
      if (data.url) window.location.href = data.url
      else alert("Error al crear el pago")
    } catch { alert("Error de conexión") }
    finally { setLoading(null) }
  }

  return (
    <main className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">SIPED - Bienvenido, {user.name || user.email}</h1>
          <p className="text-gray-500">Plan: <span className="font-semibold capitalize">{user.planType}</span></p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <StatsCard title="Sesiones disponibles" value={limits.sessions === Infinity ? "∞" : limits.sessions} color="primary" />
        <StatsCard title="Evaluaciones disponibles" value={limits.evaluations === Infinity ? "∞" : limits.evaluations} color="blue" />
        <StatsCard title="Marca de agua" value={limits.exportWatermark ? "Sí" : "No"} color={limits.exportWatermark ? "gray" : "green"} />
        <StatsCard title="Mis planificaciones" value={stats.planCount} color="amber" />
      </div>

      {isAdmin && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-3">Estadísticas del sistema</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatsCard title="Usuarios totales" value={stats.userCount} color="blue" />
            <StatsCard title="Usuarios VIP" value={stats.vipCount} color="amber" />
            <StatsCard title="Suscripciones activas" value={stats.subCount} color="green" />
          </div>
          <Link href="/admin" className="inline-block mt-4 text-primary-600 hover:underline font-medium">Ir al panel de administración →</Link>
        </div>
      )}

      <div className="bg-white rounded-xl border p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Mis planificaciones</h2>
          <Link href="/planificaciones" className="text-sm text-primary-600 hover:underline font-medium">Ver todas →</Link>
        </div>
        <p className="text-gray-500 text-sm mb-4">Tienes {stats.planCount} planificación(es) creada(s).</p>
        <div className="flex gap-3">
          <Link href="/planificaciones" className="bg-primary-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-primary-700">Ir a planificaciones</Link>
          <Link href="/planificaciones/nueva" className="border px-4 py-2 rounded-xl text-sm font-medium hover:bg-gray-50">+ Nueva</Link>
        </div>
      </div>

      <div className="bg-white rounded-xl border p-6">
        <h2 className="text-lg font-semibold mb-4">Planes disponibles</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <PlanCard name="Free" price="Gratis" features={["3 planificaciones", "3 evaluaciones", "Marca de agua"]} current={user.planType === "free" || user.planType === "vip" || user.planType === "admin"} />
          <PlanCard name="Semanal" price="S/ 10 /semana" features={["Planificaciones ilimitadas", "Evaluaciones ilimitadas", "Sin marca de agua"]} highlight current={user.planType === "weekly"} actionLabel={user.planType === "free" ? "Pagar con Stripe" : undefined} actionLoading={loading === "weekly"} onAction={() => handleCheckout("weekly")} />
          <PlanCard name="Mensual" price="S/ 30 /mes" features={["Planificaciones ilimitadas", "Evaluaciones ilimitadas", "Sin marca de agua"]} current={user.planType === "monthly"} actionLabel={user.planType === "free" ? "Pagar con Stripe" : undefined} actionLoading={loading === "monthly"} onAction={() => handleCheckout("monthly")} />
        </div>
        {user.planType === "vip" && <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-center font-semibold">👑 Tienes acceso VIP ilimitado</div>}
      </div>
    </main>
  )
}

function PlanCard({ name, price, features, highlight, current, actionLabel, actionLoading, onAction }: {
  name: string; price: string; features: string[]; highlight?: boolean; current?: boolean; actionLabel?: string; actionLoading?: boolean; onAction?: () => void
}) {
  return (
    <div className={`rounded-xl border p-5 flex flex-col ${highlight ? "border-primary ring-2 ring-primary" : ""} ${current ? "bg-primary-50" : ""}`}>
      <h3 className="font-bold text-lg">{name}</h3>
      <p className="text-2xl font-bold mt-1">{price}</p>
      <ul className="mt-4 space-y-2 text-sm text-gray-600 flex-1">{features.map((f, i) => <li key={i} className="flex items-center gap-2">✅ {f}</li>)}</ul>
      <div className="mt-4">
        {current ? <span className="inline-block text-xs bg-primary-100 text-primary-700 px-3 py-1 rounded-full">Plan actual</span>
        : actionLabel ? <button onClick={onAction} disabled={actionLoading} className="w-full bg-primary-600 text-white py-2 rounded-xl font-medium hover:bg-primary-700 disabled:opacity-50 text-sm">{actionLoading ? "Procesando..." : actionLabel}</button>
        : null}
      </div>
    </div>
  )
}
