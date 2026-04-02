// src/utils/analyzeResume.js
// Calls Groq API (free, no billing needed) to analyze resume vs job description

const API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL   = 'llama-3.3-70b-versatile'; // Updated model // Free model on Groq

/**
 * analyzeResume
 * @param {string} resumeText — Plain text extracted from the resume PDF
 * @param {string} jobDesc    — Job description pasted by the user
 * @returns {Promise<AnalysisResult>}
 */
export async function analyzeResume(resumeText, jobDesc) {
  const apiKey = process.env.REACT_APP_GROQ_API_KEY;

  if (!apiKey) {
    throw new Error('API key not found. Please add REACT_APP_GROQ_API_KEY to your .env file.');
  }

  const prompt = buildPrompt(resumeText, jobDesc);

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.4,
      max_tokens: 1500,
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err?.error?.message || `Groq API error ${response.status}`);
  }

  const data = await response.json();
  const rawText = data.choices?.[0]?.message?.content || '';

  return parseJSON(rawText);
}

/* ── Prompt builder ───────────────────────────────────────────────── */

function buildPrompt(resumeText, jobDesc) {
  return `You are a senior ATS (Applicant Tracking System) expert and career coach with 15+ years of experience reviewing resumes for tech companies.

Carefully analyze the resume below against the provided job description.

---RESUME START---
${resumeText.slice(0, 4500)}
---RESUME END---

---JOB DESCRIPTION START---
${jobDesc.slice(0, 2000)}
---JOB DESCRIPTION END---

Return ONLY a single valid JSON object — no markdown, no backticks, no extra text before or after.
Use this exact schema:

{
  "ats_score": <integer 0-100, how well the resume passes ATS filters>,
  "match_percentage": <integer 0-100, overall match with job description>,
  "skill_score": <integer 0-100, skills alignment>,
  "experience_score": <integer 0-100, experience relevance>,
  "format_score": <integer 0-100, resume formatting & readability>,
  "overall_summary": "<2-3 concise sentences — overall assessment and biggest opportunity>",
  "matched_keywords": ["<up to 8 keywords found in both resume and JD>"],
  "missing_keywords": ["<up to 7 important JD keywords absent from resume>"],
  "skills_to_add": ["<4-6 specific skills to learn or highlight>"],
  "skill_gap_explanation": "<2-3 sentences explaining the most critical skill gaps and how to address them>",
  "suggestions": [
    { "text": "<specific, actionable suggestion>", "priority": "High",   "category": "Content"    },
    { "text": "<specific, actionable suggestion>", "priority": "High",   "category": "Keywords"   },
    { "text": "<specific, actionable suggestion>", "priority": "Medium", "category": "Formatting" },
    { "text": "<specific, actionable suggestion>", "priority": "Medium", "category": "Experience" },
    { "text": "<specific, actionable suggestion>", "priority": "Low",    "category": "Other"      }
  ],
  "strengths": ["<up to 6 concrete strengths identified in the resume>"],
  "recommended_roles": ["<3 job titles this resume is well suited for>"],
  "experience_level": "<Junior | Mid-level | Senior | Lead | Executive>"
}`;
}

/* ── JSON parser with fallback ────────────────────────────────────── */

function parseJSON(raw) {
  const clean = raw
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/```\s*$/, '')
    .trim();

  try {
    return JSON.parse(clean);
  } catch {
    const match = clean.match(/\{[\s\S]*\}/);
    if (match) return JSON.parse(match[0]);
    throw new Error('Could not parse AI response as JSON. Please try again.');
  }
}
