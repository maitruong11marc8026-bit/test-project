'use client';

import { useState } from 'react';
import { usePlannerStore } from '@/store/usePlannerStore';
import { exportToCSV, downloadCSV, copyToClipboard } from '@/utils/calculations';
import type { IngredientCategory, ShoppingItem } from '@/types';

const CATEGORY_CONFIG: Record<IngredientCategory, { label: string; icon: string; color: string }> = {
  vegetables: { label: 'Овощи', icon: '🥦', color: '#00e5a0' },
  meat: { label: 'Мясо', icon: '🥩', color: '#ff6b6b' },
  drinks: { label: 'Напитки', icon: '🥤', color: '#00d4ff' },
  bakery: { label: 'Бакалея', icon: '🌾', color: '#ffb800' },
  dairy: { label: 'Молочное', icon: '🥛', color: '#e8e8e8' },
  fruits: { label: 'Фрукты', icon: '🍎', color: '#ff7675' },
  other: { label: 'Прочее', icon: '📦', color: '#8892b0' },
};

export default function ShoppingList() {
  const { shoppingList, generateShoppingList, updateShoppingItem, addShoppingItem, removeShoppingItem, setActiveTab } = usePlannerStore();
  const [showAddForm, setShowAddForm] = useState(false);
  const [form, setForm] = useState({ name: '', amount: '', unit: 'г', category: 'other' as IngredientCategory });
  const [filter, setFilter] = useState<IngredientCategory | 'all'>('all');
  const [groupBy, setGroupBy] = useState(true);
  const [copied, setCopied] = useState(false);

  const totalItems = shoppingList.length;
  const purchased = shoppingList.filter(i => i.isPurchased).length;
  const pct = totalItems > 0 ? Math.round((purchased / totalItems) * 100) : 0;

  const filtered = filter === 'all' ? shoppingList : shoppingList.filter(i => i.category === filter);
  const notPurchased = filtered.filter(i => !i.isPurchased);
  const purchasedItems = filtered.filter(i => i.isPurchased);

  const grouped = groupBy
    ? Object.entries(CATEGORY_CONFIG).reduce((acc, [cat]) => {
        const items = notPurchased.filter(i => i.category === cat);
        if (items.length > 0) acc[cat as IngredientCategory] = items;
        return acc;
      }, {} as Record<IngredientCategory, ShoppingItem[]>)
    : null;

  const handleAdd = () => {
    const amount = parseFloat(form.amount);
    if (!form.name.trim() || isNaN(amount)) return;
    addShoppingItem({ name: form.name.toLowerCase(), amount, unit: form.unit, category: form.category, isPurchased: false, isCustom: true });
    setForm({ name: '', amount: '', unit: 'г', category: 'other' });
    setShowAddForm(false);
  };

  const handleCopy = async () => {
    const text = copyToClipboard(shoppingList.filter(i => !i.isPurchased));
    await navigator.clipboard.writeText(text).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportCSV = () => {
    downloadCSV(exportToCSV(shoppingList), 'shopping-list.csv');
  };

  return (
    <div className="fade-in" style={{ maxWidth: 900, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700 }}>🛒 Список покупок</h2>
          <p style={{ margin: '6px 0 0', fontSize: 14, color: 'var(--text-muted)' }}>
            Автоматически создан из выбранных блюд
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn-ghost" onClick={() => setShowAddForm(!showAddForm)}>
            + Добавить
          </button>
          <button className="btn-primary" onClick={() => { setActiveTab('food'); }}>
            🍽️ К расчёту еды
          </button>
        </div>
      </div>

      {shoppingList.length === 0 ? (
        <div className="card" style={{ padding: 60, textAlign: 'center', color: 'var(--text-muted)' }}>
          <div style={{ fontSize: 50, marginBottom: 16 }}>🛒</div>
          <div style={{ fontSize: 16, marginBottom: 8 }}>Список пуст</div>
          <div style={{ fontSize: 14, marginBottom: 24 }}>Перейдите в раздел "Еда", выберите блюда и нажмите "Создать список покупок"</div>
          <button className="btn-primary" onClick={() => setActiveTab('food')}>🍽️ Перейти к расчёту еды</button>
        </div>
      ) : (
        <>
          <div className="card" style={{ padding: 20, marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
              <span style={{ fontWeight: 600 }}>Куплено: {purchased}/{totalItems}</span>
              <span className="gradient-text" style={{ fontWeight: 700 }}>{pct}%</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${pct}%` }} />
            </div>
          </div>

          {/* Toolbar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <button className={`tab-pill ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>
                🛒 Все ({shoppingList.length})
              </button>
              {(Object.entries(CATEGORY_CONFIG) as [IngredientCategory, typeof CATEGORY_CONFIG[IngredientCategory]][]).map(([cat, cfg]) => {
                const count = shoppingList.filter(i => i.category === cat).length;
                if (count === 0) return null;
                return (
                  <button key={cat} className={`tab-pill ${filter === cat ? 'active' : ''}`} onClick={() => setFilter(cat)}>
                    {cfg.icon} {cfg.label} ({count})
                  </button>
                );
              })}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                className="btn-ghost"
                style={{ padding: '8px 12px', fontSize: 13 }}
                onClick={() => setGroupBy(!groupBy)}
              >
                {groupBy ? '≡ Плоско' : '⊞ Группы'}
              </button>
              <button className="btn-ghost" style={{ padding: '8px 12px', fontSize: 13 }} onClick={handleCopy}>
                {copied ? '✅ Скопировано' : '📋 Копировать'}
              </button>
              <button className="btn-ghost" style={{ padding: '8px 12px', fontSize: 13 }} onClick={handleExportCSV}>
                📥 CSV
              </button>
            </div>
          </div>

          {showAddForm && (
            <div className="card slide-in" style={{ padding: 18, marginBottom: 16, borderColor: 'rgba(0,229,160,0.3)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 10 }}>
                <div>
                  <label style={labelStyle}>Продукт</label>
                  <input className="input-base" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Название" />
                </div>
                <div>
                  <label style={labelStyle}>Кол-во</label>
                  <input className="input-base" type="number" value={form.amount} onChange={e => setForm(p => ({ ...p, amount: e.target.value }))} placeholder="0" />
                </div>
                <div>
                  <label style={labelStyle}>Ед.</label>
                  <select className="input-base" value={form.unit} onChange={e => setForm(p => ({ ...p, unit: e.target.value }))}>
                    {['г', 'кг', 'мл', 'л', 'шт', 'уп', 'ст.л.', 'ч.л.'].map(u => <option key={u} value={u}>{u}</option>)}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Категория</label>
                  <select className="input-base" value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value as IngredientCategory }))}>
                    {Object.entries(CATEGORY_CONFIG).map(([v, c]) => <option key={v} value={v}>{c.icon} {c.label}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                <button className="btn-primary" onClick={handleAdd}>Добавить</button>
                <button className="btn-ghost" onClick={() => setShowAddForm(false)}>Отмена</button>
              </div>
            </div>
          )}

          {/* Items */}
          {groupBy && grouped ? (
            Object.entries(grouped).map(([cat, items]) => {
              const cfg = CATEGORY_CONFIG[cat as IngredientCategory];
              return (
                <div key={cat} style={{ marginBottom: 20 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, fontSize: 14, fontWeight: 700, color: cfg.color }}>
                    <span>{cfg.icon}</span> {cfg.label} <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>({items.length})</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {items.map(item => <ShoppingItemRow key={item.id} item={item} onUpdate={updateShoppingItem} onRemove={removeShoppingItem} />)}
                  </div>
                </div>
              );
            })
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {notPurchased.map(item => <ShoppingItemRow key={item.id} item={item} onUpdate={updateShoppingItem} onRemove={removeShoppingItem} />)}
            </div>
          )}

          {purchasedItems.length > 0 && (
            <div style={{ marginTop: 24 }}>
              <div style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 600, marginBottom: 10 }}>
                ✅ Куплено ({purchasedItems.length})
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {purchasedItems.map(item => <ShoppingItemRow key={item.id} item={item} onUpdate={updateShoppingItem} onRemove={removeShoppingItem} />)}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function ShoppingItemRow({
  item,
  onUpdate,
  onRemove,
}: {
  item: ShoppingItem;
  onUpdate: (id: string, data: Partial<ShoppingItem>) => void;
  onRemove: (id: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [editAmount, setEditAmount] = useState(String(item.amount));
  const cfg = CATEGORY_CONFIG[item.category];

  return (
    <div
      className="card"
      style={{
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        opacity: item.isPurchased ? 0.55 : 1,
        transition: 'opacity 0.2s',
      }}
    >
      <input
        type="checkbox"
        checked={item.isPurchased}
        onChange={() => onUpdate(item.id, { isPurchased: !item.isPurchased })}
        style={{ flexShrink: 0 }}
      />
      <span style={{ fontSize: 18, flexShrink: 0 }}>{cfg.icon}</span>
      <div style={{ flex: 1, textDecoration: item.isPurchased ? 'line-through' : 'none', minWidth: 0 }}>
        <span style={{ fontSize: 14, fontWeight: 500, textTransform: 'capitalize' }}>{item.name}</span>
        {item.isCustom && (
          <span className="badge" style={{ marginLeft: 8, background: 'rgba(0,212,255,0.1)', color: 'var(--accent3)', fontSize: 10 }}>
            своё
          </span>
        )}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
        {editing ? (
          <>
            <input
              className="input-base"
              type="number"
              value={editAmount}
              onChange={e => setEditAmount(e.target.value)}
              style={{ width: 70, fontSize: 13 }}
              autoFocus
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  onUpdate(item.id, { amount: parseFloat(editAmount) || item.amount });
                  setEditing(false);
                }
                if (e.key === 'Escape') setEditing(false);
              }}
            />
            <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{item.unit}</span>
            <button
              className="btn-primary"
              style={{ padding: '6px 10px', fontSize: 12 }}
              onClick={() => { onUpdate(item.id, { amount: parseFloat(editAmount) || item.amount }); setEditing(false); }}
            >✓</button>
          </>
        ) : (
          <button
            onClick={() => { setEditAmount(String(item.amount)); setEditing(true); }}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--accent2)',
              fontWeight: 700,
              fontSize: 15,
              padding: '2px 6px',
              borderRadius: 6,
            }}
            title="Нажмите для редактирования"
          >
            {item.amount} <span style={{ color: 'var(--text-muted)', fontWeight: 400, fontSize: 13 }}>{item.unit}</span>
          </button>
        )}
      </div>
      <button className="btn-danger" style={{ padding: '4px 8px', fontSize: 12 }} onClick={() => onRemove(item.id)}>✕</button>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 12,
  fontWeight: 600,
  color: 'var(--text-muted)',
  marginBottom: 4,
};
