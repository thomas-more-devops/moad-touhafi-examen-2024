# Development Stage
FROM node:18 AS development

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the files
COPY . .

# Build the application for production
RUN npm run build

# Production Stage
FROM nginx:alpine AS production

# Set working directory
WORKDIR /usr/share/nginx/html

# Copy built files from the development stage
COPY --from=development /app/dist .

# Expose port for the production server
EXPOSE 80

# Start NGINX
CMD ["nginx", "-g", "daemon off;"]
