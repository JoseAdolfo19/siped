import Link from "next/link"

export default function Home() {
  return (
    <div className="relative min-h-screen bg-[#0a0a1a] overflow-hidden">

      {/* Aurora blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-gradient-to-r from-cyan-400/30 to-blue-500/30 blur-[120px] animate-pulse" style={{ animationDuration: "8s" }} />
        <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full bg-gradient-to-r from-purple-500/30 to-pink-500/30 blur-[120px] animate-pulse" style={{ animationDuration: "10s", animationDelay: "2s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-gradient-to-r from-emerald-400/20 to-cyan-400/20 blur-[140px] animate-pulse" style={{ animationDuration: "12s", animationDelay: "4s" }} />
        <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-gradient-to-r from-violet-500/25 to-fuchsia-500/25 blur-[100px] animate-pulse" style={{ animationDuration: "9s", animationDelay: "1s" }} />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Nav */}
        <nav className="flex items-center justify-between px-6 py-5 max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-purple-500" />
            <span className="text-white font-bold text-lg">SIPED</span>
            <span className="hidden sm:block text-[10px] text-gray-400 ml-1">Sistema Inteligente de Planificación Educativa Docente</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-gray-300 hover:text-white text-sm transition">Iniciar sesión</Link>
            <Link href="/login" className="bg-white text-gray-900 px-5 py-2 rounded-xl text-sm font-semibold hover:bg-gray-100 transition">Comenzar</Link>
          </div>
        </nav>

        {/* Hero */}
        <main className="flex flex-col items-center text-center px-4 pt-24 pb-20">
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 text-xs text-gray-300 mb-8">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Plataforma educativa inteligente
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-white max-w-3xl leading-tight">
            Planifica tus clases en
            <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"> segundos</span>
          </h1>
          <p className="text-gray-400 text-lg mt-5 max-w-xl">
            Crea, organiza y gestiona tus planificaciones curriculares con IA. Diseñado para docentes que quieren recuperar su tiempo.
          </p>

          <div className="flex items-center gap-4 mt-8">
            <Link href="/login" className="bg-white text-gray-900 px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 transition shadow-lg shadow-white/10">
              Comenzar gratis
            </Link>
            <Link href="/login" className="border border-white/20 text-gray-300 px-8 py-3 rounded-xl font-semibold hover:bg-white/5 transition">
              Ver demo
            </Link>
          </div>
        </main>

        {/* Features */}
        <section className="max-w-6xl mx-auto px-4 pb-32">
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div key={i} className="group relative bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6 hover:bg-white/[0.06] transition">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-400/0 via-purple-400/0 to-pink-400/0 group-hover:from-cyan-400/5 group-hover:via-purple-400/5 group-hover:to-pink-400/5 transition duration-500" />
                <div className="relative">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400/20 to-purple-500/20 flex items-center justify-center mb-4">
                    <span className="text-lg">{f.icon}</span>
                  </div>
                  <h3 className="text-white font-semibold text-lg mb-2">{f.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/5 py-6 text-center text-gray-500 text-xs">
          SIPED — Todos los derechos reservados
        </footer>
      </div>
    </div>
  )
}

const features = [
  {
    icon: "⚡",
    title: "Generación con IA",
    desc: "Crea planificaciones completas en segundos con inteligencia artificial entrenada para el currículo peruano.",
  },
  {
    icon: "📋",
    title: "Gestión curricular",
    desc: "Organiza sesiones, unidades y proyectos en un solo lugar. Edita, exporta y descarga al instante.",
  },
  {
    icon: "🔒",
    title: "Suscripciones flexibles",
    desc: "Acceso gratuito con funciones esenciales o desbloquea todo el potencial con un plan premium.",
  },
]
