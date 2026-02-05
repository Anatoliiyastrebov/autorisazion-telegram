import { NextRequest, NextResponse } from 'next/server'
import { saveAuthSession } from '@/lib/auth-tokens'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { returnUrl, questionnaireType } = body

    if (!returnUrl) {
      return NextResponse.json(
        { error: 'Return URL is required' },
        { status: 400 }
      )
    }

    // Сохраняем сессию и получаем ID
    const sessionId = saveAuthSession(returnUrl, questionnaireType || '')

    console.log(`✅ Сессия создана: ${sessionId} -> ${returnUrl}`)

    return NextResponse.json({
      success: true,
      sessionId
    })
  } catch (error) {
    console.error('❌ Ошибка при создании сессии:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
