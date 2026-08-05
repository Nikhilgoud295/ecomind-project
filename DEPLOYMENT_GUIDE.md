# 🚀 EcoMind AI – Production Deployment Guide

This guide provides complete instructions for deploying the EcoMind AI platform to production services:
- **Frontend**: Vercel
- **Backend**: Render
- **Database**: Supabase PostgreSQL

---

## 🗄️ 1. Database Setup (Supabase PostgreSQL)

1. Sign in to your [Supabase Dashboard](https://supabase.com).
2. Create a new PostgreSQL Project named `ecomind-ai-db`.
3. Open the **SQL Editor** from the left navigation panel.
4. Copy the entire contents of `schema.sql` located in the root project directory or `server/database/schema.sql`.
5. Paste it into the SQL Editor and click **Run**.
6. Retrieve your **Project URL** and **Service Role API Key** from **Project Settings -> API**.

---

## ⚙️ 2. Backend Deployment (Render)

1. Push your repository to GitHub.
2. Sign in to [Render Dashboard](https://render.com).
3. Click **New + -> Web Service** and select your GitHub repository.
4. Set the **Root Directory** to `server`.
5. Environment: **Node**
6. Build Command: `npm install`
7. Start Command: `npm start`
8. Add the following **Environment Variables**:
   - `PORT`: `5000` (Render handles port binding automatically)
   - `NODE_ENV`: `production`
   - `SUPABASE_URL`: `https://<your-project-id>.supabase.co`
   - `SUPABASE_KEY`: `<your-supabase-service-role-key>`
   - `JWT_SECRET`: `<minimum-32-character-secret>`
   - `GOOGLE_API_KEY`: `<your-google-gemini-api-key>`
9. Click **Deploy Web Service**. Render will output a URL like `https://ecomind-backend.onrender.com`.

---

## 🌐 3. Frontend Deployment (Vercel)

1. Sign in to [Vercel](https://vercel.com).
2. Click **Add New -> Project** and import your GitHub repository.
3. Set the **Root Directory** to `client`.
4. Framework Preset: **Vite**
5. Add the following **Environment Variable**:
   - `VITE_API_URL`: `https://ecomind-backend.onrender.com/api`
6. Click **Deploy**. Vercel will build and host your React application with SSL encryption.

---

## ✅ Deployment Verification Checklist

- [x] Test `https://<backend-url>/health` to verify server status.
- [x] Attempt User Registration & Login on the deployed frontend URL.
- [x] Record resource metrics and verify Gemini AI response generation.
- [x] Download PDF & CSV reports from the Reports page.
