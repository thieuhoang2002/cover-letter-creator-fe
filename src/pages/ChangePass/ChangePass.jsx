import React, { useState, useEffect } from 'react';
import {
    TextField,
    Button,
    Typography,
    Container,
    Box,
    CircularProgress,
    Alert,
    IconButton,
    InputAdornment,
    LinearProgress,
    Stack,
    Divider
} from '@mui/material';
import {
    Visibility,
    VisibilityOff,
    LockReset,
    CheckCircle,
    Cancel,
    Security
} from '@mui/icons-material';
import { changePassword, changePasswordWithoutOld, checkHasPassword } from '../../apis/profile';
import { useAuth } from '../../pages/Auth/AuthContext';
import { fetchUserProfile } from '../../apis/authcontext';
import { useThemeMode } from '../../context/ThemeContext';

const getPasswordStrength = (pwd) => {
    if (!pwd) return { score: 0, label: '', color: 'primary' };
    let score = 0;
    if (pwd.length >= 8) score += 1;
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) score += 1;
    if (/\d/.test(pwd)) score += 1;
    if (/[^a-zA-Z0-9]/.test(pwd)) score += 1;

    switch (score) {
        case 1:
            return { score: 25, label: 'Yếu', color: 'error' };
        case 2:
            return { score: 50, label: 'Trung bình', color: 'warning' };
        case 3:
            return { score: 75, label: 'Khá mạnh', color: 'info' };
        case 4:
            return { score: 100, label: 'Rất mạnh', color: 'success' };
        default:
            return { score: 15, label: 'Quá ngắn', color: 'error' };
    }
};

const ChangePass = () => {
    const { logout, token } = useAuth();
    const { mode } = useThemeMode();
    const isDark = mode === 'dark';

    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [checkingProfile, setCheckingProfile] = useState(true);
    const [isPasswordEmpty, setIsPasswordEmpty] = useState(false);

    useEffect(() => {
        const fetchPasswordStatus = async () => {
            try {
                if (token) {
                    const user = await fetchUserProfile(token);
                    if (user && user.hasPassword !== undefined) {
                        setIsPasswordEmpty(user.hasPassword === false);
                    } else {
                        const hasPass = await checkHasPassword();
                        setIsPasswordEmpty(!hasPass);
                    }
                }
            } catch (err) {
                console.error('Lỗi khi lấy thông tin người dùng:', err);
                try {
                    const hasPass = await checkHasPassword();
                    setIsPasswordEmpty(!hasPass);
                } catch (e) {
                    setIsPasswordEmpty(false);
                }
            } finally {
                setCheckingProfile(false);
            }
        };

        fetchPasswordStatus();
    }, [token]);

    const strength = getPasswordStrength(newPassword);

    const handleChangePassword = async (e) => {
        e.preventDefault();
        setMessage(null);
        setError(null);

        if (newPassword.length < 8) {
            setError('Mật khẩu mới phải có tối thiểu 8 ký tự.');
            return;
        }

        if (!isPasswordEmpty && oldPassword === newPassword) {
            setError('Mật khẩu mới không được trùng với mật khẩu hiện tại.');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('Mật khẩu xác nhận không khớp với mật khẩu mới.');
            return;
        }

        try {
            setLoading(true);

            if (isPasswordEmpty) {
                await changePasswordWithoutOld(newPassword);
            } else {
                await changePassword(oldPassword, newPassword);
            }

            setMessage('Đổi mật khẩu thành công! Bạn sẽ được chuyển hướng đăng nhập lại sau giây lát...');
            setError(null);
            setTimeout(() => {
                logout();
            }, 2500);
        } catch (err) {
            if (err.response?.status === 429) {
                setError('Bạn đã gửi quá nhiều yêu cầu. Vì lý do an toàn, vui lòng đợi 1 phút trước khi thử lại.');
            } else {
                const resMessage =
                    err.response?.data?.message ||
                    err.response?.data ||
                    'Đã xảy ra lỗi khi đổi mật khẩu. Vui lòng kiểm tra lại mật khẩu cũ.';
                setError(typeof resMessage === 'string' ? resMessage : 'Đổi mật khẩu thất bại. Vui lòng thử lại.');
            }
        } finally {
            setLoading(false);
        }
    };

    if (checkingProfile) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box
            sx={{
                minHeight: 'calc(100vh - 64px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: isDark
                    ? 'radial-gradient(ellipse at top, #1e293b 0%, #0f172a 100%)'
                    : 'radial-gradient(ellipse at top, #f0fdf4 0%, #f8fafc 100%)',
                py: 6,
                px: 2
            }}
        >
            <Container maxWidth="sm">
                <Box
                    sx={{
                        p: { xs: 3, sm: 5 },
                        borderRadius: 4,
                        bgcolor: isDark ? 'rgba(30, 41, 59, 0.9)' : '#ffffff',
                        boxShadow: isDark
                            ? '0 20px 40px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.05)'
                            : '0 20px 40px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(0, 0, 0, 0.05)',
                        backdropFilter: 'blur(10px)',
                    }}
                >
                    {/* Header */}
                    <Box textAlign="center" mb={3}>
                        <Box
                            sx={{
                                width: 56,
                                height: 56,
                                borderRadius: '16px',
                                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#fff',
                                mb: 1.5,
                                boxShadow: '0 8px 16px rgba(16, 185, 129, 0.3)'
                            }}
                        >
                            <LockReset fontSize="large" />
                        </Box>
                        <Typography variant="h5" fontWeight={700} color={isDark ? '#f8fafc' : '#0f172a'}>
                            {isPasswordEmpty ? 'Thiết lập mật khẩu' : 'Đổi mật khẩu tài khoản'}
                        </Typography>
                        <Typography variant="body2" color="textSecondary" mt={0.5}>
                            {isPasswordEmpty
                                ? 'Tài khoản Google của bạn chưa đặt mật khẩu. Hãy tạo mật khẩu để có thể đăng nhập bằng email.'
                                : 'Bảo vệ tài khoản bằng mật khẩu mạnh mẽ có ít nhất 8 ký tự.'}
                        </Typography>
                    </Box>

                    {/* Alerts */}
                    {message && (
                        <Alert severity="success" icon={<CheckCircle fontSize="inherit" />} sx={{ mb: 2, borderRadius: 2 }}>
                            {message}
                        </Alert>
                    )}
                    {error && (
                        <Alert severity="error" icon={<Cancel fontSize="inherit" />} sx={{ mb: 2, borderRadius: 2 }}>
                            {error}
                        </Alert>
                    )}

                    {/* Form */}
                    <Box component="form" onSubmit={handleChangePassword}>
                        {!isPasswordEmpty && (
                            <TextField
                                label="Mật khẩu hiện tại"
                                type={showOldPassword ? 'text' : 'password'}
                                fullWidth
                                margin="normal"
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                                required
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={() => setShowOldPassword(!showOldPassword)}
                                                edge="end"
                                                size="small"
                                            >
                                                {showOldPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }}
                            />
                        )}

                        <TextField
                            label="Mật khẩu mới"
                            type={showNewPassword ? 'text' : 'password'}
                            fullWidth
                            margin="normal"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            helperText="Tối thiểu 8 ký tự, khuyến khích kết hợp chữ hoa, chữ thường, số và ký hiệu"
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => setShowNewPassword(!showNewPassword)}
                                            edge="end"
                                            size="small"
                                        >
                                            {showNewPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}
                        />

                        {/* Password Strength Indicator */}
                        {newPassword && (
                            <Box sx={{ mt: 1, mb: 1.5 }}>
                                <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.5}>
                                    <Typography variant="caption" color="textSecondary">
                                        Độ an toàn mật khẩu:
                                    </Typography>
                                    <Typography
                                        variant="caption"
                                        fontWeight={600}
                                        color={`${strength.color}.main`}
                                    >
                                        {strength.label}
                                    </Typography>
                                </Box>
                                <LinearProgress
                                    variant="determinate"
                                    value={strength.score}
                                    color={strength.color}
                                    sx={{ height: 6, borderRadius: 3 }}
                                />
                            </Box>
                        )}

                        <TextField
                            label="Xác nhận mật khẩu mới"
                            type={showConfirmPassword ? 'text' : 'password'}
                            fullWidth
                            margin="normal"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            error={confirmPassword !== '' && newPassword !== confirmPassword}
                            helperText={
                                confirmPassword !== '' && newPassword !== confirmPassword
                                    ? 'Mật khẩu xác nhận không khớp'
                                    : ''
                            }
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            edge="end"
                                            size="small"
                                        >
                                            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}
                        />

                        {/* Security Tips */}
                        <Box
                            sx={{
                                mt: 2,
                                p: 1.5,
                                borderRadius: 2,
                                bgcolor: isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc',
                                border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : '#e2e8f0'}`
                            }}
                        >
                            <Stack direction="row" spacing={1} alignItems="center" mb={0.5}>
                                <Security fontSize="small" color="success" />
                                <Typography variant="caption" fontWeight={600} color={isDark ? '#e2e8f0' : '#334155'}>
                                    Tiêu chuẩn bảo mật:
                                </Typography>
                            </Stack>
                            <Typography variant="caption" color="textSecondary" display="block">
                                • Tối thiểu 8 ký tự.
                            </Typography>
                            <Typography variant="caption" color="textSecondary" display="block">
                                • Không sử dụng mật khẩu đã từng dùng cho tài khoản này.
                            </Typography>
                            <Typography variant="caption" color="textSecondary" display="block">
                                • Sau khi đổi mật khẩu, bạn sẽ được tự động đăng xuất để đảm bảo an toàn.
                            </Typography>
                        </Box>

                        <Box mt={3}>
                            <Button
                                type="submit"
                                variant="contained"
                                fullWidth
                                size="large"
                                disabled={loading}
                                sx={{
                                    py: 1.4,
                                    borderRadius: 2,
                                    fontWeight: 600,
                                    textTransform: 'none',
                                    fontSize: '1rem',
                                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                                    '&:hover': {
                                        background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                                    }
                                }}
                            >
                                {loading ? (
                                    <CircularProgress size={24} color="inherit" />
                                ) : isPasswordEmpty ? (
                                    'Lưu mật khẩu mới'
                                ) : (
                                    'Cập nhật mật khẩu'
                                )}
                            </Button>
                        </Box>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
};

export default ChangePass;
