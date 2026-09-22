# 📋 PROJECT ROADMAP & AUDIT CHECKLIST — FRONTEND (TODO.md)

Theo dõi chi tiết lộ trình phát triển, các tính năng đã hoàn thiện và danh sách nhiệm vụ kỹ thuật nâng cấp toàn diện dự án **Cover Letter Creator Frontend** trên nhánh `main` và `dev`.

---

## ✅ 1. Trạng Thái Đã Hoàn Thành (Production & Live)

### 1.1. Hạ Tầng, Triển Khai & Build Tối Ưu
- [x] **Triển khai Vercel Production**: `https://cover-letter-creator-fe.vercel.app` (kết nối Backend Render `https://cover-letter-creator-be-eadm.onrender.com`).
- [x] **SPA Routing Fallback**: Cấu hình `vercel.json` định tuyến an toàn, chống triệt để lỗi 404 khi tải lại trang con.
- [x] **Quản lý Môi trường**: Tách biến chuẩn Vite (`VITE_BACKEND_URL`, `VITE_API_KEY_TINY`, `VITE_CLIENT_ID`, `VITE_GITHUB_CLIENT_ID`).
- [x] **Bundle Optimization & Vite 5**:
  - [x] Tách `React.lazy()` và `<Suspense fallback={<LoadingFallback />}>` cho toàn bộ các trang chức năng.
  - [x] Loại bỏ cấu hình `manualChunks` gây lỗi xung đột tuần hoàn (Circular Dependency `ReferenceError: Cannot access 'gn' before initialization`). Hệ thống sử dụng phân tách chunk động tự nhiên của Vite 5 cực kỳ ổn định.

### 1.2. Xác Thực, Phân Quyền & Bảo Mật
- [x] Đăng nhập / Đăng ký truyền thống (Email & Password) kèm Validation Regex email chuẩn và mật khẩu >= 6 ký tự.
- [x] Đăng nhập Google One Tap & Google OAuth 2.0 (`@react-oauth/google`).
- [x] Đăng nhập GitHub OAuth callback flow (`/auth-callback`).
- [x] Bảo toàn vai trò (Role `vip` / `admin`) và Avatar tùy chỉnh từ Cloudflare R2 khi đăng nhập mạng xã hội.
- [x] Quản lý phiên làm việc tập trung qua `AuthContext` và giải mã JWT token (chuẩn hóa role lowercase).
- [x] Phân quyền route guard `PrivateRoute` hỗ trợ mảng `allowedRoles` (ví dụ `allowedRoles={['admin']}`).
- [x] Quy trình Quên mật khẩu & Đặt lại mật khẩu (`/forgot-password`, `/reset-password`) với UI SaaS 2026 hiện đại.
- [x] Đổi mật khẩu (`/change-password`): Hỗ trợ phân nhánh thông minh cho tài khoản Google/GitHub chưa có mật khẩu (bỏ qua mật khẩu cũ) thông qua API kiểm tra `has-password`.
- [x] Đồng bộ thông báo khi bị Rate Limit (HTTP 429) từ hệ thống.

### 1.3. Giao Diện Người Dùng & Trải Nghiệm Chuẩn SaaS 2026
- [x] **Dark / Light Mode Theme Engine**: Tích hợp công tắc chuyển đổi giao diện sáng/tối vào Navbar, lưu trạng thái theme vào `localStorage`.
- [x] **Navbar & User Dropdown**:
  - [x] Thiết kế Glassmorphism hiện đại, hiển thị avatar người dùng.
  - [x] **Điểm nhấn thành viên VIP**: Viền phát sáng vàng kim hoàng gia rực rỡ (`border: '2.5px solid #f59e0b'`, `boxShadow: '0 0 12px rgba(245, 158, 11, 0.55)'`), đính kèm vương miện VIP nhỏ (`VipCrownIcon`) và chip gradient "Thành Viên VIP" trong menu.
  - [x] Sửa nút "Đăng nhập" trên header mobile không bị ngắt thành 2 dòng.
- [x] **Tối Ưu Trang Chủ (`Home.jsx`)**:
  - [x] Bố cục khối Social Proof (5 sao ⭐⭐⭐⭐⭐ + số liệu người dùng) căn giữa, khoảng cách và dòng thoáng đãng trên mobile/tablet.
  - [x] Cụm nút bấm CTA co dãn full-width tiện thao tác ngón tay trên điện thoại.
- [x] **Mẫu CV & Đơn Xin Việc Yêu Thích (`LoveTemplate.jsx`)**:
  - [x] Tái thiết kế thanh Filter Tabs theo phong cách **Segmented Pill** hiện đại (kiểu Apple / SaaS).
  - [x] Ẩn đường gạch chân cắt ngang viền, tab active có bo góc mềm mại, đổ bóng nhẹ nhàng.
- [x] **Theo Dõi Tiến Trình Ứng Tuyển (`FollowCV.jsx`)**:
  - [x] Tối ưu hóa các thẻ KPI chỉ số co giãn mượt mà theo màn hình điện thoại/tablet.
  - [x] Thẻ CV mobile hiển thị huy hiệu trạng thái cùng nhãn phân biệt nguồn (Uploaded 📎 / Hệ thống 🔗).
  - [x] Tên CV tự động xuống dòng linh hoạt (`wordBreak: 'break-word'`), các nút hành động "Xem PDF", "Cập nhật", "Xóa" dàn đều kích thước touch-friendly.
  - [x] Thanh đo Quota hiển thị trực quan dung lượng đã dùng trên tổng 30 CV (đối với VIP) hoặc 3 CV (đối với Thường).
  - [x] Modal tải lên CV cá nhân dạng PDF (tối đa 10MB) lưu trực tiếp lên Cloudflare R2.
  - [x] Modal gửi yêu cầu nâng cấp gói Pro VIP / Enterprise.
- [x] **Hồ Sơ Cá Nhân (`Information.jsx`)**:
  - [x] Nút đổi avatar tải ảnh lên Cloudflare R2, tự động xóa avatar cũ và cập nhật ngay lên Header.

### 1.4. Quản Trị Admin SaaS 2026 (`/admin`)
- [x] `AdminHomePage`: Drawer sidebar đa năng có khả năng thu gọn (collapsed mode).
- [x] `AdminDashboard`: KPI cards, biểu đồ Bar/Pie Chart.js, Bảng xếp hạng Top 5 mẫu xem nhiều nhất.
- [x] `UserManager`: Quản lý danh sách người dùng với DataGrid và bộ lọc tìm kiếm tức thì.
- [x] `VipUpgradeManager`: Xem danh sách người dùng yêu cầu nâng cấp VIP và trực tiếp Phê duyệt / Từ chối.
- [x] `TemplateManager` & `ModernCVTemplateManager`: Quản lý mẫu đơn nhà nước và mẫu CV hiện đại.

---

## 🚀 2. Kế Hoạch Nâng Cấp Tiếp Theo (Phase 3 Roadmap)

### ⚡ 2.1. Live Split-Screen Editor & Realtime Preview
- [ ] Giao diện chia đôi màn hình: Trình soạn thảo bên trái và Bản xem trước PDF render theo thời gian thực bên phải.
- [ ] Tự động lưu bản nháp (Auto-save) sau mỗi 5 giây chỉnh sửa nội dung.

### 🤖 2.2. AI Co-Pilot & Streaming Chat
- [ ] Khung chat AI trợ lý ảo bên cạnh CV: Người dùng có thể yêu cầu "Viết lại phần kinh nghiệm cho ấn tượng hơn", "Tóm tắt mục tiêu nghề nghiệp ngắn gọn".
- [ ] Hiệu ứng gõ chữ thời gian thực (Streaming typewriter effect) với Server-Sent Events (SSE).

### 🌐 2.3. Online Portfolio & Trang Chia Sẻ Công Khai
- [ ] Tạo trang đích (Landing Profile) cá nhân dựa trên thông tin CV với đường link công khai có thể chia sẻ trực tiếp lên LinkedIn / Facebook.
