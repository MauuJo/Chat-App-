FROM node:18-alpine

WORKDIR /app

# Copy root-level package files (this is where package.json lives)
COPY package*.json ./

RUN npm install

# Copy the backend source code
COPY backend/ ./backend/

EXPOSE 5000

CMD ["node", "backend/server.js"]
