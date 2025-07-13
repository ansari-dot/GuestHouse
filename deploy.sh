#!/bin/bash

# GuestHouse Application Deployment Script
# This script automates the deployment process

set -e

echo "🚀 Starting GuestHouse Application Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is installed
check_docker() {
    print_status "Checking Docker installation..."
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
    
    print_status "Docker and Docker Compose are installed."
}

# Check if .env file exists
check_env() {
    if [ ! -f ".env" ]; then
        print_warning ".env file not found. Creating default .env file..."
        cat > .env << EOF
# Backend Environment Variables
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb://admin:password123@mongodb:27017/guesthouse?authSource=admin
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
CLIENT_URL=http://localhost:3000

# Frontend Environment Variables
REACT_APP_API_URL=http://localhost:5000/api
VITE_API_URL=http://localhost:5000
EOF
        print_status "Default .env file created. Please update it with your production values."
    fi
}

# Create necessary directories
create_directories() {
    print_status "Creating necessary directories..."
    mkdir -p ssl
    mkdir -p server/uploads
    print_status "Directories created."
}

# Stop existing containers
stop_containers() {
    print_status "Stopping existing containers..."
    docker-compose down --remove-orphans
    print_status "Existing containers stopped."
}

# Build and start containers
build_and_start() {
    print_status "Building and starting containers..."
    docker-compose up -d --build
    print_status "Containers built and started."
}

# Wait for services to be ready
wait_for_services() {
    print_status "Waiting for services to be ready..."
    
    # Wait for MongoDB
    print_status "Waiting for MongoDB..."
    timeout=60
    while [ $timeout -gt 0 ]; do
        if docker exec guesthouse-mongodb mongosh --eval "db.adminCommand('ping')" &> /dev/null; then
            print_status "MongoDB is ready."
            break
        fi
        sleep 2
        timeout=$((timeout-2))
    done
    
    if [ $timeout -le 0 ]; then
        print_error "MongoDB failed to start within 60 seconds."
        exit 1
    fi
    
    # Wait for Backend
    print_status "Waiting for Backend API..."
    timeout=60
    while [ $timeout -gt 0 ]; do
        if curl -f http://localhost:5000/health &> /dev/null; then
            print_status "Backend API is ready."
            break
        fi
        sleep 2
        timeout=$((timeout-2))
    done
    
    if [ $timeout -le 0 ]; then
        print_error "Backend API failed to start within 60 seconds."
        exit 1
    fi
    
    # Wait for Frontend
    print_status "Waiting for Frontend..."
    timeout=60
    while [ $timeout -gt 0 ]; do
        if curl -f http://localhost:3000 &> /dev/null; then
            print_status "Frontend is ready."
            break
        fi
        sleep 2
        timeout=$((timeout-2))
    done
    
    if [ $timeout -le 0 ]; then
        print_error "Frontend failed to start within 60 seconds."
        exit 1
    fi
}

# Show deployment status
show_status() {
    print_status "Deployment completed successfully!"
    echo ""
    echo "🌐 Application URLs:"
    echo "   Frontend: http://localhost:3000"
    echo "   Backend API: http://localhost:5000/api"
    echo "   Health Check: http://localhost:5000/health"
    echo ""
    echo "📊 Container Status:"
    docker-compose ps
    echo ""
    echo "📝 Useful Commands:"
    echo "   View logs: docker-compose logs -f"
    echo "   Stop services: docker-compose down"
    echo "   Restart services: docker-compose restart"
    echo "   Update application: ./deploy.sh"
    echo ""
    print_status "Deployment script completed!"
}

# Main deployment function
deploy() {
    check_docker
    check_env
    create_directories
    stop_containers
    build_and_start
    wait_for_services
    show_status
}

# Run deployment
deploy 