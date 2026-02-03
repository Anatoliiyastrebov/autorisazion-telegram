'use client'

import { useState } from 'react'
import TelegramLogin, { TelegramUser } from './TelegramLogin'
import { useRouter } from 'next/navigation'

interface QuestionnaireFormProps {
  title: string
  questionnaireType: string
}

export default function QuestionnaireForm({
  title,
  questionnaireType,
}: QuestionnaireFormProps) {
  const router = useRouter()
  const [telegramUser, setTelegramUser] = useState<TelegramUser | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [simpleFormData, setSimpleFormData] = useState({
    username: '',
    first_name: '',
  })

  const handleTelegramAuth = (user: TelegramUser) => {
    console.log('Telegram auth received:', user)
    setTelegramUser(user)
    // Автоматически отправляем данные после авторизации
    handleSubmit(user)
  }

  const handleSimpleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!simpleFormData.first_name.trim()) {
      setError('Пожалуйста, введите ваше имя')
      return
    }

    if (!simpleFormData.username.trim()) {
      setError('Пожалуйста, введите ваш Telegram username (без @)')
      return
    }

    setIsSubmitting(true)
    setError(null)

    // Создаем объект пользователя из простой формы
    const user: TelegramUser = {
      id: Date.now(), // Временный ID
      first_name: simpleFormData.first_name.trim(),
      username: simpleFormData.username.trim().replace('@', ''),
      auth_date: Math.floor(Date.now() / 1000),
      hash: '', // Пустой hash для простой формы
    }

    await handleSubmit(user)
  }

  const handleSubmit = async (user?: TelegramUser) => {
    const userToSubmit = user || telegramUser
    if (!userToSubmit) {
      setError('Пожалуйста, заполните форму')
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          questionnaireType,
          telegram: {
            id: userToSubmit.id,
            username: userToSubmit.username,
            first_name: userToSubmit.first_name,
            last_name: userToSubmit.last_name,
            photo_url: userToSubmit.photo_url,
            auth_date: userToSubmit.auth_date,
            hash: userToSubmit.hash,
          },
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Ошибка при отправке данных')
      }

      const data = await response.json()
      router.push(
        `/questionnaire/success?username=${encodeURIComponent(
          userToSubmit.username || ''
        )}&type=${encodeURIComponent(questionnaireType)}`
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Произошла ошибка')
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container">
      <div className="card">
        <h1>{title}</h1>

        {error && <div className="error-message">{error}</div>}

        <div className="form-group" style={{ marginTop: '2rem' }}>
          <h2>Авторизация через Telegram</h2>
          
          {telegramUser ? (
            <div style={{ padding: '1rem', background: '#e7f3ff', borderRadius: '4px' }}>
              <p style={{ marginBottom: '0.5rem' }}>
                <strong>Авторизован:</strong> {telegramUser.first_name}
                {telegramUser.last_name && ` ${telegramUser.last_name}`}
              </p>
              {telegramUser.username && (
                <p>
                  <strong>Telegram:</strong>{' '}
                  <a
                    href={`https://t.me/${telegramUser.username}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="telegram-link"
                  >
                    @{telegramUser.username}
                  </a>
                </p>
              )}
              {isSubmitting && (
                <p style={{ marginTop: '1rem', color: '#666' }}>
                  Отправка данных...
                </p>
              )}
            </div>
          ) : (
            <form onSubmit={handleSimpleFormSubmit}>
              <p style={{ marginBottom: '1rem', color: '#666' }}>
                Заполните форму, чтобы отправить ваши данные. Мы свяжемся с вами в Telegram.
              </p>
              
              <div style={{ marginBottom: '1rem' }}>
                <label htmlFor="first_name" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
                  Ваше имя <span style={{ color: 'red' }}>*</span>
                </label>
                <input
                  type="text"
                  id="first_name"
                  value={simpleFormData.first_name}
                  onChange={(e) => setSimpleFormData({ ...simpleFormData, first_name: e.target.value })}
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '1rem',
                  }}
                  placeholder="Введите ваше имя"
                />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label htmlFor="username" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
                  Telegram username <span style={{ color: 'red' }}>*</span>
                </label>
                <input
                  type="text"
                  id="username"
                  value={simpleFormData.username}
                  onChange={(e) => setSimpleFormData({ ...simpleFormData, username: e.target.value })}
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '1rem',
                  }}
                  placeholder="username (без @)"
                />
                <p style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: '#666' }}>
                  Введите ваш Telegram username без символа @. Например: если ваш username @ivanov, введите: ivanov
                </p>
              </div>
              <button
                type="submit"
                className="button"
                disabled={isSubmitting}
                style={{ width: '100%' }}
              >
                {isSubmitting ? 'Отправка...' : 'Отправить данные'}
              </button>
              
              {/* Автоматическая авторизация через Web App (если открыто из Telegram) */}
              <div style={{ marginTop: '1.5rem' }}>
                <TelegramLogin
                  botName={process.env.NEXT_PUBLIC_TELEGRAM_BOT_NAME || 'telega_automat_bot'}
                  onAuth={handleTelegramAuth}
                  buttonSize="large"
                  cornerRadius={4}
                  requestAccess={false}
                  usePic={true}
                />
                <p style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: '#999', textAlign: 'center' }}>
                  Если вы открыли сайт из Telegram, авторизация произойдет автоматически
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

