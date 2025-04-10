import React, { useState } from 'react';
import { TextField, Button, Typography, Container, Box, Alert, CircularProgress } from '@mui/material';
import { changePassword } from '../../apis/user';
import { useAuth } from '../Auth/AuthContext';

const ChangePass = () => {
    const { logout } = useAuth();

    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleChangePassword = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            setError("Mật khẩu mới và xác nhận không khớp.");
            return;
        }

        try {
            setLoading(true);
            await changePassword(oldPassword, newPassword);
            setMessage("Đổi mật khẩu thành công. Vui lòng đăng nhập lại.");
            setError(null);
            setTimeout(() => {
                logout();
            }, 2000);
        } catch (err) {
            const resMessage =
                err.response?.data || "Đã xảy ra lỗi khi đổi mật khẩu. Vui lòng thử lại.";
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
                        <TextField
                            label="Mật khẩu cũ"
                            type="password"
                            fullWidth
                            margin="normal"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            required
                        />
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
