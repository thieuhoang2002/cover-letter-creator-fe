// AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { getRoleFromToken } from '../../apis/auth';
import { jwtDecode } from 'jwt-decode';
// Import hàm fetchUserProfile từ file authcontext.js
import { fetchUserProfile } from '../../apis/authcontext';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
    const [role, setRole] = useState(getRoleFromToken());
    const [avatarUrl, setAvatarUrl] = useState(null);
    const [userId, setUserId] = useState(null); // Thêm state cho userId
    const [email, setEmail] = useState(null);   // Thêm state cho email

    const login = async (token) => {
        localStorage.setItem('token', token);
        setIsAuthenticated(true);
        setRole(getRoleFromToken());
        try {
            const user = await fetchUserProfile(token);
            setAvatarUrl(user.avatarUrl);
            setUserId(user.id);
            setEmail(user.email);
        } catch (error) {
            console.error('Error in login:', error);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        setRole(null);
        setAvatarUrl(null);
        setUserId(null); // Reset userId
        setEmail(null);  // Reset email
        window.location.href = '/login';
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                const currentTime = Date.now() / 1000;
                if (decoded.exp < currentTime) {
                    console.warn('Token hết hạn, đăng xuất...');
                    logout();
                } else {
                    fetchUserProfile(token)
                        .then(user => {
                            setAvatarUrl(user.avatarUrl);
                            setUserId(user.id);
                            setEmail(user.email);
                        })
                        .catch(error => console.error('Error fetching profile in useEffect:', error));
                    const timeLeft = (decoded.exp - currentTime) * 1000;
                    setTimeout(() => {
                        console.warn('Token expired, logging out...');
                        logout();
                    }, timeLeft);
                }
            } catch (error) {
                console.error('Lỗi khi decode token:', error);
                logout();
            }
        }
    }, []);

    return (
        <AuthContext.Provider value={{ isAuthenticated, role, avatarUrl, userId, email, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
