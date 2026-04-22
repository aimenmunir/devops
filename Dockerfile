# Stage 1: Build Stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev if any)
RUN npm install

# Copy source code
COPY . .

# Stage 2: Production Stage
FROM node:18-alpine AS runner

WORKDIR /app

# Set environment to production
ENV NODE_ENV=production

# Copy only production dependencies from builder
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/server.js ./
COPY --from=builder /app/public ./public
RUN npm install --only=production

# Best Practice: Use a non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# Expose the application port
EXPOSE 3000

# Command to run the application
CMD ["node", "server.js"]
