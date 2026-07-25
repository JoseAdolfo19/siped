"use client"

import { useEffect, useState } from "react"

interface User { id: string; name: string | null; email: string; planType: string; status: string; credits: number; createdAt: string }

export default function AdminClient() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<User | null>(null)
  const [modal, setModal] = useState(false)
  const [message, setMessage] = useState("")
  const [stats, setStats] = useState({ total: 0, free: 0, paid: 0, active: 0 })

  async function load() {
    setLoading(true)
    const [userRes, statsRes] = await Promise.all([
      fetch("/api/users"),
      fetch("/api/admin/stats"),
    ])
    if (userRes.ok) {
      const data = await userRes.json()
      setUsers(data)
      setStats({
        total: data.length,
        free: data.filter((u: User) => u.planType === "free").length,
        paid: data.filter((u: User) => !["free", "admin"].includes(u.planType)).length,
        active: data.filter((u: User) => u.status === "active").length,
      })
    }
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function updateUser(id: string, data: any) {
    const res = await fetch(`/api/admin/users/${id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data),
    })
    if (res.ok) { setMessage("Usuario actualizado"); load(); setModal(false) }
    else setMessage("Error al actualizar")
  }

  async function deleteUser(id: string) {
    if (!confirm("¿Eliminar este usuario? Esta acción no se puede deshacer.")) return
    const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" })
    if (res.ok) { setMessage("Usuario eliminado"); load() }
  }

  function planBadge(plan: string) {
    const s: Record<string, string> = { free: "bg-gray-100 text-gray-600", weekly: "bg-blue-100 text-blue-700", monthly: "bg-indigo-100 text-indigo-700", vip: "bg-amber-100 text-amber-800", admin: "bg-red-100 text-red-800" }
    const l: Record<string, string> = { free: "Free", weekly: "Semanal", monthly: "Mensual", vip: "VIP", admin: "Admin" }
    return <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${s[plan] || "bg-gray-100"}`}>{l[plan] || plan}</span>
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-2xl font-bold">Panel de Administración</h1><p className="text-gray-500 text-sm">Gestión de usuarios, planes y créditos</p></div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl border p-4 text-center"><p className="text-2xl font-bold text-gray-800">{stats.total}</p><p className="text-[10px] text-gray-400 uppercase">Total usuarios</p></div>
        <div className="bg-white rounded-xl border p-4 text-center"><p className="text-2xl font-bold text-green-600">{stats.active}</p><p className="text-[10px] text-gray-400 uppercase">Activos</p></div>
        <div className="bg-white rounded-xl border p-4 text-center"><p className="text-2xl font-bold text-blue-600">{stats.paid}</p><p className="text-[10px] text-gray-400 uppercase">De pago</p></div>
        <div className="bg-white rounded-xl border p-4 text-center"><p className="text-2xl font-bold text-gray-400">{stats.free}</p><p className="text-[10px] text-gray-400 uppercase">Free</p></div>
      </div>

      {message && <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm flex justify-between items-center"><span>{message}</span><button onClick={() => setMessage("")} className="font-bold">&times;</button></div>}

      <div className="bg-white rounded-xl border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="text-left p-3 font-medium text-gray-600 text-[10px] uppercase">Nombre</th>
                <th className="text-left p-3 font-medium text-gray-600 text-[10px] uppercase">Email</th>
                <th className="text-left p-3 font-medium text-gray-600 text-[10px] uppercase">Plan</th>
                <th className="text-left p-3 font-medium text-gray-600 text-[10px] uppercase">Créditos</th>
                <th className="text-left p-3 font-medium text-gray-600 text-[10px] uppercase">Estado</th>
                <th className="text-left p-3 font-medium text-gray-600 text-[10px] uppercase">Registro</th>
                <th className="text-right p-3 font-medium text-gray-600 text-[10px] uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading ? <tr><td colSpan={7} className="p-8 text-center text-gray-400">Cargando...</td></tr>
              : users.length === 0 ? <tr><td colSpan={7} className="p-8 text-center text-gray-400">Sin usuarios</td></tr>
              : users.map((u) => (
                <tr key={u.id} className="border-b hover:bg-gray-50">
                  <td className="p-3 font-medium text-xs">{u.name || "—"}</td>
                  <td className="p-3 text-gray-600 text-xs">{u.email}</td>
                  <td className="p-3">{planBadge(u.planType)}</td>
                  <td className="p-3 text-xs font-mono">{u.credits.toLocaleString()}</td>
                  <td className="p-3"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${u.status === "active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>{u.status === "active" ? "Activo" : "Inactivo"}</span></td>
                  <td className="p-3 text-gray-500 text-[10px]">{new Date(u.createdAt).toLocaleDateString("es-PE")}</td>
                  <td className="p-3 text-right space-x-2">
                    <button onClick={() => { setSelected(u); setModal(true) }} className="text-primary-600 hover:underline text-[10px]">Editar</button>
                    <button onClick={() => deleteUser(u.id)} className="text-red-500 hover:underline text-[10px]">Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modal && selected && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4" onClick={() => setModal(false)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl" onClick={e => e.stopPropagation()}>
            <h2 className="text-sm font-bold mb-1">Editar usuario</h2>
            <p className="text-xs text-gray-500 mb-4">{selected.email}</p>
            <label className="block text-[10px] font-semibold text-gray-400 uppercase mb-1">Plan</label>
            <select defaultValue={selected.planType} className="w-full text-xs border rounded-xl px-3 py-2 mb-3" id="planSelect">
              <option value="free">Free</option><option value="weekly">Semanal</option><option value="monthly">Mensual</option><option value="vip">VIP</option><option value="admin">Admin</option>
            </select>
            <label className="block text-[10px] font-semibold text-gray-400 uppercase mb-1">Estado</label>
            <select defaultValue={selected.status} className="w-full text-xs border rounded-xl px-3 py-2 mb-3" id="statusSelect">
              <option value="active">Activo</option><option value="inactive">Inactivo</option>
            </select>
            <label className="block text-[10px] font-semibold text-gray-400 uppercase mb-1">Créditos</label>
            <input type="number" defaultValue={selected.credits} className="w-full text-xs border rounded-xl px-3 py-2 mb-4" id="creditsInput" />
            <div className="flex gap-3">
              <button onClick={() => {
                const planType = (document.getElementById("planSelect") as HTMLSelectElement).value
                const status = (document.getElementById("statusSelect") as HTMLSelectElement).value
                const credits = parseInt((document.getElementById("creditsInput") as HTMLInputElement).value) || 0
                updateUser(selected.id, { planType, status, credits })
              }} className="flex-1 bg-purple-600 text-white py-2 rounded-xl text-xs font-medium hover:bg-purple-700">Guardar</button>
              <button onClick={() => setModal(false)} className="flex-1 border py-2 rounded-xl text-xs font-medium hover:bg-gray-50">Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
