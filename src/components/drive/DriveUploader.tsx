"use client"

import { useState } from "react"

export default function DriveUploader() {
  const [connected, setConnected] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadResult, setUploadResult] = useState("")
  const [error, setError] = useState("")

  const handleConnect = async () => {
    const res = await fetch("/api/drive/auth")
    const data = await res.json()
    if (data.url) {
      window.open(data.url, "_blank", "width=600,height=700")
    } else {
      setError("Error al conectar con Google Drive")
    }
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setError("")
    setUploadResult("")

    const formData = new FormData()
    formData.append("file", file)
    formData.append("folder", "documentos")

    try {
      const res = await fetch("/api/drive/upload", { method: "POST", body: formData })
      const data = await res.json()
      if (res.ok) {
        setUploadResult(`Subido correctamente. ${data.url ? "Ver archivo" : ""}`)
      } else {
        setError(data.error || "Error al subir")
      }
    } catch {
      setError("Error de conexión")
    }
    setUploading(false)
  }

  return (
    <div className="bg-white rounded-xl border border-green-100 p-4 shadow-sm">
      <h3 className="text-xs font-bold text-green-700 mb-3">☁️ Google Drive</h3>
      {!connected ? (
        <button onClick={handleConnect}
          className="text-xs bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded-lg font-medium transition">
          Conectar Google Drive
        </button>
      ) : (
        <div>
          <p className="text-[10px] text-green-600 mb-2">✓ Conectado</p>
          <label className="text-xs bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-lg font-medium transition cursor-pointer inline-block">
            {uploading ? "Subiendo..." : "Subir archivo"}
            <input type="file" onChange={handleUpload} className="hidden" disabled={uploading} />
          </label>
        </div>
      )}
      {uploadResult && <p className="text-xs text-green-600 mt-2">{uploadResult}</p>}
      {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
    </div>
  )
}
