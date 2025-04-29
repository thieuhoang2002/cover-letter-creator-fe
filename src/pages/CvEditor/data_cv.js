// data_cv.js

const initialCvData = {
    avatarUrl: "https://i.pravatar.cc/150?img=8",
    name: "Nguyễn Văn A",
    title: "Frontend Developer",
    contact: {
        email: "nguyenvana@gmail.com",
        phone: "0123 456 789",
        address: "123 Đường ABC, TP.HCM",
    },
    skills: ["React", "JavaScript", "HTML/CSS", "Git", "Figma"],
    experiences: [
        {
            company: "Công ty ABC",
            role: "Frontend Intern",
            time: "06/2023 - 12/2023",
            desc: "Phát triển giao diện người dùng.",
        },
    ],
    projects: [
        {
            name: "Website tạo đơn xin việc",
            desc: "Ứng dụng cho phép tạo và tải đơn xin việc.",
        },
    ],
    education: [
        {
            school: "Đại học Công nghệ Thông tin",
            major: "Công nghệ thông tin",
            year: "2021 - 2025",
        },
    ],
};

export default initialCvData;
