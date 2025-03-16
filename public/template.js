export const TEMPLATES = [
    {
        "id": 1,
        "name": "Mẫu Đơn Xin Việc - Lập Trình Viên",
        "type": "lap-trinh-vien",
        "content": "<p style='text-align: center;'><strong>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</strong><br><strong>Độc lập – Tự do – Hạnh phúc</strong></p><p style='text-align: center;'>ĐƠN XIN VIỆC</p><p>Kính gửi: Phòng Nhân sự Công ty <em>[Tên Công ty]</em></p><p>Tôi tên là: <strong>[Họ và tên]</strong><br>Ngày sinh: <strong>[DD/MM/YYYY]</strong><br>Địa chỉ: <strong>[Địa chỉ hiện tại]</strong><br>Số điện thoại: <strong>[Số điện thoại]</strong><br>Email: <strong>[Email cá nhân]</strong></p><p>Qua thông tin tuyển dụng trên <strong>[Nguồn tuyển dụng]</strong>, tôi được biết Quý công ty đang có nhu cầu tuyển dụng vị trí Lập trình viên <strong>[Ngôn ngữ/ Công nghệ]</strong>. Tôi nhận thấy đây là cơ hội phù hợp với chuyên môn và đam mê của mình nên viết đơn này xin ứng tuyển.</p><p>Tôi tốt nghiệp <strong>[Tên trường]</strong>, chuyên ngành Công nghệ Thông tin/Khoa học Máy tính. Trong quá trình học tập và làm việc, tôi đã tích lũy được các kiến thức chuyên sâu về <strong>[Ngôn ngữ lập trình chính: Java, Python, C#,...]</strong>, cùng với đó là kỹ năng phát triển <strong>[Web/Mobile/Ứng dụng doanh nghiệp]</strong>.</p><p>Tôi có kinh nghiệm làm việc với <strong>[các công nghệ/frameworks như React, Node.js, .NET, v.v.]</strong>, tham gia phát triển <strong>[Dự án thực tế hoặc đồ án tiêu biểu]</strong>, và có khả năng làm việc nhóm, giải quyết vấn đề hiệu quả. Tôi rất mong có cơ hội được trao đổi thêm về những đóng góp mà tôi có thể mang đến cho công ty.</p><p>Tôi xin chân thành cảm ơn Quý công ty đã dành thời gian xem xét hồ sơ. Rất mong nhận được phản hồi từ Quý công ty.</p><p>Trân trọng,</p><p>[Ký tên]</p><p><strong>[Họ và tên]</strong></p>",
        "image": "https://via.placeholder.com/150",
        "views": 0,
        "status": "active",
    },
];


export const USERS = [
    {
        "id": 1,
        "role": "admin",
        "name": "Thieu Viet Hoang",
        "email": "thieuviethoang@gmail.com",
        "password": "123456",
        "birthday": "1997-05-01",
        "address": "Hanoi, Vietnam",
        "phone": "0123456789",
        "cover_letters_exported_pdf": [], //list cover letter exported pdf
        "loved_templates": [], //list template loved
    },
    {
        "id": 2,
        "role": "user",
        "name": "Nguyen Van A",
        "email": "nguyenvana@gmail.com",
        "password": "123456",
        "birthday": "1997-05-01",
        "address": "Hanoi, Vietnam",
        "phone": "0123456789",
        "cover_letters": [],
        "love_templates": [],
    },
]

export const COVER_LETTERS_PDF = [
    {
        "id": 1,
        "url_google_drive": "https://drive.google.com/...",
        "user_id": 1,
        "template_id": 1,
        "created_at": "2021-08-20 12:00:00",
    }
]