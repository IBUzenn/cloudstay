#!/bin/bash
# setup-ec2.sh
# Automated setup script for Amazon Linux 2023 EC2 Instance
# Run as root (sudo ./setup-ec2.sh)

set -e # Exit immediately if a command exits with a non-zero status

echo "=========================================="
echo "Starting EC2 Setup for CloudStay..."
echo "=========================================="

# 1. Update OS packages
echo "--> Updating system packages..."
dnf update -y

# 2. Install Git and Nginx
echo "--> Installing Git and Nginx..."
dnf install git nginx -y

# 3. Install Node.js (v20) via NodeSource
echo "--> Installing Node.js..."
curl -fsSL https://rpm.nodesource.com/setup_20.x | bash -
dnf install -y nodejs

# 4. Install PM2 globally
echo "--> Installing PM2..."
npm install -g pm2
pm2 startup systemd -u ec2-user --hp /home/ec2-user

# 5. Install AWS CloudWatch Agent
echo "--> Installing CloudWatch Agent..."
dnf install amazon-cloudwatch-agent -y

# 6. Configure Nginx
echo "--> Configuring Nginx..."
# (Assuming the repo is cloned to /var/www/CloudStay)
# Wait for deployment to copy nginx.conf, but we can setup the directory permissions
mkdir -p /var/www
chown -R ec2-user:ec2-user /var/www

# Enable and start Nginx
systemctl enable nginx
systemctl start nginx

# 7. Configure CloudWatch Agent (optional here, usually done post-deploy)
# /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl -a fetch-config -m ec2 -s -c file:/var/www/CloudStay/aws/cloudwatch-config.json

echo "=========================================="
echo "EC2 Setup Complete!"
echo "Next Steps:"
echo "1. Clone your repository into /var/www/CloudStay"
echo "2. Run the deploy.sh script to build and start the app."
echo "=========================================="
