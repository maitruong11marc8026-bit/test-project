'use client';

import { usePlannerStore } from '@/store/usePlannerStore';
import { getGuestCount } from '@/utils/calculations';

export default function Dashboard() {
  const { event, guests, budget, tasks, shoppingList, setActiveTab } = usePlannerStore();

  const { effective, adults, children } = getGuestCount(guests);
  const confirmed = guests.filter(g => g.status === 'confirmed').length;

  const totalExpenses = budget.expenses.reduce((s, e) => s + e.amount, 0);
  const remaining = budget.total - totalExpenses;
  const budgetPct = budget.total > 0 ? Math.min(100, Math.round((totalExpenses / budget.total) * 100)) : 0;

  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const taskPct = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;
  const overdueTasks = tasks.filter(t => t.status !== 'completed' && t.deadline && new Date(t.deadline) < new Date());

  const purchasedItems = shoppingList.filter(i => i.isPurchased).length;
  const shoppingPct = shoppingList.length > 0 ? Math.round((purchasedItems / shoppingList.length) * 100) : 0;

  const daysUntil = event.date
    ? Math.ceil((new Date(event.date).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : null;

  const urgentTasks = tasks
    .filter(t => t.status !== 'completed' && t.priority === 'high')
    .slice(0, 3);

  const topExpenses = budget.expenses
    .slice()
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 3);

  return (
    <div className="fade-in" style={{ maxWidth: 960, margin: '0 auto' }}>
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ margin: 0, fontSize: 24, fontWeight: 800 }}>
          Привет! 👋 {event.title ? `Планируем «${event.title}»` : 'Добро пожаловать в Birthday Planner'}
        </h2>
        <p style={{ margin: '8px 0 0', color: 'var(--text-muted)', fontSize: 15 }}>
          {daysUntil !== null
            ? daysUntil > 0
              ? `До события ${daysUntil} ${pluralDays(daysUntil)}`
              : daysUntil === 0
              ? '🎉 Сегодня праздник!'
              : 'Мероприятие уже прошло'
            : 'Установите дату события, чтобы видеть обратный отсчёт'}
        </p>
      </div>

      {/* Countdown bar */}
      {daysUntil !== null && daysUntil >= 0 && (
        <div className="card" style={{ padding: '18px 24px', marginBottom: 20, background: 'rgba(233,30,140,0.04)', borderColor: 'rgba(233,30,140,0.2)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
            <span style={{ fontWeight: 600, fontSize: 14 }}>📅 Обратный отсчёт</span>
            <span className="gradient-text" style={{ fontWeight: 800 }}>{daysUntil} {pluralDays(daysUntil)}</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${Math.max(4, 100 - (daysUntil / 90) * 100)}%` }} />
          </div>
          {event.location && (
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 8 }}>
              📍 {event.location}  ·  🕐 {event.time}
            </div>
          )}
        </div>
      )}

      {/* KPI cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, marginBottom: 20 }}>
        <KpiCard
          icon="👥" title="Гости"
          primary={`${confirmed} / ${guests.length}`}
          sub={`Эф. порций: ${effective}${children > 0 ? ` (${children} детей ×0.6)` : ''}`}
          pct={guests.length > 0 ? Math.round((confirmed / guests.length) * 100) : 0}
          color="var(--accent2)"
          onClick={() => setActiveTab('guests')}
        />
        <KpiCard
          icon="💰" title="Бюджет"
          primary={`${totalExpenses.toLocaleString('ru-RU')} ₽`}
          sub={`Остаток: ${remaining >= 0 ? '+' : ''}${remaining.toLocaleString('ru-RU')} ₽`}
          pct={budgetPct}
          color={budgetPct > 90 ? 'var(--danger)' : 'var(--warning)'}
          onClick={() => setActiveTab('budget')}
        />
        <KpiCard
          icon="✅" title="Задачи"
          primary={`${completedTasks} / ${tasks.length}`}
          sub={overdueTasks.length > 0 ? `⚠️ ${overdueTasks.length} просрочено` : tasks.length > 0 ? 'Всё идёт по плану' : 'Задачи не добавлены'}
          pct={taskPct}
          color="var(--success)"
          onClick={() => setActiveTab('tasks')}
        />
        <KpiCard
          icon="🛒" title="Список покупок"
          primary={`${purchasedItems} / ${shoppingList.length}`}
          sub={shoppingList.length === 0 ? 'Создайте список из раздела "Еда"' : `Куплено ${shoppingPct}%`}
          pct={shoppingPct}
          color="var(--accent3)"
          onClick={() => setActiveTab('shopping')}
        />
      </div>

      {/* Bottom row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Urgent tasks */}
        <div className="card" style={{ padding: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
            <span style={{ fontWeight: 700, fontSize: 15 }}>🔥 Срочные задачи</span>
            <button
              onClick={() => setActiveTab('tasks')}
              style={{ fontSize: 12, color: 'var(--accent2)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}
            >
              Все →
            </button>
          </div>
          {urgentTasks.length === 0 ? (
            <EmptyMini icon="✅" text="Срочных задач нет" />
          ) : (
            urgentTasks.map(t => (
              <div key={t.id} style={{
                padding: '10px 12px', borderRadius: 10, marginBottom: 8,
                background: 'rgba(255,71,87,0.07)', border: '1px solid rgba(255,71,87,0.2)',
                display: 'flex', alignItems: 'center', gap: 10,
              }}>
                <span style={{ fontSize: 16 }}>🔴</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 500 }}>{t.title}</div>
                  {t.deadline && (
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                      до {new Date(t.deadline).toLocaleDateString('ru-RU')}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Top expenses */}
        <div className="card" style={{ padding: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
            <span style={{ fontWeight: 700, fontSize: 15 }}>💸 Топ расходов</span>
            <button
              onClick={() => setActiveTab('budget')}
              style={{ fontSize: 12, color: 'var(--accent2)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}
            >
              Все →
            </button>
          </div>
          {topExpenses.length === 0 ? (
            <EmptyMini icon="💰" text="Расходов ещё нет" />
          ) : (
            topExpenses.map(e => {
              const icons: Record<string, string> = { food: '🍽️', decor: '🎀', entertainment: '🎭', other: '📦' };
              return (
                <div key={e.id} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '8px 0', borderBottom: '1px solid var(--border)',
                }}>
                  <span style={{ fontSize: 14 }}>
                    {icons[e.category]} {e.title}
                  </span>
                  <span style={{ fontWeight: 700, color: 'var(--accent)', fontSize: 15 }}>
                    {e.amount.toLocaleString('ru-RU')} ₽
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Quick actions */}
      <div style={{ marginTop: 20 }}>
        <div style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 600, marginBottom: 12 }}>
          БЫСТРЫЕ ДЕЙСТВИЯ
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {[
            { label: '+ Добавить гостя', tab: 'guests', icon: '👤' },
            { label: '+ Задача', tab: 'tasks', icon: '✅' },
            { label: '🍽️ Рассчитать еду', tab: 'food', icon: '🍽️' },
            { label: '🛒 Список покупок', tab: 'shopping', icon: '🛒' },
            { label: '💡 Новая идея', tab: 'ideas', icon: '💡' },
          ].map(a => (
            <button
              key={a.tab}
              className="btn-ghost"
              style={{ padding: '10px 18px', fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }}
              onClick={() => setActiveTab(a.tab)}
            >
              {a.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function KpiCard({
  icon, title, primary, sub, pct, color, onClick,
}: {
  icon: string; title: string; primary: string; sub: string;
  pct: number; color: string; onClick: () => void;
}) {
  return (
    <div
      className="card card-hover"
      style={{ padding: '20px 22px', cursor: 'pointer' }}
      onClick={onClick}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, marginBottom: 4 }}>
            {icon} {title}
          </div>
          <div style={{ fontSize: 26, fontWeight: 800 }}>{primary}</div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>{sub}</div>
        </div>
        <div style={{
          width: 48, height: 48, borderRadius: '50%',
          background: `conic-gradient(${color} ${pct * 3.6}deg, rgba(255,255,255,0.06) 0deg)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 13, fontWeight: 800, color,
          flexShrink: 0,
        }}>
          {pct}%
        </div>
      </div>
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}

function EmptyMini({ icon, text }: { icon: string; text: string }) {
  return (
    <div style={{ padding: '20px 0', textAlign: 'center', color: 'var(--text-muted)', fontSize: 14 }}>
      <div style={{ fontSize: 28, marginBottom: 8 }}>{icon}</div>
      {text}
    </div>
  );
}

function pluralDays(n: number) {
  if (n % 100 >= 11 && n % 100 <= 19) return 'дней';
  if (n % 10 === 1) return 'день';
  if (n % 10 >= 2 && n % 10 <= 4) return 'дня';
  return 'дней';
}
