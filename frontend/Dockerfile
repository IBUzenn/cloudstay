# =============================================================
# CloudStay — Frontend Dockerfile
# Multi-stage: Vite build → Nginx static serving
#
# VITE_API_BASE_URL is a BUILD-TIME variable.
# The browser talks to localhost:5000 (host machine port).
# Do NOT use backend:5000 here — that name only resolves inside
# the Docker network, not in the user's browser.
# =============================================================

# ── Stage 1: Build ────────────────────────────────────────────
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files first for layer caching
COPY package.json package-lock.json ./

# Install all dependencies (including devDependencies needed for vite build)
RUN npm ci

# Copy source code
COPY index.html vite.config.js ./
COPY src ./src
COPY public ./public

# Build argument — can be overridden at build time
ARG VITE_API_BASE_URL=http://localhost:5000/api

# Expose as env var for Vite build (Vite reads import.meta.env.VITE_*)
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}

# Build the production bundle
RUN npm run build

# ── Stage 2: Serve with Nginx ─────────────────────────────────
FROM nginx:1.27-alpine

# Remove default nginx configuration
RUN rm /etc/nginx/conf.d/default.conf

# Copy our custom Nginx config for SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the Vite build output
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80 (nginx default)
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
