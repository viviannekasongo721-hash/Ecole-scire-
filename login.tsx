import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import {
  getUserByEmail,
  addUser,
  setSession,
  getSession,
} from '@/lib/scire-store'

export const Route = createFileRoute('/login')({
  component: LoginPage,
})

const ADMIN_PASSWORD = 'scire@admin2025'

function LoginPage() {
  const navigate = useNavigate()
  const [tab, setTab] = useState<'login' | 'register'>('login')
  const [form, setForm] = useState({ email: '', password: '', name: '', class: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (getSession()) navigate({ to: '/' })
  }, [navigate])

  function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Admin check
    if (
      form.email === 'admin@scire-unikin.ac.cd' &&
      form.password === ADMIN_PASSWORD
    ) {
      setSession({
        userId: 'admin-001',
        email: form.email,
        name: 'Administrateur SCIRE',
        role: 'admin',
        class: '',
      })
      navigate({ to: '/admin' })
      return
    }

    // Student check (email = id, password = email for simplicity)
    const user = getUserByEmail(form.email)
    if (!user) {
      setError('Compte introuvable. Vérifiez votre email ou créez un compte.')
      setLoading(false)
      return
    }

    // Simple password: last 6 chars of email reversed (demo auth)
    const expectedPwd = form.email.split('@')[0].slice(-6)
    if (form.password !== expectedPwd && form.password !== 'scire2025') {
      setError('Mot de passe incorrect.')
      setLoading(false)
      return
    }

    setSession({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      class: user.class,
    })
    navigate({ to: '/student' })
  }

  function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!form.name || !form.email || !form.class) {
      setError('Tous les champs sont obligatoires.')
      return
    }

    const existing = getUserByEmail(form.email)
    if (existing) {
      setError('Un compte avec cet email existe déjà.')
      return
    }

    const user = addUser({
      email: form.email,
      name: form.name,
      class: form.class,
      role: 'student',
    })

    setSession({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: 'student',
      class: user.class,
    })
    navigate({ to: '/student' })
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-16"
      style={{ backgroundColor: '#f8f4e8' }}
    >
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div
            className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center font-bold text-xl border-2 border-[#c9a227]"
            style={{ backgroundColor: '#c9a227', color: '#1a2a4a' }}
          >
            SC
          </div>
          <h1 className="font-serif font-bold text-2xl" style={{ color: '#1a2a4a' }}>
            Espace Académique SCIRE
          </h1>
          <p className="text-sm text-gray-500 mt-1">Université de Kinshasa</p>
        </div>

        {/* Card */}
        <div
          className="bg-white rounded-xl shadow-lg overflow-hidden"
          style={{ borderTop: '4px solid #c9a227' }}
        >
          {/* Tabs */}
          <div className="flex border-b" style={{ borderColor: '#ede8d5' }}>
            <button
              onClick={() => { setTab('login'); setError('') }}
              className="flex-1 py-3 text-sm font-semibold transition-colors"
              style={{
                backgroundColor: tab === 'login' ? '#1a2a4a' : 'white',
                color: tab === 'login' ? '#c9a227' : '#666',
              }}
            >
              Connexion
            </button>
            <button
              onClick={() => { setTab('register'); setError('') }}
              className="flex-1 py-3 text-sm font-semibold transition-colors"
              style={{
                backgroundColor: tab === 'register' ? '#1a2a4a' : 'white',
                color: tab === 'register' ? '#c9a227' : '#666',
              }}
            >
              Créer un Compte
            </button>
          </div>

          <div className="p-6">
            {error && (
              <div
                className="mb-4 p-3 rounded text-sm"
                style={{ backgroundColor: '#fee2e2', color: '#991b1b' }}
              >
                {error}
              </div>
            )}

            {tab === 'login' ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-gray-700">
                    Email institutionnel
                  </label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full border-2 rounded-lg px-4 py-2.5 text-sm focus:outline-none"
                    style={{ borderColor: '#ede8d5' }}
                    placeholder="votre@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-gray-700">
                    Mot de passe
                  </label>
                  <input
                    type="password"
                    required
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="w-full border-2 rounded-lg px-4 py-2.5 text-sm focus:outline-none"
                    style={{ borderColor: '#ede8d5' }}
                    placeholder="••••••••"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-lg font-semibold text-sm"
                  style={{ backgroundColor: '#1a2a4a', color: '#f8f4e8' }}
                >
                  {loading ? 'Connexion...' : 'Se Connecter'}
                </button>

                <div
                  className="text-xs text-gray-500 text-center p-3 rounded"
                  style={{ backgroundColor: '#f8f4e8' }}
                >
                  <strong>Étudiant :</strong> mot de passe = <code>scire2025</code>
                  <br />
                  <strong>Admin :</strong> admin@scire-unikin.ac.cd / scire@admin2025
                </div>
              </form>
            ) : (
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-gray-700">
                    Nom complet *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full border-2 rounded-lg px-4 py-2.5 text-sm focus:outline-none"
                    style={{ borderColor: '#ede8d5' }}
                    placeholder="Prénom NOM"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-gray-700">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full border-2 rounded-lg px-4 py-2.5 text-sm focus:outline-none"
                    style={{ borderColor: '#ede8d5' }}
                    placeholder="votre@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-gray-700">
                    Promotion / Classe *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.class}
                    onChange={(e) => setForm({ ...form, class: e.target.value })}
                    className="w-full border-2 rounded-lg px-4 py-2.5 text-sm focus:outline-none"
                    style={{ borderColor: '#ede8d5' }}
                    placeholder="ex: Licence 3 Droit 2024-2025"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 rounded-lg font-semibold text-sm"
                  style={{ backgroundColor: '#c9a227', color: '#1a2a4a' }}
                >
                  Créer mon Compte
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
