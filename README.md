# 💍 Matrimony Portal - Full Stack Application

A complete, production-ready matrimony portal built with React, Node.js, Express, and MongoDB, fully containerized with Docker.

## 🚀 Features

- **User Authentication** - Secure JWT-based authentication
- **Profile Management** - Create and manage detailed matrimonial profiles
- **Advanced Search** - Search profiles by religion, caste, education, location, etc.
- **Messaging System** - Real-time messaging between users
- **Interest Management** - Send and receive match interests
- **Profile Views** - Track who viewed your profile
- **Subscription Plans** - Premium features with subscription tiers
- **Photo Upload** - Upload and manage profile photos
- **Email Notifications** - Automated email notifications

## 🛠️ Tech Stack

### Frontend
- React 19.1 with TypeScript
- Material-UI (MUI) v7
- React Router v7
- Axios for API calls

### Backend
- Node.js with Express
- MongoDB with Mongoose ODM
- JWT for authentication
- Bcrypt for password hashing
- Multer for file uploads
- Nodemailer for email notifications

### DevOps
- Docker & Docker Compose
- Nginx for reverse proxy
- Multi-stage builds for optimization

## 📋 Prerequisites

- **Docker** (v20.10+) and **Docker Compose** (v2.0+)
- OR **Node.js** (v18+) and **MongoDB** (v7.0+) for local development

## 🐳 Quick Start with Docker (Recommended)

### 1. Clone and Setup

```bash
# Clone the repository
git clone <your-repo-url>
cd workspace

# Copy environment files
cp .env.example .env

# Edit .env with your configurations
nano .env
```

### 2. Configure Environment Variables

Edit `.env` file:

```env
# MongoDB Configuration
MONGO_ROOT_PASSWORD=your_strong_password_here

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_min_32_chars_change_this

# Email Configuration (Gmail example)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-gmail-app-password
```

### 3. Start the Application

```bash
# Start all services (Frontend, Backend, MongoDB)
docker-compose up -d

# Check logs
docker-compose logs -f

# Check service status
docker-compose ps
```

### 4. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **MongoDB**: localhost:27017

### 5. Stop the Application

```bash
# Stop all services
docker-compose down

# Stop and remove volumes (deletes database data)
docker-compose down -v
```

## 🔧 Development Setup (Without Docker)

### Backend Setup

```bash
cd shaadi-clone/backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your MongoDB URI and secrets
nano .env

# Start MongoDB locally
mongod

# Start backend server
npm run dev
```

### Frontend Setup

```bash
cd shaadi-clone

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Start React app
npm start
```

## 📦 Docker Commands Cheat Sheet

```bash
# Build images
docker-compose build

# Start in background
docker-compose up -d

# Start with rebuild
docker-compose up -d --build

# View logs
docker-compose logs -f [service_name]

# Stop services
docker-compose stop

# Restart a service
docker-compose restart [service_name]

# Remove containers and networks
docker-compose down

# Remove everything including volumes
docker-compose down -v

# Execute command in container
docker-compose exec backend sh
docker-compose exec mongodb mongosh

# Scale services
docker-compose up -d --scale backend=3
```

## 🌐 Production Deployment

### Option 1: Cloud Platforms (Easiest)

#### AWS ECS / Azure Container Instances / Google Cloud Run

```bash
# Build production images
docker-compose build

# Push to container registry
docker tag matrimony-frontend:latest your-registry/matrimony-frontend:latest
docker push your-registry/matrimony-frontend:latest

docker tag matrimony-backend:latest your-registry/matrimony-backend:latest
docker push your-registry/matrimony-backend:latest
```

#### DigitalOcean App Platform / Heroku

- Connect GitHub repository
- Select `docker-compose.yml`
- Deploy automatically

### Option 2: VPS (Ubuntu/Debian)

```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Clone and deploy
git clone <your-repo>
cd workspace
cp .env.example .env
# Edit .env with production values

# Start with Nginx reverse proxy
docker-compose --profile production up -d

# Setup SSL with Let's Encrypt
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

### Option 3: Kubernetes (Advanced)

```bash
# Convert docker-compose to Kubernetes
kompose convert

# Apply manifests
kubectl apply -f .
```

## 🔐 Security Best Practices

1. **Change Default Passwords**
   ```bash
   # Generate strong JWT secret
   openssl rand -base64 32
   ```

2. **Enable HTTPS** (Production)
   ```bash
   # Use Let's Encrypt for free SSL
   certbot --nginx -d yourdomain.com
   ```

3. **Environment Variables**
   - Never commit `.env` files
   - Use secrets management (AWS Secrets Manager, Vault)

4. **Database Security**
   - Use strong MongoDB passwords
   - Enable MongoDB authentication
   - Restrict MongoDB to internal network

5. **Rate Limiting**
   - Already configured in Nginx
   - Adjust limits in `nginx/nginx.conf`

## 📊 Monitoring & Maintenance

### Health Checks

```bash
# Backend health
curl http://localhost:5000/api/health

# Check Docker service health
docker-compose ps
```

### Database Backup

```bash
# Backup MongoDB
docker-compose exec mongodb mongodump --out /backup

# Restore MongoDB
docker-compose exec mongodb mongorestore /backup
```

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend

# Last 100 lines
docker-compose logs --tail=100
```

## 🧪 Testing

```bash
# Frontend tests
cd shaadi-clone
npm test

# Backend tests
cd shaadi-clone/backend
npm test
```

## 📁 Project Structure

```
workspace/
├── docker-compose.yml          # Docker orchestration
├── .env                        # Environment variables
├── nginx/                      # Nginx configuration
│   └── nginx.conf
├── shaadi-clone/
│   ├── Dockerfile             # Frontend Docker image
│   ├── nginx.conf             # Frontend Nginx config
│   ├── src/                   # React source code
│   ├── public/                # Static assets
│   └── backend/
│       ├── Dockerfile         # Backend Docker image
│       ├── server.js          # Express server
│       ├── models/            # MongoDB models
│       ├── routes/            # API routes
│       └── middleware/        # Custom middleware
```

## 🚀 Performance Optimization

- **Multi-stage Docker builds** - Reduced image sizes
- **Nginx caching** - Static asset caching
- **Gzip compression** - Reduced bandwidth
- **Health checks** - Auto-recovery of failed containers
- **MongoDB indexing** - Faster queries

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 Environment Variables Reference

### Backend (.env)

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `production` |
| `PORT` | Backend server port | `5000` |
| `MONGODB_URI` | MongoDB connection string | Required |
| `JWT_SECRET` | JWT signing secret | Required |
| `JWT_EXPIRE` | JWT expiration time | `7d` |
| `EMAIL_HOST` | SMTP host | `smtp.gmail.com` |
| `EMAIL_PORT` | SMTP port | `587` |
| `EMAIL_USER` | SMTP username | Required |
| `EMAIL_PASS` | SMTP password | Required |
| `CLIENT_URL` | Frontend URL | `http://localhost:3000` |

### Frontend (.env)

| Variable | Description | Default |
|----------|-------------|---------|
| `REACT_APP_API_URL` | Backend API URL | `http://localhost:5000/api` |

## 🐛 Troubleshooting

### Port Already in Use

```bash
# Find and kill process
sudo lsof -i :3000
sudo kill -9 <PID>
```

### MongoDB Connection Issues

```bash
# Check MongoDB logs
docker-compose logs mongodb

# Restart MongoDB
docker-compose restart mongodb
```

### Build Failures

```bash
# Clean rebuild
docker-compose down -v
docker-compose build --no-cache
docker-compose up -d
```

## 📞 Support

For issues and questions:
- Open an issue on GitHub
- Email: support@matrimonyportal.com

## 📄 License

This project is licensed under the MIT License.

## 🎯 Roadmap

- [ ] Video calls integration
- [ ] AI-powered match recommendations
- [ ] Mobile apps (React Native)
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Payment gateway integration

---

**Built with ❤️ using Docker, React, Node.js, and MongoDB**
