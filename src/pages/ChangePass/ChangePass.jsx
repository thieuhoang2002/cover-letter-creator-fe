import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, Container, Box, CircularProgress } from '@mui/material';
import { changePassword, changePasswordWithoutOld } from '../../apis/profile';
import { useAuth } from '../../pages/Auth/AuthContext'; // Import useAuth từ AuthContext
import { fetchUserProfile } from '../../apis/authcontext'; // Import hàm fetchUserProfile từ authcontext.js
import Alert from '@mui/material/Alert';

const ChangePass = () => {
    const { logout, token } = useAuth(); // Lấy token từ AuthContext
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isPasswordEmpty, setIsPasswordEmpty] = useState(false); // Trạng thái kiểm tra mật khẩu có trống không

    useEffect(() => {
        const fetchPasswordStatus = async () => {
            try {
                const user = await fetchUserProfile(token); // Gọi API lấy thông tin người dùng
                if (!user.password) {
                    setIsPasswordEmpty(true); // Nếu mật khẩu trống, ẩn ô mật khẩu cũ
                }
            } catch (err) {
                console.error('Error fetching user profile:', err);
            }
        };

        if (token) {
            fetchPasswordStatus(); // Gọi API khi có token
        }
    }, [token]);
    //console.log('Token:', token); // In token ra console để kiểm tra

    const handleChangePassword = async (e) => {
        e.preventDefault();
    
        if (newPassword !== confirmPassword) {
            setError('Mật khẩu mới và xác nhận không khớp.');
            return;
        }
    
        try {
            setLoading(true);
    
            if (isPasswordEmpty) {
                // Gọi API không cần mật khẩu cũ
                await changePasswordWithoutOld(newPassword);
            } else {
                // Gọi API có yêu cầu mật khẩu cũ
                await changePassword(oldPassword, newPassword);
            }
    
            setMessage('Đổi mật khẩu thành công. Vui lòng đăng nhập lại.');
            setError(null);
            setTimeout(() => {
                logout();
            }, 2000);
        } catch (err) {
            const resMessage =
                err.response?.data || 'Đã xảy ra lỗi khi đổi mật khẩu. Vui lòng thử lại.';
            setError(resMessage);
            setMessage(null);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
                backgroundColor: '#f5f5f5',
            }}
        >
            <Container maxWidth="sm">
                <Box p={4} boxShadow={3} borderRadius={2} bgcolor="#fff">
                    <Typography variant="h5" gutterBottom align="center">
                        Đổi mật khẩu
                    </Typography>
                    <form onSubmit={handleChangePassword}>
                        {!isPasswordEmpty ? (
                            <TextField
                                label="Mật khẩu cũ"
                                type="password"
                                fullWidth
                                margin="normal"
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                                required
                            />
                        ) : (
                            <Typography variant="body1" color="textSecondary" align="center">
                                Bạn chưa đặt mật khẩu, vui lòng tạo mật khẩu mới.
                            </Typography>
                        )}
                        <TextField
                            label="Mật khẩu mới"
                            type="password"
                            fullWidth
                            margin="normal"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                        <TextField
                            label="Xác nhận mật khẩu mới"
                            type="password"
                            fullWidth
                            margin="normal"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />

                        {loading && (
                            <Box display="flex" justifyContent="center" my={2}>
                                <CircularProgress />
                            </Box>
                        )}

                        {message && (
                            <Alert severity="success" sx={{ mt: 2 }}>
                                {message}
                            </Alert>
                        )}
                        {error && (
                            <Alert severity="error" sx={{ mt: 2 }}>
                                {error}
                            </Alert>
                        )}

                        <Box mt={3}>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                fullWidth
                                disabled={loading}
                            >
                                Đổi mật khẩu
                            </Button>
                        </Box>
                    </form>
                </Box>
            </Container>
        </Box>
    );
};

export default ChangePass;
