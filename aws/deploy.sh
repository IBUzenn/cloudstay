#!/bin/bash
# deploy.sh
# Automated deployment script for CloudStay application
# Run this from the project root (/var/www/CloudStay)

set -e

APP_DIR="/var/www/CloudStay"
BACKEND_DIR="$APP_DIR/backend"
FRONTEND_DIR="$APP_DIR/frontend"

echo "=========================================="
echo "Deploying CloudStay Application..."
echo "=========================================="

cd $APP_DIR

# 1. Pull latest code
echo "--> Pulling latest code from git..."
git pull origin main

# 2. Setup Backend
echo "--> Setting up backend..."
cd $BACKEND_DIR
npm install --production

# 3. Setup Frontend
echo "--> Setting up frontend..."
cd $FRONTEND_DIR
npm install
echo "--> Building frontend for production..."
npm run build

# 4. Restart Backend via PM2
echo "--> Restarting PM2 backend cluster..."
cd $BACKEND_DIR
# Use ecosystem.config.js for PM2 configuration
pm2 start ecosystem.config.js --env production || pm2 restart ecosystem.config.js --env production
pm2 save

# 5. Reload Nginx configuration
echo "--> Reloading Nginx configuration..."
# Copy the config if needed, then reload
sudo cp $APP_DIR/aws/nginx.conf /etc/nginx/conf.d/cloudstay.conf
sudo systemctl reload nginx

# 6. Reload CloudWatch Agent (optional but good practice if config changed)
echo "--> Reloading CloudWatch Agent configuration..."
sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl -a fetch-config -m ec2 -s -c file:$APP_DIR/aws/cloudwatch-config.json

echo "=========================================="
echo "Deployment Successful!"
echo "=========================================="
