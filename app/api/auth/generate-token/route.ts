import { NextRequest, NextResponse } from 'next/server'
import { generateAuthToken } from '@/lib/auth-tokens'

export const dynamic = 'force-dynamic'

// API для генерации токена авторизации (вызывается ботом)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, botToken } = body
    
    // Проверяем токен бота
    const expectedBotToken = process.env.TELEGRAM_BOT_TOKEN
    if (botToken !== expectedBotToken) {
      return NextResponse.json(
        { error: 'Invalid bot token' },
        { status: 401 }
      )
    }
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }
    
    // Генерируем токен
    const token = generateAuthToken(parseInt(userId))
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || request.nextUrl.origin
    const callbackUrl = `${siteUrl}/api/auth/callback?token=${token}&user_id=${userId}`
    
    return NextResponse.json({
      token,
      callbackUrl,
      expiresIn: 300 // 5 минут
    })
  } catch (error) {
    console.error('❌ Ошибка при генерации токена:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

