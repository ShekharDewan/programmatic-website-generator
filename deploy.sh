#!/bin/bash

# Deployment script for Programmatic Content Generator
# Usage: ./deploy.sh [production|staging]

set -e

ENVIRONMENT=${1:-production}
APP_NAME="website-generator"
REPO_URL="https://github.com/ShekharDewan/programmatic-website-generator.git"

echo "🚀 Starting deployment for $ENVIRONMENT environment..."

# Update system packages
echo "📦 Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install Node.js if not present
if ! command -v node &> /dev/null; then
    echo "📦 Installing Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

# Install Docker if not present
if ! command -v docker &> /dev/null; then
    echo "🐳 Installing Docker..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker $USER
fi

# Install Docker Compose if not present
if ! command -v docker-compose &> /dev/null; then
    echo "🐳 Installing Docker Compose..."
    sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
fi

# Create application directory
APP_DIR="/opt/$APP_NAME"
sudo mkdir -p $APP_DIR
sudo chown $USER:$USER $APP_DIR

# Clone or update repository
if [ -d "$APP_DIR/.git" ]; then
    echo "📥 Updating repository..."
    cd $APP_DIR
    git pull origin main
else
    echo "📥 Cloning repository..."
    git clone $REPO_URL $APP_DIR
    cd $APP_DIR
fi

# Install dependencies and build
echo "📦 Installing dependencies..."
npm ci

echo "🔨 Building application..."
npm run build

# Start with Docker Compose
echo "🚀 Starting application with Docker..."
docker-compose down || true
docker-compose up -d --build

# Setup nginx (optional)
if [ "$ENVIRONMENT" = "production" ]; then
    echo "🌐 Setting up Nginx..."
    sudo apt install -y nginx
    
    # Create nginx config
    sudo tee /etc/nginx/sites-available/$APP_NAME > /dev/null <<EOF
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

    # Enable site
    sudo ln -sf /etc/nginx/sites-available/$APP_NAME /etc/nginx/sites-enabled/
    sudo nginx -t && sudo systemctl reload nginx
fi

echo "✅ Deployment completed successfully!"
echo "🌐 Application is running on http://localhost:3000"

if [ "$ENVIRONMENT" = "production" ]; then
    echo "🌐 Production site available at http://your-domain.com"
    echo "🔒 To enable HTTPS, run: sudo certbot --nginx -d your-domain.com"
fi 