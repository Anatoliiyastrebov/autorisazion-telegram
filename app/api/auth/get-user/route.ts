import { NextRequest, NextResponse } from 'next/server'
import { verifyAuthToken } from '@/lib/auth-tokens'

export const dynamic = 'force-dynamic'

// API для получения данных пользователя после авторизации через бота
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const token = searchParams.get('token')
    const userId = searchParams.get('user_id')
    
    if (!token || !userId) {
      return NextResponse.json(
        { error: 'Token and user_id are required' },
        { status: 400 }
      )
    }
    
    // Проверяем токен
    const verifiedUserId = verifyAuthToken(token)
    if (!verifiedUserId || verifiedUserId !== parseInt(userId)) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      )
    }
    
    // Получаем данные пользователя из Telegram Bot API
    const botToken = process.env.TELEGRAM_BOT_TOKEN
    if (!botToken) {
      return NextResponse.json(
        { error: 'Bot token not configured' },
        { status: 500 }
      )
    }
    
    try {
      const telegramResponse = await fetch(
        `https://api.telegram.org/bot${botToken}/getChat?chat_id=${userId}`
      )
      
      if (!telegramResponse.ok) {
        throw new Error('Failed to get user from Telegram API')
      }
      
      const telegramData = await telegramResponse.json()
      
      if (!telegramData.ok) {
        throw new Error(telegramData.description || 'Telegram API error')
      }
      
      const chat = telegramData.result
      
      return NextResponse.json({
        id: chat.id,
        first_name: chat.first_name || '',
        last_name: chat.last_name || '',
        username: chat.username || '',
        photo_url: '', // Фото нужно получать отдельно
      })
    } catch (error) {
      console.error('❌ Ошибка при получении данных пользователя из Telegram:', error)
      // Возвращаем минимальные данные
      return NextResponse.json({
        id: parseInt(userId),
        first_name: 'Пользователь',
        last_name: '',
        username: '',
        photo_url: '',
      })
    }
  } catch (error) {
    console.error('❌ Ошибка в get-user API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

