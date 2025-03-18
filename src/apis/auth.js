import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; // Thêm thư viện để decode JWT

const BASE_URL = 'http://localhost:8080/api/users';

export const registerUser = async (userData) => {
    try {
        const response = await axios.post(`${BASE_URL}/register`, userData);
        return response.data;
    } catch (error) {
        console.error('Lỗi khi đăng ký:', error);
        throw error;
    }
};

export const loginUser = async (loginData) => {
    try {
        const response = await axios.post(`${BASE_URL}/login`, loginData);
        const token = response.data;
        localStorage.setItem('token', token);
        return token;
    } catch (error) {
        console.error('Lỗi khi đăng nhập:', error);
        throw error;
    }
};

export const logoutUser = () => {
    localStorage.removeItem('token');
};

// auth.js
export const getRoleFromToken = () => {
    const token = localStorage.getItem('token');
    console.log('Token from localStorage:', token); // Log để kiểm tra
    if (!token) return null;
    try {
        const decoded = jwtDecode(token);
        return decoded.role;
    } catch (error) {
        console.error('Error decoding token:', error.message);
        return null;
    }
};
// Cài đặt jwt-decode: npm install jwt-decode