'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface TelegramUser {
  id: number
  first_name: string
  last_name?: string
  username?: string
  photo_url?: string
  auth_date: number
  hash: string
  initData?: string
}

interface QuestionnaireFormProps {
  title: string
  questionnaireType: string
}

// Вопросы для разных типов анкет
const questionnaireQuestions: Record<string, Array<{ id: string; label: string; type: 'text' | 'textarea' | 'number' | 'select'; options?: string[] }>> = {
  baby: [
    { id: 'first_name', label: 'Имя', type: 'text' },
    { id: 'last_name', label: 'Фамилия', type: 'text' },
    { id: 'age', label: 'Возраст (месяцы)', type: 'number' },
    { id: 'date_of_birth', label: 'Дата рождения', type: 'text' },
    { id: 'phone', label: 'Телефон родителя', type: 'text' },
    { id: 'address', label: 'Адрес проживания', type: 'textarea' },
    { id: 'parent_name', label: 'Имя родителя/опекуна', type: 'text' },
  ],
  child: [
    { id: 'first_name', label: 'Имя', type: 'text' },
    { id: 'last_name', label: 'Фамилия', type: 'text' },
    { id: 'age', label: 'Возраст (лет)', type: 'number' },
    { id: 'date_of_birth', label: 'Дата рождения', type: 'text' },
    { id: 'phone', label: 'Телефон', type: 'text' },
    { id: 'address', label: 'Адрес проживания', type: 'textarea' },
    { id: 'school', label: 'Школа/Учебное заведение', type: 'text' },
    { id: 'parent_name', label: 'Имя родителя/опекуна', type: 'text' },
  ],
  women: [
    { id: 'first_name', label: 'Имя', type: 'text' },
    { id: 'last_name', label: 'Фамилия', type: 'text' },
    { id: 'age', label: 'Возраст', type: 'number' },
    { id: 'date_of_birth', label: 'Дата рождения', type: 'text' },
    { id: 'phone', label: 'Телефон', type: 'text' },
    { id: 'email', label: 'Email', type: 'text' },
    { id: 'address', label: 'Адрес проживания', type: 'textarea' },
    { id: 'height', label: 'Рост (см)', type: 'number' },
    { id: 'weight', label: 'Вес (кг)', type: 'number' },
  ],
  men: [
    { id: 'first_name', label: 'Имя', type: 'text' },
    { id: 'last_name', label: 'Фамилия', type: 'text' },
    { id: 'age', label: 'Возраст', type: 'number' },
    { id: 'date_of_birth', label: 'Дата рождения', type: 'text' },
    { id: 'phone', label: 'Телефон', type: 'text' },
    { id: 'email', label: 'Email', type: 'text' },
    { id: 'address', label: 'Адрес проживания', type: 'textarea' },
    { id: 'height', label: 'Рост (см)', type: 'number' },
    { id: 'weight', label: 'Вес (кг)', type: 'number' },
  ],
}

export default function QuestionnaireForm({ title, questionnaireType }: QuestionnaireFormProps) {
  const router = useRouter()
  const questions = questionnaireQuestions[questionnaireType] || []
  
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [telegramUser, setTelegramUser] = useState<TelegramUser | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Загружаем данные пользователя при загрузке
  useEffect(() => {
    if (typeof window === 'undefined') return

    const savedUser = localStorage.getItem('telegram_user')
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser)
        if (user.id && user.first_name) {
          // Проверяем, что данные не устарели
          if (user.auth_date) {
            const currentTime = Math.floor(Date.now() / 1000)
            if (currentTime - user.auth_date > 86400) {
              console.log('⚠️ Данные устарели')
              localStorage.removeItem('telegram_user')
              router.push('/')
              return
            }
          }
          
          setTelegramUser(user)
          
          // Автозаполнение данных из Telegram
          setAnswers(prev => {
            const newAnswers = { ...prev }
            if (user.first_name && !newAnswers.first_name) {
              newAnswers.first_name = user.first_name
            }
            if (user.last_name && !newAnswers.last_name) {
              newAnswers.last_name = user.last_name || ''
            }
            return newAnswers
          })
        } else {
          // Нет данных - перенаправляем на главную для авторизации
          router.push('/')
        }
      } catch (e) {
        console.error('❌ Ошибка при парсинге данных:', e)
        localStorage.removeItem('telegram_user')
        router.push('/')
      }
    } else {
      // Не авторизован - перенаправляем на главную
      router.push('/')
    }
    
    setIsLoading(false)
  }, [router])

  const handleInputChange = (questionId: string, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }))
  }

  const handleSubmit = async () => {
    if (!telegramUser) {
      setError('Ошибка авторизации. Вернитесь на главную страницу.')
      return
    }

    // Проверяем заполнение всех полей
    const unansweredQuestions = questions.filter((q) => !answers[q.id] || answers[q.id].trim() === '')
    if (unansweredQuestions.length > 0) {
      setError('Пожалуйста, заполните все поля')
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionnaireType,
          answers,
          telegram: {
            id: telegramUser.id,
            username: telegramUser.username,
            first_name: telegramUser.first_name,
            last_name: telegramUser.last_name,
            photo_url: telegramUser.photo_url,
            auth_date: telegramUser.auth_date,
            hash: telegramUser.hash,
            initData: telegramUser.initData,
          },
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Ошибка при отправке')
      }

      router.push(
        `/questionnaire/success?username=${encodeURIComponent(
          telegramUser.username || ''
        )}&type=${encodeURIComponent(questionnaireType)}`
      )
    } catch (err) {
      console.error('❌ Ошибка:', err)
      setError(err instanceof Error ? err.message : 'Произошла ошибка')
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container">
        <div className="card">
          <h1>{title}</h1>
          <p style={{ color: '#666', textAlign: 'center', marginTop: '1rem' }}>
            Загрузка...
          </p>
        </div>
      </div>
    )
  }

  if (!telegramUser) {
    return (
      <div className="container">
        <div className="card">
          <h1>{title}</h1>
          <p style={{ color: '#666', textAlign: 'center', marginTop: '1rem' }}>
            Перенаправление на авторизацию...
          </p>
        </div>
      </div>
    )
  }

  const allFieldsFilled = questions.every(q => answers[q.id] && answers[q.id].trim() !== '')

  return (
    <div className="container">
      <div className="card">
        <h1 style={{ marginBottom: '1.5rem' }}>{title}</h1>

        {error && (
          <div style={{ 
            padding: '1rem', 
            background: '#f8d7da', 
            borderRadius: '8px', 
            color: '#721c24',
            marginBottom: '1.5rem'
          }}>
            {error}
          </div>
        )}

        {/* Статус авторизации */}
        <div style={{ 
          padding: '1rem', 
          background: '#d4edda', 
          borderRadius: '8px',
          border: '1px solid #c3e6cb',
          marginBottom: '2rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem'
        }}>
          <span style={{ fontSize: '1.25rem' }}>✅</span>
          <div>
            <p style={{ color: '#155724', fontWeight: 600, margin: 0, fontSize: '0.95rem' }}>
              Авторизация пройдена
            </p>
            <p style={{ color: '#155724', fontSize: '0.85rem', margin: '0.25rem 0 0 0' }}>
              {telegramUser.username ? `@${telegramUser.username}` : `${telegramUser.first_name} ${telegramUser.last_name || ''}`}
            </p>
          </div>
        </div>

        {/* Форма анкеты */}
        <div style={{ marginBottom: '2rem' }}>
          <p style={{ color: '#666', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
            Данные из Telegram заполнены автоматически. Проверьте и дополните информацию.
          </p>
          
          {questions.map((question) => (
            <div key={question.id} style={{ marginBottom: '1.5rem' }}>
              <label 
                htmlFor={question.id}
                style={{ 
                  display: 'block', 
                  marginBottom: '0.5rem', 
                  fontWeight: 500,
                  color: '#333'
                }}
              >
                {question.label}
                {!answers[question.id] && <span style={{ color: 'red' }}> *</span>}
              </label>
              
              {question.type === 'textarea' ? (
                <textarea
                  id={question.id}
                  value={answers[question.id] || ''}
                  onChange={(e) => handleInputChange(question.id, e.target.value)}
                  rows={3}
                  style={{ 
                    width: '100%', 
                    padding: '0.75rem', 
                    fontSize: '1rem', 
                    border: '1px solid #ddd', 
                    borderRadius: '6px',
                    fontFamily: 'inherit',
                    resize: 'vertical'
                  }}
                />
              ) : (
                <input
                  id={question.id}
                  type={question.type === 'number' ? 'number' : 'text'}
                  value={answers[question.id] || ''}
                  onChange={(e) => handleInputChange(question.id, e.target.value)}
                  style={{ 
                    width: '100%', 
                    padding: '0.75rem', 
                    fontSize: '1rem', 
                    border: '1px solid #ddd', 
                    borderRadius: '6px'
                  }}
                />
              )}
            </div>
          ))}
        </div>

        {/* Кнопка отправки */}
        <button
          onClick={handleSubmit}
          disabled={isSubmitting || !allFieldsFilled}
          style={{
            width: '100%',
            padding: '1rem',
            fontSize: '1.1rem',
            fontWeight: 600,
            background: isSubmitting || !allFieldsFilled ? '#ccc' : '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: isSubmitting || !allFieldsFilled ? 'not-allowed' : 'pointer'
          }}
        >
          {isSubmitting ? '⏳ Отправка...' : '📤 Отправить анкету'}
        </button>
        
        <p style={{ 
          marginTop: '1rem', 
          fontSize: '0.85rem', 
          color: '#666', 
          textAlign: 'center' 
        }}>
          Анкета будет отправлена в группу Telegram
        </p>

        {/* Ссылка назад */}
        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <a
            href="/"
            style={{
              color: '#0088cc',
              textDecoration: 'none',
              fontSize: '0.95rem'
            }}
          >
            ← Вернуться к списку анкет
          </a>
        </div>
      </div>
    </div>
  )
}
