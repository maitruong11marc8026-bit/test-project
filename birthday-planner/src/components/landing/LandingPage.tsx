'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

const FEATURES = [
  { icon: '👥', title: 'Список гостей', desc: 'Статусы, дети с коэф. 0.6, фильтрация' },
  { icon: '🍽️', title: 'Расчёт еды', desc: 'Нормы по формату, запас, авто-расчёт' },
  { icon: '🛒', title: 'Список покупок', desc: 'Из блюд автоматически, CSV-экспорт' },
  { icon: '💰', title: 'Бюджет', desc: 'Расходы по категориям, прогресс' },
  { icon: '✅', title: 'Задачи', desc: 'Приоритеты, дедлайны, прогресс' },
  { icon: '⏱️', title: 'Таймлайн', desc: 'Расписание мероприятия поблочно' },
  { icon: '💡', title: 'Идеи', desc: 'Цветные карточки для заметок' },
  { icon: '📊', title: 'Дашборд', desc: 'Сводка всего в одном экране' },
];

const STEPS = [
  { n: '01', title: 'Создай событие', desc: 'Название, дата, тип и место' },
  { n: '02', title: 'Добавь гостей', desc: 'Имена, статусы, взрослые и дети' },
  { n: '03', title: 'Рассчитай еду', desc: 'Авто-нормы по количеству гостей' },
  { n: '04', title: 'Получи список', desc: 'Покупки автоматически из блюд' },
];

const STATS = [
  { value: '9', label: 'модулей', icon: '🧩' },
  { value: '0₽', label: 'полностью бесплатно', icon: '💸' },
  { value: '5мин', label: 'до первого плана', icon: '⚡' },
  { value: '100%', label: 'данные у вас', icon: '🔒' },
];

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  return (
    <div style={{ minHeight: '100vh', overflowX: 'hidden' }}>
      {/* NAV */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        padding: '0 32px',
        height: 64,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderBottom: '1px solid var(--border)',
        background: 'rgba(15,15,26,0.85)',
        backdropFilter: 'blur(20px)',
      }}>
        <div style={{ fontWeight: 800, fontSize: 20, letterSpacing: -0.5 }} className="gradient-text">
          🎉 Birthday Planner
        </div>
        <Link href="/app" style={{ textDecoration: 'none' }}>
          <button className="btn-primary" style={{ padding: '8px 20px', fontSize: 14 }}>
            Открыть приложение →
          </button>
        </Link>
      </nav>

      {/* HERO */}
      <section style={{
        minHeight: '100vh',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        textAlign: 'center',
        padding: '100px 24px 60px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* BG blobs */}
        <div style={{
          position: 'absolute', top: '20%', left: '10%',
          width: 400, height: 400, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(233,30,140,0.12) 0%, transparent 70%)',
          filter: 'blur(40px)', pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: '15%', right: '10%',
          width: 500, height: 500, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(123,47,247,0.1) 0%, transparent 70%)',
          filter: 'blur(50px)', pointerEvents: 'none',
        }} />

        <div
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '6px 16px', borderRadius: 100,
            background: 'rgba(233,30,140,0.1)',
            border: '1px solid rgba(233,30,140,0.3)',
            fontSize: 13, fontWeight: 600, color: 'var(--accent)',
            marginBottom: 32,
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0)' : 'translateY(12px)',
            transition: 'all 0.5s ease',
          }}
        >
          ✨ Бесплатно · Без регистрации · Данные в браузере
        </div>

        <h1
          style={{
            fontSize: 'clamp(36px, 6vw, 72px)',
            fontWeight: 900, lineHeight: 1.1, letterSpacing: -2,
            marginBottom: 24, maxWidth: 800,
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0)' : 'translateY(16px)',
            transition: 'all 0.6s ease 0.1s',
          }}
        >
          Спланируй день рождения{' '}
          <span className="gradient-text">за 5 минут</span>
        </h1>

        <p
          style={{
            fontSize: 20, color: 'var(--text-muted)', maxWidth: 560,
            lineHeight: 1.7, marginBottom: 48,
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0)' : 'translateY(16px)',
            transition: 'all 0.6s ease 0.2s',
          }}
        >
          Гости, еда, бюджет, задачи, покупки — всё в одном месте.
          Никакой регистрации. Данные хранятся в вашем браузере.
        </p>

        <div
          style={{
            display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center',
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0)' : 'translateY(16px)',
            transition: 'all 0.6s ease 0.3s',
          }}
        >
          <Link href="/app" style={{ textDecoration: 'none' }}>
            <button
              className="btn-primary"
              style={{ padding: '16px 36px', fontSize: 18, borderRadius: 14 }}
            >
              🚀 Начать планирование
            </button>
          </Link>
          <a href="#features" style={{ textDecoration: 'none' }}>
            <button className="btn-ghost" style={{ padding: '16px 28px', fontSize: 16 }}>
              Узнать больше ↓
            </button>
          </a>
        </div>

        {/* Preview mockup */}
        <div
          style={{
            marginTop: 72,
            width: '100%', maxWidth: 900,
            borderRadius: 20,
            border: '1px solid var(--border)',
            background: 'rgba(255,255,255,0.03)',
            overflow: 'hidden',
            boxShadow: '0 40px 120px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)',
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0) perspective(1000px) rotateX(2deg)' : 'translateY(24px) perspective(1000px) rotateX(6deg)',
            transition: 'all 0.8s ease 0.4s',
          }}
        >
          <div style={{
            height: 36, background: 'rgba(255,255,255,0.04)',
            borderBottom: '1px solid var(--border)',
            display: 'flex', alignItems: 'center', gap: 8, padding: '0 16px',
          }}>
            {['#ff5f57','#febc2e','#28c840'].map(c => (
              <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />
            ))}
            <div style={{
              flex: 1, margin: '0 24px', height: 20, borderRadius: 6,
              background: 'rgba(255,255,255,0.06)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 11, color: 'var(--text-muted)',
            }}>
              birthday-planner.vercel.app
            </div>
          </div>
          <MockupContent />
        </div>
      </section>

      {/* STATS */}
      <section style={{ padding: '0 24px 80px', maxWidth: 900, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          {STATS.map(s => (
            <div key={s.label} className="card" style={{ padding: '24px 20px', textAlign: 'center' }}>
              <div style={{ fontSize: 28 }}>{s.icon}</div>
              <div className="gradient-text" style={{ fontSize: 28, fontWeight: 900, marginTop: 8 }}>{s.value}</div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ padding: '80px 24px', maxWidth: 900, margin: '0 auto' }}>
        <SectionHeader label="Как это работает" title="4 шага до идеального праздника" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginTop: 48 }}>
          {STEPS.map((step, i) => (
            <div key={step.n} style={{ position: 'relative' }}>
              {i < STEPS.length - 1 && (
                <div style={{
                  position: 'absolute', top: 28, left: '70%', right: '-30%',
                  height: 1,
                  background: 'linear-gradient(90deg, var(--accent), transparent)',
                  zIndex: 0,
                }} />
              )}
              <div className="card" style={{ padding: 24, position: 'relative', zIndex: 1 }}>
                <div className="gradient-text" style={{ fontSize: 32, fontWeight: 900, marginBottom: 12 }}>
                  {step.n}
                </div>
                <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 8 }}>{step.title}</div>
                <div style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.6 }}>{step.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" style={{ padding: '80px 24px', maxWidth: 1000, margin: '0 auto' }}>
        <SectionHeader label="Возможности" title="Всё для идеального праздника" />
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: 16, marginTop: 48,
        }}>
          {FEATURES.map(f => (
            <div
              key={f.title}
              className="card card-hover"
              style={{ padding: '24px 20px', cursor: 'default' }}
            >
              <div style={{ fontSize: 32, marginBottom: 14 }}>{f.icon}</div>
              <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 8 }}>{f.title}</div>
              <div style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.6 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '80px 24px 120px', textAlign: 'center' }}>
        <div style={{
          maxWidth: 600, margin: '0 auto',
          padding: '56px 40px',
          borderRadius: 24,
          background: 'linear-gradient(135deg, rgba(233,30,140,0.1) 0%, rgba(123,47,247,0.1) 100%)',
          border: '1px solid rgba(255,255,255,0.08)',
        }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🎂</div>
          <h2 style={{ fontSize: 32, fontWeight: 900, marginBottom: 16, letterSpacing: -0.5 }}>
            Готов начать?
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 16, marginBottom: 32, lineHeight: 1.7 }}>
            Создай первый план прямо сейчас. Бесплатно, без регистрации.
          </p>
          <Link href="/app" style={{ textDecoration: 'none' }}>
            <button className="btn-primary" style={{ padding: '16px 40px', fontSize: 18, borderRadius: 14 }}>
              🚀 Начать бесплатно
            </button>
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{
        borderTop: '1px solid var(--border)',
        padding: '24px 32px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        color: 'var(--text-muted)', fontSize: 13,
      }}>
        <span className="gradient-text" style={{ fontWeight: 700 }}>🎉 Birthday Planner</span>
        <span>Данные хранятся локально · Без регистрации · Бесплатно</span>
      </footer>
    </div>
  );
}

function SectionHeader({ label, title }: { label: string; title: string }) {
  return (
    <div style={{ textAlign: 'center', marginBottom: 8 }}>
      <span style={{
        display: 'inline-block', padding: '4px 14px',
        borderRadius: 100, fontSize: 12, fontWeight: 700,
        background: 'rgba(123,47,247,0.12)',
        color: 'var(--accent2)',
        letterSpacing: 1, textTransform: 'uppercase',
        marginBottom: 16,
      }}>
        {label}
      </span>
      <h2 style={{ fontSize: 'clamp(24px, 4vw, 40px)', fontWeight: 900, letterSpacing: -1 }}>
        {title}
      </h2>
    </div>
  );
}

function MockupContent() {
  return (
    <div style={{ display: 'flex', height: 340, overflow: 'hidden' }}>
      {/* mini sidebar */}
      <div style={{ width: 140, borderRight: '1px solid var(--border)', padding: '12px 8px', flexShrink: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 800, padding: '4px 8px', marginBottom: 12 }} className="gradient-text">🎉 Birthday</div>
        {[
          ['📊','Дашборд'], ['🎂','Событие'], ['👥','Гости'], ['💰','Бюджет'],
          ['✅','Задачи'], ['🍽️','Еда'], ['🛒','Покупки'],
        ].map(([icon, label], i) => (
          <div key={label} style={{
            padding: '6px 8px', borderRadius: 7, marginBottom: 3,
            background: i === 0 ? 'rgba(233,30,140,0.15)' : 'transparent',
            fontSize: 11, color: i === 0 ? 'var(--text)' : 'var(--text-muted)',
            display: 'flex', gap: 6, alignItems: 'center',
            borderLeft: i === 0 ? '2px solid var(--accent)' : '2px solid transparent',
          }}>
            {icon} {label}
          </div>
        ))}
      </div>
      {/* main */}
      <div style={{ flex: 1, padding: 20, overflow: 'hidden' }}>
        <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 16 }}>📊 Дашборд</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 16 }}>
          {[
            { icon: '👥', label: 'Гостей', val: '12', color: '#7b2ff7' },
            { icon: '✅', label: 'Задач', val: '4/7', color: '#00e5a0' },
            { icon: '💰', label: 'Бюджет', val: '82%', color: '#ffb800' },
            { icon: '🍽️', label: 'Порций', val: '11', color: '#e91e8c' },
          ].map(c => (
            <div key={c.label} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 8, padding: '10px 8px', textAlign: 'center', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: 16 }}>{c.icon}</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: c.color, marginTop: 4 }}>{c.val}</div>
              <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{c.label}</div>
            </div>
          ))}
        </div>
        <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 10, padding: 12, border: '1px solid var(--border)' }}>
          <div style={{ fontSize: 11, fontWeight: 600, marginBottom: 8, color: 'var(--text-muted)' }}>📅 До события: 12 дней</div>
          <div style={{ height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.08)' }}>
            <div style={{ width: '57%', height: '100%', borderRadius: 3, background: 'linear-gradient(90deg, #e91e8c, #7b2ff7)' }} />
          </div>
          <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 5 }}>
            {['✅ Заказать торт','✅ Купить украшения','⏳ Отправить приглашения'].map(t => (
              <div key={t} style={{ fontSize: 11, padding: '5px 8px', borderRadius: 6, background: 'rgba(255,255,255,0.03)', color: t.startsWith('✅') ? 'var(--text)' : 'var(--warning)' }}>{t}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
