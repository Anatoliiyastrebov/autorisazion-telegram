import { NextRequest, NextResponse } from 'next/server'
import { verifyAuthToken, deleteAuthToken } from '@/lib/auth-tokens'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const token = searchParams.get('token')
    const userId = searchParams.get('user_id')
    
    if (!token || !userId) {
      return NextResponse.redirect(new URL('/?error=invalid_params', request.url))
    }
    
    // Проверяем токен
    const verifiedUserId = verifyAuthToken(token)
    if (!verifiedUserId || verifiedUserId !== parseInt(userId)) {
      return NextResponse.redirect(new URL('/?error=invalid_token', request.url))
    }
    
    // Удаляем использованный токен
    deleteAuthToken(token)
    
    // Перенаправляем на главную страницу с параметром авторизации
    const redirectUrl = new URL('/', request.url)
    redirectUrl.searchParams.set('auth_token', token)
    redirectUrl.searchParams.set('user_id', userId)
    
    return NextResponse.redirect(redirectUrl)
  } catch (error) {
    console.error('❌ Ошибка в auth callback:', error)
    return NextResponse.redirect(new URL('/?error=server_error', request.url))
  }
}


