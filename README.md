# Game Frontend

Angular frontend for the multiplayer flag guessing game. This repository contains the client application with real-time WebSocket communication.

## 🚀 Quick Start

### Prerequisites

- **Docker** and **Docker Compose** installed
- **Node.js** 18+ (for local development without Docker)
- **Backend API** running (see game-backend repository)

### 1. Using Docker (Recommended)

```bash
# Clone the repository
git clone <repository-url>
cd game-frontend

# Create environment file (optional)
# The docker-compose.yml has sensible defaults

# Start the frontend
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### 2. Local Development

```bash
# Install dependencies
npm install

# Start the development server
npm start

# Or start with specific API URL
API_URL=http://localhost:3000 npm start
```

## 🔧 Environment Variables

You can create a `.env` file in the root directory:

```env
# API Configuration
API_URL=http://localhost:3000
SOCKET_URL=http://localhost:3000

# Application Configuration
NODE_ENV=development
```

## 🎮 Features

- **Real-time Multiplayer**: WebSocket-based game communication
- **Responsive Design**: Works on desktop and mobile devices
- **Authentication**: User registration and login
- **Game Interface**: Interactive flag guessing game
- **Leaderboard**: Track top players and game history
- **Dashboard**: User statistics and game management

## 📱 Pages and Components

- **Login/Register**: User authentication
- **Dashboard**: User stats and game controls
- **Game**: Interactive gameplay interface
- **Leaderboard**: Top players and scores
- **Navbar**: Navigation and user menu

## 🌐 API Integration

The frontend communicates with the backend via:
- **REST API**: Authentication, leaderboard, user data
- **WebSocket**: Real-time game events and state updates

### WebSocket Events

The frontend handles these real-time events:
- `matchFound`: Game match found
- `gameState`: Current game state
- `roundStart`: New round begins
- `gameEnd`: Game finished

## 🎨 Styling

- **Framework**: Angular 18 with standalone components
- **Styling**: SCSS with Tailwind CSS
- **Responsive**: Mobile-first design approach

## 🧪 Testing

```bash
# Run unit tests
npm test

# Run tests with coverage
npm run test -- --coverage

# Run e2e tests (if configured)
npm run e2e
```

## 🔧 Development Commands

```bash
# Start development server
npm start

# Build for production
npm run build

# Watch for changes
npm run watch

# Lint code
npm run lint

# Format code
npm run format
```

## 🐳 Docker Configuration

The `docker-compose.yml` includes:
- **Frontend**: Angular development server
- **Hot Reload**: Code changes automatically reflected
- **Port Mapping**: Accessible on `http://localhost:4200`

## 📂 Project Structure

```
src/
├── app/
│   ├── components/        # UI components
│   │   ├── dashboard/     # User dashboard
│   │   ├── game/          # Game interface
│   │   ├── leaderboard/   # Leaderboard display
│   │   ├── login/         # Authentication
│   │   └── navbar/        # Navigation
│   ├── services/          # API and game services
│   │   ├── auth.service.ts
│   │   ├── game.service.ts
│   │   └── leaderboard.service.ts
│   ├── app.component.ts   # Root component
│   └── app.routes.ts      # Route configuration
├── styles.scss           # Global styles
└── main.ts               # Application bootstrap
```

## 🚀 Production Build

For production deployment:

```bash
# Build production bundle
npm run build

# Build production Docker image
docker build --target production -t game-frontend:latest .

# Run production container
docker run -d -p 8080:8080 game-frontend:latest
```

## 🔗 Related Repositories

- **Backend**: [game-backend repository]
- **Deployment**: [deployment configuration repository]

## ⚙️ Configuration

### Backend Connection

The frontend connects to the backend API. Make sure the backend is running and accessible at the configured URL (default: `http://localhost:3000`).

### Environment Setup

For different environments, update the API_URL:

```bash
# Development
API_URL=http://localhost:3000

# Production
API_URL=https://your-backend-domain.com
```

## 📝 Development Notes

- Uses Angular 18 with standalone components
- Implements real-time WebSocket communication
- Responsive design with mobile support
- Tailwind CSS for styling
- RxJS for reactive programming
