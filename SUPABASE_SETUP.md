# Настройка Supabase для безопасного хранения анкет

## Шаг 1: Создание проекта в Supabase

1. Перейдите на [supabase.com](https://supabase.com)
2. Создайте новый проект
3. Запишите:
   - **Project URL** (например: `https://xxxxx.supabase.co`)
   - **Service Role Key** (находится в Settings → API → service_role key)
   - **Anon Key** (находится в Settings → API → anon public key)

## Шаг 2: Настройка базы данных

1. В Supabase Dashboard перейдите в **SQL Editor**
2. Создайте новый запрос
3. Скопируйте содержимое файла `supabase/migrations/001_initial_schema.sql`
4. Выполните SQL запрос

Это создаст:
- Таблицу `otp_codes` для хранения одноразовых кодов
- Таблицу `sessions` для хранения сессионных токенов
- Таблицу `questionnaires` для хранения зашифрованных анкет
- Индексы для быстрого поиска
- Функции для очистки истекших данных
- Row Level Security (RLS) политики

## Шаг 3: Настройка переменных окружения

В Vercel Dashboard → Project Settings → Environment Variables добавьте:

```
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
ENCRYPTION_KEY=<32-байтовый hex ключ>
```

### Генерация ENCRYPTION_KEY:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**ВАЖНО:** Сохраните этот ключ в безопасном месте! Без него невозможно расшифровать данные.

## Шаг 4: Установка зависимостей

```bash
npm install @supabase/supabase-js
```

## Шаг 5: Настройка отправки OTP

### Для Telegram:

Обновите `api/auth/send-otp.ts` для отправки OTP через Telegram Bot:

```typescript
// После сохранения OTP в базу данных
const BOT_TOKEN = process.env.VITE_TELEGRAM_BOT_TOKEN;
const chatId = telegram; // или получите chat_id по username

if (BOT_TOKEN && contactType === 'telegram') {
  await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text: `Ваш код подтверждения: ${otp}\n\nКод действителен 10 минут.`,
    }),
  });
}
```

### Для SMS:

Используйте сервис типа Twilio, AWS SNS или аналогичный:

```typescript
// Пример с Twilio
import twilio from 'twilio';

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

if (contactType === 'phone') {
  await client.messages.create({
    body: `Ваш код подтверждения: ${otp}`,
    to: phone,
    from: process.env.TWILIO_PHONE_NUMBER,
  });
}
```

## Шаг 6: Проверка работы

1. Деплой проекта на Vercel
2. Проверьте, что переменные окружения установлены
3. Протестируйте отправку OTP
4. Протестируйте сохранение анкеты
5. Проверьте, что данные сохраняются в Supabase

## Безопасность

### Row Level Security (RLS)

RLS политики настроены так, что только service role может получить доступ к данным. Это означает:
- Клиентский код не может напрямую обращаться к базе данных
- Все операции проходят через API endpoints
- Данные изолированы по пользователям

### Шифрование

- Все данные анкет шифруются перед сохранением (AES-256-CBC)
- Ключ шифрования хранится только в переменных окружения
- Данные расшифровываются только при запросе авторизованным пользователем

### Рекомендации

1. **Регулярно ротируйте ENCRYPTION_KEY** (требует миграции данных)
2. **Используйте HTTPS** (обязательно в продакшене)
3. **Настройте rate limiting** для защиты от брутфорса
4. **Мониторьте логи** в Supabase Dashboard
5. **Регулярно делайте бэкапы** базы данных

## Мониторинг

В Supabase Dashboard вы можете:
- Просматривать таблицы и данные
- Мониторить использование ресурсов
- Просматривать логи запросов
- Настраивать алерты

## Миграция данных

Если у вас уже есть данные в localStorage, создайте скрипт миграции:

1. Пользователь проходит аутентификацию через OTP
2. Загружаются данные из localStorage
3. Данные сохраняются через новый API
4. localStorage очищается
