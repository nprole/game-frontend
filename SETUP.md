# GEO Trivia Game Frontend Setup Guide

## Prerequisites

1. **Node.js Installation**
   - Install Node.js 18+ from [nodejs.org](https://nodejs.org/)
   - Verify installation: `node --version` and `npm --version`

2. **Backend Setup**
   - Make sure the backend server is running on `http://localhost:3000`
   - Follow the backend setup guide in the `game-backend` directory

## Project Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm start
   ```

3. **Access the Application**
   - Open your browser and navigate to `http://localhost:4200`
   - The application will automatically reload when you make changes

## Build and Deployment

1. **Build for Production**
   ```bash
   npm run build
   ```

2. **Run Tests**
   ```bash
   npm test
   ```

## Application Features

### Authentication
- ✅ User registration with form validation
- ✅ User login with JWT token management
- ✅ Automatic token storage and retrieval
- ✅ Protected routes with authentication guards

### Game Features
- ✅ Real-time multiplayer flag guessing game
- ✅ WebSocket connection to backend
- ✅ Interactive game interface with timer
- ✅ Multiple choice answers (A, B, C, D)
- ✅ Real-time score updates
- ✅ Game results and statistics
- ✅ Responsive design for mobile and desktop

### User Interface
- ✅ Modern, responsive design
- ✅ Real-time connection status indicator
- ✅ Error handling and user feedback
- ✅ Loading states and animations
- ✅ Intuitive navigation and controls

## Architecture

The frontend is built with:
- **Angular 18** - Modern web framework
- **TypeScript** - Type-safe JavaScript
- **Socket.IO Client** - Real-time communication
- **SCSS** - Advanced CSS styling
- **Standalone Components** - Modern Angular architecture

## Usage

1. **Register/Login**
   - Create a new account or login with existing credentials
   - Upon successful login, you'll be redirected to the dashboard

2. **Play the Game**
   - Click "Play Now" on the dashboard
   - Wait for matchmaking to find an opponent
   - Answer 10 rounds of flag guessing questions
   - Compete for the highest score!

3. **Game Flow**
   - Each round shows a flag emoji
   - Choose the correct country from 4 options
   - Faster answers earn bonus points
   - See real-time scores and opponent progress
   - View final results and play again

## Troubleshooting

- **Connection Issues**: Ensure the backend server is running on port 3000
- **WebSocket Errors**: Check that Redis is running and accessible
- **Build Errors**: Clear node_modules and run `npm install` again
- **Port Conflicts**: The frontend runs on port 4200 by default 
