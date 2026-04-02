// src/components/LoadingScreen.jsx
import React, { useEffect, useState } from 'react';
import './LoadingScreen.css';

const STEPS = [
  { label: 'Parsing your PDF resume',         duration: 1400 },
  { label: 'Running ATS keyword scan',         duration: 1800 },
  { label: 'Analyzing skill gaps with AI',     duration: 2200 },
  { label: 'Matching against job description', duration: 1600 },
  { label: 'Generating improvement report',    duration: 2000 },
];

export default function LoadingScreen() {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    let elapsed = 0;
    const timers = STEPS.map((step, i) => {
      const t = setTimeout(() => setActiveStep(i + 1), elapsed + step.duration);
      elapsed += step.duration;
      return t;
    });
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="loading-screen">
      <div className="loading-card">
        <div className="loading-ring">
          <svg viewBox="0 0 80 80" width="80" height="80">
            <circle cx="40" cy="40" r="32" fill="none" stroke="var(--green-50)" strokeWidth="6"/>
            <circle
              cx="40" cy="40" r="32"
              fill="none"
              stroke="var(--green-500)"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray="201"
              strokeDashoffset="150"
              transform="rotate(-90 40 40)"
              className="ring-spinner"
            />
          </svg>
          <span className="ring-icon">◈</span>
        </div>

        <h2 className="loading-title">Analyzing your resume...</h2>
        <p className="loading-sub">Our AI is reviewing every detail</p>

        <div className="steps-list">
          {STEPS.map((step, i) => {
            const state = i < activeStep ? 'done' : i === activeStep ? 'active' : 'pending';
            return (
              <div key={i} className={`step-row step-${state}`}>
                <div className="step-indicator">
                  {state === 'done'   && <span className="step-check">✓</span>}
                  {state === 'active' && <span className="step-dot-pulse"></span>}
                  {state === 'pending'&& <span className="step-dot-idle"></span>}
                </div>
                <span className="step-label">{step.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
