import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../../apis/auth';
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
    Backdrop,
    CircularProgress,
    useTheme
} from '@mui/material';
import {
    Visibility,
    VisibilityOff,
    Person as PersonIcon,
    Email as EmailIcon,
    Lock as LockIcon,
    PersonAdd as PersonAddIcon
} from '@mui/icons-material';
import { useThemeMode } from '../../context/ThemeContext';

export default function Register() {
    const { mode } = useThemeMode();
    const isDark = mode === 'dark';

    const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
            setSuccess(null);
            return;
        }
        if (formData.password.length < 6) {
            setError('Mật khẩu phải có ít nhất 6 ký tự.');
            setSuccess(null);
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Mật khẩu xác nhận không khớp.');
            setSuccess(null);
            return;
        }

        setLoading(true);
        try {
            await registerUser(formData);
            setSuccess('Đăng ký tài khoản thành công! Đang chuyển đến trang đăng nhập...');
            setError(null);
            setTimeout(() => navigate('/login'), 1500);
        } catch (err) {
            if (err.response?.status === 429) {
                setError(typeof err.response.data === 'string' ? err.response.data : (err.response.data?.message || 'Bạn đã tạo quá nhiều yêu cầu đăng ký. Vui lòng thử lại sau ít phút.'));
            } else {
                setError(err.response?.data?.message || err.response?.data || 'Đăng ký thất bại. Email có thể đã tồn tại hoặc thông tin không hợp lệ.');
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
                    ? 'radial-gradient(ellipse at 50% 30%, rgba(124, 58, 237, 0.15) 0%, rgba(9, 13, 22, 1) 70%)'
                    : 'radial-gradient(ellipse at 50% 30%, rgba(124, 58, 237, 0.08) 0%, rgba(248, 250, 252, 1) 70%)'
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
                            : '0 20px 40px rgba(124, 58, 237, 0.06)'
                    }}
                >
                    {/* Header */}
                    <Box sx={{ textAlign: 'center', mb: 3.5 }}>
                        <Typography
                            variant="h4"
                            sx={{
                                fontWeight: 800,
                                mb: 1,
                                background: 'linear-gradient(135deg, #7c3aed 0%, #ec4899 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent'
                            }}
                        >
                            Tạo Tài Khoản Mới
                        </Typography>
                        <Typography variant="body2" sx={{ color: isDark ? '#94a3b8' : '#64748b' }}>
                            Trải nghiệm tạo CV AI và tải PDF không giới hạn hoàn toàn miễn phí
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
                            label="Họ và tên"
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            fullWidth
                            required
                            margin="normal"
                            placeholder="Nguyễn Văn A"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <PersonIcon fontSize="small" sx={{ color: isDark ? '#94a3b8' : '#64748b' }} />
                                    </InputAdornment>
                                )
                            }}
                            sx={{
                                mb: 2,
                                '& .MuiOutlinedInput-root': { borderRadius: 2.5 }
                            }}
                        />

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
                                mb: 2,
                                '& .MuiOutlinedInput-root': { borderRadius: 2.5 }
                            }}
                        />

                        <TextField
                            label="Xác nhận mật khẩu"
                            type={showConfirmPassword ? 'text' : 'password'}
                            name="confirmPassword"
                            value={formData.confirmPassword}
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
                                        <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
                                            {showConfirmPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}
                            sx={{
                                mb: 3,
                                '& .MuiOutlinedInput-root': { borderRadius: 2.5 }
                            }}
                        />

                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            size="large"
                            startIcon={<PersonAddIcon />}
                            sx={{
                                py: 1.4,
                                borderRadius: 2.5,
                                fontWeight: 700,
                                fontSize: '1rem',
                                background: 'linear-gradient(135deg, #7c3aed 0%, #ec4899 100%)',
                                color: '#ffffff',
                                boxShadow: '0 8px 20px rgba(124, 58, 237, 0.25)',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #6d28d9 0%, #db2777 100%)'
                                }
                            }}
                        >
                            Đăng ký tài khoản
                        </Button>
                    </Box>

                    {/* Back to Login link */}
                    <Box sx={{ textAlign: 'center', mt: 3.5 }}>
                        <Typography variant="body2" sx={{ color: isDark ? '#94a3b8' : '#64748b' }}>
                            Đã có tài khoản?{' '}
                            <Link
                                to="/login"
                                style={{
                                    fontWeight: 700,
                                    color: '#7c3aed',
                                    textDecoration: 'none'
                                }}
                            >
                                Đăng nhập tại đây
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
