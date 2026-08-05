# 📖 EcoMind AI – API Documentation

Welcome to the **EcoMind AI** RESTful API specification. All APIs enforce structured request validation using **Zod**, pass through security middlewares (**Helmet**, **CORS**, **Express Rate Limiting**), and protect private endpoints via **JWT Authentication**.

Base URL: `http://localhost:5000/api`

---

## 🔑 Authentication Endpoints

### 1. Register User
- **Endpoint**: `POST /api/auth/register`
- **Rate Limit**: 20 requests / 15 mins
- **Request Body**:
```json
{
  "name": "Jane Doe",
  "email": "jane@ecomind.ai",
  "password": "securepassword123",
  "organization": "GreenTech Labs"
}
```
- **Success Response (201 Created)**:
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6...",
  "user": {
    "id": "usr_1722880000000_a1b2c",
    "name": "Jane Doe",
    "email": "jane@ecomind.ai",
    "organization": "GreenTech Labs",
    "avatar_url": "https://api.dicebear.com/7.x/bottts/svg?seed=Jane%20Doe",
    "created_at": "2026-08-05T23:30:00.000Z"
  }
}
```

### 2. Login User
- **Endpoint**: `POST /api/auth/login`
- **Request Body**:
```json
{
  "email": "demo@ecomind.ai",
  "password": "demopassword123"
}
```
- **Success Response (200 OK)**:
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6...",
  "user": {
    "id": "usr_demo",
    "name": "Demo User",
    "email": "demo@ecomind.ai",
    "organization": "EcoMind Hackathon Team"
  }
}
```

### 3. Get User Profile
- **Endpoint**: `GET /api/auth/profile`
- **Headers**: `Authorization: Bearer <token>`
- **Success Response (200 OK)**:
```json
{
  "success": true,
  "user": {
    "id": "usr_demo",
    "name": "Demo User",
    "email": "demo@ecomind.ai",
    "organization": "EcoMind Hackathon Team",
    "avatar_url": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256"
  }
}
```

---

## 📊 Resource Tracking Endpoints

### 1. Record Usage Entry
- **Endpoint**: `POST /api/usage`
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
```json
{
  "date": "2026-08-05",
  "electricity_kwh": 18.5,
  "water_liters": 140,
  "waste_kg": 3.2,
  "fuel_liters": 2.0,
  "public_transport_km": 12.0,
  "renewable_energy_pct": 25,
  "recycling_pct": 40,
  "notes": "Home office & electric scooter log"
}
```
- **Success Response (201 Created)**:
```json
{
  "success": true,
  "message": "Resource usage recorded successfully",
  "usage": {
    "id": "usg_1722880000_x9z",
    "user_id": "usr_demo",
    "date": "2026-08-05",
    "electricity_kwh": 18.5,
    "water_liters": 140,
    "waste_kg": 3.2,
    "calculated_co2_kg": 17.8
  }
}
```

### 2. Fetch Usage History
- **Endpoint**: `GET /api/usage?startDate=2026-08-01&endDate=2026-08-05&limit=30`
- **Headers**: `Authorization: Bearer <token>`

### 3. Update Usage Entry
- **Endpoint**: `PUT /api/usage/:id`
- **Headers**: `Authorization: Bearer <token>`

### 4. Delete Usage Entry
- **Endpoint**: `DELETE /api/usage/:id`
- **Headers**: `Authorization: Bearer <token>`

---

## 🤖 AI Advisory Endpoints (Google Gemini)

### 1. Analyze Sustainability Metrics
- **Endpoint**: `POST /api/ai/analyze`
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
```json
{
  "electricity_kwh": 18.5,
  "water_liters": 140,
  "waste_kg": 3.2,
  "renewable_energy_pct": 25,
  "recycling_pct": 40
}
```
- **Success Response (201 Created)**:
```json
{
  "success": true,
  "message": "AI sustainability analysis complete",
  "analysis": {
    "sustainability_score": 82,
    "summary": "Resource tracking demonstrates strong recycling commitment with moderate grid dependency.",
    "strengths": [
      "Utilizing 25% clean renewable energy",
      "Diverting 40% of waste through recycling"
    ],
    "problems": [
      "Electricity consumption (18.5 kWh) exceeds baseline"
    ],
    "recommendations": [
      "Transition key appliances to ENERGY STAR models"
    ],
    "carbon_reduction_tips": [
      "Optimize HVAC temperature by 2°C"
    ],
    "water_saving_tips": [
      "Install low-flow aerators"
    ],
    "energy_saving_tips": [
      "Unplug phantom loads using smart strips"
    ],
    "waste_reduction_plan": [
      "Audit single-use plastics"
    ],
    "priority_actions": [
      "Increase renewable share to 40%"
    ]
  }
}
```

---

## 📄 Reports Endpoints

### 1. Generate Audit Report
- **Endpoint**: `POST /api/reports/generate`
- **Request Body**:
```json
{
  "type": "weekly",
  "title": "EcoMind Weekly Sustainability Overview"
}
```

### 2. Fetch User Reports
- **Endpoint**: `GET /api/reports`
