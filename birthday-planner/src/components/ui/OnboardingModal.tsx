'use client';

import { useState } from 'react';
import { usePlannerStore } from '@/store/usePlannerStore';

const STEPS = [
  {
    icon: '🎉',
    title: 'Добро пожаловать в Birthday Planner!',
    desc: 'Планировщик для идеального праздника. Всё в одном месте — гости, еда, бюджет и задачи.',
  },
  {
    icon: '👥',
    title: 'Начни с гостей',
    desc: 'Добавь гостей и укажи кто дети (они учитываются с коэффициентом 0.6 при расчёте еды).',
  },
  {
    icon: '🍽️',
    title: 'Рассчитай еду автоматически',
    desc: 'Выбери формат (фуршет/банкет), и приложение само посчитает нормы еды и напитков на всех.',
  },
  {
    icon: '🛒',
    title: 'Получи список покупок',
    desc: 'На основе выбранных блюд автоматически формируется список с ингредиентами — по категориям.',
  },
  {
    icon: '🚀',
    title: 'Всё сохраняется автоматически',
    desc: 'Данные хранятся в браузере. Никакой регистрации — просто открой и планируй!',
  },
];

export default function OnboardingModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(0);
  const { setEvent } = usePlannerStore();

  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;

  const handleFinish = () => {
    setEvent({ title: 'Мой день рождения 🎂' });
    onClose();
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(0,0,0,0.75)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24,
      backdropFilter: 'blur(6px)',
    }}>
      <div
        className="card"
        style={{
          width: '100%', maxWidth: 480,
          padding: '40px 36px',
          textAlign: 'center',
          borderColor: 'rgba(255,255,255,0.1)',
          boxShadow: '0 40px 100px rgba(0,0,0,0.6)',
          animation: 'fadeIn 0.3s ease',
        }}
      >
        {/* Step dots */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 32 }}>
          {STEPS.map((_, i) => (
            <div
              key={i}
              style={{
                height: 4, borderRadius: 2,
                width: i === step ? 24 : 8,
                background: i === step
                  ? 'linear-gradient(90deg, var(--accent), var(--accent2))'
                  : 'rgba(255,255,255,0.12)',
                transition: 'all 0.3s ease',
              }}
            />
          ))}
        </div>

        <div style={{ fontSize: 56, marginBottom: 20 }}>{current.icon}</div>
        <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 14, letterSpacing: -0.5 }}>
          {current.title}
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: 15, lineHeight: 1.7, marginBottom: 36 }}>
          {current.desc}
        </p>

        <div style={{ display: 'flex', gap: 12 }}>
          {step > 0 && (
            <button
              className="btn-ghost"
              style={{ flex: 1, padding: '13px 20px' }}
              onClick={() => setStep(s => s - 1)}
            >
              ← Назад
            </button>
          )}
          <button
            className="btn-primary"
            style={{ flex: 2, padding: '13px 20px', fontSize: 15 }}
            onClick={() => isLast ? handleFinish() : setStep(s => s + 1)}
          >
            {isLast ? '🚀 Начать планирование' : 'Далее →'}
          </button>
        </div>

        {!isLast && (
          <button
            onClick={onClose}
            style={{
              marginTop: 16, background: 'none', border: 'none',
              color: 'var(--text-muted)', fontSize: 13, cursor: 'pointer',
            }}
          >
            Пропустить
          </button>
        )}
      </div>
    </div>
  );
}
