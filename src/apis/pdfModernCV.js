import axios from 'axios';
import { extractFilename, triggerBlobDownload, parseBlobError } from '../utils/pdfDownloader';
import { BACKEND_URL } from './config';

// Cấu hình Base URL
const BASE_URL = `${BACKEND_URL}/api/modern-cv/pdf`;

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
        const sanitizedName = (data.templateName || 'Modern_CV').replace(/[^a-zA-Z0-9_\-\u00C0-\u1EF9]/g, '_');
        const defaultName = `${sanitizedName}_${Date.now()}.pdf`;
        const fileName = extractFilename(disposition, defaultName);

        // Kích hoạt tải file trực tiếp về thiết bị
        triggerBlobDownload(response.data, fileName);

        return {
            success: true,
            message: 'PDF Modern CV đã được tạo và tải về máy thành công!',
            fileName
        };
    } catch (error) {
        const errorMessage = await parseBlobError(error, 'Lỗi khi tạo PDF Modern CV, vui lòng thử lại!');
        return {
            success: false,
            message: errorMessage,
            error
        };
    }
};

/**
 * Load danh sách ModernCVPdf theo userId
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
            message: 'Đã tải danh sách Modern CV thành công!'
        };
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.response?.data || 'Lỗi khi tải danh sách Modern CV!';
        return {
            success: false,
            data: [],
            message: errorMessage,
            error
        };
    }
};

/**
 * Xóa ModernCVPdf theo id
 * @param {number} id - ID của ModernCVPdf cần xóa
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
            message: response.data?.message || response.data || 'Đã xóa Modern CV thành công!'
        };
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.response?.data || 'Lỗi khi xóa Modern CV!';
        return {
            success: false,
            message: errorMessage,
            error
        };
    }
};