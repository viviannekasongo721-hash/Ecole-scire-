import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'

export const Route = createFileRoute('/contact')({
  component: ContactPage,
})

function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const messages = JSON.parse(localStorage.getItem('scire_contact_messages') || '[]')
    messages.push({ ...form, id: Date.now(), createdAt: new Date().toISOString() })
    localStorage.setItem('scire_contact_messages', JSON.stringify(messages))
    setSubmitted(true)
    setForm({ name: '', email: '', subject: '', message: '' })
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl">✉️</span>
          <h1 className="text-3xl font-serif font-bold" style={{ color: '#1a2a4a' }}>
            Nous Contacter
          </h1>
        </div>
        <div className="h-0.5 mt-4 w-16 rounded" style={{ backgroundColor: '#c9a227' }} />
      </div>

      <div className="grid md:grid-cols-2 gap-10">
        {/* Contact Form */}
        <div>
          <h2 className="font-serif font-semibold text-xl mb-5" style={{ color: '#1a2a4a' }}>
            Envoyer un Message
          </h2>

          {submitted ? (
            <div
              className="rounded-lg p-6 text-center"
              style={{ backgroundColor: '#ede8d5', borderTop: '3px solid #c9a227' }}
            >
              <div className="text-4xl mb-3">✅</div>
              <h3 className="font-serif font-bold mb-2" style={{ color: '#1a2a4a' }}>
                Message Enregistré !
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Votre message a été enregistré. L'équipe de l'École SCIRE vous répondra dans
                les plus brefs délais.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="text-sm font-medium px-4 py-2 rounded"
                style={{ backgroundColor: '#1a2a4a', color: '#f8f4e8' }}
              >
                Envoyer un autre message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5 text-gray-700">
                  Nom complet *
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full border-2 rounded-lg px-4 py-2.5 text-sm focus:outline-none transition-colors"
                  style={{ borderColor: '#ede8d5' }}
                  placeholder="Votre nom complet"
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
                  className="w-full border-2 rounded-lg px-4 py-2.5 text-sm focus:outline-none transition-colors"
                  style={{ borderColor: '#ede8d5' }}
                  placeholder="votre@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5 text-gray-700">
                  Objet *
                </label>
                <select
                  required
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  className="w-full border-2 rounded-lg px-4 py-2.5 text-sm focus:outline-none bg-white"
                  style={{ borderColor: '#ede8d5' }}
                >
                  <option value="">Sélectionner un objet</option>
                  <option value="inscription">Inscription et admissions</option>
                  <option value="resultats">Demande de résultats</option>
                  <option value="publication">Publication scientifique</option>
                  <option value="partenariat">Partenariat institutionnel</option>
                  <option value="information">Demande d'information générale</option>
                  <option value="autre">Autre</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5 text-gray-700">
                  Message *
                </label>
                <textarea
                  required
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  rows={5}
                  className="w-full border-2 rounded-lg px-4 py-2.5 text-sm focus:outline-none transition-colors resize-none"
                  style={{ borderColor: '#ede8d5' }}
                  placeholder="Votre message..."
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-lg font-semibold text-sm transition-colors"
                style={{ backgroundColor: '#1a2a4a', color: '#f8f4e8' }}
              >
                Envoyer le Message
              </button>
            </form>
          )}
        </div>

        {/* Contact Info */}
        <div>
          <h2 className="font-serif font-semibold text-xl mb-5" style={{ color: '#1a2a4a' }}>
            Informations de Contact
          </h2>

          <div className="space-y-4">
            {[
              {
                icon: '📍',
                title: 'Adresse',
                lines: [
                  'École SCIRE',
                  'Campus de l\'Université de Kinshasa (Unikin)',
                  'Boulevard du 30 Juin, Commune de la Gombe',
                  'Kinshasa, République Démocratique du Congo',
                ],
              },
              {
                icon: '📞',
                title: 'Téléphone',
                lines: ['+243 810 000 000', '+243 820 000 000'],
              },
              {
                icon: '✉️',
                title: 'Email',
                lines: ['scire@unikin.ac.cd', 'direction.scire@unikin.ac.cd'],
              },
              {
                icon: '⏰',
                title: 'Horaires d\'Ouverture',
                lines: [
                  'Lundi – Vendredi : 8h00 – 17h00',
                  'Samedi : 9h00 – 13h00',
                  'Dimanche et jours fériés : Fermé',
                ],
              },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-white rounded-lg p-5 shadow-sm"
                style={{ borderLeft: '3px solid #c9a227' }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">{item.icon}</span>
                  <h3 className="font-semibold text-sm" style={{ color: '#1a2a4a' }}>
                    {item.title}
                  </h3>
                </div>
                <div className="pl-7 space-y-0.5">
                  {item.lines.map((line, i) => (
                    <p key={i} className="text-sm text-gray-600">{line}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
