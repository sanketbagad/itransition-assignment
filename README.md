# Drug Inventory Management System

A full-stack application for managing drug inventory with React frontend and Node.js/Express backend.

**✅ Now with Husky pre-commit hooks for code quality!**

## Project Structure

```
├── frontend/          # React + TypeScript + Vite frontend
├── backend/           # Node.js + Express + TypeScript backend
├── package.json       # Root package.json with workspace configuration
└── README.md         # This file
```

## Prerequisites

- Node.js (v18 or higher)
- npm (v8 or higher)

## Getting Started

### Install Dependencies

```bash
# Install root dependencies and all workspace dependencies
npm run install:all
```

### Development Mode

Run both frontend and backend simultaneously:

```bash
npm run dev
```

This will start:
- Frontend development server on `http://localhost:5173`
- Backend development server on `http://localhost:3000`

### Individual Development Servers

Run frontend only:
```bash
npm run dev:frontend
```

Run backend only:
```bash
npm run dev:backend
```

### Production Build

Build both applications:
```bash
npm run build
```

Build individually:
```bash
npm run build:frontend  # Build frontend
npm run build:backend   # Build backend
```

### Production Mode

Start both applications in production mode:
```bash
npm run start
```

This will start:
- Frontend preview server
- Backend production server

### Testing

Run backend tests:
```bash
npm run test
```

Run frontend linting:
```bash
npm run test:frontend
```

### Cleanup

Remove all node_modules and build directories:
```bash
npm run clean
```

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start both frontend and backend in development mode |
| `npm run dev:frontend` | Start only frontend development server |
| `npm run dev:backend` | Start only backend development server |
| `npm run build` | Build both applications for production |
| `npm run start` | Start both applications in production mode |
| `npm run test` | Run backend tests |
| `npm run install:all` | Install dependencies for all workspaces |
| `npm run clean` | Clean all node_modules and build directories |

## Development Workflow

1. Clone the repository
2. Run `npm run install:all` to install all dependencies
3. Run `npm run dev` to start both servers
4. Open `http://localhost:5173` for the frontend
5. Backend API will be available at `http://localhost:3000`

## Environment Variables

Create `.env` files in the respective directories:

### Backend (.env)
```
PORT=3000
NODE_ENV=development
# Add other backend environment variables
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:3000
# Add other frontend environment variables
```