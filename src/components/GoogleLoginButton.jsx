import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../pages/Auth/AuthContext';
import { jwtDecode } from 'jwt-decode'; // Import jwt-decode ở đầu file

function GoogleLoginButton() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSuccess = async (credentialResponse) => {
        setLoading(true);
        setError(null);
        console.log('Request Headers:', { 'Cookie': document.cookie }); // Log cookie gửi đi
        console.log('Credential Response:', credentialResponse); // Log để debug

        const googleToken = credentialResponse.credential;

        try {
            const response = await fetch('http://localhost:8080/api/users/google-login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token: googleToken }),
            });

            if (!response.ok) {
                throw new Error('Đăng nhập Google thất bại từ backend');
            }

            const jwt = await response.text();
            await login(jwt);

            // Decode JWT để lấy role
            const decodedJwt = jwtDecode(jwt);
            const role = decodedJwt.role;

            // Điều hướng dựa trên role
            navigate(role === 'admin' ? '/admin' : '/');
            console.log(`Đăng nhập Google thành công: ${decodedJwt.email}`);
        } catch (error) {
            setError(error.message || 'Đã xảy ra lỗi khi đăng nhập với Google');
            console.error('Google login error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleError = () => {
        setError('Đăng nhập Google thất bại. Vui lòng thử lại.');
        console.log('Google Login Failed');
    };

    return (
        <div>
            {loading && <p>Đang đăng nhập...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <GoogleLogin
                onSuccess={handleSuccess}
                onError={handleError}
                useOneTap={false}
                theme="filled_blue"
                size="large"
                text="signin_with"
            />
        </div>
    );
}

export default GoogleLoginButton;