import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { uploadToDrive, createSipedFolders } from "@/lib/drive"

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.email) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

  const user = await prisma.user.findUnique({ where: { email: session.user.email } })
  if (!user) return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 })

  const formData = await req.formData()
  const file = formData.get("file") as File
  const folderName = (formData.get("folder") as string) || "documentos"
  if (!file) return NextResponse.json({ error: "Archivo requerido" }, { status: 400 })

  const buffer = Buffer.from(await file.arrayBuffer())
  const mimeType = file.type || "application/octet-stream"
  const fileName = file.name

  try {
    const { googleDriveToken, googleDriveRefresh } = user as any
    if (!googleDriveToken || !googleDriveRefresh) {
      return NextResponse.json({ error: "Google Drive no conectado. Autentícate primero." }, { status: 400 })
    }

    const folderIds = await createSipedFolders(googleDriveToken, googleDriveRefresh, user.name || user.email)
    const parentId = folderIds[folderName] || folderIds.documentos

    const result = await uploadToDrive(googleDriveToken, googleDriveRefresh, fileName, buffer, mimeType, parentId)

    return NextResponse.json({ success: true, id: result.id, url: result.webViewLink })
  } catch (error) {
    console.error("Drive upload error:", error)
    return NextResponse.json({ error: "Error al subir a Google Drive" }, { status: 500 })
  }
}
