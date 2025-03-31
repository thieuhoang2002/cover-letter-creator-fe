import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/pdf';

const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export const generatePdf = async (htmlContent) => {
    try {
        const response = await axios.post(
            `${BASE_URL}/generate`,
            htmlContent,
            {
                headers: {
                    "Content-Type": "text/html",
                    ...getAuthHeader(), // Thêm header Authorization
                },
                responseType: 'blob', // Để nhận dữ liệu PDF dưới dạng blob
            }
        );

        // Tạo URL từ blob để tải xuống file PDF
        const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'generated_file.pdf'); // Tên file tải xuống
        document.body.appendChild(link);
        link.click();
        link.remove();
    } catch (error) {
        console.error('Lỗi khi tạo PDF:', error);
        throw error;
    }
};