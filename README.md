# Asset Management System (AMS)

**AMS** is a full-stack web application designed for the secure tracking and management of defense assets across multiple military bases. It provides real-time inventory visibility, facilitates asset transfers, and enforces strict Role-Based Access Control (RBAC) to maintain operational security.

---

## Features

* **Real-time Dashboard:** Monitor stock levels across various commands.
* **Secure Transfers:** ACID-compliant asset movements between bases.
* **Audit Trails:** Immutable ledger recording every transaction (Who, What, Where, When).
* **RBAC Security:** Granular access levels for Commanders, Logistics officers, and Admins.
* **Automated Docs:** Built-in Swagger UI for API exploration.

---

## Tech Stack

### Backend

* **FastAPI (Python):** High-performance asynchronous framework with automatic OpenAPI documentation.
* **SQLAlchemy:** ORM for clean relational data management.
* **SQLite:** Chosen for portability and zero-configuration setup in a demonstration environment.
* **JWT (JSON Web Tokens):** For secure, stateless authentication.

### Frontend

* **React (Vite + TypeScript):** Modern, type-safe component architecture.
* **Tailwind CSS:** Professional utility-first styling for a tactical UI.

---

## Data Model & RBAC

The system manages five core entities: `Users`, `BaseLocation`, `AssetType`, `Inventory`, and `Transactions`.

### Role-Based Access Control

Access is strictly enforced via JWT claims and dependency injection at the API level.

| Role | Access Level | Capabilities |
| --- | --- | --- |
| **Admin** | Global Access | Full system-wide visibility; move assets between any bases. |
| **Commander** | Base-Specific | View dashboard and initiate transfers *from* their assigned base only. |
| **Logistics** | Transfer Only | Restricted view; specifically for moving stock without strategic data access. |

---

## Setup Instructions

### Prerequisites

* Python 3.10+
* Node.js 18+

### Step 1: Backend Setup

```bash
cd backend
# Install dependencies
pip install fastapi uvicorn sqlalchemy pydantic python-jose passlib python-multipart
# Initialize and seed the database
python seed.py
# Start the server
uvicorn main:app --reload --port 8001

```

### Step 2: Frontend Setup

```bash
cd frontend
npm install
npm run dev

```

### Step 3: Access

Navigate to `http://localhost:5173` in your browser.

---

## Test Credentials

Use these pre-seeded accounts to test the different access levels:

| Role | Username | Password | Assigned Base |
| --- | --- | --- | --- |
| **Admin** | `admin` | `admin123` | Global |
| **Commander** | `cmdr_north` | `pass123` | HQ Northern Command (J&K) |
| **Logistics** | `log_west` | `pass123` | INS Hamla (Mumbai) |

---
## Limitations & Assumptions
* **Environment:** Designed for trusted intranet or offline environments.
* **Concurrency:** SQLite is used for portability; for high-concurrency production, migration to PostgreSQL is recommended.
* **Sessions:** Tokens expire after 30 minutes for security purposes.
---
