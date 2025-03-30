import React, { createContext, useState, useContext, useEffect } from 'react';
import { getRoleFromToken } from '../../apis/auth';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
    const [role, setRole] = useState(getRoleFromToken());
    const [avatarUrl, setAvatarUrl] = useState(null);

    const login = async (token) => {
        localStorage.setItem('token', token);
        setIsAuthenticated(true);
        setRole(getRoleFromToken());
        await fetchUserProfile(token); // Lấy avatar_url từ API
    };

    const logout = () => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        setRole(null);
        setAvatarUrl(null);
    };

    const fetchUserProfile = async (token) => {
        try {
            const response = await fetch('http://localhost:8080/api/users/profile/me', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (response.ok) {
                const user = await response.json();
                console.log('User profile:', user); // Log để kiểm tra
                setAvatarUrl(user.avatarUrl);
                console.log('Avatar URL from API:', user.avatarUrl);
            }
        } catch (error) {
            console.error('Error fetching user profile:', error);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            fetchUserProfile(token); // Lấy avatar_url khi khởi tạo
        }
    }, []);

    return (
        <AuthContext.Provider value={{ isAuthenticated, role, avatarUrl, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);