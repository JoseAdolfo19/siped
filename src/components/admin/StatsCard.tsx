export default function StatsCard({ title, value, color = "primary" }: { title: string; value: string | number; color?: string }) {
  const c: Record<string, string> = { primary: "bg-primary-50 text-primary-700 border-primary-200", amber: "bg-amber-50 text-amber-700 border-amber-200", blue: "bg-blue-50 text-blue-700 border-blue-200", green: "bg-green-50 text-green-700 border-green-200", gray: "bg-gray-50 text-gray-700 border-gray-200" }
  return (
    <div className={`rounded-xl border p-5 ${c[color] || c.primary}`}>
      <p className="text-sm opacity-80">{title}</p>
      <p className="text-2xl font-bold mt-1">{value}</p>
    </div>
  )
}
