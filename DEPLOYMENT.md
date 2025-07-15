# GuestHouse Application Deployment Guide

This guide will help you deploy both the frontend and backend of the GuestHouse application on a single server using Docker.

## Prerequisites

1. **Docker** - Install Docker and Docker Compose on your server
2. **Server Requirements**:
   - Minimum 2GB RAM
   - 10GB free disk space
   - Ubuntu 18.04+ or CentOS 7+

## Installation Steps

### 1. Install Docker and Docker Compose

#### For Ubuntu/Debian:
```bash
# Update package index
sudo apt-get update

# Install prerequisites
sudo apt-get install -y apt-transport-https ca-certificates curl gnupg lsb-release

# Add Docker's official GPG key
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Add Docker repository
echo "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Add user to docker group
sudo usermod -aG docker $USER

# Start and enable Docker
sudo systemctl start docker
sudo systemctl enable docker
```

#### For CentOS/RHEL:
```bash
# Install Docker
sudo yum install -y yum-utils
sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
sudo yum install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Start and enable Docker
sudo systemctl start docker
sudo systemctl enable docker

# Add user to docker group
sudo usermod -aG docker $USER
```

### 2. Clone and Setup Project

```bash
# Clone your project (replace with your repository URL)
git clone <your-repository-url>
cd GuestHouse-Copy

# Create necessary directories
mkdir -p ssl
```

### 3. Environment Configuration

Create a `.env` file in the root directory:

```bash
# Backend Environment Variables
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb://admin:password123@mongodb:27017/guesthouse?authSource=admin
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
CLIENT_URL=http://your-domain.com

# Frontend Environment Variables
REACT_APP_API_URL=http://your-domain.com/api
```

### 4. Build and Deploy

```bash
# Build and start all services
docker-compose up -d --build

# Check if all containers are running
docker-compose ps

# View logs
docker-compose logs -f
```

### 5. Initial Setup

#### Create Admin User:
```bash
# Access the backend container
docker exec -it guesthouse-backend sh

# Run the admin creation script (if available)
node createAdmin.js
```

#### Database Setup:
The MongoDB database will be automatically created with the specified credentials.

## Access Points

- **Frontend**: http://your-server-ip:3000
- **Backend API**: http://your-server-ip:5000/api
- **With Nginx**: http://your-server-ip (port 80)

## Production Deployment

### 1. Domain Configuration

Update the environment variables with your domain:

```bash
# Edit .env file
CLIENT_URL=https://your-domain.com
REACT_APP_API_URL=https://your-domain.com/api
```

### 2. SSL Certificate (Optional)

For HTTPS, place your SSL certificates in the `ssl` directory:
- `ssl/cert.pem` - Your SSL certificate
- `ssl/key.pem` - Your private key

### 3. Firewall Configuration

```bash
# Open necessary ports
sudo ufw allow 80
sudo ufw allow 443
sudo ufw allow 3000
sudo ufw allow 5000
```

## Management Commands

### Start Services
```bash
docker-compose up -d
```

### Stop Services
```bash
docker-compose down
```

### Restart Services
```bash
docker-compose restart
```

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
```

### Update Application
```bash
# Pull latest changes
git pull

# Rebuild and restart
docker-compose down
docker-compose up -d --build
```

### Backup Database
```bash
# Create backup
docker exec guesthouse-mongodb mongodump --out /data/backup

# Copy backup to host
docker cp guesthouse-mongodb:/data/backup ./backup
```

## Troubleshooting

### Common Issues

1. **Port Already in Use**:
   ```bash
   # Check what's using the port
   sudo netstat -tulpn | grep :3000
   
   # Kill the process or change ports in docker-compose.yml
   ```

2. **Database Connection Issues**:
   ```bash
   # Check MongoDB logs
   docker-compose logs mongodb
   
   # Restart MongoDB
   docker-compose restart mongodb
   ```

3. **Build Failures**:
   ```bash
   # Clean Docker cache
   docker system prune -a
   
   # Rebuild without cache
   docker-compose build --no-cache
   ```

4. **Permission Issues**:
   ```bash
   # Fix uploads directory permissions
   sudo chown -R 1000:1000 server/uploads
   ```

### Health Checks

```bash
# Check if backend is responding
curl http://localhost:5000/health

# Check if frontend is accessible
curl http://localhost:3000

# Check MongoDB connection
docker exec guesthouse-mongodb mongosh --eval "db.adminCommand('ping')"
```

## Monitoring

### Resource Usage
```bash
# Check container resource usage
docker stats

# Check disk usage
docker system df
```

### Log Monitoring
```bash
# Real-time log monitoring
docker-compose logs -f --tail=100
```

## Security Considerations

1. **Change Default Passwords**: Update MongoDB credentials in production
2. **JWT Secret**: Use a strong, unique JWT secret
3. **Firewall**: Configure firewall rules appropriately
4. **SSL**: Use HTTPS in production
5. **Regular Updates**: Keep Docker images updated

## Scaling

### Horizontal Scaling
```bash
# Scale backend services
docker-compose up -d --scale backend=3
```

### Load Balancer
Consider using a load balancer like Traefik or HAProxy for production deployments.

## Support

For issues and questions:
1. Check the logs: `docker-compose logs`
2. Verify environment variables
3. Check network connectivity between containers
4. Ensure all required ports are open

## Maintenance

### Regular Tasks
- Monitor disk space usage
- Check application logs for errors
- Update Docker images regularly
- Backup database periodically
- Monitor resource usage

### Updates
```bash
# Update application
git pull
docker-compose down
docker-compose up -d --build

# Update Docker images
docker-compose pull
docker-compose up -d
``` 

Thank you for sharing the error details:

```
GET http://localhost:3000/login 429 (Too Many Requests)
GET http://localhost:3000/favicon.ico 429 (Too Many Requests)
```

This means your server (or the Back4App proxy) is returning HTTP 429 errors, which is a rate limit response.

---

## Why is this happening?

- **/login** is being requested as a GET, but in most modern apps, `/login` should be a POST API call, not a GET page load.
- If you visit `/login` directly in the browser, your server tries to serve a React route, but if your backend is rate-limited or misconfigured, it may return 429.
- The favicon request is normal, but it also gets rate-limited if the server is already overloaded.

---

## What to check and fix

### 1. **Are you visiting `/login` directly in the browser?**
- If yes, your backend should serve `index.html` for all non-API routes (so React Router can handle it).
- If your server is not doing this, or if it is overloaded, you get 429.

### 2. **Check for Infinite Loops or Rapid Requests**
- If your frontend is stuck in a redirect or reload loop (for example, if it keeps trying to access `/login` and gets redirected back), it can quickly hit the rate limit.

### 3. **Check Your Backend Catch-All Route**
Your backend should have this at the end of your routes (which you do):

```js
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
```

But if your server is overloaded or misconfigured, it may not serve the file.

---

## How to Fix

### **A. Wait for the Rate Limit to Reset**
- Wait 5–10 minutes and try again.

### **B. Make Sure Your Dockerfile and Build Are Correct**
- You already have a correct Dockerfile and build process.
- Make sure you are not running multiple containers or old versions.

### **C. Check for Loops in Your Frontend**
- Make sure your frontend is not stuck in a redirect loop (for example, redirecting to `/login` over and over).

### **D. Check Your Server Logs on Back4App**
- Look for errors or warnings about too many requests, or about failing to serve `index.html`.

### **E. Test Locally**
- Run your Docker image locally:
  ```sh
  docker build -t guesthouse-app .
  docker run -p 5000:5000 guesthouse-app
  ```
- Visit [http://localhost:5000/login](http://localhost:5000/login)
- If you see your React login page, your Dockerfile and build are correct.

---

## If the Problem Persists

- Let me know if you see any errors in your server logs on Back4App.
- Tell me if you are using any frontend code that could cause repeated requests or redirects.
- If you want, share your `client/src/components/ProtectedRoute.jsx` or routing logic for review.

---

**Summary:**  
- 429 means rate limit.  
- Wait a few minutes, then try again.  
- Make sure your frontend is not causing repeated requests.  
- Test your Docker image locally to confirm it works before deploying.

If you want, I can review your routing or login logic for possible infinite loops. Just let me know! 