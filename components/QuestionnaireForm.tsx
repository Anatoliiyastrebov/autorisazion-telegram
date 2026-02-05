'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { 
  getQuestionnaire, 
  getQuestionnaireTitle, 
  QuestionnaireSection, 
  Question,
  QuestionnaireTypeName,
  Language,
  getOptionLabel
} from '@/lib/questionnaires'

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

export default function QuestionnaireForm({ title, questionnaireType }: QuestionnaireFormProps) {
  const router = useRouter()
  const lang: Language = 'ru'
  const sections = getQuestionnaire(questionnaireType as QuestionnaireTypeName)
  const questionnaireTitle = getQuestionnaireTitle(questionnaireType as QuestionnaireTypeName, lang)
  
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({})
  const [additionalAnswers, setAdditionalAnswers] = useState<Record<string, string>>({})
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
          if (user.auth_date) {
            const currentTime = Math.floor(Date.now() / 1000)
            if (currentTime - user.auth_date > 86400) {
              localStorage.removeItem('telegram_user')
              router.push('/')
              return
            }
          }
          
          setTelegramUser(user)
          
          setAnswers(prev => {
            const newAnswers = { ...prev }
            if (user.first_name && !newAnswers.name) {
              newAnswers.name = user.first_name
            }
            if (user.last_name && !newAnswers.last_name) {
              newAnswers.last_name = user.last_name || ''
            }
            return newAnswers
          })
        } else {
          router.push('/')
        }
      } catch (e) {
        console.error('❌ Ошибка при парсинге данных:', e)
        localStorage.removeItem('telegram_user')
        router.push('/')
      }
    } else {
      router.push('/')
    }
    
    setIsLoading(false)
  }, [router])

  // Проверка условия показа вопроса
  const shouldShowQuestion = (question: Question): boolean => {
    if (!question.showIf) return true
    
    const { questionId, value } = question.showIf
    const answer = answers[questionId]
    
    if (Array.isArray(value)) {
      if (Array.isArray(answer)) {
        return value.some(v => answer.includes(v))
      }
      return value.includes(answer as string)
    }
    
    if (Array.isArray(answer)) {
      return answer.includes(value)
    }
    
    return answer === value
  }

  // Получаем все видимые вопросы с нумерацией
  const visibleQuestionsWithNumbers = useMemo(() => {
    let globalNumber = 0
    const result: Map<string, number> = new Map()
    
    for (const section of sections) {
      for (const question of section.questions) {
        if (shouldShowQuestion(question)) {
          globalNumber++
          result.set(question.id, globalNumber)
        }
      }
    }
    
    return result
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sections, answers])

  // Обработка radio
  const handleRadioChange = (questionId: string, value: string) => {
    setAnswers(prev => {
      const newAnswers = { ...prev, [questionId]: value }
      
      // Очищаем зависимые вопросы при изменении ответа
      for (const section of sections) {
        for (const q of section.questions) {
          if (q.showIf?.questionId === questionId && !shouldShowQuestionWithAnswer(q, newAnswers)) {
            delete newAnswers[q.id]
          }
        }
      }
      
      return newAnswers
    })
  }

  // Вспомогательная функция для проверки showIf с конкретными ответами
  const shouldShowQuestionWithAnswer = (question: Question, currentAnswers: Record<string, string | string[]>): boolean => {
    if (!question.showIf) return true
    
    const { questionId, value } = question.showIf
    const answer = currentAnswers[questionId]
    
    if (Array.isArray(value)) {
      if (Array.isArray(answer)) {
        return value.some(v => answer.includes(v))
      }
      return value.includes(answer as string)
    }
    
    if (Array.isArray(answer)) {
      return answer.includes(value)
    }
    
    return answer === value
  }

  // Обработка checkbox
  const handleCheckboxToggle = (questionId: string, value: string) => {
    setAnswers(prev => {
      const currentValues = (prev[questionId] as string[]) || []
      if (currentValues.includes(value)) {
        return { ...prev, [questionId]: currentValues.filter(v => v !== value) }
      } else {
        return { ...prev, [questionId]: [...currentValues, value] }
      }
    })
  }

  // Обработка text/number/textarea
  const handleInputChange = (questionId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }))
  }

  // Обработка дополнительного поля
  const handleAdditionalChange = (questionId: string, value: string) => {
    setAdditionalAnswers(prev => ({ ...prev, [questionId]: value }))
  }

  // Проверка checkbox
  const isChecked = (questionId: string, value: string): boolean => {
    const currentValues = answers[questionId]
    if (Array.isArray(currentValues)) {
      return currentValues.includes(value)
    }
    return false
  }

  // Проверка заполнения обязательных полей (только видимых)
  const isFormValid = (): boolean => {
    for (const section of sections) {
      for (const question of section.questions) {
        if (!shouldShowQuestion(question)) continue
        
        if (question.required) {
          const answer = answers[question.id]
          if (!answer || (Array.isArray(answer) && answer.length === 0) || (typeof answer === 'string' && answer.trim() === '')) {
            return false
          }
        }
      }
    }
    return true
  }

  const handleSubmit = async () => {
    if (!telegramUser) {
      setError('Ошибка авторизации. Вернитесь на главную страницу.')
      return
    }

    if (!isFormValid()) {
      setError('Пожалуйста, заполните все обязательные поля')
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      // Собираем только видимые вопросы
      const visibleAnswers: Record<string, string | string[]> = {}
      for (const section of sections) {
        for (const question of section.questions) {
          if (shouldShowQuestion(question) && answers[question.id] !== undefined) {
            visibleAnswers[question.id] = answers[question.id]
          }
        }
      }

      // Объединяем с дополнительными полями
      const combinedAnswers: Record<string, string | string[]> = { ...visibleAnswers }
      for (const [key, value] of Object.entries(additionalAnswers)) {
        if (value && value.trim()) {
          combinedAnswers[`${key}_additional`] = value
        }
      }

      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionnaireType,
          answers: combinedAnswers,
          sections, // Отправляем секции для получения лейблов
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

  // Иконки для секций
  const getSectionIcon = (icon: string): string => {
    const icons: Record<string, string> = {
      'user': '👤',
      'heart': '💚',
      'baby': '👶',
      'file-text': '📋',
    }
    return icons[icon] || '📝'
  }

  if (isLoading) {
    return (
      <div className="container">
        <div className="card">
          <h1>{questionnaireTitle || title}</h1>
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
          <h1>{questionnaireTitle || title}</h1>
          <p style={{ color: '#666', textAlign: 'center', marginTop: '1rem' }}>
            Перенаправление на авторизацию...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <div className="card">
        <h1 style={{ marginBottom: '1.5rem', color: '#2d7a4f', textAlign: 'center' }}>
          {questionnaireTitle || title}
        </h1>

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
          background: '#e8f5e9', 
          borderRadius: '12px',
          border: '1px solid #c3e6cb',
          marginBottom: '2rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem'
        }}>
          <span style={{ fontSize: '1.25rem' }}>✅</span>
          <div>
            <p style={{ color: '#2d7a4f', fontWeight: 600, margin: 0, fontSize: '0.95rem' }}>
              Авторизация пройдена
            </p>
            <p style={{ color: '#2d7a4f', fontSize: '0.85rem', margin: '0.25rem 0 0 0' }}>
              {telegramUser.username ? `@${telegramUser.username}` : `${telegramUser.first_name} ${telegramUser.last_name || ''}`}
            </p>
          </div>
        </div>

        {/* Секции анкеты */}
        {sections.map((section) => {
          // Проверяем, есть ли видимые вопросы в секции
          const visibleQuestions = section.questions.filter(q => shouldShowQuestion(q))
          if (visibleQuestions.length === 0) return null
          
          return (
            <div key={section.id} style={{ 
              marginBottom: '2rem',
              padding: '1.5rem',
              background: '#f8f9fa',
              borderRadius: '12px',
              border: '1px solid #e9ecef'
            }}>
              {/* Заголовок секции */}
              <h2 style={{ 
                fontSize: '1.2rem', 
                fontWeight: 600, 
                color: '#2d7a4f',
                marginBottom: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                {getSectionIcon(section.icon)}
                {section.title[lang]}
              </h2>

              {/* Вопросы секции */}
              {section.questions.map((question) => {
                if (!shouldShowQuestion(question)) return null
                
                const questionNumber = visibleQuestionsWithNumbers.get(question.id)
                
                return (
                  <div key={question.id} style={{ marginBottom: '1.5rem' }}>
                    <label style={{ 
                      display: 'block', 
                      marginBottom: '0.75rem', 
                      fontWeight: 500,
                      color: '#333',
                      fontSize: '0.95rem'
                    }}>
                      <span style={{ 
                        color: '#2d7a4f', 
                        fontWeight: 600,
                        marginRight: '0.5rem'
                      }}>
                        {questionNumber}.
                      </span>
                      {question.label[lang]}
                      {question.required && <span style={{ color: '#dc3545' }}> *</span>}
                    </label>
                    
                    {/* Text input */}
                    {question.type === 'text' && (
                      <input
                        type="text"
                        value={(answers[question.id] as string) || ''}
                        onChange={(e) => handleInputChange(question.id, e.target.value)}
                        placeholder={question.placeholder?.[lang] || ''}
                        style={{ 
                          width: '100%', 
                          padding: '0.75rem', 
                          fontSize: '1rem', 
                          border: '1px solid #ddd', 
                          borderRadius: '8px',
                          background: 'white',
                          boxSizing: 'border-box'
                        }}
                      />
                    )}
                    
                    {/* Number input */}
                    {question.type === 'number' && (
                      <input
                        type="number"
                        value={(answers[question.id] as string) || ''}
                        onChange={(e) => handleInputChange(question.id, e.target.value)}
                        min={question.min}
                        max={question.max}
                        placeholder={question.placeholder?.[lang] || ''}
                        style={{ 
                          width: '100%', 
                          padding: '0.75rem', 
                          fontSize: '1rem', 
                          border: '1px solid #ddd', 
                          borderRadius: '8px',
                          background: 'white',
                          boxSizing: 'border-box'
                        }}
                      />
                    )}
                    
                    {/* Textarea */}
                    {question.type === 'textarea' && (
                      <textarea
                        value={(answers[question.id] as string) || ''}
                        onChange={(e) => handleInputChange(question.id, e.target.value)}
                        rows={3}
                        placeholder={question.placeholder?.[lang] || ''}
                        style={{ 
                          width: '100%', 
                          padding: '0.75rem', 
                          fontSize: '1rem', 
                          border: '1px solid #ddd', 
                          borderRadius: '8px',
                          fontFamily: 'inherit',
                          resize: 'vertical',
                          background: 'white',
                          boxSizing: 'border-box'
                        }}
                      />
                    )}
                    
                    {/* Radio buttons */}
                    {question.type === 'radio' && question.options && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                        {question.options.map((option) => (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => handleRadioChange(question.id, option.value)}
                            style={{
                              padding: '0.5rem 1rem',
                              fontSize: '0.9rem',
                              border: answers[question.id] === option.value ? '2px solid #2d7a4f' : '1px solid #ddd',
                              borderRadius: '20px',
                              background: answers[question.id] === option.value ? '#e8f5e9' : 'white',
                              color: answers[question.id] === option.value ? '#2d7a4f' : '#333',
                              cursor: 'pointer',
                              fontWeight: answers[question.id] === option.value ? 600 : 400,
                              transition: 'all 0.2s ease'
                            }}
                          >
                            {option.label[lang]}
                          </button>
                        ))}
                      </div>
                    )}
                    
                    {/* Checkbox buttons */}
                    {question.type === 'checkbox' && question.options && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                        {question.options.map((option) => (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => handleCheckboxToggle(question.id, option.value)}
                            style={{
                              padding: '0.5rem 1rem',
                              fontSize: '0.9rem',
                              border: isChecked(question.id, option.value) ? '2px solid #2d7a4f' : '1px solid #ddd',
                              borderRadius: '20px',
                              background: isChecked(question.id, option.value) ? '#e8f5e9' : 'white',
                              color: isChecked(question.id, option.value) ? '#2d7a4f' : '#333',
                              cursor: 'pointer',
                              fontWeight: isChecked(question.id, option.value) ? 600 : 400,
                              transition: 'all 0.2s ease'
                            }}
                          >
                            {isChecked(question.id, option.value) && '✓ '}
                            {option.label[lang]}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Дополнительное поле */}
                    {question.hasAdditional && (answers[question.id] || (Array.isArray(answers[question.id]) && (answers[question.id] as string[]).length > 0)) && (
                      <div style={{ marginTop: '0.75rem' }}>
                        <input
                          type="text"
                          value={additionalAnswers[question.id] || ''}
                          onChange={(e) => handleAdditionalChange(question.id, e.target.value)}
                          placeholder="Уточните подробности..."
                          style={{ 
                            width: '100%', 
                            padding: '0.75rem', 
                            fontSize: '0.9rem', 
                            border: '1px solid #ddd', 
                            borderRadius: '8px',
                            background: 'white',
                            boxSizing: 'border-box'
                          }}
                        />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )
        })}

        {/* Кнопка отправки */}
        <button
          onClick={handleSubmit}
          disabled={isSubmitting || !isFormValid()}
          style={{
            width: '100%',
            padding: '1rem 2rem',
            fontSize: '1.1rem',
            fontWeight: 600,
            background: isSubmitting || !isFormValid() ? '#ccc' : '#2d7a4f',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            cursor: isSubmitting || !isFormValid() ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: isSubmitting || !isFormValid() ? 'none' : '0 4px 12px rgba(45, 122, 79, 0.3)'
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
              color: '#2d7a4f',
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
