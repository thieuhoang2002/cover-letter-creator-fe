import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../pages/Auth/AuthContext';
import { jwtDecode } from 'jwt-decode';

function GithubLoginButton() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleGithubLogin = () => {
        const clientId = import.meta.env.VITE_GITHUB_CLIENT_ID; // Thêm vào .env
        const redirectUri = 'http://localhost:5173/auth-callback';
        const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=user:email`;
        window.location.href = githubAuthUrl; // Chuyển hướng tới GitHub
    };

    return (
        <div>
            {loading && <p>Đang đăng nhập...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <button onClick={handleGithubLogin} disabled={loading}>
                Sign in with GitHub
            </button>
        </div>
    );
}

export default GithubLoginButton;