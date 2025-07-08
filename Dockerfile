# --- Stage 1: Build React Frontend ---
FROM node:18 AS frontend-build
WORKDIR /app/client
COPY client/package.json client/package-lock.json ./
RUN npm install
COPY client/ ./
RUN npm run build

# --- Stage 2: Build Backend and Serve Frontend ---
FROM node:18 AS backend
WORKDIR /app
COPY server/package.json server/package-lock.json ./server/
RUN cd server && npm install
COPY server/ ./server/
# Copy frontend build to backend's public directory
COPY --from=frontend-build /app/client/dist ./server/public

# Set environment variables (can be overridden at runtime)
ENV NODE_ENV=production
ENV PORT=3000

# Expose port
EXPOSE 3000

# Start the backend server
CMD ["node", "server/index.js"] 