import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  CircularProgress,
} from "@mui/material";
import { requestPasswordReset } from "../../apis/resetpass";
import Alert from '@mui/material/Alert';

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");
    setLoading(true);

    try {
      await requestPasswordReset(email);
      setSuccessMessage("Nếu email tồn tại, chúng tôi đã gửi một liên kết đặt lại mật khẩu.");
    } catch (error) {
      setErrorMessage("Đã xảy ra lỗi. Vui lòng thử lại sau. Chú ý: Hãy kiểm tra hộp thư của bạn, rất có thể bạn đã nhận được một email từ chúng tôi gần đây!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xs" sx={{ minHeight: "100vh", display: "flex", alignItems: "center" }}>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: 2,
          backgroundColor: "#f9f9f9",
          padding: 4,
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <Typography variant="h5" textAlign="center" fontWeight="bold">
          Quên mật khẩu
        </Typography>

        {successMessage && <Alert severity="success">{successMessage}</Alert>}
        {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          required
        />

        <Button type="submit" variant="contained" color="primary" disabled={loading} fullWidth>
          {loading ? <CircularProgress size={24} color="inherit" /> : "Gửi yêu cầu"}
        </Button>
      </Box>
    </Container>
  );
};

export default ForgotPassword;
