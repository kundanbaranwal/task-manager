# Intern Assignment - MERN Stack

This project contains a full-stack application with a React frontend and a Node.js/Express backend.

## Project Structure

- `client`: React frontend (Vite)
- `server`: Node.js backend (Express + MongoDB)

## Prerequisites

- Node.js installed
- MongoDB installed and running locally (or update `MONGO_URI` in `server/.env`)

## Setup & Run

### 1. Backend (Server)

Navigate to the `server` folder and install dependencies:

```bash
cd server
npm install
```

Create a `.env` file in the `server` folder (if not exists) with the following content:

```
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/intern-assignment
JWT_SECRET=secret123
```

Start the server:

```bash
npm run dev
```

The server will run on `http://localhost:5000`.

### 2. Frontend (Client)

Open a new terminal, navigate to the `client` folder and install dependencies:

```bash
cd client
npm install
```

Start the frontend development server:

```bash
npm run dev
```

The frontend will run on `http://localhost:5173` (or similar).

## Features

- **Authentication**: Register and Login users (JWT).
- **Role-Based Access**: Users have roles (user/admin).
- **CRUD**: Create, Read, Update, Delete tasks.
- **Protected Routes**: Dashboard is protected and requires login.

## API Endpoints

- `POST /api/auth/register`: Register a new user
- `POST /api/auth/login`: Login user
- `GET /api/auth/me`: Get current user info
- `GET /api/tasks`: Get all tasks for logged-in user
- `POST /api/tasks`: Create a new task
- `PUT /api/tasks/:id`: Update a task
- `DELETE /api/tasks/:id`: Delete a task
