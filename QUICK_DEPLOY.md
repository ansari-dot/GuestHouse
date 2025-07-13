# 🚀 Quick Deployment Guide

## Prerequisites
- Docker Desktop installed on your machine
- Git (to clone the repository)

## Quick Start (Windows)

1. **Clone the repository** (if not already done):
   ```bash
   git clone <your-repository-url>
   cd GuestHouse-Copy
   ```

2. **Run the deployment script**:
   ```bash
   deploy.bat
   ```

## Quick Start (Linux/Mac)

1. **Clone the repository** (if not already done):
   ```bash
   git clone <your-repository-url>
   cd GuestHouse-Copy
   ```

2. **Make the script executable and run**:
   ```bash
   chmod +x deploy.sh
   ./deploy.sh
   ```

## Manual Deployment

If you prefer manual deployment:

1. **Install Docker Desktop** from [docker.com](https://www.docker.com/products/docker-desktop/)

2. **Start Docker Desktop**

3. **Open terminal/command prompt** in the project directory

4. **Run the following commands**:
   ```bash
   # Build and start all services
   docker-compose up -d --build
   
   # Check if services are running
   docker-compose ps
   ```

## Access Your Application

Once deployment is complete, you can access:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/health

## Useful Commands

```bash
# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Restart services
docker-compose restart

# Update application
docker-compose down
docker-compose up -d --build
```

## Troubleshooting

### Port Already in Use
If you get port conflicts, you can change ports in `docker-compose.yml`:
- Frontend: Change `3000:3000` to `3001:3000`
- Backend: Change `5000:5000` to `5001:5000`

### Docker Not Running
Make sure Docker Desktop is running before executing the deployment script.

### Permission Issues (Linux/Mac)
If you get permission errors, run:
```bash
sudo chown -R $USER:$USER .
```

## Production Deployment

For production deployment, see the detailed guide in `DEPLOYMENT.md`.

## Support

If you encounter issues:
1. Check if Docker is running
2. Verify all ports are available
3. Check the logs: `docker-compose logs`
4. Ensure you have sufficient disk space (at least 2GB free) 