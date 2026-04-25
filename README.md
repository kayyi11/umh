<div align="center">
  <img src="frontend/public/logo.png" alt=Z-Intelligence Logo" width="400"/>
  <p></p>
</div>

<div align="center">

AI-powered Business Intelligence Platform

*Transforming raw business data into strategic decisions, real-time insights, and automated action plans.*

[![Watch the Pitch](https://img.shields.io/badge/Watch-Pitch_Video-red?style=for-the-badge&logo=youtube)](https://www.youtube.com/watch?v=YOUR_VIDEO_ID)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![Flask](https://img.shields.io/badge/Flask-3.0-000000?logo=flask&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-Firestore-FFCA28?logo=firebase&logoColor=black)
![Gemini](https://img.shields.io/badge/Gemini_API-Google_AI-4285F4?logo=google&logoColor=white)

> **UMHackathon 2026 Submission**

</div>

---

## 📖 Project Description

### Summary

Z-intelligence is a full-stack decision intelligence platform built for small and medium businesses. It closes the gap between data and action — ingesting raw business data, surfacing AI-generated insights, and enabling one-click execution of strategic decisions through a multi-agent AI backbone.

Rather than simply showing dashboards, Z-intelligence actively **advises, drafts, and acts**: generating supplier emails, price adjustment plans, inventory alerts, and business reports — all from a conversational interface.

### Problem Statement

Small and medium businesses face a critical gap between the **data they collect** and the **decisions they need to make**.

- **The Pain Point**: Most SMBs lack dedicated analysts or BI tools. Business owners are drowning in raw data — sales figures, inventory counts, supplier invoices — with no clear path from numbers to action.
- **The Impact**: Poor decisions made on gut instinct rather than data lead to overstocking, missed revenue opportunities, and slow responses to market shifts. Meanwhile, enterprise-grade BI tools are priced out of reach.

Z-intelligence democratises decision intelligence by combining multi-agent AI, real-time Firestore data, and a conversational interface purpose-built for SMB operators.

### SDGs Addressed

- **SDG 8: Decent Work and Economic Growth**
  - Empowers SMB owners with AI-driven strategic tools previously only accessible to large enterprises, strengthening local economic resilience.
- **SDG 9: Industry, Innovation and Infrastructure**
  - Accelerates the adoption of AI and data infrastructure in small businesses, bridging the digital divide between SMBs and large corporations.

---

## ✨ Features

### 📊 Revenue Dashboard
Live revenue metrics, trend charts, and price optimisation impact tracking — giving owners an instant pulse on business performance.

### 🤖 AI Insights
Automated weekly insights generated from Firestore business data using Google Gemini. No manual reporting needed — the platform surfaces what matters.

### 🧠 Strategic Advisor
A multi-agent AI crew (CrewAI) that analyses full business context and produces ranked strategic recommendations with supporting rationale.

### ✅ Decision Tracker
End-to-end pipeline that converts AI recommendations into trackable action cards with live status — so nothing falls through the cracks.

### ✉️ Smart Draft
AI-generated business communications — supplier emails, price proposals, team updates — drafted and ready to send in one click.

### 📄 Report Generator
On-demand business reports (full summary, revenue, inventory) rendered in-browser. Export-ready for stakeholders or internal reviews.

### 🗂️ Data Workspace
Upload, parse, and edit business data in an interactive table with inline AI extraction. Supports messy real-world data formats.

### ⚡ Quick Actions
Pre-built action shortcuts for the most common business operations — reorder stock, flag a supplier issue, kick off a price review.

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────┐
│              React Frontend                 │
│  Dashboard · Insights · Advisor · Reports   │
└────────────────────┬────────────────────────┘
                     │ REST /api/*
┌────────────────────▼────────────────────────┐
│             Flask Backend (port 5000)        │
│                                             │
│  ┌──────────────┐   ┌─────────────────────┐ │
│  │  AI Services │   │   Firestore Client  │ │
│  │  · Gemini    │   │   · Queries         │ │
│  │  · Ilmu GLM  │   │   · Aggregations    │ │
│  │  · CrewAI    │   └─────────────────────┘ │
│  └──────────────┘                           │
└────────────────────┬────────────────────────┘
                     │
┌────────────────────▼────────────────────────┐
│           Firebase Firestore                │
│        Business data · Decisions            │
└─────────────────────────────────────────────┘
```

### Layer Breakdown

| Layer | Technology | Responsibility |
|---|---|---|
| **View** | React 19 + Tailwind CSS | Full pages and UI components rendered to the user |
| **API** | Flask 3.0 + Flask-CORS | REST endpoints, request routing, response formatting |
| **AI Services** | Gemini · Ilmu GLM · CrewAI | Insight generation, strategic advice, multi-agent orchestration |
| **Data** | Firebase Admin SDK + Firestore | Business data persistence, real-time queries, aggregations |

---

## 🛠️ Tech Stack

### Frontend

| Technology | Version | Role |
|---|---|---|
| React | 19 | UI framework |
| Vite | 8 | Build tool & dev server |
| Tailwind CSS | 4 | Styling |
| Recharts | 3 | Data visualisation |
| Firebase SDK | 12 | Firestore client |
| React Router | 7 | Client-side routing |

### Backend

| Technology | Version | Role |
|---|---|---|
| Python Flask | 3.0 | REST API server |
| CrewAI | 1.14 | Multi-agent orchestration |
| Google Gemini | `google-genai` | Insight & report generation |
| Ilmu GLM (`ilmu-glm-5.1`) | via LiteLLM | Strategic advisor LLM |
| Firebase Admin SDK | 6.5 | Firestore server-side access |
| Flask-CORS | 5.0 | Cross-origin request handling |

### Infrastructure

| Service | Role |
|---|---|
| Firebase Firestore | Primary database (region: `asia-southeast1`) |
| Firebase project: `zintelligence` | Hosting & backend config |

---

## 🔑 Key AI Capabilities

- **Automated Insight Generation** — Gemini analyses Firestore business data weekly to surface revenue trends, anomalies, and opportunities without manual prompting.
- **Multi-Agent Strategic Advice** — A CrewAI crew of specialised agents (analyst, strategist, communicator) collaborates to produce contextualised recommendations with supporting evidence.
- **Smart Draft Communications** — AI generates ready-to-send supplier emails and internal updates based on live business context, drastically reducing administrative overhead.
- **Ilmu GLM Integration** — Malaysian-context language model (ilmu-glm-5.1) ensures recommendations are culturally and commercially relevant for local SMBs.
- **On-Demand Report Generation** — Full business summaries and category-specific reports generated and rendered in-browser on demand.

---

## 🚀 Getting Started

### Prerequisites

- Node.js ≥ 18
- Python ≥ 3.10
- A Firebase project with Firestore enabled
- API keys for **Google Gemini** and **Ilmu GLM** (see [API Keys](#-api-keys))

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/z-intelligence.git
cd z-intelligence
```

### 2. Firebase Setup

Place your Firebase service account JSON at:

```
backend/serviceAccountKey.json
```

Then deploy Firestore rules:

```bash
firebase deploy --only firestore
```

### 3. Configure Environment Variables

**Root `.env`** (used by seed scripts):

```env
GEMINI_API_KEY=your_gemini_api_key
ZAI_API_KEY=your_ilmu_glm_api_key
ZAI_API_BASE=https://your_ilmu_api_base_url
ZAI_MODEL_NAME=ilmu-glm-5.1
```

**`backend/.env`**:

```env
ZAI_API_KEY=your_ilmu_glm_api_key
ZAI_API_BASE=https://your_ilmu_api_base_url
ZAI_MODEL_NAME=ilmu-glm-5.1
```

**`frontend/.env`**:

```env
VITE_DEMO_MODE=true
```

> ⚠️ Never commit `.env` or any file containing real API keys.

### 4. Seed the Database (optional)

Populate Firestore with sample business data:

```bash
npm install
node seed.js
```

### 5. Run the Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

Backend runs at `http://localhost:5000`.

### 6. Run the Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`.

---

## 📁 Project Structure

```
z-intelligence/
├── frontend/
│   └── src/
│       ├── pages/          # Dashboard, Insights, Reports, QuickActions, …
│       ├── components/     # RevenueDashboard, StrategicAdvisor, DecisionCard, …
│       ├── services/       # api.js — all backend API calls
│       ├── layouts/        # MainLayout
│       └── firebase.js     # Firestore initialisation
├── backend/
│   ├── app.py              # Flask entry point
│   ├── routes/             # chat, insight, decision, report, smart_draft
│   ├── services/
│   │   ├── agents/         # CrewAI crew & tools
│   │   ├── glm_service.py  # Ilmu GLM wrapper
│   │   ├── insight_service.py
│   │   ├── data_service.py
│   │   └── firestore_client.py
│   ├── models/             # Business data models
│   └── utils/              # Prompt templates
├── firestore.rules
├── firestore.indexes.json
├── firebase.json
└── seed.js
```

---

## 🔐 API Keys

The two external LLM services used by Z-intelligence are **not publicly available**:

- **Google Gemini** — requires a Google AI Studio or Google Cloud account with Gemini API access enabled.
- **Ilmu GLM (`ilmu.ai`)** — a Malaysian-context language model. Access is granted directly by the ilmu.ai team.

To run all AI features locally, valid credentials for both services are required.

---

## ⚔️ Challenges Faced

- **Multi-agent Coordination**: Orchestrating CrewAI agents with different specialisations (analysis, strategy, communication) while maintaining coherent, non-contradictory outputs required careful prompt design and output chaining.

- **LLM Context Alignment**: Ilmu GLM's Malaysian business context required custom prompt templates to ensure recommendations were relevant to local SMB operating conditions (e.g. local supplier dynamics, ringgit-denominated pricing).

- **Real-time Data Freshness**: Balancing Firestore read costs against the need for up-to-date insight generation led us to implement a hybrid approach — live data for dashboards, scheduled batch jobs for weekly AI insights.

- **SMB Data Quality**: Raw data uploaded by SMB users is often inconsistent or incomplete. The Data Workspace's inline AI extraction was built specifically to handle and normalise messy real-world input formats.

---

## 🛣️ Future Roadmap

**Short-term (0–6 months): Live Integrations & Data Accuracy**
- Connect the Revenue Dashboard to live POS and e-commerce data streams via webhook ingestion into Firestore.
- Introduce confidence scoring on AI insights so users can gauge reliability before acting.

**Medium-term (6–12 months): Collaborative Decision-Making**
- Add team roles and permission levels, allowing multiple stakeholders (owner, manager, finance) to collaborate on decision tracking.
- Implement push notifications via Firebase Cloud Messaging to alert team members when high-priority AI recommendations are generated.

**Long-term (12+ months): Industry Vertical Expansion**
- Extend Ilmu GLM prompt templates for vertical-specific SMB contexts: F&B, retail, logistics, and professional services.
- Build a supplier integration layer enabling Z-intelligence to autonomously draft and track purchase orders upon decision approval.

---

## 👥 Team

Built with ❤️ for **UMHackathon 2026** by:

| Name | Role |
|---|---|
| Sam Hui Ying      | Project Lead & Documentation Lead |
| Tang Yvone        | AI & Prompt Engineer             |
| Khong Yirou       | Backend Lead & Data Architect |
| Oi Kay Yi         | Frontend & UX Developer |
| Chong Yu En       | UI & UX Designer |

---

*Z-intelligence — built for UMHackathon 2026. All rights reserved by the team.*
