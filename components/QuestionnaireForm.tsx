'use client'

import { useState, useEffect } from 'react'
import TelegramLogin, { TelegramUser } from './TelegramLogin'
import TelegramAuthModal from './TelegramAuthModal'
import { useRouter } from 'next/navigation'

interface QuestionnaireFormProps {
  title: string
  questionnaireType: string
}

// Вопросы для разных типов анкет
const questionnaireQuestions: Record<string, Array<{ id: string; label: string; type: 'text' | 'textarea' | 'number' | 'select'; options?: string[] }>> = {
  women: [
    { id: 'age', label: 'Ваш возраст', type: 'number' },
    { id: 'city', label: 'Город проживания', type: 'text' },
    { id: 'interests', label: 'Ваши интересы', type: 'textarea' },
    { id: 'about', label: 'Расскажите о себе', type: 'textarea' },
  ],
  men: [
    { id: 'age', label: 'Ваш возраст', type: 'number' },
    { id: 'city', label: 'Город проживания', type: 'text' },
    { id: 'profession', label: 'Профессия', type: 'text' },
    { id: 'hobbies', label: 'Хобби и увлечения', type: 'textarea' },
  ],
  basic: [
    { id: 'name', label: 'Ваше имя', type: 'text' },
    { id: 'age', label: 'Возраст', type: 'number' },
    { id: 'contact', label: 'Контактная информация', type: 'text' },
  ],
  extended: [
    { id: 'age', label: 'Ваш возраст', type: 'number' },
    { id: 'city', label: 'Город', type: 'text' },
    { id: 'education', label: 'Образование', type: 'select', options: ['Среднее', 'Высшее', 'Неоконченное высшее'] },
    { id: 'work', label: 'Место работы', type: 'text' },
    { id: 'about', label: 'О себе', type: 'textarea' },
    { id: 'goals', label: 'Цели и планы', type: 'textarea' },
  ],
}

export default function QuestionnaireForm({
  title,
  questionnaireType,
}: QuestionnaireFormProps) {
  const router = useRouter()
  const questions = questionnaireQuestions[questionnaireType] || []
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [telegramUser, setTelegramUser] = useState<TelegramUser | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Проверяем Telegram Web App при загрузке компонента
  useEffect(() => {
    let isMounted = true
    let isInitialized = false
    
    const initializeWebApp = () => {
      // Предотвращаем множественную инициализацию и работу после размонтирования
      if (!isMounted || isInitialized || typeof window === 'undefined' || !window.Telegram?.WebApp) {
        return false
      }
      
      const webApp = window.Telegram.WebApp
      
      // Инициализируем Web App только один раз
      if (!isInitialized) {
        try {
          webApp.ready()
          webApp.expand()
          isInitialized = true
        } catch (error) {
          console.error('Error initializing Web App:', error)
          return false
        }
      }
      
      // Проверяем наличие данных пользователя
      const webAppUser = webApp.initDataUnsafe?.user
      const initData = webApp.initDataUnsafe
      const initDataString = webApp.initData // Оригинальная строка
      
      if (webAppUser && initData?.auth_date && initData?.hash) {
        if (!isMounted) return false // Компонент размонтирован
        
        console.log('✅ Telegram Web App: user data loaded')
        
        const user: TelegramUser = {
          id: webAppUser.id,
          first_name: webAppUser.first_name,
          last_name: webAppUser.last_name,
          username: webAppUser.username,
          photo_url: webAppUser.photo_url,
          auth_date: initData.auth_date,
          hash: initData.hash,
          initData: initDataString, // Сохраняем оригинальную строку для проверки
        }
        
        // Автоматически сохраняем данные пользователя (без показа модального окна)
        setTelegramUser(user)
        return true // Данные загружены
      }
      
      return false // Данные еще не загружены
    }

    // Проверяем сразу
    if (initializeWebApp()) {
      return () => {
        isMounted = false
      }
    }

    // Если данные не загружены, проверяем через небольшую задержку
    const timer = setTimeout(() => {
      if (isMounted && !initializeWebApp()) {
        console.log('ℹ️ Telegram Web App detected but user data not available')
      }
    }, 500)

    return () => {
      isMounted = false
      clearTimeout(timer)
    }
  }, [])

  const handleTelegramAuth = (user: TelegramUser) => {
    console.log('🟢 handleTelegramAuth called with user:', user)
    console.log('🟢 User hash:', user.hash ? 'present' : 'missing')
    
    if (!user.hash || user.hash.trim() === '') {
      setError('Ошибка: данные авторизации неполные. Попробуйте авторизоваться еще раз.')
      console.error('❌ Hash отсутствует в данных пользователя')
      return
    }
    
    setTelegramUser(user)
    // Не показываем модальное окно, просто сохраняем данные
  }

  const handleInputChange = (questionId: string, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }))
  }

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
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

    // Проверяем, что данные из реальной авторизации Telegram (есть hash)
    if (!telegramUser.hash || telegramUser.hash.trim() === '') {
      setError('Ошибка: данные не прошли проверку авторизации Telegram')
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
          answers,
          telegram: {
            id: telegramUser.id,
            username: telegramUser.username,
            first_name: telegramUser.first_name,
            last_name: telegramUser.last_name,
            photo_url: telegramUser.photo_url,
            auth_date: telegramUser.auth_date,
            hash: telegramUser.hash,
            initData: telegramUser.initData, // Отправляем оригинальную строку initData для Web App
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

  const currentQuestion = questions[currentStep]
  const isLastStep = currentStep === questions.length - 1
  const isFirstStep = currentStep === 0

  return (
    <>
      <div className="container">
        <div className="card">
          <h1>{title}</h1>

          {error && <div className="error-message">{error}</div>}

          {/* Индикатор прогресса */}
          {questions.length > 0 && (
            <div className="step-indicator" style={{ marginTop: '1rem', marginBottom: '2rem' }}>
              {questions.map((_, index) => (
                <div
                  key={index}
                  className={`step ${index === currentStep ? 'active' : index < currentStep ? 'completed' : ''}`}
                >
                  {index + 1}
                </div>
              ))}
            </div>
          )}

          {/* Вопросы анкеты */}
          {questions.length > 0 && currentQuestion && (
            <div className="form-group">
              <label htmlFor={currentQuestion.id}>
                {currentQuestion.label}
                {!answers[currentQuestion.id] && <span style={{ color: 'red' }}> *</span>}
              </label>
              
              {currentQuestion.type === 'textarea' ? (
                <textarea
                  id={currentQuestion.id}
                  value={answers[currentQuestion.id] || ''}
                  onChange={(e) => handleInputChange(currentQuestion.id, e.target.value)}
                  rows={5}
                  required
                />
              ) : currentQuestion.type === 'select' ? (
                <select
                  id={currentQuestion.id}
                  value={answers[currentQuestion.id] || ''}
                  onChange={(e) => handleInputChange(currentQuestion.id, e.target.value)}
                  required
                >
                  <option value="">Выберите...</option>
                  {currentQuestion.options?.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  id={currentQuestion.id}
                  type={currentQuestion.type}
                  value={answers[currentQuestion.id] || ''}
                  onChange={(e) => handleInputChange(currentQuestion.id, e.target.value)}
                  required
                />
              )}
            </div>
          )}

          {/* Навигация по шагам */}
          {questions.length > 0 && (
            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', justifyContent: 'space-between' }}>
              <button
                className="button button-secondary"
                onClick={handlePrevious}
                disabled={isFirstStep}
              >
                Назад
              </button>
              
              {!isLastStep ? (
                <button
                  className="button"
                  onClick={handleNext}
                  disabled={!answers[currentQuestion.id] || answers[currentQuestion.id].trim() === ''}
                >
                  Далее
                </button>
              ) : (
                <button
                  className="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting || !telegramUser}
                >
                  {isSubmitting ? 'Отправка...' : 'Отправить анкету'}
                </button>
              )}
            </div>
          )}

          {/* Блок авторизации через Telegram */}
          <div className="form-group" style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid #e0e0e0' }}>
            <h2>Авторизация через Telegram</h2>
            <p style={{ marginBottom: '1rem', color: '#666' }}>
              Для отправки анкеты необходимо авторизоваться через Telegram. Ваши данные из Telegram будут использованы для связи с вами.
            </p>
            
            {telegramUser ? (
              <div style={{ padding: '1rem', background: '#e7f3ff', borderRadius: '4px' }}>
                <p style={{ marginBottom: '0.5rem' }}>
                  <strong>✅ Авторизован:</strong> {telegramUser.first_name}
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
                <p style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: '#666' }}>
                  После заполнения всех вопросов вы сможете отправить анкету.
                </p>
              </div>
            ) : (
              <div>
                {typeof window !== 'undefined' && window.Telegram?.WebApp ? (
                  <div style={{ 
                    padding: '1rem', 
                    background: '#fff3cd', 
                    borderRadius: '8px',
                    border: '1px solid #ffc107',
                    textAlign: 'center'
                  }}>
                    <p style={{ marginBottom: '0.5rem', fontWeight: 500, color: '#856404' }}>
                      ⚠️ Данные пользователя не загружены
                    </p>
                    <p style={{ fontSize: '0.9rem', color: '#856404' }}>
                      Для автоматической авторизации откройте этот сайт из Telegram через бота или меню-кнопку.
                    </p>
                  </div>
                ) : (
                  <>
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
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
