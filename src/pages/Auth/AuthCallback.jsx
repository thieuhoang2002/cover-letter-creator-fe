import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { jwtDecode } from 'jwt-decode';
import { handleGithubCallback } from '../../apis/authcallbackgithub';

function AuthCallback() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = React.useState(null);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const token = urlParams.get('token');

        if (token) {
            try {
                login(token);
                const role = jwtDecode(token).role;
                navigate(role === 'admin' ? '/admin' : '/');
            } catch (err) {
                console.error('Invalid token from redirect:', err);
                setError('Token xác thực không hợp lệ: ' + err.message);
            }
        } else if (code) {
            handleGithubCallback(code, login, navigate)
                .catch(err => {
                    console.error('Error during GitHub callback processing:', err.message);
                    setError(err.message || 'Đăng nhập GitHub thất bại từ backend');
                });
        }
    }, [login, navigate]);

    if (error) {
        return (
            <div style={{ padding: '60px 20px', textAlign: 'center' }}>
                <h3 style={{ color: '#d32f2f', marginBottom: '16px' }}>Đăng nhập thất bại</h3>
                <p style={{ color: '#555', marginBottom: '24px' }}>{error}</p>
                <button 
                    onClick={() => navigate('/login')} 
                    style={{ 
                        padding: '10px 24px', 
                        backgroundColor: '#1976d2', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '4px', 
                        cursor: 'pointer',
                        fontSize: '15px'
                    }}>
                    Quay lại trang Đăng nhập
                </button>
            </div>
        );
    }

    return <div style={{ padding: '60px 20px', textAlign: 'center', fontSize: '16px' }}>Đang xử lý đăng nhập...</div>;
}

export default AuthCallback;
