import axios from "axios";

const BASE_URL = "http://localhost:8080/api/auth"; // Điều chỉnh nếu endpoint khác

//deploy
// const urlBE = import.meta.env.VITE_BACKEND_URL;
// const BASE_URL = `${urlBE}/api/auth`;

/**
 * Gửi yêu cầu quên mật khẩu (bằng email).
 * Backend sẽ gửi email chứa link reset.
 */
export const requestPasswordReset = async (email) => {
    try {
        const response = await axios.post(`${BASE_URL}/forgot-password`, { email });
        return response.data;
    } catch (error) {
        console.error("Lỗi khi yêu cầu đặt lại mật khẩu:", error);
        throw error;
    }
};

/**
 * Gửi mật khẩu mới kèm token để đặt lại mật khẩu.
 */
export const resetPassword = async (token, newPassword) => {
    try {
        const response = await axios.post(`${BASE_URL}/reset-password`, {
            token,
            newPassword
        });
        return response.data;
    } catch (error) {
        console.error("Lỗi khi đặt lại mật khẩu:", error);
        throw error;
    }
};
