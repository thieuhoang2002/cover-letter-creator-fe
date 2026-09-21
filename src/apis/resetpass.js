import axios from "axios";
import { BACKEND_URL } from "./config";

const BASE_URL = `${BACKEND_URL}/api/auth`;

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
