import axios from 'axios';

// Định nghĩa URL cơ sở của API backend
const BASE_URL = 'http://localhost:8080/api/templates'; // Thay đổi nếu backend chạy trên cổng hoặc domain khác

// Lấy danh sách tất cả các template
export const getAllTemplates = async () => {
    try {
        const response = await axios.get(BASE_URL);
        return response.data;
    } catch (error) {
        console.error('Lỗi khi lấy danh sách template:', error);
        throw error;
    }
};

// Lấy thông tin một template theo ID
export const getTemplateById = async (id) => {
    try {
        const response = await axios.get(`${BASE_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Lỗi khi lấy template với id ${id}:`, error);
        throw error;
    }
};

// Tạo một template mới
export const createTemplate = async (template) => {
    try {
        const response = await axios.post(BASE_URL, template);
        return response.data;
    } catch (error) {
        console.error('Lỗi khi tạo template:', error);
        throw error;
    }
};

// Cập nhật một template theo ID
export const updateTemplate = async (id, template) => {
    try {
        const response = await axios.put(`${BASE_URL}/${id}`, template);
        return response.data;
    } catch (error) {
        console.error(`Lỗi khi cập nhật template với id ${id}:`, error);
        throw error;
    }
};

// Xóa một template theo ID
export const deleteTemplate = async (id) => {
    try {
        await axios.delete(`${BASE_URL}/${id}`);
    } catch (error) {
        console.error(`Lỗi khi xóa template với id ${id}:`, error);
        throw error;
    }
};