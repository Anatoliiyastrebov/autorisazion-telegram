import Link from 'next/link'

export default function Home() {
  const questionnaires = [
    { path: '/questionnaire/women', name: 'Женская анкета' },
    { path: '/questionnaire/men', name: 'Мужская анкета' },
    { path: '/questionnaire/basic', name: 'Базовая анкета' },
    { path: '/questionnaire/extended', name: 'Расширенная анкета' },
  ]

  return (
    <div className="container">
      <div className="card">
        <h1>Выберите анкету</h1>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {questionnaires.map((q) => (
            <Link
              key={q.path}
              href={q.path}
              className="questionnaire-link"
            >
              {q.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

