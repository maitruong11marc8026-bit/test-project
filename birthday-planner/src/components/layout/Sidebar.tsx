'use client';

import { usePlannerStore } from '@/store/usePlannerStore';
import { getGuestCount } from '@/utils/calculations';

const TABS = [
  { id: 'event', label: 'Событие', icon: '🎂' },
  { id: 'guests', label: 'Гости', icon: '👥' },
  { id: 'budget', label: 'Бюджет', icon: '💰' },
  { id: 'tasks', label: 'Задачи', icon: '✅' },
  { id: 'timeline', label: 'Таймлайн', icon: '⏱️' },
  { id: 'ideas', label: 'Идеи', icon: '💡' },
  { id: 'food', label: 'Еда', icon: '🍽️' },
  { id: 'shopping', label: 'Покупки', icon: '🛒' },
];

export default function Sidebar() {
  const { activeTab, setActiveTab, guests, budget, tasks } = usePlannerStore();
  const { effective } = getGuestCount(guests);
  const confirmed = guests.filter(g => g.status === 'confirmed').length;
  const totalExpenses = budget.expenses.reduce((s, e) => s + e.amount, 0);
  const remaining = budget.total - totalExpenses;
  const completedTasks = tasks.filter(t => t.status === 'completed').length;

  return (
    <aside
      style={{
        width: 220,
        minHeight: '100vh',
        background: 'rgba(255,255,255,0.02)',
        borderRight: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        padding: '24px 12px',
        gap: 4,
        flexShrink: 0,
      }}
    >
      <div style={{ marginBottom: 24, padding: '0 8px' }}>
        <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: -0.5 }} className="gradient-text">
          🎉 Birthday
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>Planner</div>
      </div>

      {TABS.map(tab => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '10px 12px',
            borderRadius: 10,
            border: 'none',
            cursor: 'pointer',
            background: activeTab === tab.id
              ? 'linear-gradient(135deg, rgba(233,30,140,0.2), rgba(123,47,247,0.2))'
              : 'transparent',
            color: activeTab === tab.id ? 'var(--text)' : 'var(--text-muted)',
            fontSize: 14,
            fontWeight: activeTab === tab.id ? 600 : 400,
            borderLeft: activeTab === tab.id ? '2px solid var(--accent)' : '2px solid transparent',
            transition: 'all 0.15s',
            textAlign: 'left',
          }}
          onMouseEnter={e => {
            if (activeTab !== tab.id) {
              (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.04)';
              (e.currentTarget as HTMLButtonElement).style.color = 'var(--text)';
            }
          }}
          onMouseLeave={e => {
            if (activeTab !== tab.id) {
              (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
              (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-muted)';
            }
          }}
        >
          <span style={{ fontSize: 16 }}>{tab.icon}</span>
          {tab.label}
        </button>
      ))}

      <div style={{ flex: 1 }} />

      <div className="card" style={{ padding: 14, margin: '0 0', marginTop: 12 }}>
        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>
          Статистика
        </div>
        <Stat label="Гостей" value={`${confirmed}/${guests.length}`} icon="👥" />
        <Stat label="Эф. порций" value={effective} icon="🍽️" />
        <Stat label="Бюджет" value={`${(remaining / 1000).toFixed(0)}к`} icon="💰" color={remaining < 0 ? 'var(--danger)' : 'var(--success)'} />
        <Stat label="Задач" value={`${completedTasks}/${tasks.length}`} icon="✅" />
      </div>
    </aside>
  );
}

function Stat({ label, value, icon, color }: { label: string; value: string | number; icon: string; color?: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
      <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{icon} {label}</span>
      <span style={{ fontSize: 13, fontWeight: 600, color: color || 'var(--text)' }}>{value}</span>
    </div>
  );
}
