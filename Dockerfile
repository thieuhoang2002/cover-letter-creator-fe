# ==============================================================================
# Multi-stage Dockerfile for React SPA with Vite & Nginx Alpine
# ==============================================================================

# ------------------------------------------------------------------------------
# Stage 1: Build environment
# ------------------------------------------------------------------------------
FROM node:20-alpine AS builder

WORKDIR /app

# Sao chép file định nghĩa dependencies
COPY package.json package-lock.json ./

# Cài đặt dependencies (dùng clean install nếu có package-lock)
RUN npm ci

# Sao chép toàn bộ mã nguồn
COPY . .

# Khai báo các biến build-time cho Vite (bắt đầu bằng VITE_)
ARG VITE_BACKEND_URL=http://localhost:8080
ARG VITE_API_KEY_TINY=no-api-key
ARG VITE_CLIENT_ID=""
ARG VITE_GITHUB_CLIENT_ID=""
ARG VITE_GITHUB_REDIRECT_URI=""

ENV VITE_BACKEND_URL=$VITE_BACKEND_URL \
    VITE_API_KEY_TINY=$VITE_API_KEY_TINY \
    VITE_CLIENT_ID=$VITE_CLIENT_ID \
    VITE_GITHUB_CLIENT_ID=$VITE_GITHUB_CLIENT_ID \
    VITE_GITHUB_REDIRECT_URI=$VITE_GITHUB_REDIRECT_URI

# Thực hiện build mã nguồn thành các static assets trong /app/dist
RUN npm run build

# ------------------------------------------------------------------------------
# Stage 2: Production runtime with Nginx Alpine
# ------------------------------------------------------------------------------
FROM nginx:1.27-alpine

# Xóa trang mặc định của Nginx
RUN rm -rf /usr/share/nginx/html/*

# Copy cấu hình custom Nginx hỗ trợ SPA fallback
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy static assets đã build từ Stage 1
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose cổng 80
EXPOSE 80

# Chạy Nginx ở foreground
CMD ["nginx", "-g", "daemon off;"]
