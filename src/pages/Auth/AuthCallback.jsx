import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { jwtDecode } from 'jwt-decode';
import { handleGithubCallback } from '../../apis/authcallbackgithub';

function AuthCallback() {
    const { login } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const token = urlParams.get('token');

        if (token) {
            try {
                login(token);
                const role = jwtDecode(token).role;
                navigate(role === 'admin' ? '/admin' : '/');
            } catch (error) {
                console.error('Invalid token from redirect:', error);
            }
        } else if (code) {
            // Gọi hàm xử lý callback đăng nhập GitHub từ file authcallbackgithub.js
            handleGithubCallback(code, login, navigate)
                .catch(error => {
                    // Xử lý lỗi nếu cần (ví dụ: thông báo lỗi cho người dùng)
                    console.error('Error during GitHub callback processing:', error.message);
                });
        }
    }, [login, navigate]);

    return <div>Đang xử lý đăng nhập...</div>;
}

export default AuthCallback;
