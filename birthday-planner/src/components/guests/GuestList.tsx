'use client';

import { useState } from 'react';
import { usePlannerStore } from '@/store/usePlannerStore';
import { getGuestCount } from '@/utils/calculations';
import type { GuestStatus } from '@/types';

const STATUS_CONFIG: Record<GuestStatus, { label: string; color: string; bg: string }> = {
  invited: { label: 'Приглашён', color: 'var(--warning)', bg: 'rgba(255,184,0,0.12)' },
  confirmed: { label: 'Подтвердил', color: 'var(--success)', bg: 'rgba(0,229,160,0.12)' },
  declined: { label: 'Отказался', color: 'var(--danger)', bg: 'rgba(255,71,87,0.12)' },
};

export default function GuestList() {
  const { guests, addGuest, updateGuest, removeGuest } = usePlannerStore();
  const { adults, children, effective } = getGuestCount(guests);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', contact: '', status: 'invited' as GuestStatus, isChild: false });
  const [filter, setFilter] = useState<GuestStatus | 'all'>('all');

  const handleAdd = () => {
    if (!form.name.trim()) return;
    addGuest(form);
    setForm({ name: '', contact: '', status: 'invited', isChild: false });
    setShowForm(false);
  };

  const filtered = filter === 'all' ? guests : guests.filter(g => g.status === filter);
  const confirmed = guests.filter(g => g.status === 'confirmed').length;
  const declined = guests.filter(g => g.status === 'declined').length;

  return (
    <div className="fade-in" style={{ maxWidth: 800, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700 }}>👥 Список гостей</h2>
          <p style={{ margin: '6px 0 0', fontSize: 14, color: 'var(--text-muted)' }}>
            Управляйте приглашёнными и отслеживайте статусы
          </p>
        </div>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? '✕ Отмена' : '+ Добавить гостя'}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
        {[
          { label: 'Всего', value: guests.length, color: 'var(--accent2)', icon: '👥' },
          { label: 'Подтвердили', value: confirmed, color: 'var(--success)', icon: '✅' },
          { label: 'Отказались', value: declined, color: 'var(--danger)', icon: '❌' },
          { label: 'Эф. порций', value: effective, color: 'var(--accent3)', icon: '🍽️' },
        ].map(stat => (
          <div key={stat.label} className="card" style={{ padding: 16, textAlign: 'center' }}>
            <div style={{ fontSize: 20 }}>{stat.icon}</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: stat.color, marginTop: 4 }}>{stat.value}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {effective > 0 && (
        <div className="card" style={{ padding: 14, marginBottom: 16, background: 'rgba(0,212,255,0.05)', borderColor: 'rgba(0,212,255,0.15)' }}>
          <div style={{ fontSize: 13, color: 'var(--accent3)' }}>
            ℹ️ Взрослых: <b>{adults}</b>, детей: <b>{children}</b> (×0.6) → эффективных порций: <b>{effective}</b>
          </div>
        </div>
      )}

      {showForm && (
        <div className="card slide-in" style={{ padding: 20, marginBottom: 16, borderColor: 'rgba(123,47,247,0.3)' }}>
          <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 16 }}>Новый гость</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={labelStyle}>Имя *</label>
              <input
                className="input-base"
                value={form.name}
                onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                placeholder="Имя гостя"
                onKeyDown={e => e.key === 'Enter' && handleAdd()}
              />
            </div>
            <div>
              <label style={labelStyle}>Контакт</label>
              <input
                className="input-base"
                value={form.contact}
                onChange={e => setForm(p => ({ ...p, contact: e.target.value }))}
                placeholder="Телефон или email"
              />
            </div>
            <div>
              <label style={labelStyle}>Статус</label>
              <select
                className="input-base"
                value={form.status}
                onChange={e => setForm(p => ({ ...p, status: e.target.value as GuestStatus }))}
              >
                <option value="invited">Приглашён</option>
                <option value="confirmed">Подтвердил</option>
                <option value="declined">Отказался</option>
              </select>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingTop: 24 }}>
              <input
                type="checkbox"
                id="isChild"
                checked={form.isChild}
                onChange={e => setForm(p => ({ ...p, isChild: e.target.checked }))}
              />
              <label htmlFor="isChild" style={{ fontSize: 14, cursor: 'pointer' }}>
                Ребёнок (×0.6)
              </label>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
            <button className="btn-primary" onClick={handleAdd}>Добавить</button>
            <button className="btn-ghost" onClick={() => setShowForm(false)}>Отмена</button>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {(['all', 'invited', 'confirmed', 'declined'] as const).map(s => (
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
          <EmptyState text={filter === 'all' ? 'Добавьте первого гостя' : 'Нет гостей с таким статусом'} />
        ) : (
          filtered.map(guest => (
            <div
              key={guest.id}
              className="card card-hover"
              style={{
                padding: '14px 18px',
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                opacity: guest.status === 'declined' ? 0.6 : 1,
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--accent), var(--accent2))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 18,
                  flexShrink: 0,
                }}
              >
                {guest.isChild ? '🧒' : '👤'}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 15, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
                  {guest.name}
                  {guest.isChild && (
                    <span className="badge" style={{ background: 'rgba(255,184,0,0.12)', color: 'var(--warning)', fontSize: 11 }}>
                      ребёнок
                    </span>
                  )}
                </div>
                {guest.contact && (
                  <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>{guest.contact}</div>
                )}
              </div>

              <select
                className="input-base"
                value={guest.status}
                onChange={e => updateGuest(guest.id, { status: e.target.value as GuestStatus })}
                style={{
                  width: 'auto',
                  minWidth: 140,
                  background: STATUS_CONFIG[guest.status].bg,
                  color: STATUS_CONFIG[guest.status].color,
                  borderColor: STATUS_CONFIG[guest.status].color + '44',
                  fontWeight: 600,
                }}
              >
                <option value="invited">Приглашён</option>
                <option value="confirmed">Подтвердил</option>
                <option value="declined">Отказался</option>
              </select>

              <button className="btn-danger" onClick={() => removeGuest(guest.id)}>✕</button>
            </div>
          ))
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

function EmptyState({ text }: { text: string }) {
  return (
    <div className="card" style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>
      <div style={{ fontSize: 40, marginBottom: 12 }}>👥</div>
      <div style={{ fontSize: 15 }}>{text}</div>
    </div>
  );
}
