// loginGoogle.js

import { jwtDecode } from 'jwt-decode';

export const loginWithGoogle = async (
    googleToken,
    { setLoading, setError, login, navigate }
) => {
    // Bắt đầu loading và reset error
    setLoading(true);
    setError(null);

    try {
        //console.log('Request Headers:', { 'Cookie': document.cookie });
        //console.log('Google Token:', googleToken);

        const response = await fetch('http://localhost:8080/api/users/google-login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token: googleToken }),
        });

        //deploy

        // const urlBE = import.meta.env.VITE_BACKEND_URL;
        // const response = await fetch(`${urlBE}/api/users/google-login`, {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({ token: googleToken }),
        // });

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
        //console.log(`Đăng nhập Google thành công: ${decodedJwt.email}`);
    } catch (error) {
        setError(error.message || 'Đã xảy ra lỗi khi đăng nhập với Google');
        console.error('Google login error:', error);
    } finally {
        setLoading(false);
    }
};

export const handleGoogleError = (setError) => {
    setError('Đăng nhập Google thất bại. Vui lòng thử lại.');
    //console.log('Google Login Failed');
};
