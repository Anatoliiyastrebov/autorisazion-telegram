// Пример кода для Telegram бота @telega_automat_bot
// Установите зависимости: npm install node-telegram-bot-api axios

const TelegramBot = require('node-telegram-bot-api')
const axios = require('axios')

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true })
const SITE_URL = process.env.SITE_URL || 'https://ваш-домен.vercel.app'

// Временное хранилище токенов (в продакшене используйте Redis или БД)
const sessionTokens = {}

// Обработчик команды /start с параметром auth_*
bot.onText(/\/start auth_(.+)/, async (msg, match) => {
  const chatId = msg.chat.id
  const sessionId = match[1]
  
  console.log(`🔐 Запрос авторизации от пользователя ${chatId}, сессия: ${sessionId}`)
  
  try {
    // Получаем токен авторизации с сайта
    const response = await axios.post(`${SITE_URL}/api/auth/generate-token`, {
      userId: chatId,
      botToken: process.env.TELEGRAM_BOT_TOKEN
    })
    
    const { token, callbackUrl } = response.data
    
    // Сохраняем токен в сессии
    sessionTokens[sessionId] = { token, userId: chatId, timestamp: Date.now() }
    
    // Очищаем старые токены (старше 10 минут)
    Object.keys(sessionTokens).forEach(key => {
      if (Date.now() - sessionTokens[key].timestamp > 10 * 60 * 1000) {
        delete sessionTokens[key]
      }
    })
    
    // Отправляем сообщение с кнопкой Web App для подтверждения авторизации
    bot.sendMessage(chatId, '🔐 Для авторизации на сайте нажмите кнопку ниже:', {
      reply_markup: {
        inline_keyboard: [[
          {
            text: '✅ Авторизоваться',
            web_app: { 
              url: `${SITE_URL}/auth/confirm?session=${sessionId}&token=${token}&user_id=${chatId}` 
            }
          }
        ]]
      }
    })
  } catch (error) {
    console.error('❌ Ошибка при генерации токена:', error.response?.data || error.message)
    bot.sendMessage(chatId, '❌ Ошибка при создании токена авторизации. Попробуйте еще раз.')
  }
})

// Обработчик обычной команды /start
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id
  bot.sendMessage(chatId, 
    '👋 Привет!\n\n' +
    'Для авторизации на сайте:\n' +
    '1. Перейдите на сайт\n' +
    '2. Нажмите кнопку "Войти через Telegram"\n' +
    '3. Следуйте инструкциям в боте'
  )
})

// Обработчик ошибок
bot.on('polling_error', (error) => {
  console.error('❌ Ошибка polling:', error)
})

console.log('✅ Бот запущен и готов к работе!')
