'use client'

import { useState } from 'react'

export interface SimpleTelegramUser {
  id: string
  first_name: string
  last_name?: string
  username?: string
}

interface SimpleTelegramAuthProps {
  onAuth: (user: SimpleTelegramUser) => void
}

export default function SimpleTelegramAuth({ onAuth }: SimpleTelegramAuthProps) {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    username: '',
  })
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!formData.first_name.trim()) {
      setError('Пожалуйста, введите имя')
      return
    }

    // Генерируем временный ID (в реальности должен быть из Telegram)
    const user: SimpleTelegramUser = {
      id: `temp_${Date.now()}`,
      first_name: formData.first_name.trim(),
      last_name: formData.last_name.trim() || undefined,
      username: formData.username.trim().replace('@', '') || undefined,
    }

    onAuth(user)
  }

  return (
    <form onSubmit={handleSubmit} style={{ padding: '1.5rem', background: '#f8f9fa', borderRadius: '8px' }}>
      <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>Введите данные Telegram</h3>
      
      {error && (
        <div style={{ 
          padding: '0.75rem', 
          background: '#f8d7da', 
          color: '#721c24', 
          borderRadius: '4px', 
          marginBottom: '1rem',
          fontSize: '0.9rem'
        }}>
          {error}
        </div>
      )}

      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
          Имя <span style={{ color: 'red' }}>*</span>
        </label>
        <input
          type="text"
          value={formData.first_name}
          onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
          placeholder="Ваше имя"
          required
          style={{
            width: '100%',
            padding: '0.75rem',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '1rem'
          }}
        />
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
          Фамилия
        </label>
        <input
          type="text"
          value={formData.last_name}
          onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
          placeholder="Ваша фамилия (необязательно)"
          style={{
            width: '100%',
            padding: '0.75rem',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '1rem'
          }}
        />
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
          Telegram Username
        </label>
        <input
          type="text"
          value={formData.username}
          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          placeholder="@username или username"
          style={{
            width: '100%',
            padding: '0.75rem',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '1rem'
          }}
        />
        <p style={{ marginTop: '0.25rem', fontSize: '0.85rem', color: '#666' }}>
          Введите ваш Telegram username (необязательно, но желательно)
        </p>
      </div>

      <button
        type="submit"
        className="button"
        style={{ width: '100%' }}
      >
        Продолжить
      </button>
    </form>
  )
}

