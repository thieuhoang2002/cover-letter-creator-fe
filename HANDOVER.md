# HƯỚNG DẪN BÀN GIAO & VẬN HÀNH (HANDOVER.MD)

Tài liệu hướng dẫn thiết lập môi trường phát triển (Local Development), cấu hình kết nối Backend và quy trình triển khai ứng dụng Frontend **cover-letter-creator-fe**.

---

## 1. Yêu cầu Môi trường (Prerequisites)

- **Node.js**: Phiên bản `>= 18.0.0` (Khuyến nghị sử dụng **Node.js 20 LTS** hoặc **Node.js 22 LTS**).
- **Trình quản lý gói**: `npm` (đi kèm Node.js), `yarn` hoặc `pnpm`.
- **Backend Service**: Server Spring Boot đang hoạt động tại `http://localhost:8080` hoặc URL Render production.

---

## 2. Thiết lập Môi trường Phát triển (Quick Start)

### Bước 1: Sao chép & Cài đặt Thư viện
```bash
# Di chuyển vào thư mục dự án
cd cover-letter-creator-fe

# Cài đặt toàn bộ dependencies theo lockfile
npm install
```

### Bước 2: Thiết lập Biến Môi trường (.env)
Tạo file `.env` từ file mẫu `.env.example`:
```bash
# Windows PowerShell:
Copy-Item .env.example .env

# Linux / macOS:
cp .env.example .env
```

Mở file `.env` vừa tạo và điền các giá trị thực tế:
```env
# URL kết nối backend Spring Boot
VITE_BACKEND_URL=http://localhost:8080

# API Key cho trình soạn thảo TinyMCE (nếu chưa có có thể tạm để no-api-key)
VITE_API_KEY_TINY=your_tinymce_api_key_here

# Client ID đăng nhập Google OAuth
VITE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com

# Client ID đăng nhập GitHub OAuth
VITE_GITHUB_CLIENT_ID=your_github_client_id
```

### Bước 3: Khởi chạy Máy chủ Phát triển (Dev Server)
```bash
npm run dev
```
- **URL truy cập mặc định**: `http://localhost:5173`
- Dự án hỗ trợ Hot Module Replacement (HMR) cực nhanh thông qua `@vitejs/plugin-react-swc`.

---

## 3. Các Lệnh Thường Dùng (Available Scripts)

| Lệnh thực thi | Mục đích |
| :--- | :--- |
| `npm run dev` | Khởi chạy máy chủ phát triển Vite tại cổng 5173 |
| `npm run build` | Đóng gói mã nguồn tối ưu cho môi trường Production (kết quả tại thư mục `dist/`) |
| `npm run lint` | Quét kiểm tra cú pháp và chất lượng mã nguồn bằng ESLint |
| `npm run preview` | Khởi chạy máy chủ tĩnh cục bộ để kiểm tra bản build trong `dist/` |

---

## 4. Cấu hình Mạng & Kết nối Backend (Networking Notes)

1. **Port mặc định**:
   - Frontend: `5173` (Vite)
   - Backend: `8080` (Spring Boot)
2. **CORS Configuration**:
   - Backend Spring Boot cho phép origin `http://localhost:5173` và `https://cover-letter-creator-fe.vercel.app`.
3. **Cơ chế tải file PDF**:
   - Các API xuất PDF trả về trực tiếp stream binary (`application/pdf`).
   - Frontend tự động mở hộp thoại lưu file của trình duyệt và tải file PDF về máy người dùng ngay tức thì.

---

## 5. Xử lý Sự cố Thường gặp (Troubleshooting)

### Vấn đề 1: Trình soạn thảo TinyMCE hiện cảnh báo "This domain is not registered"
- **Nguyên nhân**: Đang dùng API key mặc định hoặc chưa thêm domain localhost trên dashboard của Tiny Cloud.
- **Giải pháp**: Đăng ký tài khoản miễn phí tại [tiny.cloud](https://www.tiny.cloud/), thêm domain `localhost` và domain Vercel vào danh sách Allowed Domains rồi dán key vào `VITE_API_KEY_TINY`.

### Vấn đề 2: Lỗi "Cannot access before initialization" trên Vercel sau khi build
- **Nguyên nhân**: Do cấu hình `manualChunks` cố tình ép chia tách `@mui` và `react` thành 2 chunk vendor riêng rẽ, gây ra lỗi vòng phụ thuộc tuần hoàn (Circular Dependency) trong Rollup.
- **Giải pháp**: Không cấu hình `manualChunks` thủ công trong `vite.config.js`. Hãy để Vite 5 tự động phân tích đồ thị phụ thuộc tự nhiên.

### Vấn đề 3: Refresh trang bị lỗi 404 khi deploy lên Nginx / Static Hosting
- **Nguyên nhân**: Ứng dụng SPA (Single Page Application) cần fallback về `index.html`.
- **Giải pháp**: Dự án đã có sẵn file `vercel.json` cho Vercel và `nginx.conf` cho Docker Nginx.

### Vấn đề 4: Nút "Tải xuống PDF" bị khóa hoặc xuất trùng nhiều file
- **Cơ chế hoạt động**: Frontend sử dụng state `isExporting` để chủ động khóa nút (`disabled`) kèm chữ `"Đang xuất PDF..."` cho đến khi quá trình xuất hoàn tất. Backend đồng thời áp dụng Deduplication Guard 10s.
