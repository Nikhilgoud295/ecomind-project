# 🌿 EcoMind AI – Smart Sustainability Assistant

![EcoMind AI Banner](https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1200)

**EcoMind AI** is an AI-powered, production-ready sustainability management platform built to help individuals, businesses, and organizations track carbon emissions, optimize electricity and water usage, minimize waste, and receive personalized AI advisory strategies via **Google Gemini**.

---

## ✨ Features Overview

### 🔐 Authentication & Security
- **JWT Token Authentication** with protected client routes.
- **bcrypt Password Hashing** for robust security.
- **Zod Schema Validation** on both frontend forms and backend endpoints.
- **Helmet, CORS, and Express Rate Limiting** to prevent brute-force attacks and security vulnerabilities.

### 📊 Resource Tracking & Carbon Accounting
- Log daily metrics for:
  - **Electricity Usage** (kWh)
  - **Water Consumption** (Liters)
  - **Waste Generated** (kg)
  - **Fuel Usage** (Liters)
  - **Public Transport** (km)
  - **Renewable Energy Share** (%)
  - **Recycling Diversion Rate** (%)
- Instant **IPCC-aligned carbon footprint calculations** (kg CO2e) with real-time feedback.

### 🤖 Google Gemini AI Advisor
- Powered by `@google/genai` SDK.
- Secure backend API integration (API keys stored exclusively in server environment variables).
- Generates structured JSON analysis including:
  - **Sustainability Score** (0-100)
  - **Executive Summary & Key Strengths**
  - **Efficiency Hotspots & Concerns**
  - **Customized Carbon, Water, Energy, & Waste Action Plans**
  - **Priority Action Items**

### 📈 Interactive Dashboards & Analytics
- Dynamic data visualization powered by **Recharts**:
  - Carbon Emissions Trend Lines & Area Charts
  - Electricity vs Water Usage Comparison
  - Waste vs Recycling Diversion Bar Charts
  - Resource Impact Distribution Pie Charts

### 📄 Compliance Reports & Exports
- Compile **Daily**, **Weekly**, and **Monthly** ESG audit reports.
- One-click export to:
  - **PDF Reports** formatted with headers, aggregate statistics, and data grids using `jspdf`.
  - **CSV Spreadsheets** for raw data compliance auditing.

---

## 🛠️ Tech Stack

- **Frontend**: React.js 18, Vite, React Router v6, Tailwind CSS, Recharts, Lucide Icons, Axios, jsPDF
- **Backend**: Node.js, Express.js, JWT (`jsonwebtoken`), bcryptjs, Zod validation, `@google/genai` SDK, `@supabase/supabase-js`, Helmet, CORS, Rate Limiting
- **Database**: Supabase PostgreSQL (Row Level Security enabled, indexes, triggers)

---

## 🚀 Quick Setup Instructions

### Prerequisites
- Portable Node.js / Node v18+ installed.
- Supabase account & Google Gemini API Key.

### 1. Backend Setup
```bash
cd server
npm install
cp .env.example .env
```
Update `.env` with your Supabase and Gemini credentials:
```env
PORT=5000
SUPABASE_URL=https://your-supabase-id.supabase.co
SUPABASE_KEY=your-supabase-service-key
JWT_SECRET=your-jwt-secret-key-32-chars
GOOGLE_API_KEY=your-gemini-api-key
```

Start the backend server:
```bash
npm run dev
```
Server runs at `http://localhost:5000`.

### 2. Frontend Setup
```bash
cd client
npm install
npm run dev
```
App opens at `http://localhost:5173`.

---

## 🗄️ Database Schema Execution

Execute `schema.sql` (found in project root or `server/database/schema.sql`) inside your Supabase SQL Editor to initialize:
- `users` table
- `resource_usage` table
- `analytics` table
- `ai_reports` table
- `reports` table
- Row Level Security (RLS) policies and automatic `updated_at` triggers.

---

## 📄 Project Documentation Links

- [API Documentation](file:///c:/Users/KAVYA/OneDrive/Desktop/all%20projects/sustainability%20project/API_DOCUMENTATION.md)
- [Postman Collection](file:///c:/Users/KAVYA/OneDrive/Desktop/all%20projects/sustainability%20project/postman_collection.json)
- [Deployment Guide](file:///c:/Users/KAVYA/OneDrive/Desktop/all%20projects/sustainability%20project/DEPLOYMENT_GUIDE.md)
- [PostgreSQL Schema](file:///c:/Users/KAVYA/OneDrive/Desktop/all%20projects/sustainability%20project/schema.sql)

---

## 🏆 Hackathon Winning Design

Built with modern glassmorphism UI, glowing emerald/teal aesthetics, micro-interactions, responsive mobile drawers, and zero unresolved TODOs or dummy placeholders. Ready for instant deployment on Vercel and Render!
