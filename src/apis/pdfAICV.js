import axios from 'axios';
import { extractFilename, triggerBlobDownload, parseBlobError } from '../utils/pdfDownloader';
import { BACKEND_URL } from './config';

// Cấu hình Base URL
const BASE_URL = `${BACKEND_URL}/api/ai-cv/pdf`;

const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

/**
 * Tạo PDF từ dữ liệu đầu vào và tự động tải binary stream (Blob) về máy người dùng
 * @param {Object} data - Dữ liệu gửi đi: { id, email, htmlContent, templateName, date }
 * @returns {Promise<{ success: boolean, message: string, fileName?: string, error?: any }>}
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
                responseType: 'blob',
            }
        );

        // Lấy tên file từ header Content-Disposition hoặc tạo tên mặc định
        const disposition = response.headers?.['content-disposition'];
        const sanitizedName = (data.templateName || 'AI_CV').replace(/[^a-zA-Z0-9_\-\u00C0-\u1EF9]/g, '_');
        const defaultName = `${sanitizedName}_${Date.now()}.pdf`;
        const fileName = extractFilename(disposition, defaultName);

        // Kích hoạt tải file trực tiếp về thiết bị
        triggerBlobDownload(response.data, fileName);

        return {
            success: true,
            message: 'PDF CV AI đã được tạo và tải về máy thành công!',
            fileName
        };
    } catch (error) {
        const errorMessage = await parseBlobError(error, 'Lỗi khi tạo PDF CV AI, vui lòng thử lại!');
        return {
            success: false,
            message: errorMessage,
            error
        };
    }
};

/**
 * Load danh sách AICVPdf theo userId
 * @param {string} userId - ID của người dùng
 * @returns {Promise<{ success: boolean, data: Array, message: string, error?: any }>}
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
            message: 'Đã tải danh sách AI CV thành công!'
        };
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.response?.data || 'Lỗi khi tải danh sách AI CV!';
        return {
            success: false,
            data: [],
            message: errorMessage,
            error
        };
    }
};

/**
 * Xóa AICVPdf theo id
 * @param {number} id - ID của AICVPdf cần xóa
 * @returns {Promise<{ success: boolean, message: string, error?: any }>}
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
            message: response.data?.message || response.data || 'Đã xóa AI CV thành công!'
        };
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.response?.data || 'Lỗi khi xóa AI CV!';
        return {
            success: false,
            message: errorMessage,
            error
        };
    }
};