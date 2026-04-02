# 🎯 AI Resume Analyzer

An AI-powered resume analyzer built with **React** + **Groq AI (Llama 3.3)** that scores your resume against a job description, identifies keyword gaps, and gives actionable suggestions — in under 30 seconds.

> **College Project** — Free for first 2 analyses, ₹9/analysis after that.

---

## ✨ Features

- 📄 **PDF Resume Upload** — Extracts text from your resume automatically
- 🤖 **AI Analysis** — Powered by Groq's Llama 3.3-70b model (free & fast)
- 📊 **ATS Score** — See how well your resume passes ATS filters
- 🔍 **Keyword Gap Analysis** — Matched & missing keywords from the job description
- 💡 **Skill Recommendations** — What to learn or highlight
- ✅ **Actionable Suggestions** — Prioritized by High / Medium / Low
- 🔐 **Google Login** — Track usage per user via Firebase Auth
- 💳 **Razorpay Payments** — ₹9 per analysis after 2 free uses
- 🚫 **Temp Email Blocked** — Only genuine email accounts allowed

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 |
| AI Model | Groq API — `llama-3.3-70b-versatile` |
| PDF Parsing | pdfjs-dist |
| Auth | Firebase Authentication (Google Sign-in) |
| Database | Firebase Firestore |
| Payments | Razorpay |

---

## 📁 Project Structure

```
resume-analyzer/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Header.jsx / .css
│   │   ├── UploadForm.jsx / .css
│   │   ├── LoadingScreen.jsx / .css
│   │   ├── Results.jsx / .css
│   │   ├── ScoreCard.jsx / .css
│   │   ├── AuthScreen.jsx / .css       ← Google login screen
│   │   └── PaymentWall.jsx / .css      ← Razorpay payment wall
│   ├── utils/
│   │   ├── analyzeResume.js            ← Groq API call
│   │   ├── pdfExtractor.js             ← PDF text extraction
│   │   ├── firebase.js                 ← Auth + Firestore helpers
│   │   ├── razorpay.js                 ← Payment integration
│   │   └── validateEmail.js            ← Blocks disposable emails
│   ├── styles/
│   │   └── global.css
│   ├── App.jsx                         ← Main app logic
│   └── App.css
├── .env                                ← Your secret keys (never commit!)
├── .env.example                        ← Template for keys
├── .gitignore
└── package.json
```

---

## ⚙️ Setup & Installation

### Step 1 — Clone / Download the project

```bash
# If using git
git clone https://github.com/your-username/resume-analyzer.git
cd resume-analyzer

# Or just unzip the downloaded folder
cd resume-analyzer
```

### Step 2 — Install dependencies

```bash
npm install
```

### Step 3 — Set up API keys

Create a `.env` file in the root folder (same level as `package.json`):

```env
REACT_APP_GROQ_API_KEY=gsk_your_groq_key_here
REACT_APP_FIREBASE_API_KEY=AIzaSy_your_firebase_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_APP_ID=1:123456789:web:abc123
REACT_APP_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
```

### Step 4 — Start the app

```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Getting API Keys

### 1. Groq API Key (Free)
1. Go to [console.groq.com/keys](https://console.groq.com/keys)
2. Sign up (no credit card needed)
3. Click **"Create API Key"**
4. Copy the key — starts with `gsk_...`
5. Free tier: **14,400 requests/day**

---

### 2. Firebase (Free)
1. Go to [console.firebase.google.com](https://console.firebase.google.com)
2. Click **"Add project"** → name it → click Create
3. **Enable Google Auth:**
   - Build → Authentication → Get started
   - Sign-in method → Google → Enable → Save
4. **Enable Firestore:**
   - Build → Firestore Database → Create database
   - Select region: **asia-south1 (Mumbai)**
   - Start in **Test mode** → Enable
5. **Get config keys:**
   - Click ⚙ gear icon → Project settings
   - Scroll to "Your apps" → click **</> Web** icon
   - Register app → copy the `firebaseConfig` values into your `.env`

**Firestore Security Rules** (update before going live):
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null
        && request.auth.uid == userId;
    }
  }
}
```

---

### 3. Razorpay (Free test mode)
1. Go to [dashboard.razorpay.com](https://dashboard.razorpay.com)
2. Sign up for a free account
3. Settings → API Keys → **Generate Test Key**
4. Copy the Key ID — starts with `rzp_test_...`
5. When going live, replace with `rzp_live_...` key

---

## 💰 Pricing Logic

| Usage | Cost |
|-------|------|
| First 2 analyses | **Free** |
| 3rd analysis onwards | **₹9 per analysis** |

- Usage is tracked per user in **Firestore** (linked to Google account)
- Payment is processed via **Razorpay** (UPI, Cards, Net Banking supported)
- Temporary/disposable email accounts are **blocked**

---

## 📊 What the Analysis Returns

| Field | Description |
|-------|-------------|
| `ats_score` | How well the resume passes ATS filters (0–100) |
| `match_percentage` | Overall match with job description (0–100) |
| `skill_score` | Skills alignment score (0–100) |
| `experience_score` | Experience relevance score (0–100) |
| `format_score` | Resume formatting quality (0–100) |
| `matched_keywords` | Up to 8 keywords found in both resume & JD |
| `missing_keywords` | Up to 7 important keywords missing from resume |
| `skills_to_add` | 4–6 skills to learn or highlight |
| `suggestions` | Prioritized actionable improvements |
| `strengths` | Up to 6 strengths found in resume |
| `recommended_roles` | 3 job titles this resume suits |
| `experience_level` | Junior / Mid-level / Senior / Lead / Executive |

---

## 🚀 Deployment

### Deploy to Vercel (Recommended)
```bash
npm install -g vercel
vercel
```
Add all your `.env` variables in **Vercel → Project → Settings → Environment Variables**.

Then add your Vercel domain to:
- Firebase Console → Authentication → Authorised domains

### Deploy to Netlify
```bash
npm run build
# Drag & drop the /build folder to netlify.com
```
Add environment variables in **Netlify → Site settings → Environment variables**.

---

## ⚠️ Important Notes

- **Never commit your `.env` file** — it's in `.gitignore` already
- **Groq is free** but has rate limits — 14,400 requests/day on free tier
- **Firestore Test Mode** expires in 30 days — update security rules before then
- **Razorpay test mode** — use test card `4111 1111 1111 1111` to simulate payments
- PDF must be **text-based** (not a scanned image) for text extraction to work

---

## 🧪 Testing Payments (Razorpay Test Mode)

Use these test credentials in the Razorpay popup:

| Method | Details |
|--------|---------|
| Card | `4111 1111 1111 1111` · Expiry: any future date · CVV: any 3 digits |
| UPI | `success@razorpay` |
| Net Banking | Select any bank → use test credentials shown |

---

## 📝 License

MIT — free to use for educational purposes.

---

*Built with ❤️ using React + Groq AI · College Project*
