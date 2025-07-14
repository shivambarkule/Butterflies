# 🦋 Student Exam Portal

A modern, engaging, and gamified student exam portal built with React + TypeScript frontend and Node.js + Express + MongoDB backend. Features stunning glassmorphism UI, real-time interactions, and comprehensive exam management.

## ✨ Features

### 🎨 Frontend (React + TypeScript)
- **Glassmorphism UI**: Iridescent glass effects, vibrant gradients, and soft blurs
- **Dynamic Animations**: Framer Motion powered interactions and micro-animations
- **Responsive Design**: Mobile-first approach with tablet and desktop optimization
- **Authentication**: Firebase integration with email, Google, and phone auth
- **Gamification**: XP system, badges, levels, streaks, and leaderboards
- **Real-time Features**: Live notifications, chat, and collaborative study rooms
- **Accessibility**: High contrast, keyboard navigation, and screen reader support

### 🔧 Backend (Node.js + Express + MongoDB)
- **RESTful API**: Well-documented endpoints with Swagger/OpenAPI
- **Authentication**: JWT-based with role-based access control
- **Real-time**: Socket.io for live updates and notifications
- **Gamification Engine**: XP calculation, badge system, and leaderboards
- **Security**: Rate limiting, input validation, and audit logging
- **Scalable**: MongoDB with Mongoose for efficient data management

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- MongoDB 6+
- Firebase project (for authentication)

### Installation

1. **Clone and install dependencies**
```bash
git clone <repository-url>
cd student-exam-portal
npm run install:all
```

2. **Environment Setup**
```bash
# Backend environment
cp backend/.env.example backend/.env
# Frontend environment  
cp frontend/.env.example frontend/.env
```

3. **Start Development Servers**
```bash
npm run dev
```

This will start:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

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
│   └── public/             # Static assets
├── backend/                 # Node.js + Express backend
│   ├── src/
│   │   ├── controllers/    # Route controllers
│   │   ├── models/         # MongoDB schemas
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Custom middleware
│   │   ├── services/       # Business logic
│   │   └── utils/          # Utility functions
│   └── docs/               # API documentation
└── docs/                   # Project documentation
```

## 🎯 Core Features

### Student Experience
- **Dashboard**: Personalized overview with upcoming exams, progress tracking, and motivational widgets
- **Exam Taking**: Full-screen, distraction-free mode with animated timer and progress tracking
- **Results**: Immediate feedback with confetti animations and detailed performance analytics
- **Profile**: Customizable avatar, achievement badges, and comprehensive exam history
- **Social**: Friend system, collaborative study rooms, and live chat during exams

### Admin Features
- **Exam Management**: Create, edit, and schedule exams with various question types
- **Student Management**: Monitor student progress, manage accounts, and view analytics
- **Analytics**: Comprehensive reporting with charts and performance metrics
- **Content Management**: Question bank, course materials, and resource management

## 🛠 Tech Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** with custom glassmorphism theme
- **Framer Motion** for animations
- **Firebase** for authentication and real-time features
- **React Query** for state management
- **React Router** for navigation

### Backend
- **Node.js** with Express
- **MongoDB** with Mongoose ODM
- **Socket.io** for real-time features
- **JWT** for authentication
- **Swagger/OpenAPI** for API documentation
- **Joi** for validation
- **Multer** for file uploads

## 🎨 Design System

The portal features a modern glassmorphism design with:
- **Iridescent gradients** and glass effects
- **Vibrant color palette** appealing to Gen Z
- **Smooth animations** and micro-interactions
- **Dark/Light mode** with animated transitions
- **Responsive design** for all devices

## 🔒 Security Features

- JWT-based authentication with refresh tokens
- Role-based access control (Student/Admin)
- Rate limiting and input validation
- Secure file uploads
- Audit logging for sensitive operations
- CORS configuration
- Helmet.js for security headers

## 📊 API Documentation

Once the backend is running, visit:
- Swagger UI: http://localhost:5000/api-docs
- API Base URL: http://localhost:5000/api/v1

## 🚀 Deployment

### Frontend (Vercel/Netlify)
```bash
cd frontend
npm run build
```

### Backend (Railway/Heroku)
```bash
cd backend
npm run build
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

MIT License - see LICENSE file for details

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation in `/docs`
- Review the API documentation at `/api-docs`

---

Built with ❤️ for modern education 