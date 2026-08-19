# =============================================================
# CloudStay — Backend Dockerfile
# Node.js 18 LTS (Alpine for smaller image)
# =============================================================

# Stage 1: Production image
FROM node:18-alpine

# Install system dependencies required by some npm packages
RUN apk add --no-cache dumb-init

# Set working directory
WORKDIR /app

# Copy package files first (maximises Docker layer caching)
COPY package.json package-lock.json ./

# Install production dependencies only
RUN npm ci --omit=dev

# Copy application source
COPY src ./src

# Create logs directory (winston writes here)
RUN mkdir -p logs

# Do NOT copy .env — secrets are injected via docker-compose environment
EXPOSE 5000

# Use dumb-init so Node.js receives SIGTERM correctly
ENTRYPOINT ["dumb-init", "--"]
CMD ["npm", "start"]