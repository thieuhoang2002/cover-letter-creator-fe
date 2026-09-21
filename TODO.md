# 📋 PROJECT ROADMAP & AUDIT CHECKLIST — FRONTEND (TODO.md)

Theo dõi chi tiết lộ trình phát triển, các tính năng đã hoàn thiện và danh sách nhiệm vụ kỹ thuật nâng cấp toàn diện dự án **Cover Letter Creator Frontend** trên nhánh `dev`.

---

## ✅ 1. Trạng Thái Đã Hoàn Thành (Production & Branch `dev`)

### 1.1. Hạ Tầng & Triển Khai
- [x] **Triển khai Vercel Production**: `https://cover-letter-creator-fe.vercel.app` (kết nối Backend Render `https://cover-letter-creator-be-eadm.onrender.com`).
- [x] **SPA Routing Fallback**: Cấu hình `vercel.json` định tuyến an toàn, chống triệt để lỗi 404 khi tải lại trang con.
- [x] **Quản lý Môi trường**: Tách biến chuẩn Vite (`VITE_BACKEND_URL`, `VITE_API_KEY_TINY`, `VITE_CLIENT_ID`, `VITE_GITHUB_CLIENT_ID`).
- [x] **Bundle Optimization & Code Splitting**:
  - [x] Tách `React.lazy()` và `<Suspense fallback={<LoadingFallback />}>` cho toàn bộ các trang chức năng.
  - [x] Cấu hình `manualChunks` trong Vite gom nhóm vendor: `vendor-react`, `vendor-mui`, `vendor-datagrid`, `vendor-charts`, `vendor-tinymce`.

### 1.2. Xác Thực, Phân Quyền & Bảo Mật
- [x] Đăng nhập / Đăng ký truyền thống (Email & Password).
- [x] Đăng nhập Google One Tap & Google OAuth 2.0 (`@react-oauth/google`).
- [x] Đăng nhập GitHub OAuth callback flow (`/auth-callback`).
- [x] Quản lý phiên làm việc tập trung qua `AuthContext` và giải mã JWT token (chuẩn hóa role lowercase).
- [x] Phân quyền route guard `PrivateRoute` hỗ trợ mảng `allowedRoles` (ví dụ `allowedRoles={['admin']}`).
- [x] Quy trình Quên mật khẩu & Đặt lại mật khẩu (`/forgot-password`, `/reset-password`) với UI SaaS 2026 hiện đại.
- [x] Đổi mật khẩu (`/change-password`): Hỗ trợ phân nhánh thông minh cho tài khoản Google/GitHub chưa có mật khẩu (bỏ qua mật khẩu cũ) thông qua API kiểm tra `has-password`.
- [x] Đồng bộ thông báo khi bị Rate Limit (HTTP 429) từ hệ thống.

### 1.3. Giao Diện Người Dùng & Trải Nghiệm Chuẩn SaaS 2026
- [x] **Dark / Light Mode Theme Engine**: Tích hợp công tắc chuyển đổi giao diện sáng/tối vào Navbar, lưu trạng thái vào `localStorage`.
- [x] **Navbar & User Dropdown**: Thiết kế Glassmorphism hiện đại, hiển thị avatar, chip phân quyền và menu tùy chọn cá nhân.
- [x] **Hiện Đại Hóa Các Trang Chức Năng**:
  - [x] Trang Hồ sơ người dùng (`Information.jsx`).
  - [x] Trang Theo dõi CV ứng tuyển (`FollowCV.jsx`).
  - [x] Trang Hồ sơ PDF đã xuất (`PdfExported.jsx`).
  - [x] Trang Mẫu yêu thích (`LoveTemplate.jsx`).
  - [x] Trang Đổi mật khẩu (`ChangePass.jsx`), Quên mật khẩu (`ForgotPassword.jsx`), Đặt lại mật khẩu (`ResetPassword.jsx`).
- [x] **Quản Trị Admin SaaS 2026 (`/admin`)**:
  - [x] `AdminHomePage`: Drawer sidebar đa năng có khả năng thu gọn (collapsed mode).
  - [x] `AdminDashboard`: KPI cards, biểu đồ Bar/Pie Chart.js, Bảng xếp hạng Top 5 mẫu xem nhiều nhất.
  - [x] `UserManager`: Quản lý danh sách người dùng với DataGrid và bộ lọc tìm kiếm tức thì.
  - [x] `TemplateManager` & `ModernCVTemplateManager`: Quản lý mẫu đơn nhà nước và mẫu CV hiện đại.

### 1.4. Tối Ưu Mobile & Tablet Responsive
- [x] **Chuyển đổi giao diện Bảng sang Thẻ (Card View)** trên màn hình nhỏ (`< 900px`) cho:
  - [x] `PdfExported.jsx` (Hồ sơ đã xuất).
  - [x] `FollowCV.jsx` (Theo dõi CV ứng tuyển).
  - [x] `UserManager.jsx` (Quản lý người dùng Admin).
  - [x] `TemplateManager.jsx` (Quản lý mẫu đơn nhà nước Admin).
  - [x] `ModernCVTemplateManager.jsx` (Quản lý mẫu CV hiện đại Admin).
  - [x] `AdminDashboard.jsx` (Bảng xếp hạng Top mẫu trên Admin Dashboard).
- [x] **Bảo tồn nguyên vẹn 100% giao diện bảng Desktop** (`display: { xs: 'none', md: 'block' }`).
- [x] **Sticky Action Bar trên Mobile/Tablet** cho `TemplateDetail.jsx` và `ModernCVDetail.jsx`.
- [x] **Tối ưu thanh công cụ & tỷ lệ trình soạn thảo** `Editor.jsx` và `ModernCVEditor.jsx` cho thiết bị di động.
- [x] **Khắc phục triệt để lỗi trắng màn hình**: Xử lý đầy đủ import `Paper` và `Divider`, bổ sung timeout fallback khi tải profile.

---

## 🎯 2. Nhiệm Vụ Kế Tiếp (TODO Ngày Mai)

### 📤 2.1. Upload Avatar Người Dùng Lên Cloudflare R2
- [ ] **Giao diện chọn ảnh tại `Information.jsx`**:
  - [ ] Nút bấm/biểu tượng camera trực quan cho phép chọn file ảnh từ máy tính (`image/jpeg`, `image/png`, `image/webp`).
  - [ ] Xem trước ảnh tức thì (Image Preview Modal / Avatar Preview) trước khi lưu.
  - [ ] Client-side validation: Giới hạn dung lượng ảnh `<= 2MB`, đúng định dạng ảnh.
- [ ] **Tích hợp API tải ảnh lên R2**:
  - [ ] Gọi API `POST /api/users/profile/avatar` bằng `FormData` (Multipart/form-data).
  - [ ] Hiển thị thanh tiến trình / spinner trong lúc upload.
  - [ ] Cập nhật lại avatar tức thì trên `AuthContext`, thanh `Navbar` và trang cá nhân mà không cần F5 tải lại trang.

### 🛡️ 2.2. Rà Soát & Hoàn Thiện Form Validation Toàn Diện (FE)
- [ ] **Validation Đăng nhập & Đăng ký**:
  - [ ] Định dạng email chuẩn RFC, thông báo lỗi cụ thể khi bỏ trống hoặc sai cú pháp.
  - [ ] Mật khẩu tối thiểu 6 ký tự, đo lường độ mạnh mật khẩu trực quan.
  - [ ] Kiểm tra trùng khớp mật khẩu xác nhận khi đăng ký.
- [ ] **Validation Quên & Đổi mật khẩu**:
  - [ ] Kiểm tra độ dài và độ phức tạp mật khẩu mới.
  - [ ] Xác nhận mật khẩu mới phải khớp 100%.
- [ ] **Validation Quản trị Admin (`UserManager`, `TemplateManager`)**:
  - [ ] Form tạo/sửa người dùng: bắt buộc email hợp lệ, họ tên không để trống.
  - [ ] Form tạo/sửa template: tên mẫu, phân loại, nội dung HTML không được rỗng.
- [ ] **Validation File Upload**:
  - [ ] Kiểm tra chặt chẽ đuôi file (`.pdf`, `.png`, `.jpg`) và dung lượng tối đa trước khi gửi lên Backend.

### 📄 2.3. Cho Phép Khách Upload File PDF CV Từ Máy Lên Web (`FollowCV`)
- [ ] **Nút bấm & Modal "Tải Lên CV Từ Máy" tại `/follow-cv`**:
  - [ ] Thiết kế Modal kéo-thả (Drag & Drop) hoặc bấm chọn file PDF từ máy tính.
  - [ ] Các trường nhập liệu bổ sung: Tên hiển thị CV, Tên công ty ứng tuyển, Vị trí, Ghi chú ban đầu, Trạng thái (`Chờ phản hồi`, `Phỏng vấn`, v.v.).
  - [ ] Client-side validation: Chỉ chấp nhận file định dạng `.pdf`, dung lượng tối đa `<= 10MB`.
- [ ] **Tích hợp API Upload CV**:
  - [ ] Gửi request multipart/form-data lên API `POST /api/follow-cv/upload`.
  - [ ] Hiển thị file vừa upload vào danh sách Theo dõi CV ngay lập tức, kèm nút xem trực tiếp file PDF lưu trên Cloudflare R2.

### 💎 2.4. Quản Lý Giới Hạn Upload CV (Quota) & Giao Diện Nâng Cấp VIP (Mock / Gửi Yêu Cầu Admin)
- [ ] **Cơ chế giới hạn Quota Upload (Mỗi khách tối đa 3 file PDF)**:
  - [ ] Kiểm tra số lượng file PDF khách đã tự upload trong danh sách Theo dõi CV.
  - [ ] Nếu đã đạt tối đa 3 file: Vô hiệu hóa nút upload hoặc khi bấm vào sẽ hiển thị Banner / Modal thông báo:
    > *"Bạn đã sử dụng hết 3/3 lượt tải lên CV miễn phí. Vui lòng nâng cấp gói VIP để tiếp tục lưu trữ không giới hạn!"*
- [ ] **Giao Diện Bảng Giá & Nâng Cấp VIP (Pricing Plans Modal)**:
  - [ ] Thiết kế bảng so sánh gói chuẩn SaaS 2026 đẹp mắt:
    - **Gói Miễn Phí (Free Tier)**: Tối đa 3 CV tải lên, 11 mẫu cơ bản, tính năng theo dõi cơ bản.
    - **Gói Chuyên Nghiệp (Pro VIP)**: Không giới hạn tải lên CV từ máy, mở khóa toàn bộ mẫu cao cấp, ưu tiên tạo CV AI.
    - **Gói Doanh Nghiệp (Enterprise / Unlimited)**: Mọi đặc quyền VIP, xuất bản link portfolio công khai.
  - [ ] **Cơ chế Gửi Yêu Cầu Nâng Cấp (Chưa tích hợp cổng thanh toán)**:
    - Nút *"Nâng Cấp Ngay"* sẽ mở Form *"Gửi Yêu Cầu Nâng Cấp Gói VIP"*.
    - Khách nhập: Gói muốn nâng cấp, Ghi chú / Mục đích sử dụng.
    - Bấm *"Gửi Yêu Cầu"*: Gửi dữ liệu lên API Backend, hiển thị thông báo thành công: *"Yêu cầu của bạn đã được gửi tới Quản trị viên. Chúng tôi sẽ phê duyệt và cấp quyền cho bạn sớm nhất!"*.
    - Hiển thị badge trạng thái *"Yêu cầu VIP: Đang chờ duyệt"* trên profile / header.
- [ ] **Giao Diện Quản Trị Yêu Cầu VIP Bên Admin (`/admin`)**:
  - [ ] Thêm Tab *"Yêu Cầu Nâng Cấp VIP"* trong Admin Portal.
  - [ ] Hiển thị danh sách khách hàng đang chờ duyệt nâng cấp gói.
  - [ ] Nút hành động: *"Phê duyệt (Cấp quyền VIP)"* hoặc *"Từ chối"*.
