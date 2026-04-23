# Stage 1: Build (Upgraded to Node 22 for Vite 7 compatibility)
FROM node:22-alpine AS build

WORKDIR /app

# Copy frontend package files from the frontend subfolder
COPY frontend/package*.json ./

# Clean install to avoid dependency conflicts
RUN npm install --legacy-peer-deps

# Copy the rest of the frontend source code
COPY frontend/ .

# Run the build command
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:stable-alpine

# Copy the build output from the previous stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx config from the frontend subfolder
COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]