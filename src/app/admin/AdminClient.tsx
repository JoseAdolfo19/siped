"use client"

import { useEffect, useState } from "react"

interface User { id: string; name: string | null; email: string; planType: string; status: string; createdAt: string }

export default function AdminClient() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<User | null>(null)
  const [modal, setModal] = useState(false)
  const [message, setMessage] = useState("")

  async function load() {
    setLoading(true)
    const res = await fetch("/api/users")
    if (res.ok) setUsers(await res.json())
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
    if (!confirm("¿Eliminar este usuario?")) return
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
        <div><h1 className="text-2xl font-bold">Panel de Administración - SIPED</h1><p className="text-gray-500">Gestiona usuarios, planes y suscripciones</p></div>
      </div>
      {message && <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm">{message}<button onClick={() => setMessage("")} className="ml-2 font-bold">&times;</button></div>}
      <div className="bg-white rounded-xl border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="text-left p-4 font-medium text-gray-600">Nombre</th>
                <th className="text-left p-4 font-medium text-gray-600">Email</th>
                <th className="text-left p-4 font-medium text-gray-600">Plan</th>
                <th className="text-left p-4 font-medium text-gray-600">Estado</th>
                <th className="text-left p-4 font-medium text-gray-600">Registro</th>
                <th className="text-right p-4 font-medium text-gray-600">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading ? <tr><td colSpan={6} className="p-8 text-center text-gray-400">Cargando...</td></tr>
              : users.length === 0 ? <tr><td colSpan={6} className="p-8 text-center text-gray-400">Sin usuarios</td></tr>
              : users.map((u) => (
                <tr key={u.id} className="border-b hover:bg-gray-50">
                  <td className="p-4 font-medium">{u.name || "—"}</td>
                  <td className="p-4 text-gray-600">{u.email}</td>
                  <td className="p-4">{planBadge(u.planType)}</td>
                  <td className="p-4"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${u.status === "active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>{u.status === "active" ? "Activo" : "Inactivo"}</span></td>
                  <td className="p-4 text-gray-500 text-xs">{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td className="p-4 text-right space-x-2">
                    <button onClick={() => { setSelected(u); setModal(true) }} className="text-primary-600 hover:underline text-xs">Editar</button>
                    <button onClick={() => deleteUser(u.id)} className="text-red-500 hover:underline text-xs">Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {modal && selected && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h2 className="text-lg font-bold mb-1">Editar usuario</h2>
            <p className="text-sm text-gray-500 mb-4">{selected.email}</p>
            <label className="block text-sm font-medium mb-1">Plan</label>
            <select defaultValue={selected.planType} className="w-full border rounded-xl px-3 py-2 mb-3" id="planSelect">
              <option value="free">Free</option><option value="weekly">Semanal</option><option value="monthly">Mensual</option><option value="vip">VIP</option><option value="admin">Admin</option>
            </select>
            <label className="block text-sm font-medium mb-1">Estado</label>
            <select defaultValue={selected.status} className="w-full border rounded-xl px-3 py-2 mb-4" id="statusSelect">
              <option value="active">Activo</option><option value="inactive">Inactivo</option>
            </select>
            <div className="flex gap-3">
              <button onClick={() => updateUser(selected.id, { planType: (document.getElementById("planSelect") as HTMLSelectElement).value, status: (document.getElementById("statusSelect") as HTMLSelectElement).value })} className="flex-1 bg-primary-600 text-white py-2 rounded-xl font-medium hover:bg-primary-700">Guardar</button>
              <button onClick={() => setModal(false)} className="flex-1 border py-2 rounded-xl font-medium hover:bg-gray-50">Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
