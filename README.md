<div align="center">
  <img src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" width="100%" alt="NextStep AI Header Banner" style="border-radius: 8px;" />
  <h1 align="center">🚀 NextStep AI</h1>
  <p align="center"><strong>Your AI-Powered Career Growth Companion & Professional Assistant</strong></p>
  <p align="center">
    <a href="#-features"><img src="https://img.shields.io/badge/Features-8%20Core%20Modules-brightgreen" alt="Features" /></a>
    <a href="#-tech-stack"><img src="https://img.shields.io/badge/Tech%20Stack-Fullstack--TS-blue" alt="Tech Stack" /></a>
    <a href="#-railway-deployment"><img src="https://img.shields.io/badge/Deploy-Railway-blueviolet" alt="Railway" /></a>
    <a href="https://ai.studio/apps/efa179c5-2dfd-4463-b6f9-02cf4f8c900f"><img src="https://img.shields.io/badge/AI%20Studio-Live%20App-orange" alt="AI Studio View" /></a>
  </p>
</div>

---

## 📖 Project Overview

**NextStep AI** is an advanced, production-ready career planning and enhancement suite designed to act as an all-in-one assistant for professional development. Underpinned by Google's state-of-the-art **Gemini Large Language Model (LLM)**, it delivers customized learning guides, automates resume diagnostics, guides users through responsive mock interviews, and helps track critical skillsets.

With a meticulously polished, responsive modern interface styled with Tailwind CSS, NextStep AI provides high-fidelity, interactive widgets to help job-seekers transition from application anxiety to career empowerment.

---

## ⚡ Key Features

NextStep AI consists of **eight specialized, fully integrated modules** that work in tandem:

### 1. 🤖 Nova AI Career Coach
* **Conversational Advisory**: Engage with *Nova*, an AI-driven professional coach capable of addressing complex career path inquiries, job search strategies, and industry shifts.
* **Context-Aware Recommendations**: Leverages current user profile states and resume scores to tailor interactive recommendations.

### 2. 📊 Skills Tracker
* **Interactive Assessment Matrix**: Grid interface allowing users to self-assess their professional competence across different technology verticals.
* **Gap Analysis**: Identifies critical technical and soft skill deficits for user-defined goal positions.

### 3. 🗺️ Career Roadmap Generator
* **Node Tree Visualization**: Converts high-level goals into beautifully structured, nested visual step charts representing milestones.
* **AI Curriculum Assembly**: Automatically structures curated reading resources, study timelines, and practice goals for each roadmap node.

### 4. 📄 Resume Diagnostic Analyzer
* **Instant ATS Assessment**: Paste resume content to obtain dynamic scoring across content structure, nomenclature, and keyword frequency.
* **Granular Action Feedback**: Provides contextual critiques on layout clarity, action-verb usage, impact metric presence, and ATS optimizations.

### 5. 🏗️ Visual Portfolio Builder
* **Live Layout Customization**: Visual panel allowing users to configure section order, highlight professional credentials, and select accent colors.
* **Production Preview**: Generates elegant, preview-ready mock websites suited to demonstrate technical proficiencies.

### 6. 🎙️ Interview Prep Simulator
* **Tailored Scenario Generation**: Select standard job profiles or enter bespoke job specifications to trigger custom interview simulations.
* **Granular Feedback Terminal**: Analyzes answers dynamically using Gemini, returning detailed evaluation grades, structural answers, and suggestions.

### 7. 📈 Growth Analytics Dashboard
* **Growth Vectors**: Visual tracking showing metrics regarding resume optimization scores, completed roadmaps, and mock interview counts over time.
* **Action Center**: Dynamically highlights high-priority career actions (e.g., "Address your JavaScript skills gap", "Practice System Design interview").

### 8. 🔐 Unified Security & Identity Management
* **Flexible Sign-In Options**: Full authorization options spanning Password Accounts, Google SSO, and GitHub OAuth integrations.
* **Account Credentials Consolidation**: Advanced multi-provider resolution linking secondary credentials to avoid profile duplications.

---

## 🛠️ Tech Stack

NextStep AI is built using industry-standard, high-performance web technologies:

| Layer | Technologies Used | Key Purpose |
| :--- | :--- | :--- |
| **Frontend UI** | React 19, TypeScript 5, Vite 6 | High-speed, responsive Single Page Application (SPA) development. |
| **Styling** | Tailwind CSS v4, Motion | Clean visual spacing, premium typography, and hardware-accelerated animations. |
| **Icons** | Lucide React | High-contrast, clean SVG vector iconography across dashboards. |
| **Backend API** | Node.js, Express.js, `tsx` | Secure API gateway, request routing, and server-side model proxying. |
| **Database** | Firebase Firestore | Persistent cloud storage for user metadata, roadmaps, portfolios, and transcripts. |
| **Authentication**| Firebase Auth | Secure identity verification and cross-provider profile consolidation. |
| **AI Processing** | Google GenAI SDK (`@google/genai`) | Streamlined server-side access to Gemini 2.5/Omni models. |
| **Bundler/Build** | esbuild, Vite Build | Compiling server-side TypeScript into streamlined ES Modules for lightning cold-starts. |

---

## 📐 Project Architecture

NextStep AI utilizes a **Full-Stack SPA-API Unified Architecture**. To keep client bundles secure and eliminate API key leaks, all interaction with Google Gemini services occurs on the server side.

```
                  ┌─────────────────────────────────────┐
                  │          React SPA Client           │
                  │        (Vite 6 + Motion)            │
                  └──────────────────┬──────────────────┘
                                     │
                 Firebase Auth Token │ HTTP API Requests
                                     ▼
                  ┌─────────────────────────────────────┐
                  │       Unified Express Server        │
                  │             (Port 3000)             │
                  └──────┬───────────────────────┬──────┘
                         │                       │
      Firestore Database │                       │ Gemini API Key (Secret)
      & User Management  ▼                       ▼
                  ┌──────────────┐       ┌──────────────┐
                  │   Firebase   │       │ Google Gemini│
                  │  Cloud Suite │       │  LLM Service │
                  └──────────────┘       └──────────────┘
```

### Server Execution Logic
* **Development**: In local environments, the Express server mounts the Vite development server in middleware mode, allowing Hot Module Replacement (HMR) alongside active backend routes.
* **Production**: In remote environments, the client is pre-compiled into static HTML, CSS, and JS assets inside `/dist`. The Express server serves these static assets on all non-API paths (`app.get('*')`) and handles proxy endpoints.

---

## 📂 Folder Structure

```
├── .env.example                  # Template for production environment variables
├── railway.toml                  # Configuration file for Railway deployments
├── vercel.json                   # Configuration file for Vercel edge routes
├── package.json                  # Dependencies, builds, and development scripts
├── tsconfig.json                 # TypeScript compiler configuration
├── firestore.rules               # Firestore security access controls
├── firebase-applet-config.json   # Static Firebase credentials config
├── firebase-blueprint.json       # Blueprint mapping database collections
├── server.ts                     # Main Express server and API route handlers
├── server-db.ts                  # Firestore entity handlers (resumes, roadmaps, interviews)
├── vite.config.ts                # Vite build and plugin declarations
├── api/
│   └── index.ts                  # Vercel Serverless entry endpoint mapping
└── src/                          # React client application code
    ├── main.tsx                  # Client entry point
    ├── App.tsx                   # Central router and overall page layout
    ├── index.css                 # Global styles and Tailwind configurations
    ├── types.ts                  # Shared client TypeScript types
    ├── lib/
    │   └── firebase.ts           # Client-side Firebase SDK configuration
    └── components/               # UI components and view modules
        ├── LandingPage.tsx       # Landing page with marketing widgets
        ├── AuthPages.tsx         # Sign-in modals and SSO interactions
        ├── AuthContext.tsx       # Authentication state managers and linking rules
        ├── UserDashboard.tsx     # Base dashboard and actions console
        ├── SkillsTracker.tsx     # Competence matrix interface
        ├── RoadmapGenerator.tsx  # Dynamic interactive career roadmap trees
        ├── ResumeAnalyzer.tsx    # Paste-based ATS scoring and optimization console
        ├── PortfolioBuilder.tsx  # Layout selector and code output component
        ├── InterviewPrep.tsx     # Mock interview practice engine
        ├── NovaAI.tsx            # Floating Nova chat companion widget
        └── AnalyticsDashboard.tsx# Completed transcripts and resume analytics
```

---

## 🔐 Authentication & OAuth Provider Linking

One of the standout, robust engineering implementations in NextStep AI is its **Multi-Provider Account Consolidation**. 

```
                                  GitHub Sign-In Clicked
                                            │
                                            ▼
                              Authenticate with GitHub popup
                                            │
                                            ▼
                     ❌ Failed: 'auth/account-exists-with-different-credential'
                     (A Google user already exists with this same email)
                                            │
                                            ▼
                       Cache GitHub pending credential in state
                                            │
                                            ▼
                        Force User to Authenticate with Google
                                            │
                                            ▼
                    Link credentials: linkWithCredential(user, githubCred)
                                            │
                                            ▼
                    ✅ Success: Unified account containing both logins!
```

This prevents user friction and dashboard data duplication when signing up using different providers.

---

## 🔌 API Documentation (Backend Gateway)

The Express server exposes a comprehensive backend API layout. All operations are structured, typed, and authenticated.

### Authentication Endpoints
* **`POST /api/auth/google-sso`**
  * *Purpose*: Validates Google identity tokens and syncs user profiles to Firestore.
  * *Request Body*: `{ idToken: string, profile: object }`
* **`POST /api/auth/github-sso`**
  * *Purpose*: Validates GitHub credentials and logs user profile data in database.
  * *Request Body*: `{ idToken: string, profile: object }`
* **`GET /api/auth/me`**
  * *Purpose*: Validates session headers and retrieves current dashboard profiles.

### User Metrics & Dashboard
* **`GET /api/user/dashboard-summary`**
  * *Purpose*: Pulls high-level dashboard summaries, resume metrics, mock interview history, and active roadmaps.

### AI Engine Operations (Gemini Proxies)
* **`POST /api/ai/chat`**
  * *Purpose*: Relays conversation messages with system instructions to Nova.
  * *Request Body*: `{ messages: Array, profileContext: object }`
* **`POST /api/ai/analyze-resume`**
  * *Purpose*: Evaluates uploaded raw resume content against modern ATS engines.
  * *Request Body*: `{ content: string, jobGoal: string }`
* **`POST /api/ai/generate-roadmap`**
  * *Purpose*: Creates custom step-by-step career development maps.
  * *Request Body*: `{ goalTitle: string, currentLevel: string, durationWeeks: number }`
* **`POST /api/ai/get-interview-feedback`**
  * *Purpose*: Reviews a finished interview transcript, calculating overall score and providing structured reviews.
  * *Request Body*: `{ role: string, transcript: Array }`

---

## 🚀 Installation & Local Development

Follow these simple instructions to launch NextStep AI on your local workstation:

### 1. Prerequisites
Ensure you have the following installed:
* [Node.js](https://nodejs.org/) (v18.x or v20.x recommended)
* NPM (comes packaged with Node)

### 2. Clone and Setup
Extract the repository or pull it to your workstation, then open a terminal inside the root directory.

### 3. Install Dependencies
Run the package installation command:
```bash
npm install
```

### 4. Setup Environment Config
Copy the example environment template:
```bash
cp .env.example .env
```
Open `.env` in your editor and input your Google Gemini API Key:
```env
GEMINI_API_KEY=AIzaSyYourGeminiApiKeyHere
```

### 5. Setup Firebase Credentials
Confirm that the `firebase-applet-config.json` configuration file is present at the project root:
```json
{
  "apiKey": "...",
  "authDomain": "...",
  "projectId": "...",
  "storageBucket": "...",
  "messagingSenderId": "...",
  "appId": "...",
  "firestoreDatabaseId": "(default)"
}
```

### 6. Run the Application
Start the unified full-stack dev server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your web browser to access NextStep AI!

---

## 🚢 Production Deployment Guides

### A. Railway Deployment (Recommended)
Railway is highly recommended for full-stack Node.js applications as it natively supports continuous integration and Nixpacks builders.

1. Create a free account at [Railway.app](https://railway.app/).
2. Click **New Project** and select **Deploy from GitHub repository**.
3. Point to your repository branch.
4. Go to the **Variables** tab of your service and add:
   * `NODE_ENV=production`
   * `GEMINI_API_KEY=YOUR_GEMINI_API_KEY`
5. Railway will automatically detect the `railway.toml` file, run `npm run build`, bind to the correct `PORT`, and deploy your container!

### B. Vercel Serverless Deployment
NextStep AI is structured to support Vercel serverless deployments via `/vercel.json` routing:

1. Install the Vercel CLI locally or link your project directly at [Vercel.com](https://vercel.com).
2. Go to your project settings in the Vercel Dashboard, and register the following Environment Variable:
   * `GEMINI_API_KEY=YOUR_GEMINI_API_KEY`
3. Vercel will build the frontend assets, routing all dynamic server calls to `/api/index.ts` (mapped to serverless handlers automatically).

---

## 🔒 Firestore Security Rules
To protect user-generated files, configurations, and profiles, apply the following Firestore security rules contained in `/firestore.rules`:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Helper checks
    function isSignedIn() {
      return request.auth != null;
    }
    function isOwner(userId) {
      return request.auth.uid == userId;
    }

    // Rules for individual collections
    match /users/{userId} {
      allow read, write: if isSignedIn() && isOwner(userId);
    }
    match /resumes/{resumeId} {
      allow read, write: if isSignedIn() && resource.data.userId == request.auth.uid;
      allow create: if isSignedIn() && request.resource.data.userId == request.auth.uid;
    }
    match /roadmaps/{roadmapId} {
      allow read, write: if isSignedIn() && resource.data.userId == request.auth.uid;
      allow create: if isSignedIn() && request.resource.data.userId == request.auth.uid;
    }
    match /interviews/{interviewId} {
      allow read, write: if isSignedIn() && resource.data.userId == request.auth.uid;
      allow create: if isSignedIn() && request.resource.data.userId == request.auth.uid;
    }
    match /portfolios/{portfolioId} {
      allow read, write: if isSignedIn() && resource.data.userId == request.auth.uid;
      allow create: if isSignedIn() && request.resource.data.userId == request.auth.uid;
    }
  }
}
```

---

## 🛠️ Interactive Troubleshooting

### 1. Gemini Key Error: "GoogleGenAI is not initialized"
* **Symptom**: Features fail to generate content, showing API error popups in the browser.
* **Fix**: Ensure `GEMINI_API_KEY` is registered exactly as shown in your environment variable panel. Ensure the server has restarted after environment edits.

### 2. Vite Build Issue: "Vite is not found"
* **Symptom**: Building on Railway fails with exit code 127.
* **Fix**: Ensure that DevDependencies are installed on your build server (`NODE_ENV` is handled correctly during build commands, or `npm install --include=dev` is executed).

### 3. Firebase Authentication: "Unauthorized Domain"
* **Symptom**: Popup authorization methods fail with domain restrictions.
* **Fix**: In the Firebase console under Auth -> Settings, add your production domain (e.g., `*.railway.app` or `yourdomain.vercel.app`) to the "Authorized domains" list.

---

## 🗺️ Future Roadmap
- [ ] **Resume to Portfolio Sync**: Auto-extract projects from resumes to populate the portfolio builder.
- [ ] **Live Interview Voice Mode**: Conduct speech-to-text powered mock interviews.
- [ ] **Achievements & Leaderboards**: Gamify technical study progress by offering rewards for completed milestones.

---

## 📜 Contributing & License

Contributions are always welcome to help improve NextStep AI! Feel free to fork this project, file issues, and submit pull requests.

This project is open-source, released under the **MIT License**.

---

## 🤝 Support
If you have questions, run into setup difficulties, or want to showcase what you built with NextStep AI, reach out at `sundaravannan366@gmail.com`. Enjoy building your career!
