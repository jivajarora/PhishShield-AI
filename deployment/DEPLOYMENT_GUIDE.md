# Deployment Guide

## 1. Frontend (Vercel)
1. Push the repository to GitHub.
2. Log into Vercel and click "Add New Project".
3. Select this repository.
4. Set the Root Directory to `frontend`.
5. Framework Preset: `Vite`.
6. Build Command: `npm run build`
7. Install Command: `npm install`
8. Click Deploy.

## 2. Backend (Render.com)
1. Log into Render and click "New Web Service".
2. Connect your GitHub repository.
3. Set the Root Directory to `backend`.
4. Environment: `Python 3`.
5. Build Command: `pip install -r requirements.txt`.
6. Start Command: `uvicorn app:app --host 0.0.0.0 --port $PORT`.
7. Add Environment Variables: `MONGO_URI`.
8. Click Create Web Service.

## 3. Database (MongoDB Atlas)
1. Log into MongoDB Atlas and create a new Cluster.
2. Create a Database User and save the password.
3. Under Network Access, allow access from anywhere (`0.0.0.0/0`).
4. Click "Connect" -> "Connect your application" and copy the connection string.
5. Provide this connection string to your Render backend via environment variables.
