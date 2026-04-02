// src/components/Results.jsx
import React from 'react';
import { ScoreRing, ScoreBar } from './ScoreCard';
import './Results.css';

/* ── helpers ────────────────────────────────────────────────────── */

const priorityMeta = {
  High:   { cls: 'pri-high',   icon: '↑', label: 'High priority'   },
  Medium: { cls: 'pri-medium', icon: '→', label: 'Medium priority' },
  Low:    { cls: 'pri-low',    icon: '↓', label: 'Low priority'    },
};

const overallRating = (score) =>
  score >= 80 ? { label: 'Excellent',   cls: 'rating-excellent' } :
  score >= 65 ? { label: 'Good',        cls: 'rating-good'      } :
  score >= 45 ? { label: 'Fair',        cls: 'rating-fair'      } :
                { label: 'Needs Work',  cls: 'rating-poor'      };

function Tag({ text, variant }) {
  return <span className={`tag tag-${variant}`}>{text}</span>;
}

function Card({ title, badge, children, delay = 1 }) {
  return (
    <div className={`result-card fade-in-up fade-in-up-delay-${delay}`}>
      <div className="result-card-header">
        <h3 className="result-card-title">{title}</h3>
        {badge && <span className="result-badge">{badge}</span>}
      </div>
      <div className="result-card-body">{children}</div>
    </div>
  );
}

/* ── main component ─────────────────────────────────────────────── */

export default function Results({ data, fileName, onReset }) {
  const overall = Math.round(
    ((data.ats_score ?? 0) + (data.match_percentage ?? 0) + (data.skill_score ?? 0)) / 3
  );
  const rating = overallRating(overall);

  return (
    <div className="results-container">

      {/* Top bar */}
      <div className="results-topbar fade-in-up">
        <div className="topbar-left">
          <span className="topbar-file">📄 {fileName}</span>
          <span className={`topbar-rating ${rating.cls}`}>{rating.label}</span>
        </div>
        <button className="reset-btn" onClick={onReset}>← Analyze Another</button>
      </div>

      {/* ── Overall score hero ── */}
      <Card title="Overall Score" delay={1}>
        <div className="score-hero">
          <div className="score-hero-ring">
            <ScoreRing score={overall} size={110} strokeWidth={9} />
          </div>
          <div className="score-hero-info">
            <p className="score-hero-summary">{data.overall_summary}</p>
            {data.experience_level && (
              <span className="exp-badge">
                {data.experience_level} Level
              </span>
            )}
            {data.recommended_roles?.length > 0 && (
              <div className="recommended-roles">
                <span className="roles-label">Best fit roles:</span>
                <div className="roles-list">
                  {data.recommended_roles.map((r, i) => (
                    <Tag key={i} text={r} variant="role" />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="score-bars">
          <ScoreBar label="ATS Score"         value={data.ats_score} />
          <ScoreBar label="JD Match"          value={data.match_percentage} />
          <ScoreBar label="Skill Alignment"   value={data.skill_score} />
          <ScoreBar label="Experience"        value={data.experience_score ?? data.skill_score} />
          <ScoreBar label="Resume Formatting" value={data.format_score ?? data.ats_score} />
        </div>
      </Card>

      {/* ── Keyword analysis ── */}
      <Card title="Keyword Analysis" badge={`${(data.matched_keywords ?? []).length} matched`} delay={2}>
        <div className="keywords-section">
          <div className="kw-group">
            <p className="kw-group-label kw-match-label">
              <span className="kw-dot kw-dot-match"></span>
              Matched Keywords
            </p>
            <div className="tag-list">
              {(data.matched_keywords ?? []).map(k => (
                <Tag key={k} text={k} variant="match" />
              ))}
            </div>
          </div>
          <div className="kw-divider"></div>
          <div className="kw-group">
            <p className="kw-group-label kw-missing-label">
              <span className="kw-dot kw-dot-missing"></span>
              Missing Keywords — add these to your resume
            </p>
            <div className="tag-list">
              {(data.missing_keywords ?? []).map(k => (
                <Tag key={k} text={k} variant="missing" />
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* ── Skill gap ── */}
      <Card title="Skill Gap Analysis" delay={3}>
        <p className="skill-gap-explanation">{data.skill_gap_explanation}</p>
        {(data.skills_to_add ?? []).length > 0 && (
          <div className="skills-to-add">
            <p className="kw-group-label" style={{ marginBottom: '8px' }}>Skills to learn or highlight:</p>
            <div className="tag-list">
              {data.skills_to_add.map(s => (
                <Tag key={s} text={s} variant="add" />
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* ── Suggestions ── */}
      <Card
        title="Improvement Suggestions"
        badge={`${(data.suggestions ?? []).filter(s => s.priority === 'High').length} high priority`}
        delay={4}
      >
        <div className="suggestions-list">
          {(data.suggestions ?? []).map((s, i) => {
            const meta = priorityMeta[s.priority] ?? priorityMeta.Low;
            return (
              <div key={i} className={`suggestion-row ${meta.cls}`}>
                <div className="suggestion-icon">{meta.icon}</div>
                <div className="suggestion-content">
                  <p className="suggestion-text">{s.text}</p>
                  <div className="suggestion-footer">
                    <span className="suggestion-priority">{meta.label}</span>
                    {s.category && <span className="suggestion-category">{s.category}</span>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* ── Strengths ── */}
      <Card title="Strengths Identified" delay={5}>
        <div className="strengths-grid">
          {(data.strengths ?? []).map((s, i) => (
            <div key={i} className="strength-item">
              <span className="strength-check">✓</span>
              <span className="strength-text">{s}</span>
            </div>
          ))}
        </div>
      </Card>

      <div className="results-footer">
        <button className="reset-btn-lg" onClick={onReset}>
          Analyze Another Resume →
        </button>
      </div>
    </div>
  );
}
