# Multi-stage build for Angular frontend
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci && npm cache clean --force

# Copy source code
COPY . .

# Build the application for production
RUN npm run build

# Development stage
FROM node:18-alpine AS development

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install ALL dependencies for development
RUN npm ci && npm cache clean --force

# Copy source code
COPY . .

# Expose port
EXPOSE 4200

# Start in development mode
CMD ["npm", "start", "--", "--host", "0.0.0.0", "--port", "4200"]

# Production stage with Nginx
FROM nginx:alpine AS production

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built application from builder stage
COPY --from=builder /app/dist/game-frontend /usr/share/nginx/html

# Create non-root user
RUN addgroup -g 1001 -S nginxuser
RUN adduser -S nginxuser -u 1001

# Change ownership of nginx directories
RUN chown -R nginxuser:nginxuser /var/cache/nginx /var/run /var/log/nginx /usr/share/nginx/html

# Switch to non-root user
USER nginxuser

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8080/health || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
