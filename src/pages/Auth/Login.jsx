import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser, getRoleFromToken } from '../../apis/auth';
import { useAuth } from './AuthContext';
import {
    Container,
    TextField,
    Button,
    Typography,
    Box,
    Paper,
    IconButton,
    InputAdornment,
    Alert,
    Divider,
    Backdrop,
    CircularProgress,
    useTheme
} from '@mui/material';
import {
    Visibility,
    VisibilityOff,
    Email as EmailIcon,
    Lock as LockIcon,
    Login as LoginIcon
} from '@mui/icons-material';
import GoogleLoginButton from '../../components/GoogleLoginButton';
import GithubLoginButton from '../../components/GithubLoginButton';
import { useThemeMode } from '../../context/ThemeContext';

export default function Login() {
    const { login } = useAuth();
    const { mode } = useThemeMode();
    const isDark = mode === 'dark';

    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setError('Email không đúng định dạng.');
            return;
        }
        setLoading(true);
        try {
            const token = await loginUser(formData);
            login(token);
            setSuccess('Đăng nhập thành công!');
            setError(null);

            const role = getRoleFromToken();
            navigate(role === 'admin' ? '/admin' : '/');
        } catch (err) {
            if (err.response?.status === 429) {
                setError(typeof err.response.data === 'string' ? err.response.data : (err.response.data?.message || 'Bạn đã thực hiện quá nhiều yêu cầu đăng nhập. Vui lòng thử lại sau ít phút.'));
            } else {
                setError('Đăng nhập thất bại. Vui lòng kiểm tra email hoặc mật khẩu.');
            }
            setSuccess(null);
        } finally {
            setLoading(false);
        }
    };


    return (
        <Box
            sx={{
                minHeight: 'calc(100vh - 72px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                py: { xs: 4, md: 8 },
                px: 2,
                background: isDark
                    ? 'radial-gradient(ellipse at 50% 30%, rgba(37, 99, 235, 0.15) 0%, rgba(9, 13, 22, 1) 70%)'
                    : 'radial-gradient(ellipse at 50% 30%, rgba(37, 99, 235, 0.08) 0%, rgba(248, 250, 252, 1) 70%)'
            }}
        >
            <Container maxWidth="sm">
                <Paper
                    elevation={0}
                    sx={{
                        p: { xs: 3, sm: 5 },
                        borderRadius: 4,
                        border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.08)',
                        backgroundColor: isDark ? '#111827' : '#ffffff',
                        boxShadow: isDark
                            ? '0 20px 40px rgba(0, 0, 0, 0.6)'
                            : '0 20px 40px rgba(37, 99, 235, 0.06)'
                    }}
                >
                    {/* Header */}
                    <Box sx={{ textAlign: 'center', mb: 3.5 }}>
                        <Typography
                            variant="h4"
                            sx={{
                                fontWeight: 800,
                                mb: 1,
                                background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent'
                            }}
                        >
                            Chào Mừng Trở Lại!
                        </Typography>
                        <Typography variant="body2" sx={{ color: isDark ? '#94a3b8' : '#64748b' }}>
                            Đăng nhập để tiếp tục tạo và quản lý CV chuyên nghiệp
                        </Typography>
                    </Box>

                    {error && (
                        <Alert severity="error" sx={{ mb: 2.5, borderRadius: 2 }}>
                            {error}
                        </Alert>
                    )}
                    {success && (
                        <Alert severity="success" sx={{ mb: 2.5, borderRadius: 2 }}>
                            {success}
                        </Alert>
                    )}

                    {/* Form */}
                    <Box component="form" onSubmit={handleSubmit} noValidate>
                        <TextField
                            label="Địa chỉ Email"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            fullWidth
                            required
                            margin="normal"
                            placeholder="tenban@gmail.com"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <EmailIcon fontSize="small" sx={{ color: isDark ? '#94a3b8' : '#64748b' }} />
                                    </InputAdornment>
                                )
                            }}
                            sx={{
                                mb: 2,
                                '& .MuiOutlinedInput-root': { borderRadius: 2.5 }
                            }}
                        />

                        <TextField
                            label="Mật khẩu"
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            fullWidth
                            required
                            margin="normal"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <LockIcon fontSize="small" sx={{ color: isDark ? '#94a3b8' : '#64748b' }} />
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                            {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}
                            sx={{
                                mb: 1,
                                '& .MuiOutlinedInput-root': { borderRadius: 2.5 }
                            }}
                        />

                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2.5 }}>
                            <Link
                                to="/forgot-password"
                                style={{
                                    fontSize: '0.875rem',
                                    fontWeight: 600,
                                    color: '#2563eb',
                                    textDecoration: 'none'
                                }}
                            >
                                Quên mật khẩu?
                            </Link>
                        </Box>

                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            size="large"
                            startIcon={<LoginIcon />}
                            sx={{
                                py: 1.4,
                                borderRadius: 2.5,
                                fontWeight: 700,
                                fontSize: '1rem',
                                background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
                                color: '#ffffff',
                                boxShadow: '0 8px 20px rgba(37, 99, 235, 0.25)',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #1d4ed8 0%, #6d28d9 100%)'
                                }
                            }}
                        >
                            Đăng nhập
                        </Button>
                    </Box>

                    {/* Divider */}
                    <Box sx={{ my: 3.5, position: 'relative', textAlign: 'center' }}>
                        <Divider />
                        <Typography
                            variant="caption"
                            sx={{
                                position: 'absolute',
                                top: '-10px',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                px: 2,
                                bgcolor: isDark ? '#111827' : '#ffffff',
                                color: isDark ? '#94a3b8' : '#64748b',
                                fontWeight: 600
                            }}
                        >
                            HOẶC ĐĂNG NHẬP NHANH VỚI
                        </Typography>
                    </Box>

                    {/* Social Logins */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <GoogleLoginButton />
                        <GithubLoginButton />
                    </Box>

                    {/* Register link */}
                    <Box sx={{ textAlign: 'center', mt: 3.5 }}>
                        <Typography variant="body2" sx={{ color: isDark ? '#94a3b8' : '#64748b' }}>
                            Bạn chưa có tài khoản?{' '}
                            <Link
                                to="/register"
                                style={{
                                    fontWeight: 700,
                                    color: '#2563eb',
                                    textDecoration: 'none'
                                }}
                            >
                                Đăng ký ngay
                            </Link>
                        </Typography>
                    </Box>
                </Paper>
            </Container>

            {/* Backdrop loading */}
            <Backdrop sx={{ color: '#fff', zIndex: (th) => th.zIndex.drawer + 2 }} open={loading}>
                <CircularProgress color="inherit" />
            </Backdrop>
        </Box>
    );
}
