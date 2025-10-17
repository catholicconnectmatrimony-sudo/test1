# 🚀 Quick Start Guide - 5 Minutes to Launch

## Prerequisites Check

```bash
# Check Docker
docker --version
# Should show: Docker version 20.10+

# Check Docker Compose
docker-compose --version
# Should show: Docker Compose version 2.0+
```

Don't have Docker? Install it:
- **Mac/Windows**: [Docker Desktop](https://www.docker.com/products/docker-desktop)
- **Linux**: `curl -fsSL https://get.docker.com | sh`

---

## 🎯 3 Steps to Launch

### Step 1: Configure Environment (30 seconds)

```bash
# Copy environment template
cp .env.example .env

# Edit with your details
nano .env
```

**Minimum required changes:**
```env
# Change these!
MONGO_ROOT_PASSWORD=your_strong_password_here
JWT_SECRET=your_super_secret_key_min_32_characters_long
```

### Step 2: Start Everything (3 minutes)

```bash
# Easy way - use the script
./start.sh

# OR manual way
docker-compose up -d
```

### Step 3: Open Your Portal (30 seconds)

```bash
# Open in browser
open http://localhost:3000

# Or visit manually:
# Frontend: http://localhost:3000
# Backend:  http://localhost:5000/api
```

---

## ✅ Verify It's Working

Check service status:
```bash
docker-compose ps
```

You should see:
```
NAME                   STATUS
matrimony-frontend     Up (healthy)
matrimony-backend      Up (healthy)
matrimony-mongodb      Up (healthy)
```

Check logs:
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
```

Test backend health:
```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2025-10-17T...",
  "uptime": 123.456,
  "mongodb": "connected"
}
```

---

## 🎨 First Steps in Your Portal

1. **Open** http://localhost:3000
2. **Register** a new account
3. **Create** your profile
4. **Browse** other profiles
5. **Send** interests
6. **Start** messaging

---

## 🛑 Stop Services

```bash
# Stop all services
./stop.sh

# OR
docker-compose down

# Stop and delete all data (fresh start)
docker-compose down -v
```

---

## 🔧 Common Commands

```bash
# Restart a service
docker-compose restart backend

# View logs
docker-compose logs -f backend

# Rebuild after code changes
docker-compose up -d --build

# Access MongoDB shell
docker-compose exec mongodb mongosh

# Access backend shell
docker-compose exec backend sh

# Check disk usage
docker system df
```

---

## 🐛 Troubleshooting

### Port already in use?
```bash
# Find process using port 3000
sudo lsof -i :3000

# Kill it
sudo kill -9 <PID>
```

### Can't connect to MongoDB?
```bash
# Check MongoDB logs
docker-compose logs mongodb

# Restart MongoDB
docker-compose restart mongodb
```

### Frontend not loading?
```bash
# Check frontend logs
docker-compose logs frontend

# Rebuild frontend
docker-compose up -d --build frontend
```

### Backend errors?
```bash
# Check backend logs
docker-compose logs backend

# Restart backend
docker-compose restart backend
```

### Start fresh?
```bash
# Remove everything and start over
docker-compose down -v
docker-compose up -d --build
```

---

## 📱 Development Mode

### Frontend Development (with hot reload)

```bash
cd shaadi-clone
npm install
npm start
# Frontend runs on http://localhost:3000 with hot reload
```

Keep backend and MongoDB running in Docker:
```bash
# In root directory
docker-compose up -d backend mongodb
```

### Backend Development (with nodemon)

```bash
cd shaadi-clone/backend
npm install
npm run dev
# Backend runs on http://localhost:5000 with auto-restart
```

Keep frontend and MongoDB running in Docker:
```bash
# In root directory
docker-compose up -d frontend mongodb
```

---

## 🌐 Access URLs

| Service | URL | Description |
|---------|-----|-------------|
| Frontend | http://localhost:3000 | React app |
| Backend API | http://localhost:5000/api | REST API |
| Health Check | http://localhost:5000/api/health | Backend health |
| MongoDB | mongodb://localhost:27017 | Database |

---

## 🔑 Default Credentials

**MongoDB:**
- Host: `localhost:27017`
- Database: `matrimony`
- Username: `admin`
- Password: (from your `.env` file)

**Application:**
- No default users - register your own!

---

## 📊 What's Running?

When you run `docker-compose up`, you start:

1. **MongoDB Container**
   - Database for storing all data
   - Persistent storage in Docker volume
   - Automatic health checks

2. **Backend Container**
   - Node.js + Express API
   - Connects to MongoDB
   - Handles authentication, profiles, messages

3. **Frontend Container**
   - React app served by Nginx
   - Connects to backend API
   - Beautiful Material-UI interface

---

## 🚀 Next Steps

### For Development:
1. Read the API documentation (check backend routes)
2. Explore the React components
3. Customize the UI theme
4. Add new features

### For Production:
1. Read `DEPLOYMENT.md`
2. Choose a hosting provider
3. Configure production environment
4. Deploy!

---

## 💡 Pro Tips

1. **Always check logs** when something doesn't work:
   ```bash
   docker-compose logs -f
   ```

2. **Clean up old images** to save disk space:
   ```bash
   docker system prune -a
   ```

3. **Backup your database** regularly:
   ```bash
   docker-compose exec mongodb mongodump --out /backup
   ```

4. **Use environment-specific configs**:
   - `.env` for local development
   - `.env.production` for production
   - Never commit `.env` to git!

5. **Monitor resource usage**:
   ```bash
   docker stats
   ```

---

## 🎓 Learn More

- **Docker**: `DOCKER_VS_VM.md` - Why Docker?
- **Deployment**: `DEPLOYMENT.md` - Deploy to production
- **Full Documentation**: `README.md` - Complete guide

---

## 🆘 Need Help?

1. Check the logs: `docker-compose logs -f`
2. Read the troubleshooting section above
3. Check `README.md` for detailed documentation
4. Google the error message
5. Ask on Stack Overflow with tag `docker`

---

## ✨ You're All Set!

Your matrimony portal is now running! 🎉

Visit http://localhost:3000 and start building your awesome matrimonial platform!

---

**Happy Coding! 💻**
