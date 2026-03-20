import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState, useEffect, useRef } from 'react'
import {
  getSession,
  clearSession,
  getPlatformStats,
  getPublications,
  getResults,
  getUsers,
  addPublication,
  deletePublication,
  addResult,
  deleteResult,
  deleteUser,
  getNewsItems,
  saveNewsItems,
  savePDF,
  deletePDF,
  type Publication,
  type AcademicResult,
  type UserAccount,
  type NewsItem,
} from '@/lib/scire-store'

export const Route = createFileRoute('/admin')({
  component: AdminDashboard,
})

type Section =
  | 'dashboard'
  | 'articles'
  | 'memoirs'
  | 'theses'
  | 'results'
  | 'users'
  | 'news'
  | 'messages'

const navItems: { id: Section; icon: string; label: string }[] = [
  { id: 'dashboard', icon: '📊', label: 'Tableau de Bord' },
  { id: 'articles', icon: '📄', label: 'Articles' },
  { id: 'memoirs', icon: '📚', label: 'Mémoires' },
  { id: 'theses', icon: '🎓', label: 'Thèses' },
  { id: 'results', icon: '📋', label: 'Résultats' },
  { id: 'users', icon: '👥', label: 'Comptes' },
  { id: 'news', icon: '📢', label: 'Actualités' },
  { id: 'messages', icon: '✉️', label: 'Messages' },
]

function AdminDashboard() {
  const navigate = useNavigate()
  const [section, setSection] = useState<Section>('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(true)

  useEffect(() => {
    const s = getSession()
    if (!s || s.role !== 'admin') {
      navigate({ to: '/login' })
    }
  }, [navigate])

  function handleLogout() {
    clearSession()
    navigate({ to: '/' })
  }

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: '#f0ece0' }}>
      {/* Sidebar */}
      <aside
        className={`${sidebarOpen ? 'w-60' : 'w-14'} flex-shrink-0 transition-all duration-200`}
        style={{ backgroundColor: '#1a2a4a' }}
      >
        {/* Sidebar header */}
        <div
          className="flex items-center justify-between px-3 py-4 border-b"
          style={{ borderColor: '#243660' }}
        >
          {sidebarOpen && (
            <span className="font-serif font-bold text-sm" style={{ color: '#c9a227' }}>
              Admin SCIRE
            </span>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-white/60 hover:text-white p-1"
          >
            {sidebarOpen ? '◀' : '▶'}
          </button>
        </div>

        {/* Nav items */}
        <nav className="py-3 px-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setSection(item.id)}
              className={`admin-nav-item w-full text-left mb-1 ${section === item.id ? 'active' : ''}`}
            >
              <span className="text-base">{item.icon}</span>
              {sidebarOpen && <span>{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div className="px-2 py-3 border-t mt-auto" style={{ borderColor: '#243660' }}>
          <button
            onClick={handleLogout}
            className="admin-nav-item w-full text-left"
          >
            <span>🚪</span>
            {sidebarOpen && <span>Déconnexion</span>}
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto p-6">
        <div className="max-w-5xl mx-auto">
          {section === 'dashboard' && <DashboardSection onNav={setSection} />}
          {section === 'articles' && <PublicationsSection type="article" title="Articles Scientifiques" icon="📄" />}
          {section === 'memoirs' && <PublicationsSection type="memoir" title="Mémoires" icon="📚" />}
          {section === 'theses' && <PublicationsSection type="thesis" title="Thèses Doctorales" icon="🎓" />}
          {section === 'results' && <ResultsSection />}
          {section === 'users' && <UsersSection />}
          {section === 'news' && <NewsSection />}
          {section === 'messages' && <MessagesSection />}
        </div>
      </main>
    </div>
  )
}

// ---- Dashboard Overview ----

function DashboardSection({ onNav }: { onNav: (s: Section) => void }) {
  const [stats, setStats] = useState({ articles: 0, memoirs: 0, theses: 0, results: 0, users: 0 })

  useEffect(() => {
    setStats(getPlatformStats())
  }, [])

  return (
    <div>
      <h1 className="font-serif font-bold text-2xl mb-6" style={{ color: '#1a2a4a' }}>
        Tableau de Bord
      </h1>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        {[
          { label: 'Articles', value: stats.articles, icon: '📄', section: 'articles' as Section },
          { label: 'Mémoires', value: stats.memoirs, icon: '📚', section: 'memoirs' as Section },
          { label: 'Thèses', value: stats.theses, icon: '🎓', section: 'theses' as Section },
          { label: 'Résultats', value: stats.results, icon: '📋', section: 'results' as Section },
          { label: 'Étudiants', value: stats.users, icon: '👥', section: 'users' as Section },
        ].map((s) => (
          <div
            key={s.label}
            className="stat-card cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => onNav(s.section)}
          >
            <div className="text-2xl mb-1">{s.icon}</div>
            <div className="text-2xl font-bold font-serif" style={{ color: '#1a2a4a' }}>
              {s.value}
            </div>
            <div className="text-xs text-gray-500">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Quick Publish */}
      <h2 className="font-serif font-semibold text-lg mb-4" style={{ color: '#1a2a4a' }}>
        Publication Rapide
      </h2>
      <div className="grid md:grid-cols-4 gap-3">
        {[
          { label: '+ Article', section: 'articles' as Section, color: '#1a2a4a' },
          { label: '+ Mémoire', section: 'memoirs' as Section, color: '#c9a227' },
          { label: '+ Thèse', section: 'theses' as Section, color: '#6b5c2a' },
          { label: '+ Résultats', section: 'results' as Section, color: '#2a5a2a' },
        ].map((btn) => (
          <button
            key={btn.label}
            onClick={() => onNav(btn.section)}
            className="py-3 rounded-lg font-semibold text-sm transition-colors"
            style={{ backgroundColor: btn.color, color: '#f8f4e8' }}
          >
            {btn.label}
          </button>
        ))}
      </div>
    </div>
  )
}

// ---- Publications Section ----

function PublicationsSection({
  type,
  title,
  icon,
}: {
  type: Publication['type']
  title: string
  icon: string
}) {
  const [items, setItems] = useState<Publication[]>([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    title: '',
    author: '',
    year: new Date().getFullYear(),
    abstract: '',
    tags: '',
  })
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const [saving, setSaving] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setItems(getPublications().filter((p) => p.type === type))
  }, [type])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)

    const pub = addPublication({
      type,
      title: form.title,
      author: form.author,
      year: form.year,
      abstract: form.abstract,
      tags: form.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      pdfName: pdfFile?.name,
    })

    if (pdfFile) {
      const buf = await pdfFile.arrayBuffer()
      await savePDF(pub.id, pdfFile.name, buf)
    }

    setItems(getPublications().filter((p) => p.type === type))
    setForm({ title: '', author: '', year: new Date().getFullYear(), abstract: '', tags: '' })
    setPdfFile(null)
    if (fileRef.current) fileRef.current.value = ''
    setShowForm(false)
    setSaving(false)
  }

  async function handleDelete(id: string) {
    if (!confirm('Supprimer cette publication ?')) return
    deletePublication(id)
    await deletePDF(id)
    setItems(getPublications().filter((p) => p.type === type))
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif font-bold text-2xl" style={{ color: '#1a2a4a' }}>
          {icon} {title}
        </h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 rounded font-semibold text-sm"
          style={{ backgroundColor: '#c9a227', color: '#1a2a4a' }}
        >
          {showForm ? '✕ Annuler' : '+ Nouvelle Publication'}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div
          className="bg-white rounded-xl p-6 mb-6 shadow-sm"
          style={{ borderTop: '3px solid #c9a227' }}
        >
          <h2 className="font-semibold mb-4" style={{ color: '#1a2a4a' }}>
            Nouvelle publication — {title}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Titre *</label>
                <input
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full border-2 rounded px-3 py-2 text-sm"
                  style={{ borderColor: '#ede8d5' }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Auteur *</label>
                <input
                  required
                  value={form.author}
                  onChange={(e) => setForm({ ...form, author: e.target.value })}
                  className="w-full border-2 rounded px-3 py-2 text-sm"
                  style={{ borderColor: '#ede8d5' }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Année *</label>
                <input
                  type="number"
                  required
                  value={form.year}
                  onChange={(e) => setForm({ ...form, year: Number(e.target.value) })}
                  className="w-full border-2 rounded px-3 py-2 text-sm"
                  style={{ borderColor: '#ede8d5' }}
                  min={2000}
                  max={2100}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  Mots-clés (virgule)
                </label>
                <input
                  value={form.tags}
                  onChange={(e) => setForm({ ...form, tags: e.target.value })}
                  className="w-full border-2 rounded px-3 py-2 text-sm"
                  style={{ borderColor: '#ede8d5' }}
                  placeholder="DIH, droit pénal, RDC"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Résumé / Abstract *</label>
              <textarea
                required
                value={form.abstract}
                onChange={(e) => setForm({ ...form, abstract: e.target.value })}
                rows={4}
                className="w-full border-2 rounded px-3 py-2 text-sm resize-none"
                style={{ borderColor: '#ede8d5' }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Fichier PDF (optionnel)
              </label>
              <input
                ref={fileRef}
                type="file"
                accept=".pdf"
                onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
                className="w-full text-sm text-gray-600"
              />
              {pdfFile && (
                <p className="text-xs text-green-700 mt-1">✔ {pdfFile.name}</p>
              )}
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2.5 rounded font-semibold text-sm"
                style={{ backgroundColor: '#1a2a4a', color: '#f8f4e8' }}
              >
                {saving ? 'Publication...' : '✔ Publier maintenant'}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-6 py-2.5 rounded font-semibold text-sm border"
                style={{ borderColor: '#ede8d5', color: '#666' }}
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      {/* List */}
      {items.length === 0 ? (
        <div
          className="rounded-lg p-8 text-center border-2 border-dashed"
          style={{ borderColor: '#c9a227', backgroundColor: '#ede8d5' }}
        >
          <p className="text-gray-500">Aucune publication. Cliquez sur "+ Nouvelle Publication".</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-lg p-4 shadow-sm flex items-start justify-between gap-4"
              style={{ borderLeft: '3px solid #c9a227' }}
            >
              <div className="flex-1">
                <h3 className="font-semibold text-sm text-gray-900">{item.title}</h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  {item.author} · {item.year}
                  {item.pdfName && <span className="ml-2 text-green-700">📎 {item.pdfName}</span>}
                </p>
                <p className="text-xs text-gray-400 mt-1 line-clamp-1">{item.abstract}</p>
              </div>
              <button
                onClick={() => handleDelete(item.id)}
                className="text-red-500 hover:text-red-700 text-xs px-2 py-1 rounded border border-red-200 hover:bg-red-50 flex-shrink-0"
              >
                🗑 Supprimer
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ---- Results Section ----

function ResultsSection() {
  const [items, setItems] = useState<AcademicResult[]>([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    studentName: '',
    class: '',
    academicYear: '',
    subject: '',
    score: '',
    grade: '20',
    mention: '',
  })
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setItems(getResults())
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const result = addResult({
      studentName: form.studentName,
      class: form.class,
      academicYear: form.academicYear,
      subject: form.subject,
      score: Number(form.score),
      grade: form.grade,
      mention: form.mention,
      pdfName: pdfFile?.name,
    })

    if (pdfFile) {
      const buf = await pdfFile.arrayBuffer()
      await savePDF(`result_${result.id}`, pdfFile.name, buf)
    }

    setItems(getResults())
    setForm({ studentName: '', class: '', academicYear: '', subject: '', score: '', grade: '20', mention: '' })
    setPdfFile(null)
    if (fileRef.current) fileRef.current.value = ''
    setShowForm(false)
  }

  async function handleDelete(id: string) {
    if (!confirm('Supprimer ce résultat ?')) return
    deleteResult(id)
    await deletePDF(`result_${id}`)
    setItems(getResults())
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif font-bold text-2xl" style={{ color: '#1a2a4a' }}>
          📋 Résultats Académiques
        </h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 rounded font-semibold text-sm"
          style={{ backgroundColor: '#c9a227', color: '#1a2a4a' }}
        >
          {showForm ? '✕ Annuler' : '+ Ajouter Résultat'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl p-6 mb-6 shadow-sm" style={{ borderTop: '3px solid #c9a227' }}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Nom de l'étudiant *</label>
                <input
                  required
                  value={form.studentName}
                  onChange={(e) => setForm({ ...form, studentName: e.target.value })}
                  className="w-full border-2 rounded px-3 py-2 text-sm"
                  style={{ borderColor: '#ede8d5' }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Promotion / Classe *</label>
                <input
                  required
                  value={form.class}
                  onChange={(e) => setForm({ ...form, class: e.target.value })}
                  className="w-full border-2 rounded px-3 py-2 text-sm"
                  style={{ borderColor: '#ede8d5' }}
                  placeholder="Licence 3 Droit"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Année Académique *</label>
                <input
                  required
                  value={form.academicYear}
                  onChange={(e) => setForm({ ...form, academicYear: e.target.value })}
                  className="w-full border-2 rounded px-3 py-2 text-sm"
                  style={{ borderColor: '#ede8d5' }}
                  placeholder="2024-2025"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Matière *</label>
                <input
                  required
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  className="w-full border-2 rounded px-3 py-2 text-sm"
                  style={{ borderColor: '#ede8d5' }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Note (sur barème) *</label>
                <input
                  type="number"
                  required
                  value={form.score}
                  onChange={(e) => setForm({ ...form, score: e.target.value })}
                  className="w-full border-2 rounded px-3 py-2 text-sm"
                  style={{ borderColor: '#ede8d5' }}
                  min={0}
                  max={100}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Barème (défaut 20)</label>
                <input
                  value={form.grade}
                  onChange={(e) => setForm({ ...form, grade: e.target.value })}
                  className="w-full border-2 rounded px-3 py-2 text-sm"
                  style={{ borderColor: '#ede8d5' }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Mention *</label>
                <select
                  required
                  value={form.mention}
                  onChange={(e) => setForm({ ...form, mention: e.target.value })}
                  className="w-full border-2 rounded px-3 py-2 text-sm bg-white"
                  style={{ borderColor: '#ede8d5' }}
                >
                  <option value="">Sélectionner</option>
                  <option>Grande Distinction</option>
                  <option>Distinction</option>
                  <option>Satisfaction</option>
                  <option>Passable</option>
                  <option>Échec</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Bulletin PDF</label>
                <input
                  ref={fileRef}
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
                  className="w-full text-sm text-gray-600"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                className="px-6 py-2.5 rounded font-semibold text-sm"
                style={{ backgroundColor: '#1a2a4a', color: '#f8f4e8' }}
              >
                ✔ Publier
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-6 py-2.5 rounded font-semibold text-sm border"
                style={{ borderColor: '#ede8d5', color: '#666' }}
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      {items.length === 0 ? (
        <div
          className="rounded-lg p-8 text-center border-2 border-dashed"
          style={{ borderColor: '#c9a227', backgroundColor: '#ede8d5' }}
        >
          <p className="text-gray-500">Aucun résultat publié.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full bg-white rounded-lg shadow-sm text-sm">
            <thead>
              <tr style={{ backgroundColor: '#1a2a4a', color: '#f8f4e8' }}>
                <th className="px-3 py-2 text-left">Étudiant</th>
                <th className="px-3 py-2 text-left">Promotion</th>
                <th className="px-3 py-2 text-left">Année</th>
                <th className="px-3 py-2 text-left">Matière</th>
                <th className="px-3 py-2 text-center">Note</th>
                <th className="px-3 py-2 text-center">Mention</th>
                <th className="px-3 py-2 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: '#ede8d5' }}>
              {items.map((r) => (
                <tr key={r.id} className="hover:bg-[#f8f4e8]/50">
                  <td className="px-3 py-2">{r.studentName}</td>
                  <td className="px-3 py-2 text-gray-600">{r.class}</td>
                  <td className="px-3 py-2 text-gray-600">{r.academicYear}</td>
                  <td className="px-3 py-2 text-gray-600">{r.subject}</td>
                  <td className="px-3 py-2 text-center font-bold">{r.score}/{r.grade || 20}</td>
                  <td className="px-3 py-2 text-center text-xs">{r.mention}</td>
                  <td className="px-3 py-2 text-center">
                    <button
                      onClick={() => handleDelete(r.id)}
                      className="text-red-500 hover:text-red-700 text-xs"
                    >
                      🗑
                    </button>
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

// ---- Users Section ----

function UsersSection() {
  const [users, setUsers] = useState<UserAccount[]>([])

  useEffect(() => {
    setUsers(getUsers())
  }, [])

  function handleDelete(id: string) {
    if (id === 'admin-001') return alert('Le compte admin principal ne peut pas être supprimé.')
    if (!confirm('Supprimer ce compte ?')) return
    deleteUser(id)
    setUsers(getUsers())
  }

  return (
    <div>
      <h1 className="font-serif font-bold text-2xl mb-6" style={{ color: '#1a2a4a' }}>
        👥 Gestion des Comptes
      </h1>

      <div className="overflow-x-auto">
        <table className="w-full bg-white rounded-lg shadow-sm text-sm">
          <thead>
            <tr style={{ backgroundColor: '#1a2a4a', color: '#f8f4e8' }}>
              <th className="px-4 py-3 text-left">Nom</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Promotion</th>
              <th className="px-4 py-3 text-center">Rôle</th>
              <th className="px-4 py-3 text-center">Inscrit le</th>
              <th className="px-4 py-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y" style={{ borderColor: '#ede8d5' }}>
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-[#f8f4e8]/50">
                <td className="px-4 py-2 font-medium">{u.name}</td>
                <td className="px-4 py-2 text-gray-600">{u.email}</td>
                <td className="px-4 py-2 text-gray-600">{u.class || '—'}</td>
                <td className="px-4 py-2 text-center">
                  <span
                    className="px-2 py-0.5 rounded text-xs font-semibold"
                    style={{
                      backgroundColor: u.role === 'admin' ? '#c9a22720' : '#1a2a4a20',
                      color: u.role === 'admin' ? '#6b5c2a' : '#1a2a4a',
                    }}
                  >
                    {u.role === 'admin' ? 'Admin' : 'Étudiant'}
                  </span>
                </td>
                <td className="px-4 py-2 text-center text-xs text-gray-400">
                  {new Date(u.createdAt).toLocaleDateString('fr-FR')}
                </td>
                <td className="px-4 py-2 text-center">
                  {u.id !== 'admin-001' && (
                    <button
                      onClick={() => handleDelete(u.id)}
                      className="text-red-500 hover:text-red-700 text-xs"
                    >
                      🗑
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ---- News Section ----

function NewsSection() {
  const [items, setItems] = useState<NewsItem[]>([])
  const [newText, setNewText] = useState('')

  useEffect(() => {
    setItems(getNewsItems())
  }, [])

  function addItem() {
    if (!newText.trim()) return
    const newItem: NewsItem = {
      id: Date.now().toString(),
      text: newText.trim(),
      active: true,
      createdAt: new Date().toISOString(),
    }
    const updated = [newItem, ...items]
    saveNewsItems(updated)
    setItems(updated)
    setNewText('')
  }

  function toggleActive(id: string) {
    const updated = items.map((i) => (i.id === id ? { ...i, active: !i.active } : i))
    saveNewsItems(updated)
    setItems(updated)
  }

  function removeItem(id: string) {
    const updated = items.filter((i) => i.id !== id)
    saveNewsItems(updated)
    setItems(updated)
  }

  return (
    <div>
      <h1 className="font-serif font-bold text-2xl mb-6" style={{ color: '#1a2a4a' }}>
        📢 Fil d'Actualités (Ticker)
      </h1>

      <div className="flex gap-3 mb-6">
        <input
          type="text"
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addItem()}
          className="flex-1 border-2 rounded px-3 py-2 text-sm"
          style={{ borderColor: '#ede8d5' }}
          placeholder="Nouveau message pour le ticker..."
        />
        <button
          onClick={addItem}
          className="px-4 py-2 rounded font-semibold text-sm"
          style={{ backgroundColor: '#c9a227', color: '#1a2a4a' }}
        >
          + Ajouter
        </button>
      </div>

      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-lg p-4 flex items-start gap-3 shadow-sm"
            style={{ opacity: item.active ? 1 : 0.5 }}
          >
            <div className="flex-1">
              <p className="text-sm">{item.text}</p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => toggleActive(item.id)}
                className="text-xs px-2 py-1 rounded border"
                style={{
                  backgroundColor: item.active ? '#e8f5e9' : '#f5f5f5',
                  color: item.active ? '#2e7d32' : '#666',
                  borderColor: item.active ? '#a5d6a7' : '#ddd',
                }}
              >
                {item.active ? '✓ Actif' : '○ Inactif'}
              </button>
              <button
                onClick={() => removeItem(item.id)}
                className="text-red-500 hover:text-red-700 text-xs"
              >
                🗑
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ---- Messages Section ----

function MessagesSection() {
  const messages = JSON.parse(localStorage.getItem('scire_contact_messages') || '[]')

  return (
    <div>
      <h1 className="font-serif font-bold text-2xl mb-6" style={{ color: '#1a2a4a' }}>
        ✉️ Messages de Contact
      </h1>

      {messages.length === 0 ? (
        <div
          className="rounded-lg p-8 text-center border-2 border-dashed"
          style={{ borderColor: '#c9a227', backgroundColor: '#ede8d5' }}
        >
          <p className="text-gray-500">Aucun message reçu.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {[...messages].reverse().map((msg: any) => (
            <div
              key={msg.id}
              className="bg-white rounded-lg p-5 shadow-sm"
              style={{ borderLeft: '3px solid #c9a227' }}
            >
              <div className="flex items-start justify-between gap-4 mb-2">
                <div>
                  <span className="font-semibold text-sm">{msg.name}</span>
                  <span className="text-gray-400 text-xs ml-2">&lt;{msg.email}&gt;</span>
                </div>
                <span className="text-xs text-gray-400">
                  {new Date(msg.createdAt).toLocaleString('fr-FR')}
                </span>
              </div>
              {msg.subject && (
                <p className="text-xs font-medium mb-1" style={{ color: '#1a2a4a' }}>
                  Objet : {msg.subject}
                </p>
              )}
              <p className="text-sm text-gray-600 whitespace-pre-wrap">{msg.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
