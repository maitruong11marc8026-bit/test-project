'use client';

import { useState } from 'react';
import { usePlannerStore } from '@/store/usePlannerStore';

const COLORS = ['#e91e8c', '#7b2ff7', '#00d4ff', '#00e5a0', '#ffb800', '#ff4757'];

export default function Ideas() {
  const { ideas, addIdea, updateIdea, removeIdea } = usePlannerStore();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', content: '', color: COLORS[0] });
  const [editId, setEditId] = useState<string | null>(null);

  const handleSave = () => {
    if (!form.title.trim()) return;
    if (editId) {
      updateIdea(editId, form);
      setEditId(null);
    } else {
      addIdea(form);
    }
    setForm({ title: '', content: '', color: COLORS[0] });
    setShowForm(false);
  };

  const handleEdit = (id: string) => {
    const idea = ideas.find(i => i.id === id);
    if (!idea) return;
    setForm({ title: idea.title, content: idea.content, color: idea.color });
    setEditId(id);
    setShowForm(true);
  };

  return (
    <div className="fade-in" style={{ maxWidth: 900, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700 }}>💡 Идеи и заметки</h2>
          <p style={{ margin: '6px 0 0', fontSize: 14, color: 'var(--text-muted)' }}>Сохраняйте идеи для вашего мероприятия</p>
        </div>
        <button className="btn-primary" onClick={() => { setShowForm(!showForm); setEditId(null); setForm({ title: '', content: '', color: COLORS[0] }); }}>
          {showForm ? '✕ Отмена' : '+ Новая идея'}
        </button>
      </div>

      {showForm && (
        <div className="card slide-in" style={{ padding: 20, marginBottom: 20, borderColor: `${form.color}44` }}>
          <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 16 }}>
            {editId ? 'Редактировать идею' : 'Новая идея'}
          </div>
          <div style={{ display: 'grid', gap: 12 }}>
            <div>
              <label style={labelStyle}>Заголовок *</label>
              <input className="input-base" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="Название идеи" />
            </div>
            <div>
              <label style={labelStyle}>Описание</label>
              <textarea className="input-base" value={form.content} onChange={e => setForm(p => ({ ...p, content: e.target.value }))} placeholder="Опишите идею подробнее..." rows={3} />
            </div>
            <div>
              <label style={labelStyle}>Цвет</label>
              <div style={{ display: 'flex', gap: 10 }}>
                {COLORS.map(c => (
                  <button
                    key={c}
                    onClick={() => setForm(p => ({ ...p, color: c }))}
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: '50%',
                      background: c,
                      border: form.color === c ? '3px solid white' : '3px solid transparent',
                      cursor: 'pointer',
                      transition: 'transform 0.1s',
                      transform: form.color === c ? 'scale(1.2)' : 'scale(1)',
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
            <button className="btn-primary" onClick={handleSave}>{editId ? 'Сохранить' : 'Добавить'}</button>
            <button className="btn-ghost" onClick={() => { setShowForm(false); setEditId(null); }}>Отмена</button>
          </div>
        </div>
      )}

      {ideas.length === 0 ? (
        <div className="card" style={{ padding: 60, textAlign: 'center', color: 'var(--text-muted)' }}>
          <div style={{ fontSize: 50, marginBottom: 16 }}>💡</div>
          <div style={{ fontSize: 16 }}>Запишите свои идеи для вечеринки</div>
          <div style={{ fontSize: 13, marginTop: 8 }}>Тема, декор, развлечения — всё сюда!</div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          {ideas.map(idea => (
            <div
              key={idea.id}
              className="card card-hover"
              style={{
                padding: 20,
                borderTop: `3px solid ${idea.color}`,
                cursor: 'pointer',
                position: 'relative',
              }}
              onClick={() => handleEdit(idea.id)}
            >
              <div
                style={{
                  position: 'absolute',
                  top: 12,
                  right: 12,
                }}
                onClick={e => { e.stopPropagation(); removeIdea(idea.id); }}
              >
                <button className="btn-danger" style={{ padding: '4px 8px', fontSize: 12 }}>✕</button>
              </div>
              <div style={{ fontSize: 24, marginBottom: 8 }}>💡</div>
              <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 8, paddingRight: 36 }}>{idea.title}</div>
              {idea.content && (
                <div style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6 }}>
                  {idea.content.length > 120 ? idea.content.slice(0, 120) + '...' : idea.content}
                </div>
              )}
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 12 }}>
                {new Date(idea.createdAt).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}
              </div>
            </div>
          ))}
        </div>
      )}
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
