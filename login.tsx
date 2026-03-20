// src/routes/login.tsx
// Connexion Firebase — Email/Mot de passe + Mot de passe oublié

import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import {
  loginAdmin,
  loginStudent,
  registerStudent,
  resetPassword,
  getSession,
} from '@/lib/scire-store'

export const Route = createFileRoute('/login')({
  component: LoginPage,
})

const ADMIN_EMAIL = 'admin@scire-unikin.ac.cd'

type Tab = 'login' | 'register' | 'forgot'

function LoginPage() {
  const navigate = useNavigate()
  const [tab, setTab] = useState<Tab>('login')
  const [form, setForm] = useState({
    email: '',
    password: '',
    password2: '',
    name: '',
    class: '',
  })
  const [error, setError]     = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (getSession()) navigate({ to: '/' })
  }, [navigate])

  function resetForm() {
    setForm({ email: '', password: '', password2: '', name: '', class: '' })
    setError('')
    setSuccess('')
  }

  function changeTab(t: Tab) {
    setTab(t)
    resetForm()
  }

  // ── Connexion ──────────────────────────────────────────────────────────────
  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const isAdmin = form.email.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase()
      if (isAdmin) {
        await loginAdmin(form.email.trim(), form.password)
        navigate({ to: '/admin' })
      } else {
        await loginStudent(form.email.trim(), form.password)
        navigate({ to: '/student' })
      }
    } catch (err: any) {
      const code = err?.code ?? ''
      if (code === 'auth/user-not-found' || code === 'auth/invalid-credential') {
        setError('Compte introuvable. Vérifiez votre email ou créez un compte.')
      } else if (code === 'auth/wrong-password') {
        setError('Mot de passe incorrect.')
      } else if (code === 'auth/too-many-requests') {
        setError('Trop de tentatives. Veuillez réessayer dans quelques minutes.')
      } else {
        setError(err?.message ?? 'Erreur de connexion.')
      }
    } finally {
      setLoading(false)
    }
  }

  // ── Inscription ────────────────────────────────────────────────────────────
  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!form.name.trim() || !form.email.trim() || !form.class.trim()) {
      setError('Tous les champs sont obligatoires.')
      return
    }
    if (form.password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères.')
      return
    }
    if (form.password !== form.password2) {
      setError('Les mots de passe ne correspondent pas.')
      return
    }
    if (form.email.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
      setError('Cet email est réservé à l\'administration.')
      return
    }

    setLoading(true)
    try {
      await registerStudent(
        form.email.trim(),
        form.password,
        form.name.trim(),
        form.class.trim(),
      )
      navigate({ to: '/student' })
    } catch (err: any) {
      const code = err?.code ?? ''
      if (code === 'auth/email-already-in-use') {
        setError('Un compte existe déjà avec cet email. Connectez-vous.')
      } else if (code === 'auth/invalid-email') {
        setError('Adresse email invalide.')
      } else if (code === 'auth/weak-password') {
        setError('Mot de passe trop faible. Minimum 6 caractères.')
      } else {
        setError(err?.message ?? 'Erreur lors de la création du compte.')
      }
    } finally {
      setLoading(false)
    }
  }

  // ── Mot de passe oublié ────────────────────────────────────────────────────
  async function handleForgot(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSuccess('')
    if (!form.email.trim()) {
      setError('Veuillez saisir votre adresse email.')
      return
    }
    setLoading(true)
    try {
      await resetPassword(form.email.trim())
      setSuccess(
        `Un email de réinitialisation a été envoyé à ${form.email.trim()}. Vérifiez votre boîte de réception.`,
      )
      setForm((f) => ({ ...f, email: '' }))
    } catch (err: any) {
      const code = err?.code ?? ''
      if (code === 'auth/user-not-found') {
        setError('Aucun compte trouvé avec cet email.')
      } else {
        setError(err?.message ?? 'Erreur lors de l\'envoi de l\'email.')
      }
    } finally {
      setLoading(false)
    }
  }

  // ── UI ─────────────────────────────────────────────────────────────────────
  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-16"
      style={{ backgroundColor: '#f8f4e8' }}
    >
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div
            className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center font-bold text-xl border-2"
            style={{ backgroundColor: '#1a2a4a', color: '#c9a227', borderColor: '#c9a227' }}
          >
            SC
          </div>
          <h1 className="font-serif font-bold text-2xl" style={{ color: '#1a2a4a' }}>
            Espace Académique SCIRE
          </h1>
          <p className="text-sm text-gray-500 mt-1">Université de Kinshasa</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden" style={{ borderTop: '4px solid #c9a227' }}>

          {/* Tabs */}
          <div className="flex border-b" style={{ borderColor: '#ede8d5' }}>
            {([
              { key: 'login',    label: 'Connexion' },
              { key: 'register', label: 'Créer un compte' },
              { key: 'forgot',   label: 'Mot de passe oublié' },
            ] as { key: Tab; label: string }[]).map((t) => (
              <button
                key={t.key}
                onClick={() => changeTab(t.key)}
                className="flex-1 py-3 text-xs font-semibold transition-colors"
                style={{
                  backgroundColor: tab === t.key ? '#1a2a4a' : 'white',
                  color: tab === t.key ? '#c9a227' : '#888',
                }}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="p-6">
            {/* Erreur */}
            {error && (
              <div className="mb-4 p-3 rounded text-sm" style={{ backgroundColor: '#fee2e2', color: '#991b1b' }}>
                {error}
              </div>
            )}

            {/* Succès */}
            {success && (
              <div className="mb-4 p-3 rounded text-sm" style={{ backgroundColor: '#dcfce7', color: '#166534' }}>
                {success}
              </div>
            )}

            {/* ── Connexion ── */}
            {tab === 'login' && (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-gray-700">
                    Adresse email
                  </label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full border-2 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#1a2a4a]"
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
                    className="w-full border-2 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#1a2a4a]"
                    style={{ borderColor: '#ede8d5' }}
                    placeholder="••••••••"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-lg font-semibold text-sm disabled:opacity-60"
                  style={{ backgroundColor: '#1a2a4a', color: '#f8f4e8' }}
                >
                  {loading ? 'Connexion en cours…' : 'Se connecter'}
                </button>
                <button
                  type="button"
                  onClick={() => changeTab('forgot')}
                  className="w-full text-xs text-center py-1"
                  style={{ color: '#c9a227' }}
                >
                  Mot de passe oublié ?
                </button>
              </form>
            )}

            {/* ── Inscription ── */}
            {tab === 'register' && (
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
                    className="w-full border-2 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#1a2a4a]"
                    style={{ borderColor: '#ede8d5' }}
                    placeholder="Prénom NOM"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-gray-700">
                    Adresse email *
                  </label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full border-2 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#1a2a4a]"
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
                    className="w-full border-2 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#1a2a4a]"
                    style={{ borderColor: '#ede8d5' }}
                    placeholder="ex: Licence 3 Droit 2024-2025"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-gray-700">
                    Mot de passe * <span className="text-gray-400 font-normal">(min. 6 caractères)</span>
                  </label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="w-full border-2 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#1a2a4a]"
                    style={{ borderColor: '#ede8d5' }}
                    placeholder="••••••••"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-gray-700">
                    Confirmer le mot de passe *
                  </label>
                  <input
                    type="password"
                    required
                    value={form.password2}
                    onChange={(e) => setForm({ ...form, password2: e.target.value })}
                    className="w-full border-2 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#1a2a4a]"
                    style={{ borderColor: '#ede8d5' }}
                    placeholder="••••••••"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-lg font-semibold text-sm disabled:opacity-60"
                  style={{ backgroundColor: '#c9a227', color: '#1a2a4a' }}
                >
                  {loading ? 'Création en cours…' : 'Créer mon compte'}
                </button>
              </form>
            )}

            {/* ── Mot de passe oublié ── */}
            {tab === 'forgot' && (
              <form onSubmit={handleForgot} className="space-y-4">
                <p className="text-sm text-gray-600 mb-2">
                  Saisissez votre adresse email. Vous recevrez un lien pour réinitialiser votre mot de passe.
                </p>
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-gray-700">
                    Adresse email
                  </label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full border-2 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#1a2a4a]"
                    style={{ borderColor: '#ede8d5' }}
                    placeholder="votre@email.com"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-lg font-semibold text-sm disabled:opacity-60"
                  style={{ backgroundColor: '#1a2a4a', color: '#f8f4e8' }}
                >
                  {loading ? 'Envoi en cours…' : 'Envoyer le lien de réinitialisation'}
                </button>
                <button
                  type="button"
                  onClick={() => changeTab('login')}
                  className="w-full text-xs text-center py-1 text-gray-500"
                >
                  ← Retour à la connexion
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Note bas de page */}
        <p className="text-center text-xs text-gray-400 mt-6">
          Plateforme sécurisée Firebase · École SCIRE · Université de Kinshasa
        </p>
      </div>
    </div>
  )
}
