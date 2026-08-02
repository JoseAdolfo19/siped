import type { Metadata } from "next"
import { SessionProvider } from "@/lib/useSession"
import "./globals.css"
import { Inter } from "next/font/google";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: "SIPED - Sistema Inteligente de Planificación Educativa Docente",
  description: "Plataforma para docentes: planifica sesiones de aprendizaje, exámenes y acelera tus lecciones",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={inter.variable}>
      <body><SessionProvider>{children}</SessionProvider></body>
    </html>
  )
}
