'use client';

import { useState } from 'react';
import { usePlannerStore } from '@/store/usePlannerStore';
import { exportToCSV, downloadCSV, copyToClipboard } from '@/utils/calculations';
import type { IngredientCategory, ShoppingItem } from '@/types';

const CAT: Record<IngredientCategory, { label: string; icon: string; color: string }> = {
  vegetables: { label: 'Овощи',    icon: '🥦', color: '#00e5a0' },
  meat:       { label: 'Мясо',     icon: '🥩', color: '#ff6b6b' },
  drinks:     { label: 'Напитки',  icon: '🥤', color: '#00d4ff' },
  bakery:     { label: 'Бакалея',  icon: '🌾', color: '#ffb800' },
  dairy:      { label: 'Молочное', icon: '🥛', color: '#e0e0e0' },
  fruits:     { label: 'Фрукты',   icon: '🍎', color: '#ff7675' },
  other:      { label: 'Прочее',   icon: '📦', color: '#8892b0' },
};

const UNITS = ['г', 'кг', 'мл', 'л', 'шт', 'уп', 'ст.л.', 'ч.л.'];

export default function ShoppingList() {
  const { shoppingList, generateShoppingList, updateShoppingItem, addShoppingItem, removeShoppingItem, setActiveTab } = usePlannerStore();
  const [showAdd, setShowAdd]   = useState(false);
  const [form, setForm]         = useState({ name: '', amount: '', unit: 'г', category: 'other' as IngredientCategory });
  const [catFilter, setCatFilter] = useState<IngredientCategory | 'all'>('all');
  const [grouped, setGrouped]   = useState(true);
  const [copied, setCopied]     = useState(false);

  const total     = shoppingList.length;
  const bought    = shoppingList.filter(i => i.isPurchased).length;
  const pct       = total > 0 ? Math.round((bought / total) * 100) : 0;
  const remaining = total - bought;

  const visible   = catFilter === 'all' ? shoppingList : shoppingList.filter(i => i.category === catFilter);
  const pending   = visible.filter(i => !i.isPurchased);
  const done      = visible.filter(i => i.isPurchased);

  const groups = grouped
    ? (Object.keys(CAT) as IngredientCategory[]).reduce<Record<string, ShoppingItem[]>>((acc, cat) => {
        const items = pending.filter(i => i.category === cat);
        if (items.length) acc[cat] = items;
        return acc;
      }, {})
    : null;

  const handleAdd = () => {
    const amount = parseFloat(form.amount);
    if (!form.name.trim() || isNaN(amount)) return;
    addShoppingItem({ name: form.name.toLowerCase(), amount, unit: form.unit, category: form.category, isPurchased: false, isCustom: true });
    setForm({ name: '', amount: '', unit: 'г', category: 'other' });
    setShowAdd(false);
  };

  const handleCopy = async () => {
    const text = copyToClipboard(shoppingList.filter(i => !i.isPurchased));
    await navigator.clipboard.writeText(text).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (total === 0) {
    return (
      <div className="fade-in" style={{ maxWidth: 700, margin: '0 auto' }}>
        <h2 style={{ margin: '0 0 8px', fontSize: 22, fontWeight: 800 }}>🛒 Список покупок</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: 40, fontSize: 14 }}>Автоматически из выбранных блюд</p>
        <div className="card" style={{ padding: 60, textAlign: 'center' }}>
          <div style={{ fontSize: 60, marginBottom: 20 }}>🛒</div>
          <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>Список пуст</div>
          <div style={{ color: 'var(--text-muted)', fontSize: 15, marginBottom: 32, lineHeight: 1.7, maxWidth: 380, margin: '0 auto 32px' }}>
            Перейдите в раздел «Еда», выберите блюда и нажмите «Создать список покупок»
          </div>
          <button className="btn-primary" style={{ padding: '13px 28px', fontSize: 15 }} onClick={() => setActiveTab('food')}>
            🍽️ Перейти к расчёту еды
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fade-in" style={{ maxWidth: 860, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800 }}>🛒 Список покупок</h2>
          <p style={{ margin: '6px 0 0', color: 'var(--text-muted)', fontSize: 14 }}>
            {remaining > 0 ? `Осталось купить: ${remaining} позиций` : '🎉 Всё куплено!'}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn-ghost" style={{ padding: '9px 16px', fontSize: 13 }} onClick={() => setShowAdd(v => !v)}>
            + Добавить
          </button>
          <button className="btn-primary" style={{ padding: '9px 16px', fontSize: 13 }} onClick={() => setActiveTab('food')}>
            🍽️ К расчёту
          </button>
        </div>
      </div>

      {/* Progress */}
      <div className="card" style={{ padding: '18px 22px', marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <span style={{ fontWeight: 700 }}>Куплено {bought} из {total}</span>
          <span className="gradient-text" style={{ fontWeight: 900, fontSize: 18 }}>{pct}%</span>
        </div>
        <div className="progress-bar" style={{ height: 8 }}>
          <div className="progress-fill" style={{ width: `${pct}%` }} />
        </div>
        <div style={{ display: 'flex', gap: 16, marginTop: 12 }}>
          {(Object.keys(CAT) as IngredientCategory[]).map(cat => {
            const count = shoppingList.filter(i => i.category === cat && !i.isPurchased).length;
            if (!count) return null;
            return (
              <span key={cat} style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                {CAT[cat].icon} {count}
              </span>
            );
          })}
        </div>
      </div>

      {/* Toolbar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10, marginBottom: 16 }}>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          <button className={`tab-pill ${catFilter === 'all' ? 'active' : ''}`} style={{ fontSize: 12, padding: '6px 12px' }} onClick={() => setCatFilter('all')}>
            🛒 Все ({total})
          </button>
          {(Object.entries(CAT) as [IngredientCategory, typeof CAT[IngredientCategory]][]).map(([cat, c]) => {
            const cnt = shoppingList.filter(i => i.category === cat).length;
            if (!cnt) return null;
            return (
              <button key={cat} className={`tab-pill ${catFilter === cat ? 'active' : ''}`} style={{ fontSize: 12, padding: '6px 12px' }} onClick={() => setCatFilter(cat)}>
                {c.icon} {c.label} ({cnt})
              </button>
            );
          })}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn-ghost" style={{ padding: '7px 12px', fontSize: 12 }} onClick={() => setGrouped(v => !v)}>
            {grouped ? '≡ Плоско' : '⊞ Группы'}
          </button>
          <button
            className="btn-ghost"
            style={{ padding: '7px 14px', fontSize: 12, color: copied ? 'var(--success)' : undefined, borderColor: copied ? 'rgba(0,229,160,0.4)' : undefined }}
            onClick={handleCopy}
          >
            {copied ? '✅ Скопировано' : '📋 Копировать'}
          </button>
          <button className="btn-ghost" style={{ padding: '7px 14px', fontSize: 12 }} onClick={() => downloadCSV(exportToCSV(shoppingList), 'shopping.csv')}>
            📥 CSV
          </button>
        </div>
      </div>

      {/* Add form */}
      {showAdd && (
        <div className="card slide-in" style={{ padding: 18, marginBottom: 16, borderColor: 'rgba(0,229,160,0.25)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 10 }}>
            <div>
              <label style={lbl}>Продукт</label>
              <input className="input-base" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Название" />
            </div>
            <div>
              <label style={lbl}>Кол-во</label>
              <input className="input-base" type="number" value={form.amount} onChange={e => setForm(p => ({ ...p, amount: e.target.value }))} placeholder="0" />
            </div>
            <div>
              <label style={lbl}>Ед.</label>
              <select className="input-base" value={form.unit} onChange={e => setForm(p => ({ ...p, unit: e.target.value }))}>
                {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
            <div>
              <label style={lbl}>Категория</label>
              <select className="input-base" value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value as IngredientCategory }))}>
                {(Object.entries(CAT) as [IngredientCategory, typeof CAT[IngredientCategory]][]).map(([v, c]) => (
                  <option key={v} value={v}>{c.icon} {c.label}</option>
                ))}
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            <button className="btn-primary" onClick={handleAdd}>Добавить</button>
            <button className="btn-ghost" onClick={() => setShowAdd(false)}>Отмена</button>
          </div>
        </div>
      )}

      {/* Items */}
      {grouped && groups ? (
        Object.entries(groups).map(([cat, items]) => {
          const c = CAT[cat as IngredientCategory];
          return (
            <div key={cat} style={{ marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, padding: '6px 0', borderBottom: `1px solid ${c.color}22` }}>
                <span style={{ fontSize: 20 }}>{c.icon}</span>
                <span style={{ fontWeight: 700, fontSize: 15, color: c.color }}>{c.label}</span>
                <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>({items.length})</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {items.map(item => <Row key={item.id} item={item} onUpdate={updateShoppingItem} onRemove={removeShoppingItem} />)}
              </div>
            </div>
          );
        })
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {pending.map(item => <Row key={item.id} item={item} onUpdate={updateShoppingItem} onRemove={removeShoppingItem} />)}
        </div>
      )}

      {/* Done section */}
      {done.length > 0 && (
        <div style={{ marginTop: 28 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--success)', marginBottom: 10 }}>
            ✅ Куплено ({done.length})
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            {done.map(item => <Row key={item.id} item={item} onUpdate={updateShoppingItem} onRemove={removeShoppingItem} />)}
          </div>
        </div>
      )}
    </div>
  );
}

function Row({ item, onUpdate, onRemove }: {
  item: ShoppingItem;
  onUpdate: (id: string, data: Partial<ShoppingItem>) => void;
  onRemove: (id: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [val, setVal]         = useState(String(item.amount));
  const c = CAT[item.category];

  const save = () => {
    onUpdate(item.id, { amount: parseFloat(val) || item.amount });
    setEditing(false);
  };

  return (
    <div
      className="card"
      style={{
        padding: '11px 16px',
        display: 'flex', alignItems: 'center', gap: 12,
        opacity: item.isPurchased ? 0.5 : 1,
        transition: 'opacity .2s',
        borderColor: item.isPurchased ? 'rgba(0,229,160,0.2)' : 'var(--border)',
      }}
    >
      {/* Checkbox */}
      <input
        type="checkbox" checked={item.isPurchased}
        onChange={() => onUpdate(item.id, { isPurchased: !item.isPurchased })}
        style={{ flexShrink: 0 }}
      />

      {/* Category icon */}
      <span style={{ fontSize: 18, flexShrink: 0 }}>{c.icon}</span>

      {/* Name */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <span style={{
          fontSize: 14, fontWeight: 500,
          textDecoration: item.isPurchased ? 'line-through' : 'none',
          textTransform: 'capitalize',
        }}>
          {item.name}
        </span>
        {item.isCustom && (
          <span className="badge" style={{ marginLeft: 8, background: 'rgba(0,212,255,0.1)', color: 'var(--accent3)', fontSize: 10 }}>
            своё
          </span>
        )}
      </div>

      {/* Amount */}
      {editing ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
          <input
            className="input-base" type="number" value={val}
            onChange={e => setVal(e.target.value)}
            style={{ width: 72, fontSize: 13 }} autoFocus
            onKeyDown={e => { if (e.key === 'Enter') save(); if (e.key === 'Escape') setEditing(false); }}
          />
          <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{item.unit}</span>
          <button className="btn-primary" style={{ padding: '6px 10px', fontSize: 12 }} onClick={save}>✓</button>
        </div>
      ) : (
        <button
          onClick={() => { setVal(String(item.amount)); setEditing(true); }}
          style={{
            background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)',
            borderRadius: 8, cursor: 'pointer', padding: '4px 12px',
            fontWeight: 700, fontSize: 15, color: c.color,
            flexShrink: 0,
          }}
          data-tip="Нажмите для редактирования"
        >
          {item.amount} <span style={{ color: 'var(--text-muted)', fontWeight: 400, fontSize: 13 }}>{item.unit}</span>
        </button>
      )}

      <button
        className="btn-danger"
        style={{ padding: '4px 8px', fontSize: 12, flexShrink: 0 }}
        onClick={() => onRemove(item.id)}
      >✕</button>
    </div>
  );
}

const lbl: React.CSSProperties = {
  display: 'block', fontSize: 12, fontWeight: 600,
  color: 'var(--text-muted)', marginBottom: 4,
};
