import crypto from 'crypto'

// Хранилище временных токенов авторизации (в продакшене используйте Redis или БД)
const authTokens = new Map<string, { userId: number; expiresAt: number }>()

// Генерируем токен авторизации
export function generateAuthToken(userId: number): string {
  const token = crypto.randomBytes(32).toString('hex')
  const expiresAt = Date.now() + 5 * 60 * 1000 // 5 минут
  authTokens.set(token, { userId, expiresAt })
  
  // Очищаем истекшие токены
  setTimeout(() => {
    authTokens.delete(token)
  }, 5 * 60 * 1000)
  
  return token
}

// Проверяем токен
export function verifyAuthToken(token: string): number | null {
  const authData = authTokens.get(token)
  if (!authData) return null
  
  if (Date.now() > authData.expiresAt) {
    authTokens.delete(token)
    return null
  }
  
  return authData.userId
}

// Удаляем токен
export function deleteAuthToken(token: string): void {
  authTokens.delete(token)
}

