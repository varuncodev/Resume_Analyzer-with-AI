# AI Resume Analyzer 🤖

A full-stack React application that analyzes resumes against job descriptions using **Groq AI**.  
Built as a college project demonstrating AI integration, PDF parsing, and modern React architecture.

---

## Features

| Feature | Description |
|---|---|
| **PDF Upload** | Drag & drop or click to upload — text extracted with pdf.js |
| **ATS Score** | Applicant Tracking System compatibility score |
| **JD Match %** | How well your resume matches the job description |
| **Keyword Analysis** | Matched vs missing keywords highlighted |
| **Skill Gap Analysis** | AI identifies missing skills and explains gaps |
| **Improvement Suggestions** | Prioritized (High / Medium / Low) action items |
| **Strengths Report** | What your resume already does well |
| **Role Recommendations** | Job titles your profile suits best |

---

## Tech Stack

```
Frontend   →  React 18, CSS Variables, pdf.js
AI Engine  →  Groq AI
PDF Parse  →  pdfjs-dist v3
Styling    →  Pure CSS (no UI library needed)
```

---

## Project Structure

```
resume-analyzer/
├── public/
│   ├── index.html
│   └── pdf.worker.min.js        ← auto-copied by postinstall
│
├── scripts/
│   └── copy-pdf-worker.js       ← copies pdf.js worker to /public
│
├── src/
│   ├── components/
│   │   ├── Header.jsx / .css    ← top navigation
│   │   ├── UploadForm.jsx / .css← file upload + JD input
│   │   ├── LoadingScreen.jsx / .css ← animated analysis steps
│   │   ├── ScoreCard.jsx / .css ← reusable score ring + bar
│   │   └── Results.jsx / .css   ← full analysis report
│   │
│   ├── utils/
│   │   ├── pdfExtractor.js      ← pdf.js text extraction
│   │   └── analyzeResume.js     ← Anthropic API call + prompt
│   │
│   ├── styles/
│   │   └── global.css           ← CSS variables, animations
│   │
│   ├── App.jsx                  ← main state machine (form/loading/results/error)
│   ├── App.css                  ← layout, hero, error panel
│   └── index.js                 ← React entry point
│
├── .env                ← copy to .env and add your API key
├── .gitignore
└── package.json
```

---

## Setup — Step by Step

### Step 1 — Prerequisites

Make sure you have these installed:

```bash
node --version   # need v16 or higher
npm --version    # need v8 or higher
```

Download Node.js from: https://nodejs.org

---

### Step 2 — Get your Anthropic API Key

1. Go to https://console.groq.com/keys
2. Sign up / Log in
3. Click **"API Keys"** in the sidebar
4. Click **"Create Key"** → give it a name → copy the key
5. Keep it safe — you won't see it again!

---

### Step 3 — Download & Install

#### Option A — Clone from GitHub (if you push it there)
```bash
git clone https://github.com/YOUR_USERNAME/resume-analyzer.git
cd resume-analyzer
npm install
```

#### Option B — From the downloaded zip
```bash
unzip resume-analyzer.zip
cd resume-analyzer
npm install
```

`npm install` will automatically:
- Install all dependencies
- Copy `pdf.worker.min.js` to the `/public` folder (via postinstall script)

---

### Step 4 — Add Your API Key

```bash
# Copy the example env file
cp .env.example .env
```

Open `.env` in any text editor and replace the placeholder:

```env
REACT_APP_ANTHROPIC_API_KEY=sk-ant-api03-xxxxxxxxxxxxxxxxxxxxxxxx
```

> ⚠️ Never commit your `.env` file to GitHub. It's already in `.gitignore`.

---

### Step 5 — Run the App

```bash
npm start
```

Your browser will open at **http://localhost:3000**

---

### Step 6 — Build for Production (optional)

```bash
npm run build
```

This creates an optimized `/build` folder you can deploy to:
- **Netlify** — drag & drop the `/build` folder
- **Vercel** — `npx vercel` from the project root
- **GitHub Pages** — add `"homepage"` to package.json

---

## How It Works — Architecture

```
User uploads PDF
      ↓
pdf.js extracts plain text (client-side, no server needed)
      ↓
Text + Job Description sent to Anthropic Claude API
      ↓
Claude analyzes:
  • ATS keyword matching
  • Skill gap identification
  • Experience level detection
  • Formatting quality
  • Improvement suggestions
      ↓
JSON response parsed and rendered as interactive report
```

---

## Customization Tips

### Change the AI model
In `src/utils/analyzeResume.js`:
```js
const MODEL = 'claude-opus-4-20250514';  // more powerful, slower
```

### Add more suggestions
Edit the prompt in `buildPrompt()` inside `analyzeResume.js` — increase the number of suggestions or add new analysis dimensions.

### Change color theme
All colors are CSS variables in `src/styles/global.css`. Change `--green-500` to any color you like.

---

## Common Errors & Fixes

| Error | Fix |
|---|---|
| `API key not found` | Check your `.env` file has the correct variable name |
| `Could not extract text` | Your PDF might be a scanned image — use a text-based PDF |
| `API error 401` | Your API key is invalid or expired |
| `API error 429` | Rate limited — wait a minute and try again |
| `pdf.worker not found` | Run `node scripts/copy-pdf-worker.js` manually |

---

## For College Submission — What to Highlight

- **AI Integration**: Direct API call to Claude AI with custom prompt engineering
- **PDF Parsing**: Client-side PDF text extraction using pdf.js (no backend!)
- **React Architecture**: Component-based UI with clean state management
- **Async/Await**: Modern JavaScript for API calls and file processing
- **UX Design**: Loading states, error handling, responsive layout
- **Security**: API key stored in env variable, never exposed in code

---

## License

MIT — free to use, modify, and submit for college projects.
