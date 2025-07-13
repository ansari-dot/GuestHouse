# Multi-stage Dockerfile for fullstack deployment

# 1. Build frontend
FROM node:18-alpine AS frontend-build
WORKDIR /app
COPY client/package*.json ./
RUN npm ci --only=production
COPY client/ ./
RUN npm run build

# 2. Build backend
FROM node:18-alpine AS backend
WORKDIR /app
COPY server/package*.json ./
RUN npm ci --only=production
COPY server/ ./

# Copy frontend build to backend (assuming backend serves static files from /app/public or /app/dist)
COPY --from=frontend-build /app/dist ./public

# Create uploads directory
RUN mkdir -p uploads

# Expose backend port
EXPOSE 5000

# Start backend server
CMD ["npm", "start"] 