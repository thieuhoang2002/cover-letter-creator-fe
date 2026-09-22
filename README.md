# Cover Letter Creator Frontend

<div align="center">

![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-5.4.10-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Material UI](https://img.shields.io/badge/MUI-6.4.7-007FFF?style=for-the-badge&logo=mui&logoColor=white)
![Deployment](https://img.shields.io/badge/Vercel-Live%20Production-black?style=for-the-badge&logo=vercel)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

**Ứng dụng trực tuyến chuyên nghiệp tạo Đơn xin việc (Cover Letter), CV Hiện đại và CV sinh bởi AI Groq Cloud, hỗ trợ xuất và tải trực tiếp PDF chất lượng cao.**

🌐 **Trang chủ Production:** [https://cover-letter-creator-fe.vercel.app](https://cover-letter-creator-fe.vercel.app)  
🔌 **Backend Render API:** [https://cover-letter-creator-be-eadm.onrender.com](https://cover-letter-creator-be-eadm.onrender.com)

[Khởi Chạy Nhanh](#-hướng-dẫn-khởi-chạy-nhanh) • [Tính Năng](#-tính-năng-nổi-bật) • [Bộ Tài Liệu Kiến Trúc](#-bộ-tài-liệu-kiến-trúc-dự-án) • [Docker Deploy](#-triển-khai-với-docker)

</div>

---

## 📖 Giới thiệu Dự án

**Cover Letter Creator Frontend** là nền tảng Single Page Application (SPA) xây dựng bằng **React 18** và **Vite**, kết nối với hệ thống Backend **Java Spring Boot 3.4.3**.

Ứng dụng vừa được nâng cấp toàn diện:
- 🚀 **Trí tuệ nhân tạo Groq Cloud**: Nâng cấp lên model **`openai/gpt-oss-120b`** (kết hợp tự động fallback sang `llama-3.3-70b-versatile`), sinh nội dung CV thần tốc và chuẩn mực theo từng vị trí ứng tuyển.
- 📥 **Tải trực tiếp PDF (Direct Binary Stream)**: Bỏ phụ thuộc vào Google Drive cũ, xuất trực tiếp stream file PDF (`application/pdf`) về máy người dùng và lưu trữ đám mây vĩnh viễn qua **Cloudflare R2**.
- 🛡️ **Bảo vệ Chống Click Trùng (Anti-Spam Export Lock)**: Tích hợp cờ khóa nút bấm `isExporting` và Deduplication Guard 10s ngăn ngừa phát sinh bản ghi trùng lặp khi xuất PDF.
- 🎨 **Kho 11 Template Mẫu Sẵn Có**: Đã nạp sẵn bộ 6 Cover Letter (3 Nhà Nước + 3 Hiện Đại) và 5 Modern CV (2 Nhà Nước + 3 Hiện Đại) vào cơ sở dữ liệu TiDB Cloud (`seed_templates.sql`).
- 🔐 **Bảo mật & Định tuyến**: Tích hợp xác thực kép **Google OAuth 2.0** & **GitHub OAuth**, bảo vệ phân quyền với `PrivateRoute` (Admin vs User).

---

## 🌿 Chiến Lược Phân Nhánh Git (Branching Strategy)

- **`main`**: Nhánh Production được bảo vệ, tự động kích hoạt CI/CD deploy lên **Vercel**.
- **`dev`**: Nhánh phát triển tính năng mới (UI/UX Transformation, Live Split-screen Editor, AI Streaming, Portfolio...). Mọi công việc lập trình được thực hiện trên nhánh này trước khi tích hợp vào `main`.

---

## ✨ Tính năng Nổi bật

| Nhóm chức năng | Mô tả chi tiết |
| :--- | :--- |
| 🤖 **Tạo CV với AI (Groq Cloud)** | Nhập vị trí công việc, chọn bảng màu; AI (`openai/gpt-oss-120b`) sinh cấu trúc CV chuẩn A4 và cho phép tinh chỉnh trước khi xuất bản. |
| 📄 **Cover Letter & Modern CV** | Thư viện 11 mẫu phong phú đã seed sẵn; trình soạn thảo TinyMCE trực quan, hỗ trợ lưu nháp (`localStorage`). |
| ⚡ **Xuất PDF Binary Trực tiếp** | Nhận luồng nhị phân trực tiếp từ backend, tự động kích hoạt tải file về máy và dọn dẹp bộ nhớ Object URL. |
| 🛡️ **Khóa Nút Chống Double-Click** | Khóa tương tác nút Tải PDF và hiển thị spinner trạng thái cho đến khi hoàn tất chuyển trang. |
| 🌓 **Dark / Light Mode Theme** | Tùy chọn giao diện Sáng / Tối phong cách Glassmorphism 2026, lưu trạng thái theme vào `localStorage`. |
| 📱 **Mobile & Tablet Responsive** | Tự động chuyển đổi các bảng Table/DataGrid sang dạng **Thẻ (Card View)** mượt mà trên thiết bị di động `< 900px`, bảo toàn nguyên vẹn 100% Desktop UI. |
| 🚀 **Tối Ưu Bundle & Code Splitting** | `React.lazy()` và phân chia vendor chunks riêng biệt (`vendor-react`, `vendor-mui`, `vendor-datagrid`, `vendor-charts`, `vendor-tinymce`), tăng tốc độ tải trang ban đầu. |
| 📌 **Theo dõi Ứng tuyển (Follow CV)** | Quản lý trạng thái nộp hồ sơ (`Pending`, `Interview`, `Accepted`), ghi chú công ty và liên kết xem lại file trên Cloudflare R2. |
| 🔐 **Xác thực Đa kênh & RBAC** | Đăng nhập truyền thống, Google One Tap / OAuth và GitHub OAuth, phân quyền chặt chẽ với `PrivateRoute` (Admin vs User). |
| 📊 **Quản trị Toàn diện (Admin SaaS 2026)** | Drawer Sidebar thu gọn linh hoạt, Dashboard thống kê Chart.js, Bảng xếp hạng Top mẫu, DataGrid quản lý người dùng & templates. |

---

## 📚 Bộ Tài Liệu Kiến Trúc Dự Án

Hệ thống tài liệu chuyên sâu dành cho Senior Architect, Developers và DevOps:

| Tài liệu | Nội dung chính |
| :--- | :--- |
| 📌 [**PROJECT_SPEC.md**](./PROJECT_SPEC.md) | Đặc tả luồng UI/UX, Sitemap, chi tiết 3 luồng tạo CV/Cover Letter, State Management và Security Guard. |
| 🛠️ [**TECHSTACK.md**](./TECHSTACK.md) | Phân tích chi tiết công nghệ, phiên bản (React, Vite, MUI v6, TinyMCE, Axios...) và cấu trúc thư mục. |
| 📋 [**TODO.md**](./TODO.md) | Checklist tính năng hoàn thành, tồn đọng kỹ thuật và lộ trình phát triển nhánh `dev`. |
| 🤝 [**HANDOVER.md**](./HANDOVER.md) | Hướng dẫn bàn giao môi trường, cài đặt npm/yarn/pnpm, cấu hình port 5173 / 8080 và xử lý sự cố. |
| 🐳 [**DOCKER.md**](./DOCKER.md) | Hướng dẫn Dockerize Multi-stage (Node builder + Nginx Alpine runner), cấu hình SPA routing và docker-compose. |

---

## 🚀 Hướng dẫn Khởi chạy Nhanh

### 1. Yêu cầu Hệ thống
- **Node.js**: Phiên bản `>= 18.0.0` (Khuyến nghị Node 20 LTS)
- **Backend**: Spring Boot server đang chạy tại `http://localhost:8080` hoặc URL Render.

### 2. Cài đặt & Khởi động
```bash
# 1. Clone repository và truy cập thư mục
cd cover-letter-creator-fe

# 2. Cài đặt các gói phụ thuộc
npm install

# 3. Thiết lập biến môi trường
cp .env.example .env

# 4. Khởi chạy máy chủ phát triển
npm run dev
```

Ứng dụng sẽ khả dụng tại: `http://localhost:5173`.
