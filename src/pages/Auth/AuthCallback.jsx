import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { jwtDecode } from 'jwt-decode';

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
            fetch('http://localhost:8080/api/users/github-login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code }),
            })
                .then(response => {
                    console.log('Response Status:', response.status); // Log status
                    if (!response.ok) {
                        return response.text().then(text => { throw new Error(text); });
                    }
                    return response.text();
                })
                .then(async (jwt) => {
                    console.log('JWT from GitHub:', jwt);
                    await login(jwt);
                    const role = jwtDecode(jwt).role;
                    navigate(role === 'admin' ? '/admin' : '/');
                })
                .catch(error => {
                    console.error('GitHub login error:', error.message);
                });
        }
    }, [login, navigate]);

    return <div>Đang xử lý đăng nhập...</div>;
}

export default AuthCallback;