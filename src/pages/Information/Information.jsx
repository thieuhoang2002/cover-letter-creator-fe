import React, { useEffect, useState } from "react";
import {
  Box,
  TextField,
  Button,
  Avatar,
  Typography,
  Snackbar,
  CircularProgress,
  Paper,
} from "@mui/material";
import { getCurrentUser, updateCurrentUserProfile } from "../../apis/profile"; 
import Alert from '@mui/material/Alert';

const Information = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    birthday: "",
    avatarUrl: "",
    school: "",
    specialization: "",
  });
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await getCurrentUser();
        setFormData({
          name: user.name || "",
          email: user.email || "",
          phone: user.phone || "",
          address: user.address || "",
          birthday: user.birthday ? user.birthday.split("T")[0] : "", // <-- FIX ở đây
          avatarUrl: user.avatarUrl || "",
          school: user.school || "",
          specialization: user.specialization || "",
        });
      } catch (error) {
        console.error("Lỗi khi lấy thông tin người dùng:", error);
        setSnackbar({ open: true, message: "Không thể tải thông tin người dùng", severity: "error" });
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);
  

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateCurrentUserProfile(formData);
      setSnackbar({ open: true, message: "Cập nhật thông tin thành công", severity: "success" });
    } catch (error) {
      console.error("Lỗi cập nhật thông tin:", error);
      setSnackbar({ open: true, message: "Cập nhật thất bại", severity: "error" });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 600, mx: "auto", mt: 5 }}>
      <Typography variant="h5" gutterBottom>
        Thông tin cá nhân
      </Typography>

      <Box display="flex" justifyContent="center" mb={2}>
        <Avatar
          src={formData.avatarUrl}
          sx={{ width: 80, height: 80 }}
        />
      </Box>

      <Box component="form" onSubmit={handleSubmit} noValidate>
        <TextField
          fullWidth
          margin="normal"
          label="Link Avatar"
          name="avatarUrl"
          value={formData.avatarUrl}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Họ tên"
          name="name"
          value={formData.name}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          disabled
        />
        <TextField
          fullWidth
          margin="normal"
          label="Số điện thoại"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Địa chỉ"
          name="address"
          value={formData.address}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Ngày sinh"
          name="birthday"
          type="date"
          value={formData.birthday}
          onChange={handleChange}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Tốt nghiệp trường"
          name="school"
          value={formData.school}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Chuyên ngành"
          name="specialization"
          value={formData.specialization}
          onChange={handleChange}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
        >
          Cập nhật
        </Button>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity={snackbar.severity} onClose={handleCloseSnackbar}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default Information;
