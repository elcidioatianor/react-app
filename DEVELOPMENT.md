# Development Guide

## Project Overview
This is a React + Node.js e-commerce application (Dubaning) with:
- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: Express.js + Sequelize ORM + SQLite

## Prerequisites
- Node.js v18 or higher
- Yarn (recommended) or npm

## Getting Started

### Backend Setup
```bash
cd backend
yarn install
yarn dev
```

The backend server will start on `http://localhost:3001` with hot-reload enabled via Nodemon.

**Important**: Always use `yarn dev` for development. Don't run `node app.js` directly, as `yarn dev` properly uses the `server.js` entry point which handles the Express setup correctly.

### Frontend Setup
```bash
cd frontend
yarn install
yarn dev
```

The frontend dev server will start on `http://localhost:5173` (or next available port if 5173 is in use).

## Available Scripts

### Frontend
- `yarn dev` - Start development server with hot reload
- `yarn build` - Build for production
- `yarn lint` - Run ESLint checks
- `yarn preview` - Preview production build locally
- `yarn format` - Format code with Prettier

### Backend
- `yarn dev` - Start development server with hot reload (Nodemon)
- `yarn start` - Start production server
- `yarn sequelize` - Run Sequelize CLI commands
- `yarn lint` - Run ESLint checks
- `yarn format` - Format code with Prettier

## Development Workflow

1. **Terminal 1 - Backend**:
   ```bash
   cd backend
   yarn dev
   ```

2. **Terminal 2 - Frontend**:
   ```bash
   cd frontend
   yarn dev
   ```

3. **Terminal 3 - Optional (for git operations)**:
   ```bash
   # Run git commands as needed
   git add .
   git commit -m "feature: description"
   git push origin main-dev
   ```

## Environment Variables

### Backend (.env)
- `PORT` - Server port (default: 3001)
- `NODE_ENV` - Environment (development/production)
- `JWT_SECRET` - JWT signing secret
- `JWT_REFRESH_SECRET` - Refresh token secret
- `SMTP_*` - Email configuration for password reset
- `FRONTEND_URL` - Frontend URL for CORS and redirects

### Frontend (Vite Env)
- `VITE_API_URL` - Backend API base URL (configured via proxy in vite.config.js)

## API Proxy Configuration

The frontend uses Vite proxy to forward API requests to the backend:
- `/auth/*` → `http://localhost:3001/auth`
- `/api/*` → `http://localhost:3001/api`
- `/products*` → `http://localhost:3001/products`
- `/orders*` → `http://localhost:3001/orders`
- `/chat*` → `http://localhost:3001/chat`
- `/stores*` → `http://localhost:3001/stores`

## Debugging

### Backend Logs
Errors and important logs are printed to console. Look for:
- `=== REQUEST INTERCEPTOR ===` - API request details
- `=== LOGIN REQUEST ===` - Login flow debugging
- Error messages with stack traces

### Frontend Console
Browser DevTools Console shows:
- `=== REQUEST INTERCEPTOR ===` - Request details including tokens
- `=== RESPONSE INTERCEPTOR ===` - Response and token capture
- `=== LOGIN FORM SUBMIT ===` - Login form submission
- `=== LOGIN FUNCTION ===` - Login API call details

## Common Issues

### Backend Won't Start
- Ensure you're running `yarn dev` not `node app.js`
- Check that port 3001 is not in use: `netstat -ano | findstr :3001`
- Verify `server.js` and `app.js` exist in backend directory

### Frontend Connection Issues
- Verify backend is running on port 3001
- Check browser console for CORS errors
- Ensure vite.config.js proxy settings are correct

### Authentication Fails
- Check that access token is being captured from login response
- Verify Authorization header is being sent with requests
- Look for token expiration messages in console

## Git Workflow

All development should be on the `main-dev` branch:
```bash
git checkout main-dev
git pull origin main-dev
# Make changes
git add .
git commit -m "type: description"
git push origin main-dev
```

## Project Structure

```
├── backend/
│   ├── config/          # Configuration files
│   ├── controllers/     # Route controllers
│   ├── database/        # Sequelize models and migrations
│   ├── routes/          # API routes
│   ├── app.js          # Express app setup
│   ├── server.js       # Server entry point
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable React components
│   │   ├── contexts/    # React Context providers
│   │   ├── hooks/       # Custom React hooks
│   │   ├── layouts/     # Layout components
│   │   ├── pages/       # Page components
│   │   ├── services/    # API and utility services
│   │   └── App.jsx      # Main app component
│   ├── vite.config.js
│   └── package.json
│
└── DEVELOPMENT.md       # This file
```

## Next Steps for Future Development
- Use `yarn` exclusively for consistency
- Always run `yarn dev` for backend development (not `node app.js`)
- Keep this guide updated with new commands or setup steps
- Document any new environment variables
- Add troubleshooting section as new issues emerge
