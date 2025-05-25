# 🚀 Deployment Guide

This guide covers multiple deployment options for your Programmatic Content Generation System.

## 🌟 Quick Deploy (Recommended)

### 1. Vercel (Zero Config)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from your project directory
vercel

# Follow the prompts - Vercel auto-detects Next.js
```

**Benefits:**
- ✅ Zero configuration
- ✅ Automatic deployments on git push
- ✅ Global CDN
- ✅ Serverless functions
- ✅ Custom domains

### 2. Netlify
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build and deploy
npm run build
netlify deploy --prod --dir=.next
```

## 🖥️ VPS/Server Deployment

### Prerequisites
- Ubuntu 20.04+ or similar Linux distribution
- Root or sudo access
- Domain name (optional but recommended)

### Quick VPS Deployment
```bash
# 1. Clone your repository on the server
git clone https://github.com/ShekharDewan/programmatic-website-generator.git
cd programmatic-website-generator

# 2. Run the deployment script
chmod +x deploy.sh
./deploy.sh production
```

### Manual VPS Setup

#### Step 1: Install Dependencies
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2

# Install Nginx
sudo apt install -y nginx
```

#### Step 2: Setup Application
```bash
# Clone repository
git clone https://github.com/ShekharDewan/programmatic-website-generator.git /opt/website-generator
cd /opt/website-generator

# Install dependencies
npm ci --production

# Build application
npm run build

# Start with PM2
pm2 start npm --name "website-generator" -- start
pm2 save
pm2 startup
```

#### Step 3: Configure Nginx
```bash
# Create Nginx config
sudo nano /etc/nginx/sites-available/website-generator
```

Add this configuration:
```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/website-generator /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

#### Step 4: SSL Certificate (Optional)
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

## 🐳 Docker Deployment

### Using Docker Compose
```bash
# Build and start
docker-compose up -d --build

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

### Using Docker only
```bash
# Build image
docker build -t website-generator .

# Run container
docker run -d -p 3000:3000 --name website-generator website-generator
```

## ☁️ Cloud Platform Deployment

### AWS EC2
1. Launch EC2 instance (Ubuntu 20.04)
2. Configure security groups (ports 22, 80, 443)
3. SSH into instance
4. Run the deployment script: `./deploy.sh production`

### DigitalOcean Droplet
1. Create droplet (Ubuntu 20.04)
2. SSH into droplet
3. Run: `git clone https://github.com/ShekharDewan/programmatic-website-generator.git`
4. Run: `cd programmatic-website-generator && ./deploy.sh production`

### Google Cloud Platform
1. Create Compute Engine instance
2. Configure firewall rules
3. SSH and deploy using the script

## 🔄 Continuous Deployment

### GitHub Actions (Auto-deploy to VPS)
Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to VPS

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - name: Deploy to server
      uses: appleboy/ssh-action@v0.1.5
      with:
        host: ${{ secrets.HOST }}
        username: ${{ secrets.USERNAME }}
        key: ${{ secrets.KEY }}
        script: |
          cd /opt/website-generator
          git pull origin main
          npm ci
          npm run build
          pm2 restart website-generator
```

## 📊 Monitoring & Maintenance

### PM2 Commands
```bash
# View status
pm2 status

# View logs
pm2 logs website-generator

# Restart
pm2 restart website-generator

# Monitor
pm2 monit
```

### Nginx Commands
```bash
# Test configuration
sudo nginx -t

# Reload
sudo systemctl reload nginx

# View logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

## 🛠️ Troubleshooting

### Common Issues

1. **Port 3000 already in use**
   ```bash
   sudo lsof -i :3000
   sudo kill -9 <PID>
   ```

2. **Permission denied**
   ```bash
   sudo chown -R $USER:$USER /opt/website-generator
   ```

3. **Build fails**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   npm run build
   ```

## 🔐 Security Checklist

- [ ] Enable firewall (ufw)
- [ ] Setup SSL certificate
- [ ] Configure fail2ban
- [ ] Regular security updates
- [ ] Use environment variables for secrets
- [ ] Setup backup strategy

## 📈 Performance Optimization

- [ ] Enable Nginx gzip compression
- [ ] Setup CDN (CloudFlare)
- [ ] Configure caching headers
- [ ] Monitor with tools like New Relic or DataDog
- [ ] Setup log rotation

---

Choose the deployment method that best fits your needs:
- **Vercel/Netlify**: For quick, hassle-free deployment
- **VPS**: For full control and custom configurations
- **Docker**: For containerized, scalable deployments 