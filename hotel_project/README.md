# Restaurant POS System

A full-stack Point-of-Sale (POS) system for restaurants, covering table management, order taking, kitchen display, billing, and inventory tracking.

## Overview

This project provides a complete restaurant operations workflow:

- Waitstaff can manage dine-in tables and takeaway orders.
- Orders are pushed to a live Kitchen Display System (KDS) over WebSockets.
- Billing generates and settles customer bills.
- Inventory tracks stock levels and low-stock alerts.
- Role-based authentication protects all business endpoints with JWT.

## Features

- 🔐 JWT-based authentication with Spring Security
- 🍽️ Table management (empty / occupied / billing states)
- 🧾 Dine-in and takeaway order handling
- 👨‍🍳 Real-time Kitchen Display System via WebSockets (STOMP/SockJS)
- 💳 Billing and payment settlement (Cash / UPI / Card)
- 📦 Inventory tracking with low-stock alerts
- 📊 Sales dashboard

## Tech Stack

**Backend**
- Java 21, Spring Boot, Spring Security, JWT
- MySQL, Spring Data JPA
- WebSockets (STOMP over SockJS)
- Maven

**Frontend**
- React 19 + Vite
- Axios
- React Router
- Tailwind CSS

## Architecture

```
┌─────────────┐        REST + WebSocket        ┌──────────────────┐
│   React     │ ──────────────────────────────▶ │  Spring Boot     │
│  Frontend   │ ◀────────────────────────────── │  Backend (JWT)   │
└─────────────┘                                  └────────┬─────────┘
                                                            │
                                                            ▼
                                                     ┌──────────────┐
                                                     │    MySQL     │
                                                     └──────────────┘
```

## Folder Structure

```
hotel_project/
├── Frontend/            # React + Vite application
│   └── src/
│       ├── api/         # Axios client
│       ├── services/    # API service wrappers
│       ├── context/     # React context providers (tables, orders, kots, etc.)
│       ├── pages/        # Route-level pages
│       └── components/  # UI components
└── pos-backend/         # Spring Boot backend
    └── src/main/java/com/restaurent/pos_backend/
        ├── auth/         # Auth DTOs
        ├── congig/       # Spring configuration (security, CORS, WebSocket)
        ├── controller/   # REST controllers
        ├── model/        # JPA entities
        ├── repository/   # Spring Data repositories
        ├── security/     # JWT filter & utilities
        └── service/      # Business logic
```

## Installation

### Prerequisites

| Software | Version     | Notes              |
|----------|-------------|---------------------|
| Java JDK | 21          | Recommended         |
| MySQL    | 8.x         | Required            |
| Node.js  | 20+         | Required            |
| Git      | —           | Optional            |

### Backend Setup

```bash
cd pos-backend
```

Copy the example environment file and fill in real values (never commit this file):

```bash
cp src/main/resources/application-example.properties .env
```

Then set the following as real environment variables (or via your `.env` tooling of choice):

```
DB_URL=jdbc:mysql://localhost:3306/restaurant_pos?useSSL=false
DB_USERNAME=root
DB_PASSWORD=your_real_password
JWT_SECRET=a_long_random_string_at_least_32_characters
ADMIN_USERNAME=manager
ADMIN_PASSWORD=choose_a_strong_password
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:5174
```

Run the backend:

```bash
# macOS/Linux or Windows CMD
./mvnw spring-boot:run

# Windows PowerShell
.\mvnw spring-boot:run

# If Maven is installed globally
mvn spring-boot:run
```

The backend starts on `http://localhost:8080`. Wait for `Started PosBackendApplication` in the console.

### Frontend Setup

```bash
cd Frontend
npm install
npm run dev
```

The frontend starts on `http://localhost:5173`.

### Database Setup

Create the database — Spring Boot (Hibernate) will create all tables automatically on first run:

```sql
CREATE DATABASE restaurant_pos;
```

## Environment Variables

All secrets are read from environment variables — no credentials are hardcoded in the codebase.

| Variable          | Required | Description                                              |
|--------------------|----------|------------------------------------------------------------|
| `DB_URL`           | No       | JDBC URL (defaults to local MySQL on `restaurant_pos`)     |
| `DB_USERNAME`      | No       | Database username (defaults to `root`)                    |
| `DB_PASSWORD`      | **Yes**  | Database password — no default                            |
| `JWT_SECRET`       | **Yes**  | Signing key for JWTs, must be 32+ characters               |
| `ADMIN_USERNAME`   | **Yes**  | Username for the auto-created default admin account       |
| `ADMIN_PASSWORD`   | **Yes**  | Password for the auto-created default admin account        |
| `ALLOWED_ORIGINS`  | No       | Comma-separated CORS/WebSocket origins                     |
| `PORT`             | No       | Backend port (defaults to `8080`)                          |

See `pos-backend/src/main/resources/application-example.properties` for a template.

## How to Run

1. Start MySQL and create the `restaurant_pos` database.
2. Set the required environment variables (see above).
3. Start the backend: `./mvnw spring-boot:run` (from `pos-backend/`).
4. Start the frontend: `npm run dev` (from `Frontend/`).
5. Open `http://localhost:5173` in your browser.

## Default Demo Credentials

On first startup, the backend creates one administrator account using the `ADMIN_USERNAME` / `ADMIN_PASSWORD` environment variables you provide. There are **no hardcoded default credentials** — you must set these values yourself before running the app.

## Screenshots

_Add screenshots of the dashboard, tables view, kitchen display, and billing screen here._

## Future Improvements

- Automated test coverage (unit + integration)
- Multi-branch / multi-tenant support
- Printer integration for kitchen tickets and receipts
- Role granularity beyond a single ADMIN role
- Dockerized local development environment

## Deployment Instructions

1. **Build the backend:**
   ```bash
   cd pos-backend
   mvn clean package
   ```
2. **Build the frontend:**
   ```bash
   cd Frontend
   npm run build
   ```
3. Serve the built frontend (`Frontend/dist`) via your preferred method — either behind a reverse proxy (e.g. Nginx) that also proxies `/api` and `/ws-pos` to the backend, or by copying the build output into `pos-backend/src/main/resources/static` before packaging the backend as a single deployable jar.
4. Run the backend jar with production environment variables set (see [Environment Variables](#environment-variables)):
   ```bash
   java -jar target/pos-backend-*.jar
   ```
5. Ensure `ALLOWED_ORIGINS` matches your production frontend domain, and that `JWT_SECRET`, `DB_PASSWORD`, `ADMIN_USERNAME`, and `ADMIN_PASSWORD` are set to strong, unique production values (never reuse development secrets).

## License

This project is licensed under the [MIT License](LICENSE).
