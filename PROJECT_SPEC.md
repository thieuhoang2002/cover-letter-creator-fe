# PROJECT SPECIFICATION: COVER LETTER CREATOR (FRONTEND)

## 1. Tổng quan Dự án (Project Overview)
**Cover Letter Creator Frontend** là ứng dụng web Single Page Application (SPA) xây dựng trên nền tảng **React 18 + Vite 5**, cung cấp giải pháp thiết kế, chỉnh sửa và xuất bản các mẫu Cover Letter (Đơn xin việc), Modern CV (CV hiện đại) và AI CV (CV sinh tự động bởi trí tuệ nhân tạo Groq Cloud).

Ứng dụng kết nối trực tiếp với backend **Java Spring Boot 3.4.3** (AI Groq Cloud, lưu trữ Cloudflare R2, cơ sở dữ liệu TiDB Cloud Serverless và tải file binary PDF trực tiếp).

---

## 2. Luồng Người dùng & Kiến trúc Sitemap (User Flows & Sitemap)

```mermaid
flowchart TD
    Guest[Khách vãng lai] -->|Xem trang chủ / Danh sách mẫu| Home[Trang chủ: /]
    Guest -->|Đăng nhập / Đăng ký| Auth[Login / Register]
    Auth -->|OAuth Google / GitHub| OAuthCallback[/auth-callback]
    OAuthCallback -->|Lưu JWT Token| Session[Phiên làm việc người dùng]

    Session -->|Role: user / vip| UserArea[Khu vực Người dùng]
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

        UserArea -->|Quản lý & Upload CV PDF| FollowCV[/follow-cv]
        UserArea -->|Mẫu yêu thích| LoveTemplates[/my-love-templates]
        UserArea -->|Hồ sơ & Đổi avatar R2| Profile[/information, /change-password]
    end

    subgraph AdminArea [Khu vực Quản trị]
        AdminArea --> AdminDashboard[Dashboard & Thống kê]
        AdminArea --> ManageUsers[Quản lý Người dùng]
        AdminArea --> ManageVip[Quản lý & Phê duyệt VIP]
        AdminArea --> ManageTemplates[Quản lý Mẫu Cover Letter]
        AdminArea --> ManageModernTemplates[Quản lý Mẫu Modern CV]
    end
```

---

## 3. Chi tiết Các Luồng Chức Năng Chính

### 3.1. Luồng Tạo Đơn Xin Việc (Cover Letter)
1. **Duyệt danh sách mẫu** (`/template/all`): Lọc theo phân loại, tìm kiếm, xem lượt xem (`views`) và đánh dấu yêu thích.
2. **Xem chi tiết** (`/template/:templateId`): Hiển thị bản xem trước, mô tả và nội dung mẫu.
3. **Soạn thảo trực quan** (`/editor`):
   - Tích hợp **TinyMCE Rich Text Editor** cho phép định dạng font chữ, màu sắc, canh lề, chèn ngày tháng và chữ ký.
   - Nạp dữ liệu hồ sơ cá nhân từ API `/api/users/profile/me` để điền nhanh thông tin.
   - Hỗ trợ lưu nháp vào `localStorage`.
4. **Xuất PDF** (`/api/pdf/generate`): Nhận binary stream (`application/pdf`) tải trực tiếp về máy và chuyển hướng sang `/pdf-exported`.

### 3.2. Luồng Tạo CV Hiện Đại (Modern CV)
1. **Duyệt danh sách Modern CV** (`/modern-cv/all`): Xem các mẫu CV thiết kế đa cột hiện đại.
2. **Soạn thảo linh hoạt** (`/modern-cv-editor`): Chỉnh sửa Kỹ năng, Kinh nghiệm, Học vấn, Chứng chỉ, Sở thích.
3. **Xuất PDF** (`/api/modern-cv/pdf/generate`): Tải binary stream trực tiếp về máy và đồng bộ R2.

### 3.3. Luồng Tạo CV Thông Minh với AI (AI CV via Groq Cloud)
1. **Nhập yêu cầu** (`/create-cv-with-ai`): Vị trí ứng tuyển, bảng màu chủ đề, dữ liệu cá nhân.
2. **Sinh nội dung AI**: Backend gọi Groq Cloud (`openai/gpt-oss-120b` + fallback `llama-3.3-70b-versatile`) với cơ chế xoay vòng nhiều API key tự động phân bổ tải.
3. **Hiệu chỉnh trong AI Editor** (`/cv-editor-ai`): Tinh chỉnh chi tiết trước khi xuất bản.
4. **Xuất PDF** (`/api/ai-cv/pdf/generate`): Khóa nút chống double-click (`isExporting`) và tải file trực tiếp.

### 3.4. Luồng Theo Dõi Ứng Tuyển & Tải Lên CV Cá Nhân (`FollowCV.jsx`)
- **Tải lên file PDF từ máy**: Modal chọn file PDF (tối đa 10MB), nhập tên CV, công ty, ghi chú -> tải lên Cloudflare R2 qua API `POST /api/follow-cv/upload`.
- **Hạn ngạch lưu trữ (Quota)**:
  - Tài khoản thường: Tối đa 3 CV PDF.
  - Tài khoản VIP: Tối đa 30 CV PDF.
  - Thanh tiến trình Quota hiển thị trực quan số lượng đã dùng / tối đa.
- **Nhận diện nguồn CV**:
  - `📎 Đã tải lên` (Uploaded) cho CV người dùng tự tải từ máy.
  - `🔗 Hệ thống` (System) cho CV xuất từ trình tạo của ứng dụng.
- **Tối ưu Mobile/Tablet**:
  - Các thẻ KPI co giãn linh hoạt theo màn hình.
  - Thẻ CV trên mobile tách hàng: Badge trạng thái + nhãn nguồn ở trên, tên CV tự xuống dòng, cụm nút hành động "Xem PDF", "Cập nhật", "Xóa" dàn đều kích thước tiện cho ngón tay chạm.
- **Modal Nâng cấp VIP**: Cho phép khách chọn gói Pro VIP / Enterprise và gửi yêu cầu đến Admin.

### 3.5. Nhận Diện Thành Viên VIP Trên Toàn Hệ Thống
- **Header Avatar Highlight**:
  - Tài khoản VIP có viền phát sáng vàng kim hoàng gia `border: '2.5px solid #f59e0b'`, `boxShadow: '0 0 12px rgba(245, 158, 11, 0.55)'`.
  - Huy hiệu vương miện nhỏ `VipCrownIcon` đính ở góc avatar.
  - Chip gradient "Thành Viên VIP" trong menu thả xuống.
- **Admin Phê Duyệt VIP**: Quản trị viên duyệt yêu cầu nâng quyền tại `/admin`, kích hoạt hạn mức 30 CV và huy hiệu VIP ngay lập tức.

### 3.6. Tái Thiết Kế Mẫu Yêu Thích & Trang Chủ
- **LoveTemplate**: Thanh filter tabs dạng **Segmented Pill** bo tròn mềm mại phong cách Apple / SaaS, không có đường gạch chân cắt ngang.
- **Home**: Khối Social proof (5 sao ⭐⭐⭐⭐⭐ + chữ) căn giữa cân đối, nút CTA tự động mở rộng full-width trên thiết bị di động.

---

## 4. Quản lý Trạng thái & Bảo mật (State Management & Security)

### 4.1. Quản trị Phiên & State (AuthContext)
- **State trung tâm**: `isAuthenticated`, `role`, `userId`, `email`, `avatarUrl`, `token`.
- **Bảo toàn quyền & avatar**: Đăng nhập bằng Google/GitHub không ghi đè role `vip`/`admin` và không xóa avatar R2 tùy chỉnh của người dùng.

### 4.2. Bảo vệ Tuyến đường (Route Guard - PrivateRoute)
```jsx
<Route path="/admin" element={<PrivateRoute allowedRoles={['admin']} />}>
  <Route index element={<AdminHomePage />} />
</Route>
```
