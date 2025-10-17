# 🚀 Deployment Guide - Matrimony Portal

Complete guide to deploy your matrimony portal to various platforms.

## 📋 Table of Contents

1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Cloud Platform Deployment](#cloud-platform-deployment)
3. [VPS Deployment](#vps-deployment)
4. [Kubernetes Deployment](#kubernetes-deployment)
5. [CI/CD Setup](#cicd-setup)

---

## ✅ Pre-Deployment Checklist

- [ ] Change all default passwords and secrets
- [ ] Configure production environment variables
- [ ] Set up domain name and DNS
- [ ] Obtain SSL/TLS certificates
- [ ] Configure email service (SMTP)
- [ ] Set up database backups
- [ ] Enable monitoring and logging
- [ ] Test all features in staging environment
- [ ] Optimize images and assets
- [ ] Configure CORS for production domain

---

## ☁️ Cloud Platform Deployment

### 1. AWS Deployment

#### Option A: AWS ECS (Elastic Container Service)

```bash
# Install AWS CLI
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install

# Configure AWS
aws configure

# Create ECR repositories
aws ecr create-repository --repository-name matrimony-frontend
aws ecr create-repository --repository-name matrimony-backend

# Login to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.us-east-1.amazonaws.com

# Build and push images
docker build -t matrimony-frontend ./shaadi-clone
docker tag matrimony-frontend:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/matrimony-frontend:latest
docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/matrimony-frontend:latest

docker build -t matrimony-backend ./shaadi-clone/backend
docker tag matrimony-backend:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/matrimony-backend:latest
docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/matrimony-backend:latest

# Create ECS cluster
aws ecs create-cluster --cluster-name matrimony-cluster

# Create task definitions and services via AWS Console or CLI
```

#### Option B: AWS Elastic Beanstalk

```bash
# Install EB CLI
pip install awsebcli

# Initialize EB
eb init -p docker matrimony-portal

# Create environment
eb create matrimony-prod

# Deploy
eb deploy

# Check status
eb status
```

#### Option C: AWS EC2 with Docker

```bash
# Launch EC2 instance (Ubuntu 22.04)
# SSH into instance
ssh -i your-key.pem ubuntu@your-ec2-ip

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker ubuntu

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Clone repository
git clone <your-repo>
cd workspace

# Configure environment
cp .env.example .env
nano .env

# Start application
docker-compose up -d

# Install Nginx and configure reverse proxy
sudo apt install nginx certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

### 2. Google Cloud Platform (GCP)

#### Option A: Cloud Run (Serverless)

```bash
# Install gcloud CLI
curl https://sdk.cloud.google.com | bash
exec -l $SHELL
gcloud init

# Build and push to GCR
gcloud builds submit --tag gcr.io/PROJECT_ID/matrimony-frontend ./shaadi-clone
gcloud builds submit --tag gcr.io/PROJECT_ID/matrimony-backend ./shaadi-clone/backend

# Deploy to Cloud Run
gcloud run deploy matrimony-frontend \
  --image gcr.io/PROJECT_ID/matrimony-frontend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated

gcloud run deploy matrimony-backend \
  --image gcr.io/PROJECT_ID/matrimony-backend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

#### Option B: GKE (Google Kubernetes Engine)

```bash
# Create GKE cluster
gcloud container clusters create matrimony-cluster \
  --num-nodes=3 \
  --machine-type=e2-medium

# Get credentials
gcloud container clusters get-credentials matrimony-cluster

# Apply Kubernetes manifests (see Kubernetes section)
kubectl apply -f k8s/
```

### 3. Microsoft Azure

#### Azure Container Instances

```bash
# Install Azure CLI
curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash

# Login
az login

# Create resource group
az group create --name matrimony-rg --location eastus

# Create container registry
az acr create --resource-group matrimony-rg --name matrimonyacr --sku Basic

# Build and push images
az acr build --registry matrimonyacr --image matrimony-frontend:latest ./shaadi-clone
az acr build --registry matrimonyacr --image matrimony-backend:latest ./shaadi-clone/backend

# Deploy containers
az container create \
  --resource-group matrimony-rg \
  --name matrimony-app \
  --image matrimonyacr.azurecr.io/matrimony-frontend:latest \
  --dns-name-label matrimony-portal \
  --ports 80
```

### 4. DigitalOcean

#### Option A: App Platform (PaaS)

1. Go to DigitalOcean App Platform
2. Connect GitHub repository
3. Select `docker-compose.yml`
4. Configure environment variables
5. Click "Deploy"

#### Option B: Droplet (VPS)

```bash
# Create Ubuntu 22.04 Droplet

# SSH into droplet
ssh root@your-droplet-ip

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Install Docker Compose
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Clone and deploy
git clone <your-repo>
cd workspace
cp .env.example .env
nano .env

# Start services
docker-compose up -d

# Configure Nginx and SSL
apt install nginx certbot python3-certbot-nginx
certbot --nginx -d yourdomain.com
```

### 5. Heroku

```bash
# Install Heroku CLI
curl https://cli-assets.heroku.com/install.sh | sh

# Login
heroku login

# Create app
heroku create matrimony-portal

# Add MongoDB
heroku addons:create mongolab:sandbox

# Deploy
heroku container:push web --app matrimony-portal
heroku container:release web --app matrimony-portal

# Open app
heroku open
```

---

## 🖥️ VPS Deployment (Detailed)

### Ubuntu 22.04 / Debian 11

```bash
# 1. Update system
sudo apt update && sudo apt upgrade -y

# 2. Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# 3. Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# 4. Install Nginx
sudo apt install nginx -y

# 5. Install Certbot for SSL
sudo apt install certbot python3-certbot-nginx -y

# 6. Clone repository
git clone <your-repo>
cd workspace

# 7. Configure environment
cp .env.example .env
nano .env

# 8. Start Docker services
docker-compose up -d

# 9. Configure Nginx
sudo nano /etc/nginx/sites-available/matrimony

# Add this configuration:
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}

# 10. Enable site
sudo ln -s /etc/nginx/sites-available/matrimony /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# 11. Setup SSL
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# 12. Setup auto-renewal
sudo certbot renew --dry-run

# 13. Setup firewall
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable

# 14. Setup automatic Docker restart
sudo systemctl enable docker
```

---

## ☸️ Kubernetes Deployment

### Create Kubernetes Manifests

Create `k8s/` directory with these files:

#### `k8s/namespace.yaml`
```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: matrimony
```

#### `k8s/mongodb-deployment.yaml`
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: mongodb
  namespace: matrimony
spec:
  replicas: 1
  selector:
    matchLabels:
      app: mongodb
  template:
    metadata:
      labels:
        app: mongodb
    spec:
      containers:
      - name: mongodb
        image: mongo:7.0
        ports:
        - containerPort: 27017
        env:
        - name: MONGO_INITDB_ROOT_USERNAME
          value: "admin"
        - name: MONGO_INITDB_ROOT_PASSWORD
          valueFrom:
            secretKeyRef:
              name: mongodb-secret
              key: password
        volumeMounts:
        - name: mongodb-storage
          mountPath: /data/db
      volumes:
      - name: mongodb-storage
        persistentVolumeClaim:
          claimName: mongodb-pvc
---
apiVersion: v1
kind: Service
metadata:
  name: mongodb
  namespace: matrimony
spec:
  ports:
  - port: 27017
  selector:
    app: mongodb
```

#### Deploy to Kubernetes

```bash
# Apply manifests
kubectl apply -f k8s/

# Check status
kubectl get pods -n matrimony
kubectl get services -n matrimony

# View logs
kubectl logs -f <pod-name> -n matrimony

# Scale deployment
kubectl scale deployment backend --replicas=3 -n matrimony
```

---

## 🔄 CI/CD Setup

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy Matrimony Portal

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Build and push Docker images
      run: |
        echo ${{ secrets.DOCKER_PASSWORD }} | docker login -u ${{ secrets.DOCKER_USERNAME }} --password-stdin
        docker-compose build
        docker-compose push
    
    - name: Deploy to server
      uses: appleboy/ssh-action@master
      with:
        host: ${{ secrets.SERVER_HOST }}
        username: ${{ secrets.SERVER_USER }}
        key: ${{ secrets.SERVER_SSH_KEY }}
        script: |
          cd /var/www/matrimony
          git pull
          docker-compose pull
          docker-compose up -d
```

---

## 📊 Monitoring Setup

### Setup Monitoring with Prometheus & Grafana

```bash
# Add to docker-compose.yml
  prometheus:
    image: prom/prometheus
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
      
  grafana:
    image: grafana/grafana
    ports:
      - "3001:3000"
    depends_on:
      - prometheus
```

---

## 🔐 Security Hardening

1. **Use secrets management**
2. **Enable rate limiting**
3. **Setup WAF (Web Application Firewall)**
4. **Regular security updates**
5. **Database encryption at rest**
6. **Regular backups**

---

## 📞 Support

For deployment issues, contact: devops@matrimonyportal.com

---

**Happy Deploying! 🚀**
