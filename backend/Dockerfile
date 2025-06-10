# backend/Dockerfile
FROM node:18-alpine

WORKDIR /usr/src/app

# Create non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN chown -R appuser:appgroup /usr/src/app

USER appuser
EXPOSE 5001
CMD [ "node", "server.js" ]