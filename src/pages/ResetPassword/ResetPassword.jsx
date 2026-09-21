import React, { useState } from "react";
import { useNavigate, useSearchParams, Link as RouterLink } from "react-router-dom";
import { resetPassword } from "../../apis/resetpass";
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  CircularProgress,
  Alert,
  IconButton,
  InputAdornment,
  LinearProgress,
  Link,
  Stack,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Key,
  CheckCircle,
  ErrorOutline,
  ArrowBack,
  Security,
} from "@mui/icons-material";
import { useThemeMode } from "../../context/ThemeContext";

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

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();
  const { mode } = useThemeMode();
  const isDark = mode === "dark";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const strength = getPasswordStrength(newPassword);

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!token) {
      setErrorMessage("Liên kết xác thực thiếu mã token. Vui lòng kiểm tra lại đường link từ email.");
      return;
    }

    if (newPassword.length < 8) {
      setErrorMessage("Mật khẩu mới phải có tối thiểu 8 ký tự.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage("Mật khẩu xác nhận không khớp với mật khẩu mới.");
      return;
    }

    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      await resetPassword(token ? token.trim() : "", newPassword);
      setSuccessMessage("Đặt lại mật khẩu thành công! Bạn sẽ được chuyển tới trang đăng nhập...");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      if (error.response?.status === 429) {
        setErrorMessage("Bạn đã gửi quá nhiều yêu cầu. Vui lòng đợi trong giây lát.");
      } else {
        const msg = error.response?.data?.message || error.response?.data || "Mã token không hợp lệ hoặc đã hết hạn. Vui lòng yêu cầu lại liên kết mới.";
        setErrorMessage(typeof msg === 'string' ? msg : "Mã xác thực không hợp lệ.");
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
              <Key fontSize="medium" />
            </Box>
            <Typography variant="h5" fontWeight={700} color={isDark ? "#f8fafc" : "#0f172a"}>
              Đặt lại mật khẩu
            </Typography>
            <Typography variant="body2" color="textSecondary" mt={0.5}>
              Nhập mật khẩu mới cho tài khoản của bạn (tối thiểu 8 ký tự).
            </Typography>
          </Box>

          {/* Missing Token Warning */}
          {!token && (
            <Alert severity="warning" sx={{ mb: 2, borderRadius: 2 }}>
              Không tìm thấy token hợp lệ trong liên kết. Vui lòng mở đường dẫn chính xác được gửi qua email.
            </Alert>
          )}

          {/* Alerts */}
          {successMessage && (
            <Alert severity="success" icon={<CheckCircle fontSize="inherit" />} sx={{ mb: 2, borderRadius: 2 }}>
              {successMessage}
            </Alert>
          )}
          {errorMessage && (
            <Alert severity="error" icon={<ErrorOutline fontSize="inherit" />} sx={{ mb: 2, borderRadius: 2 }}>
              {errorMessage}
            </Alert>
          )}

          {/* Form */}
          <Box component="form" onSubmit={handleResetPassword}>
            <TextField
              label="Mật khẩu mới"
              type={showNewPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              fullWidth
              required
              disabled={loading || !token}
              helperText="Tối thiểu 8 ký tự"
              sx={{ mb: 1 }}
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
                ),
              }}
            />

            {/* Password strength meter */}
            {newPassword && (
              <Box sx={{ mb: 2 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.5}>
                  <Typography variant="caption" color="textSecondary">
                    Độ an toàn:
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
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              fullWidth
              required
              disabled={loading || !token}
              error={confirmPassword !== "" && newPassword !== confirmPassword}
              helperText={
                confirmPassword !== "" && newPassword !== confirmPassword
                  ? "Mật khẩu xác nhận không khớp"
                  : ""
              }
              sx={{ mb: 2.5 }}
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
                ),
              }}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={loading || !token || !newPassword || !confirmPassword}
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
              {loading ? <CircularProgress size={24} color="inherit" /> : "Đặt lại mật khẩu"}
            </Button>
          </Box>

          {/* Links */}
          <Stack direction="row" justifyContent="center" spacing={2} mt={3}>
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
              <ArrowBack fontSize="small" /> Đăng nhập
            </Link>
            <Typography variant="body2" color="textSecondary">•</Typography>
            <Link
              component={RouterLink}
              to="/forgot-password"
              underline="hover"
              sx={{
                color: "textSecondary",
                fontSize: "0.875rem",
              }}
            >
              Yêu cầu mã mới
            </Link>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
};

export default ResetPassword;
