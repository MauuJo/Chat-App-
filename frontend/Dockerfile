# Stage 1: Build (Upgraded to Node 22 for Vite 7 compatibility)
FROM node:22-alpine AS build

WORKDIR /app

# We are already inside the frontend folder, so we copy locally
COPY package*.json ./

# Clean install to avoid dependency conflicts
RUN npm install --legacy-peer-deps

# Copy the rest of the frontend source code
COPY . .

# Run the build command
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:stable-alpine

# Copy the build output from the previous stage
COPY --from=build /app/dist /usr/share/nginx/html

# IMPORTANT: Ensure you actually have a file named 'nginx.conf' in your frontend folder
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]