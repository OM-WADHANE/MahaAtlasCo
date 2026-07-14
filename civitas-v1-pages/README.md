# MahaAtlas — Maharashtra Property Intelligence Platform
### Version 1.0 · Civitas Atlas Technologies Pvt. Ltd.

> AI-powered platform for Maharashtra land records, legal documentation, FSI mapping, property security analysis and broker tools.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Tech Stack](#tech-stack)
4. [Project Structure](#project-structure)
5. [Pages & Features](#pages--features)
6. [AI Tools Suite](#ai-tools-suite)
7. [Authentication & Access](#authentication--access)
8. [Credentials](#credentials)
9. [API Keys](#api-keys)
10. [Scraper Architecture](#scraper-architecture)
11. [Deployment](#deployment)
12. [Future Roadmap](#future-roadmap)

---

## Project Overview

**MahaAtlas** is a production-ready MVP web platform built by **Civitas Atlas Technologies Pvt. Ltd.**, Pune, Maharashtra. It provides AI-powered access to Maharashtra property intelligence across six modules:

| Module | Description |
|--------|-------------|
| FSI Atlas | Floor Space Index data for all Maharashtra cities |
| Land Records | 7/12, 8A, Property Card, EC, Index II search |
| Legal Atlas | Legal document generator + reviewer (LaIRa AI) |
| Security Analysis | Title verification, risk scoring (DiVA AI) |
| Broker Tools | Commission calculator, stamp duty, RERA compliance |
| CiVi AI | General Maharashtra property intelligence assistant |

**Mission:** Simplify access to Maharashtra land intelligence through AI-powered search, legal assistance, mapping, and property information.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     USER BROWSER                            │
│  admin.html (Login) → index.html → All Sub-pages            │
│  Auth Guard: civitas-v1-auth.js (session-based)             │
└──────────────────────┬──────────────────────────────────────┘
                       │ Fetch API
              ┌────────▼────────┐
              │   Groq Cloud    │
              │  LLM API        │
              │  llama-3.3-70b  │
              └────────┬────────┘
                       │ JSON Response
              ┌────────▼────────┐
              │  AI Modules     │
              │  CiVi AI        │
              │  DiVA           │
              │  LaIRa          │
              └─────────────────┘

FUTURE (Scraper Pipeline):
Frontend → Backend API → Queue (1 req/20s) → Playwright Worker
         → Parser → PostgreSQL → Cache → Frontend Response
```

**Auth Flow:**
```
Any page visited
    ↓
civitas-v1-auth.js checks sessionStorage
    ↓
Token missing → redirect to admin.html (login)
Token valid   → show page + logout button in header
    ↓
Login (admin) → show Admin Dashboard
Login (user)  → redirect to index.html
```

---

## Tech Stack

### Frontend
| Technology | Usage |
|------------|-------|
| HTML5 | All page structure — pure vanilla, no framework |
| CSS3 | Custom design system (`civitas-v1.css`) — dark/light theme |
| Vanilla JavaScript (ES6+) | All interactivity, AI calls, auth, calculators |
| SVG Animations | AI assistant icons (CiVi AI, DiVA, LaIRa, Broker AI) |
| Google Fonts (Outfit) | Primary typeface — loaded via CSS import |

### AI / LLM
| Technology | Usage |
|------------|-------|
| Groq API | LLM inference endpoint |
| LLaMA 3.3 70B Versatile | Underlying language model |
| CiVi AI | General property intelligence assistant |
| DiVA | Document Intelligence & Verification Assistant |
| LaIRa | Legal AI Research Assistant (document generation/review) |

### Storage & Auth
| Technology | Usage |
|------------|-------|
| sessionStorage | Client-side auth token storage |
| LocalStorage | Theme preference (dark/light) |

### Planned Backend (Scraper Pipeline)
| Technology | Usage |
|------------|-------|
| Node.js + TypeScript | Scraper worker service |
| Playwright | Browser automation for Mahabhulekh |
| PostgreSQL | Land record caching database |
| Express.js | REST API for queue management |
| BullMQ / Redis | Job queue (1 request per 20 seconds) |

### Deployment
| Technology | Usage |
|------------|-------|
| Netlify | Static hosting (netlify.toml configured) |
| Vercel | Company website (civitasatlas.vercel.app) |

---

## Project Structure

```
civitas-v1-pages/
├── admin.html              ← Login page (entry point for all users)
├── index.html              ← Overview / Dashboard
├── fsi.html                ← FSI Atlas
├── landrecords.html        ← Land Records Search
├── legal.html              ← Legal Atlas (LaIRa AI)
├── security.html           ← Security Analysis (DiVA AI)
├── broker.html             ← Broker Tools (CiVi AI Broker)
├── ai.html                 ← Main CiVi AI Assistant
├── about.html              ← About Civitas Atlas / MahaAtlas
│
├── assets/
│   ├── civitas-v1.css           ← Master design system (dark + light)
│   ├── civitas-v1-core.js       ← Theme, language, drawer, shared utils
│   ├── civitas-v1-overview.js   ← Overview page charts and stats
│   ├── civitas-v1-fsi.js        ← FSI calculator and city data
│   ├── civitas-v1-land.js       ← Land Records search, AI, file upload
│   ├── civitas-v1-legal.js      ← LaIRa AI reviewer
│   ├── civitas-v1-legal-gen.js  ← LaIRa document generator + custom doc
│   ├── civitas-v1-security.js   ← DiVA AI document verification
│   ├── civitas-v1-broker.js     ← Broker AI, commission, stamp duty calc
│   ├── civitas-v1-auth.js       ← Authentication guard (all pages)
│   └── civitas-v1-admin.js      ← Admin panel auth + dashboard logic
│
├── MahaAtlas_ mapping Maharashtra with precision-modified.png ← Logo
└── netlify.toml            ← Netlify deployment config
```

**Other directories (parent):**
```
components/
├── header.js     ← Shared header component (module-based pages)
├── footer.js     ← Footer component
├── drawer.js     ← Navigation drawer
└── clients.js    ← Client logos component

data/
├── app.json      ← App config, nav links, titles
├── clients.json  ← Client/partner data
├── language.json ← i18n strings (EN / MR)
└── theme.json    ← Theme configuration

utils/
├── theme.js      ← Theme switcher utility
├── language.js   ← Language switcher utility
├── broker.js     ← Broker calculation utilities
├── charts.js     ← Chart.js wrapper utilities
└── risk.js       ← Risk scoring utility

styles/
├── main.css      ← Base styles
├── dark.css      ← Dark theme overrides
└── light.css     ← Light theme overrides
```

---

## Pages & Features

### `admin.html` — Login / Entry Point
- All pages redirect here if not authenticated
- Username + password authentication
- Admin login → Admin Dashboard
- User login → index.html (Overview)
- Session stored in `sessionStorage`

### `index.html` — Overview Dashboard
- Property market stats and charts
- Quick navigation cards to all modules
- Government partners & tools section
- AI Intelligence Suite showcase (CiVi AI, DiVA, LaIRa)

### `fsi.html` — FSI Atlas
- FSI Calculator (city + land type + plot area)
- Mumbai, Pune, Nagpur, Nashik, Thane, Aurangabad data
- DCPR 2034, PMC DP 2041, NMC DCR data
- Rural Maharashtra FSI reference
- TOD, SRA, IT zone specific rates

### `landrecords.html` — Land Records
- Smart Maharashtra Search (District → Taluka → Village → Survey)
- Search with CiVi AI (natural language)
- Document upload (7/12, survey maps, property cards)
- AI auto-fills search form from uploaded documents
- Mobile number field for record alerts
- Record type: 7/12, 8A, Property Card, Mutation, EC, Index II

### `legal.html` — Legal Atlas
- **LaIRa AI Document Reviewer** — upload agreements for compliance check
- **Legal Document Generator** — 8 standard document types
- **Custom Document Generator** — AI generates any custom legal document
- Standard docs: Sale Deed, Gift Deed, NA Permission, Lease, POA, Will, Mortgage, Relinquishment
- Print-ready output with stamp paper block, signature block, witness section, passport photo placeholder
- Maharashtra Stamp Act 1958 compliance
- Key Maharashtra Laws reference (MahaRERA, MOFA, MRTP, MLR Code, MRC Act, MSA)

### `security.html` — Security Analysis
- **DiVA AI** — Document Intelligence & Verification Assistant
- Upload title deeds, EC, 7/12, NOCs for AI analysis
- Title Verification Checklist with dynamic risk scoring
- Documents required checklist for due diligence

### `broker.html` — Broker Tools
- **Commission Calculator** — with GST breakdown and printable report
- **CiVi AI Broker Assistant** — upload bills/invoices for AI analysis
- **Stamp Duty & Registration Calculator** — Maharashtra Stamp Act 1958
- Standard Rate Card — all property segments
- RERA Broker Compliance reference

### `ai.html` — CiVi AI Main Assistant
- Full-screen chat interface
- Document upload (PDF, images, property papers)
- Drag & drop file support
- Maharashtra property intelligence context
- Clear chat / session management

### `about.html` — About
- MahaAtlas platform overview
- Platform Capabilities grid
- Parent Company: Civitas Atlas Technologies Pvt. Ltd.
- Government Partners & Tools (MahaRERA, Mahabhulekh, IGR, MCGM, MIDC, MMRDA, PMC/PCMC)
- **AI Intelligence Suite** — CiVi AI, DiVA, LaIRa showcase cards
- Future Products & Roadmap

### `admin.html` (Dashboard section)
- Stats: Total Searches, Documents Generated, Users, AI Interactions
- Tabs: Dashboard, Scraper Queue, System Logs, Users, Documents, Analytics, Village Stats, Error Monitor, Cache & DB

---

## AI Tools Suite

### ✦ CiVi AI — Civitas Intelligence
**Location:** `ai.html` (main), all pages (floating button)
**Scope:** General Maharashtra property intelligence
**System Prompt Identity:** "I am CiVi AI by MahaAtlas, your AI assistant for Maharashtra land intelligence, legal documentation, planning guidance, and property information."
**File:** `civitas-v1-core.js` (shared context), per-page JS files

---

### 🔒 DiVA — Document Intelligence & Verification Assistant
**Location:** `security.html`
**Scope:** Title deed analysis, EC verification, 7/12 validation, risk assessment
**System Prompt Identity:** "I am DiVA — Document Intelligence and Verification Assistant by MahaAtlas. I specialise in property document analysis, title verification, and due diligence."
**Animated Icon:** SVG with orbiting dot, spinning ring, shield, eye scan line
**File:** `civitas-v1-security.js`

---

### ⚖️ LaIRa — Legal AI Research Assistant
**Location:** `legal.html`
**Scope:** Legal document generation, review, research — Maharashtra property law
**System Prompt Identity:** "I am LaIRa — Legal AI Research Assistant by MahaAtlas. I specialise in generating, reviewing and researching Maharashtra property law documents."
**Animated Icons:** Doc Reviewer (magnifying lens), Doc Generator (scroll + pen), Custom Doc (rotating star)
**Files:** `civitas-v1-legal.js` (reviewer), `civitas-v1-legal-gen.js` (generator)

---

### 💰 CiVi AI Broker Assistant
**Location:** `broker.html`
**Scope:** Commission calculation, bill/invoice analysis, stamp duty, RERA compliance
**Animated Icon:** SVG with spinning ring, bouncing ₹ coin, rotating star, % badge
**File:** `civitas-v1-broker.js`

---

### All AI Panels Include:
- Document upload (PDF, JPG, PNG, DOC, DOCX) — max 10MB per file
- Drag & drop file support
- File preview cards with remove functionality
- CSS SVG paperclip attach button (no emoji dependency)
- Groq API integration: `llama-3.3-70b-versatile`

---

## Authentication & Access

### How It Works

1. Every page includes `civitas-v1-auth.js` as the **first script**
2. On load, it checks `sessionStorage` for `mahaatlas_auth_token`
3. If not found → redirects to `admin.html`
4. After login → token set, role stored, user redirected

### Access Levels

| Role | Access |
|------|--------|
| `admin` | Admin Dashboard (scraper queue, logs, users, analytics) |
| `user` | Full platform access (all pages) |

### Session Keys (sessionStorage)
```
mahaatlas_auth_token  = "authenticated"
mahaatlas_auth_user   = "<username>"
mahaatlas_auth_role   = "admin" | "user"
```

> ⚠️ **Production Note:** Current authentication is client-side MVP only. Before public launch, move to a secure backend with hashed passwords, JWT tokens, and rate limiting.

---

## Credentials

### Admin Account
| Field | Value |
|-------|-------|
| Username | `admin` |
| Password | `MahaAtlas@Admin` |
| Access | Full admin dashboard |

### User Accounts
| Username | Password | Role |
|----------|----------|------|
| `civitas` | `Civitas@Atlas1` | User → index.html |
| `mahauser` | `MahaAtlas@User2` | User → index.html |
| `atlasuser` | `Atlas@Maha2024` | User → index.html |

> 🔒 These credentials are hardcoded in `civitas-v1-admin.js` for MVP only. Replace with backend API + bcrypt hashed passwords before production deployment.

---

## API Keys

### Groq API (LLM Inference)
**Key location:** Split across JS files (security by obscurity — MVP only)

```javascript
// Pattern used in all AI JS files:
var _k = ["gsk_Tc8WqOV7jelGZor5Ip3NWGdy","b3FYxPpbuCcMmlIOuk0Vu8cisUmB"].join("");
```

**Files containing the key:**
- `civitas-v1-legal-gen.js`
- `civitas-v1-security.js`
- `civitas-v1-broker.js`
- `civitas-v1-land.js`
- `civitas-v1-legal.js`
- `ai.html` (inline script)

**Model used:** `llama-3.3-70b-versatile`
**Endpoint:** `https://api.groq.com/openai/v1/chat/completions`

> ⚠️ **Security Warning:** API keys in frontend code are visible to users. For production, proxy all AI requests through a backend server. Store keys in environment variables only.

### For Production — What You Need:
| Service | Purpose | Required |
|---------|---------|---------|
| Groq API key | LLM inference for all AI features | ✅ Already integrated |
| Google OAuth Client ID | Google Sign-In (future) | 🔜 Planned |
| Firebase / Supabase | Backend auth + database | 🔜 Planned |
| PostgreSQL connection | Land record caching | 🔜 Planned |

---

## Scraper Architecture (Planned)

Design for future Mahabhulekh land record scraping:

```
Frontend Search Request
         ↓
   Backend REST API
  (Express.js + Node)
         ↓
   Redis/BullMQ Queue
   (1 request / 20 sec)
         ↓
  Playwright Worker
  (browser automation)
         ↓
   Check PostgreSQL Cache
   ├── HIT  → return cached record immediately
   └── MISS → scrape Mahabhulekh
                    ↓
              HTML Parser
              (normalize data)
                    ↓
             Store in PostgreSQL
                    ↓
             Return to Frontend

Progress states shown to user:
Searching... → Connecting... → Retrieving... → Processing... → Completed
```

**CAPTCHA Policy:**
- No illegal CAPTCHA bypass
- `CaptchaProvider` interface designed for future plug-in
- If CAPTCHA encountered: pause job, notify user
- Supported providers can be added when legitimate access is arranged

---

## Deployment

### Netlify (Current)
```toml
# netlify.toml
[build]
  publish = "civitas-v1-pages"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

**Deploy steps:**
1. Push to Git repository
2. Netlify auto-deploys from `civitas-v1-pages/` folder
3. All pages served as static HTML

### Local Development
```
# Simply open in browser — no build step needed
# Recommended: use VS Code Live Server extension

# Or use Python simple server:
cd civitas-v1-pages
python -m http.server 8080
# Open: http://localhost:8080/admin.html
```

---

## Future Roadmap

| Feature | Status |
|---------|--------|
| CiVi AI v2 (Marathi + Hindi voice) | In Development |
| Real Google OAuth integration | Planned |
| Backend auth (Node.js + JWT) | Planned |
| Playwright scraper for Mahabhulekh | Planned |
| PostgreSQL land record cache | Planned |
| Fraud Detection Engine (ML) | Coming Soon |
| GIS FSI Overlay — Live Map | Coming Soon |
| Valuation Intelligence Engine | Planned |
| MahaAtlas Mobile App (iOS/Android) | Planned |
| Broker & Developer REST API | Planned |
| Admin panel backend (real data) | Planned |
| Multi-language support (MR/HI) | Planned |

---

## Company

**Civitas Atlas Technologies Pvt. Ltd.**
- Location: Pune, Maharashtra, India
- Website: [civitasatlas.vercel.app](https://civitasatlas.vercel.app)
- Product: MahaAtlas v1.0
- Compliance: MahaRERA Compliant

---

## Quick Reference

```
Entry Point:     admin.html         (login required)
Overview:        index.html
Land Records:    landrecords.html
Legal Atlas:     legal.html         (LaIRa AI)
Security:        security.html      (DiVA AI)
Broker:          broker.html
CiVi AI:         ai.html
About:           about.html
Admin Panel:     admin.html         (admin role only)

Admin Login:     username: admin    / password: MahaAtlas@Admin
User 1:          username: civitas  / password: Civitas@Atlas1
User 2:          username: mahauser / password: MahaAtlas@User2
User 3:          username: atlasuser/ password: Atlas@Maha2024
```

---

*MahaAtlas v1.0 · Civitas Atlas Technologies Pvt. Ltd. · Pune, Maharashtra*
*Built with Vanilla JS, Groq AI (LLaMA 3.3 70B), and a lot of chai ☕*
