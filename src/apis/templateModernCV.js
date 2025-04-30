import axios from 'axios';

// Định nghĩa URL cơ sở của API backend cho template hiện đại
const BASE_URL = 'http://localhost:8080/api/templates-modern'; // Thay đổi nếu backend chạy trên cổng hoặc domain khác

// deploy
// const urlBE = import.meta.env.VITE_BACKEND_URL;
// const BASE_URL = `${urlBE}/api/templates-modern`;

const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

// Lấy danh sách tất cả các template hiện đại
export const getAllModernTemplates = async () => {
    try {
        const response = await axios.get(BASE_URL, { headers: getAuthHeader() });
        return response.data;
    } catch (error) {
        console.error('Lỗi khi lấy danh sách modern template:', error);
        throw error;
    }
};

// Lấy danh sách tất cả các modern template active
export const getActiveModernTemplates = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/all`, { headers: getAuthHeader() });
        return response.data;
    } catch (error) {
        console.error('Lỗi khi lấy danh sách modern template active:', error);
        throw error;
    }
};

// Lấy thông tin một modern template theo ID
export const getModernTemplateById = async (id) => {
    try {
        const response = await axios.get(`${BASE_URL}/${id}`, { headers: getAuthHeader() });
        return response.data;
    } catch (error) {
        console.error(`Lỗi khi lấy modern template với id ${id}:`, error);
        throw error;
    }
};

// Tạo một modern template mới
export const createModernTemplate = async (template) => {
    try {
        const response = await axios.post(BASE_URL, template, { headers: getAuthHeader() });
        return response.data;
    } catch (error) {
        console.error('Lỗi khi tạo modern template:', error);
        throw error;
    }
};

// Cập nhật một modern template theo ID
export const updateModernTemplate = async (id, template) => {
    try {
        const response = await axios.put(`${BASE_URL}/${id}`, template, { headers: getAuthHeader() });
        return response.data;
    } catch (error) {
        console.error(`Lỗi khi cập nhật modern template với id ${id}:`, error);
        throw error;
    }
};

// Xóa một modern template theo ID
export const deleteModernTemplate = async (id) => {
    try {
        await axios.delete(`${BASE_URL}/${id}`, { headers: getAuthHeader() });
    } catch (error) {
        console.error(`Lỗi khi xóa modern template với id ${id}:`, error);
        throw error;
    }
};

// Lấy các modern template có lượt xem cao nhất
export const getTopViewedModernTemplates = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/top-viewed`, { headers: getAuthHeader() });
        return response.data;
    } catch (error) {
        console.error("Lỗi khi lấy top-viewed modern templates:", error);
        throw error;
    }
};

// Tăng lượt xem template khi xem chi tiết
export const viewModernTemplateById = async (id) => {
    try {
        const response = await axios.get(`${BASE_URL}/${id}`, { headers: getAuthHeader() });
        return response.data;
    } catch (error) {
        console.error(`Lỗi khi tăng lượt xem cho modern template ${id}:`, error);
        throw error;
    }
};
