@echo off
echo 🚀 Starting GuestHouse Application Deployment...

REM Check if Docker is installed
docker --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Docker is not installed. Please install Docker first.
    pause
    exit /b 1
)

docker-compose --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Docker Compose is not installed. Please install Docker Compose first.
    pause
    exit /b 1
)

echo [INFO] Docker and Docker Compose are installed.

REM Check if .env file exists
if not exist ".env" (
    echo [WARNING] .env file not found. Creating default .env file...
    (
        echo # Backend Environment Variables
        echo NODE_ENV=production
        echo PORT=5000
        echo MONGODB_URI=mongodb://admin:password123@mongodb:27017/guesthouse?authSource=admin
        echo JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
        echo CLIENT_URL=http://localhost:3000
        echo.
        echo # Frontend Environment Variables
        echo REACT_APP_API_URL=http://localhost:5000/api
        echo VITE_API_URL=http://localhost:5000
    ) > .env
    echo [INFO] Default .env file created. Please update it with your production values.
)

REM Create necessary directories
echo [INFO] Creating necessary directories...
if not exist "ssl" mkdir ssl
if not exist "server\uploads" mkdir server\uploads
echo [INFO] Directories created.

REM Stop existing containers
echo [INFO] Stopping existing containers...
docker-compose down --remove-orphans
echo [INFO] Existing containers stopped.

REM Build and start containers
echo [INFO] Building and starting containers...
docker-compose up -d --build
echo [INFO] Containers built and started.

REM Wait for services to be ready
echo [INFO] Waiting for services to be ready...

REM Wait for MongoDB
echo [INFO] Waiting for MongoDB...
timeout /t 10 /nobreak >nul

REM Wait for Backend
echo [INFO] Waiting for Backend API...
timeout /t 10 /nobreak >nul

REM Wait for Frontend
echo [INFO] Waiting for Frontend...
timeout /t 10 /nobreak >nul

REM Show deployment status
echo [INFO] Deployment completed successfully!
echo.
echo 🌐 Application URLs:
echo    Frontend: http://localhost:3000
echo    Backend API: http://localhost:5000/api
echo    Health Check: http://localhost:5000/health
echo.
echo 📊 Container Status:
docker-compose ps
echo.
echo 📝 Useful Commands:
echo    View logs: docker-compose logs -f
echo    Stop services: docker-compose down
echo    Restart services: docker-compose restart
echo    Update application: deploy.bat
echo.
echo [INFO] Deployment script completed!
pause 