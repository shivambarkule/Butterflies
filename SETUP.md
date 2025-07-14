# 🚀 Student Exam Portal - Setup Guide

This guide will help you set up and run the Student Exam Portal project on your local machine.

## 📋 Prerequisites

Before you begin, make sure you have the following installed:

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **MongoDB** (v6 or higher) - [Download here](https://www.mongodb.com/try/download/community)
- **Git** - [Download here](https://git-scm.com/)
- **Firebase Account** (for authentication) - [Sign up here](https://firebase.google.com/)

## 🛠 Installation Steps

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd student-exam-portal
```

### 2. Install Dependencies

```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install

# Return to root
cd ..
```

### 3. Environment Setup

#### Backend Environment

1. Copy the environment template:
```bash
cd backend
cp env.example .env
```

2. Edit `.env` file with your configuration:
```env
# Server Configuration
NODE_ENV=development
PORT=5000
API_VERSION=v1

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/student-exam-portal

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your-refresh-token-secret
JWT_REFRESH_EXPIRES_IN=30d

# Firebase Configuration (Optional for now)
FIREBASE_PROJECT_ID=your-firebase-project-id
# ... other Firebase config

# CORS Configuration
CORS_ORIGIN=http://localhost:3000
CORS_CREDENTIALS=true
```

#### Frontend Environment

1. Create environment file:
```bash
cd frontend
touch .env
```

2. Add the following to `.env`:
```env
VITE_API_URL=http://localhost:5000/api/v1
VITE_FIREBASE_API_KEY=your-firebase-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

### 4. Database Setup

1. Start MongoDB:
```bash
# On Windows
"C:\Program Files\MongoDB\Server\6.0\bin\mongod.exe"

# On macOS/Linux
mongod
```

2. Create database and seed data (optional):
```bash
cd backend
npm run seed
```

### 5. Firebase Setup (Optional)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Authentication (Email/Password, Google)
4. Get your configuration from Project Settings
5. Update the frontend `.env` file with your Firebase config

## 🚀 Running the Application

### Development Mode

From the root directory:

```bash
# Start both frontend and backend
npm run dev

# Or start them separately:
npm run dev:frontend  # Frontend on http://localhost:3000
npm run dev:backend   # Backend on http://localhost:5000
```

### Production Build

```bash
# Build both applications
npm run build

# Start production servers
npm start
```

## 📱 Accessing the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Documentation**: http://localhost:5000/api-docs
- **Health Check**: http://localhost:5000/health

## 🧪 Testing the Setup

### 1. Backend Health Check

Visit `http://localhost:5000/health` - you should see:
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 123.456,
  "environment": "development"
}
```

### 2. API Documentation

Visit `http://localhost:5000/api-docs` to see the interactive API documentation.

### 3. Frontend Landing Page

Visit `http://localhost:3000` to see the beautiful landing page with glassmorphism effects.

## 🔧 Development Workflow

### Backend Development

```bash
cd backend

# Run in development mode with auto-reload
npm run dev

# Run tests
npm test

# Lint code
npm run lint

# Fix linting issues
npm run lint:fix
```

### Frontend Development

```bash
cd frontend

# Run in development mode
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type checking
npm run type-check
```

## 📁 Project Structure

```
student-exam-portal/
├── frontend/                 # React + TypeScript frontend
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── services/       # API and Firebase services
│   │   ├── styles/         # Global styles and themes
│   │   └── utils/          # Utility functions
│   ├── public/             # Static assets
│   └── package.json
├── backend/                 # Node.js + Express backend
│   ├── src/
│   │   ├── controllers/    # Route controllers
│   │   ├── models/         # MongoDB schemas
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Custom middleware
│   │   ├── services/       # Business logic
│   │   └── utils/          # Utility functions
│   ├── uploads/            # File uploads
│   ├── logs/               # Application logs
│   └── package.json
├── docs/                   # Documentation
├── package.json            # Root package.json
└── README.md
```

## 🐛 Troubleshooting

### Common Issues

#### 1. Port Already in Use

If you get "port already in use" errors:

```bash
# Find processes using the port
lsof -i :3000  # For frontend
lsof -i :5000  # For backend

# Kill the process
kill -9 <PID>
```

#### 2. MongoDB Connection Issues

```bash
# Check if MongoDB is running
mongo --eval "db.runCommand('ping')"

# Start MongoDB if not running
mongod
```

#### 3. Node Modules Issues

```bash
# Clear node modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### 4. TypeScript Errors

```bash
# Check TypeScript configuration
cd frontend
npx tsc --noEmit

# Or for backend
cd backend
npx tsc --noEmit
```

### Environment Variables

Make sure all required environment variables are set:

- Backend: Check `backend/.env`
- Frontend: Check `frontend/.env`

### Database Issues

```bash
# Reset database (WARNING: This will delete all data)
cd backend
npm run seed -- --reset

# Check database connection
mongo student-exam-portal --eval "db.stats()"
```

## 🔒 Security Considerations

1. **Never commit `.env` files** - they're in `.gitignore`
2. **Use strong JWT secrets** - generate random strings
3. **Enable HTTPS in production**
4. **Set up proper CORS** for your domain
5. **Use environment-specific configurations**

## 📊 Monitoring & Logs

### Backend Logs

```bash
# View logs
tail -f backend/logs/app.log
tail -f backend/logs/error.log
```

### Frontend Logs

Check browser console for frontend logs and errors.

## 🚀 Deployment

### Frontend (Vercel/Netlify)

```bash
cd frontend
npm run build
# Deploy the dist/ folder
```

### Backend (Railway/Heroku)

```bash
cd backend
npm run build
# Deploy the dist/ folder
```

## 📞 Support

If you encounter any issues:

1. Check the troubleshooting section above
2. Review the logs for error messages
3. Ensure all prerequisites are installed
4. Verify environment variables are set correctly
5. Check that MongoDB is running

## 🎉 Next Steps

Once the application is running:

1. **Explore the API**: Visit `http://localhost:5000/api-docs`
2. **Test Authentication**: Try registering and logging in
3. **Create Exams**: Use the admin interface to create sample exams
4. **Customize**: Modify the UI components and styling
5. **Add Features**: Implement additional functionality

---

Happy coding! 🚀 