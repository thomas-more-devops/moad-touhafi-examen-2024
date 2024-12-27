# 1. Use Node.js image to build the application
FROM node:18 as build

# 2. Set working directory
WORKDIR /app

# 3. Copy package.json and package-lock.json
COPY package*.json ./

# 4. Install dependencies
RUN npm install

# 5. Copy the rest of the files
COPY . .

# 6. Set environment variable for build
ARG VUE_APP_BACKEND_API_URL
ENV VUE_APP_BACKEND_API_URL=${VUE_APP_BACKEND_API_URL}

# 7. Build the application
RUN npm run build

# 8. Use a lightweight server to host the build
FROM nginx:alpine

# 9. Copy the built files to the NGINX directory
COPY --from=build /app/dist /usr/share/nginx/html

# 10. Add a custom Nginx configuration for routing API requests
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

# 11. Expose port 80
EXPOSE 80

# 12. Start NGINX
CMD ["nginx", "-g", "daemon off;"]
