# Employee Management System

Enterprise-style employee management monorepo with **ASP.NET Core Web API** and **Angular 22** (frontend planned).

## Backend stack

- ASP.NET Core 10 Web API
- PostgreSQL + Entity Framework Core
- JWT authentication (Admin / HR / Viewer roles)
- FluentValidation
- Serilog (Console + Seq)
- Swagger OpenAPI

## Quick start

### 1. Start infrastructure

```bash
docker compose up -d
```

- PostgreSQL: `localhost:5432`
- Seq logs UI: http://localhost:5341 (login: `admin` / `Admin123!`)

### 2. Run API

```bash
cd backend/src/EmployeeManagement.Api
dotnet run
```

- Swagger: https://localhost:7xxx/swagger (see launchSettings)
- Health: `/health`

Database migrations and seed data run automatically on startup.

## Demo users

| Username | Password    | Role   |
|----------|-------------|--------|
| admin    | Admin123!   | Admin  |
| hr       | Hr123456!   | HR     |
| viewer   | Viewer123!  | Viewer |

## API modules

| Module       | Base route              |
|--------------|-------------------------|
| Auth         | `/api/auth`             |
| Employees    | `/api/employees`        |
| Departments  | `/api/departments`      |
| Dashboard    | `/api/dashboard`        |
| Reports      | `/api/reports`          |

## Frontend (Angular 22)

```bash
cd frontend/employee-management-web
npm start
```

Open http://localhost:51783 and log in with a demo user.

### Frontend features

- Angular 22 Signals, computed, effects, linkedSignal, debounced, Resource API
- Signal Forms (login, employee create/edit)
- Lazy routes + route preloading after auth
- SSR prerender on dashboard, employees list, reports
- Angular Material UI

