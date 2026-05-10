'use client';

import Link from 'next/link';
import { usePlannerStore } from '@/store/usePlannerStore';

export default function Header({ onMenuClick }: { onMenuClick?: () => void }) {
  const { event } = usePlannerStore();

  const TYPE_LABEL: Record<string, string> = {
    adults: '🥂 Взрослый',
    kids:   '🧒 Детский',
    themed: '🎭 Тематический',
  };
  const TYPE_COLOR: Record<string, string> = {
    adults: 'var(--accent2)',
    kids:   'var(--warning)',
    themed: 'var(--accent3)',
  };

  return (
    <header style={{
      height: 60, flexShrink: 0,
      padding: '0 24px',
      borderBottom: '1px solid var(--border)',
      background: 'rgba(15,15,26,0.9)',
      backdropFilter: 'blur(12px)',
      display: 'flex', alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky', top: 0, zIndex: 20,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        {/* Hamburger for mobile */}
        {onMenuClick && (
          <button
            onClick={onMenuClick}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--text-muted)', fontSize: 20, padding: 4,
              display: 'flex',
            }}
            className="menu-btn"
          >
            ☰
          </button>
        )}
        <div>
          <div style={{ fontWeight: 700, fontSize: 16, lineHeight: 1.2 }}>
            {event.title || 'День рождения'} 🎂
          </div>
          {event.date && (
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
              📅 {new Date(event.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' })}
              {event.location && ` · 📍 ${event.location}`}
            </div>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {event.type && (
          <span style={{
            padding: '4px 12px', borderRadius: 100,
            fontSize: 12, fontWeight: 600,
            background: `${TYPE_COLOR[event.type]}18`,
            color: TYPE_COLOR[event.type],
            border: `1px solid ${TYPE_COLOR[event.type]}44`,
          }}>
            {TYPE_LABEL[event.type]}
          </span>
        )}
        <Link href="/" style={{ textDecoration: 'none' }}>
          <button className="btn-ghost" style={{ padding: '6px 14px', fontSize: 12 }}>
            ← На главную
          </button>
        </Link>
      </div>
    </header>
  );
}
