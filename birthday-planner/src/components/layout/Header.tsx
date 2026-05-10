'use client';

import { usePlannerStore } from '@/store/usePlannerStore';

export default function Header() {
  const { event } = usePlannerStore();

  return (
    <header
      style={{
        padding: '16px 28px',
        borderBottom: '1px solid var(--border)',
        background: 'rgba(255,255,255,0.02)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backdropFilter: 'blur(8px)',
        position: 'sticky',
        top: 0,
        zIndex: 10,
      }}
    >
      <div>
        <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, letterSpacing: -0.3 }}>
          {event.title || 'День рождения'} 🎂
        </h1>
        {event.date && (
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
            📅 {new Date(event.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}
            {event.location ? ` · 📍 ${event.location}` : ''}
          </div>
        )}
      </div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <div
          style={{
            padding: '6px 14px',
            borderRadius: 100,
            fontSize: 12,
            fontWeight: 600,
            background: event.type === 'kids'
              ? 'rgba(255,184,0,0.15)'
              : event.type === 'themed'
              ? 'rgba(0,212,255,0.15)'
              : 'rgba(123,47,247,0.15)',
            color: event.type === 'kids'
              ? 'var(--warning)'
              : event.type === 'themed'
              ? 'var(--accent3)'
              : 'var(--accent2)',
            border: '1px solid currentColor',
          }}
        >
          {event.type === 'kids' ? '🧒 Детский' : event.type === 'themed' ? '🎭 Тематический' : '🥂 Взрослый'}
        </div>
      </div>
    </header>
  );
}
