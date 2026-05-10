'use client';

import { useState } from 'react';
import { usePlannerStore } from '@/store/usePlannerStore';

export default function Timeline() {
  const { timeline, addTimelineBlock, updateTimelineBlock, removeTimelineBlock } = usePlannerStore();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ time: '', title: '', description: '', duration: 60 });
  const [editId, setEditId] = useState<string | null>(null);

  const sorted = [...timeline].sort((a, b) => a.time.localeCompare(b.time));

  const handleAdd = () => {
    if (!form.time || !form.title.trim()) return;
    if (editId) {
      updateTimelineBlock(editId, form);
      setEditId(null);
    } else {
      addTimelineBlock(form);
    }
    setForm({ time: '', title: '', description: '', duration: 60 });
    setShowForm(false);
  };

  const handleEdit = (id: string) => {
    const block = timeline.find(b => b.id === id);
    if (!block) return;
    setForm({ time: block.time, title: block.title, description: block.description, duration: block.duration });
    setEditId(id);
    setShowForm(true);
  };

  return (
    <div className="fade-in" style={{ maxWidth: 720, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700 }}>⏱️ Таймлайн события</h2>
          <p style={{ margin: '6px 0 0', fontSize: 14, color: 'var(--text-muted)' }}>Расписание мероприятия по блокам</p>
        </div>
        <button className="btn-primary" onClick={() => { setShowForm(!showForm); setEditId(null); setForm({ time: '', title: '', description: '', duration: 60 }); }}>
          {showForm ? '✕ Отмена' : '+ Добавить блок'}
        </button>
      </div>

      {showForm && (
        <div className="card slide-in" style={{ padding: 20, marginBottom: 20, borderColor: 'rgba(0,212,255,0.3)' }}>
          <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 16 }}>
            {editId ? 'Редактировать блок' : 'Новый блок'}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={labelStyle}>Время *</label>
              <input className="input-base" type="time" value={form.time} onChange={e => setForm(p => ({ ...p, time: e.target.value }))} />
            </div>
            <div>
              <label style={labelStyle}>Длительность (мин)</label>
              <input className="input-base" type="number" value={form.duration} onChange={e => setForm(p => ({ ...p, duration: parseInt(e.target.value) || 0 }))} min={5} step={5} />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>Название *</label>
              <input className="input-base" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="Что происходит?" />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>Описание</label>
              <textarea className="input-base" value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="Подробности..." rows={2} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
            <button className="btn-primary" onClick={handleAdd}>{editId ? 'Сохранить' : 'Добавить'}</button>
            <button className="btn-ghost" onClick={() => { setShowForm(false); setEditId(null); }}>Отмена</button>
          </div>
        </div>
      )}

      {sorted.length === 0 ? (
        <div className="card" style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>⏱️</div>
          <div>Добавьте первый блок расписания</div>
          <div style={{ fontSize: 13, marginTop: 8, color: 'var(--text-muted)' }}>Например: встреча гостей, торт, конкурсы...</div>
        </div>
      ) : (
        <div style={{ position: 'relative', paddingLeft: 32 }}>
          <div style={{
            position: 'absolute',
            left: 14,
            top: 0,
            bottom: 0,
            width: 2,
            background: 'linear-gradient(180deg, var(--accent), var(--accent2))',
            borderRadius: 1,
          }} />
          {sorted.map((block, idx) => (
            <div key={block.id} style={{ position: 'relative', marginBottom: 16 }}>
              <div style={{
                position: 'absolute',
                left: -26,
                top: 16,
                width: 14,
                height: 14,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--accent), var(--accent2))',
                border: '2px solid var(--background)',
                zIndex: 1,
              }} />
              <div
                className="card card-hover"
                style={{ padding: '16px 18px', marginLeft: 8, cursor: 'pointer' }}
                onClick={() => handleEdit(block.id)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                      <span className="gradient-text" style={{ fontSize: 15, fontWeight: 800 }}>{block.time}</span>
                      <span className="badge" style={{ background: 'rgba(0,212,255,0.1)', color: 'var(--accent3)', fontSize: 11 }}>
                        {block.duration} мин
                      </span>
                    </div>
                    <div style={{ fontSize: 15, fontWeight: 600 }}>{block.title}</div>
                    {block.description && (
                      <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>{block.description}</div>
                    )}
                  </div>
                  <button
                    className="btn-danger"
                    style={{ flexShrink: 0 }}
                    onClick={e => { e.stopPropagation(); removeTimelineBlock(block.id); }}
                  >✕</button>
                </div>
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
