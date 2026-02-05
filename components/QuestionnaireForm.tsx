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

// Типы вопросов
type QuestionType = 'text' | 'textarea' | 'number' | 'select' | 'date' | 'multiselect'

interface Question {
  id: string
  label: string
  type: QuestionType
  options?: string[]
  section?: string
}

// Вопросы для разных типов анкет
const questionnaireQuestions: Record<string, Question[]> = {
  baby: [
    // Личные данные
    { id: 'first_name', label: 'Имя', type: 'text', section: 'Личные данные' },
    { id: 'last_name', label: 'Фамилия', type: 'text' },
    { id: 'age_months', label: 'Возраст (в месяцах)', type: 'number' },
    { id: 'weight', label: 'Вес (кг)', type: 'number' },
    
    // Здоровье
    { id: 'digestion', label: 'Пищеварение', type: 'multiselect', section: 'Здоровье', 
      options: ['Нет проблем', 'Боли в животе', 'Диарея', 'Запор'] },
    { id: 'colic', label: 'Колики', type: 'select', 
      options: ['Да', 'Нет'] },
    { id: 'reflux', label: 'Срыгивание/рефлюкс', type: 'select', 
      options: ['Да', 'Нет'] },
    { id: 'skin', label: 'Кожа', type: 'multiselect', 
      options: ['Нет проблем', 'Много родинок', 'Бородавки', 'Высыпания', 'Экзема', 'Другое'] },
    { id: 'allergies', label: 'Аллергии', type: 'multiselect', 
      options: ['Нет проблем', 'Цветение', 'Животные', 'Пыль', 'Еда', 'Другое'] },
    { id: 'injuries', label: 'Травмы/Операции', type: 'multiselect', 
      options: ['Все в порядке', 'Травмы', 'Операции', 'Удары по голове', 'Переломы', 'Сильные падения'] },
    { id: 'sleep', label: 'Сон', type: 'select', 
      options: ['Хорошо', 'Плохо', 'Иногда проблемы'] },
    { id: 'immunity', label: 'Иммунитет', type: 'multiselect', 
      options: ['Редко болеет', 'Часто болеет', 'Принимал антибиотики', 'Принимал лекарства'] },
    
    // Роды и беременность
    { id: 'birth_type', label: 'Тип родов', type: 'select', section: 'Роды и беременность', 
      options: ['Естественно', 'Кесарево'] },
    { id: 'birth_complications', label: 'Были ли осложнения при родах?', type: 'select', 
      options: ['Да', 'Нет'] },
    { id: 'breastfeeding', label: 'На грудном вскармливании?', type: 'select', 
      options: ['Да', 'Нет'] },
    { id: 'vaccinations', label: 'Прививки сделаны?', type: 'select', 
      options: ['Да', 'Нет', 'Частично'] },
    
    // Дополнительно
    { id: 'main_concern', label: 'Главный вопрос/жалоба', type: 'textarea', section: 'Дополнительно' },
  ],
  
  child: [
    // Личные данные
    { id: 'first_name', label: 'Имя', type: 'text', section: 'Личные данные' },
    { id: 'last_name', label: 'Фамилия', type: 'text' },
    { id: 'age', label: 'Возраст (от 1 до 12 лет)', type: 'number' },
    { id: 'weight', label: 'Вес (кг)', type: 'number' },
    
    // Здоровье
    { id: 'digestion', label: 'Пищеварение', type: 'multiselect', section: 'Здоровье', 
      options: ['Нет проблем', 'Боли в животе', 'Диарея', 'Запор', 'Вздутие'] },
    { id: 'appetite', label: 'Аппетит', type: 'select', 
      options: ['Хороший', 'Плохой', 'Избирательный'] },
    { id: 'sleep_problems', label: 'Проблемы со сном', type: 'multiselect', 
      options: ['Нет проблем', 'Потеет во сне', 'Скрипит зубами', 'Плохо засыпает', 'Просыпается ночью'] },
    { id: 'nausea', label: 'Бывает тошнота/рвота?', type: 'select', 
      options: ['Да', 'Нет'] },
    { id: 'skin', label: 'Кожа', type: 'multiselect', 
      options: ['Нет проблем', 'Много родинок', 'Бородавки', 'Высыпания', 'Экзема', 'Другое'] },
    { id: 'allergies', label: 'Аллергии', type: 'multiselect', 
      options: ['Нет проблем', 'Цветение', 'Животные', 'Пыль', 'Еда', 'Другое'] },
    { id: 'activity', label: 'Активность', type: 'select', 
      options: ['Нормальная', 'Гиперактивный', 'Часто устаёт'] },
    { id: 'water_intake', label: 'Сколько пьёт воды в день?', type: 'select', 
      options: ['Менее 0.5 литра', '0.5-1 литр', '1-1.5 литра', 'Более 1.5 литра'] },
    { id: 'injuries', label: 'Травмы/Операции', type: 'multiselect', 
      options: ['Все в порядке', 'Травмы', 'Операции', 'Удары по голове', 'Переломы', 'Сильные падения'] },
    { id: 'headaches', label: 'Головные боли', type: 'multiselect', 
      options: ['Нет проблем', 'Головные боли', 'Плохой сон', 'И головные боли, и плохой сон'] },
    { id: 'immunity', label: 'Иммунитет', type: 'multiselect', 
      options: ['Редко болеет', 'Часто болеет', 'Принимал антибиотики', 'Принимал лекарства'] },
    
    // Дополнительно
    { id: 'has_medical_docs', label: 'Есть ли медицинские документы?', type: 'select', section: 'Медицинские документы', 
      options: ['Да', 'Нет'] },
    { id: 'main_concern', label: 'Главный вопрос/жалоба', type: 'textarea', section: 'Дополнительно' },
  ],
  
  women: [
    // Личные данные
    { id: 'first_name', label: 'Имя', type: 'text', section: 'Личные данные' },
    { id: 'last_name', label: 'Фамилия', type: 'text' },
    { id: 'age', label: 'Возраст', type: 'number' },
    { id: 'weight', label: 'Вес (кг)', type: 'number' },
    
    // Здоровье - Общее
    { id: 'weight_satisfaction', label: 'Довольны ли вы своим весом?', type: 'select', section: 'Здоровье', 
      options: ['Да, довольна', 'Нет, недовольна'] },
    { id: 'water_intake', label: 'Сколько воды пьёте в день?', type: 'select', 
      options: ['1 литр', '1.5 литра', '2 литра', '2.5 литра', '3 литра', '3.5 литра'] },
    { id: 'smoking', label: 'Курите?', type: 'select', 
      options: ['Да', 'Нет'] },
    { id: 'alcohol', label: 'Употребляете алкоголь?', type: 'select', 
      options: ['Да', 'Нет'] },
    
    // Волосы, зубы
    { id: 'hair', label: 'Состояние волос', type: 'multiselect', 
      options: ['Здоровые', 'Сухие', 'Жирные', 'Ломкие', 'Выпадают', 'Тонкие', 'Другое'] },
    { id: 'teeth', label: 'Состояние зубов', type: 'multiselect', 
      options: ['Нет проблем', 'Быстро крошатся', 'Быстро портятся', 'Неприятный запах изо рта', 'Кровоточат десна', 'Другое'] },
    
    // ЖКТ
    { id: 'digestion', label: 'Пищеварение', type: 'multiselect', 
      options: ['Нет проблем', 'Изжога', 'Горечь во рту', 'Вздутие', 'Тяжесть в желудке', 'Газы', 'Диарея', 'Запор', 'Панкреатит', 'Другое'] },
    { id: 'stones', label: 'Камни/песок', type: 'multiselect', 
      options: ['Нет', 'Песок в почках', 'Песок в желчном', 'Камни в почках', 'Камни в желчном'] },
    
    // Операции, давление
    { id: 'surgeries', label: 'Операции/Травмы', type: 'multiselect', 
      options: ['Нет операций и травм', 'Операции', 'Удалены органы', 'Другое'] },
    { id: 'blood_pressure', label: 'Давление', type: 'select', 
      options: ['Низкое', 'Высокое', 'Нормальное'] },
    
    // Аутоиммунные
    { id: 'autoimmune', label: 'Аутоиммунные заболевания', type: 'multiselect', 
      options: ['Нет', 'Диабет', 'Аутоиммунный тиреоидит', 'Артрит', 'Псориаз', 'Другое'] },
    
    // Голова, нервная система
    { id: 'head_problems', label: 'Проблемы с головой', type: 'multiselect', 
      options: ['Нет проблем', 'Головные боли', 'Мигрени', 'Метеозависимость', 'Сотрясение мозга', 'Удары по голове', 'Шум в ушах', 'Мушки перед глазами', 'Головокружения', 'Другое'] },
    { id: 'extremities', label: 'Конечности', type: 'multiselect', 
      options: ['Нет проблем', 'Онемение пальцев рук и ног', 'Руки и ноги холодные даже летом', 'Оба симптома'] },
    
    // Вены, суставы
    { id: 'veins', label: 'Вены', type: 'multiselect', 
      options: ['Нет проблем', 'Варикоз (сеточка)', 'Варикоз (выраженные вены)', 'Геморрой (кровоточит)', 'Геморрой (не кровоточит)', 'Пигментные пятна', 'Другое'] },
    { id: 'joints', label: 'Суставы', type: 'multiselect', 
      options: ['Нет проблем', 'Скрипят', 'Хрустят', 'Воспаляются', 'Другое'] },
    
    // Образования, вирусы
    { id: 'formations', label: 'Образования', type: 'multiselect', 
      options: ['Нет', 'Кисты', 'Полипы', 'Миомы', 'Опухоли', 'Грыжи', 'Другое'] },
    { id: 'viruses', label: 'Вирусы/Кожные образования', type: 'multiselect', 
      options: ['Нет', 'Герпес', 'Папилломы', 'Родинки', 'Бородавки', 'Красные точки на коже', 'Другое'] },
    
    // Женское здоровье
    { id: 'gynecology', label: 'Гинекология', type: 'multiselect', section: 'Женское здоровье', 
      options: ['Нет проблем', 'Молочница', 'Цистит'] },
    { id: 'menstruation', label: 'Менструации', type: 'multiselect', 
      options: ['Регулярные, нормальные', 'Нерегулярные', 'Болезненные', 'Затяжные', 'Обильные кровотечения', 'Другое'] },
    
    // Кожа, аллергии
    { id: 'skin', label: 'Кожа', type: 'multiselect', section: 'Кожа и аллергии', 
      options: ['Нет проблем', 'Прыщи', 'Фурункулы', 'Акне', 'Раздражение', 'Розацеа', 'Псориаз', 'Дерматит', 'Экзема', 'Другое'] },
    { id: 'allergies', label: 'Аллергии', type: 'multiselect', 
      options: ['Нет проблем', 'Цветение', 'Животные', 'Пыль', 'Еда', 'Лекарства', 'Другое'] },
    
    // Простуды, сон, энергия
    { id: 'colds', label: 'Как часто болеете простудами?', type: 'select', section: 'Сон и энергия', 
      options: ['Редко (1-2 раза в год)', 'Иногда (3-4 раза в год)', 'Часто (5+ раз в год)'] },
    { id: 'sleep', label: 'Качество сна', type: 'multiselect', 
      options: ['Хороший', 'Трудно заснуть', 'Часто просыпаюсь ночью', 'Оба симптома', 'Другое'] },
    { id: 'morning_energy', label: 'Утренняя энергия', type: 'multiselect', 
      options: ['Нет проблем', 'Тяжело просыпаться', 'Утром чувствую себя неотдохнувшей', 'Нужна стимуляция кофе', 'Другое'] },
    { id: 'concentration', label: 'Концентрация и память', type: 'multiselect', 
      options: ['Нет проблем', 'Трудно сконцентрироваться', 'Забываются имена и события', 'Сложно запоминать информацию', 'Другое'] },
    
    // Образ жизни
    { id: 'lifestyle', label: 'Образ жизни', type: 'multiselect', section: 'Образ жизни', 
      options: ['Сидячий', 'Спорт', 'Домашняя гимнастика', 'Холодные обливания', 'Стрессовая работа', 'Физические нагрузки', 'Токсичные вещества на работе', 'Другое'] },
    { id: 'takes_medications', label: 'Принимаете лекарства?', type: 'select', 
      options: ['Да', 'Нет'] },
    { id: 'takes_supplements', label: 'Принимаете БАДы/витамины?', type: 'select', 
      options: ['Да', 'Нет'] },
    
    // Главный вопрос
    { id: 'main_concern', label: 'Опишите ваш главный вопрос', type: 'textarea', section: 'Дополнительно' },
  ],
  
  men: [
    // Личные данные
    { id: 'first_name', label: 'Имя', type: 'text', section: 'Личные данные' },
    { id: 'last_name', label: 'Фамилия', type: 'text' },
    { id: 'age', label: 'Возраст', type: 'number' },
    { id: 'weight', label: 'Вес (кг)', type: 'number' },
    
    // Здоровье - Общее
    { id: 'weight_satisfaction', label: 'Довольны ли вы своим весом?', type: 'select', section: 'Здоровье', 
      options: ['Да, доволен', 'Нет, недоволен'] },
    { id: 'water_intake', label: 'Сколько воды пьёте в день?', type: 'select', 
      options: ['1 литр', '1.5 литра', '2 литра', '2.5 литра', '3 литра', '3.5 литра'] },
    { id: 'smoking', label: 'Курите?', type: 'select', 
      options: ['Да', 'Нет'] },
    { id: 'alcohol', label: 'Употребляете алкоголь?', type: 'select', 
      options: ['Да', 'Нет'] },
    
    // Волосы, зубы
    { id: 'hair', label: 'Состояние волос', type: 'multiselect', 
      options: ['Здоровые', 'Сухие', 'Жирные', 'Ломкие', 'Выпадают', 'Тонкие', 'Другое'] },
    { id: 'teeth', label: 'Состояние зубов', type: 'multiselect', 
      options: ['Нет проблем', 'Быстро крошатся', 'Быстро портятся', 'Неприятный запах изо рта', 'Кровоточат десна', 'Другое'] },
    
    // ЖКТ
    { id: 'digestion', label: 'Пищеварение', type: 'multiselect', 
      options: ['Нет проблем', 'Изжога', 'Горечь во рту', 'Вздутие', 'Тяжесть в желудке', 'Газы', 'Диарея', 'Запор', 'Панкреатит', 'Другое'] },
    { id: 'stones', label: 'Камни/песок', type: 'multiselect', 
      options: ['Нет', 'Песок в почках', 'Песок в желчном', 'Камни в почках', 'Камни в желчном'] },
    
    // Операции, давление
    { id: 'surgeries', label: 'Операции/Травмы', type: 'multiselect', 
      options: ['Нет операций и травм', 'Операции', 'Удалены органы', 'Другое'] },
    { id: 'blood_pressure', label: 'Давление', type: 'select', 
      options: ['Низкое', 'Высокое', 'Нормальное'] },
    
    // Аутоиммунные
    { id: 'autoimmune', label: 'Аутоиммунные заболевания', type: 'multiselect', 
      options: ['Нет', 'Диабет', 'Аутоиммунный тиреоидит', 'Артрит', 'Псориаз', 'Другое'] },
    
    // Голова, нервная система
    { id: 'head_problems', label: 'Проблемы с головой', type: 'multiselect', 
      options: ['Нет проблем', 'Головные боли', 'Мигрени', 'Метеозависимость', 'Сотрясение мозга', 'Удары по голове', 'Шум в ушах', 'Мушки перед глазами', 'Головокружения', 'Другое'] },
    { id: 'extremities', label: 'Конечности', type: 'multiselect', 
      options: ['Нет проблем', 'Онемение пальцев рук и ног', 'Руки и ноги холодные даже летом', 'Оба симптома'] },
    
    // Вены, суставы
    { id: 'veins', label: 'Вены', type: 'multiselect', 
      options: ['Нет проблем', 'Варикоз (сеточка)', 'Варикоз (выраженные вены)', 'Геморрой (кровоточит)', 'Геморрой (не кровоточит)', 'Пигментные пятна', 'Другое'] },
    { id: 'joints', label: 'Суставы', type: 'multiselect', 
      options: ['Нет проблем', 'Скрипят', 'Хрустят', 'Воспаляются', 'Другое'] },
    
    // Образования, вирусы
    { id: 'formations', label: 'Образования', type: 'multiselect', 
      options: ['Нет', 'Кисты', 'Полипы', 'Миомы', 'Опухоли', 'Грыжи', 'Другое'] },
    { id: 'viruses', label: 'Вирусы/Кожные образования', type: 'multiselect', 
      options: ['Нет', 'Герпес', 'Папилломы', 'Родинки', 'Бородавки', 'Красные точки на коже', 'Другое'] },
    
    // Мужское здоровье
    { id: 'urology', label: 'Урология', type: 'multiselect', section: 'Мужское здоровье', 
      options: ['Нет проблем', 'Выделения', 'Цистит'] },
    { id: 'prostate', label: 'Простата', type: 'multiselect', 
      options: ['Нет проблем', 'Острый простатит', 'Хронический простатит', 'Есть симптомы', 'Другое'] },
    
    // Кожа, аллергии
    { id: 'skin', label: 'Кожа', type: 'multiselect', section: 'Кожа и аллергии', 
      options: ['Нет проблем', 'Прыщи', 'Фурункулы', 'Акне', 'Раздражение', 'Розацеа', 'Псориаз', 'Дерматит', 'Экзема', 'Другое'] },
    { id: 'allergies', label: 'Аллергии', type: 'multiselect', 
      options: ['Нет проблем', 'Цветение', 'Животные', 'Пыль', 'Еда', 'Лекарства', 'Другое'] },
    
    // Простуды, сон, энергия
    { id: 'colds', label: 'Как часто болеете простудами?', type: 'select', section: 'Сон и энергия', 
      options: ['Редко (1-2 раза в год)', 'Иногда (3-4 раза в год)', 'Часто (5+ раз в год)'] },
    { id: 'sleep', label: 'Качество сна', type: 'multiselect', 
      options: ['Хороший', 'Трудно заснуть', 'Часто просыпаюсь ночью', 'Оба симптома', 'Другое'] },
    { id: 'morning_energy', label: 'Утренняя энергия', type: 'multiselect', 
      options: ['Нет проблем', 'Тяжело просыпаться', 'Утром чувствую себя неотдохнувшим', 'Нужна стимуляция кофе', 'Другое'] },
    { id: 'concentration', label: 'Концентрация и память', type: 'multiselect', 
      options: ['Нет проблем', 'Трудно сконцентрироваться', 'Забываются имена и события', 'Сложно запоминать информацию', 'Другое'] },
    
    // Образ жизни
    { id: 'lifestyle', label: 'Образ жизни', type: 'multiselect', section: 'Образ жизни', 
      options: ['Сидячий', 'Спорт', 'Домашняя гимнастика', 'Холодные обливания', 'Стрессовая работа', 'Физические нагрузки', 'Токсичные вещества на работе', 'Другое'] },
    { id: 'takes_medications', label: 'Принимаете лекарства?', type: 'select', 
      options: ['Да', 'Нет'] },
    { id: 'takes_supplements', label: 'Принимаете БАДы/витамины?', type: 'select', 
      options: ['Да', 'Нет'] },
    
    // Главный вопрос
    { id: 'main_concern', label: 'Опишите ваш главный вопрос', type: 'textarea', section: 'Дополнительно' },
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
            
            // Заполняем имя и фамилию для всех типов анкет
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

  // Обработка multiselect - переключение выбранных опций
  const handleMultiselectToggle = (questionId: string, option: string) => {
    setAnswers((prev) => {
      const currentValue = prev[questionId] || ''
      const currentOptions = currentValue ? currentValue.split(', ') : []
      
      if (currentOptions.includes(option)) {
        // Убираем опцию
        const newOptions = currentOptions.filter(o => o !== option)
        return { ...prev, [questionId]: newOptions.join(', ') }
      } else {
        // Добавляем опцию
        return { ...prev, [questionId]: [...currentOptions, option].join(', ') }
      }
    })
  }

  // Проверка, выбрана ли опция
  const isOptionSelected = (questionId: string, option: string) => {
    const currentValue = answers[questionId] || ''
    const currentOptions = currentValue ? currentValue.split(', ') : []
    return currentOptions.includes(option)
  }

  // Группировка вопросов по секциям
  const groupedQuestions = questions.reduce((acc, question) => {
    const section = question.section || 'Основное'
    if (!acc[section]) {
      acc[section] = []
    }
    acc[section].push(question)
    return acc
  }, {} as Record<string, Question[]>)

  // Получаем список секций в порядке появления
  const sections = Object.keys(groupedQuestions)

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
          {sections.map((section) => (
            <div key={section} style={{ 
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
                {section === 'Личные данные' && '👤'}
                {section === 'Здоровье' && '💚'}
                {section === 'Роды и беременность' && '👶'}
                {section === 'Медицинские документы' && '📋'}
                {section === 'Женское здоровье' && '♀️'}
                {section === 'Мужское здоровье' && '♂️'}
                {section === 'Кожа и аллергии' && '🌸'}
                {section === 'Сон и энергия' && '😴'}
                {section === 'Образ жизни' && '🏃'}
                {section === 'Дополнительно' && '📝'}
                {section}
              </h2>

              {/* Вопросы секции */}
              {groupedQuestions[section].map((question) => (
                <div key={question.id} style={{ marginBottom: '1.5rem' }}>
                  <label 
                    htmlFor={question.id}
                    style={{ 
                      display: 'block', 
                      marginBottom: '0.75rem', 
                      fontWeight: 500,
                      color: '#333',
                      fontSize: '0.95rem'
                    }}
                  >
                    {question.label}
                    {!answers[question.id] && <span style={{ color: '#dc3545' }}> *</span>}
                  </label>
                  
                  {/* Textarea */}
                  {question.type === 'textarea' && (
                    <textarea
                      id={question.id}
                      value={answers[question.id] || ''}
                      onChange={(e) => handleInputChange(question.id, e.target.value)}
                      rows={3}
                      placeholder="Введите текст..."
                      style={{ 
                        width: '100%', 
                        padding: '0.75rem', 
                        fontSize: '1rem', 
                        border: '1px solid #ddd', 
                        borderRadius: '8px',
                        fontFamily: 'inherit',
                        resize: 'vertical',
                        background: 'white'
                      }}
                    />
                  )}
                  
                  {/* Select - отображаем как кнопки */}
                  {question.type === 'select' && question.options && (
                    <div style={{ 
                      display: 'flex', 
                      flexWrap: 'wrap', 
                      gap: '0.5rem' 
                    }}>
                      {question.options.map((option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() => handleInputChange(question.id, option)}
                          style={{
                            padding: '0.5rem 1rem',
                            fontSize: '0.9rem',
                            border: answers[question.id] === option ? '2px solid #2d7a4f' : '1px solid #ddd',
                            borderRadius: '20px',
                            background: answers[question.id] === option ? '#e8f5e9' : 'white',
                            color: answers[question.id] === option ? '#2d7a4f' : '#333',
                            cursor: 'pointer',
                            fontWeight: answers[question.id] === option ? 600 : 400,
                            transition: 'all 0.2s ease'
                          }}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  )}
                  
                  {/* Multiselect - кнопки с множественным выбором */}
                  {question.type === 'multiselect' && question.options && (
                    <div style={{ 
                      display: 'flex', 
                      flexWrap: 'wrap', 
                      gap: '0.5rem' 
                    }}>
                      {question.options.map((option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() => handleMultiselectToggle(question.id, option)}
                          style={{
                            padding: '0.5rem 1rem',
                            fontSize: '0.9rem',
                            border: isOptionSelected(question.id, option) ? '2px solid #2d7a4f' : '1px solid #ddd',
                            borderRadius: '20px',
                            background: isOptionSelected(question.id, option) ? '#e8f5e9' : 'white',
                            color: isOptionSelected(question.id, option) ? '#2d7a4f' : '#333',
                            cursor: 'pointer',
                            fontWeight: isOptionSelected(question.id, option) ? 600 : 400,
                            transition: 'all 0.2s ease'
                          }}
                        >
                          {isOptionSelected(question.id, option) && '✓ '}
                          {option}
                        </button>
                      ))}
                    </div>
                  )}
                  
                  {/* Text input */}
                  {question.type === 'text' && (
                    <input
                      id={question.id}
                      type="text"
                      value={answers[question.id] || ''}
                      onChange={(e) => handleInputChange(question.id, e.target.value)}
                      placeholder="Введите значение"
                      style={{ 
                        width: '100%', 
                        padding: '0.75rem', 
                        fontSize: '1rem', 
                        border: '1px solid #ddd', 
                        borderRadius: '8px',
                        background: 'white'
                      }}
                    />
                  )}
                  
                  {/* Number input */}
                  {question.type === 'number' && (
                    <input
                      id={question.id}
                      type="number"
                      value={answers[question.id] || ''}
                      onChange={(e) => handleInputChange(question.id, e.target.value)}
                      placeholder="0"
                      style={{ 
                        width: '100%', 
                        padding: '0.75rem', 
                        fontSize: '1rem', 
                        border: '1px solid #ddd', 
                        borderRadius: '8px',
                        background: 'white'
                      }}
                    />
                  )}
                  
                  {/* Date input */}
                  {question.type === 'date' && (
                    <input
                      id={question.id}
                      type="date"
                      value={answers[question.id] || ''}
                      onChange={(e) => handleInputChange(question.id, e.target.value)}
                      style={{ 
                        width: '100%', 
                        padding: '0.75rem', 
                        fontSize: '1rem', 
                        border: '1px solid #ddd', 
                        borderRadius: '8px',
                        background: 'white'
                      }}
                    />
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Кнопка отправки */}
        <button
          onClick={handleSubmit}
          disabled={isSubmitting || !allFieldsFilled}
          style={{
            width: '100%',
            padding: '1rem 2rem',
            fontSize: '1.1rem',
            fontWeight: 600,
            background: isSubmitting || !allFieldsFilled ? '#ccc' : '#2d7a4f',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            cursor: isSubmitting || !allFieldsFilled ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: isSubmitting || !allFieldsFilled ? 'none' : '0 4px 12px rgba(45, 122, 79, 0.3)'
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
