# Инструкция по развертыванию системы автоматического удаления GDPR

## Обзор

Система автоматического удаления анкет по GDPR запросам состоит из:
1. Таблицы `gdpr_requests` в Supabase
2. Edge Function `delete_old_profiles` для автоматического удаления
3. API endpoint для создания запросов на удаление

## Шаг 1: Применить миграцию базы данных

```bash
# Если используете Supabase CLI локально
supabase migration up

# Или через Supabase Dashboard:
# 1. Перейдите в Database > Migrations
# 2. Нажмите "New migration"
# 3. Скопируйте содержимое файла supabase/migrations/003_gdpr_requests.sql
# 4. Примените миграцию
```

Миграция создаст:
- Таблицу `gdpr_requests` с автоматическим вычислением `scheduled_delete_at`
- Индексы для эффективных запросов
- RLS политики для безопасности

## Шаг 2: Деплой Edge Function

### 2.1 Убедитесь, что Supabase CLI установлен

```bash
supabase --version
```

### 2.2 Войдите в Supabase

```bash
supabase login
```

### 2.3 Свяжите проект (если еще не связан)

```bash
supabase link --project-ref your-project-ref
```

### 2.4 Деплой функции

```bash
# Из корня проекта
supabase functions deploy delete_old_profiles
```

## Шаг 3: Настроить переменные окружения

Edge Function автоматически получает переменные окружения от Supabase. Убедитесь, что в Supabase Dashboard установлены:

- `SUPABASE_URL` - URL вашего проекта
- `SUPABASE_SERVICE_ROLE_KEY` - Service Role Key

Эти переменные обычно устанавливаются автоматически, но можно проверить в:
**Supabase Dashboard > Settings > API**

## Шаг 4: Настроить расписание (Scheduled Task)

Функция будет запускаться автоматически **1 раз в месяц** (1-го числа каждого месяца в 00:00 UTC):

```bash
supabase functions schedule create delete_old_profiles --cron "0 0 1 * *"
```

### Альтернативные расписания (если нужно):

```bash
# Каждую неделю (каждый понедельник в 00:00 UTC)
supabase functions schedule create delete_old_profiles --cron "0 0 * * 1"

# Каждый день в 00:00 UTC
supabase functions schedule create delete_old_profiles --cron "0 0 * * *"

# Каждые 3 дня в 00:00 UTC
supabase functions schedule create delete_old_profiles --cron "0 0 */3 * *"
```

## Шаг 5: Проверка расписания

```bash
# Посмотреть все запланированные задачи
supabase functions schedule list

# Удалить расписание (если нужно)
supabase functions schedule delete delete_old_profiles
```

## Шаг 6: Тестирование

### 6.1 Ручной запуск функции

```bash
# Запустить функцию вручную для тестирования
supabase functions invoke delete_old_profiles
```

### 6.2 Создать тестовый GDPR запрос

Через API или напрямую в базе данных:

```sql
-- Вставить тестовый запрос (будет удален через 3 дня)
INSERT INTO gdpr_requests (profile_id, status)
VALUES ('test_telegram_username', 'pending');
```

### 6.3 Проверить логи

```bash
# Посмотреть логи функции
supabase functions logs delete_old_profiles
```

Или через Supabase Dashboard:
**Edge Functions > delete_old_profiles > Logs**

## Как это работает

1. **Создание запроса:**
   - Пользователь создает запрос на удаление через форму на сайте
   - API endpoint `/api/gdpr/create-request` создает запись в `gdpr_requests`
   - Поле `scheduled_delete_at` автоматически вычисляется как `created_at + 7 days` (1 неделя)

2. **Автоматическое удаление:**
   - Edge Function запускается по расписанию (1 раз в месяц)
   - Находит все запросы со статусом `pending`, где `scheduled_delete_at <= now()`
   - Для каждого запроса:
     - Удаляет только анкеты из `questionnaires`, которые старше 1 недели (submitted_at < now() - 7 days)
     - Удаляет связанные сессии из `sessions`
     - Удаляет связанные OTP коды из `otp_codes`
     - Обновляет статус на `deleted` или `failed`
     - Если остались анкеты новее 1 недели, они будут удалены при следующем запуске

3. **Идемпотентность:**
   - Если анкеты уже удалены - ошибок не будет
   - Если запросов нет - функция завершится успешно
   - Если произошла ошибка - запрос помечается как `failed`

## Мониторинг

### Проверить статус запросов

```sql
-- Все запросы
SELECT * FROM gdpr_requests ORDER BY created_at DESC;

-- Только pending запросы
SELECT * FROM gdpr_requests WHERE status = 'pending';

-- Запросы, готовые к удалению
SELECT * FROM gdpr_requests 
WHERE status = 'pending' 
  AND scheduled_delete_at <= NOW();
```

### Логи функции

Логи доступны в Supabase Dashboard:
**Edge Functions > delete_old_profiles > Logs**

Функция возвращает JSON с результатами:
```json
{
  "success": true,
  "message": "Processed 5 GDPR requests",
  "processed": 5,
  "successful": 5,
  "failed": 0
}
```

## Важные замечания

⚠️ **Внимание:**
- Удаление **необратимо** - данные удаляются навсегда
- Функция использует `SUPABASE_SERVICE_ROLE_KEY` для полного доступа
- Период ожидания 7 дней (1 неделя) дает время для отмены запроса (если нужно)
- Функция запускается 1 раз в месяц, но обрабатывает все запросы, готовые к удалению
- Удаляются только анкеты, которые старше 1 недели с момента их создания (submitted_at)
- Новые анкеты (младше 1 недели) не удаляются и будут обработаны при следующем запуске

## Отмена запроса на удаление

Если нужно отменить запрос (например, пользователь передумал):

```sql
-- Отменить запрос (изменить статус)
UPDATE gdpr_requests 
SET status = 'cancelled' 
WHERE profile_id = 'user_telegram_username' 
  AND status = 'pending';
```

**Примечание:** Для отмены нужно добавить статус `cancelled` в CHECK constraint таблицы или использовать другой механизм.

## Структура файлов

```
supabase/
├── migrations/
│   └── 003_gdpr_requests.sql          # Миграция таблицы
├── functions/
│   └── delete_old_profiles/
│       ├── index.ts                     # Edge Function
│       ├── deno.json                    # Конфигурация Deno
│       └── README.md                    # Документация функции
api/
└── gdpr/
    └── create-request.ts                # API endpoint для создания запросов
```

## Команды для быстрого доступа

```bash
# Деплой функции
supabase functions deploy delete_old_profiles

# Создать расписание (1 раз в месяц)
supabase functions schedule create delete_old_profiles --cron "0 0 1 * *"

# Посмотреть расписание
supabase functions schedule list

# Запустить вручную
supabase functions invoke delete_old_profiles

# Посмотреть логи
supabase functions logs delete_old_profiles
```

## Поддержка

Если возникли проблемы:
1. Проверьте логи функции в Supabase Dashboard
2. Убедитесь, что миграция применена
3. Проверьте, что переменные окружения установлены
4. Проверьте, что расписание создано
