# Multi-stage Dockerfile for fullstack deployment

# 1. Build frontend
FROM node:20-alpine AS frontend-build
WORKDIR /app
COPY client/package*.json ./
# Install all dependencies including dev dependencies for building
RUN npm ci
COPY client/ ./
RUN npm run build

# 2. Build backend
FROM node:20-alpine AS backend
WORKDIR /app
COPY server/package*.json ./
# Install all dependencies for backend
RUN npm ci
COPY server/ ./

# Copy frontend build to backend public directory
COPY --from=frontend-build /app/dist ./public

# Copy start script
COPY start.sh ./
RUN chmod +x start.sh

# Create uploads directory
RUN mkdir -p uploads

# Expose backend port
EXPOSE 5000

# Start backend server
CMD ["./start.sh"] 