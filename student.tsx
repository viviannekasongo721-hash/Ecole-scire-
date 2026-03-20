import { createFileRoute, useNavigate, Link } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { getSession, getResults, clearSession, type Session, type AcademicResult } from '@/lib/scire-store'

export const Route = createFileRoute('/student')({
  component: StudentSpace,
})

function StudentSpace() {
  const navigate = useNavigate()
  const [session, setSession] = useState<Session | null>(null)
  const [myResults, setMyResults] = useState<AcademicResult[]>([])

  useEffect(() => {
    const s = getSession()
    if (!s || s.role !== 'student') {
      navigate({ to: '/login' })
      return
    }
    setSession(s)

    // Find results matching student name or class
    const allResults = getResults()
    const mine = allResults.filter(
      (r) =>
        r.studentName.toLowerCase().includes(s.name.toLowerCase()) ||
        r.class === s.class,
    )
    setMyResults(mine)
  }, [navigate])

  function handleLogout() {
    clearSession()
    navigate({ to: '/' })
  }

  if (!session) return null

  const years = [...new Set(myResults.map((r) => r.academicYear))].sort().reverse()

  function getMentionColor(mention: string) {
    if (mention.toLowerCase().includes('grande') || mention.toLowerCase().includes('distinction'))
      return '#1a7a1a'
    if (mention.toLowerCase().includes('satisf') || mention.toLowerCase().includes('bien'))
      return '#1a2a4a'
    if (mention.toLowerCase().includes('échec') || mention.toLowerCase().includes('fail'))
      return '#c0392b'
    return '#666'
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Welcome header */}
      <div
        className="rounded-xl p-6 mb-8"
        style={{ backgroundColor: '#1a2a4a', color: '#f8f4e8' }}
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm" style={{ color: '#c9a227' }}>Espace Étudiant</p>
            <h1 className="font-serif font-bold text-2xl mt-1">{session.name}</h1>
            <p className="text-white/60 text-sm mt-1">{session.email}</p>
            {session.class && (
              <div
                className="inline-block mt-2 text-xs px-3 py-1 rounded-full font-medium"
                style={{ backgroundColor: '#c9a227', color: '#1a2a4a' }}
              >
                {session.class}
              </div>
            )}
          </div>
          <button
            onClick={handleLogout}
            className="text-sm px-3 py-1.5 rounded border border-white/30 text-white/60 hover:bg-white/10 transition-colors"
          >
            Déconnexion
          </button>
        </div>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-3 gap-4 mb-10">
        {[
          { icon: '📄', label: 'Articles', to: '/articles' },
          { icon: '📚', label: 'Mémoires', to: '/memoirs' },
          { icon: '🎓', label: 'Thèses', to: '/theses' },
        ].map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className="bg-white rounded-lg p-4 text-center shadow-sm hover:shadow-md transition-shadow"
            style={{ borderTop: '2px solid #c9a227' }}
          >
            <div className="text-2xl mb-1">{item.icon}</div>
            <div className="text-xs font-medium" style={{ color: '#1a2a4a' }}>{item.label}</div>
          </Link>
        ))}
      </div>

      {/* My Results */}
      <div>
        <h2 className="font-serif font-bold text-2xl mb-6" style={{ color: '#1a2a4a' }}>
          Mes Résultats Académiques
        </h2>

        {myResults.length === 0 ? (
          <div
            className="rounded-lg p-8 text-center border-2 border-dashed"
            style={{ borderColor: '#c9a227', backgroundColor: '#ede8d5' }}
          >
            <p className="text-gray-500 mb-2">Aucun résultat trouvé pour votre promotion.</p>
            <p className="text-sm text-gray-400">
              Les résultats apparaissent ici lorsqu'ils sont publiés par l'administration.
            </p>
            <Link
              to="/results"
              className="inline-block mt-4 text-sm font-medium px-4 py-2 rounded"
              style={{ backgroundColor: '#1a2a4a', color: '#f8f4e8' }}
            >
              Voir tous les résultats publics
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {years.map((year) => (
              <div key={year}>
                <h3
                  className="font-semibold mb-3 pb-2 border-b"
                  style={{ color: '#1a2a4a', borderColor: '#c9a227' }}
                >
                  Année Académique {year}
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full bg-white rounded-lg shadow-sm text-sm">
                    <thead>
                      <tr style={{ backgroundColor: '#1a2a4a', color: '#f8f4e8' }}>
                        <th className="px-4 py-2 text-left">Étudiant</th>
                        <th className="px-4 py-2 text-left">Matière</th>
                        <th className="px-4 py-2 text-center">Note</th>
                        <th className="px-4 py-2 text-center">Mention</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y" style={{ borderColor: '#ede8d5' }}>
                      {myResults
                        .filter((r) => r.academicYear === year)
                        .map((r) => (
                          <tr key={r.id}>
                            <td className="px-4 py-2 font-medium">{r.studentName}</td>
                            <td className="px-4 py-2 text-gray-600">{r.subject}</td>
                            <td className="px-4 py-2 text-center font-bold" style={{ color: '#1a2a4a' }}>
                              {r.score}/20
                            </td>
                            <td className="px-4 py-2 text-center">
                              <span
                                className="px-2 py-0.5 rounded text-xs font-semibold"
                                style={{
                                  backgroundColor: getMentionColor(r.mention) + '20',
                                  color: getMentionColor(r.mention),
                                }}
                              >
                                {r.mention}
                              </span>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
