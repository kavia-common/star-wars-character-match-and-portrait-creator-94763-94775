import React from 'react';
import { Link } from 'react-router-dom';

/**
 * PUBLIC_INTERFACE
 * Navbar with branding and route links.
 */
export default function Navbar() {
  return (
    <div className="navbar">
      <div className="nav-inner">
        <div className="brand">
          <div className="brand-badge" />
          <span>Star Wars Match & Portrait</span>
        </div>
        <div className="nav-spacer" />
        <div className="nav-links">
          <Link to="/" className="nav-btn">Home</Link>
          <Link to="/quiz" className="nav-btn">Quiz</Link>
          <Link to="/upload" className="nav-btn">Upload</Link>
          <Link to="/admin" className="nav-btn">Admin</Link>
        </div>
      </div>
    </div>
  );
}
