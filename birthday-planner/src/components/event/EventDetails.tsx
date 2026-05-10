'use client';

import { usePlannerStore } from '@/store/usePlannerStore';
import type { EventType } from '@/types';

const EVENT_TYPES: { value: EventType; label: string; icon: string; desc: string }[] = [
  { value: 'adults', label: 'Взрослый', icon: '🥂', desc: 'Для взрослой компании' },
  { value: 'kids', label: 'Детский', icon: '🧒', desc: 'Для детей и семей' },
  { value: 'themed', label: 'Тематический', icon: '🎭', desc: 'Костюмы и концепция' },
];

export default function EventDetails() {
  const { event, setEvent } = usePlannerStore();

  return (
    <div className="fade-in" style={{ maxWidth: 720, margin: '0 auto' }}>
      <SectionTitle icon="🎂" title="Детали события" subtitle="Настройте основную информацию о мероприятии" />

      <div className="card" style={{ padding: 28, marginBottom: 20 }}>
        <div style={{ display: 'grid', gap: 20 }}>
          <Field label="Название мероприятия">
            <input
              className="input-base"
              value={event.title}
              onChange={e => setEvent({ title: e.target.value })}
              placeholder="Например: День рождения Маши 🎉"
            />
          </Field>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Field label="Дата">
              <input
                className="input-base"
                type="date"
                value={event.date}
                onChange={e => setEvent({ date: e.target.value })}
              />
            </Field>
            <Field label="Время">
              <input
                className="input-base"
                type="time"
                value={event.time}
                onChange={e => setEvent({ time: e.target.value })}
              />
            </Field>
          </div>

          <Field label="Место проведения">
            <input
              className="input-base"
              value={event.location}
              onChange={e => setEvent({ location: e.target.value })}
              placeholder="Адрес или название заведения"
            />
          </Field>

          <Field label="Описание">
            <textarea
              className="input-base"
              value={event.description}
              onChange={e => setEvent({ description: e.target.value })}
              placeholder="Расскажите подробнее о мероприятии..."
              rows={3}
            />
          </Field>
        </div>
      </div>

      <div className="card" style={{ padding: 24 }}>
        <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 16 }}>Тип мероприятия</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {EVENT_TYPES.map(type => (
            <button
              key={type.value}
              onClick={() => setEvent({ type: type.value })}
              style={{
                padding: '20px 16px',
                borderRadius: 12,
                border: '2px solid',
                borderColor: event.type === type.value ? 'var(--accent)' : 'var(--border)',
                background: event.type === type.value
                  ? 'linear-gradient(135deg, rgba(233,30,140,0.12), rgba(123,47,247,0.12))'
                  : 'var(--card)',
                cursor: 'pointer',
                textAlign: 'center',
                transition: 'all 0.2s',
              }}
            >
              <div style={{ fontSize: 32, marginBottom: 8 }}>{type.icon}</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 4 }}>{type.label}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{type.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {event.date && (
        <div className="card" style={{ padding: 20, marginTop: 20 }}>
          <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 12, fontWeight: 600 }}>
            📊 Обратный отсчёт
          </div>
          <Countdown date={event.date} />
        </div>
      )}
    </div>
  );
}

function Countdown({ date }: { date: string }) {
  const target = new Date(date);
  const now = new Date();
  const diff = Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  if (diff < 0) return (
    <div style={{ color: 'var(--text-muted)', fontSize: 14 }}>
      Мероприятие уже прошло 🎊
    </div>
  );
  if (diff === 0) return (
    <div style={{ color: 'var(--accent)', fontWeight: 700, fontSize: 18 }}>
      🎉 Сегодня!
    </div>
  );
  return (
    <div style={{ display: 'flex', gap: 16 }}>
      {[
        { value: Math.floor(diff / 30), label: 'месяцев' },
        { value: Math.floor(diff % 30 / 7), label: 'недель' },
        { value: diff % 7, label: 'дней' },
      ].map(item => (
        <div key={item.label} style={{ textAlign: 'center' }}>
          <div className="gradient-text" style={{ fontSize: 28, fontWeight: 800 }}>{item.value}</div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{item.label}</div>
        </div>
      ))}
    </div>
  );
}

function SectionTitle({ icon, title, subtitle }: { icon: string; title: string; subtitle: string }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 10 }}>
        <span>{icon}</span> {title}
      </h2>
      <p style={{ margin: '6px 0 0', fontSize: 14, color: 'var(--text-muted)' }}>{subtitle}</p>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8 }}>
        {label}
      </label>
      {children}
    </div>
  );
}
