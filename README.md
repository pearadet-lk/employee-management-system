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
- **pgAdmin** (database UI): http://localhost:5050 (login: `admin@example.com` / `Admin123!`)
- Seq logs UI: http://localhost:5341 (login: `admin` / `Admin123!`)

#### PostgreSQL in pgAdmin

Yes — both run in the same Docker Compose network, so pgAdmin connects to PostgreSQL using the service name **`postgres`** as the host (not `localhost`).

On first start, the server **EMS PostgreSQL (Docker)** is registered automatically via [`pgadmin/servers.json`](pgadmin/servers.json).

If you already had pgAdmin running before this was added, reset it once:

```bash
docker compose stop pgadmin
docker volume rm employee-management-system_ems_pgadmin_data
docker compose up -d pgadmin
```

**Manual registration** (if needed): Right-click **Servers** → **Register** → **Server**

| Setting | Value |
|---------|-------|
| **General → Name** | EMS Local |
| **Connection → Host** | `postgres` |
| **Connection → Port** | `5432` |
| **Connection → Database** | `EmployeeManagement` |
| **Connection → Username** | `ems_user` |
| **Connection → Password** | `ems_password` |

Use `localhost` only if you connect from a desktop SQL client on your PC — **inside pgAdmin in Docker**, always use `postgres`.

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

