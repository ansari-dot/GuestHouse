# 1. Use official Node.js image as the base
FROM node:20-alpine

# 2. Set the working directory
WORKDIR /app

# 3. Copy backend package files and install dependencies
COPY server/package*.json ./server/
RUN cd server && npm ci

# 4. Copy frontend package files and install dependencies, then build frontend
COPY client/package*.json ./client/
RUN cd client && npm ci
COPY client ./client
RUN cd client && npm run build

# 5. Copy backend source code
COPY server ./server

# 6. Copy frontend build output to backend's public directory
RUN mkdir -p server/public && cp -r client/dist/* server/public/

# 7. Set environment variables (can be overridden at runtime)
ENV NODE_ENV=production
ENV PORT=5000

# 8. Expose the port
EXPOSE 5000

# 9. Set the entry point to start the backend server
WORKDIR /app/server
CMD ["npm", "start"] 