import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/pdf';

const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export const generatePdf = async (data) => {
    try {
        const response = await axios.post(
            `${BASE_URL}/generate`,
            data, // { id, email, htmlContent }
            {
                headers: {
                    "Content-Type": "application/json",
                    ...getAuthHeader(),
                },
                responseType: 'text', // Nhận response dưới dạng text
            }
        );

        // Xử lý chuỗi thông báo từ backend
        const message = response.data;
        console.log('Thông báo từ backend:', message);
        alert(message); // Hiển thị thông báo cho người dùng

        // Nếu cần trích xuất fileId để sử dụng (ví dụ: mở link Google Drive)
        const fileId = message.split('File ID: ')[1];
        if (fileId) {
            const googleDriveLink = `https://drive.google.com/file/d/${fileId}/view`;
            console.log('Link file trên Google Drive:', googleDriveLink);
            // Có thể mở link: window.open(googleDriveLink, '_blank');
            setTimeout(() => {
                window.open(googleDriveLink, '_blank');
            }, 100);

        }

        return message; // Trả về thông báo nếu cần
    } catch (error) {
        console.error('Lỗi khi tạo PDF:', error);
        throw error;
    }
};