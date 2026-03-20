import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import {
  getPublicationsByType,
  incrementDownloads,
  getPDF,
  type Publication,
} from '@/lib/scire-store'

export const Route = createFileRoute('/theses')({
  component: ThesesPage,
})

function ThesesPage() {
  const [theses, setTheses] = useState<Publication[]>([])
  const [search, setSearch] = useState('')
  const [expanded, setExpanded] = useState<string | null>(null)

  useEffect(() => {
    setTheses(getPublicationsByType('thesis'))
  }, [])

  const filtered = theses.filter(
    (t) =>
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.author.toLowerCase().includes(search.toLowerCase()) ||
      t.tags.some((tag) => tag.toLowerCase().includes(search.toLowerCase())),
  )

  async function handleDownload(pub: Publication) {
    incrementDownloads(pub.id)
    setTheses(getPublicationsByType('thesis'))
    const pdfRecord = await getPDF(pub.id)
    if (pdfRecord) {
      const blob = new Blob([pdfRecord.data], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = pdfRecord.name
      a.click()
      URL.revokeObjectURL(url)
    } else {
      alert('Le fichier PDF n\'est pas disponible pour cette thèse.')
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl">🎓</span>
          <h1 className="text-3xl font-serif font-bold" style={{ color: '#1a2a4a' }}>
            Bibliothèque des Thèses
          </h1>
        </div>
        <p className="text-gray-600">
          Accès ouvert aux thèses doctorales de l'École SCIRE — Université de Kinshasa.
          Toutes les thèses sont disponibles en accès libre.
        </p>
        <div className="h-0.5 mt-4 w-16 rounded" style={{ backgroundColor: '#c9a227' }} />
      </div>

      {/* Info banner */}
      <div
        className="rounded-lg p-4 mb-8 flex items-start gap-3"
        style={{ backgroundColor: '#1a2a4a', color: '#f8f4e8' }}
      >
        <span className="text-xl">ℹ️</span>
        <div className="text-sm">
          <strong className="text-[#c9a227]">Accès libre et gratuit</strong> — La bibliothèque des thèses de l'École SCIRE
          est entièrement ouverte au public conformément à la politique d'accès libre de l'Université de Kinshasa.
        </div>
      </div>

      <div className="mb-8">
        <input
          type="text"
          placeholder="Rechercher une thèse..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border-2 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#1a2a4a]"
          style={{ borderColor: '#ede8d5', backgroundColor: 'white' }}
        />
      </div>

      <p className="text-sm text-gray-500 mb-6">{filtered.length} thèse{filtered.length !== 1 ? 's' : ''}</p>

      {filtered.length === 0 ? (
        <div
          className="rounded-lg p-10 text-center border-2 border-dashed"
          style={{ borderColor: '#c9a227', backgroundColor: '#ede8d5' }}
        >
          <p className="text-gray-500">Aucune thèse disponible pour le moment.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {filtered.map((thesis) => (
            <div
              key={thesis.id}
              className="bg-white rounded-lg shadow-sm overflow-hidden"
              style={{ borderLeft: '5px solid #6b5c2a' }}
            >
              <div className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div
                      className="text-xs font-semibold uppercase tracking-wider mb-2 px-2 py-0.5 rounded inline-block"
                      style={{ backgroundColor: '#6b5c2a20', color: '#6b5c2a' }}
                    >
                      Thèse de Doctorat
                    </div>
                    <h2
                      className="font-serif font-bold text-xl mb-2 cursor-pointer hover:underline"
                      style={{ color: '#1a2a4a' }}
                      onClick={() => setExpanded(expanded === thesis.id ? null : thesis.id)}
                    >
                      {thesis.title}
                    </h2>
                    <p className="text-sm text-gray-500 mb-3">
                      <strong>{thesis.author}</strong> · {thesis.year}
                    </p>

                    {/* Abstract */}
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {expanded === thesis.id
                        ? thesis.abstract
                        : thesis.abstract.slice(0, 300) + (thesis.abstract.length > 300 ? '…' : '')}
                    </p>
                    {thesis.abstract.length > 300 && (
                      <button
                        onClick={() => setExpanded(expanded === thesis.id ? null : thesis.id)}
                        className="text-xs mt-1 font-medium"
                        style={{ color: '#c9a227' }}
                      >
                        {expanded === thesis.id ? '▲ Réduire' : '▼ Lire le résumé complet'}
                      </button>
                    )}

                    <div className="flex flex-wrap gap-2 mt-3">
                      {thesis.tags.map((t) => (
                        <span
                          key={t}
                          className="text-xs px-2 py-0.5 rounded-full"
                          style={{ backgroundColor: '#ede8d5', color: '#1a2a4a' }}
                        >
                          {t}
                        </span>
                      ))}
                    </div>

                    {thesis.downloads > 0 && (
                      <p className="text-xs text-gray-400 mt-2">⬇ {thesis.downloads} téléchargements</p>
                    )}
                  </div>

                  <button
                    onClick={() => handleDownload(thesis)}
                    className="flex-shrink-0 flex flex-col items-center gap-1 px-4 py-3 rounded font-semibold text-sm text-[#1a2a4a] transition-colors text-center"
                    style={{ backgroundColor: '#c9a227' }}
                  >
                    <span className="text-xl">⬇</span>
                    <span className="hidden sm:inline text-xs">Télécharger</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
