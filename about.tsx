import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/about')({
  component: AboutPage,
})

function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl">🏛️</span>
          <h1 className="text-3xl font-serif font-bold" style={{ color: '#1a2a4a' }}>
            À Propos de l'École SCIRE
          </h1>
        </div>
        <div className="h-0.5 mt-4 w-16 rounded" style={{ backgroundColor: '#c9a227' }} />
      </div>

      {/* Mission & History */}
      <section className="mb-12">
        <div className="grid md:grid-cols-2 gap-8">
          <div
            className="rounded-lg p-6"
            style={{ backgroundColor: '#1a2a4a', color: '#f8f4e8' }}
          >
            <h2 className="font-serif font-bold text-xl mb-4" style={{ color: '#c9a227' }}>
              Notre Histoire
            </h2>
            <p className="text-sm leading-relaxed text-white/80 mb-4">
              L'École SCIRE (Sciences — Culture — Intelligence — Recherche — Éducation) a été fondée
              au sein de l'Université de Kinshasa avec la mission d'offrir une formation académique
              rigoureuse, pluridisciplinaire et ancrée dans les réalités juridiques et sociales
              de la République Démocratique du Congo.
            </p>
            <p className="text-sm leading-relaxed text-white/80">
              Depuis sa création, l'École SCIRE s'est imposée comme un pôle d'excellence dans
              l'enseignement du droit, notamment du droit international humanitaire, du droit
              pénal militaire et des procédures pénales applicables aux conflits armés.
            </p>
          </div>

          <div
            className="rounded-lg p-6"
            style={{ backgroundColor: 'white', borderTop: '3px solid #c9a227' }}
          >
            <h2 className="font-serif font-bold text-xl mb-4" style={{ color: '#1a2a4a' }}>
              Notre Mission
            </h2>
            <ul className="space-y-3 text-sm text-gray-700">
              {[
                'Former des juristes compétents, éthiques et engagés dans la promotion de l\'État de droit',
                'Produire et diffuser des recherches scientifiques de qualité en droit',
                'Contribuer au développement du droit international humanitaire en Afrique centrale',
                'Offrir un accès libre et démocratique au savoir académique',
                'Développer des partenariats avec les institutions nationales et internationales',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span style={{ color: '#c9a227' }}>◆</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Interdisciplinary Vision */}
      <section className="mb-12">
        <h2
          className="font-serif font-bold text-2xl mb-6 pb-2 border-b"
          style={{ color: '#1a2a4a', borderColor: '#c9a227' }}
        >
          Vision Interdisciplinaire
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: '⚖️',
              title: 'Droit International Humanitaire',
              desc: 'Enseignement approfondi des règles régissant les conflits armés, la protection des civils et les principes de la guerre.',
            },
            {
              icon: '🛡️',
              title: 'Droit Pénal Militaire',
              desc: 'Formation spécialisée en procédure pénale militaire, justice transitionnelle et droit des conflits armés non internationaux.',
            },
            {
              icon: '🌍',
              title: 'Droit International et Comparé',
              desc: 'Analyse comparative des systèmes juridiques africains et mondiaux, traités internationaux et jurisprudence des juridictions pénales internationales.',
            },
            {
              icon: '📜',
              title: 'Droits de l\'Homme',
              desc: 'Protection internationale des droits fondamentaux, mécanismes de plainte et responsabilité des États et acteurs non étatiques.',
            },
            {
              icon: '🔬',
              title: 'Recherche Juridique',
              desc: 'Méthodologie de la recherche en sciences juridiques, rédaction académique, publication scientifique et diffusion du savoir.',
            },
            {
              icon: '🎓',
              title: 'Formation Continue',
              desc: 'Programmes de perfectionnement pour professionnels du droit, magistrats, avocats, officiers des forces armées et agents de l\'État.',
            },
          ].map((item) => (
            <div
              key={item.title}
              className="bg-white rounded-lg p-5 shadow-sm"
              style={{ borderTop: '3px solid #c9a227' }}
            >
              <div className="text-3xl mb-3">{item.icon}</div>
              <h3 className="font-serif font-semibold mb-2" style={{ color: '#1a2a4a' }}>
                {item.title}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Prof. MASAMANKI IZIRI Biography */}
      <section
        className="rounded-xl overflow-hidden shadow-lg"
        style={{ backgroundColor: '#1a2a4a' }}
      >
        <div
          className="px-6 py-4"
          style={{ backgroundColor: '#c9a227' }}
        >
          <h2 className="font-serif font-bold text-xl" style={{ color: '#1a2a4a' }}>
            Biographie — Prof. MASAMANKI IZIRI
          </h2>
          <p className="text-sm font-medium" style={{ color: '#1a2a4a99' }}>
            Directeur de l'École SCIRE
          </p>
        </div>

        <div className="p-6 md:p-8 text-white/85">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Photo placeholder */}
            <div className="flex-shrink-0 flex flex-col items-center">
              <div
                className="w-40 h-48 rounded-lg flex items-center justify-center text-5xl border-2"
                style={{ backgroundColor: '#243660', borderColor: '#c9a227' }}
              >
                👨‍🎓
              </div>
              <div className="mt-3 text-center">
                <div className="font-semibold text-sm" style={{ color: '#c9a227' }}>
                  Prof. MASAMANKI IZIRI
                </div>
                <div className="text-xs text-white/60 mt-1">Docteur en Droit</div>
                <div className="text-xs text-white/60">Université de Kinshasa</div>
              </div>
            </div>

            {/* Bio text */}
            <div className="flex-1 space-y-4 text-sm leading-relaxed">
              <p>
                <strong className="text-[#c9a227]">Le Professeur MASAMANKI IZIRI</strong> est Docteur en Droit
                de l'Université de Kinshasa (Unikin), institution au sein de laquelle il a accompli l'intégralité
                de sa formation académique supérieure. Il est reconnu comme l'une des figures majeures de
                l'enseignement juridique en République Démocratique du Congo.
              </p>

              <p>
                Spécialiste de renommée nationale et internationale en <strong className="text-[#c9a227]">Droit
                International Humanitaire (DIH)</strong>, il a consacré ses travaux de recherche à l'étude
                des règles régissant les conflits armés, la protection des populations civiles, et la responsabilité
                pénale internationale des combattants et chefs militaires.
              </p>

              <p>
                Dans le domaine de la <strong className="text-[#c9a227]">procédure pénale militaire</strong>,
                le Professeur MASAMANKI IZIRI a développé une expertise unique en RDC, portant sur les juridictions
                militaires congolaises, les garanties du procès équitable en temps de guerre, et l'articulation
                entre droit militaire interne et obligations internationales de l'État congolais.
              </p>

              <p>
                Il est l'auteur de nombreuses publications scientifiques, articles de revues juridiques
                et contributions à des ouvrages collectifs sur le droit des conflits armés, la justice
                transitionnelle et les droits de l'homme en Afrique subsaharienne. Ses travaux ont contribué
                au développement de la doctrine juridique congolaise et africaine.
              </p>

              <p>
                En tant que <strong className="text-[#c9a227]">Directeur de l'École SCIRE</strong>, le
                Professeur MASAMANKI IZIRI supervise les programmes académiques, encadre les étudiants
                en licence, master et doctorat, et dirige les travaux de recherche de l'institution. Il
                est également membre de plusieurs commissions scientifiques nationales et participe
                activement aux débats académiques sur la réforme du droit en RDC.
              </p>

              <div
                className="rounded-lg p-4 italic"
                style={{ backgroundColor: '#243660', borderLeft: '4px solid #c9a227' }}
              >
                "La science du droit, lorsqu'elle s'inscrit dans une démarche rigoureuse et humaniste,
                devient un outil de justice, de paix et de dignité pour toutes les nations."
                <span className="block mt-2 text-xs font-semibold not-italic" style={{ color: '#c9a227' }}>
                  — Prof. MASAMANKI IZIRI
                </span>
              </div>

              {/* Credentials */}
              <div className="grid md:grid-cols-2 gap-4 pt-2">
                {[
                  { label: 'Diplôme', value: 'Doctorat en Droit' },
                  { label: 'Institution', value: 'Université de Kinshasa (Unikin)' },
                  { label: 'Spécialité principale', value: 'Droit International Humanitaire' },
                  { label: 'Domaine complémentaire', value: 'Procédure Pénale Militaire' },
                  { label: 'Localisation', value: 'Kinshasa, RDC' },
                  { label: 'Fonction', value: 'Directeur, École SCIRE' },
                ].map((item) => (
                  <div key={item.label} className="text-xs">
                    <span className="text-white/50">{item.label} : </span>
                    <span className="font-medium text-white/90">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
