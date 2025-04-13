import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../pages/Auth/AuthContext';
// import jwtDecode từ file loginGoogle.js đã được sử dụng trong đó nên không cần import riêng nếu không dùng trực tiếp ở component
import { loginWithGoogle, handleGoogleError } from '../apis/logingoogle'; // Đảm bảo đường dẫn đúng với cấu trúc thư mục của bạn

function GoogleLoginButton() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const onSuccess = async (credentialResponse) => {
        const googleToken = credentialResponse.credential;
        await loginWithGoogle(googleToken, { setLoading, setError, login, navigate });
    };

    const onError = () => {
        handleGoogleError(setError);
    };

    return (
        <div>
            {loading && <p>Đang đăng nhập...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <GoogleLogin
                onSuccess={onSuccess}
                onError={onError}
                useOneTap={false}
                theme="filled_blue"
                size="large"
                text="signin_with"
            />
        </div>
    );
}

export default GoogleLoginButton;
