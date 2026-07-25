import { google } from "googleapis"

const SCOPES = ["https://www.googleapis.com/auth/drive.file"]

export function getDriveAuthUrl(userId: string): string {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_DRIVE_CLIENT_ID,
    process.env.GOOGLE_DRIVE_CLIENT_SECRET,
    `${process.env.NEXT_PUBLIC_APP_URL}/api/drive/auth/callback`
  )
  return oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
    state: userId,
    prompt: "consent",
  })
}

export async function getDriveTokens(code: string) {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_DRIVE_CLIENT_ID,
    process.env.GOOGLE_DRIVE_CLIENT_SECRET,
    `${process.env.NEXT_PUBLIC_APP_URL}/api/drive/auth/callback`
  )
  const { tokens } = await oauth2Client.getToken(code)
  return tokens
}

export async function createSipedFolders(accessToken: string, refreshToken: string, username: string) {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_DRIVE_CLIENT_ID,
    process.env.GOOGLE_DRIVE_CLIENT_SECRET,
    `${process.env.NEXT_PUBLIC_APP_URL}/api/drive/auth/callback`
  )
  oauth2Client.setCredentials({ access_token: accessToken, refresh_token: refreshToken })
  const drive = google.drive({ version: "v3", auth: oauth2Client })

  const rootFolder = await drive.files.create({
    requestBody: { name: "SIPED", mimeType: "application/vnd.google-apps.folder" },
    fields: "id",
  })

  const userFolder = await drive.files.create({
    requestBody: { name: username, mimeType: "application/vnd.google-apps.folder", parents: [rootFolder.data.id!] },
    fields: "id",
  })

  const subfolders = ["imagenes", "videos", "documentos"]
  const folderIds: Record<string, string> = { root: rootFolder.data.id!, user: userFolder.data.id! }

  for (const name of subfolders) {
    const folder = await drive.files.create({
      requestBody: { name, mimeType: "application/vnd.google-apps.folder", parents: [userFolder.data.id!] },
      fields: "id",
    })
    folderIds[name] = folder.data.id!
  }

  return folderIds
}

export async function uploadToDrive(accessToken: string, refreshToken: string, fileName: string, fileBuffer: Buffer, mimeType: string, parentFolderId: string) {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_DRIVE_CLIENT_ID,
    process.env.GOOGLE_DRIVE_CLIENT_SECRET,
    `${process.env.NEXT_PUBLIC_APP_URL}/api/drive/auth/callback`
  )
  oauth2Client.setCredentials({ access_token: accessToken, refresh_token: refreshToken })
  const drive = google.drive({ version: "v3", auth: oauth2Client })

  const response = await drive.files.create({
    requestBody: { name: fileName, parents: [parentFolderId] },
    media: { mimeType, body: fileBuffer },
    fields: "id, webViewLink",
  })

  return { id: response.data.id, webViewLink: response.data.webViewLink }
}
