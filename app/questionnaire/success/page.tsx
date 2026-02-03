'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Suspense } from 'react'

function SuccessContent() {
  const searchParams = useSearchParams()
  const username = searchParams.get('username') || ''
  const type = searchParams.get('type') || ''

  const questionnaireNames: Record<string, string> = {
    women: 'Женская анкета',
    men: 'Мужская анкета',
    basic: 'Базовая анкета',
    extended: 'Расширенная анкета',
  }

  const questionnaireName = questionnaireNames[type] || 'Анкета'

  return (
    <div className="container">
      <div className="card">
        <div className="success-message">
          <h2>Данные отправлены успешно!</h2>
          <p style={{ marginTop: '1rem' }}>
            Ваши данные успешно отправлены.
          </p>
          {username && (
            <p style={{ marginTop: '1rem' }}>
              Мы свяжемся с вами в Telegram:{' '}
              <a
                href={`https://t.me/${username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="telegram-link"
              >
                @{username}
              </a>
            </p>
          )}
        </div>
        <div style={{ marginTop: '2rem' }}>
          <Link href="/" className="button">
            Вернуться на главную
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="container">
        <div className="card">
          <p>Загрузка...</p>
        </div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  )
}

