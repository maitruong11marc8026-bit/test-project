'use client';

import { useState } from 'react';
import { usePlannerStore } from '@/store/usePlannerStore';
import { calculateFood, getGuestCount } from '@/utils/calculations';
import type { PartyFormat } from '@/types';

const FORMATS: { value: PartyFormat; icon: string; label: string; desc: string }[] = [
  { value: 'buffet',  icon: '🥂', label: 'Фуршет',  desc: 'Лёгкие закуски, стоя' },
  { value: 'banquet', icon: '🍽️', label: 'Банкет',  desc: 'Полноценный стол' },
  { value: 'kids',    icon: '🧁', label: 'Детский', desc: 'Для малышей' },
];

const CAT_META: Record<string, { icon: string; color: string; bg: string }> = {
  'Еда':      { icon: '🍽️', color: '#e91e8c', bg: 'rgba(233,30,140,0.1)'  },
  'Напитки':  { icon: '🥤', color: '#00d4ff', bg: 'rgba(0,212,255,0.1)'   },
  'Алкоголь': { icon: '🍷', color: '#ffb800', bg: 'rgba(255,184,0,0.1)'   },
};

export default function FoodCalculator() {
  const { guests, foodSettings, setFoodSettings, dishes, toggleDish, generateShoppingList, setActiveTab } = usePlannerStore();
  const { effective, adults, children } = getGuestCount(guests);
  const [showNorms, setShowNorms] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');

  const guestCount = effective || 1;
  const mockGuests = guests.length ? guests : [{ id: 'x', name: 'x', contact: '', status: 'confirmed' as const, isChild: false }];
  const results = calculateFood(mockGuests, foodSettings);

  const categories = ['Еда', 'Напитки', 'Алкоголь'];
  const filtered = activeCategory === 'all' ? results : results.filter(r => r.category === activeCategory);

  // Max total per category for bar width
  const maxTotal = Math.max(...results.map(r => r.total), 1);

  const handleGenerate = () => {
    generateShoppingList();
    setActiveTab('shopping');
  };

  return (
    <div className="fade-in" style={{ maxWidth: 940, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800 }}>🍽️ Расчёт еды и напитков</h2>
          <p style={{ margin: '6px 0 0', color: 'var(--text-muted)', fontSize: 14 }}>
            Автоматические нормы по количеству гостей и формату
          </p>
        </div>
        <button className="btn-primary" onClick={handleGenerate}>
          🛒 Создать список покупок
        </button>
      </div>

      {/* Guest info banner */}
      {effective > 0 ? (
        <div className="card" style={{ padding: '14px 18px', marginBottom: 20, background: 'rgba(0,229,160,0.05)', borderColor: 'rgba(0,229,160,0.2)' }}>
          <span style={{ fontSize: 14, color: 'var(--success)' }}>
            👥 Взрослых: <b>{adults}</b> + детей: <b>{children}</b> (×0.6)
            {' '}= <b>{effective}</b> эффективных порций
          </span>
        </div>
      ) : (
        <div className="card" style={{ padding: '12px 16px', marginBottom: 20, background: 'rgba(255,184,0,0.04)', borderColor: 'rgba(255,184,0,0.2)' }}>
          <span style={{ fontSize: 13, color: 'var(--warning)' }}>
            ⚠️ Гости не добавлены — расчёт показан на 1 человека.
          </span>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
        {/* Settings */}
        <div className="card" style={{ padding: 22 }}>
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 18 }}>⚙️ Настройки</div>

          <div style={{ marginBottom: 18 }}>
            <label style={lbl}>Формат мероприятия</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
              {FORMATS.map(f => (
                <button
                  key={f.value}
                  onClick={() => setFoodSettings({ partyFormat: f.value })}
                  style={{
                    padding: '12px 8px', borderRadius: 12, border: '2px solid',
                    borderColor: foodSettings.partyFormat === f.value ? 'var(--accent)' : 'var(--border)',
                    background: foodSettings.partyFormat === f.value
                      ? 'linear-gradient(135deg,rgba(233,30,140,.12),rgba(123,47,247,.12))'
                      : 'transparent',
                    cursor: 'pointer', textAlign: 'center', transition: 'all .2s',
                  }}
                >
                  <div style={{ fontSize: 22 }}>{f.icon}</div>
                  <div style={{ fontSize: 12, fontWeight: 600, marginTop: 6, color: 'var(--text)' }}>{f.label}</div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>{f.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: 18 }}>
            <label style={lbl}>
              Длительность:&nbsp;<b>{foodSettings.duration} ч</b>
            </label>
            <input type="range" min={1} max={12} step={0.5} value={foodSettings.duration}
              onChange={e => setFoodSettings({ duration: +e.target.value })} style={{ width: '100%' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
              <span>1 ч</span><span>12 ч</span>
            </div>
          </div>

          <div style={{ marginBottom: 18 }}>
            <label style={lbl}>
              Запас:&nbsp;<b>{Math.round((foodSettings.safetyFactor - 1) * 100)}%</b>
            </label>
            <input type="range" min={1} max={1.3} step={0.05} value={foodSettings.safetyFactor}
              onChange={e => setFoodSettings({ safetyFactor: +e.target.value })} style={{ width: '100%' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
              <span>0%</span><span>30%</span>
            </div>
          </div>

          <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: 14 }}>
            <input type="checkbox" checked={foodSettings.includeAlcohol}
              onChange={e => setFoodSettings({ includeAlcohol: e.target.checked })} />
            Включить алкоголь
          </label>
        </div>

        {/* Dish selector */}
        <div className="card" style={{ padding: 22 }}>
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 14 }}>🍴 Блюда</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 320, overflowY: 'auto', paddingRight: 4 }}>
            {dishes.map(dish => {
              const catEmoji: Record<string, string> = {
                salad: '🥗', main: '🍖', appetizer: '🥐', dessert: '🍰', cake: '🎂', drink: '🥤',
              };
              return (
                <label
                  key={dish.id}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '9px 12px', borderRadius: 10, cursor: 'pointer',
                    background: dish.isSelected ? 'rgba(233,30,140,0.07)' : 'transparent',
                    border: '1px solid', borderColor: dish.isSelected ? 'rgba(233,30,140,0.25)' : 'var(--border)',
                    transition: 'all .15s',
                  }}
                >
                  <input type="checkbox" checked={dish.isSelected} onChange={() => toggleDish(dish.id)} />
                  <span style={{ fontSize: 18 }}>{catEmoji[dish.category] || '🍴'}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{dish.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                      {dish.portionPerPerson}{dish.unit}/чел · {dish.ingredients.length} ингр.
                    </div>
                  </div>
                </label>
              );
            })}
          </div>
        </div>
      </div>

      {/* Editable norms */}
      <div className="card" style={{ padding: 20, marginBottom: 20 }}>
        <button
          style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: 15, color: 'var(--text)', padding: 0, display: 'flex', alignItems: 'center', gap: 8 }}
          onClick={() => setShowNorms(v => !v)}
        >
          ⚙️ Нормы на человека <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>{showNorms ? '▲' : '▼'}</span>
        </button>
        {showNorms && (
          <div style={{ marginTop: 18, display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14 }}>
            {(Object.entries(foodSettings.norms) as [string, { min: number; max: number }][]).map(([key, range]) => {
              const labels: Record<string, string> = {
                appetizer: 'Закуски (г)', main: 'Основное (г)', salad: 'Салаты (г)',
                dessert: 'Десерт (г)', cake: 'Торт (г)', water: 'Вода (мл)',
                softDrink: 'Безалк. (мл)', wine: 'Вино (мл)', spirits: 'Крепкий (мл)',
              };
              return (
                <div key={key}>
                  <label style={{ ...lbl, marginBottom: 5 }}>{labels[key]}</label>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <input className="input-base" type="number" value={range.min} style={{ fontSize: 13 }}
                      onChange={e => setFoodSettings({ norms: { ...foodSettings.norms, [key]: { ...range, min: +e.target.value || 0 } } })}
                      placeholder="мин" />
                    <input className="input-base" type="number" value={range.max} style={{ fontSize: 13 }}
                      onChange={e => setFoodSettings({ norms: { ...foodSettings.norms, [key]: { ...range, max: +e.target.value || 0 } } })}
                      placeholder="макс" />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Results with visualization */}
      <div className="card" style={{ padding: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div style={{ fontWeight: 700, fontSize: 16 }}>
            📊 Результат
            <span style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 400, marginLeft: 10 }}>
              {guestCount} порц. · запас ×{foodSettings.safetyFactor}
            </span>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            {(['all', ...categories] as const).map(c => {
              const m = c === 'all' ? null : CAT_META[c];
              return (
                <button
                  key={c}
                  className={`tab-pill ${activeCategory === c ? 'active' : ''}`}
                  style={{ padding: '5px 12px', fontSize: 12 }}
                  onClick={() => setActiveCategory(c)}
                >
                  {m ? `${m.icon} ${c}` : '🌐 Всё'}
                </button>
              );
            })}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filtered.map((row, i) => {
            const meta = CAT_META[row.category] || CAT_META['Еда'];
            const barPct = Math.round((row.total / maxTotal) * 100);
            const formatted = row.unit === 'г' && row.total >= 1000
              ? `${(row.total / 1000).toFixed(1)} кг`
              : row.unit === 'мл' && row.total >= 1000
              ? `${(row.total / 1000).toFixed(1)} л`
              : `${row.total} ${row.unit}`;
            return (
              <div
                key={i}
                style={{
                  padding: '14px 16px', borderRadius: 12,
                  background: 'rgba(255,255,255,0.025)',
                  border: '1px solid var(--border)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 20 }}>{meta.icon}</span>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{row.name}</div>
                      <span className="badge" style={{ background: meta.bg, color: meta.color, fontSize: 11, marginTop: 2 }}>
                        {row.category}
                      </span>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 800, fontSize: 18, color: meta.color }}>{formatted}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{row.perPerson} {row.unit}/чел</div>
                  </div>
                </div>
                {/* Progress bar */}
                <div style={{ height: 5, borderRadius: 3, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', borderRadius: 3,
                    width: `${barPct}%`,
                    background: `linear-gradient(90deg, ${meta.color}cc, ${meta.color})`,
                    transition: 'width 0.5s ease',
                  }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

const lbl: React.CSSProperties = {
  display: 'block', fontSize: 13, fontWeight: 600,
  color: 'var(--text-muted)', marginBottom: 8,
};
