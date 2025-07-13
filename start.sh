#!/bin/bash

# Start script for container deployment
echo "Starting GuestHouse Application..."

# Set default environment variables if not provided
export NODE_ENV=${NODE_ENV:-production}
export PORT=${PORT:-5000}
export MONGODB_URI=${MONGODB_URI:-mongodb+srv://073ansari:ansari@guesthouse.gyhavro.mongodb.net/}
export JWT_SECRET=${JWT_SECRET:-your-super-secret-jwt-key-change-this-in-production}
export CLIENT_URL=${CLIENT_URL:-http://localhost:5000}

echo "Environment: $NODE_ENV"
echo "Port: $PORT"
echo "MongoDB URI: $MONGODB_URI"

# Start the application
npm start 