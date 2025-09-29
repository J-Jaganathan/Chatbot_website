# Prolog Debugging Assistant

A web-based chatbot that helps developers debug frontend, backend, and full-stack issues using Prolog knowledge bases. This project features a **Next.js frontend**, a **proxy API route**, and a **Prolog-powered backend** hosted on Render.  

---

## Table of Contents
- [Project Overview](#project-overview)
- [Features](#features)
- [Architecture](#architecture)
- [Technologies Used](#technologies-used)
- [Frontend](#frontend)
- [Backend API](#backend-api)
- [Database](#database)
- [Deployment](#deployment)
- [Usage](#usage)
- [Troubleshooting](#troubleshooting)
- [License](#license)

---

## Project Overview

Prolog Debugging Assistant allows developers to input error messages or debugging queries and get suggestions based on prebuilt Prolog rules and knowledge bases. The frontend communicates with a **Next.js API route**, which acts as a proxy to the Render-hosted Prolog backend.

---

## Features

- Real-time chat interface
- Syntax-aware AI suggestions powered by Prolog
- User-friendly UI with error highlighting
- Auto-scroll chat messages
- Persistent session during usage
- Proxy API to avoid CORS issues
- Handles backend cold starts gracefully

---

## Architecture

```

User Frontend (Next.js)
│
▼
/api/chat (Next.js API Route)
│
▼
Prolog Backend (Render)
│
▼
Knowledge Base & Prolog Rules

````

- **Frontend:** React + Next.js 15.5.4  
- **API Route:** `/api/chat` proxies requests to backend  
- **Backend:** Prolog-based inference engine deployed on Render  
- **Database / KB:** Prolog facts and rules stored in `.pl` files (can be extended with external DB if needed)  

---

## Technologies Used

- **Frontend:** Next.js, React, TailwindCSS, Lucide-react icons
- **Backend:** Prolog (SWI-Prolog), Node.js proxy
- **Hosting / Deployment:** Vercel (frontend + API), Render (backend)
- **Utilities:** fetch API, environment variables, optional uptime monitoring

---

## Frontend

- Implemented in **Next.js 15.5.4**  
- Features:
  - Chat UI with **user, assistant, and error messages**
  - Textarea input with **Enter to send** and **Shift+Enter** for new lines
  - Auto-scroll chat to latest message
  - Input validation and loading states

**API Integration:**

```javascript
const API_URL = '/api/chat';
const response = await fetch(API_URL, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ query: userMessage })
});
````

---

## Backend API

* **Location:** `src/app/api/chat/route.js`
* **Purpose:** Proxy Next.js frontend requests to the Prolog backend
* **Example code:**

```javascript
export async function POST(req) {
  const { query } = await req.json();
  try {
    const res = await fetch(process.env.PROLOG_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query })
    });
    const data = await res.json();
    return new Response(JSON.stringify(data), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ answer: `Error: ${err.message}` }), { status: 500 });
  }
}
```

* **Notes:**

  * Uses environment variable `PROLOG_API_URL` for backend URL
  * Handles backend errors and returns proper messages to frontend
  * Avoids CORS issues by acting as a proxy

---

## Database / Knowledge Base

* **Backend:** Prolog rules and facts (`.pl` files) stored in Render deployment
* **Structure:**

  * Facts: Known error patterns, their causes, and solutions
  * Rules: Logical inference for matching error messages
* **Optional Expansion:** Can integrate with a MongoDB / PostgreSQL database to store user queries, solutions, or session logs

---

## Deployment

### Frontend + API (Next.js)

1. Push code to GitHub
2. Connect repository on Vercel
3. Configure environment variable:

   ```
   PROLOG_API_URL=https://your url
   ```
4. Deploy → Vercel automatically builds Next.js app

### Backend (Prolog)

1. Host Prolog server on Render or any cloud provider
2. Expose endpoint `/chat` for POST requests
3. Keep backend awake using **UptimeRobot** or switch to paid always-on plan

---

## Usage

1. Open deployed frontend URL (Vercel)
2. Type your error or debugging query
3. Press **Enter** to send
4. View AI suggestions below
5. Clear chat using trash icon

**Example Queries:**

* `"Cannot read property of undefined"`
* `"CORS error in my API"`
* `"React state not updating"`

---

## Troubleshooting

* **API 404 / 500 errors:** Check `PROLOG_API_URL` environment variable
* **Cold start delays:** First request may take 30–60 seconds if backend is asleep
* **CORS issues:** Always route requests through Next.js API proxy
* **Vercel deployment issues:** Ensure Next.js version 15.5.4 is supported

---

## License

This project is **MIT Licensed**. You can freely use, modify, and distribute.

---

## Future Improvements

* Persistent chat history per user
* Admin dashboard for adding new Prolog rules
* Multi-language support for error messages
* Logging and analytics for user queries

```
