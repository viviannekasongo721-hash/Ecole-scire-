// src/routes/memoirs.tsx
// Mémoires — données Firebase Firestore + téléchargement via Firebase Storage URL

import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import {
  getPublicationsByType,
  incrementDownloads,
  type Publication,
} from '@/lib/scire-store'

export const Route = createFileRoute('/memoirs')({
  component: MemoirsPage,
})

function MemoirsPage() {
  const [memoirs, setMemoirs] = useState<Publication[]>([])
  const [search, setSearch]   = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getPublicationsByType('memoir')
      .then(setMemoirs)
      .finally(() => setLoading(false))
  }, [])

  const filtered = memoirs.filter(
    (m) =>
      m.title.toLowerCase().includes(search.toLowerCase()) ||
      m.author.toLowerCase().includes(search.toLowerCase()) ||
      m.tags.some((t) => t.toLowerCase().includes(search.toLowerCase())),
  )

  async function handleDownload(pub: Publication) {
    // Incrémente le compteur dans Firestore
    await incrementDownloads(pub.id)
    // Ouvre le PDF depuis Firebase Storage directement
    if (pub.fileURL) {
      window.open(pub.fileURL, '_blank', 'noopener,noreferrer')
      // Met à jour localement le compteur
      setMemoirs((prev) =>
        prev.map((m) => m.id === pub.id ? { ...m, downloads: m.downloads + 1 } : m),
      )
    } else {
      alert('Le fichier PDF n\'est pas disponible pour cette publication.')
    }
  }

  const byYear: Record<number, Publication[]> = {}
  filtered.forEach((m) => {
    if (!byYear[m.year]) byYear[m.year] = []
    byYear[m.year].push(m)
  })
  const sortedYears = Object.keys(byYear).map(Number).sort((a, b) => b - a)

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl">📚</span>
          <h1 className="text-3xl font-serif font-bold" style={{ color: '#1a2a4a' }}>
            Répertoire des Mémoires
          </h1>
        </div>
        <p className="text-gray-600">
          Bibliothèque ouverte des travaux de fin de cycle (licence et master) de l'École SCIRE.
          Téléchargement gratuit et libre d'accès.
        </p>
        <div className="h-0.5 mt-4 w-16 rounded" style={{ backgroundColor: '#c9a227' }} />
      </div>

      <div className="mb-8">
        <input
          type="text"
          placeholder="Rechercher un mémoire, un auteur ou un thème…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border-2 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#1a2a4a]"
          style={{ borderColor: '#ede8d5', backgroundColor: 'white' }}
        />
      </div>

      {loading ? (
        <div className="text-center py-16 text-gray-400">Chargement des mémoires…</div>
      ) : filtered.length === 0 ? (
        <div
          className="rounded-lg p-10 text-center border-2 border-dashed"
          style={{ borderColor: '#c9a227', backgroundColor: '#ede8d5' }}
        >
          <p className="text-gray-500">
            {memoirs.length === 0
              ? 'Aucun mémoire disponible pour le moment.'
              : 'Aucun mémoire ne correspond à votre recherche.'}
          </p>
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-500 mb-6">
            {filtered.length} mémoire{filtered.length !== 1 ? 's' : ''}
          </p>
          <div className="space-y-10">
            {sortedYears.map((year) => (
              <div key={year}>
                <h2
                  className="font-serif font-semibold text-lg mb-4 pb-2 border-b"
                  style={{ color: '#1a2a4a', borderColor: '#c9a227' }}
                >
                  Promotion {year}
                </h2>
                <div className="space-y-4">
                  {byYear[year].map((memoir) => (
                    <div
                      key={memoir.id}
                      className="bg-white rounded-lg p-5 shadow-sm flex items-start justify-between gap-4"
                      style={{ borderLeft: '4px solid #c9a227' }}
                    >
                      <div className="flex-1">
                        <h3 className="font-serif font-semibold text-gray-900 mb-1">{memoir.title}</h3>
                        <p className="text-sm text-gray-500 mb-2">
                          {memoir.author} · {memoir.year}
                        </p>
                        <p className="text-sm text-gray-600 line-clamp-2">{memoir.abstract}</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {memoir.tags.map((t) => (
                            <span
                              key={t}
                              className="text-xs px-2 py-0.5 rounded-full"
                              style={{ backgroundColor: '#ede8d5', color: '#1a2a4a' }}
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                        {memoir.downloads > 0 && (
                          <p className="text-xs text-gray-400 mt-2">⬇ {memoir.downloads} téléchargements</p>
                        )}
                      </div>
                      <button
                        onClick={() => handleDownload(memoir)}
                        disabled={!memoir.fileURL}
                        className="flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded font-semibold text-sm text-[#1a2a4a] transition-colors disabled:opacity-40"
                        style={{ backgroundColor: '#c9a227' }}
                      >
                        <span>⬇</span>
                        <span className="hidden sm:inline">Télécharger</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
