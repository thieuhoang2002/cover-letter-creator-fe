import axios from 'axios';

//const BASE_URL = 'http://localhost:8080/api/follow-cv';

// Deploy
const urlBE = import.meta.env.VITE_BACKEND_URL;
const BASE_URL = `${urlBE}/api/follow-cv`;

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