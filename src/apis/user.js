import axios from "axios";

//const BASE_URL = "http://localhost:8080/api/users/profile";
const urlBE = import.meta.env.VITE_BACKEND_URL;
const BASE_URL = `${urlBE}/api/users/profile`;

const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getAllUsers = async () => {
    try {
        const response = await axios.get(BASE_URL, { headers: getAuthHeader() });
        return response.data;
    } catch (error) {
        console.error("Lỗi khi lấy danh sách người dùng:", error);
        throw error;
    }
};

export const getUserById = async (id) => {
    try {
        const response = await axios.get(`${BASE_URL}/${id}`, { headers: getAuthHeader() });
        return response.data;
    } catch (error) {
        console.error(`Lỗi khi lấy thông tin người dùng với ID ${id}:`, error);
        throw error;
    }
};

export const updateUser = async (id, userData) => {
    try {
        const response = await axios.put(`${BASE_URL}/${id}`, userData, { headers: getAuthHeader() });
        return response.data;
    } catch (error) {
        console.error(`Lỗi khi cập nhật người dùng với ID ${id}:`, error);
        throw error;
    }
};

export const deleteUser = async (id) => {
    try {
        await axios.delete(`${BASE_URL}/${id}`, { headers: getAuthHeader() });
    } catch (error) {
        console.error(`Lỗi khi xóa người dùng với ID ${id}:`, error);
        throw error;
    }
};

export const getCurrentUser = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/me`, { headers: getAuthHeader() });
        return response.data;
    } catch (error) {
        console.error("Lỗi khi lấy thông tin người dùng hiện tại:", error);
        throw error;
    }
};

export const toggleFavoriteTemplate = async (templateId) => {
    try {
        const response = await axios.post(
            `${BASE_URL}/me/love-template/${templateId}`,
            {}, // Body rỗng vì API không yêu cầu dữ liệu trong body
            { headers: getAuthHeader() }
        );
        return response.data; // Trả về phản hồi từ API
    } catch (error) {
        console.error(`Lỗi khi toggle yêu thích template với ID ${templateId}:`, error);
        throw error;
    }
};

export const changePassword = async (oldPassword, newPassword) => {
    try {
        const response = await axios.post(
            `${BASE_URL}/change-password`,
            {
                oldPassword,
                newPassword
            },
            { headers: getAuthHeader() }
        );
        return response.data;
    } catch (error) {
        console.error("Lỗi khi đổi mật khẩu:", error);
        throw error;
    }
};
