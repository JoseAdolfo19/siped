import { NextResponse } from "next/server"
import { getDriveAuthUrl } from "@/lib/drive"
import { auth } from "@/lib/auth"

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

  const url = getDriveAuthUrl(session.user.id)
  return NextResponse.json({ url })
}
