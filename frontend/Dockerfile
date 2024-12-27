# 1. Gebruik een Node.js image om de applicatie te bouwen
FROM node:18 as build

# 2. Stel de werkdirectory in
WORKDIR /app

# 3. Kopieer package.json en package-lock.json
COPY package*.json ./

# 4. Installeer dependencies
RUN npm install

# 5. Kopieer de rest van de bestanden
COPY . .

# 6. Build de applicatie
RUN npm run build

# 7. Gebruik een lichtgewicht server image om de build te hosten
FROM nginx:alpine

# 8. Kopieer de gecompileerde bestanden naar de server directory
COPY --from=build /app/dist /usr/share/nginx/html

# 9. Exposeer poort 80
EXPOSE 80

# 10. Start Nginx
CMD ["nginx", "-g", "daemon off;"]
