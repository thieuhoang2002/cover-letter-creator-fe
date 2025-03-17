import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser, getRoleFromToken } from '../../apis/auth';
import { useAuth } from './AuthContext';
import { Link } from 'react-router-dom';

function Login() {
    const { login } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = await loginUser(formData);
            login(token);
            console.log(token);
            setSuccess('Đăng nhập thành công');
            setError(null);

            // Điều hướng dựa trên role
            const role = getRoleFromToken();
            console.log(role);
            setTimeout(() => {
                if (role === 'admin') {
                    navigate('/admin');
                } else {
                    navigate('/');
                }
            }, 2000);
        } catch (err) {
            setError('Đăng nhập thất bại. Vui lòng kiểm tra email hoặc mật khẩu.');
            setSuccess(null);
        }
    };

    return (
        <div>
            <h1>Đăng nhập</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}>{success}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Mật khẩu:</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit">Đăng nhập</button>
                Bạn chưa có tài khoản? <Link to="/register">Đăng ký</Link>
            </form>
        </div>
    );
}

export default Login;