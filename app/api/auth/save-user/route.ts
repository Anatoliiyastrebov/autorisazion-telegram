import { NextRequest, NextResponse } from 'next/server'
import { saveUserData, TelegramUserData, getAuthSession, deleteAuthSession } from '@/lib/auth-tokens'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userData, sessionId } = body

    if (!userData || !userData.id || !userData.first_name) {
      return NextResponse.json(
        { error: 'Invalid user data' },
        { status: 400 }
      )
    }

    // Получаем данные сессии (URL возврата) по sessionId
    let returnUrl = '/'
    let questionnaireType = ''
    
    if (sessionId) {
      const session = getAuthSession(sessionId)
      if (session) {
        returnUrl = session.returnUrl
        questionnaireType = session.questionnaireType
        // Удаляем сессию после использования
        deleteAuthSession(sessionId)
        console.log(`📋 Сессия найдена: ${returnUrl}`)
      } else {
        console.warn(`⚠️ Сессия ${sessionId} не найдена, используем URL по умолчанию`)
      }
    }

    // Сохраняем данные пользователя и получаем токен
    const token = saveUserData(userData as TelegramUserData)
    
    // Формируем URL для возврата
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || request.nextUrl.origin
    let callbackUrl = `${siteUrl}${returnUrl}`
    
    // Добавляем токен в URL
    const separator = callbackUrl.includes('?') ? '&' : '?'
    callbackUrl = `${callbackUrl}${separator}auth_token=${token}`

    console.log(`✅ Данные сохранены, URL для возврата: ${callbackUrl}`)

    return NextResponse.json({
      success: true,
      token,
      callbackUrl,
      returnUrl,
      questionnaireType,
      expiresIn: 600 // 10 минут
    })
  } catch (error) {
    console.error('❌ Ошибка при сохранении данных пользователя:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

