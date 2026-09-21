import React, { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  CircularProgress,
  Alert,
  Link,
  Stack,
} from "@mui/material";
import {
  LockReset,
  Email as EmailIcon,
  ArrowBack,
  CheckCircle,
  ErrorOutline,
} from "@mui/icons-material";
import { requestPasswordReset } from "../../apis/resetpass";
import { useThemeMode } from "../../context/ThemeContext";

const ForgotPassword = () => {
  const { mode } = useThemeMode();
  const isDark = mode === "dark";

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
      setSuccessMessage(
        "Nếu email của bạn tồn tại trong hệ thống, chúng tôi đã gửi liên kết đặt lại mật khẩu. Vui lòng kiểm tra hòm thư đến (hoặc thư rác/spam)."
      );
    } catch (error) {
      if (error.response?.status === 429) {
        setErrorMessage(
          typeof error.response.data === "string"
            ? error.response.data
            : "Bạn đã gửi quá nhiều yêu cầu đặt lại mật khẩu. Vui lòng đợi 10 phút trước khi thử lại."
        );
      } else {
        setErrorMessage(
          "Đã xảy ra sự cố khi xử lý yêu cầu. Vui lòng thử lại sau giây lát."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 64px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: isDark
          ? "radial-gradient(ellipse at top, #1e293b 0%, #0f172a 100%)"
          : "radial-gradient(ellipse at top, #ecfdf5 0%, #f8fafc 100%)",
        py: 6,
        px: 2,
      }}
    >
      <Container maxWidth="xs">
        <Box
          sx={{
            p: { xs: 3, sm: 4.5 },
            borderRadius: 4,
            bgcolor: isDark ? "rgba(30, 41, 59, 0.9)" : "#ffffff",
            boxShadow: isDark
              ? "0 20px 40px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.05)"
              : "0 20px 40px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(0, 0, 0, 0.05)",
            backdropFilter: "blur(10px)",
          }}
        >
          {/* Header */}
          <Box textAlign="center" mb={3}>
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: "16px",
                background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                mb: 1.5,
                boxShadow: "0 8px 16px rgba(16, 185, 129, 0.3)",
              }}
            >
              <EmailIcon fontSize="medium" />
            </Box>
            <Typography variant="h5" fontWeight={700} color={isDark ? "#f8fafc" : "#0f172a"}>
              Quên mật khẩu?
            </Typography>
            <Typography variant="body2" color="textSecondary" mt={0.5}>
              Nhập địa chỉ email đã đăng ký tài khoản để nhận liên kết xác thực đặt lại mật khẩu an toàn.
            </Typography>
          </Box>

          {/* Feedback Messages */}
          {successMessage && (
            <Alert
              severity="success"
              icon={<CheckCircle fontSize="inherit" />}
              sx={{ mb: 2, borderRadius: 2 }}
            >
              {successMessage}
            </Alert>
          )}
          {errorMessage && (
            <Alert
              severity="error"
              icon={<ErrorOutline fontSize="inherit" />}
              sx={{ mb: 2, borderRadius: 2 }}
            >
              {errorMessage}
            </Alert>
          )}

          {/* Form */}
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              label="Email đăng ký"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              required
              disabled={loading}
              placeholder="example@domain.com"
              sx={{ mb: 2.5 }}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={loading || !email}
              sx={{
                py: 1.3,
                borderRadius: 2,
                fontWeight: 600,
                textTransform: "none",
                fontSize: "1rem",
                background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                boxShadow: "0 4px 12px rgba(16, 185, 129, 0.3)",
                "&:hover": {
                  background: "linear-gradient(135deg, #059669 0%, #047857 100%)",
                },
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Gửi liên kết khôi phục"}
            </Button>
          </Box>

          {/* Back to Login link */}
          <Box mt={3} textAlign="center">
            <Link
              component={RouterLink}
              to="/login"
              underline="hover"
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 0.5,
                color: isDark ? "#60a5fa" : "#059669",
                fontWeight: 600,
                fontSize: "0.875rem",
              }}
            >
              <ArrowBack fontSize="small" /> Quay lại trang đăng nhập
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default ForgotPassword;
