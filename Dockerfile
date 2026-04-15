# Use Node LTS
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all files
COPY . .

# Build frontend + backend
RUN npm run build

# Expose port
EXPOSE 3000

# Start server
CMD ["node", "dist/server.cjs"]