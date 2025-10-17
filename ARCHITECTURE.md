# 🏗️ Architecture Overview - Matrimony Portal

## 🎯 System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         INTERNET                            │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    NGINX (Port 80/443)                      │
│              [Reverse Proxy + Load Balancer]                │
│   • SSL Termination  • Rate Limiting  • Caching            │
└────────────┬────────────────────────────┬───────────────────┘
             │                            │
             ▼                            ▼
    ┌────────────────┐          ┌─────────────────┐
    │   FRONTEND     │          │    BACKEND      │
    │  (React App)   │◄────────►│  (Express API)  │
    │                │          │                 │
    │  Port: 3000    │          │  Port: 5000     │
    │  Nginx Alpine  │          │  Node.js 18     │
    └────────────────┘          └────────┬────────┘
                                         │
                                         ▼
                                ┌─────────────────┐
                                │    MONGODB      │
                                │   (Database)    │
                                │                 │
                                │  Port: 27017    │
                                │  MongoDB 7.0    │
                                └─────────────────┘

```

---

## 📦 Container Architecture

### Frontend Container
```
┌────────────────────────────────────────┐
│     matrimony-frontend:latest          │
├────────────────────────────────────────┤
│  Base Image: nginx:alpine              │
│  Size: ~50 MB                          │
├────────────────────────────────────────┤
│  Contents:                             │
│  • Built React app                     │
│  • Nginx web server                    │
│  • Custom nginx.conf                   │
│  • Static assets                       │
├────────────────────────────────────────┤
│  Exposed Port: 80 → 3000               │
│  Health Check: HTTP GET /              │
└────────────────────────────────────────┘
```

### Backend Container
```
┌────────────────────────────────────────┐
│     matrimony-backend:latest           │
├────────────────────────────────────────┤
│  Base Image: node:18-alpine            │
│  Size: ~200 MB                         │
├────────────────────────────────────────┤
│  Contents:                             │
│  • Node.js runtime                     │
│  • Express.js server                   │
│  • API routes                          │
│  • Business logic                      │
│  • Authentication middleware           │
├────────────────────────────────────────┤
│  Exposed Port: 5000                    │
│  Health Check: GET /api/health         │
└────────────────────────────────────────┘
```

### MongoDB Container
```
┌────────────────────────────────────────┐
│     matrimony-mongodb:latest           │
├────────────────────────────────────────┤
│  Base Image: mongo:7.0                 │
│  Size: ~700 MB                         │
├────────────────────────────────────────┤
│  Contents:                             │
│  • MongoDB server                      │
│  • Database: matrimony                 │
│  • Collections: users, profiles, etc.  │
│  • Indexes                             │
├────────────────────────────────────────┤
│  Exposed Port: 27017                   │
│  Persistent Storage: Docker Volume     │
│  Health Check: mongosh ping            │
└────────────────────────────────────────┘
```

---

## 🔄 Request Flow

### 1. User Registration Flow
```
User Browser
    │
    ├─► POST /register (Frontend)
    │
    └──► Frontend validates input
         │
         └──► POST /api/auth/register (Backend)
              │
              ├─► Validate data
              ├─► Hash password (bcrypt)
              ├─► Save to MongoDB
              ├─► Generate JWT token
              │
              └──► Return token & user data
                   │
                   └──► Frontend stores token
                        │
                        └──► Redirect to profile
```

### 2. Profile Search Flow
```
User Browser
    │
    ├─► GET /search?filters=... (Frontend)
    │
    └──► Frontend sends filters
         │
         └──► GET /api/search?filters=... (Backend)
              │
              ├─► Verify JWT token
              ├─► Build MongoDB query
              ├─► Execute search with indexes
              ├─► Format results
              │
              └──► Return profile list
                   │
                   └──► Frontend displays cards
```

### 3. Message Flow
```
User A                  Backend                User B
  │                       │                      │
  ├─► Send Message        │                      │
  │                       │                      │
  └──► POST /api/messages │                      │
       │                  │                      │
       └─► Verify auth    │                      │
           │              │                      │
           └─► Save to DB │                      │
               │          │                      │
               └─► Send notification (email)     │
                          │                      │
                          └─► User B receives    │
```

---

## 🗃️ Database Schema

### User Collection
```javascript
{
  _id: ObjectId,
  email: String (unique, indexed),
  password: String (hashed),
  name: String,
  phone: String,
  role: String (user/admin),
  isVerified: Boolean,
  subscription: {
    plan: String (free/basic/premium),
    expiresAt: Date
  },
  createdAt: Date,
  updatedAt: Date
}
```

### Profile Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  photos: [String],
  bio: String,
  
  // Personal Details
  age: Number,
  gender: String,
  height: Number,
  weight: Number,
  
  // Family & Background
  religion: String (indexed),
  caste: String (indexed),
  motherTongue: String,
  
  // Education & Career
  education: String (indexed),
  occupation: String,
  income: Number,
  
  // Location
  country: String,
  state: String,
  city: String (indexed),
  
  // Preferences
  lookingFor: {
    ageRange: [min, max],
    education: [String],
    location: [String],
    // ... more filters
  },
  
  createdAt: Date,
  updatedAt: Date
}
```

### Message Collection
```javascript
{
  _id: ObjectId,
  senderId: ObjectId (ref: User),
  receiverId: ObjectId (ref: User),
  content: String,
  read: Boolean,
  createdAt: Date (indexed)
}
```

### Interest Collection
```javascript
{
  _id: ObjectId,
  senderId: ObjectId (ref: User),
  receiverId: ObjectId (ref: User),
  status: String (pending/accepted/rejected),
  message: String,
  createdAt: Date
}
```

---

## 🔐 Security Architecture

### Authentication Flow
```
┌──────────────────────────────────────────────┐
│  1. User Login                               │
│     ├─► Email + Password                     │
│     └─► Backend validates                    │
│         ├─► Bcrypt compare                   │
│         └─► Generate JWT token               │
│                                              │
│  2. Token Storage                            │
│     ├─► Frontend stores in localStorage      │
│     └─► Included in all API requests         │
│                                              │
│  3. Request Authorization                    │
│     ├─► Extract token from header            │
│     ├─► Verify JWT signature                 │
│     ├─► Check expiration                     │
│     └─► Attach user to request               │
│                                              │
│  4. Protected Resources                      │
│     └─► Only accessible with valid token     │
└──────────────────────────────────────────────┘
```

### Security Layers
```
┌─────────────────────────────────────────┐
│  Layer 1: Nginx                         │
│  • Rate limiting                        │
│  • DDoS protection                      │
│  • SSL/TLS termination                  │
└────────────┬────────────────────────────┘
             │
┌────────────▼────────────────────────────┐
│  Layer 2: Express Middleware            │
│  • CORS configuration                   │
│  • Input validation                     │
│  • JWT verification                     │
│  • Request sanitization                 │
└────────────┬────────────────────────────┘
             │
┌────────────▼────────────────────────────┐
│  Layer 3: Business Logic                │
│  • Authorization checks                 │
│  • Role-based access                    │
│  • Data ownership validation            │
└────────────┬────────────────────────────┘
             │
┌────────────▼────────────────────────────┐
│  Layer 4: Database                      │
│  • MongoDB authentication               │
│  • Field-level encryption               │
│  • Audit logging                        │
└─────────────────────────────────────────┘
```

---

## 📊 Data Flow Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    CLIENT SIDE                          │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  React Components                                       │
│  ├─► Pages (Login, Profile, Search, Messages)          │
│  ├─► Components (ProfileCard, MessageBox, etc.)        │
│  └─► Context (AuthContext for global state)            │
│       │                                                 │
│       ▼                                                 │
│  API Service Layer (Axios)                             │
│  └─► Handles all HTTP requests                         │
│       │                                                 │
└───────┼─────────────────────────────────────────────────┘
        │
        │ HTTP/HTTPS
        │
┌───────▼─────────────────────────────────────────────────┐
│                   SERVER SIDE                           │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Express Routes                                         │
│  ├─► /api/auth     (login, register, verify)           │
│  ├─► /api/users    (profile CRUD)                      │
│  ├─► /api/profiles (search, filter)                    │
│  ├─► /api/messages (send, receive, read)               │
│  ├─► /api/interests (send, accept, reject)             │
│  └─► /api/upload   (photo upload)                      │
│       │                                                 │
│       ▼                                                 │
│  Middleware Layer                                       │
│  ├─► Authentication (JWT verify)                       │
│  ├─► Validation (express-validator)                    │
│  └─► Error handling                                    │
│       │                                                 │
│       ▼                                                 │
│  Business Logic                                         │
│  ├─► Controllers                                        │
│  ├─► Services                                          │
│  └─► Utilities                                         │
│       │                                                 │
│       ▼                                                 │
│  MongoDB Models (Mongoose)                             │
│  └─► Schema validation & queries                       │
│       │                                                 │
└───────┼─────────────────────────────────────────────────┘
        │
        │ MongoDB Protocol
        │
┌───────▼─────────────────────────────────────────────────┐
│                   DATABASE                              │
├─────────────────────────────────────────────────────────┤
│  MongoDB Collections                                    │
│  ├─► users                                             │
│  ├─► profiles                                          │
│  ├─► messages                                          │
│  ├─► interests                                         │
│  ├─► profile_views                                     │
│  └─► subscriptions                                     │
└─────────────────────────────────────────────────────────┘
```

---

## 🚀 Deployment Architecture

### Development Environment
```
Developer Machine
├─► Docker Compose
│   ├─► Frontend Container (Port 3000)
│   ├─► Backend Container (Port 5000)
│   └─► MongoDB Container (Port 27017)
└─► Hot Reload Enabled
```

### Staging Environment
```
Cloud VPS (DigitalOcean/AWS)
├─► Docker Compose
│   ├─► Frontend Container
│   ├─► Backend Container
│   └─► MongoDB Container
├─► Nginx (Reverse Proxy)
└─► SSL Certificate (Let's Encrypt)
```

### Production Environment (Scalable)
```
Load Balancer (Nginx/AWS ALB)
├─► Frontend Containers (×3)
│   └─► CDN (Cloudflare/AWS CloudFront)
│
├─► Backend Containers (×5)
│   ├─► Auto-scaling enabled
│   └─► Health checks
│
├─► MongoDB Cluster (Replica Set)
│   ├─► Primary
│   ├─► Secondary (×2)
│   └─► Auto-failover
│
└─► Redis (Optional - for caching)
```

---

## 🔄 CI/CD Pipeline

```
GitHub Repository
    │
    ├─► Push to main branch
    │
    ▼
GitHub Actions
    │
    ├─► Run Tests
    │   ├─► Unit tests
    │   ├─► Integration tests
    │   └─► E2E tests
    │
    ├─► Build Docker Images
    │   ├─► Frontend image
    │   └─► Backend image
    │
    ├─► Push to Registry
    │   └─► Docker Hub / AWS ECR / GCR
    │
    ├─► Deploy to Staging
    │   └─► SSH to staging server
    │       └─► docker-compose pull & up
    │
    └─► Deploy to Production (manual approval)
        └─► SSH to production servers
            └─► Rolling update
```

---

## 📈 Scaling Strategy

### Horizontal Scaling
```
# Scale backend instances
docker-compose up --scale backend=5

# Scale with Kubernetes
kubectl scale deployment backend --replicas=10
```

### Vertical Scaling
```
# Increase container resources
docker-compose.yml:
  backend:
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 2G
```

### Database Scaling
```
MongoDB Replica Set:
├─► Primary (Write operations)
├─► Secondary 1 (Read operations)
└─► Secondary 2 (Read operations + Backup)
```

---

## 🔍 Monitoring Architecture

```
Application Containers
    │
    ├─► Prometheus (Metrics Collection)
    │   └─► Scrapes metrics from containers
    │
    ├─► Grafana (Visualization)
    │   └─► Dashboards for monitoring
    │
    ├─► ELK Stack (Logging)
    │   ├─► Elasticsearch (Store logs)
    │   ├─► Logstash (Process logs)
    │   └─► Kibana (Visualize logs)
    │
    └─► Health Checks
        ├─► Container health
        ├─► Database connection
        └─► API endpoints
```

---

## 🎯 Technology Choices & Rationale

### Frontend: React + TypeScript
- **Why?** Component-based, type-safe, huge ecosystem
- **Alternatives Considered:** Vue.js, Angular
- **Verdict:** React is industry standard for matrimony sites

### Backend: Node.js + Express
- **Why?** Fast, scalable, JavaScript everywhere
- **Alternatives Considered:** Python/Django, Java/Spring
- **Verdict:** Perfect for real-time features (messages)

### Database: MongoDB
- **Why?** Flexible schema, scales horizontally, fast queries
- **Alternatives Considered:** PostgreSQL, MySQL
- **Verdict:** Best for user profiles with varying fields

### Containerization: Docker
- **Why?** Portable, lightweight, industry standard
- **Alternatives Considered:** VMs, Bare metal
- **Verdict:** Clear winner (see DOCKER_VS_VM.md)

### UI Framework: Material-UI
- **Why?** Professional, accessible, customizable
- **Alternatives Considered:** Ant Design, Chakra UI
- **Verdict:** Best component library for React

---

## 📊 Performance Benchmarks

### Response Times (Expected)
- Homepage load: < 1s
- Profile search: < 500ms
- Send message: < 200ms
- Image upload: < 2s

### Capacity (Single Server)
- Concurrent users: 1000+
- Requests/second: 200+
- Database records: Millions
- Uptime: 99.9%+

### Resource Usage
- Memory: ~750 MB (all containers)
- CPU: 10-20% idle, 50-70% under load
- Disk: ~1.5 GB + data
- Network: ~10 Mbps average

---

## 🔐 Backup Strategy

```
Daily Backups
├─► MongoDB dump (automated)
│   └─► Stored in S3/Cloud Storage
│
├─► User uploaded photos
│   └─► Synced to S3/Cloud Storage
│
└─► Configuration files
    └─► Version controlled (Git)

Retention Policy:
├─► Daily backups: 7 days
├─► Weekly backups: 1 month
└─► Monthly backups: 1 year
```

---

## 🎯 Summary

This architecture provides:
- ✅ **Scalability** - Horizontal and vertical
- ✅ **Reliability** - Health checks, auto-restart
- ✅ **Security** - Multi-layer protection
- ✅ **Performance** - Optimized for speed
- ✅ **Maintainability** - Clean code, docs
- ✅ **Cost-Efficiency** - Resource optimization
- ✅ **Flexibility** - Easy to modify/extend

---

**Architecture designed for growth from 10 to 10,000+ users! 🚀**
