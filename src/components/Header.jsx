// src/components/Header.jsx
import React from 'react';
import './Header.css';

export default function Header() {
  return (
    <header className="header">
      <div className="header-inner">
        <div className="header-logo">
          <span className="logo-icon">◈Resume</span>
          <span className="logo-text">Analyzer</span>
        </div>
        <nav className="header-nav">
          <a href="https://aistudio.google.com/app/apikey?_gl=1*1xqztn7*_ga*MTA4Njk2OTkzNi4xNzc1MTYzNzQ0*_ga_P1DBVKWT6V*czE3NzUxNjM3NDQkbzEkZzAkdDE3NzUxNjM3NDYkajU4JGwwJGgxMDEyMzE0OTE0" target="_blank" rel="noreferrer" className="nav-link">
            Get API Key ↗
          </a>
        </nav>
      </div>
    </header>
  );
}
