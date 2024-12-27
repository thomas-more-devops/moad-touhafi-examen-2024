# 1. Gebruik een officieel Node.js image
FROM node:18

# 2. Stel de werkdirectory in binnen de container
WORKDIR /app

# 3. Kopieer package.json en package-lock.json naar de container
COPY package*.json ./

# 4. Installeer de benodigde dependencies
RUN npm install

# 5. Kopieer de rest van de bestanden naar de container
COPY . .

# 6. Exposeer de poort die je backend gebruikt
EXPOSE 3000

# 7. Start de applicatie
CMD ["node", "index.js"]
