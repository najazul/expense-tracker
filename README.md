# Expense Tracker

A high-performance, containerized, and modern Corporate Expense Tracker built as a standard client-side Single Page Application connected to a secure .NET 10 Web API.

---

## 🛠️ System Architecture & Tech Stack

This repository is split into two primary decoupled services designed for local execution and seamless production deployment:

### 1. Frontend Web Application (`expense-tracker-web`)
*   **Engine:** Client-Side Single Page Application (SPA) built with **React**, **Vite**, and **TypeScript**.
*   **Routing:** Fully type-safe routing and layout layers managed via **TanStack Router**.
*   **Styling:** Designed with a professional dark/orange glassmorphic theme using **Tailwind CSS v4** and customized **Radix UI** primitives.

### 2. Backend REST API (`ExpenseTracker.API`)
*   **Framework:** High-performance **C# ASP.NET Core** utilizing Controller patterns.
*   **Database ORM:** Entity Framework Core connecting to a **PostgreSQL** relational database.
*   **Storage Services:** Integrates **Cloudflare R2** (S3-compatible API) to securely archive uploaded physical receipts with zero egress cost.
*   **Authentication:** Integrates client-side **Google Identity Services (GSI)** with server-side validation and signed, custom **JSON Web Token (JWT)** claims.

---

## 🌐 Cloud Infrastructure Integrations

### Cloudflare R2 Bucket Storage
*   Receipt attachments (images and PDFs) uploaded via the dashboard are securely sent to a dedicated **Cloudflare R2 bucket**.
*   This keeps my PostgreSQL database lightweight (only saving the public asset URLs) and bypasses egress bandwidth fees.

### DNS & SSL via Cloudflare
*   Custom domains are routed and protected behind Cloudflare's CDN.
*   Enforces strict SSL/TLS redirection rules to guarantee complete encryption of credentials and payload transfers.

---

## 🐳 Containerization & Render Deployment

Both apps are fully containerized using **Docker** and deployed as separate linked services on **Render**:

```
 ┌─────────────────────────┐             ┌─────────────────────────┐
 │   React SPA (Vite)      │             │  C# ASP.NET Core API    │
 │   Port 3000 (Docker)    │ ──────────> │   Port 80 (Docker)      │
 └─────────────────────────┘             └─────────────────────────┘
              │                                       │
              ▼                                       ▼
    Render Web Service                      Render Web Service
 (expense-tracker-web.render)             (expense-tracker-api.render)
```

### Docker Configurations

*   **Frontend SPA Dockerfile:** A single-stage alpine node container that compiles assets dynamically with `vite build` and serves the production `dist/` directory via Vite's own high-performance **`preview`** server on port `3000`.
*   **Backend API Dockerfile:** A standard multi-stage .NET SDK container that builds and runs the ASP.NET Core API listening on port `80` in production.
*   **Active Warmup Pinger:** A custom cron job periodically pings both web pods to prevent Render's free tier from putting them into inactivity sleep cycles.

---

## 🔗 Seamless App-to-App Connection

The frontend web app and backend API services communicate seamlessly across origins thanks to three key connections:

1.  **Build-Arg Environment Injection:**
    During the frontend Docker build, the environment variable `VITE_API_BASE` is passed as a `--build-arg` (e.g. `VITE_API_BASE="https://expense-tracker-api.onrender.com"`). This bakes the production API endpoint directly into the compiled JavaScript bundle.
2.  **CORS Policies on ASP.NET Core:**
    The C# API explicitly permits the frontend Origin (`https://expense-tracker.onrender.com`) to make preflight and actual HTTP requests (authorized via standard headers).
3.  **Host Header Validation:**
    Configured `preview: { allowedHosts: true }` in the frontend's `vite.config.ts` so the Vite serving process accepts the public Render domain host header redirect securely.

---

## 🚀 Running Locally

### 1. Prerequisites
*   Node.js v20+ and `pnpm`
*   .NET 10 SDK
*   PostgreSQL running locally

### 2. Startup Commands
*   **Start the Backend API:**
    ```bash
    cd ExpenseTracker.API
    dotnet run
    ```
*   **Start the Frontend Web App:**
    ```bash
    cd expense-tracker-web
    pnpm install
    pnpm run dev
    ```
    Open `http://localhost:3000` in your web browser.
