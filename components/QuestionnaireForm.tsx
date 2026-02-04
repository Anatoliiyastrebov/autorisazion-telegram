'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import TelegramLogin, { TelegramUser } from './TelegramLogin'

interface QuestionnaireFormProps {
  title: string
  questionnaireType: string
}

// Вопросы для разных типов анкет
const questionnaireQuestions: Record<string, Array<{ id: string; label: string; type: 'text' | 'textarea' | 'number' | 'select'; options?: string[] }>> = {
  women: [
    { id: 'first_name', label: 'Имя', type: 'text' },
    { id: 'last_name', label: 'Фамилия', type: 'text' },
    { id: 'height', label: 'Рост (см)', type: 'number' },
    { id: 'weight', label: 'Вес (кг)', type: 'number' },
  ],
  men: [
    { id: 'first_name', label: 'Имя', type: 'text' },
    { id: 'last_name', label: 'Фамилия', type: 'text' },
    { id: 'height', label: 'Рост (см)', type: 'number' },
    { id: 'weight', label: 'Вес (кг)', type: 'number' },
  ],
  basic: [
    { id: 'first_name', label: 'Имя', type: 'text' },
    { id: 'last_name', label: 'Фамилия', type: 'text' },
    { id: 'height', label: 'Рост (см)', type: 'number' },
    { id: 'weight', label: 'Вес (кг)', type: 'number' },
  ],
  extended: [
    { id: 'first_name', label: 'Имя', type: 'text' },
    { id: 'last_name', label: 'Фамилия', type: 'text' },
    { id: 'height', label: 'Рост (см)', type: 'number' },
    { id: 'weight', label: 'Вес (кг)', type: 'number' },
  ],
}

export default function QuestionnaireForm({
  title,
  questionnaireType,
}: QuestionnaireFormProps) {
  const router = useRouter()
  const questions = questionnaireQuestions[questionnaireType] || []
  
  // Логирование для отладки
  useEffect(() => {
    console.log('📋 QuestionnaireForm loaded:', {
      questionnaireType,
      questionsCount: questions.length,
      questions: questions
    })
  }, [questionnaireType, questions.length])
  
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [telegramUser, setTelegramUser] = useState<TelegramUser | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Получаем имя бота из переменных окружения
  const [botName, setBotName] = useState<string>('')
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setBotName(process.env.NEXT_PUBLIC_TELEGRAM_BOT_NAME || '')
    }
  }, [])

  // Обработчик успешной авторизации через Telegram Login Widget
  const handleTelegramAuth = (user: TelegramUser) => {
    console.log('✅ Telegram авторизация успешна:', user)
    setTelegramUser(user)
    setError(null)
    
    // Автоматически заполняем имя и фамилию из Telegram
    setAnswers(prev => {
      const newAnswers = { ...prev }
      if (user.first_name && !newAnswers.first_name) {
        newAnswers.first_name = user.first_name
      }
      if (user.last_name && !newAnswers.last_name) {
        newAnswers.last_name = user.last_name
      }
      return newAnswers
    })
  }



  const handleInputChange = (questionId: string, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }))
  }

  const handleSubmit = async () => {
    // Проверяем, что все вопросы заполнены
    const unansweredQuestions = questions.filter((q) => !answers[q.id] || answers[q.id].trim() === '')
    if (unansweredQuestions.length > 0) {
      setError('Пожалуйста, заполните все вопросы')
      return
    }

    // Проверяем, что пользователь авторизован через Telegram
    if (!telegramUser) {
      setError('Пожалуйста, авторизуйтесь через Telegram перед отправкой анкеты')
      return
    }

    setIsSubmitting(true)
    setError(null)

    console.log('🟡 Submitting questionnaire data...', {
      questionnaireType,
      answers,
      userId: telegramUser.id,
      username: telegramUser.username,
    })

    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          questionnaireType,
          answers: answers || {},
          telegram: {
            id: telegramUser.id,
            username: telegramUser.username,
            first_name: telegramUser.first_name,
            last_name: telegramUser.last_name || undefined,
            photo_url: telegramUser.photo_url || undefined,
            auth_date: telegramUser.auth_date || Math.floor(Date.now() / 1000),
            hash: telegramUser.hash || '',
            initData: telegramUser.initData || '',
          },
        }),
      })

      console.log('🟡 API response status:', response.status)

      if (!response.ok) {
        const errorData = await response.json()
        console.error('❌ API error:', errorData)
        throw new Error(errorData.error || 'Ошибка при отправке данных')
      }

      const data = await response.json()
      console.log('✅ API success:', data)
      
      router.push(
        `/questionnaire/success?username=${encodeURIComponent(
          telegramUser.username || ''
        )}&type=${encodeURIComponent(questionnaireType)}`
      )
    } catch (err) {
      console.error('❌ Submit error:', err)
      setError(err instanceof Error ? err.message : 'Произошла ошибка')
      setIsSubmitting(false)
    }
  }


  return (
    <>
      <div className="container">
        <div className="card">
          <h1>{title}</h1>

          {error && <div className="error-message">{error}</div>}

          {/* Вопросы анкеты - все на одной странице */}
          {questions.length > 0 ? (
            <div style={{ marginTop: '2rem' }}>
              <h2 style={{ marginBottom: '1.5rem' }}>Заполните анкету</h2>
              {questions.map((question) => (
                <div key={question.id} className="form-group" style={{ marginBottom: '1.5rem' }}>
                  <label htmlFor={question.id}>
                    {question.label}
                    {!answers[question.id] && <span style={{ color: 'red' }}> *</span>}
                  </label>
                  
                  {question.type === 'number' ? (
                    <input
                      id={question.id}
                      type="number"
                      value={answers[question.id] || ''}
                      onChange={(e) => handleInputChange(question.id, e.target.value)}
                      required
                    />
                  ) : (
                    <input
                      id={question.id}
                      type="text"
                      value={answers[question.id] || ''}
                      onChange={(e) => handleInputChange(question.id, e.target.value)}
                      required
                    />
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div style={{ marginTop: '2rem', padding: '2rem', background: '#fff3cd', borderRadius: '8px', textAlign: 'center' }}>
              <p style={{ color: '#856404', margin: 0, fontWeight: 500 }}>
                ⚠️ Вопросы анкеты не загружены
              </p>
              <p style={{ color: '#856404', marginTop: '0.5rem', fontSize: '0.9rem' }}>
                Тип анкеты: <strong>{questionnaireType}</strong>
              </p>
              <p style={{ color: '#856404', marginTop: '0.5rem', fontSize: '0.85rem' }}>
                Доступные типы: {Object.keys(questionnaireQuestions).join(', ')}
              </p>
            </div>
          )}

          {/* Статус авторизации Telegram */}
          {telegramUser && (
            <div className="form-group" style={{ marginTop: '2rem', padding: '1rem', background: '#d4edda', borderRadius: '8px', border: '1px solid #c3e6cb' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '1.2rem' }}>✅</span>
                <strong style={{ color: '#155724', fontSize: '1rem' }}>Telegram подтверждён:</strong>
              </div>
              {telegramUser.username ? (
                <a
                  href={`https://t.me/${telegramUser.username}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="telegram-link"
                  style={{ 
                    fontSize: '1.1rem', 
                    fontWeight: 500,
                    color: '#0088cc',
                    textDecoration: 'none'
                  }}
                >
                  @{telegramUser.username}
                </a>
              ) : (
                <span style={{ color: '#666', fontSize: '1rem' }}>
                  ID: {telegramUser.id} (username не указан)
                </span>
              )}
            </div>
          )}

          {/* Блок авторизации через Telegram Login Widget */}
          {!telegramUser && (
            <div className="form-group" style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid #e0e0e0' }}>
              <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Авторизация через Telegram</h2>
              <p style={{ marginBottom: '1.5rem', fontSize: '0.95rem', color: '#666', textAlign: 'center' }}>
                Для отправки анкеты необходимо авторизоваться через Telegram. Нажмите кнопку ниже.
              </p>
              {botName ? (
                <TelegramLogin
                  botName={botName}
                  onAuth={handleTelegramAuth}
                  buttonSize="large"
                  requestAccess={false}
                />
              ) : (
                <div style={{ padding: '1rem', background: '#fff3cd', borderRadius: '8px', color: '#856404', textAlign: 'center' }}>
                  ⚠️ Ошибка: имя бота не настроено. Проверьте переменную окружения NEXT_PUBLIC_TELEGRAM_BOT_NAME
                </div>
              )}
            </div>
          )}

          {/* Кнопка отправки */}
          {questions.length > 0 && (
            <div style={{ marginTop: '2rem' }}>
              {telegramUser ? (
                <button
                  className="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting || questions.some(q => !answers[q.id] || answers[q.id].trim() === '')}
                  style={{ width: '100%', fontSize: '1.1rem', padding: '1rem' }}
                >
                  {isSubmitting ? 'Отправка...' : 'Отправить анкету'}
                </button>
              ) : (
                <div style={{ padding: '1rem', background: '#fff3cd', borderRadius: '8px', textAlign: 'center' }}>
                  <p style={{ color: '#856404', margin: 0, fontWeight: 500 }}>
                    ⚠️ Для отправки анкеты необходимо авторизоваться через Telegram
                  </p>
                  <p style={{ color: '#856404', marginTop: '0.5rem', fontSize: '0.9rem' }}>
                    Нажмите кнопку "Войти через Telegram" выше
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
