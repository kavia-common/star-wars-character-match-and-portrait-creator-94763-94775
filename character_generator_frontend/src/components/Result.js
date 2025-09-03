import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../api';

/**
 * PUBLIC_INTERFACE
 * Results component: shows matched character, description, and generated mashup. Provides
 * download and share options.
 */
export default function Result() {
  const { state } = useLocation();
  const [result, setResult] = useState({
    resultId: state?.resultId,
    character: state?.match,
    description: state?.description,
    mashupUrl: state?.mashupUrl,
  });
  const [loading, setLoading] = useState(!state?.mashupUrl && !!state?.resultId);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    if (!result.mashupUrl && result.resultId) {
      (async () => {
        try {
          const data = await api.getMashup(result.resultId);
          if (!cancelled) {
            setResult(prev => ({ ...prev, mashupUrl: data?.mashupUrl || data?.imageUrl, character: prev.character || data?.character, description: prev.description || data?.description }));
          }
        } catch (e) {
          if (!cancelled) setError('Failed to load mashup image.');
        } finally {
          if (!cancelled) setLoading(false);
        }
      })();
    }
    return () => { cancelled = true; };
  }, [result.resultId]); // eslint-disable-line react-hooks/exhaustive-deps

  const download = async () => {
    try {
      const url = result.mashupUrl;
      if (!url) return;
      const res = await fetch(url);
      const blob = await res.blob();
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'star-wars-mashup.jpg';
      a.click();
    } catch (e) {
      setError('Download failed.');
    }
  };

  const shareNative = async () => {
    try {
      if (navigator.share && result.mashupUrl) {
        await navigator.share({
          title: 'My Star Wars Character Match',
          text: `I matched with ${result.character || 'a Star Wars character'}!`,
          url: result.mashupUrl
        });
      } else {
        await navigator.clipboard.writeText(result.mashupUrl || window.location.href);
        alert('Link copied to clipboard');
      }
    } catch (e) {
      // ignore
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="panel"><div className="panel-inner">Generating your neon masterpiece…</div></div>
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

  return (
    <div className="container">
      <div className="panel">
        <div className="panel-inner">
          <div className="result-grid">
            <div className="preview">
              {result.mashupUrl ? (
                <img src={result.mashupUrl} alt="Generated mashup" />
              ) : (
                <div style={{ padding: 16 }} className="subtitle">No image available.</div>
              )}
            </div>
            <div className="meta">
              <h2 className="result-title">{result.character ? `You matched: ${result.character}` : 'Your Match'}</h2>
              <div className="subtitle">{result.description || 'A bold hero from a galaxy far, far away.'}</div>
              <div style={{ display: 'flex', gap: 10, marginTop: 8, flexWrap: 'wrap' }}>
                <button className="btn btn-primary btn-icon" onClick={download}>⬇️ Download</button>
                <button className="btn btn-icon" onClick={shareNative}>🔗 Share</button>
              </div>
              <div className="panel" style={{ marginTop: 12 }}>
                <div className="panel-inner">
                  <div className="section-title">What next?</div>
                  <div className="subtitle">Try again, tweak answers, or share with friends.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>  
    </div>
  );
}
