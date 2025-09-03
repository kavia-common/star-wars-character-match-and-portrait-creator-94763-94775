import React, { useEffect, useState } from 'react';
import api from '../api';

/**
 * PUBLIC_INTERFACE
 * Responsive Admin panel to manage quiz questions and characters.
 */
export default function Admin() {
  const [tab, setTab] = useState('questions');

  return (
    <div className="container">
      <div className="panel">
        <div className="panel-inner">
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
            <div className="section-title">Admin Panel</div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className={`btn ${tab === 'questions' ? 'btn-primary' : ''}`} onClick={() => setTab('questions')}>Questions</button>
              <button className={`btn ${tab === 'characters' ? 'btn-primary' : ''}`} onClick={() => setTab('characters')}>Characters</button>
            </div>
          </div>
          {tab === 'questions' ? <QuestionsManager /> : <CharactersManager />}
        </div>
      </div>
    </div>
  );
}

function QuestionsManager() {
  const [items, setItems] = useState([]);
  const [active, setActive] = useState(null);
  const [loading, setLoading] = useState(true);
  const empty = { text: '', options: [{ id: 'A', text: '' }, { id: 'B', text: '' }, { id: 'C', text: '' }, { id: 'D', text: '' }] };

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.getQuestions();
      setItems(res?.items || []);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const select = (q) => setActive(q ? { ...q } : { ...empty });

  const updateOption = (idx, text) => {
    setActive(prev => {
      const options = [...(prev.options || [])];
      options[idx] = { ...options[idx], text };
      return { ...prev, options };
    });
  };

  const save = async () => {
    try {
      const saved = await api.saveQuestion(active);
      await load();
      setActive(saved);
    } catch {
      alert('Failed to save');
    }
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this question?')) return;
    try {
      await api.deleteQuestion(id);
      await load();
      setActive(null);
    } catch {
      alert('Failed to delete');
    }
  };

  return (
    <div className="admin-grid">
      <div className="sidebar">
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
          <div style={{ fontWeight: 700 }}>Questions</div>
          <button className="btn btn-primary btn-icon" onClick={() => select(null)}>＋ New</button>
        </div>
        <div className="list">
          {loading ? <div className="subtitle">Loading…</div> : (items.map(q => (
            <div key={q.id} className={`list-item ${active?.id === q.id ? 'active' : ''}`} onClick={() => select(q)}>
              {q.text}
            </div>
          )))}
        </div>
      </div>
      <div className="panel">
        <div className="panel-inner">
          {active ? (
            <form onSubmit={(e) => { e.preventDefault(); save(); }}>
              <label className="label">Question</label>
              <input className="input" value={active.text} onChange={(e) => setActive({ ...active, text: e.target.value })} placeholder="Enter question text" />
              <div style={{ display: 'grid', gap: 10, gridTemplateColumns: '1fr 1fr', marginTop: 10 }}>
                {(active.options || []).map((opt, i) => (
                  <div key={opt.id}>
                    <label className="label">Option {opt.id}</label>
                    <input className="input" value={opt.text} onChange={(e) => updateOption(i, e.target.value)} placeholder={`Option ${opt.id}`} />
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
                <button type="submit" className="btn btn-primary">Save</button>
                {active.id && <button type="button" className="btn" onClick={() => remove(active.id)}>Delete</button>}
              </div>
            </form>
          ) : <div className="subtitle">Select a question to edit or create a new one.</div>}
        </div>
      </div>
    </div>
  );
}

function CharactersManager() {
  const [items, setItems] = useState([]);
  const [active, setActive] = useState(null);
  const [loading, setLoading] = useState(true);
  const empty = { name: '', description: '', baseImageUrl: '' };

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.getCharacters();
      setItems(res?.items || []);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const select = (c) => setActive(c ? { ...c } : { ...empty });

  const save = async () => {
    try {
      const saved = await api.saveCharacter(active);
      await load();
      setActive(saved);
    } catch {
      alert('Failed to save');
    }
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this character?')) return;
    try {
      await api.deleteCharacter(id);
      await load();
      setActive(null);
    } catch {
      alert('Failed to delete');
    }
  };

  return (
    <div className="admin-grid">
      <div className="sidebar">
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
          <div style={{ fontWeight: 700 }}>Characters</div>
          <button className="btn btn-primary btn-icon" onClick={() => select(null)}>＋ New</button>
        </div>
        <div className="list">
          {loading ? <div className="subtitle">Loading…</div> : (items.map(c => (
            <div key={c.id} className={`list-item ${active?.id === c.id ? 'active' : ''}`} onClick={() => select(c)}>
              {c.name}
            </div>
          )))}
        </div>
      </div>
      <div className="panel">
        <div className="panel-inner">
          {active ? (
            <form onSubmit={(e) => { e.preventDefault(); save(); }}>
              <label className="label">Name</label>
              <input className="input" value={active.name} onChange={(e) => setActive({ ...active, name: e.target.value })} placeholder="Character name" />
              <label className="label" style={{ marginTop: 8 }}>Description</label>
              <textarea className="input" rows={4} value={active.description} onChange={(e) => setActive({ ...active, description: e.target.value })} placeholder="Describe the character" />
              <label className="label" style={{ marginTop: 8 }}>Base Image URL</label>
              <input className="input" value={active.baseImageUrl} onChange={(e) => setActive({ ...active, baseImageUrl: e.target.value })} placeholder="https://..." />
              <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
                <button type="submit" className="btn btn-primary">Save</button>
                {active.id && <button type="button" className="btn" onClick={() => remove(active.id)}>Delete</button>}
              </div>
            </form>
          ) : <div className="subtitle">Select a character to edit or create a new one.</div>}
        </div>
      </div>
    </div>
  );
}
