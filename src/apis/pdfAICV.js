import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/ai-cv/pdf';

//deploy
// const urlBE = import.meta.env.VITE_BACKEND_URL;
// const BASE_URL = `${urlBE}/api/pdf`;

const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

/**
 * Tạo PDF từ dữ liệu đầu vào
 * @param {Object} data - Dữ liệu gửi đi: { id, email, htmlContent, templateName, date }
 * @returns {Object} - Kết quả: { success, message, fileId, googleDriveLink }
 */
export const generatePdf = async (data) => {
    try {
        const response = await axios.post(
            `${BASE_URL}/generate`,
            data,
            {
                headers: {
                    "Content-Type": "application/json",
                    ...getAuthHeader(),
                },
                responseType: 'text',
            }
        );

        const message = response.data;
        const fileId = message.split('File ID: ')[1];
        let googleDriveLink = null;

        if (fileId) {
            googleDriveLink = `https://drive.google.com/file/d/${fileId}/view`;
            // Tự động mở link sau 100ms
            setTimeout(() => {
                window.open(googleDriveLink, '_blank');
            }, 100);
        }

        return {
            success: true,
            message: message || 'PDF đã được tạo thành công!',
            fileId: fileId || null,
            googleDriveLink: googleDriveLink || null
        };
    } catch (error) {
        const errorMessage = error.response?.data || 'Lỗi khi tạo PDF, vui lòng thử lại!';
        return {
            success: false,
            message: errorMessage,
            fileId: null,
            googleDriveLink: null,
            error: error
        };
    }
};

/**
 * Load danh sách CoverLetterPdf theo userId
 * @param {string} userId - ID của người dùng
 * @returns {Object} - Kết quả: { success, data, message }
 */
export const fetchCoverLetters = async (userId) => {
    try {
        const response = await axios.get(
            `${BASE_URL}/list/${userId}`,
            {
                headers: {
                    ...getAuthHeader(),
                },
            }
        );

        return {
            success: true,
            data: response.data,
            message: 'Đã tải danh sách cover letters thành công!'
        };
    } catch (error) {
        const errorMessage = error.response?.data || 'Lỗi khi tải danh sách cover letters!';
        return {
            success: false,
            data: [],
            message: errorMessage,
            error: error
        };
    }
};

/**
 * Xóa CoverLetterPdf theo id
 * @param {number} id - ID của CoverLetterPdf cần xóa
 * @returns {Object} - Kết quả: { success, message }
 */
export const deleteCoverLetter = async (id) => {
    try {
        const response = await axios.delete(
            `${BASE_URL}/delete/${id}`,
            {
                headers: {
                    ...getAuthHeader(),
                },
            }
        );

        return {
            success: true,
            message: response.data || 'Đã xóa cover letter thành công!'
        };
    } catch (error) {
        const errorMessage = error.response?.data || 'Lỗi khi xóa cover letter!';
        return {
            success: false,
            message: errorMessage,
            error: error
        };
    }
};