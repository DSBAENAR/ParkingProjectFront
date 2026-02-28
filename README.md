# Parking Core - Frontend

**Smart parking lot management system** | SPA deployed on Azure with automated CI/CD

[![Deploy](https://github.com/DSBAENAR/ParkingProjectFront/actions/workflows/deploy.yml/badge.svg)](https://github.com/DSBAENAR/ParkingProjectFront/actions/workflows/deploy.yml)
[![Live Demo](https://img.shields.io/badge/demo-parkingfront.azurewebsites.net-blue)](https://parkingfront.azurewebsites.net)

---

## Overview

Parking Core is a full-stack platform for managing parking lots in real time. This repository contains the frontend: a Single Page Application built with React, TypeScript and Tailwind CSS that communicates with a Spring Boot backend deployed on Azure.

**Live demo:** [parkingfront.azurewebsites.net](https://parkingfront.azurewebsites.net)

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Framework** | React 18 + TypeScript + Vite |
| **Styling** | Tailwind CSS 4 + Radix UI + shadcn/ui |
| **Routing** | React Router 7 |
| **Payments** | Stripe (React Stripe.js) |
| **Charts** | Recharts |
| **Animations** | Motion (Framer Motion) |
| **Infrastructure** | Docker (multi-stage) + Nginx + Azure Web App |
| **CI/CD** | GitHub Actions → Azure Container Registry → Azure App Service |

## Architecture

```
┌─────────────────────────────────────────────────┐
│  GitHub Actions CI/CD                           │
│  push to master → build → ACR → Azure Web App  │
└──────────────────────┬──────────────────────────┘
                       │
        ┌──────────────▼──────────────┐
        │   Azure Web App (Nginx)     │
        │   parkingfront.azurewebsites│
        │   SPA + static assets       │
        └──────────────┬──────────────┘
                       │ HTTPS
        ┌──────────────▼──────────────┐
        │   Azure Web App (Spring)    │
        │   parkingback REST API      │
        │   JWT Auth + Stripe         │
        ├─────────┬───────┬───────────┤
        │ Postgres│ Redis │  Stripe   │
        └─────────┴───────┴───────────┘
```

## Features

- **Authentication & authorization** — Login/signup with JWT, protected routes, role-based access (USER/ADMIN)
- **Real-time dashboard** — Occupancy visualization, active vehicles and key metrics
- **Vehicle management** — CRUD operations by type (Official, Resident, Non-Resident)
- **Entry/exit tracking** — Access control with automatic duration calculation
- **Stripe payments** — Integrated payment processing with Stripe Elements
- **Reports & analytics** — Interactive charts with Recharts
- **User management** — Admin panel for system users

## Project Structure

```
src/
├── app/
│   ├── components/       # Application components
│   │   ├── ui/           # Base components (shadcn/ui)
│   │   ├── Dashboard.tsx
│   │   ├── Login.tsx
│   │   ├── Vehicles.tsx
│   │   ├── Registers.tsx
│   │   ├── Payments.tsx
│   │   ├── Reports.tsx
│   │   └── Users.tsx
│   ├── context/          # React Context (AuthContext)
│   ├── services/         # Service layer (API client)
│   ├── types/            # TypeScript interfaces
│   └── routes.tsx        # Route configuration
├── main.tsx
└── index.css
```

## Getting Started

### Prerequisites

- Node.js 20+
- npm

### Local Development

```bash
# Clone the repository
git clone https://github.com/DSBAENAR/ParkingProjectFront.git
cd ParkingProjectFront

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your backend URL and Stripe key

# Start the development server
npm run dev
```

### Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API base URL | `http://localhost:8080` |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key | `pk_test_...` |

## Deployment

The project uses a fully automated CI/CD pipeline:

1. **Push to `master`** triggers GitHub Actions
2. **Build** — Docker multi-stage (Node.js build + Nginx runtime)
3. **Push** — Image to Azure Container Registry
4. **Deploy** — Azure Web App pulls the updated container

### Docker (multi-stage)

```dockerfile
# Build: Node 20 Alpine + Vite build with env vars injected at build-time
# Runtime: Nginx Alpine serving static assets
# Result: ~30MB image with SPA routing and gzip compression
```

### Azure Infrastructure

| Resource | Service |
|----------|---------|
| Frontend | Azure Web App (Linux container) |
| Backend | Azure Web App (Spring Boot container) |
| Images | Azure Container Registry |
| Database | Azure PostgreSQL Flexible Server |
| Cache | Azure Cache for Redis |

## Backend

The backend is a REST API built with Spring Boot 3, hosted in a separate repository:

**Repository:** [DSBAENAR/ParkingProject](https://github.com/DSBAENAR/ParkingProject)

Key endpoints: JWT authentication, vehicle CRUD, entry/exit tracking, Stripe payments and reports.

## Author

**David Baena** — [GitHub](https://github.com/DSBAENAR)
