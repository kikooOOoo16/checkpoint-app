# Checkpoint API

A secure checkpoint API and web application for workarea visitor registration and worker/administrator management.

## Overview

This project provides a comprehensive web interface to manage:

- **Visitor Registration**: Seamless registration for visitors entering the workarea.
- **Worker Management**: Workers can log in to track their attendance.
- **Administrator Controls**: Secure dashboard for administrators to create and manage worker and admin accounts.
- **Session Tracking**: Detailed history of login and logout events for all workers.

The application is built with Node.js, Express, and MongoDB, featuring a modern responsive UI.

## Features

- **Secure Authentication**: Password hashing using `bcrypt` (adaptive salt rounds).
- **Administrator Dashboard**: Dedicated interface for managing system access and creating new accounts.
- **JSON Schema Validation**: Strict request body validation using `ajv` with descriptive error messages.
- **Modern Responsive UI**:
    - Built with **Bootstrap 5.3**.
    - Professional **Dark Theme** consistency across all pages.
    - Smooth **Fade-in animations** for page transitions.
    - **Top-Middle Toast Notifications** for real-time success and error feedback.
- **Session Management**: Secure cookie-based sessions with navigation guards to prevent unauthorized access.
- **Detailed Session Tracking**: Tracks `loginTime` and `logoutTime` for every worker session in a dedicated history
  array.
- **Repository Pattern**: Clean data access layer abstraction for MongoDB.
- **Advanced Logging**: Namespace-based logger with colored output and trace ID tracking for enhanced observability.
- **Migration System**: Automated database setup and initial data seeding.

## Prerequisites

- **Node.js**: >= 20.x
- **MongoDB**: A running instance (local or remote)
- **Package Manager**: Yarn or NPM

## Setup

### 1. Environment Variables

Create a `.env` file in the root directory based on `.env.template`:

```env
PORT=8080
MONGODB_URL=mongodb://localhost:27017
MONGODB_DB_NAME=checkpoint_db
SESSION_SECRET=your_secure_session_secret
NODE_ENV=LOCAL
SYSTEM=SEED
```

### 2. Installation

```bash
npm install
# or
yarn install
```

### 3. Database Migration & Initialization

Run the migration scripts to create collections and seed the initial administrator account:

```bash
npm run migrate
```

*Note: This creates an initial admin: `admin@checkpoint.com` / `admin123`.*

Alternatively, you can create a custom administrator account interactively:

```bash
npm run create:admin
```

## Running the Application

### Development Mode (with hot-reload)

```bash
npm run server:watch
```

### Production Mode

```bash
npm run build
npm run start
```

## API Routes

### Public / Visitor Routes

- `GET /registration`: Visitor registration form.
- `POST /registration`: Submit visitor registration.
- `GET /login`: Worker login page.
- `POST /login`: Authenticate worker.

### Administrator Routes

- `GET /admin/login`: Administrator login page.
- `POST /admin/login`: Authenticate administrator.
- `GET /admin/dashboard`: Management dashboard (Admin only).
- `POST /admin/workers`: Create new worker or admin accounts (Admin only).

### Common Routes

- `GET /dashboard`: Landing page after successful worker login or visitor registration.
- `GET /logout`: Terminate session and record checkout time.
- `GET /health`: Basic health check endpoint (`/{SYSTEM}-api-health`).

## Project Structure

- `src/controller`: Route handlers and controllers (Routing-Controllers).
- `src/database`: MongoDB configuration, schemas (Entities), and Repositories.
- `src/middleware`: Custom middlewares including validation, auth guards, and error handling.
- `src/service`: Core business logic and authentication services.
- `src/logger`: log4js-based logging implementation.
- `scripts`: Administrative CLI tools (e.g., admin creation).
- `migration`: Versioned database migration scripts.
- `views`: EJS templates and partials.
- `public`: Static assets (CSS, Images, Client-side JS).

## Validation

All incoming requests are validated against JSON schemas located in `src/model/validation_schema/`. Error messages are
user-friendly and displayed directly via the UI's toast system.
