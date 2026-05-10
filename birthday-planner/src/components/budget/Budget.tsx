'use client';

import { useState } from 'react';
import { usePlannerStore } from '@/store/usePlannerStore';
import type { ExpenseCategory } from '@/types';

const CATEGORY_CONFIG: Record<ExpenseCategory, { label: string; icon: string; color: string }> = {
  food: { label: 'Еда', icon: '🍽️', color: 'var(--accent)' },
  decor: { label: 'Декор', icon: '🎀', color: 'var(--accent3)' },
  entertainment: { label: 'Развлечения', icon: '🎭', color: 'var(--accent2)' },
  other: { label: 'Прочее', icon: '📦', color: 'var(--text-muted)' },
};

export default function Budget() {
  const { budget, setBudgetTotal, addExpense, updateExpense, removeExpense } = usePlannerStore();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', amount: '', category: 'food' as ExpenseCategory, date: new Date().toISOString().split('T')[0] });
  const [editBudget, setEditBudget] = useState(false);
  const [budgetInput, setBudgetInput] = useState(String(budget.total));

  const totalExpenses = budget.expenses.reduce((s, e) => s + e.amount, 0);
  const remaining = budget.total - totalExpenses;
  const pct = Math.min(100, (totalExpenses / budget.total) * 100) || 0;

  const byCategory = Object.entries(CATEGORY_CONFIG).map(([cat, cfg]) => ({
    ...cfg,
    category: cat as ExpenseCategory,
    total: budget.expenses.filter(e => e.category === cat).reduce((s, e) => s + e.amount, 0),
  }));

  const handleAdd = () => {
    const amount = parseFloat(form.amount);
    if (!form.title.trim() || isNaN(amount) || amount <= 0) return;
    addExpense({ title: form.title, amount, category: form.category, date: form.date });
    setForm({ title: '', amount: '', category: 'food', date: new Date().toISOString().split('T')[0] });
    setShowForm(false);
  };

  return (
    <div className="fade-in" style={{ maxWidth: 800, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700 }}>💰 Бюджет</h2>
          <p style={{ margin: '6px 0 0', fontSize: 14, color: 'var(--text-muted)' }}>Планируйте расходы и следите за балансом</p>
        </div>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? '✕ Отмена' : '+ Добавить расход'}
        </button>
      </div>

      {/* Budget overview */}
      <div className="card" style={{ padding: 24, marginBottom: 16, background: remaining < 0 ? 'rgba(255,71,87,0.05)' : 'rgba(0,229,160,0.03)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 4 }}>Общий бюджет</div>
            {editBudget ? (
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <input
                  className="input-base"
                  type="number"
                  value={budgetInput}
                  onChange={e => setBudgetInput(e.target.value)}
                  style={{ width: 160 }}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      setBudgetTotal(parseFloat(budgetInput) || 0);
                      setEditBudget(false);
                    }
                  }}
                  autoFocus
                />
                <button className="btn-primary" style={{ padding: '8px 14px' }} onClick={() => {
                  setBudgetTotal(parseFloat(budgetInput) || 0);
                  setEditBudget(false);
                }}>✓</button>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 28, fontWeight: 800 }}>{budget.total.toLocaleString('ru-RU')} ₽</span>
                <button
                  className="btn-ghost"
                  style={{ padding: '4px 10px', fontSize: 12 }}
                  onClick={() => { setEditBudget(true); setBudgetInput(String(budget.total)); }}
                >✏️</button>
              </div>
            )}
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 4 }}>Остаток</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: remaining < 0 ? 'var(--danger)' : 'var(--success)' }}>
              {remaining < 0 ? '-' : '+'}{Math.abs(remaining).toLocaleString('ru-RU')} ₽
            </div>
          </div>
        </div>

        <div style={{ marginBottom: 8 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 13, color: 'var(--text-muted)' }}>
            <span>Потрачено: {totalExpenses.toLocaleString('ru-RU')} ₽</span>
            <span>{Math.round(pct)}%</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${pct}%`, background: pct > 90 ? 'var(--danger)' : undefined }} />
          </div>
        </div>
      </div>

      {/* By category */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 20 }}>
        {byCategory.map(cat => (
          <div key={cat.category} className="card" style={{ padding: 14, textAlign: 'center' }}>
            <div style={{ fontSize: 22 }}>{cat.icon}</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: cat.color, marginTop: 6 }}>
              {cat.total.toLocaleString('ru-RU')}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>₽ {cat.label}</div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="card slide-in" style={{ padding: 20, marginBottom: 16, borderColor: 'rgba(123,47,247,0.3)' }}>
          <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 16 }}>Новый расход</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={labelStyle}>Название *</label>
              <input className="input-base" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="Что купили?" />
            </div>
            <div>
              <label style={labelStyle}>Сумма (₽) *</label>
              <input className="input-base" type="number" value={form.amount} onChange={e => setForm(p => ({ ...p, amount: e.target.value }))} placeholder="0" />
            </div>
            <div>
              <label style={labelStyle}>Категория</label>
              <select className="input-base" value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value as ExpenseCategory }))}>
                {Object.entries(CATEGORY_CONFIG).map(([v, c]) => (
                  <option key={v} value={v}>{c.icon} {c.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Дата</label>
              <input className="input-base" type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
            <button className="btn-primary" onClick={handleAdd}>Добавить</button>
            <button className="btn-ghost" onClick={() => setShowForm(false)}>Отмена</button>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {budget.expenses.length === 0 ? (
          <div className="card" style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>💰</div>
            <div>Добавьте первый расход</div>
          </div>
        ) : (
          budget.expenses
            .slice()
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .map(expense => {
              const cfg = CATEGORY_CONFIG[expense.category];
              return (
                <div
                  key={expense.id}
                  className="card card-hover"
                  style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 14 }}
                >
                  <div style={{ fontSize: 24 }}>{cfg.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600 }}>{expense.title}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                      {cfg.label} · {new Date(expense.date).toLocaleDateString('ru-RU')}
                    </div>
                  </div>
                  <div style={{ fontWeight: 700, fontSize: 18, color: cfg.color }}>
                    {expense.amount.toLocaleString('ru-RU')} ₽
                  </div>
                  <button className="btn-danger" onClick={() => removeExpense(expense.id)}>✕</button>
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
