# 📋 PROJECT ROADMAP & AUDIT CHECKLIST — FRONTEND (TODO.md)

Theo dõi chi tiết lộ trình phát triển, các tính năng đã hoàn thiện và danh sách nhiệm vụ kỹ thuật nâng cấp toàn diện dự án **Cover Letter Creator Frontend** trên nhánh `dev`.

---

## ✅ 1. Trạng Thái Hiện Tại (Production / Done)

### 1.1. Hạ Tầng & Triển Khai
- [x] **Triển khai Vercel Production**: `https://cover-letter-creator-fe.vercel.app` (kết nối trực tiếp Backend Render `https://cover-letter-creator-be-eadm.onrender.com`).
- [x] **SPA Routing Fallback**: Cấu hình `vercel.json` định tuyến an toàn, chống triệt để lỗi 404 khi tải lại trang con.
- [x] **Quản lý Môi trường**: Tách biến chuẩn Vite (`VITE_BACKEND_URL`, `VITE_API_KEY_TINY`, `VITE_CLIENT_ID`, `VITE_GITHUB_CLIENT_ID`).

### 1.2. Xác Thực & Phân Quyền
- [x] Đăng nhập / Đăng ký truyền thống (Email & Password).
- [x] Đăng nhập Google One Tap & Google OAuth 2.0 (`@react-oauth/google`).
- [x] Đăng nhập GitHub OAuth callback flow (`/auth-callback`).
- [x] Quản lý phiên làm việc tập trung qua `AuthContext` và giải mã JWT token.
- [x] Phân quyền route guard `PrivateRoute` (`admin` vs `user`).
- [x] Giao diện bắt lỗi và thông báo trực quan khi đăng nhập xã hội thất bại.

### 1.3. Tính Năng Cốt Lõi
- [x] Thư viện 11 mẫu: 6 Cover Letter (3 Nhà Nước + 3 Hiện Đại) và 5 Modern CV (2 Nhà Nước + 3 Hiện Đại).
- [x] Soạn thảo TinyMCE và Modern CV theo từng section.
- [x] Sinh CV tự động bằng Groq AI (`openai/gpt-oss-120b`, fallback `llama-3.3-70b-versatile`).
- [x] Xuất và tải trực tiếp PDF Binary Stream (`Blob: application/pdf`).
- [x] Cờ khóa nút `isExporting` chống spam double-click xuất PDF trùng lặp.
- [x] Quản trị Admin (`/admin`): Dashboard thống kê, Quản lý Users, Quản lý Templates.

---

## 🚀 2. Lộ Trình Nâng Cấp Sản Phẩm Chuẩn Senior Architect (Nhánh `dev`)

### 🎨 Phase 1: Lột Xác Giao Diện & Trải Nghiệm (UI/UX Transformation)
- [ ] **Modern Navbar & Branding**:
  - [ ] Thiết kế thanh điều hướng mới phong cách Glassmorphism / Minimalist hiện đại (bỏ thanh xanh cũ).
  - [ ] Hiển thị avatar người dùng có dropdown menu chuyên nghiệp (Hồ sơ, Tài liệu của tôi, Quản trị Admin, Đăng xuất).
  - [ ] Responsive Hamburger Drawer mượt mà trên Mobile & Tablet.
- [ ] **Hero Section & Landing Page Đỉnh Cao**:
  - [ ] Banner chính với thông điệp hấp dẫn, 2 nút Call-to-Action ("Tạo CV với AI", "Khám Phá Mẫu").
  - [ ] Thư viện Template hiển thị dạng **Bento Grid** hiện đại với filter tab ("Tất cả", "Chuẩn Nhà Nước", "Công Nghệ / IT", "Kinh Doanh", "Sáng Tạo").
  - [ ] Card mẫu có hiệu ứng Hover Zoom, nút "Xem Trước Nhanh" (Quick Preview Modal) và "Dùng Mẫu Này".
- [ ] **Giao Diện Đăng Nhập & Đăng Ký (Auth Redesign)**:
  - [ ] Thiết kế lại trang `/login` và `/register` dạng Card nổi bật giữa màn hình, hiệu ứng bo góc tinh tế.
  - [ ] Nút đăng nhập Google và GitHub thiết kế chuẩn Brand Guidelines, hiển thị trực quan và tách biệt rõ ràng.
- [ ] **Dark / Light Mode Theme Engine**:
  - [ ] Tích hợp công tắc đổi giao diện Sáng / Tối vào Navbar, lưu trạng thái vào `localStorage`.

---

### ⚡ Phase 2: Trình Soạn Thảo Thời Gian Thực (Live Split-Screen Interactive Editor)
- [ ] **Giao Diện Split-Screen (Chia Đôi Màn Hình)**:
  - [ ] Cột trái: Form nhập liệu thông minh theo từng section (Thông tin cá nhân, Học vấn, Kinh nghiệm, Kỹ năng, Dự án).
  - [ ] Cột phải: Khung hiển thị Live Preview trực tiếp (WYSIWYG) cập nhật tức thì từng ký tự người dùng gõ.
- [ ] **Tùy Biến Style Linh Hoạt (Style Customizer)**:
  - [ ] Bộ chọn màu chủ đạo (Color Accent Palette): Xanh Navy, Xanh Ngọc Emerald, Đỏ Rượu Burgundy, Xám Tối Giản Charcoal.
  - [ ] Bộ chọn Font chữ chuyên nghiệp hỗ trợ đầy đủ tiếng Việt (Inter, Roboto, Merriweather, Montserrat).
- [ ] **Kéo Thả Sắp Xếp Section (Drag & Drop)**:
  - [ ] Cho phép người dùng kéo thả thay đổi thứ tự các phần (đưa "Kỹ năng" lên trước "Học vấn", v.v.).
- [ ] **Cơ Chế Tự Động Lưu Nháp (Auto-save)**:
  - [ ] Lưu nháp tự động sau mỗi 1.5 giây ngừng gõ (Debounce) vào LocalStorage và Backend API.
  - [ ] Hiển thị biểu tượng nhỏ "Đã lưu nháp lúc hh:mm" tạo sự yên tâm cho người dùng.

---

### 🤖 Phase 3: Siêu Năng Lực AI Thế Hệ Mới (Groq AI Superpowers)
- [ ] **AI Streaming Typing Effect**:
  - [ ] Thay thế vòng quay loading tĩnh bằng hiệu ứng chữ chạy thời gian thực từng từ khi AI sinh nội dung (kết nối SSE từ Backend).
- [ ] **AI ATS Resume Checker (Chấm Điểm & Đánh Giá CV)**:
  - [ ] Modal cho phép người dùng dán bản mô tả công việc (Job Description / JD).
  - [ ] Hiển thị vòng tròn điểm tương thích ATS (0 - 100%), danh sách từ khóa quan trọng còn thiếu, gợi ý chỉnh sửa cụ thể.
- [ ] **Trợ Lý Viết Lại Văn Bản (AI Smart Improver)**:
  - [ ] Nút AI nhỏ bên cạnh mỗi đoạn mô tả kinh nghiệm: Cho phép chọn văn phong ("Chuyên nghiệp hơn", "Ngắn gọn hơn", "Thuyết phục hơn").

---

### 📂 Phase 4: Quản Lý Hồ Sơ Cá Nhân & Chia Sẻ Online (User Portfolio)
- [ ] **Trang Quản Lý CV Cá Nhân (My Documents Dashboard)**:
  - [ ] Màn hình danh sách toàn bộ CV & Cover Letter đã tạo của người dùng dưới dạng lưới thẻ trực quan.
  - [ ] Nút **"Nhân bản" (Duplicate)**: Sao chép nhanh một CV cũ để chỉnh sửa nộp công ty khác mà không phải gõ lại từ đầu.
  - [ ] Nút tải lại PDF, chỉnh sửa tiếp, hoặc xóa.
- [ ] **Chia Sẻ Link CV Công Khai (Public Shareable Link)**:
  - [ ] Nút "Chia sẻ": Sinh đường link web công khai dạng `https://.../p/{shareToken}`.
  - [ ] Trang xem CV công khai tối giản, tương thích mobile để gửi trực tiếp cho nhà tuyển dụng xem không cần đăng nhập.

---

### 🛡️ Phase 5: Tối Ưu Hiệu Năng & Hiện Đại Hóa Admin
- [ ] **Code Splitting & Lazy Loading**:
  - [ ] Tách `React.lazy()` cho các module nặng: Admin Dashboard, TinyMCE Editor để giảm initial bundle size dưới 300KB.
- [ ] **Nâng Cấp Giao Diện Admin (`/admin`)**:
  - [ ] Bảng quản lý người dùng hiện đại với bộ lọc tìm kiếm tức thì.
  - [ ] Xem trước nội dung template trực tiếp trong modal quản trị trước khi duyệt.
