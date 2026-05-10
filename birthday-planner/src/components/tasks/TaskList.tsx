'use client';

import { useState } from 'react';
import { usePlannerStore } from '@/store/usePlannerStore';
import type { TaskPriority, TaskStatus } from '@/types';

const PRIORITY_CONFIG: Record<TaskPriority, { label: string; color: string; bg: string }> = {
  low: { label: 'Низкий', color: '#8892b0', bg: 'rgba(136,146,176,0.12)' },
  medium: { label: 'Средний', color: 'var(--warning)', bg: 'rgba(255,184,0,0.12)' },
  high: { label: 'Высокий', color: 'var(--danger)', bg: 'rgba(255,71,87,0.12)' },
};

const STATUS_CONFIG: Record<TaskStatus, { label: string; color: string }> = {
  pending: { label: 'Ожидает', color: 'var(--text-muted)' },
  in_progress: { label: 'В процессе', color: 'var(--accent3)' },
  completed: { label: 'Выполнено', color: 'var(--success)' },
};

export default function TaskList() {
  const { tasks, addTask, updateTask, removeTask } = usePlannerStore();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', deadline: '', priority: 'medium' as TaskPriority, status: 'pending' as TaskStatus });
  const [filter, setFilter] = useState<TaskStatus | 'all'>('all');

  const handleAdd = () => {
    if (!form.title.trim()) return;
    addTask(form);
    setForm({ title: '', deadline: '', priority: 'medium', status: 'pending' });
    setShowForm(false);
  };

  const filtered = filter === 'all' ? tasks : tasks.filter(t => t.status === filter);
  const completed = tasks.filter(t => t.status === 'completed').length;
  const pct = tasks.length > 0 ? Math.round((completed / tasks.length) * 100) : 0;

  return (
    <div className="fade-in" style={{ maxWidth: 800, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700 }}>✅ Список задач</h2>
          <p style={{ margin: '6px 0 0', fontSize: 14, color: 'var(--text-muted)' }}>Отслеживайте прогресс подготовки</p>
        </div>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? '✕ Отмена' : '+ Добавить задачу'}
        </button>
      </div>

      <div className="card" style={{ padding: 20, marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
          <span style={{ fontSize: 14, fontWeight: 600 }}>Прогресс: {completed}/{tasks.length} задач</span>
          <span className="gradient-text" style={{ fontWeight: 700 }}>{pct}%</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${pct}%` }} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginTop: 16 }}>
          {Object.entries(STATUS_CONFIG).map(([s, cfg]) => (
            <div key={s} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: cfg.color }}>
                {tasks.filter(t => t.status === s).length}
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{cfg.label}</div>
            </div>
          ))}
        </div>
      </div>

      {showForm && (
        <div className="card slide-in" style={{ padding: 20, marginBottom: 16, borderColor: 'rgba(123,47,247,0.3)' }}>
          <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 16 }}>Новая задача</div>
          <div style={{ display: 'grid', gap: 12 }}>
            <div>
              <label style={labelStyle}>Задача *</label>
              <input
                className="input-base"
                value={form.title}
                onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                placeholder="Что нужно сделать?"
                onKeyDown={e => e.key === 'Enter' && handleAdd()}
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
              <div>
                <label style={labelStyle}>Дедлайн</label>
                <input className="input-base" type="date" value={form.deadline} onChange={e => setForm(p => ({ ...p, deadline: e.target.value }))} />
              </div>
              <div>
                <label style={labelStyle}>Приоритет</label>
                <select className="input-base" value={form.priority} onChange={e => setForm(p => ({ ...p, priority: e.target.value as TaskPriority }))}>
                  <option value="low">Низкий</option>
                  <option value="medium">Средний</option>
                  <option value="high">Высокий</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Статус</label>
                <select className="input-base" value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value as TaskStatus }))}>
                  <option value="pending">Ожидает</option>
                  <option value="in_progress">В процессе</option>
                  <option value="completed">Выполнено</option>
                </select>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
            <button className="btn-primary" onClick={handleAdd}>Добавить</button>
            <button className="btn-ghost" onClick={() => setShowForm(false)}>Отмена</button>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {(['all', 'pending', 'in_progress', 'completed'] as const).map(s => (
          <button
            key={s}
            className={`tab-pill ${filter === s ? 'active' : ''}`}
            onClick={() => setFilter(s)}
          >
            {s === 'all' ? '🌐 Все' : STATUS_CONFIG[s].label}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {filtered.length === 0 ? (
          <div className="card" style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>✅</div>
            <div>Нет задач. Добавьте первую!</div>
          </div>
        ) : (
          filtered
            .slice()
            .sort((a, b) => {
              const pOrder = { high: 0, medium: 1, low: 2 };
              return pOrder[a.priority] - pOrder[b.priority];
            })
            .map(task => {
              const pCfg = PRIORITY_CONFIG[task.priority];
              const sCfg = STATUS_CONFIG[task.status];
              const isOverdue = task.deadline && task.status !== 'completed' && new Date(task.deadline) < new Date();
              return (
                <div
                  key={task.id}
                  className="card card-hover"
                  style={{
                    padding: '14px 18px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14,
                    opacity: task.status === 'completed' ? 0.6 : 1,
                    borderLeft: `3px solid ${pCfg.color}`,
                  }}
                >
                  <input
                    type="checkbox"
                    checked={task.status === 'completed'}
                    onChange={() => updateTask(task.id, { status: task.status === 'completed' ? 'pending' : 'completed' })}
                    style={{ flexShrink: 0 }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontWeight: 600,
                      textDecoration: task.status === 'completed' ? 'line-through' : 'none',
                    }}>
                      {task.title}
                    </div>
                    <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                      {task.deadline && (
                        <span style={{ fontSize: 12, color: isOverdue ? 'var(--danger)' : 'var(--text-muted)' }}>
                          📅 {new Date(task.deadline).toLocaleDateString('ru-RU')}
                          {isOverdue && ' ⚠️'}
                        </span>
                      )}
                      <span className="badge" style={{ background: pCfg.bg, color: pCfg.color }}>
                        {pCfg.label}
                      </span>
                    </div>
                  </div>
                  <select
                    className="input-base"
                    value={task.status}
                    onChange={e => updateTask(task.id, { status: e.target.value as TaskStatus })}
                    style={{ width: 'auto', minWidth: 140, fontSize: 13, color: sCfg.color }}
                  >
                    <option value="pending">Ожидает</option>
                    <option value="in_progress">В процессе</option>
                    <option value="completed">Выполнено</option>
                  </select>
                  <button className="btn-danger" onClick={() => removeTask(task.id)}>✕</button>
                </div>
              );
            })
        )}
      </div>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 13,
  fontWeight: 600,
  color: 'var(--text-muted)',
  marginBottom: 6,
};
