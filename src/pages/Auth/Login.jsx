import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser, getRoleFromToken } from '../../apis/auth';
import { useAuth } from './AuthContext';
import { Link } from 'react-router-dom';
import {
    Container, TextField, Button, Typography, Alert, Box, Paper, IconButton, InputAdornment
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import GoogleLoginButton from '../../components/GoogleLoginButton';
import GithubLoginButton from '../../components/GithubLoginButton';

export default function Login() {
    const { login } = useAuth();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = await loginUser(formData);
            login(token);
            setSuccess('Đăng nhập thành công!');
            setError(null);

            // Điều hướng dựa trên vai trò
            const role = getRoleFromToken();
            setTimeout(() => {
                navigate(role === 'admin' ? '/admin' : '/');
            }, 2000);
        } catch (err) {
            setError('Đăng nhập thất bại. Vui lòng kiểm tra email hoặc mật khẩu.');
            setSuccess(null);
        }
    };

    return (
        <Container maxWidth="sm">
            <Paper elevation={3} sx={{ p: 4, mt: 6, borderRadius: 2, marginTop: '64px', padding: '20px' }}>
                <Typography variant="h4" textAlign="center" gutterBottom>
                    Đăng nhập
                </Typography>

                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        fullWidth
                        required
                        margin="normal"
                        variant="outlined"
                    />
                    <TextField
                        label="Mật khẩu"
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        fullWidth
                        required
                        margin="normal"
                        variant="outlined"
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />

                    <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
                        Đăng nhập
                    </Button>
                    <div style={{ marginTop: '20px' }}>
                        <GoogleLoginButton />
                    </div>

                    <div style={{ marginTop: '20px' }}>
                        <GithubLoginButton />
                    </div>

                </form>

                <Box textAlign="center" mt={2}>
                    <Typography variant="body2">
                        Bạn chưa có tài khoản? <Link to="/register">Đăng ký</Link>
                    </Typography>
                </Box>
            </Paper>
        </Container>
    );
}
