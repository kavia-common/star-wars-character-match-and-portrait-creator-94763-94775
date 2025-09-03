import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

/**
 * PUBLIC_INTERFACE
 * Quiz component: fetches questions, renders one-by-one with progress. Submits answers to backend.
 */
export default function Quiz() {
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await api.getQuiz();
        if (!cancelled) {
          setQuestions(data?.questions || []);
          setLoading(false);
        }
      } catch (e) {
        setError('Failed to load quiz. Please try again later.');
        setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const total = questions.length;
  const current = questions[index];

  const selectAnswer = (qid, optionId) => {
    setAnswers(prev => ({ ...prev, [qid]: optionId }));
  };

  const next = () => {
    if (index < total - 1) setIndex(i => i + 1);
  };

  const back = () => {
    if (index > 0) setIndex(i => i - 1);
  };

  const submit = async () => {
    try {
      setLoading(true);
      const result = await api.submitAnswers(answers);
      setLoading(false);
      // Navigate to upload with resultId to tie selfie/mashup
      navigate('/upload', { state: { resultId: result?.resultId, match: result?.character, description: result?.description } });
    } catch (e) {
      setLoading(false);
      setError('Failed to submit answers. Try again.');
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="panel"><div className="panel-inner">Loading…</div></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="panel"><div className="panel-inner">{error}</div></div>
      </div>
    );
  }

  if (!current) {
    return (
      <div className="container">
        <div className="panel"><div className="panel-inner">No questions are available.</div></div>
      </div>
    );
  }

  const answeredCount = Object.keys(answers).length;
  const percent = Math.round(((answeredCount) / (total || 1)) * 100);

  return (
    <div className="container">
      <div className="panel">
        <div className="panel-inner">
          <div className="section-title">Quiz</div>
          <div className="subtitle">Question {index + 1} of {total}</div>

          <div className="quiz-progress" aria-label={`Quiz progress ${percent}%`}>
            {Array.from({ length: total }).map((_, i) => (
              <div key={i} className="pill"><span style={{ width: `${Math.min(100, i < answeredCount ? 100 : (i === answeredCount ? percent - (answeredCount - i) * 100 : 0))}%` }} /></div>
            ))}
          </div>

          <div style={{ marginTop: 6, fontSize: 18, fontWeight: 700 }}>{current.text}</div>
          <div className="answers">
            {current.options.map((opt) => {
              const selected = answers[current.id] === opt.id;
              return (
                <button
                  type="button"
                  key={opt.id}
                  className={`answer ${selected ? 'selected' : ''}`}
                  onClick={() => selectAnswer(current.id, opt.id)}
                  aria-pressed={selected}
                >
                  {opt.text}
                </button>
              );
            })}
          </div>

          <div style={{ display: 'flex', gap: 10, marginTop: 14, flexWrap: 'wrap' }}>
            <button className="btn" onClick={back} disabled={index === 0}>← Back</button>
            {index < total - 1 ? (
              <button className="btn btn-primary" onClick={next} disabled={!answers[current.id]}>Next →</button>
            ) : (
              <button className="btn btn-primary" onClick={submit} disabled={answeredCount < total}>Submit</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
