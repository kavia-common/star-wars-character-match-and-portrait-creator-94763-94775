import React from 'react';
import { Link } from 'react-router-dom';

/**
 * PUBLIC_INTERFACE
 * Start screen with bold retro neon visuals and CTA to begin quiz.
 */
export default function Start() {
  return (
    <div className="container">
      <div className="panel">
        <div className="panel-inner">
          <div className="hero">
            <div className="hero-copy">
              <h1 className="hero-title">Discover Your Star Wars Alter Ego</h1>
              <p className="hero-desc">
                Take a quick retro quiz, snap a selfie, and get a neon-80s mall photo mash-up
                with your matched character. Share it with the galaxy.
              </p>
              <div className="hero-cta">
                <Link to="/quiz" className="btn btn-primary btn-icon">🚀 Start the Quiz</Link>
                <Link to="/admin" className="btn btn-ghost btn-icon">🛠 Admin Panel</Link>
              </div>
            </div>
            <div className="preview" aria-hidden>
              <div style={{padding:16}}>
                <div className="section-title">Retro Vibes</div>
                <p className="subtitle">Neon lines, synth glow, and bold typography.</p>
                <div style={{
                  height: 260,
                  marginTop: 10,
                  background:
                    'linear-gradient(135deg, rgba(207,136,12,0.2), rgba(0,229,255,0.2))',
                  borderRadius: 12,
                  boxShadow: 'inset 0 0 120px rgba(0,0,0,0.45), 0 0 30px rgba(0,229,255,0.15)',
                  border: '1px solid rgba(255,255,255,0.08)'
                }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
