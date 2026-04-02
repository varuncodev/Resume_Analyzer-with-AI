// src/components/UploadForm.jsx
import React, { useRef, useState, useCallback } from 'react';
import { validatePDF } from '../utils/pdfExtractor';
import './UploadForm.css';

export default function UploadForm({ onSubmit, loading }) {
  const [file, setFile]     = useState(null);
  const [jd, setJd]         = useState('');
  const [drag, setDrag]     = useState(false);
  const [fileError, setFileError] = useState('');
  const fileRef = useRef();

  const handleFile = useCallback((f) => {
    const { valid, error } = validatePDF(f);
    if (!valid) { setFileError(error); return; }
    setFileError('');
    setFile(f);
  }, []);

  const onDrop = useCallback((e) => {
    e.preventDefault();
    setDrag(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  }, [handleFile]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!file || !jd.trim()) return;
    onSubmit(file, jd.trim());
  };

  const canSubmit = file && jd.trim().length >= 30 && !loading;

  return (
    <form className="upload-form" onSubmit={handleSubmit} noValidate>

      {/* ── Upload Zone ─────────────────────────── */}
      <div className="form-section fade-in-up fade-in-up-delay-1">
        <label className="section-label">
          <span className="label-num">01</span> Upload Resume
        </label>

        <div
          className={`upload-zone ${drag ? 'dragging' : ''} ${file ? 'has-file' : ''}`}
          onClick={() => fileRef.current.click()}
          onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
          onDragLeave={() => setDrag(false)}
          onDrop={onDrop}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && fileRef.current.click()}
          aria-label="Upload resume PDF"
        >
          <input
            ref={fileRef}
            type="file"
            accept=".pdf,application/pdf"
            onChange={(e) => e.target.files[0] && handleFile(e.target.files[0])}
            style={{ display: 'none' }}
          />

          {file ? (
            <div className="file-preview">
              <span className="file-icon">📄</span>
              <div className="file-meta">
                <span className="file-name">{file.name}</span>
                <span className="file-size">{(file.size / 1024).toFixed(1)} KB · PDF</span>
              </div>
              <button
                type="button"
                className="remove-file"
                onClick={(e) => { e.stopPropagation(); setFile(null); }}
                aria-label="Remove file"
              >
                ✕
              </button>
            </div>
          ) : (
            <div className="upload-prompt">
              <div className="upload-icon-wrap">
                <span className="upload-icon">⬆</span>
              </div>
              <p className="upload-title">Drop your resume here</p>
              <p className="upload-sub">PDF only · max 10 MB · click or drag &amp; drop</p>
            </div>
          )}
        </div>

        {fileError && <p className="field-error">{fileError}</p>}
      </div>

      {/* ── Job Description ──────────────────────── */}
      <div className="form-section fade-in-up fade-in-up-delay-2">
        <label className="section-label" htmlFor="jd-input">
          <span className="label-num">02</span> Job Description
        </label>
        <textarea
          id="jd-input"
          className="jd-textarea"
          placeholder="Paste the full job description here — include required skills, responsibilities, and qualifications for the most accurate analysis..."
          value={jd}
          onChange={(e) => setJd(e.target.value)}
          rows={7}
          required
        />
        <div className="jd-meta">
          <span className={jd.length < 30 ? 'char-warn' : 'char-ok'}>
            {jd.length} characters {jd.length < 30 ? '(need at least 30)' : '✓'}
          </span>
        </div>
      </div>

      {/* ── Submit ───────────────────────────────── */}
      <div className="form-section fade-in-up fade-in-up-delay-3">
        <button
          type="submit"
          className={`submit-btn ${canSubmit ? 'active' : ''}`}
          disabled={!canSubmit}
        >
          {loading ? (
            <span className="btn-inner">
              <span className="btn-spinner"></span> Analyzing...
            </span>
          ) : (
            <span className="btn-inner">
              <span>Analyze Resume with AI</span>
              <span className="btn-arrow">→</span>
            </span>
          )}
        </button>

        <p className="submit-note">
          Powered by Resume-Analyzer · Your data is never stored
        </p>
      </div>
    </form>
  );
}
