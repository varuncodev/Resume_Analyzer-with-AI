// src/components/ScoreCard.jsx
import React from 'react';
import './ScoreCard.css';

/**
 * Circular SVG score ring
 */
export function ScoreRing({ score, size = 88, strokeWidth = 7 }) {
  const r  = (size - strokeWidth * 2) / 2;
  const cx = size / 2;
  const circ  = 2 * Math.PI * r;
  const pct   = Math.min(100, Math.max(0, score));
  const offset = circ - (pct / 100) * circ;

  const color =
    pct >= 75 ? 'var(--green-500)' :
    pct >= 50 ? 'var(--amber-400)' :
                'var(--red-400)';

  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
      <circle
        cx={cx} cy={cx} r={r}
        fill="none" stroke="var(--gray-100)" strokeWidth={strokeWidth}
      />
      <circle
        cx={cx} cy={cx} r={r}
        fill="none" stroke={color} strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        transform={`rotate(-90 ${cx} ${cx})`}
        style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)' }}
      />
      <text
        x={cx} y={cx + 1}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={size > 60 ? "16" : "13"}
        fontWeight="600"
        fill={color}
        fontFamily="var(--font-sans)"
      >
        {pct}%
      </text>
    </svg>
  );
}

/**
 * Mini horizontal score bar used inside the breakdown grid
 */
export function ScoreBar({ label, value }) {
  const pct = Math.min(100, Math.max(0, value));
  const cls =
    pct >= 75 ? 'bar-high' :
    pct >= 50 ? 'bar-mid'  : 'bar-low';

  return (
    <div className="score-bar-row">
      <div className="score-bar-header">
        <span className="score-bar-label">{label}</span>
        <span className={`score-bar-value ${cls}`}>{pct}%</span>
      </div>
      <div className="score-bar-track">
        <div
          className={`score-bar-fill ${cls}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
