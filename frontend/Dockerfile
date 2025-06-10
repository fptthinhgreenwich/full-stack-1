# frontend/Dockerfile

# Stage 1: Build React App
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . ./
# Pass API_URL as build argument, or it will use the one from .env if present during build
ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=${REACT_APP_API_URL}
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:1.25-alpine
# Create non-root user for nginx (nginx official images often run as root by default for master process)
# For simplicity, we'll use default nginx user or configure it.
# Nginx alpine images already have an 'nginx' user.
# We need to ensure nginx can read the files and write logs.

COPY --from=builder /app/build /usr/share/nginx/html

# Optional: Custom nginx config if needed (e.g., for client-side routing)
# COPY nginx.conf /etc/nginx/conf.d/default.conf
# Example nginx.conf for React Router:
# server {
#   listen 80;
#   root /usr/share/nginx/html;
#   index index.html index.htm;
#   location / {
#     try_files $uri $uri/ /index.html;
#   }
# }

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]