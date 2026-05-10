'use client';

import Link from 'next/link';
import { usePlannerStore } from '@/store/usePlannerStore';
import { getGuestCount } from '@/utils/calculations';

const TABS = [
  { id: 'dashboard', label: 'Дашборд', icon: '📊' },
  { id: 'event',     label: 'Событие', icon: '🎂' },
  { id: 'guests',    label: 'Гости',   icon: '👥' },
  { id: 'budget',    label: 'Бюджет',  icon: '💰' },
  { id: 'tasks',     label: 'Задачи',  icon: '✅' },
  { id: 'timeline',  label: 'Таймлайн',icon: '⏱️' },
  { id: 'ideas',     label: 'Идеи',    icon: '💡' },
  { id: 'food',      label: 'Еда',     icon: '🍽️' },
  { id: 'shopping',  label: 'Покупки', icon: '🛒' },
];

export default function Sidebar({ onClose }: { onClose?: () => void }) {
  const { activeTab, setActiveTab, guests, budget, tasks } = usePlannerStore();
  const { effective } = getGuestCount(guests);
  const confirmed    = guests.filter(g => g.status === 'confirmed').length;
  const totalExp     = budget.expenses.reduce((s, e) => s + e.amount, 0);
  const remaining    = budget.total - totalExp;
  const completedT   = tasks.filter(t => t.status === 'completed').length;

  const handleNav = (id: string) => {
    setActiveTab(id);
    onClose?.();
  };

  return (
    <aside style={{
      width: 220,
      height: '100vh',
      background: 'rgba(15,15,26,0.95)',
      borderRight: '1px solid var(--border)',
      display: 'flex',
      flexDirection: 'column',
      padding: '20px 10px',
      gap: 2,
      backdropFilter: 'blur(20px)',
      overflowY: 'auto',
    }}>
      {/* Logo */}
      <div style={{ padding: '4px 10px', marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 900, letterSpacing: -0.5, lineHeight: 1 }} className="gradient-text">
              🎉 Birthday
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 1 }}>Planner</div>
          </div>
        </Link>
        {onClose && (
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 18, padding: 4 }}>
            ✕
          </button>
        )}
      </div>

      {/* Nav items */}
      <nav style={{ flex: 1 }}>
        {TABS.map(tab => {
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleNav(tab.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                width: '100%', padding: '9px 12px',
                borderRadius: 10, border: 'none', cursor: 'pointer',
                marginBottom: 2,
                background: active
                  ? 'linear-gradient(135deg, rgba(233,30,140,0.18), rgba(123,47,247,0.18))'
                  : 'transparent',
                color: active ? 'var(--text)' : 'var(--text-muted)',
                fontSize: 14, fontWeight: active ? 600 : 400,
                borderLeft: `2px solid ${active ? 'var(--accent)' : 'transparent'}`,
                transition: 'all 0.15s',
                textAlign: 'left',
              }}
              onMouseEnter={e => { if (!active) (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.04)'; }}
              onMouseLeave={e => { if (!active) (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
            >
              <span style={{ fontSize: 16, flexShrink: 0 }}>{tab.icon}</span>
              {tab.label}
            </button>
          );
        })}
      </nav>

      {/* Stats card */}
      <div className="card" style={{ padding: '14px 12px', margin: '10px 0 0' }}>
        <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 10 }}>
          Статистика
        </div>
        {[
          { icon: '👥', label: 'Гостей',     val: `${confirmed}/${guests.length}` },
          { icon: '🍽️', label: 'Порций',     val: effective },
          { icon: '💰', label: 'Остаток',    val: `${(remaining / 1000).toFixed(0)}к ₽`, color: remaining < 0 ? 'var(--danger)' : 'var(--success)' },
          { icon: '✅', label: 'Задач',      val: `${completedT}/${tasks.length}` },
        ].map(s => (
          <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 7 }}>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{s.icon} {s.label}</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: s.color || 'var(--text)' }}>{s.val}</span>
          </div>
        ))}
      </div>
    </aside>
  );
}
