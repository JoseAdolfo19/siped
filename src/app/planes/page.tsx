import PlanesPageClient from "./PlanesPageClient"
import { Metadata } from "next"

export const metadata: Metadata = { title: "Planes - SIPED" }

export default function PlanesPage() {
  return <PlanesPageClient />
}
