import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { getResults, getPDF, type AcademicResult } from '@/lib/scire-store'

export const Route = createFileRoute('/results')({
  component: ResultsPage,
})

function ResultsPage() {
  const [results, setResults] = useState<AcademicResult[]>([])
  const [filterClass, setFilterClass] = useState('')
  const [filterYear, setFilterYear] = useState('')
  const [search, setSearch] = useState('')

  useEffect(() => {
    setResults(getResults())
  }, [])

  const classes = [...new Set(results.map((r) => r.class))].sort()
  const years = [...new Set(results.map((r) => r.academicYear))].sort().reverse()

  const filtered = results.filter((r) => {
    const matchClass = !filterClass || r.class === filterClass
    const matchYear = !filterYear || r.academicYear === filterYear
    const matchSearch =
      !search ||
      r.studentName.toLowerCase().includes(search.toLowerCase()) ||
      r.subject.toLowerCase().includes(search.toLowerCase())
    return matchClass && matchYear && matchSearch
  })

  async function handleDownload(result: AcademicResult) {
    const pdfRecord = await getPDF(`result_${result.id}`)
    if (pdfRecord) {
      const blob = new Blob([pdfRecord.data], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = pdfRecord.name
      a.click()
      URL.revokeObjectURL(url)
    } else {
      alert('Le PDF n\'est pas disponible.')
    }
  }

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
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl">📊</span>
          <h1 className="text-3xl font-serif font-bold" style={{ color: '#1a2a4a' }}>
            Résultats Académiques
          </h1>
        </div>
        <p className="text-gray-600">
          Résultats officiels de l'École SCIRE — accès public et gratuit, par promotion et par année académique.
        </p>
        <div className="h-0.5 mt-4 w-16 rounded" style={{ backgroundColor: '#c9a227' }} />
      </div>

      {/* Public notice */}
      <div
        className="rounded-lg p-4 mb-8 flex items-start gap-3"
        style={{ backgroundColor: '#ede8d5', borderLeft: '4px solid #c9a227' }}
      >
        <span>🔓</span>
        <p className="text-sm text-gray-700">
          <strong>Accès public et libre</strong> — Les résultats académiques de l'École SCIRE sont publiés
          en accès totalement libre conformément à la politique de transparence académique de l'institution.
          Aucun compte requis pour consulter ou télécharger.
        </p>
      </div>

      {/* Filters */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <input
          type="text"
          placeholder="Rechercher un étudiant ou matière..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border-2 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#1a2a4a]"
          style={{ borderColor: '#ede8d5' }}
        />
        <select
          value={filterClass}
          onChange={(e) => setFilterClass(e.target.value)}
          className="border-2 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#1a2a4a] bg-white"
          style={{ borderColor: '#ede8d5' }}
        >
          <option value="">Toutes les promotions</option>
          {classes.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <select
          value={filterYear}
          onChange={(e) => setFilterYear(e.target.value)}
          className="border-2 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#1a2a4a] bg-white"
          style={{ borderColor: '#ede8d5' }}
        >
          <option value="">Toutes les années académiques</option>
          {years.map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>

      <p className="text-sm text-gray-500 mb-6">{filtered.length} résultat{filtered.length !== 1 ? 's' : ''}</p>

      {filtered.length === 0 ? (
        <div
          className="rounded-lg p-10 text-center border-2 border-dashed"
          style={{ borderColor: '#c9a227', backgroundColor: '#ede8d5' }}
        >
          <p className="text-gray-500">
            {results.length === 0
              ? 'Aucun résultat publié pour le moment. Les résultats seront disponibles dès leur publication par l\'administration.'
              : 'Aucun résultat ne correspond aux filtres sélectionnés.'}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full bg-white rounded-lg shadow-sm overflow-hidden text-sm">
            <thead>
              <tr style={{ backgroundColor: '#1a2a4a', color: '#f8f4e8' }}>
                <th className="px-4 py-3 text-left font-semibold">Étudiant</th>
                <th className="px-4 py-3 text-left font-semibold">Promotion</th>
                <th className="px-4 py-3 text-left font-semibold">Année Académique</th>
                <th className="px-4 py-3 text-left font-semibold">Matière</th>
                <th className="px-4 py-3 text-center font-semibold">Note</th>
                <th className="px-4 py-3 text-center font-semibold">Mention</th>
                <th className="px-4 py-3 text-center font-semibold">PDF</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: '#ede8d5' }}>
              {filtered.map((result, idx) => (
                <tr
                  key={result.id}
                  className="hover:bg-[#f8f4e8]/50 transition-colors"
                  style={{ backgroundColor: idx % 2 === 0 ? 'white' : '#faf8f2' }}
                >
                  <td className="px-4 py-3 font-medium text-gray-900">{result.studentName}</td>
                  <td className="px-4 py-3 text-gray-600">{result.class}</td>
                  <td className="px-4 py-3 text-gray-600">{result.academicYear}</td>
                  <td className="px-4 py-3 text-gray-600">{result.subject}</td>
                  <td className="px-4 py-3 text-center font-bold" style={{ color: '#1a2a4a' }}>
                    {result.score}/{result.grade ? result.grade : 20}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className="px-2 py-0.5 rounded text-xs font-semibold"
                      style={{
                        backgroundColor: getMentionColor(result.mention) + '20',
                        color: getMentionColor(result.mention),
                      }}
                    >
                      {result.mention}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {result.pdfName ? (
                      <button
                        onClick={() => handleDownload(result)}
                        className="text-xs px-3 py-1 rounded font-medium transition-colors text-[#1a2a4a]"
                        style={{ backgroundColor: '#c9a227' }}
                      >
                        ⬇ PDF
                      </button>
                    ) : (
                      <span className="text-gray-300">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
