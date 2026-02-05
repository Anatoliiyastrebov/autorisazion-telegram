// Telegram бот для авторизации на сайте
// Бот: @telega_automat_bot

require('dotenv').config()
const TelegramBot = require('node-telegram-bot-api')
const axios = require('axios')

// Проверка переменных окружения
if (!process.env.TELEGRAM_BOT_TOKEN) {
  console.error('❌ Ошибка: TELEGRAM_BOT_TOKEN не установлен!')
  console.error('Создайте файл .env и добавьте TELEGRAM_BOT_TOKEN=ваш_токен')
  process.exit(1)
}

if (!process.env.SITE_URL) {
  console.error('❌ Ошибка: SITE_URL не установлен!')
  console.error('Создайте файл .env и добавьте SITE_URL=https://ваш-домен.vercel.app')
  process.exit(1)
}

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { 
  polling: {
    interval: 300,
    autoStart: true,
    params: {
      timeout: 10
    }
  }
})

const SITE_URL = process.env.SITE_URL

// Временное хранилище токенов (в продакшене используйте Redis или БД)
const sessionTokens = {}

// Очистка старых токенов каждые 5 минут
setInterval(() => {
  const now = Date.now()
  Object.keys(sessionTokens).forEach(key => {
    if (now - sessionTokens[key].timestamp > 10 * 60 * 1000) {
      delete sessionTokens[key]
      console.log(`🗑️ Удален истекший токен сессии: ${key}`)
    }
  })
}, 5 * 60 * 1000)

// Обработчик команды /start с параметром auth_* (для обратной совместимости)
// Теперь используется встроенная кнопка Menu Button, но оставляем для случаев открытия через ссылку
bot.onText(/\/start auth_(.+)/, async (msg, match) => {
  const chatId = msg.chat.id
  const userName = msg.from.first_name || 'Пользователь'
  
  console.log(`🔐 Запрос авторизации от пользователя ${chatId} (${userName})`)
  
  // Просто сообщаем пользователю использовать встроенную кнопку
  bot.sendMessage(chatId, 
    `👋 Привет, ${userName}!\n\n` +
    `Для авторизации используйте встроенную кнопку меню в боте.\n\n` +
    `Нажмите на кнопку "Авторизоваться" внизу экрана (Menu Button).`
  )
})

// Обработчик обычной команды /start
bot.onText(/\/start$/, (msg) => {
  const chatId = msg.chat.id
  const userName = msg.from.first_name || 'Пользователь'
  
  console.log(`👋 Команда /start от пользователя ${chatId} (${userName})`)
  
  bot.sendMessage(chatId, 
    `👋 Привет, ${userName}!\n\n` +
    `Я бот для авторизации на сайте.\n\n` +
    `Для авторизации:\n` +
    `1. Нажмите на встроенную кнопку "Авторизоваться" внизу экрана\n` +
    `2. Подтвердите авторизацию в открывшемся окне\n` +
    `3. Вы будете перенаправлены на сайт\n\n` +
    `Бот: @telega_automat_bot`
  )
})

// Обработчик команды /help
bot.onText(/\/help/, (msg) => {
  const chatId = msg.chat.id
  
  bot.sendMessage(chatId,
    `📖 Помощь\n\n` +
    `Команды:\n` +
    `/start - Начать работу с ботом\n` +
    `/help - Показать эту справку\n\n` +
    `Для авторизации на сайте:\n` +
    `1. Нажмите на встроенную кнопку "Авторизоваться" внизу экрана\n` +
    `2. Подтвердите авторизацию в открывшемся окне\n` +
    `3. Вы будете перенаправлены на сайт с анкетами`
  )
})

// ID администраторов, которые могут отправлять сообщения через бота
const ADMIN_IDS = process.env.TELEGRAM_ADMIN_CHAT_ID 
  ? [parseInt(process.env.TELEGRAM_ADMIN_CHAT_ID)]
  : []

// Хранилище ожидающих ответов (adminChatId -> targetUserId)
const pendingReplies = new Map()

// Обработчик нажатия на inline-кнопку "Ответить пользователю"
bot.on('callback_query', async (query) => {
  const callbackData = query.data
  const chatId = query.message.chat.id
  const messageId = query.message.message_id
  
  // Проверяем, что это кнопка ответа
  if (callbackData && callbackData.startsWith('reply_')) {
    const targetUserId = parseInt(callbackData.replace('reply_', ''))
    
    console.log(`🔔 Нажата кнопка ответа пользователю ${targetUserId}`)
    
    // Сохраняем ID пользователя для ожидания ответа
    pendingReplies.set(chatId, {
      targetUserId,
      messageId,
      timestamp: Date.now()
    })
    
    // Отвечаем на callback
    bot.answerCallbackQuery(query.id, {
      text: 'Напишите сообщение для пользователя',
      show_alert: false
    })
    
    // Отправляем инструкцию
    bot.sendMessage(chatId, 
      `✏️ Напишите сообщение для пользователя (ID: ${targetUserId}).\n\n` +
      `Просто отправьте текст следующим сообщением, и бот перешлёт его пользователю.\n\n` +
      `Для отмены напишите /cancel`
    )
  }
})

// Обработчик команды /cancel - отмена ожидания ответа
bot.onText(/\/cancel/, (msg) => {
  const chatId = msg.chat.id
  if (pendingReplies.has(chatId)) {
    pendingReplies.delete(chatId)
    bot.sendMessage(chatId, '❌ Отправка сообщения отменена.')
  }
})

// Обработчик команды /reply_ID текст - для ответа пользователям без username
bot.onText(/\/reply_(\d+)\s+(.+)/, async (msg, match) => {
  const chatId = msg.chat.id
  const senderId = msg.from.id
  
  // Проверяем, что отправитель - администратор (или из группы с анкетами)
  const isAdmin = ADMIN_IDS.includes(senderId) || msg.chat.type === 'group' || msg.chat.type === 'supergroup'
  
  if (!isAdmin) {
    bot.sendMessage(chatId, '❌ У вас нет прав для отправки сообщений.')
    return
  }
  
  const targetUserId = parseInt(match[1])
  const messageText = match[2]
  
  console.log(`📤 Попытка отправки сообщения пользователю ${targetUserId}: ${messageText.substring(0, 50)}...`)
  
  try {
    await bot.sendMessage(targetUserId, 
      `📩 Сообщение от администратора:\n\n${messageText}`
    )
    bot.sendMessage(chatId, `✅ Сообщение отправлено пользователю ${targetUserId}`)
    console.log(`✅ Сообщение успешно отправлено пользователю ${targetUserId}`)
  } catch (error) {
    console.error(`❌ Ошибка отправки пользователю ${targetUserId}:`, error.message)
    bot.sendMessage(chatId, 
      `❌ Не удалось отправить сообщение.\n` +
      `Возможные причины:\n` +
      `- Пользователь заблокировал бота\n` +
      `- Пользователь не запускал бота\n` +
      `- Неверный ID пользователя`
    )
  }
})

// Обработчик всех сообщений
bot.on('message', async (msg) => {
  const chatId = msg.chat.id
  
  // Игнорируем команды, которые уже обработаны
  if (msg.text && (msg.text.startsWith('/start') || msg.text.startsWith('/help') || msg.text.startsWith('/reply_') || msg.text.startsWith('/cancel'))) {
    return
  }
  
  // Проверяем, ожидаем ли мы ответ от этого чата
  if (pendingReplies.has(chatId) && msg.text) {
    const pending = pendingReplies.get(chatId)
    const targetUserId = pending.targetUserId
    
    // Проверяем, не истекло ли время ожидания (10 минут)
    if (Date.now() - pending.timestamp > 10 * 60 * 1000) {
      pendingReplies.delete(chatId)
      bot.sendMessage(chatId, '⏰ Время ожидания истекло. Нажмите кнопку "Ответить" ещё раз.')
      return
    }
    
    console.log(`📤 Отправка ответа пользователю ${targetUserId}: ${msg.text.substring(0, 50)}...`)
    
    try {
      await bot.sendMessage(targetUserId, 
        `📩 Сообщение от администратора:\n\n${msg.text}`
      )
      
      // Удаляем из ожидания
      pendingReplies.delete(chatId)
      
      bot.sendMessage(chatId, 
        `✅ Сообщение отправлено пользователю!\n\n` +
        `👤 ID: ${targetUserId}\n` +
        `📝 Текст: ${msg.text.substring(0, 100)}${msg.text.length > 100 ? '...' : ''}`
      )
      console.log(`✅ Ответ успешно отправлен пользователю ${targetUserId}`)
    } catch (error) {
      console.error(`❌ Ошибка отправки пользователю ${targetUserId}:`, error.message)
      pendingReplies.delete(chatId)
      bot.sendMessage(chatId, 
        `❌ Не удалось отправить сообщение.\n\n` +
        `Возможные причины:\n` +
        `• Пользователь заблокировал бота\n` +
        `• Пользователь никогда не запускал бота\n\n` +
        `ID пользователя: ${targetUserId}`
      )
    }
    return
  }
  
  // Логируем все остальные сообщения
  if (msg.text) {
    console.log(`💬 Сообщение от ${msg.from.id} (${msg.from.first_name}): ${msg.text}`)
  }
})

// Обработчик ошибок polling
bot.on('polling_error', (error) => {
  console.error('❌ Ошибка polling:', error.message)
  
  // Если ошибка критическая, перезапускаем бота
  if (error.code === 'ETELEGRAM' && error.response?.body?.error_code === 401) {
    console.error('❌ Критическая ошибка: Неверный токен бота!')
    process.exit(1)
  }
})

// Обработчик успешного запуска
bot.on('polling_error', () => {
  // Это событие срабатывает при ошибках, но мы уже обработали его выше
})

// Информация о запуске
console.log('🤖 Telegram бот запускается...')
console.log(`📡 SITE_URL: ${SITE_URL}`)
console.log(`🔑 Бот токен: ${process.env.TELEGRAM_BOT_TOKEN.substring(0, 10)}...`)

// Настройка Menu Button при запуске
const setupMenuButton = async () => {
  try {
    console.log('🔘 Настройка Menu Button...')
    await bot.setChatMenuButton({
      menu_button: {
        type: 'web_app',
        text: 'Авторизоваться',
        web_app: {
          url: `${SITE_URL}/auth/confirm`
        }
      }
    })
    console.log('✅ Menu Button настроен успешно')
  } catch (error) {
    console.warn('⚠️ Не удалось настроить Menu Button автоматически:', error.message)
    console.warn('⚠️ Настройте Menu Button вручную через @BotFather:')
    console.warn(`   Bot Settings → Menu Button → URL: ${SITE_URL}/auth/confirm`)
  }
}

// Проверка доступности API
axios.get(`${SITE_URL}/api/auth/generate-token`, { timeout: 5000 })
  .then(() => {
    console.log('✅ API сайта доступен')
  })
  .catch((error) => {
    console.warn('⚠️ Предупреждение: API сайта недоступен:', error.message)
    console.warn('⚠️ Убедитесь, что SITE_URL правильный и сайт работает')
  })

// Настраиваем Menu Button после небольшой задержки
setTimeout(() => {
  setupMenuButton()
}, 2000)

console.log('✅ Бот запущен и готов к работе!')
console.log('📝 Используйте /start для начала работы')
console.log('🔘 Menu Button будет настроен автоматически...')

