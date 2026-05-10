'use client';

import { useState } from 'react';
import { usePlannerStore } from '@/store/usePlannerStore';
import { calculateFood, getGuestCount } from '@/utils/calculations';
import type { PartyFormat } from '@/types';

const FORMAT_OPTIONS: { value: PartyFormat; label: string; icon: string; desc: string }[] = [
  { value: 'buffet', label: 'Фуршет', icon: '🥂', desc: 'Легкие закуски, стоя' },
  { value: 'banquet', label: 'Банкет', icon: '🍽️', desc: 'Полноценный стол' },
  { value: 'kids', label: 'Детский', icon: '🧁', desc: 'Для маленьких гостей' },
];

const CATEGORY_ICONS: Record<string, string> = {
  'Еда': '🍽️',
  'Напитки': '🥤',
  'Алкоголь': '🍷',
};

export default function FoodCalculator() {
  const { guests, foodSettings, setFoodSettings, dishes, toggleDish, generateShoppingList, setActiveTab } = usePlannerStore();
  const { effective, adults, children } = getGuestCount(guests);
  const [showNorms, setShowNorms] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const guestCount = effective || 1;
  const results = calculateFood(guests.length ? guests : [{ id: 'x', name: 'x', contact: '', status: 'confirmed', isChild: false }], foodSettings);
  const categories = ['Еда', 'Напитки', 'Алкоголь'];
  const filteredResults = activeCategory === 'all' ? results : results.filter(r => r.category === activeCategory);

  const handleGenerateList = () => {
    generateShoppingList();
    setActiveTab('shopping');
  };

  return (
    <div className="fade-in" style={{ maxWidth: 900, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700 }}>🍽️ Расчёт еды и напитков</h2>
          <p style={{ margin: '6px 0 0', fontSize: 14, color: 'var(--text-muted)' }}>
            Автоматический расчёт норм по количеству гостей
          </p>
        </div>
        <button className="btn-primary" onClick={handleGenerateList}>
          🛒 Создать список покупок
        </button>
      </div>

      {effective > 0 ? (
        <div className="card" style={{ padding: 16, marginBottom: 16, background: 'rgba(0,229,160,0.05)', borderColor: 'rgba(0,229,160,0.2)' }}>
          <div style={{ fontSize: 14, color: 'var(--success)' }}>
            👥 Взрослых: <b>{adults}</b> + детей: <b>{children}</b> (×0.6) = <b>{effective}</b> эффективных порций
          </div>
        </div>
      ) : (
        <div className="card" style={{ padding: 14, marginBottom: 16, background: 'rgba(255,184,0,0.05)', borderColor: 'rgba(255,184,0,0.2)' }}>
          <div style={{ fontSize: 13, color: 'var(--warning)' }}>
            ⚠️ Добавьте гостей в разделе "Гости" для точного расчёта. Пока показываем расчёт на 1 человека.
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
        {/* Settings */}
        <div className="card" style={{ padding: 20 }}>
          <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 16 }}>Настройки</div>

          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Формат мероприятия</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
              {FORMAT_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setFoodSettings({ partyFormat: opt.value })}
                  style={{
                    padding: '10px 8px',
                    borderRadius: 10,
                    border: '2px solid',
                    borderColor: foodSettings.partyFormat === opt.value ? 'var(--accent)' : 'var(--border)',
                    background: foodSettings.partyFormat === opt.value ? 'rgba(233,30,140,0.12)' : 'transparent',
                    cursor: 'pointer',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ fontSize: 20 }}>{opt.icon}</div>
                  <div style={{ fontSize: 11, fontWeight: 600, marginTop: 4 }}>{opt.label}</div>
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Длительность: <b>{foodSettings.duration} ч</b></label>
            <input
              type="range"
              min={1}
              max={12}
              step={0.5}
              value={foodSettings.duration}
              onChange={e => setFoodSettings({ duration: parseFloat(e.target.value) })}
              style={{ width: '100%' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-muted)' }}>
              <span>1 ч</span><span>12 ч</span>
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Запас: <b>{Math.round((foodSettings.safetyFactor - 1) * 100)}%</b></label>
            <input
              type="range"
              min={1}
              max={1.3}
              step={0.05}
              value={foodSettings.safetyFactor}
              onChange={e => setFoodSettings({ safetyFactor: parseFloat(e.target.value) })}
              style={{ width: '100%' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-muted)' }}>
              <span>0%</span><span>30%</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <input
              type="checkbox"
              id="alcohol"
              checked={foodSettings.includeAlcohol}
              onChange={e => setFoodSettings({ includeAlcohol: e.target.checked })}
            />
            <label htmlFor="alcohol" style={{ fontSize: 14, cursor: 'pointer' }}>
              Включить алкоголь
            </label>
          </div>
        </div>

        {/* Dishes selection */}
        <div className="card" style={{ padding: 20 }}>
          <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 16 }}>Блюда для расчёта</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 280, overflowY: 'auto' }}>
            {dishes.map(dish => {
              const catEmoji: Record<string, string> = {
                salad: '🥗', main: '🍖', appetizer: '🥐', dessert: '🍰', cake: '🎂', drink: '🥤',
              };
              return (
                <label
                  key={dish.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '10px 12px',
                    borderRadius: 10,
                    cursor: 'pointer',
                    background: dish.isSelected ? 'rgba(233,30,140,0.08)' : 'transparent',
                    border: '1px solid',
                    borderColor: dish.isSelected ? 'rgba(233,30,140,0.3)' : 'var(--border)',
                    transition: 'all 0.15s',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={dish.isSelected}
                    onChange={() => toggleDish(dish.id)}
                  />
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

      {/* Norms editor */}
      <div className="card" style={{ padding: 20, marginBottom: 20 }}>
        <button
          className="btn-ghost"
          style={{ padding: '8px 0', border: 'none', width: '100%', textAlign: 'left', fontSize: 15, fontWeight: 600, color: 'var(--text)' }}
          onClick={() => setShowNorms(!showNorms)}
        >
          ⚙️ Нормы на человека {showNorms ? '▲' : '▼'}
        </button>
        {showNorms && (
          <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {(Object.entries(foodSettings.norms) as [string, { min: number; max: number }][]).map(([key, range]) => {
              const labels: Record<string, string> = {
                appetizer: 'Закуски (г)', main: 'Основное (г)', salad: 'Салаты (г)',
                dessert: 'Десерт (г)', cake: 'Торт (г)', water: 'Вода (мл)',
                softDrink: 'Безалк. (мл)', wine: 'Вино (мл)', spirits: 'Крепкий (мл)',
              };
              return (
                <div key={key}>
                  <label style={{ ...labelStyle, marginBottom: 6 }}>{labels[key]}</label>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <input
                      className="input-base"
                      type="number"
                      value={range.min}
                      onChange={e => setFoodSettings({
                        norms: { ...foodSettings.norms, [key]: { ...range, min: parseInt(e.target.value) || 0 } }
                      })}
                      placeholder="мин"
                      style={{ fontSize: 13 }}
                    />
                    <input
                      className="input-base"
                      type="number"
                      value={range.max}
                      onChange={e => setFoodSettings({
                        norms: { ...foodSettings.norms, [key]: { ...range, max: parseInt(e.target.value) || 0 } }
                      })}
                      placeholder="макс"
                      style={{ fontSize: 13 }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Results table */}
      <div className="card" style={{ padding: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div style={{ fontSize: 15, fontWeight: 600 }}>
            📊 Результат расчёта
            <span style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 400, marginLeft: 8 }}>
              ({guestCount} порций, запас ×{foodSettings.safetyFactor})
            </span>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {(['all', ...categories] as const).map((c) => (
              <button
                key={c}
                className={`tab-pill ${activeCategory === c ? 'active' : ''}`}
                style={{ padding: '6px 12px', fontSize: 12 }}
                onClick={() => setActiveCategory(c)}
              >
                {c === 'all' ? 'Всё' : `${CATEGORY_ICONS[c]} ${c}`}
              </button>
            ))}
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                {['Категория', 'Название', 'На 1 чел.', `Всего (${guestCount} чел.)`, 'Ед.'].map(h => (
                  <th key={h} style={{ padding: '10px 12px', textAlign: 'left', color: 'var(--text-muted)', fontWeight: 600, fontSize: 12 }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredResults.map((row, i) => (
                <tr
                  key={i}
                  style={{ borderBottom: '1px solid var(--border)', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)' }}
                >
                  <td style={{ padding: '12px 12px' }}>
                    <span className="badge" style={{
                      background: row.category === 'Еда' ? 'rgba(233,30,140,0.1)' : row.category === 'Напитки' ? 'rgba(0,212,255,0.1)' : 'rgba(255,184,0,0.1)',
                      color: row.category === 'Еда' ? 'var(--accent)' : row.category === 'Напитки' ? 'var(--accent3)' : 'var(--warning)',
                    }}>
                      {CATEGORY_ICONS[row.category]} {row.category}
                    </span>
                  </td>
                  <td style={{ padding: '12px 12px', fontWeight: 500 }}>{row.name}</td>
                  <td style={{ padding: '12px 12px', color: 'var(--text-muted)' }}>{row.perPerson}</td>
                  <td style={{ padding: '12px 12px', fontWeight: 700, color: 'var(--accent2)' }}>
                    {row.unit === 'г' && row.total >= 1000
                      ? `${(row.total / 1000).toFixed(1)} кг`
                      : row.unit === 'мл' && row.total >= 1000
                      ? `${(row.total / 1000).toFixed(1)} л`
                      : row.total}
                  </td>
                  <td style={{ padding: '12px 12px', color: 'var(--text-muted)' }}>{row.unit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 13,
  fontWeight: 600,
  color: 'var(--text-muted)',
  marginBottom: 8,
};
