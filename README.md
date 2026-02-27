<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16.1.6-black?logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/FastAPI-0.133-009688?logo=fastapi&logoColor=white" alt="FastAPI" />
  <img src="https://img.shields.io/badge/React-19.2.3-61DAFB?logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/TailwindCSS-4-38B2AC?logo=tailwindcss&logoColor=white" alt="Tailwind" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Python-3.13-3776AB?logo=python&logoColor=white" alt="Python" />
  <img src="https://img.shields.io/badge/PostgreSQL-15-4169E1?logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/License-MIT-yellow" alt="MIT License" />
</p>

<h1 align="center">🏛️ Arthashastra</h1>
<h3 align="center"><em>The Ancient Science of Strategic Wealth — Reimagined with Artificial Intelligence</em></h3>

<p align="center">
  An institutional-grade, Web3-enabled financial intelligence platform that fuses Kautilya's <strong>Arthashastra</strong> philosophy with modern AI-powered market analysis, real-time sentiment scoring, and gamified learning.
</p>

---

## 📑 Table of Contents

- [Architecture Overview](#-architecture-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#1-backend-setup)
  - [Frontend Setup](#2-frontend-setup)
- [Environment Variables](#-environment-variables)
- [API Reference (Postman Documentation)](#-api-reference--postman-documentation)
  - [Health Check](#1-health-check)
  - [Market Data](#2-market-data)
  - [Chanakya AI Predictions](#3-chanakya-ai-predictions)
  - [Market Intel — News Sentiment](#4-market-intel--news-sentiment)
  - [User & Wallet](#5-user--wallet)
  - [Academy](#6-academy)
- [Frontend Pages](#-frontend-pages)
- [Web3 Integration](#-web3-integration)
- [License](#-license)

---

## 🏗 Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                          FRONTEND                                   │
│                     Next.js 16 (App Router)                         │
│                                                                     │
│  /               Landing — parallax hero, live ticker, stats        │
│  /war-room       Prediction Arena — TradingView, Chanakya AI        │
│  /market-intel   News Sentiment — FinBERT analysis dashboard        │
│  /academy        Gamified L2E Quest Board — modules, XP, NFT mint   │
│  /treasury       Portfolio Vault — MetaMask wallet, deposits        │
│                                                                     │
│  MetaMask ←→ ethers.js v6                                           │
└──────────────┬──────────────────────────────────────────────────────┘
               │  NEXT_PUBLIC_API_URL
               ▼
┌─────────────────────────────────────────────────────────────────────┐
│                          BACKEND                                    │
│                    FastAPI (Python 3.13)                             │
│                    Prefix: /api/v1                                   │
│                                                                     │
│  /market/quote/{ticker}         → yfinance (live stock data)        │
│  /predict/analyze               → yfinance + Google Gemini AI       │
│  /news/sentiment                → Google Gemini (concurrent)        │
│  /user/{wallet}                 → PostgreSQL (CRUD)                 │
│  /academy/courses               → Static course catalogue           │
│  /academy/complete/{id}         → PostgreSQL (credit rewards)       │
│                                                                     │
└──────────────┬──────────────────────────────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────────────────────────────┐
│  PostgreSQL         │  yfinance API       │  Google Gemini API      │
│  (User balances,    │  (Real-time market  │  (gemini-flash-latest,  │
│   course progress)  │   data, quotes)     │   gemini-2.0-flash)     │
└─────────────────────┴─────────────────────┴─────────────────────────┘
```

---

## ✨ Features

| Module | Description |
|--------|-------------|
| **War Room** | AI-powered directional predictions (bullish/bearish) with explainable confidence scores from the Chanakya AI reasoner. Integrated TradingView charting. |
| **Market Intel** | Real-time financial news aggregation with FinBERT-style sentiment analysis (Bullish/Bearish/Neutral), breaking alert system, per-headline Chanakya reasoning. |
| **Academy** | Gamified Learn-to-Earn quest board. Sequential module progression, XP accumulation, level-up system, simulated on-chain NFT certificate minting. |
| **Treasury** | Web3-native portfolio dashboard. MetaMask wallet connection, live balance tracking, fund deposits, and transaction ledger. |
| **Landing Page** | Cinematic parallax hero with mouse-tracking, scroll-linked transforms, live ticker tape, spring-physics animations, glassmorphism design system. |

---

## 🛠 Tech Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| Next.js | 16.1.6 | React meta-framework (App Router, Turbopack) |
| React | 19.2.3 | UI library |
| TypeScript | 5.x | Type safety |
| Tailwind CSS | 4.2.1 | Utility-first styling |
| Framer Motion | 12.34.3 | Scroll parallax, spring physics, page transitions |
| ethers.js | 6.16.0 | MetaMask wallet integration |
| Lucide React | 0.575.0 | Icon system |

### Backend
| Technology | Version | Purpose |
|---|---|---|
| Python | 3.13 | Runtime |
| FastAPI | 0.133.1 | Async REST API framework |
| Uvicorn | — | ASGI server |
| SQLAlchemy | — | ORM for PostgreSQL |
| yfinance | — | Real-time stock/crypto market data |
| google-genai | — | Google Gemini AI integration |
| psycopg2-binary | — | PostgreSQL driver |
| python-dotenv | — | Environment variable management |

### Infrastructure
| Technology | Purpose |
|---|---|
| PostgreSQL | Persistent storage (users, balances, progress) |
| Google Gemini API | AI reasoning / sentiment analysis |
| MetaMask | Web3 wallet authentication |

---

## 📁 Project Structure

```
Arthashastra/
├── LICENSE                          # MIT License
├── README.md                        # This file
│
├── backend/
│   ├── main.py                      # FastAPI app entry — CORS, routers, startup
│   ├── database.py                  # SQLAlchemy engine & session factory
│   ├── models.py                    # User model (wallet_address, portfolio_balance)
│   ├── requirements.txt             # Python dependencies
│   ├── test_gemini.py               # Gemini model discovery test script
│   └── routers/
│       ├── __init__.py
│       ├── academy.py               # GET courses, POST complete (credit rewards)
│       ├── market.py                # GET /quote/{ticker} via yfinance
│       ├── news.py                  # GET /sentiment — Gemini-powered analysis
│       ├── predict.py               # POST /analyze — Chanakya AI predictions
│       └── user.py                  # GET/POST user & wallet management
│
├── frontend/
│   ├── package.json                 # Dependencies & scripts
│   ├── next.config.ts               # Security headers, Turbopack config
│   ├── tsconfig.json                # TypeScript configuration
│   ├── tailwind.config.ts           # Tailwind CSS configuration
│   ├── postcss.config.mjs           # PostCSS configuration
│   │
│   ├── app/
│   │   ├── layout.tsx               # Root layout — font, metadata, AppShell
│   │   ├── page.tsx                 # Landing page (parallax hero, ticker, stats)
│   │   ├── globals.css              # Design system — glassmorphism, animations
│   │   ├── academy/page.tsx         # Gamified quest board (L2E)
│   │   ├── war-room/page.tsx        # Prediction arena + TradingView
│   │   ├── market-intel/page.tsx    # Sentiment dashboard
│   │   └── treasury/page.tsx        # Portfolio vault + MetaMask
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AppShell.tsx         # Conditional layout (landing vs. app)
│   │   │   ├── Navbar.tsx           # Clock, market status, wallet connect
│   │   │   └── Sidebar.tsx          # Collapsible navigation
│   │   ├── dashboard/
│   │   │   └── LiveTickerCard.tsx   # Real-time price ticker component
│   │   └── ui/
│   │       ├── BookLogo.tsx         # Animated logo
│   │       └── AnimatedRupee.tsx    # Animated ₹ symbol
│   │
│   └── public/                      # Static assets
│
└── myvenv/                          # Python virtual environment (gitignored)
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **Python** ≥ 3.11
- **PostgreSQL** ≥ 15
- **MetaMask** browser extension (for Web3 features)
- **Google Gemini API Key** ([Get one here](https://aistudio.google.com/app/apikey))

### 1. Backend Setup

```bash
# Clone the repository
git clone https://github.com/dukebismaya/Arthashastra.git
cd Arthashastra

# Create & activate virtual environment
python -m venv myvenv
# Windows:
myvenv\Scripts\activate
# macOS/Linux:
source myvenv/bin/activate

# Install dependencies
cd backend
pip install -r requirements.txt

# Create a PostgreSQL database
# psql -U postgres -c "CREATE DATABASE arthashastra;"

# Create .env file in /backend
```

Create `backend/.env`:
```env
DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/arthashastra
GEMINI_API_KEY=your_gemini_api_key_here
```

```bash
# Start the backend server
uvicorn main:app --reload --port 8000
```

The API will be live at `http://localhost:8000`. Visit `http://localhost:8000/docs` for the auto-generated Swagger UI.

### 2. Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install

# Create .env.local file
```

Create `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

```bash
# Start the development server
npm run dev
```

The app will be live at `http://localhost:3000`.

---

## 🔐 Environment Variables

### Backend (`backend/.env`)

| Variable | Required | Description | Example |
|---|---|---|---|
| `DATABASE_URL` | ✅ | PostgreSQL connection string | `postgresql://postgres:password@localhost:5432/arthashastra` |
| `GEMINI_API_KEY` | ✅ | Google Gemini API key for AI features | `AIzaSy...` |

### Frontend (`frontend/.env.local`)

| Variable | Required | Description | Example |
|---|---|---|---|
| `NEXT_PUBLIC_API_URL` | ✅ | Backend API base URL | `http://localhost:8000` |

---

## 📡 API Reference — Postman Documentation

**Base URL:** `http://localhost:8000`  
**API Prefix:** `/api/v1`

> Import these as a Postman collection or test directly with cURL.

---

### 1. Health Check

Verify the API server is running.

```
GET /health
```

**cURL:**
```bash
curl -X GET http://localhost:8000/health
```

**Response** `200 OK`:
```json
{
  "status": "ok"
}
```

---

### 2. Market Data

Fetch real-time stock/crypto quotes via yfinance.

```
GET /api/v1/market/quote/{ticker}
```

| Parameter | Type | Location | Description |
|---|---|---|---|
| `ticker` | `string` | Path | Stock/crypto ticker symbol (e.g., `AAPL`, `RELIANCE.NS`, `BTC-USD`) |

**cURL:**
```bash
curl -X GET http://localhost:8000/api/v1/market/quote/AAPL
```

**Response** `200 OK`:
```json
{
  "ticker": "AAPL",
  "current_price": 198.45,
  "day_high": 201.30,
  "day_low": 196.80,
  "previous_close": 195.20
}
```

**Postman Setup:**
| Field | Value |
|---|---|
| Method | `GET` |
| URL | `{{base_url}}/api/v1/market/quote/RELIANCE.NS` |
| Headers | None required |

**Indian Market Examples:**
- NSE: `RELIANCE.NS`, `TCS.NS`, `INFY.NS`, `HDFCBANK.NS`
- BSE: `RELIANCE.BO`, `TCS.BO`

---

### 3. Chanakya AI Predictions

Submit a directional prediction (bullish/bearish) and receive an AI-powered analysis with confidence scoring and explainable reasoning.

```
POST /api/v1/predict/analyze
```

**Request Body:**
```json
{
  "ticker": "AAPL",
  "direction": "bullish",
  "wager": 1000.0
}
```

| Field | Type | Required | Validation | Description |
|---|---|---|---|---|
| `ticker` | `string` | ✅ | — | Stock/crypto ticker |
| `direction` | `string` | ✅ | `"bullish"` or `"bearish"` | Predicted direction |
| `wager` | `float` | ✅ | `> 0` | Wager amount |

**cURL:**
```bash
curl -X POST http://localhost:8000/api/v1/predict/analyze \
  -H "Content-Type: application/json" \
  -d '{"ticker": "AAPL", "direction": "bullish", "wager": 1000}'
```

**Response** `200 OK`:
```json
{
  "ticker": "AAPL",
  "direction": "bullish",
  "current_price": 198.45,
  "wager": 1000.0,
  "confidence_score": 82,
  "explainable_logic": [
    "Strong institutional buying pressure with 15% volume surge above 20-day average",
    "RSI at 58 with bullish MACD crossover confirms upward momentum",
    "Key support held at $195 — next resistance target at $205"
  ],
  "status": "pending"
}
```

**Postman Setup:**
| Field | Value |
|---|---|
| Method | `POST` |
| URL | `{{base_url}}/api/v1/predict/analyze` |
| Headers | `Content-Type: application/json` |
| Body (raw JSON) | `{"ticker": "RELIANCE.NS", "direction": "bullish", "wager": 5000}` |

> **Note:** The confidence score is generated by Google Gemini (range: 65–98). The endpoint uses 3 retries with exponential backoff (1s → 2s → 4s). If Gemini is unreachable, hardcoded fallback logic is returned.

---

### 4. Market Intel — News Sentiment

Returns 4 randomly selected financial headlines with AI-powered sentiment analysis and Chanakya reasoning.

```
GET /api/v1/news/sentiment
```

**cURL:**
```bash
curl -X GET http://localhost:8000/api/v1/news/sentiment
```

**Response** `200 OK`:
```json
{
  "analyzed_at": "2026-02-27T07:15:54",
  "model": "gemini-2.0-flash",
  "articles": [
    {
      "headline": "Federal Reserve signals potential rate cut amid cooling inflation data",
      "source": "Reuters",
      "published_at": "2026-02-27T06:30:00",
      "sentiment": "Bullish",
      "confidence_score": 0.87,
      "sector": "Macro / Central Bank",
      "is_breaking_alert": true,
      "chanakya_logic": "Rate cuts historically fuel equity rallies. Bond yields will compress, pushing capital toward risk assets. Kautilya would advise positioning in growth sectors."
    },
    {
      "headline": "NVIDIA unveils next-gen AI chip architecture",
      "source": "Bloomberg",
      "published_at": "2026-02-27T05:45:00",
      "sentiment": "Bullish",
      "confidence_score": 0.91,
      "sector": "Technology",
      "is_breaking_alert": false,
      "chanakya_logic": "Semiconductor dominance is the modern equivalent of controlling trade routes. NVIDIA's moat deepens with each architectural leap."
    }
  ]
}
```

**Postman Setup:**
| Field | Value |
|---|---|
| Method | `GET` |
| URL | `{{base_url}}/api/v1/news/sentiment` |
| Headers | None required |

> **Note:** 4 of 8 mock headlines are randomly selected per call. All 4 Gemini analysis calls fire concurrently via `asyncio.gather` for sub-second response times.

**Possible Sentiment Values:** `Bullish`, `Bearish`, `Neutral`  
**Possible Sectors:** `Macro / Central Bank`, `Technology`, `Crypto`, `Crypto / Regulation`, `Energy`, `Indian Equities`, `Financials`

---

### 5. User & Wallet

#### 5a. Get or Create User

Returns the user profile for a wallet address. If the wallet doesn't exist, auto-creates it with a default balance of ₹1,00,000.

```
GET /api/v1/user/{wallet_address}
```

| Parameter | Type | Location | Description |
|---|---|---|---|
| `wallet_address` | `string` | Path | Ethereum wallet address (e.g., `0xc87a...44d9`) |

**cURL:**
```bash
curl -X GET http://localhost:8000/api/v1/user/0xc87a1234abcd5678ef90
```

**Response** `200 OK`:
```json
{
  "id": 1,
  "wallet_address": "0xc87a1234abcd5678ef90",
  "portfolio_balance": 100000.0
}
```

#### 5b. Deposit Funds

Add funds to a user's portfolio balance.

```
POST /api/v1/user/{wallet_address}/deposit
```

| Parameter | Type | Location | Description |
|---|---|---|---|
| `wallet_address` | `string` | Path | Ethereum wallet address |

**Request Body:**
```json
{
  "amount": 5000.0
}
```

| Field | Type | Required | Validation |
|---|---|---|---|
| `amount` | `float` | ✅ | `> 0` |

**cURL:**
```bash
curl -X POST http://localhost:8000/api/v1/user/0xc87a1234abcd5678ef90/deposit \
  -H "Content-Type: application/json" \
  -d '{"amount": 5000}'
```

**Response** `200 OK`:
```json
{
  "status": "deposit successful",
  "wallet_address": "0xc87a1234abcd5678ef90",
  "new_balance": 105000.0
}
```

**Postman Setup:**
| Field | Value |
|---|---|
| Method | `POST` |
| URL | `{{base_url}}/api/v1/user/0xYourWallet/deposit` |
| Headers | `Content-Type: application/json` |
| Body (raw JSON) | `{"amount": 5000}` |

---

### 6. Academy

#### 6a. Get Course Catalogue

Returns the full list of available courses.

```
GET /api/v1/academy/courses
```

**cURL:**
```bash
curl -X GET http://localhost:8000/api/v1/academy/courses
```

**Response** `200 OK`:
```json
[
  {
    "id": 1,
    "title": "Web3 Fundamentals: Wallets & Transactions",
    "description": "Learn how blockchain wallets work, create your first transaction, and understand gas fees in the Ethereum ecosystem.",
    "reward": 500.0,
    "category": "Web3"
  },
  {
    "id": 2,
    "title": "Kautilya's Guide to Value Investing",
    "description": "Apply ancient strategic principles to modern value investing. Learn to identify undervalued assets using fundamental analysis.",
    "reward": 750.0,
    "category": "Investing"
  },
  {
    "id": 3,
    "title": "FinBERT & Sentiment Analysis",
    "description": "Understand how FinBERT NLP model analyzes financial news sentiment and how to use it for trading signals.",
    "reward": 600.0,
    "category": "AI / ML"
  },
  {
    "id": 4,
    "title": "DeFi Yield Strategies",
    "description": "Explore decentralized finance protocols, liquidity pools, and yield farming strategies for passive income.",
    "reward": 850.0,
    "category": "Web3"
  }
]
```

#### 6b. Complete Course & Claim Reward

Mark a course as completed and credit the reward to the user's portfolio balance.

```
POST /api/v1/academy/complete/{course_id}
```

| Parameter | Type | Location | Description |
|---|---|---|---|
| `course_id` | `int` | Path | Course ID (1–4) |

**Request Body:**
```json
{
  "wallet_address": "0xc87a1234abcd5678ef90"
}
```

**cURL:**
```bash
curl -X POST http://localhost:8000/api/v1/academy/complete/1 \
  -H "Content-Type: application/json" \
  -d '{"wallet_address": "0xc87a1234abcd5678ef90"}'
```

**Response** `200 OK`:
```json
{
  "status": "course completed",
  "course_title": "Web3 Fundamentals: Wallets & Transactions",
  "reward": 500.0,
  "new_balance": 100500.0
}
```

**Error** `404 Not Found`:
```json
{
  "detail": "Course not found"
}
```

**Postman Setup:**
| Field | Value |
|---|---|
| Method | `POST` |
| URL | `{{base_url}}/api/v1/academy/complete/1` |
| Headers | `Content-Type: application/json` |
| Body (raw JSON) | `{"wallet_address": "0xYourWallet"}` |

---

### Postman Collection Variables

Set these as Collection or Environment variables in Postman:

| Variable | Value |
|---|---|
| `base_url` | `http://localhost:8000` |

---

### Quick-Test All Endpoints (cURL)

```bash
# 1. Health check
curl http://localhost:8000/health

# 2. Market quote
curl http://localhost:8000/api/v1/market/quote/AAPL

# 3. Chanakya AI prediction
curl -X POST http://localhost:8000/api/v1/predict/analyze \
  -H "Content-Type: application/json" \
  -d '{"ticker":"AAPL","direction":"bullish","wager":1000}'

# 4. News sentiment
curl http://localhost:8000/api/v1/news/sentiment

# 5. Get/create user
curl http://localhost:8000/api/v1/user/0xTestWallet123

# 6. Deposit funds
curl -X POST http://localhost:8000/api/v1/user/0xTestWallet123/deposit \
  -H "Content-Type: application/json" \
  -d '{"amount":5000}'

# 7. Get courses
curl http://localhost:8000/api/v1/academy/courses

# 8. Complete course
curl -X POST http://localhost:8000/api/v1/academy/complete/1 \
  -H "Content-Type: application/json" \
  -d '{"wallet_address":"0xTestWallet123"}'
```

---

## 🖥 Frontend Pages

| Route | Page | Key Features |
|---|---|---|
| `/` | **Landing** | Parallax hero with scroll-linked transforms, mouse-tracking blobs, floating BookLogo, live ticker tape, feature grid, philosophy carousel, spring-physics CTA |
| `/war-room` | **Prediction Arena** | TradingView chart embed, ticker search, bullish/bearish directional bets, Chanakya AI analysis panel with confidence gauge, explainable reasoning bullets |
| `/market-intel` | **News Sentiment** | Real-time Gemini-analyzed headlines, sentiment badges (Bullish/Bearish/Neutral), confidence bars, breaking alert toast, aggregate market signal |
| `/academy` | **Quest Board** | 4 gamified quest cards, sequential module progression, XP + level system, simulated on-chain NFT mint, reward claiming with animated toast |
| `/treasury` | **Portfolio Vault** | MetaMask wallet connect, live balance display, fund deposit to PostgreSQL, mock transaction history ledger |

---

## 🔗 Web3 Integration

- **Wallet Provider:** MetaMask (via `window.ethereum`)
- **Library:** ethers.js v6
- **Auth Flow:** `eth_requestAccounts` → wallet address used as user identifier
- **Backend Sync:** Wallet address maps to `User` model in PostgreSQL (auto-created on first visit with ₹1,00,000 default balance)
- **Future-Ready:** ethers.js v6 installed for smart contract interactions, NFT minting, and on-chain transactions

---

## 📄 License

This project is licensed under the **MIT License**.

```
MIT License © 2026 BISMAYA JYOTI DALEI
```

See [LICENSE](LICENSE) for the full text.

---

<p align="center">
  <strong>Arthashastra</strong> · Financial Intelligence Platform · Est. 2026
  <br/>
  <em>"In the happiness of his subjects lies his happiness; in their welfare, his welfare."</em>
  <br/>
  — Kautilya, Arthashastra · Book I, Chapter 7
</p>
