# 1. Use Node.js image as a base
FROM node:18

# 2. Set working directory
WORKDIR /app

# 3. Copy package.json and package-lock.json
COPY package*.json ./

# 4. Install Node.js dependencies
RUN npm install

# 5. Copy the rest of the application files
COPY . .

# 6. Expose the backend port
EXPOSE 3000

# 7. Run the application
CMD ["node", "index.js"]
