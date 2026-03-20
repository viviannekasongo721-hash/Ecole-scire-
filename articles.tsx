import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import {
  getPublicationsByType,
  incrementDownloads,
  getPDF,
  type Publication,
} from '@/lib/scire-store'

export const Route = createFileRoute('/articles')({
  component: ArticlesPage,
})

function ArticlesPage() {
  const [articles, setArticles] = useState<Publication[]>([])
  const [search, setSearch] = useState('')
  const [expanded, setExpanded] = useState<string | null>(null)

  useEffect(() => {
    setArticles(getPublicationsByType('article'))
  }, [])

  const filtered = articles.filter(
    (a) =>
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.author.toLowerCase().includes(search.toLowerCase()) ||
      a.abstract.toLowerCase().includes(search.toLowerCase()) ||
      a.tags.some((t) => t.toLowerCase().includes(search.toLowerCase())),
  )

  async function handleDownload(pub: Publication) {
    incrementDownloads(pub.id)
    setArticles(getPublicationsByType('article'))

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
      alert('Le fichier PDF n\'est pas disponible pour cette publication.')
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl">📄</span>
          <h1 className="text-3xl font-serif font-bold" style={{ color: '#1a2a4a' }}>
            Articles Scientifiques
          </h1>
        </div>
        <p className="text-gray-600">
          Accès libre aux articles de recherche publiés par les membres et chercheurs de l'École SCIRE.
        </p>
        <div className="h-0.5 mt-4 w-16 rounded" style={{ backgroundColor: '#c9a227' }} />
      </div>

      {/* Search */}
      <div className="mb-8">
        <input
          type="text"
          placeholder="Rechercher par titre, auteur, mot-clé..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border-2 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#1a2a4a] transition-colors"
          style={{ borderColor: '#ede8d5', backgroundColor: 'white' }}
        />
      </div>

      {/* Count */}
      <p className="text-sm text-gray-500 mb-6">
        {filtered.length} article{filtered.length !== 1 ? 's' : ''} trouvé{filtered.length !== 1 ? 's' : ''}
      </p>

      {/* List */}
      {filtered.length === 0 ? (
        <div
          className="rounded-lg p-10 text-center border-2 border-dashed"
          style={{ borderColor: '#c9a227', backgroundColor: '#ede8d5' }}
        >
          <p className="text-gray-500">Aucun article disponible pour le moment.</p>
        </div>
      ) : (
        <div className="space-y-5">
          {filtered.map((article) => (
            <div
              key={article.id}
              className="bg-white rounded-lg shadow-sm overflow-hidden"
              style={{ borderLeft: '4px solid #1a2a4a' }}
            >
              <div className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h2
                      className="font-serif font-bold text-xl mb-1 cursor-pointer hover:underline"
                      style={{ color: '#1a2a4a' }}
                      onClick={() => setExpanded(expanded === article.id ? null : article.id)}
                    >
                      {article.title}
                    </h2>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mb-3">
                      <span className="font-medium text-gray-700">{article.author}</span>
                      <span>·</span>
                      <span>{article.year}</span>
                      {article.downloads > 0 && (
                        <>
                          <span>·</span>
                          <span>⬇ {article.downloads} téléchargements</span>
                        </>
                      )}
                    </div>
                    {article.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {article.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-xs px-2 py-0.5 rounded-full"
                            style={{ backgroundColor: '#ede8d5', color: '#1a2a4a' }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Abstract preview */}
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {expanded === article.id
                        ? article.abstract
                        : article.abstract.slice(0, 200) + (article.abstract.length > 200 ? '…' : '')}
                    </p>
                    {article.abstract.length > 200 && (
                      <button
                        onClick={() => setExpanded(expanded === article.id ? null : article.id)}
                        className="text-xs mt-1 font-medium"
                        style={{ color: '#c9a227' }}
                      >
                        {expanded === article.id ? '▲ Réduire' : '▼ Lire la suite'}
                      </button>
                    )}
                  </div>

                  <button
                    onClick={() => handleDownload(article)}
                    className="flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded font-semibold text-sm transition-colors text-white"
                    style={{ backgroundColor: '#1a2a4a' }}
                    title="Télécharger le PDF"
                  >
                    <span>⬇</span>
                    <span className="hidden sm:inline">PDF</span>
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
