import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Start from './components/Start';
import Quiz from './components/Quiz';
import Upload from './components/Upload';
import Result from './components/Result';
import Admin from './components/Admin';

/**
 * PUBLIC_INTERFACE
 * App root with router and global shell.
 */
function App() {
  return (
    <div className="app-shell">
      <BrowserRouter>
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Start />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/result" element={<Result />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </main>
        <footer className="footer">© {new Date().getFullYear()} Neon Galaxy Labs</footer>
      </BrowserRouter>
    </div>
  );
}

export default App;
