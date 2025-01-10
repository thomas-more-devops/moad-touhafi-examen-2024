# Development Stage
FROM node:18 AS development

# Set working directory
WORKDIR /app

# Copy package.json and install all dependencies
COPY package*.json ./
RUN npm install

# Install nodemon globally for live updates
RUN npm install -g nodemon

# Copy the rest of the application files
COPY . .

# Expose port for development server
EXPOSE 3000

# Start the development server with nodemon
CMD ["nodemon", "index.js"]

# Production Stage
FROM node:18 AS production

# Set working directory
WORKDIR /app

# Copy package.json and install only production dependencies
COPY package*.json ./
RUN npm install --only=production

# Copy application files (excluding dev-only files like .env.local)
COPY . .

# Expose port for the backend server
EXPOSE 3000

# Start the production server
CMD ["node", "index.js"]
