# Cover Letter Creator Frontend

<div align="center">

![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-5.4.10-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Material UI](https://img.shields.io/badge/MUI-6.4.7-007FFF?style=for-the-badge&logo=mui&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-1.8.3-5A29E4?style=for-the-badge&logo=axios&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

**Ứng dụng trực tuyến chuyên nghiệp tạo Đơn xin việc (Cover Letter), CV Hiện đại và CV sinh bởi AI Groq Cloud, hỗ trợ xuất và tải trực tiếp PDF chất lượng cao.**

[Khởi Chạy Nhanh](#-hướng-dẫn-khởi-chạy-nhanh) • [Tính Năng](#-tính-năng-nổi-bật) • [Bộ Tài Liệu Kiến Trúc](#-bộ-tài-liệu-kiến-trúc-dự-án) • [Docker Deploy](#-triển-khai-với-docker)

</div>

---

## 📖 Giới thiệu Dự án

**Cover Letter Creator Frontend** là nền tảng Single Page Application (SPA) xây dựng bằng **React 18** và **Vite**, kết nối với hệ thống Backend **Java Spring Boot 3.4.3**.

Ứng dụng vừa được nâng cấp toàn diện:
- 🚀 **Trí tuệ nhân tạo Groq Cloud**: Nâng cấp lên model **`openai/gpt-oss-120b`** (kết hợp tự động fallback sang `llama-3.3-70b-versatile`), sinh nội dung CV thần tốc và chuẩn mực theo từng vị trí ứng tuyển.
- 📥 **Tải trực tiếp PDF (Direct Binary Stream)**: Bỏ phụ thuộc vào Google Drive cũ, xuất trực tiếp stream file PDF (`application/pdf`) về máy người dùng và lưu trữ đám mây vĩnh viễn qua **Cloudflare R2**.
- 🛡️ **Bảo vệ Chống Click Trùng (Anti-Spam Export Lock)**: Tích hợp cờ khóa nút bấm `isExporting` và Deduplication Guard 10s ngăn ngừa phát sinh bản ghi trùng lặp khi xuất PDF.
- 🎨 **Kho Template Mẫu Sẵn Có**: Đã nạp sẵn bộ mẫu Cover Letter và Modern CV chuẩn vào cơ sở dữ liệu (`seed_templates.sql`).
- 🔐 **Bảo mật & Định tuyến**: Tích hợp xác thực kép **Google OAuth 2.0** & **GitHub OAuth**, bảo vệ phân quyền với `PrivateRoute` (Admin vs User).

---

## ✨ Tính năng Nổi bật

| Nhóm chức năng | Mô tả chi tiết |
| :--- | :--- |
| 🤖 **Tạo CV với AI (Groq Cloud)** | Nhập vị trí công việc, chọn bảng màu; AI (`openai/gpt-oss-120b`) sinh cấu trúc CV chuẩn A4 và cho phép tinh chỉnh trước khi xuất bản. |
| 📄 **Cover Letter & Modern CV** | Thư viện mẫu phong phú đã seed sẵn; trình soạn thảo TinyMCE trực quan, hỗ trợ lưu nháp (`localStorage`). |
| ⚡ **Xuất PDF Binary Trực tiếp** | Nhận luồng nhị phân trực tiếp từ backend, tự động kích hoạt tải file về máy và dọn dẹp bộ nhớ Object URL. |
| 🛡️ **Khóa Nút Chống Double-Click** | Khóa tương tác nút Tải PDF và hiển thị spinner trạng thái cho đến khi hoàn tất chuyển trang. |
| 📌 **Theo dõi Ứng tuyển (Follow CV)** | Quản lý trạng thái nộp hồ sơ (`Pending`, `Interview`, `Accepted`), ghi chú công ty và liên kết xem lại file trên Cloudflare R2. |
| 🔐 **Xác thực Đa kênh** | Đăng nhập truyền thống, Google One Tap / OAuth và GitHub OAuth kèm cơ chế tự động logout khi JWT hết hạn. |
| 📊 **Quản trị Toàn diện (Admin)** | Dashboard thống kê trực quan với Recharts & Chart.js, quản lý danh sách người dùng và CRUD mẫu tài liệu. |

---

## 📚 Bộ Tài Liệu Kiến Trúc Dự Án

Hệ thống tài liệu chuyên sâu dành cho Senior Architect, Developers và DevOps:

| Tài liệu | Nội dung chính |
| :--- | :--- |
| 📌 [**PROJECT_SPEC.md**](./PROJECT_SPEC.md) | Đặc tả luồng UI/UX, Sitemap, chi tiết 3 luồng tạo CV/Cover Letter, State Management và Security Guard. |
| 🛠️ [**TECHSTACK.md**](./TECHSTACK.md) | Phân tích chi tiết công nghệ, phiên bản (React, Vite, MUI v6, TinyMCE, Axios...) và cấu trúc thư mục. |
| 📋 [**TODO.md**](./TODO.md) | Checklist tính năng hoàn thành, tồn đọng kỹ thuật (Code Splitting, TypeScript, TanStack Query). |
| 🤝 [**HANDOVER.md**](./HANDOVER.md) | Hướng dẫn bàn giao môi trường, cài đặt npm/yarn/pnpm, cấu hình port 5173 / 8080 và xử lý sự cố. |
| 🐳 [**DOCKER.md**](./DOCKER.md) | Hướng dẫn Dockerize Multi-stage (Node builder + Nginx Alpine runner), cấu hình SPA routing và docker-compose. |

---

## 🚀 Hướng dẫn Khởi chạy Nhanh

### 1. Yêu cầu Hệ thống
- **Node.js**: Phiên bản `>= 18.0.0` (Khuyến nghị Node 20 LTS)
- **Backend**: Spring Boot server đang chạy tại `http://localhost:8080`

### 2. Cài đặt & Khởi động
```bash
# 1. Clone repository và truy cập thư mục
cd cover-letter-creator-fe

# 2. Cài đặt các gói phụ thuộc
npm install

# 3. Thiết lập biến môi trường
cp .env.example .env
# (Chỉnh sửa thông tin trong file .env nếu cần)

# 4. Khởi chạy máy chủ phát triển
npm run dev
```
Truy cập giao diện tại: **`http://localhost:5173`**

---

## ⚙️ Biến Môi trường (.env)

| Biến môi trường | Bắt buộc | Mặc định | Mô tả |
| :--- | :---: | :--- | :--- |
| `VITE_BACKEND_URL` | Có | `http://localhost:8080` | URL API máy chủ Spring Boot |
| `VITE_API_KEY_TINY` | Không | `no-api-key` | API Key trình soạn thảo TinyMCE |
| `VITE_CLIENT_ID` | Có | — | Google OAuth 2.0 Web Client ID |
| `VITE_GITHUB_CLIENT_ID` | Có | — | GitHub OAuth Application Client ID |
| `VITE_GITHUB_REDIRECT_URI` | Không | `${origin}/auth-callback` | Tùy chọn Redirect URI cho GitHub OAuth |

---

## 🐳 Triển khai với Docker

Dự án cung cấp sẵn `Dockerfile` multi-stage và cấu hình `nginx.conf` chuẩn:

```bash
# Build Docker image
docker build -t cover-letter-fe:latest .

# Khởi chạy container trên cổng 3000
docker run -d -p 3000:80 --name cover-letter-fe cover-letter-fe:latest
```

---

## 🛡️ Giấy phép (License)
Dự án được phân phối dưới giấy phép [MIT License](./package.json).
