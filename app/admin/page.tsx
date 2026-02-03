import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

// Admin email whitelist - add your email here
const ADMIN_EMAILS = ['admin@specter.dev'] // Update with your actual admin emails

export default async function AdminDashboard() {
  const supabase = await createClient()

  // Check authentication
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect('/login')
  }

  // Check if user is admin
  if (!ADMIN_EMAILS.includes(user.email || '')) {
    redirect('/cases')
  }

  // Fetch statistics
  const [casesResult, usersResult, purchasesResult, progressResult] = await Promise.all([
    supabase.from('cases').select('id, title, slug, is_published, is_free', { count: 'exact' }),
    supabase.from('profiles').select('id', { count: 'exact' }),
    supabase.from('purchases').select('id, amount', { count: 'exact' }),
    supabase.from('user_progress').select('id, status', { count: 'exact' })
  ])

  const cases = casesResult.data || []
  const totalUsers = usersResult.count || 0
  const purchases = purchasesResult.data || []
  const progress = progressResult.data || []

  const totalRevenue = purchases.reduce((sum, p) => sum + (p.amount || 0), 0)
  const completedCases = progress.filter(p => p.status === 'completed').length

  return (
    <div className="min-h-screen bg-black text-zinc-100">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/cases" className="text-zinc-400 hover:text-zinc-100 transition">
              ← Back to Cases
            </Link>
            <span className="text-zinc-700">|</span>
            <h1 className="text-lg font-bold font-mono">ADMIN DASHBOARD</h1>
          </div>
          <span className="text-xs bg-red-900/30 text-red-400 border border-red-800 px-2 py-1 rounded">
            RESTRICTED ACCESS
          </span>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
            <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Total Users</p>
            <p className="text-3xl font-bold font-mono">{totalUsers}</p>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
            <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Total Cases</p>
            <p className="text-3xl font-bold font-mono">{cases.length}</p>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
            <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Total Purchases</p>
            <p className="text-3xl font-bold font-mono">{purchases.length}</p>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
            <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Total Revenue</p>
            <p className="text-3xl font-bold font-mono text-green-400">
              ${(totalRevenue / 100).toFixed(2)}
            </p>
          </div>
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
            <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Cases Completed</p>
            <p className="text-3xl font-bold font-mono">{completedCases}</p>
            <p className="text-sm text-zinc-500 mt-1">
              {progress.length > 0 ? ((completedCases / progress.length) * 100).toFixed(1) : 0}% completion rate
            </p>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
            <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Avg Revenue per User</p>
            <p className="text-3xl font-bold font-mono text-green-400">
              ${totalUsers > 0 ? ((totalRevenue / 100) / totalUsers).toFixed(2) : '0.00'}
            </p>
          </div>
        </div>

        {/* Cases Table */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Case Files</h2>
            <Link
              href="/admin/cases/new"
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded transition"
            >
              + New Case
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-800 text-left">
                  <th className="px-6 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">Slug</th>
                  <th className="px-6 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">Pricing</th>
                  <th className="px-6 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {cases.map((caseItem) => (
                  <tr key={caseItem.id} className="hover:bg-zinc-800/50 transition">
                    <td className="px-6 py-4">
                      <span className="font-medium">{caseItem.title}</span>
                    </td>
                    <td className="px-6 py-4">
                      <code className="text-sm text-zinc-400">{caseItem.slug}</code>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs px-2 py-1 rounded ${
                        caseItem.is_published
                          ? 'bg-green-900/30 text-green-400 border border-green-800'
                          : 'bg-amber-900/30 text-amber-400 border border-amber-800'
                      }`}>
                        {caseItem.is_published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs px-2 py-1 rounded ${
                        caseItem.is_free
                          ? 'bg-blue-900/30 text-blue-400 border border-blue-800'
                          : 'bg-purple-900/30 text-purple-400 border border-purple-800'
                      }`}>
                        {caseItem.is_free ? 'Free' : 'Premium'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/cases/${caseItem.slug}`}
                          className="text-sm text-zinc-400 hover:text-zinc-200 transition"
                        >
                          Edit
                        </Link>
                        <span className="text-zinc-700">|</span>
                        <Link
                          href={`/cases/${caseItem.slug}`}
                          className="text-sm text-zinc-400 hover:text-zinc-200 transition"
                        >
                          View
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
