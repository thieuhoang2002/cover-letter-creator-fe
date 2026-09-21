# TECH STACK SPECIFICATION

Tài liệu chi tiết về toàn bộ hệ thống công nghệ, thư viện phụ thuộc và kiến trúc giải pháp phía Frontend của dự án **Cover Letter Creator**.

---

## 1. Bảng Tổng hợp Công nghệ Cốt lõi (Core Stack)

| Phân lớp (Layer) | Công nghệ / Thư viện | Phiên bản (Version) | Mục đích & Vai trò trong dự án |
| :--- | :--- | :--- | :--- |
| **Core Framework** | [React](https://react.dev/) | `^18.3.1` | Thư viện UI nền tảng, xây dựng giao diện dựa trên Component |
| **DOM Renderer** | `react-dom` | `^18.3.1` | Kết nối React với DOM trình duyệt |
| **Build Tool & Bundler** | [Vite](https://vite.dev/) | `^5.4.10` | Công cụ build siêu tốc độ với ES Modules Native và Rollup |
| **React Fast Refresh** | `@vitejs/plugin-react-swc` | `^3.5.0` | Plugin biên dịch React dựa trên SWC (Rust) tối ưu tốc độ HMR |
| **Client-side Routing** | [React Router DOM](https://reactrouter.com/) | `^7.3.0` | Điều hướng trang SPA, Nested Routes, Private Routes |
| **UI Component Library** | [Material UI (MUI)](https://mui.com/) | `^6.4.7` | Hệ thống component UI chuẩn Design System (Buttons, Dialogs, Cards, Table, Tabs...) |
| **MUI Icons** | `@mui/icons-material` | `^6.4.7` | Bộ icon Material Design chính thức |
| **CSS-in-JS Engine** | `@emotion/react`, `@emotion/styled` | `^11.14.0` | Động cơ styling phục vụ cấu trúc theme của MUI |
| **Advanced Data Grid** | `@mui/x-data-grid` | `^7.28.0` | Bảng dữ liệu nâng cao hỗ trợ phân trang, lọc, sắp xếp (Khu vực Quản trị Admin) |
| **Icon Ecosystem** | `react-icons` | `^5.5.0` | Thư viện icon bổ trợ (FontAwesome, Bootstrap icons) |
| **Typography** | `@fontsource/roboto` | `^5.2.5` | Font chữ chuẩn Material Design tự lưu trữ (self-hosted) |

---

## 2. Dịch vụ Tích hợp & Tiện ích Mở rộng (Integration & Utilities)

| Nhóm chức năng | Tên thư viện | Phiên bản | Mô tả chi tiết |
| :--- | :--- | :--- | :--- |
| **HTTP Client** | [Axios](https://axios-http.com/) | `^1.8.3` | Giao tiếp RESTful API với Spring Boot backend, quản lý Bearer Token Header và stream Blob PDF |
| **Rich Text Editor** | `@tinymce/tinymce-react` | `^6.0.0` | Trình soạn thảo văn bản phong phú nhúng trong trang tạo Đơn xin việc và CV |
| **Google Authentication** | `@react-oauth/google` | `^0.12.1` | Tích hợp Google Identity Services (GIS), One Tap và nút đăng nhập chuẩn |
| **JWT Decoding** | `jwt-decode` | `^4.0.0` | Giải mã payload token JWT phía client để kiểm tra vai trò (Role) và thời gian hết hạn (`exp`) |
| **Data Visualization** | `recharts` | `^2.15.1` | Vẽ biểu đồ trực quan hóa dữ liệu thống kê quản trị |
| **Charts Alternative** | `chart.js`, `react-chartjs-2` | `^4.4.9` / `^5.3.0` | Biểu đồ Canvas hiệu năng cao |
| **PDF Generation (Client)** | `jspdf`, `jspdf-autotable`, `html2pdf.js`, `@react-pdf/renderer` | Tương thích | Các thư viện dự phòng xuất PDF client-side khi không qua backend |
| **HTML Entity Utility** | `he` | `^1.2.0` | Encode/decode các ký tự HTML đặc biệt |
| **PDF Downloader Helper** | `src/utils/pdfDownloader.js` | Custom | Xử lý nhận binary blob stream `application/pdf`, tự động trích xuất filename từ `Content-Disposition`, tạo virtual download link và phân tích lỗi blob JSON |
| **AI Integration** | Groq Cloud API (via Backend) | v1 | Model chính: `openai/gpt-oss-120b`, Model phụ: `llama-3.3-70b-versatile` |
| **Cloud Storage** | Cloudflare R2 (via Backend) | S3 API | Lưu trữ file PDF vĩnh viễn, phân phối qua R2 Public CDN |
| **Double-Click Lock** | `isExporting` state & guard | Custom | Khóa tương tác nút xuất PDF, ngăn ngừa gửi trùng request trong lúc chờ chuyển trang |

---

## 3. Kiến trúc Mã nguồn & Tổ chức Module (Directory Structure)

```text
cover-letter-creator-fe/
├── public/                 # Static assets không qua Vite pipeline
├── src/
│   ├── apis/               # API Service Layer (kết nối Spring Boot)
│   │   ├── auth.js                 # Đăng nhập, đăng ký, decode role
│   │   ├── authcallbackgithub.js   # Xử lý exchange code GitHub lấy JWT
│   │   ├── authcontext.js          # API lấy thông tin profile hiện tại
│   │   ├── followedCVApi.js        # CRUD bảng theo dõi ứng tuyển
│   │   ├── logingithub.js          # Redirect sang trang cấp quyền GitHub OAuth
│   │   ├── logingoogle.js          # Gửi Google Credential lên backend
│   │   ├── pdf.js                  # Xuất PDF Cover Letter (Blob stream)
│   │   ├── pdfAICV.js              # Xuất PDF CV AI (Blob stream)
│   │   ├── pdfModernCV.js          # Xuất PDF CV Hiện đại (Blob stream)
│   │   ├── profile.js              # Quản lý người dùng, đổi mật khẩu, yêu thích
│   │   ├── resetpass.js            # Quên / Đặt lại mật khẩu
│   │   ├── template.js             # CRUD Cover Letter Templates
│   │   └── templateModernCV.js     # CRUD Modern CV Templates
│   ├── assets/             # Hình ảnh, SVG assets
│   ├── components/         # Các UI component dùng chung
│   │   ├── GithubLoginButton.jsx
│   │   ├── GoogleLoginButton.jsx
│   │   └── Navbar.jsx
│   ├── pages/              # Trang theo từng chức năng / định tuyến
│   │   ├── Admin/                  # Quản trị viên (Dashboard, Users, Templates)
│   │   ├── Auth/                   # Login, Register, AuthContext, PrivateRoute
│   │   ├── ChangePass/             # Đổi mật khẩu
│   │   ├── CvByAI/                 # Khởi tạo CV bằng Groq Cloud AI
│   │   ├── CvEditor/               # CV Editor Playground
│   │   ├── Editor/                 # Soạn thảo Cover Letter với TinyMCE
│   │   ├── FollowCV/               # Bảng Kanban/Table theo dõi ứng tuyển
│   │   ├── ForgotPassword/         # Quên mật khẩu
│   │   ├── Home/                   # Trang chủ
│   │   ├── Information/            # Xem/Sửa thông tin cá nhân
│   │   ├── LoveTemplate/           # Mẫu yêu thích
│   │   ├── ModernCV/               # Danh sách Modern CV
│   │   ├── ModernCVDetail/         # Chi tiết Modern CV
│   │   ├── ModernCVEditor/         # Soạn thảo Modern CV
│   │   ├── PdfExported/            # Danh sách các tài liệu PDF đã xuất bản
│   │   ├── ResetPassword/          # Đặt lại mật khẩu từ email
│   │   ├── Template/               # Danh sách Cover Letter Templates
│   │   └── TemplateDetail/         # Chi tiết Cover Letter
│   ├── utils/              # Tiện ích bổ trợ (PDF Downloader, Formatters)
│   │   └── pdfDownloader.js        # Helper tải Blob binary và phân tích lỗi
│   ├── App.jsx             # Root component cấu hình Router & OAuth Provider
│   └── main.jsx            # Entry point ứng dụng
├── .env.example            # Mẫu biến môi trường chuẩn Vite
├── .gitignore              # Danh mục loại trừ git
├── Dockerfile              # Multi-stage Dockerfile (Node + Nginx)
├── nginx.conf              # Cấu hình Nginx Production phục vụ SPA
├── package.json            # Khai báo dependencies và scripts
└── vite.config.js          # Cấu hình Vite & SWC
```
