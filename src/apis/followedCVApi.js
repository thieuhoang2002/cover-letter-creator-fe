import axios from 'axios';
import { BACKEND_URL } from './config';

const BASE_URL = `${BACKEND_URL}/api/follow-cv`;

const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

/**
 * Thêm CV vào danh sách theo dõi
 * @param {Object} data - Dữ liệu gửi đi: { urlGoogleDrive, name, note, company, status }
 * @returns {Object} - Kết quả: { success, message, data }
 */
export const addFollowedCV = async (data) => {
    try {
        const response = await axios.post(
            `${BASE_URL}`,
            data,
            {
                headers: {
                    "Content-Type": "application/json",
                    ...getAuthHeader(),
                },
            }
        );

        return {
            success: true,
            message: response.data.message || 'Đã thêm CV vào danh sách theo dõi!',
            data: response.data.data
        };
    } catch (error) {
        const errorMessage = error.response?.data.message || 'Lỗi khi thêm CV vào danh sách theo dõi!';
        return {
            success: false,
            message: errorMessage,
            data: null,
            error: error
        };
    }
};

/**
 * Lấy danh sách CV theo dõi của người dùng hiện tại
 * @returns {Object} - Kết quả: { success, data, message }
 */
export const fetchFollowedCVs = async () => {
    try {
        const response = await axios.get(
            `${BASE_URL}/me`,
            {
                headers: {
                    ...getAuthHeader(),
                },
            }
        );

        return {
            success: true,
            data: response.data.data,
            message: 'Đã tải danh sách CV theo dõi thành công!'
        };
    } catch (error) {
        const errorMessage = error.response?.data.message || 'Lỗi khi tải danh sách CV theo dõi!';
        return {
            success: false,
            data: [],
            message: errorMessage,
            error: error
        };
    }
};

/**
 * Cập nhật thông tin CV theo dõi
 * @param {number} id - ID của CV cần cập nhật
 * @param {Object} data - Dữ liệu gửi đi: { note, company, status }
 * @returns {Object} - Kết quả: { success, message, data }
 */
export const updateFollowedCV = async (id, data) => {
    try {
        const response = await axios.put(
            `${BASE_URL}/${id}`,
            data,
            {
                headers: {
                    "Content-Type": "application/json",
                    ...getAuthHeader(),
                },
            }
        );

        return {
            success: true,
            message: response.data.message || 'Cập nhật CV theo dõi thành công!',
            data: response.data.data
        };
    } catch (error) {
        const errorMessage = error.response?.data.message || 'Lỗi khi cập nhật CV theo dõi!';
        return {
            success: false,
            message: errorMessage,
            data: null,
            error: error
        };
    }
};

/**
 * Xóa CV khỏi danh sách theo dõi
 * @param {number} id - ID của CV cần xóa
 * @returns {Object} - Kết quả: { success, message }
 */
export const deleteFollowedCV = async (id) => {
    try {
        const response = await axios.delete(
            `${BASE_URL}/${id}`,
            {
                headers: {
                    ...getAuthHeader(),
                },
            }
        );

        return {
            success: true,
            message: response.data.message || 'Xóa CV theo dõi thành công!'
        };
    } catch (error) {
        const errorMessage = error.response?.data.message || 'Lỗi khi xóa CV theo dõi!';
        return {
            success: false,
            message: errorMessage,
            error: error
        };
    }
};

/**
 * Upload file PDF CV từ máy tính
 * @param {File} file - File PDF
 * @param {string} name - Tên CV
 * @param {string} company - Công ty
 * @param {string} note - Ghi chú
 */
export const uploadCvPdf = async (file, name = '', company = '', note = '') => {
    try {
        const formData = new FormData();
        formData.append('file', file);
        if (name) formData.append('name', name);
        if (company) formData.append('company', company);
        if (note) formData.append('note', note);

        const response = await axios.post(`${BASE_URL}/upload`, formData, {
            headers: {
                ...getAuthHeader(),
                'Content-Type': 'multipart/form-data',
            },
        });
        return { success: true, message: response.data.message, data: response.data.data };
    } catch (error) {
        const errData = error.response?.data;
        return {
            success: false,
            message: errData?.message || 'Lỗi khi tải lên CV!',
            quotaExceeded: errData?.data?.quotaExceeded || false,
            error,
        };
    }
};

/** Kiểm tra quota upload CV */
export const getUploadQuota = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/quota`, { headers: getAuthHeader() });
        return response.data;
    } catch {
        return { isVip: false, used: 0, max: 3, remaining: 3 };
    }
};

/** Gửi yêu cầu nâng cấp VIP */
export const submitVipRequest = async (plan, note) => {
    try {
        const response = await axios.post(
            `${BACKEND_URL}/api/vip/request`,
            { plan, note },
            { headers: { ...getAuthHeader(), 'Content-Type': 'application/json' } }
        );
        return { success: true, message: response.data.message, data: response.data.data };
    } catch (error) {
        return { success: false, message: error.response?.data?.message || 'Lỗi khi gửi yêu cầu!' };
    }
};

/** Xem trạng thái yêu cầu VIP của user */
export const getMyVipStatus = async () => {
    try {
        const response = await axios.get(`${BACKEND_URL}/api/vip/my-status`, { headers: getAuthHeader() });
        return response.data.data || [];
    } catch {
        return [];
    }
};