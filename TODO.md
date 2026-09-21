# PROJECT ROADMAP & AUDIT CHECKLIST (TODO.md)

Theo dõi tiến độ phát triển, các tính năng đã hoàn thiện, tồn đọng kỹ thuật và danh sách nhiệm vụ cần thực hiện cho Frontend.

---

## 1. Trạng thái Tính năng (Feature Status)

### 1.1. Hoàn thành (Done)
- [x] **Xác thực & Phân quyền (Authentication & Authorization)**:
  - [x] Đăng nhập / Đăng ký truyền thống với Email & Mật khẩu.
  - [x] Đăng nhập Google One Tap & Google OAuth 2.0 (`@react-oauth/google`).
  - [x] Đăng nhập GitHub OAuth với callback flow (`/auth-callback`).
  - [x] Quản lý phiên làm việc tập trung qua `AuthContext` và giải mã JWT token.
  - [x] Route Guard (`PrivateRoute`) hỗ trợ kiểm tra đăng nhập và phân quyền role (`admin`).
  - [x] Quên mật khẩu và đặt lại mật khẩu qua email token.
- [x] **Tạo & Soạn thảo Đơn xin việc (Cover Letter)**:
  - [x] Duyệt danh sách mẫu Cover Letter có phân trang và tìm kiếm.
  - [x] Xem chi tiết mẫu Cover Letter và số lượt xem.
  - [x] Trình soạn thảo Rich Text Editor TinyMCE tích hợp tự động nạp hồ sơ cá nhân.
  - [x] Lưu bản nháp vào `localStorage`.
- [x] **Tạo & Soạn thảo CV Hiện đại (Modern CV)**:
  - [x] Danh mục Modern CV đa phong cách.
  - [x] Soạn thảo động các section: Học vấn, Kinh nghiệm, Kỹ năng, Chứng chỉ, Sở thích.
  - [x] Khôi phục mẫu mặc định ban đầu.
- [x] **Sinh CV Tự động bằng AI (Groq Cloud)**:
  - [x] Form nhập vị trí ứng tuyển, chọn theme màu sắc (Light / Dark / Blue).
  - [x] Kết nối backend gọi AI Groq Cloud sinh nội dung HTML tức thì với model **`openai/gpt-oss-120b`** (fallback `llama-3.3-70b-versatile`).
  - [x] Trình hiệu chỉnh kết quả AI trước khi lưu hoặc xuất bản.
- [x] **Đồng bộ Xuất PDF & Tải File Trực tiếp (Binary PDF Stream & Cloudflare R2)**:
  - [x] Chuyển đổi toàn bộ API `/api/pdf/generate`, `/api/modern-cv/pdf/generate`, `/api/ai-cv/pdf/generate` sang xử lý Stream Binary (`Blob: application/pdf`).
  - [x] Tự động kích hoạt tải file về máy qua `pdfDownloader.js` và dọn dẹp bộ nhớ Blob URL.
  - [x] Xử lý lỗi trả về từ server khi sử dụng `responseType: 'blob'` (giải mã Blob sang JSON/text).
  - [x] Hỗ trợ hiển thị URL PDF từ dịch vụ lưu trữ mới Cloudflare R2 trong `/pdf-exported` và `/follow-cv`.
- [x] **Chống Trùng Lặp & Khóa Nút Xuất PDF (Anti-Spam / Double-Click Lock)**:
  - [x] Thêm cờ `isExporting` khóa hoàn toàn nút xuất PDF và hiển thị spinner/chữ `"Đang xuất PDF..."` trên cả 3 trình soạn thảo: `EditorCvAI.jsx`, `Editor.jsx`, và `ModernCVEditor.jsx`.
  - [x] Phối hợp với Deduplication Guard 10s tại backend để triệt tiêu tình trạng tạo 4 bản ghi trùng lặp trên `/pdf-exported`.
  - [x] Dọn dẹp sạch các bản ghi trùng lặp trong database MySQL.
- [x] **Bộ Dữ Liệu Mẫu (Templates Seeding)**:
  - [x] Seed sẵn 3 mẫu Cover Letter và 3 mẫu Modern CV chuẩn ngành vào database MySQL (`seed_templates.sql`).
- [x] **Khu vực Quản trị (Admin Area)**:
  - [x] Dashboard thống kê người dùng và template.
  - [x] Quản lý người dùng: Tìm kiếm, phân quyền, khóa tài khoản.
  - [x] Quản lý mẫu Cover Letter & Modern CV: Thêm mới, chỉnh sửa, xóa, duyệt trạng thái active.
- [x] **Bảo mật & Cấu hình**:
  - [x] Quét sạch các khóa nhạy cảm bị hardcode.
  - [x] Tạo file mẫu chuẩn `.env.example`.
  - [x] Cập nhật `.gitignore` toàn diện.
  - [x] Tạo cấu hình Docker production-ready (`Dockerfile` multi-stage & `nginx.conf`).

---

## 2. Việc Cần Hoàn Thiện & Cải Tiến Kỹ Thuật (Backlog & Tech Debt)

### 2.1. Tối ưu Hiệu năng & Bundle Size (High Priority)
- [ ] **Code Splitting với `React.lazy()` & `Suspense`**:
  - Tách các trang nặng như Admin (`AdminDashboard`, `UserManager`), Editor (`TinyMCE`) thành các dynamic import chunks để thời gian tải trang đầu tiên (FCP) dưới 1.5 giây.
- [ ] **Tối ưu Manual Chunks trong Vite**:
  - Tách vendor riêng biệt: `vendor-react` (react, react-dom, react-router-dom), `vendor-mui` (@mui/material, @emotion), `vendor-charts` (recharts, chart.js).

### 2.2. Nâng cấp Trải nghiệm Người dùng (UI/UX)
- [ ] **Dark Mode Toàn Diện**:
  - Bổ sung Theme Toggle (Light/Dark) sử dụng `ThemeProvider` của Material UI.
- [ ] **Xem trước PDF Trực Quan Trước Khi Tải (PDF Inline Preview)**:
  - Tích hợp trình xem trước PDF ngay trên modal trước khi bấm xác nhận xuất bản.
- [ ] **Kéo thả sắp xếp Section CV (Drag-and-Drop Reorder)**:
  - Tích hợp `@hello-pangea/dnd` cho phép ứng viên thay đổi vị trí các phần trong CV linh hoạt.

### 2.3. Kiến trúc Mã nguồn (Architectural Enhancements)
- [ ] **Chuyển dịch sang TypeScript**:
  - Định nghĩa Type/Interface cho User Profile, Template, Modern CV Schema và API Responses để loại bỏ lỗi runtime.
- [ ] **Áp dụng TanStack Query (React Query v5)**:
  - Thay thế pattern gọi API thủ công lặp lại trong `useEffect` bằng custom hooks: `useTemplates()`, `useUserProfile()`, `useExportedPdfs()`.
  - Tự động quản lý cache và retry request thông minh.
- [ ] **Bổ sung Kiểm thử Tự động (Testing Suite)**:
  - Cài đặt `vitest` và `@testing-library/react` để viết Unit Test cho `AuthContext`, `pdfDownloader` và các form tạo CV.
