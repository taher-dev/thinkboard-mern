# ThinkBoard MERN

A modern, full-stack, secure note-taking application built with the MERN stack (MongoDB, Express, React 19, Node.js), featuring **Google OAuth 2.0 Single Sign-On**, **Guest Account Mode**, **Automatic Guest-to-Google Note Migration**, and **Strict Per-User Note Isolation**.

**[Live Demo](https://thinkboard-mern-t87j.onrender.com)** (Hosted on Render)

![ThinkBoard Thumbnail](./frontend/src/assets/thinkboard-thumbnail.png)

---

## 🚀 Key Features

- **🔐 Google OAuth 2.0 & Guest Authentication**:
  - Sign in seamlessly using Google OAuth 2.0 with the modern custom Google Sign-In interface.
  - **Guest Mode**: Instant trial without requiring an account or email.
- **🔄 Automatic Note Migration**:
  - Transfer and merge all temporary guest notes into a Google account when upgrading to Google Sign-In.
- **🛡️ Per-User Data Isolation & Security**:
  - Notes are strictly isolated per user in MongoDB.
  - Protected API routes enforced with JSON Web Tokens (JWT) middleware to ensure users can only view, edit, and delete their own private notes.
- **🎨 Modern Aesthetic & Mobile Responsive**:
  - Vibrant dark-mode glassmorphism interface built with React 19, Tailwind CSS, DaisyUI, and Lucide React icons.
  - Minimalist Navbar with an animated profile avatar dropdown displaying full Google ID details and single-click logout.
  - Fully responsive design tailored for mobile viewports (320px+), tablets, and desktop displays.
- **⚡ Fail-Open Rate Limiting**:
  - Integrated API rate limiting with Upstash Redis and fail-open error handling to prevent API abuse without impacting uptime.

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 19 + Vite 8
- **Authentication:** `@react-oauth/google`
- **Styling:** Tailwind CSS + DaisyUI
- **Icons:** Lucide React
- **Routing:** React Router v7
- **HTTP Client:** Axios (with automatic JWT Authorization interceptors)
- **Notifications:** React Hot Toast

### Backend
- **Runtime:** Node.js (v18+)
- **Framework:** Express.js
- **Database:** MongoDB (via Mongoose ORM)
- **Tokens & Auth:** JSON Web Tokens (`jsonwebtoken`), `google-auth-library`
- **Rate Limiting:** Upstash Redis (`@upstash/ratelimit`, `@upstash/redis`)

---

## 📦 Project Structure

```text
mern-thinkboard/
├── backend/                  # Express API server
│   ├── src/
│   │   ├── config/           # Database connection & Redis rate limiter setup
│   │   ├── controllers/      # Authentication & Notes CRUD logic
│   │   ├── middleware/       # JWT protection & rate-limiting middleware
│   │   ├── models/           # User & Note Mongoose schemas
│   │   ├── routes/           # Auth and Notes route definitions
│   │   └── server.js         # Server initialization & production static file serving
│   ├── .env                  # Backend environment variables
│   └── package.json
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── assets/           # Images & graphics
│   │   ├── components/       # Navbar, NoteCard, ProtectedRoute, etc.
│   │   ├── context/          # AuthContext managing user sessions & OAuth state
│   │   ├── pages/            # LoginPage, HomePage, CreatePage, NoteDetailPage
│   │   ├── lib/              # Axios instance configuration
│   │   ├── App.jsx           # Main routing & application layout
│   │   └── main.jsx          # React DOM entry point with Google OAuth Provider
│   ├── .env                  # Frontend environment variables (VITE_GOOGLE_CLIENT_ID)
│   └── package.json
└── package.json              # Root package for production build and start scripts
```

---

## ⚙️ Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **MongoDB**: Local MongoDB instance or MongoDB Atlas Cluster
- **Google Cloud Console Account**: For Google OAuth 2.0 Client ID

---

### Environment Setup

#### 1. Backend Environment Variables (`backend/.env`)
Create a `.env` file in the `backend/` directory:

```env
PORT=5001
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/thinkboard?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_here
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com

# Optional: Upstash Redis Rate Limiting Configuration
UPSTASH_REDIS_REST_URL=https://your-redis-url.upstash.io
UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_token

NODE_ENV=development
```

#### 2. Frontend Environment Variables (`frontend/.env`)
Create a `.env` file in the `frontend/` directory:

```env
VITE_GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
```

---

### Installation & Running Locally

1. **Clone the Repository**
   ```bash
   git clone https://github.com/taher-dev/thinkboard-mern.git
   cd mern-thinkboard
   ```

2. **Install Dependencies**
   Run from the root directory to install dependencies for both frontend and backend:
   ```bash
   npm run build
   ```
   *Or install individually:*
   ```bash
   npm install --prefix backend
   npm install --prefix frontend
   ```

3. **Start Development Servers**
   Open two terminal windows to run both servers concurrently:

   **Terminal 1 (Backend Server):**
   ```bash
   cd backend
   npm run dev
   ```

   **Terminal 2 (Frontend Server):**
   ```bash
   cd frontend
   npm run dev
   ```

   - **Frontend App**: `http://localhost:5173`
   - **Backend API**: `http://localhost:5001/api`

---

## 🔑 Google OAuth Setup Guide

1. Navigate to the [Google Cloud Console Credentials Page](https://console.cloud.google.com/apis/credentials).
2. Create an **OAuth 2.0 Client ID** (Application type: **Web application**).
3. Add **Authorized JavaScript Origins**:
   - `http://localhost:5173`
   - `https://your-production-app.onrender.com`
4. Add **Authorized Redirect URIs**:
   - `http://localhost:5173`
   - `https://your-production-app.onrender.com`
5. Set your Client ID in `frontend/.env` (`VITE_GOOGLE_CLIENT_ID`) and `backend/.env` (`GOOGLE_CLIENT_ID`).

---

## 📡 API Endpoints

### Authentication Routes (`/api/auth`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/guest` | Public | Initializes a temporary guest account |
| `POST` | `/api/auth/google` | Public | Authenticates Google user & merges guest notes |
| `GET` | `/api/auth/me` | Protected | Fetches current logged-in user details |

### Notes Routes (`/api/notes`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/notes` | Protected | Fetches all notes belonging to current user |
| `GET` | `/api/notes/:id` | Protected | Fetches a specific note by ID (owner check) |
| `POST` | `/api/notes` | Protected | Creates a new note for current user |
| `PUT` | `/api/notes/:id` | Protected | Updates an existing note (owner check) |
| `DELETE` | `/api/notes/:id` | Protected | Deletes a note (owner check) |

---

## 🚀 Production Deployment (Render)

1. Create a new **Web Service** on [Render](https://render.com) linked to your repository.
2. Configure build settings:
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`
3. Configure Environment Variables in Render Dashboard:
   - `MONGO_URI`
   - `JWT_SECRET`
   - `GOOGLE_CLIENT_ID`
   - `VITE_GOOGLE_CLIENT_ID`
   - `NODE_ENV=production`

---

## 📄 License
This project is open source and available under the [MIT License](LICENSE).
