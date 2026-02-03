import Link from 'next/link'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-zinc-100">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-800/50 bg-black/80 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <span className="text-2xl font-bold font-mono text-red-500">SPECTER</span>
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-zinc-400 hover:text-zinc-100 transition"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded transition"
            >
              Start Investigating
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-red-950/20 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-900/10 via-transparent to-transparent" />

        {/* Scanline effect */}
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none"
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(255,255,255,0.03) 1px, rgba(255,255,255,0.03) 2px)'
          }}
        />

        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <div className="mb-6">
            <span className="inline-block px-3 py-1 text-xs font-mono text-red-400 border border-red-800 rounded-full mb-4">
              CLASSIFIED INVESTIGATIONS
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold font-mono mb-6 tracking-tight">
            <span className="text-red-500">SPECTER</span>
          </h1>

          <p className="text-xl md:text-2xl text-zinc-400 mb-4 font-light">
            Paranormal Investigation Bureau
          </p>

          <p className="text-lg text-zinc-500 max-w-2xl mx-auto mb-8">
            Step into the shadows. Investigate unexplained phenomena.
            Uncover the truth behind cases the world isn&apos;t ready to know.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/signup"
              className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition text-lg"
            >
              Begin Your Investigation
            </Link>
            <Link
              href="#cases"
              className="px-8 py-3 border border-zinc-700 hover:border-zinc-500 text-zinc-300 font-medium rounded-lg transition"
            >
              View Case Files
            </Link>
          </div>

          <div className="mt-12 flex items-center justify-center gap-8 text-zinc-600">
            <div className="text-center">
              <p className="text-2xl font-bold font-mono text-zinc-400">3+</p>
              <p className="text-xs uppercase tracking-wide">Active Cases</p>
            </div>
            <div className="w-px h-8 bg-zinc-800" />
            <div className="text-center">
              <p className="text-2xl font-bold font-mono text-zinc-400">2</p>
              <p className="text-xs uppercase tracking-wide">Difficulty Tiers</p>
            </div>
            <div className="w-px h-8 bg-zinc-800" />
            <div className="text-center">
              <p className="text-2xl font-bold font-mono text-zinc-400">∞</p>
              <p className="text-xs uppercase tracking-wide">Mysteries</p>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 border-t border-zinc-800">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold font-mono mb-4">HOW IT WORKS</h2>
            <p className="text-zinc-500 max-w-xl mx-auto">
              Each case presents a mystery. Your job is to analyze the evidence and uncover what really happened.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-8 text-center">
              <div className="w-12 h-12 bg-red-900/30 rounded-lg flex items-center justify-center mx-auto mb-6">
                <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-3">1. Review the Case</h3>
              <p className="text-sm text-zinc-500">
                Read the briefing and examine all available evidence. Documents, recordings, photographs - every detail matters.
              </p>
            </div>

            <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-8 text-center">
              <div className="w-12 h-12 bg-amber-900/30 rounded-lg flex items-center justify-center mx-auto mb-6">
                <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-3">2. Form Your Theory</h3>
              <p className="text-sm text-zinc-500">
                Connect the dots. Take notes. Build a theory about what happened and who - or what - is responsible.
              </p>
            </div>

            <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-8 text-center">
              <div className="w-12 h-12 bg-green-900/30 rounded-lg flex items-center justify-center mx-auto mb-6">
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-3">3. Solve the Mystery</h3>
              <p className="text-sm text-zinc-500">
                Submit your conclusion. Find the surface explanation, or dig deeper to uncover the TRUE solution.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Cases */}
      <section id="cases" className="py-24 border-t border-zinc-800 bg-zinc-950/50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold font-mono mb-4">CASE FILES</h2>
            <p className="text-zinc-500 max-w-xl mx-auto">
              Each case has two layers of truth. The surface explanation... and what really happened.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Case 1 */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden group hover:border-zinc-700 transition">
              <div className="px-5 py-4 border-b border-zinc-800 bg-zinc-950">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono text-zinc-500">CASE #0001</span>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-amber-900/30 text-amber-400 border border-amber-800">
                    AMBER
                  </span>
                </div>
                <h3 className="text-lg font-semibold">The Hartwell Incident</h3>
              </div>
              <div className="px-5 py-4">
                <p className="text-sm text-zinc-500 mb-4">
                  A family reports unexplained phenomena in their new home. Electronic interference. Cold spots.
                  A child who speaks to &quot;the lady in the wall.&quot;
                </p>
                <div className="flex items-center justify-between text-xs text-zinc-600">
                  <span>~30 min</span>
                  <span className="text-green-400">FREE</span>
                </div>
              </div>
            </div>

            {/* Case 2 */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden group hover:border-zinc-700 transition">
              <div className="px-5 py-4 border-b border-zinc-800 bg-zinc-950">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono text-zinc-500">CASE #0002</span>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-red-900/30 text-red-400 border border-red-800">
                    RED
                  </span>
                </div>
                <h3 className="text-lg font-semibold">The Blackwood Recording</h3>
              </div>
              <div className="px-5 py-4">
                <p className="text-sm text-zinc-500 mb-4">
                  A podcast host records impossible sounds in an abandoned sanitarium.
                  Voices that know his name. Words he doesn&apos;t remember speaking.
                </p>
                <div className="flex items-center justify-between text-xs text-zinc-600">
                  <span>~45 min</span>
                  <span>Senior Level</span>
                </div>
              </div>
            </div>

            {/* Case 3 */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden group hover:border-zinc-700 transition">
              <div className="px-5 py-4 border-b border-zinc-800 bg-zinc-950">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono text-zinc-500">CASE #0003</span>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-red-900/30 text-red-400 border border-red-800">
                    RED
                  </span>
                </div>
                <h3 className="text-lg font-semibold">The Millbrook Disappearances</h3>
              </div>
              <div className="px-5 py-4">
                <p className="text-sm text-zinc-500 mb-4">
                  Thirteen people vanish from a small Vermont town. It&apos;s happened before -
                  in 1973. And in 1923. The pattern is accelerating.
                </p>
                <div className="flex items-center justify-between text-xs text-zinc-600">
                  <span>~60 min</span>
                  <span>Expert Level</span>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition"
            >
              Access All Case Files
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 border-t border-zinc-800">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold font-mono mb-6">
            READY TO INVESTIGATE?
          </h2>
          <p className="text-lg text-zinc-500 mb-8">
            Join SPECTER and begin uncovering the truth behind unexplained phenomena.
            Your first case is free.
          </p>
          <Link
            href="/signup"
            className="inline-block px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition text-lg"
          >
            Create Your Account
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-zinc-800">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-xl font-bold font-mono text-red-500">SPECTER</span>
          <p className="text-sm text-zinc-600">
            &copy; 2024 SPECTER Investigation Bureau. All cases are works of fiction.
          </p>
        </div>
      </footer>
    </div>
  )
}
