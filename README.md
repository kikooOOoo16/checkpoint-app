# Checkpoint API

A simple checkpoint API and web application for workarea visitor registration and worker login/checkout.

## Overview

This project provides a web interface (using EJS templates) to manage:

- **Visitor Registration**: Visitors can register their details when entering the workarea.
- **Worker Login/Checkout**: Workers (pre-registered by an admin) can log in, track their last login time, and log out.

The application uses MongoDB for data persistence and a custom logging system for observability.

## Features

- **Responsive UI**: EJS-based templates for Registration, Login, and Dashboard.
- **Session Management**: Worker accounts maintain a session after login.
- **Repository Pattern**: Abstracted data access layer using MongoDB.
- **Custom Logger**: Namespace-based logger with colored output for different log levels (DEBUG, INFO, WARN, ERROR).
- **Migration System**: Automated MongoDB collection setup.
- **Health Checks**: Standard health endpoint for monitoring.

## Prerequisites

- Node.js (>= 20.x)
- Yarn or NPM
- MongoDB instance

## Setup

### 1. Environment Variables

Create a `.env` file in the root directory (you can use `.env.template` as a starting point):

```env
PORT=8080
MONGODB_URL=mongodb://localhost:27017
MONGODB_DB_NAME=checkpoint_db
SESSION_SECRET=your_session_secret
NODE_ENV=LOCAL
```

### 2. Installation

```bash
yarn install
# or
npm install
```

### 3. Database Migration

Run the migration script to create the necessary MongoDB collections (`visitors` and `workers`):

```bash
npm run migrate
```

## Running the Application

### Development Mode (with hot-reload)

```bash
yarn server:watch
# or
npm run server:watch
```

### Production Mode

```bash
npm run build
npm run start
```

## API Routes

- `GET /registration`: Shows the visitor registration form.
- `POST /registration`: Handles visitor registration.
- `GET /login`: Shows the worker login form.
- `POST /login`: Handles worker login.
- `GET /dashboard`: Displays the dashboard after successful registration or login.
- `GET /logout`: Logs out the current worker and redirects to login.
- `GET /health`: Basic health check endpoint (e.g., `/SEED-api-health` depending on the `SYSTEM` environment variable).

## Project Structure

- `src/controller`: Request handlers and route definitions using `routing-controllers`.
- `src/database`: MongoDB connection logic, repositories, and entities.
- `src/service`: Business logic layer.
- `src/logger`: Custom logging implementation based on `log4js`.
- `views`: EJS templates for the UI.
- `migration`: Database migration scripts.
