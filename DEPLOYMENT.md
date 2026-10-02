# Frontend Deployment Guide — Vercel

## Overview

The React + TypeScript frontend is configured for deployment to **Vercel** with production API calls to a **Render backend**.

## Environment Configuration

### VITE_API_URL

- **What it is:** Base URL for the backend API
- **Where it goes:** Vercel environment variables (Settings → Environment Variables)
- **Development value:** `http://localhost:3000/api`
- **Production value:** `https://your-render-backend.onrender.com/api`
- **Visibility:** ⚠️ PUBLIC (exposed to browser) — do NOT include secrets
- **Set in:** Vercel project settings, NOT in source code

### Example Vercel Environment Setup

```
VITE_API_URL=https://rejoice-cakes-api.onrender.com/api
```

Replace `rejoice-cakes-api` with your actual Render service name.

## Local Development

```bash
npm install
echo 'VITE_API_URL=http://localhost:3000/api' > .env.local
npm run dev
```

Backend must be running on `http://localhost:3000`.

## Production Build

```bash
npm install
npm run build
npm run preview  # Preview optimized build locally
```

Output: `dist/` folder (deploy this to Vercel)

## Vercel Deployment Steps

### 1. Connect Repository
1. Go to https://vercel.com
2. Click "New Project"
3. Import your GitHub/GitLab/Bitbucket repository

### 2. Configure Project
- **Framework:** Vite (auto-detected)
- **Build Command:** `npm run build` (auto-filled)
- **Output Directory:** `dist` (auto-filled)

### 3. Set Environment Variable
In Vercel dashboard → Environment Variables:
```
VITE_API_URL=https://your-render-backend.onrender.com/api
```
Replace with your actual Render backend URL (must include `/api`)

### 4. Deploy
- Click "Deploy"
- Vercel builds and deploys automatically
- Get your live frontend URL: `https://your-app.vercel.app`

### 5. Update Backend FRONTEND_URL
After frontend is deployed, update your Render backend environment:
```
FRONTEND_URL=https://your-app.vercel.app
```
(without trailing `/api` — this is the domain only)

### 6. Test Deployment
Open `https://your-app.vercel.app` in browser:
- Application loads
- Network requests go to Render backend
- Login works
- Cookies are sent with requests
- Products load
- Cart works
- Order requests succeed

## Security

✅ **What's protected:**
- CORS: Enforced on backend (only Vercel origin allowed)
- CSRF: Token-based protection on state-changing requests
- Cookies: HttpOnly, Secure, SameSite=None (cross-site)
- Auth: JWT in HttpOnly cookies (JavaScript cannot access)

⚠️ **What's NOT secret:**
- `VITE_API_URL` is visible to browsers (intentional)
- API keys/secrets MUST stay on backend (Render environment)
- Never put JWT_SECRET or database credentials in frontend

## Verification

After deployment:

```bash
# Check build was successful
npm run build

# Check types
npx tsc --noEmit

# Check for vulnerabilities
npm audit --audit-level=high
```

All should pass with 0 errors.

## Common Issues

### CORS errors
- Backend `FRONTEND_URL` must match exact Vercel domain (e.g., `https://myapp.vercel.app`)
- Check backend is running and accessible
- Verify `VITE_API_URL` is correct in Vercel environment

### Cookies not persisting
- Backend cookies require `Secure: true` (HTTPS only)
- SameSite=None requires Secure flag
- Development uses SameSite=Lax, production uses SameSite=None

### Build fails
- Run `npm install` first
- Check Node version (16+ recommended)
- Ensure no `.env` file is committed (use Vercel settings instead)

## Next

See backend DEPLOYMENT.md for server-side configuration.
