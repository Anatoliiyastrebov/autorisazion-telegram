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

  const handleTelegramAuth = (user: TelegramUser) => {
    console.log('Telegram auth received:', user)
    setTelegramUser(user)
    // Автоматически отправляем данные после авторизации
    handleSubmit(user)
  }

  const handleSubmit = async (user?: TelegramUser) => {
    const userToSubmit = user || telegramUser
    if (!userToSubmit) {
      setError('Пожалуйста, авторизуйтесь через Telegram')
      return
    }

    // Проверяем, что данные из реальной авторизации Telegram (есть hash)
    if (!userToSubmit.hash || userToSubmit.hash.trim() === '') {
      setError('Ошибка: данные не прошли проверку авторизации Telegram')
      setIsSubmitting(false)
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
          <p style={{ marginBottom: '1rem', color: '#666' }}>
            Авторизуйтесь через Telegram, чтобы отправить ваши данные. Мы свяжемся с вами в Telegram.
          </p>
          
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
                  Проверка данных и отправка...
                </p>
              )}
            </div>
          ) : (
            <div>
              <TelegramLogin
                botName={process.env.NEXT_PUBLIC_TELEGRAM_BOT_NAME || 'telega_automat_bot'}
                onAuth={handleTelegramAuth}
                buttonSize="large"
                cornerRadius={4}
                requestAccess={false}
                usePic={true}
              />
              <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#666', textAlign: 'center' }}>
                Нажмите кнопку выше, чтобы войти через Telegram
              </p>
              <p style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: '#999', textAlign: 'center' }}>
                Если вы открыли сайт из Telegram, авторизация произойдет автоматически
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

