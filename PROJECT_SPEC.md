# PROJECT SPECIFICATION: COVER LETTER CREATOR (FRONTEND)

## 1. Tổng quan Dự án (Project Overview)
**Cover Letter Creator Frontend** là ứng dụng web Single Page Application (SPA) xây dựng trên nền tảng **React 18 + Vite**, cung cấp giải pháp thiết kế, chỉnh sửa và xuất bản các mẫu Cover Letter (Đơn xin việc), Modern CV (CV hiện đại) và AI CV (CV sinh tự động bởi trí tuệ nhân tạo).

Ứng dụng kết nối trực tiếp với backend **Java Spring Boot 3.4.3** (AI Groq Cloud, lưu trữ Cloudflare R2 và tải file binary PDF trực tiếp).

---

## 2. Luồng Người dùng & Kiến trúc Sitemap (User Flows & Sitemap)

```mermaid
flowchart TD
    Guest[Khách vãng lai] -->|Xem trang chủ / Danh sách mẫu| Home[Trang chủ: /]
    Guest -->|Đăng nhập / Đăng ký| Auth[Login / Register]
    Auth -->|OAuth Google / GitHub| OAuthCallback[/auth-callback]
    OAuthCallback -->|Lưu JWT Token| Session[Phiên làm việc người dùng]

    Session -->|Role: user| UserArea[Khu vực Người dùng]
    Session -->|Role: admin| AdminArea[Khu vực Quản trị: /admin]

    subgraph UserArea [Khu vực Người dùng]
        UserArea -->|Chọn mẫu Cover Letter| TemplateList[/template/all]
        UserArea -->|Chọn mẫu Modern CV| ModernCVList[/modern-cv/all]
        UserArea -->|Tạo CV với AI| AICV[/create-cv-with-ai]

        TemplateList -->|Xem chi tiết mẫu| TemplateDetail[/template/:id]
        TemplateDetail -->|Mở trình soạn thảo| EditorLetter[/editor]

        ModernCVList -->|Xem chi tiết mẫu| ModernCVDetail[/modern-cv/:id]
        ModernCVDetail -->|Mở trình soạn thảo| EditorModern[/modern-cv-editor]

        AICV -->|Groq Cloud sinh nội dung| EditorAI[/cv-editor-ai]

        EditorLetter -->|Xuất & Tải trực tiếp PDF| PDFExport[/pdf-exported]
        EditorModern -->|Xuất & Tải trực tiếp PDF| PDFExport
        EditorAI -->|Xuất & Tải trực tiếp PDF| PDFExport

        UserArea -->|Quản lý tiến độ tuyển dụng| FollowCV[/follow-cv]
        UserArea -->|Mẫu yêu thích| LoveTemplates[/my-love-templates]
        UserArea -->|Hồ sơ & Đổi mật khẩu| Profile[/information, /change-password]
    end

    subgraph AdminArea [Khu vực Quản trị]
        AdminArea --> AdminDashboard[Dashboard & Thống kê]
        AdminArea --> ManageUsers[Quản lý Người dùng]
        AdminArea --> ManageTemplates[Quản lý Mẫu Cover Letter]
        AdminArea --> ManageModernTemplates[Quản lý Mẫu Modern CV]
    end
```

---

## 3. Chi tiết 3 Luồng Tạo Hồ sơ (Core Creation Flows)

### 3.1. Luồng Tạo Đơn Xin Việc (Cover Letter)
1. **Duyệt danh sách mẫu** (`/template/all`): Lọc theo phân loại, tìm kiếm, xem lượt xem (`views`) và đánh dấu yêu thích.
2. **Xem chi tiết** (`/template/:templateId`): Hiển thị bản xem trước, mô tả và nội dung mẫu.
3. **Soạn thảo trực quan** (`/editor`):
   - Tích hợp **TinyMCE Rich Text Editor** cho phép định dạng font chữ, màu sắc, canh lề, chèn ngày tháng và chữ ký.
   - Nạp dữ liệu hồ sơ cá nhân từ API `/api/users/profile/me` để điền nhanh thông tin.
   - Hỗ trợ lưu nháp vào `localStorage`.
4. **Xuất PDF** (`/api/pdf/generate`): Gửi HTML content lên backend, backend render PDF và trả về binary stream (`application/pdf`), frontend tải trực tiếp file về máy người dùng và chuyển hướng sang `/pdf-exported`.

### 3.2. Luồng Tạo CV Hiện Đại (Modern CV)
1. **Duyệt danh sách Modern CV** (`/modern-cv/all`): Xem các mẫu CV được thiết kế đa cột, phối màu hiện đại.
2. **Xem chi tiết mẫu** (`/modern-cv/:templateId`).
3. **Soạn thảo linh hoạt** (`/modern-cv-editor`):
   - Chỉnh sửa nội dung các khối: Kỹ năng (`skills`), Kinh nghiệm làm việc (`experiences`), Học vấn (`educations`), Chứng chỉ (`certificates`), Sở thích (`hobbies`).
   - Khôi phục nội dung mẫu gốc (`handleResetToDefault`).
4. **Xuất PDF** (`/api/modern-cv/pdf/generate`): Tải binary stream trực tiếp về máy.

### 3.3. Luồng Tạo CV Thông Minh với AI (AI CV via Groq Cloud)
1. **Nhập yêu cầu** (`/create-cv-with-ai`):
   - Vị trí ứng tuyển (`position`).
   - Chủ đề giao diện (`theme`: Light / Dark / Blue).
   - Dữ liệu ứng viên từ hồ sơ người dùng (Skills, Experiences, Education).
2. **Sinh nội dung với AI**:
   - Gọi API `POST /api/ai/generate-cv`. Backend gọi Groq Cloud API với model **`openai/gpt-oss-120b`** (kết hợp tự động fallback sang `llama-3.3-70b-versatile`) để sinh cấu trúc CV chuẩn A4 và trả về HTML.
3. **Hiệu chỉnh trong AI Editor** (`/cv-editor-ai`): Cho phép người dùng chỉnh sửa chi tiết câu chữ trong TinyMCE trước khi xuất bản.
4. **Xuất PDF** (`/api/ai-cv/pdf/generate`): Tải binary stream trực tiếp về máy và lưu trữ vĩnh viễn trên Cloudflare R2.

### 3.4. Cơ Chế Khóa Xuất PDF Chống Click Trùng Lặp (Anti-Spam Export Lock)
- **Vấn đề**: Khi tải PDF thành công, trước đây có độ trễ 2 giây (`setTimeout`) trước khi chuyển trang, khiến nút bấm mở lại và người dùng click nhiều lần làm backend sinh nhiều bản ghi trùng lặp trên bảng `/pdf-exported`.
- **Giải pháp Frontend**:
  - Tích hợp state `isExporting` cho cả 3 trang soạn thảo (`EditorCvAI.jsx`, `Editor.jsx`, `ModernCVEditor.jsx`).
  - Khi bắt đầu gọi API xuất PDF, `isExporting` lập tức đặt `true`. Nút bấm bị vô hiệu hóa (`disabled={loading || editorLoading || isExporting}`) và chuyển văn bản hiển thị thành `"Đang xuất PDF..."`.
  - Giữ nguyên trạng thái khóa cho đến khi hàm `navigate("/pdf-exported")` hoàn tất.
- **Giải pháp Backend**: `AICVPdfService.java` áp dụng Deduplication Guard 10s tái sử dụng bản ghi, triệt tiêu hoàn toàn bản ghi trùng lặp.

---

## 4. Quản lý Trạng thái & Bảo mật (State Management & Security)

### 4.1. Quản trị Phiên & State (AuthContext)
- **State trung tâm**: `isAuthenticated`, `role`, `userId`, `email`, `avatarUrl`, `token`.
- **JWT Storage**: Lưu tại `localStorage.getItem('token')`.
- **Tự động hết hạn (Auto Logout)**: `AuthContext` giải mã `exp` trong payload JWT, tự động kích hoạt hẹn giờ đăng xuất khi token hết hạn hoặc khi token bị hỏng.

### 4.2. Bảo vệ Tuyến đường (Route Guard - PrivateRoute)
```jsx
// Cấu hình linh hoạt kiểm tra đăng nhập và phân quyền role
<Route path="/admin" element={<PrivateRoute allowedRoles={['admin']} />}>
  <Route index element={<AdminHomePage />} />
</Route>
```
- Người dùng chưa đăng nhập tự động được chuyển hướng về trang `/login`.
- Người dùng không đủ quyền (`role !== 'admin'`) tự động bị chặn truy cập và chuyển hướng về trang chủ `/`.

### 4.3. Theo dõi Ứng tuyển (Follow CV Tracking)
- Quản lý danh sách các CV đã nộp: Tên vị trí, công ty ứng tuyển, ghi chú, trạng thái (`pending`, `interview`, `accepted`, `rejected`).
- Liên kết trực tiếp xem lại file PDF đã xuất thông qua Cloudflare R2 public/presigned URL.
