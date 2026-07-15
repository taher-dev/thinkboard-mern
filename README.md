# ThinkBoard MERN

A modern, full-stack note-taking application built with the MERN stack (MongoDB, Express, React, Node.js). 

## 🚀 Features

- **Create, Read, Update, Delete (CRUD) Notes:** Fully functional note management.
- **Responsive UI:** Built with Tailwind CSS and DaisyUI for a beautiful and responsive user experience.
- **Rate Limiting:** Integrated API rate limiting using Upstash Redis to prevent abuse.
- **Modern React:** Utilizes React 19, Vite, and React Router for fast performance and routing.

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 19 + Vite
- **Styling:** Tailwind CSS + DaisyUI
- **Icons:** Lucide React
- **Routing:** React Router
- **HTTP Client:** Axios
- **Notifications:** React Hot Toast

### Backend
- **Runtime:** Node.js
- **Framework:** Express
- **Database:** MongoDB (via Mongoose)
- **Caching/Rate Limiting:** Upstash Redis & `@upstash/ratelimit`
- **Environment Management:** dotenv

## 📦 Project Structure

```text
mern-thinkboard/
├── backend/            # Express server and API routes
│   ├── src/
│   │   ├── config/     # Database and Redis config
│   │   ├── controllers/# API logic
│   │   ├── middleware/ # Custom middlewares (e.g., rate limiting)
│   │   ├── models/     # Mongoose schemas
│   │   ├── routes/     # Express routes
│   │   └── server.js   # Server entry point
│   └── package.json
├── frontend/           # React frontend application
│   ├── src/
│   │   ├── components/ # Reusable UI components
│   │   ├── pages/      # Page views (Home, Create, Detail)
│   │   ├── App.jsx     # Main React component
│   │   └── main.jsx    # Frontend entry point
│   └── package.json
└── package.json        # Root package for deployment scripts
```

## ⚙️ Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB instance (local or Atlas)
- Upstash Redis account (for rate limiting)

### Environment Variables

Create a `.env` file in the `backend/` directory with the following variables:

```env
MONGO_URI=your_mongodb_connection_string
PORT=5001

# Upstash Redis Configuration for Rate Limiting
UPSTASH_REDIS_REST_URL=your_upstash_redis_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_token

NODE_ENV=development
```

### Installation & Running Locally

1. **Clone the repository**
   ```bash
   git clone https://github.com/taher-dev/thinkboard-mern.git
   cd mern-thinkboard
   ```

2. **Install Dependencies**
   From the root directory, run:
   ```bash
   # This installs both frontend and backend dependencies
   npm run build
   ```
   *(Note: The root `build` script in `package.json` handles installing dependencies for both folders and building the frontend)*

3. **Start the Development Servers**
   Open two terminal windows:

   **Terminal 1 (Backend):**
   ```bash
   cd backend
   npm run dev
   ```

   **Terminal 2 (Frontend):**
   ```bash
   cd frontend
   npm run dev
   ```

   The frontend will typically run on `http://localhost:5173` and the backend on `http://localhost:5001`.

## 📜 Scripts (Root Directory)

- `npm run build`: Installs dependencies for both `frontend` and `backend`, then builds the `frontend` for production.
- `npm start`: Starts the `backend` server (useful for production deployment).

## 📄 License
This project is licensed under the [MIT License](LICENSE).
