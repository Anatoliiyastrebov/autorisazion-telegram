# Анкеты с авторизацией через Telegram

Веб-приложение для сбора анкет с авторизацией через Telegram Login Widget.

## Установка

```bash
npm install
```

## Настройка

1. Создайте файл `.env.local` на основе `.env.local.example`
2. Создайте бота у [@BotFather](https://t.me/BotFather) в Telegram и получите:
   - Имя бота (например, `my_bot`)
   - Токен бота (например, `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`)
3. Добавьте в `.env.local`:

```
NEXT_PUBLIC_TELEGRAM_BOT_NAME=your_bot_name
TELEGRAM_BOT_TOKEN=your_bot_token_here
```

**Важно:** 
- `NEXT_PUBLIC_TELEGRAM_BOT_NAME` - имя вашего бота (доступно на клиенте)
- `TELEGRAM_BOT_TOKEN` - токен бота (только на сервере, для проверки подписи)

## Запуск

```bash
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000) в браузере.

## Маршруты анкет

- `/questionnaire/women` - Женская анкета
- `/questionnaire/men` - Мужская анкета
- `/questionnaire/basic` - Базовая анкета
- `/questionnaire/extended` - Расширенная анкета

## Деплой

Проект готов к деплою на Vercel:

1. Подключите репозиторий к Vercel
2. Добавьте переменные окружения:
   - `NEXT_PUBLIC_TELEGRAM_BOT_NAME` - имя вашего бота
   - `TELEGRAM_BOT_TOKEN` - токен бота
3. Деплой произойдет автоматически

