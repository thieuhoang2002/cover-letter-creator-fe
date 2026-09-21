# PROJECT ROADMAP & AUDIT CHECKLIST (TODO.md)

Theo dõi tiến độ phát triển, các tính năng đã hoàn thiện, tồn đọng kỹ thuật và danh sách nhiệm vụ cần thực hiện cho Frontend.

---

## 1. Trạng Thái Tính Năng (Feature Status)

### 1.1. Hoàn Thành (Done)
- [x] **Triển Khai Đám Mây Vercel (Production Deployment)**:
  - [x] Triển khai live tại: `https://cover-letter-creator-fe.vercel.app`.
  - [x] Cấu hình điều hướng SPA fallback `vercel.json` chống triệt để lỗi 404 khi người dùng F5 hoặc reload trang con.
  - [x] Kết nối trực tiếp với Backend Render Production `https://cover-letter-creator-be-eadm.onrender.com` qua biến `VITE_BACKEND_URL`.
- [x] **Xác Thực & Phân Quyền (Authentication & Authorization)**:
  - [x] Đăng nhập / Đăng ký truyền thống với Email & Mật khẩu.
  - [x] Đăng nhập Google One Tap & Google OAuth 2.0 (`@react-oauth/google`) hỗ trợ đa origin (localhost & Vercel domain).
  - [x] Đăng nhập GitHub OAuth với callback flow (`/auth-callback`).
  - [x] Nâng cấp giao diện hiển thị lỗi rõ ràng trên `AuthCallback.jsx` kèm nút quay lại đăng nhập nếu gặp sự cố xác thực.
  - [x] Quản lý phiên làm việc tập trung qua `AuthContext` và giải mã JWT token.
  - [x] Route Guard (`PrivateRoute`) hỗ trợ kiểm tra đăng nhập và phân quyền role (`admin`).
  - [x] Quên mật khẩu và đặt lại mật khẩu qua email token.
- [x] **Tạo & Soạn Thảo Đơn Xin Việc (Cover Letter)**:
  - [x] Duyệt danh sách 6 mẫu Cover Letter (3 Cơ Quan Nhà Nước + 3 Hiện Đại) có phân trang và tìm kiếm.
  - [x] Xem chi tiết mẫu Cover Letter và số lượt xem.
  - [x] Trình soạn thảo Rich Text Editor TinyMCE tích hợp tự động nạp hồ sơ cá nhân.
  - [x] Lưu bản nháp vào `localStorage`.
- [x] **Tạo & Soạn Thảo CV Hiện Đại (Modern CV)**:
  - [x] Danh mục 5 mẫu Modern CV (2 Cơ Quan Nhà Nước + 3 Hiện Đại).
  - [x] Soạn thảo động các section: Học vấn, Kinh nghiệm, Kỹ năng, Chứng chỉ, Sở thích.
  - [x] Khôi phục mẫu mặc định ban đầu.
- [x] **Sinh CV Tự Động Bằng AI (Groq Cloud)**:
  - [x] Form nhập vị trí ứng tuyển, chọn theme màu sắc (Light / Dark / Blue).
  - [x] Kết nối backend gọi AI Groq Cloud sinh nội dung HTML tức thì với model **`openai/gpt-oss-120b`** (fallback `llama-3.3-70b-versatile`).
  - [x] Trình hiệu chỉnh kết quả AI trước khi lưu hoặc xuất bản.
- [x] **Đồng Bộ Xuất PDF & Tải File Trực Tiếp (Binary PDF Stream & Cloudflare R2)**:
  - [x] Chuyển đổi toàn bộ API `/api/pdf/generate`, `/api/modern-cv/pdf/generate`, `/api/ai-cv/pdf/generate` sang xử lý Stream Binary (`Blob: application/pdf`).
  - [x] Tự động kích hoạt tải file về máy qua `pdfDownloader.js` và dọn dẹp bộ nhớ Blob URL.
  - [x] Xử lý lỗi trả về từ server khi sử dụng `responseType: 'blob'` (giải mã Blob sang JSON/text).
  - [x] Hỗ trợ hiển thị URL PDF từ dịch vụ lưu trữ mới Cloudflare R2 trong `/pdf-exported` và `/follow-cv`.
- [x] **Chống Trùng Lặp & Khóa Nút Xuất PDF (Anti-Spam / Double-Click Lock)**:
  - [x] Thêm cờ `isExporting` khóa hoàn toàn nút xuất PDF và hiển thị spinner/chữ `"Đang xuất PDF..."` trên cả 3 trình soạn thảo: `EditorCvAI.jsx`, `Editor.jsx`, và `ModernCVEditor.jsx`.
  - [x] Phối hợp với Deduplication Guard 10s tại backend để triệt tiêu tình trạng tạo 4 bản ghi trùng lặp trên `/pdf-exported`.
- [x] **Khu Vực Quản Trị (Admin Area)**:
  - [x] Dashboard thống kê người dùng và template.
  - [x] Quản lý người dùng: Tìm kiếm, phân quyền, khóa tài khoản.
  - [x] Quản lý mẫu Cover Letter & Modern CV: Thêm mới, chỉnh sửa, xóa, duyệt trạng thái active.
- [x] **Chiến Lược Phân Nhánh Git**:
  - [x] Nhánh `main`: Triển khai trực tiếp lên Vercel Production.
  - [x] Nhánh `dev`: Phát triển tính năng mới.

---

## 2. Lộ Trình Nâng Cấp Sản Phẩm Trên Nhánh `dev` (New Roadmap)

### 2.1. 🎨 Lột Xác Giao Diện & Trải Nghiệm (UI/UX Transformation — Phase 1)
- [ ] **Modern Navbar & Hero Section**:
  - Thay đổi thanh điều hướng sang phong cách tối giản / Glassmorphism hiện đại.
  - Thiết kế Hero Banner lôi cuốn, CTA rõ ràng ("Tạo CV Miễn Phí", "Khám Phá Mẫu AI").
  - Tích hợp công tắc Dark Mode / Light Mode.
- [ ] **Giao Diện Đăng Nhập / Đăng Ký Mới**:
  - Card đăng nhập hiện đại, căn giữa với hiệu ứng bo góc mượt mà, phân tách rõ ràng giữa đăng nhập Social (Google, GitHub) và Email/Password.
- [ ] **Bento Grid Gallery Cho Mẫu CV & Cover Letter**:
  - Trình diễn các mẫu thư và CV dạng thẻ Bento Grid, hover zoom, gắn nhãn phân loại ("Nhà Nước", "Công Nghệ", "Kinh Doanh", "Sáng Tạo").

### 2.2. ⚡ Trình Soạn Thảo Thời Gian Thực (Live Split-Screen Editor — Phase 2)
- [ ] **Live Split Preview**:
  - Chia màn hình thành 2 nửa: Cột trái nhập liệu form, Cột phải hiển thị CV được render trực tiếp theo thời gian thực (WYSIWYG).
- [ ] **Tùy Biến Style Động**:
  - Bảng chọn màu chủ đạo (Color Palette Picker): Navy, Emerald, Burgundy, Dark Gray.
  - Bộ chọn Font chữ chuyên nghiệp hỗ trợ tiếng Việt (Inter, Roboto, Merriweather).
- [ ] **Tự Động Lưu (Auto-save)**:
  - Tự động lưu bản nháp theo cơ chế Debounce tránh mất dữ liệu khi mất mạng hoặc tắt tab.

### 2.3. 🤖 Siêu Năng Lực AI Thế Hệ Mới (Groq AI Superpowers — Phase 3)
- [ ] **AI Streaming Typing Effect**:
  - Hiệu ứng chữ chạy từng từ khi AI sinh CV/Cover Letter thay vì vòng quay loading tĩnh.
- [ ] **AI ATS Resume Checker**:
  - Modal chấm điểm CV: Cho phép dán Job Description (JD), hiển thị thanh điểm % độ tương thích và các từ khóa cần bổ sung.
- [ ] **AI Sentence Improver**:
  - Nút "Viết lại bằng AI" ngay trên từng đoạn văn bản trong Editor.

### 2.4. 📂 Bảng Điều Khiển Người Dùng & Chia Sẻ (User Portfolio — Phase 4)
- [ ] **Trang Quản Lý CV Cá Nhân (My Documents)**:
  - Thống kê các CV đã tạo, xem trước thumbnail, tải lại PDF, xóa hoặc chỉnh sửa.
  - Nút **"Nhân bản" (Duplicate)** để tạo nhanh bản sao cho công ty khác.
- [ ] **Chia Sẻ Link Online**:
  - Tạo link xem trực tiếp CV trên web để gửi nhà tuyển dụng.
