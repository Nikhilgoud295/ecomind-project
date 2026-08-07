# 🌿 EcoMind AI - AI-Powered Environmental Footprint & BRSR Compliance Platform

EcoMind AI is an enterprise-grade sustainability management platform powered by Google Gemini 1.5 AI Flash. It enables organizations and individuals to track resource consumption, calculate carbon emissions (Scopes 1, 2, and 3), receive real-time AI reduction strategies, unlock performance rewards, and generate statutory SEBI BRSR ESG compliance reports.

---

## 🌟 Key Features

### 📊 Real-Time Carbon Footprint Ledger
- Dynamic tracking for core environmental resource streams:
  - **Electricity Usage** (kWh)
  - **Water Consumption** (Liters)
  - **Waste Generated** (kg)
  - **Fuel & Diesel Usage** (Liters)
  - **Public Transport & Commute** (km)
  - **Renewable Solar Energy Share** (%)
  - **Recycling Diversion Rate** (%)
- Instant **IPCC & GHG Protocol emission factor calculations** ($\text{kg CO}_2\text{e}$) with live metric card updates across the platform.

### 🤖 Google Gemini AI Advisor
- Integrated with Google Gemini 1.5 AI Flash API.
- Generates structured JSON analysis including:
  - **Sustainability Eco-Score** (0-100)
  - **Executive Summary & Key Strengths**
  - **Targeted Energy, Water, and Waste Action Plans**
  - **Interactive AI Copilot Chat Interface** for real-time sustainability queries.

### 📈 Interactive Dashboards & 3D WebGL Globe
- Dynamic data visualization powered by **Recharts**:
  - Carbon Emissions Trend Lines & Area Charts
  - Scope 1, 2, and 3 Distribution Pie Charts
  - Electricity vs Water Usage Comparison Bar Charts
- **Interactive 3D WebGL Command Globe** visualizing global eco nodes and atmospheric particle fields.

### 📜 Compliance Reports & Rewards Core
- One-click export to:
  - **CSV Audit Logs** for raw data statutory compliance auditing.
  - **Printable Certificate of Sustainability Appreciation** (Unlocks strictly at 500 XP / Level 2 status).

---

## 🛠️ Technology Stack

| Layer | Technology / Library | Purpose |
| :--- | :--- | :--- |
| **Frontend Framework** | React.js 18 & Vite | Fast reactive user interface and modular component architecture |
| **Styling & Theme** | Tailwind CSS & Glassmorphism | Custom HSL eco palette, neural network background animations |
| **Data Visualization** | Recharts & Three.js | Real-time carbon trend graphs and 3D WebGL eco globe |
| **Icons & Media** | Lucide React Icons | Modern SVG UI icons |
| **Backend API** | Node.js & Express.js | High-throughput REST API server |
| **Password Security** | **Bcrypt.js (10 Salt Rounds)** | Enterprise-grade password hashing, salt encryption, and auth verification |
| **Session Security** | JSON Web Tokens (`jsonwebtoken`) | Stateless JWT auth token signing and session management |
| **Input Validation** | Zod Schema Validation | Strict runtime API request body and parameter validation |
| **AI Intelligence** | Google Gemini 1.5 AI Flash (`@google/genai`) | Automated carbon reduction strategy generation and AI chat copilot |
| **Database & ORM** | Supabase PostgreSQL | Relational database storage with Row Level Security (RLS) policies |
| **Network & Security** | Helmet, CORS, Express-Rate-Limit | API rate limiting, CORS protection, and HTTP security headers |

---

## 🚀 Quick Setup Instructions

### Prerequisites
- Node.js v18+ installed.
- Supabase account & Google Gemini API Key.

### 1. Backend Setup
```bash
cd server
npm install
cp .env.example .env
```
Update `server/.env` with your credentials:
```env
PORT=5000
SUPABASE_URL=https://your-supabase-id.supabase.co
SUPABASE_KEY=your-supabase-service-key
JWT_SECRET=your-jwt-secret-key-32-chars
GOOGLE_API_KEY=your-gemini-api-key
```
Start backend server:
```bash
npm run dev
```

### 2. Frontend Setup
```bash
cd client
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📜 License
Licensed under the MIT License.
