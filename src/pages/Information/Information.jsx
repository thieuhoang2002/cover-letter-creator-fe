import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  TextField,
  Button,
  Avatar,
  Typography,
  Snackbar,
  CircularProgress,
  Paper,
  IconButton,
  Tabs,
  Tab,
  Card,
  CardContent,
  Stack,
  Chip,
  Grid,
  Divider,
  Tooltip,
} from "@mui/material";
import {
  Add,
  Delete,
  Person,
  School,
  Work,
  WorkspacePremium,
  Psychology,
  Favorite,
  Save,
  CheckCircle,
  CameraAlt,
} from "@mui/icons-material";
import Alert from "@mui/material/Alert";
import { getCurrentUser, updateCurrentUserProfile, uploadAvatar } from "../../apis/profile";
import { useThemeMode } from "../../context/ThemeContext";
import { useAuth } from "../Auth/AuthContext";


const Information = () => {
  const { mode } = useThemeMode();
  const isDark = mode === "dark";
  const { updateAvatarUrl } = useAuth();

  const [activeTab, setActiveTab] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    birthday: "",
    avatarUrl: "",
    specialization: "",
    skills: [],
    experiences: [],
    certificates: [],
    hobbies: [],
    educations: [],
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const fileInputRef = useRef(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });


  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await getCurrentUser();
        setFormData({
          name: user.name || "",
          email: user.email || "",
          phone: user.phone || "",
          address: user.address || "",
          birthday: user.birthday ? user.birthday.split("T")[0] : "",
          avatarUrl: user.avatarUrl || "",
          specialization: user.specialization || "",
          skills: Array.isArray(user.skills) ? user.skills : [],
          experiences: Array.isArray(user.experiences) ? user.experiences : [],
          certificates: Array.isArray(user.certificates) ? user.certificates : [],
          hobbies: Array.isArray(user.hobbies) ? user.hobbies : [],
          educations: Array.isArray(user.educations) ? user.educations : [],
        });
      } catch (error) {
        console.error("Lỗi khi lấy thông tin người dùng:", error);
        setSnackbar({
          open: true,
          message: "Không thể tải thông tin người dùng",
          severity: "error",
        });
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

  const handleListChange = (field, index, key, value) => {
    setFormData((prev) => {
      const updatedList = [...prev[field]];
      updatedList[index] = { ...updatedList[index], [key]: value };
      return { ...prev, [field]: updatedList };
    });
  };

  const handleAddItem = (field, newItem) => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], newItem],
    }));
  };

  const handleRemoveItem = (field, index) => {
    setFormData((prev) => {
      const updatedList = [...prev[field]];
      updatedList.splice(index, 1);
      return { ...prev, [field]: updatedList };
    });
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setSaving(true);
    try {
      await updateCurrentUserProfile(formData);
      setSnackbar({
        open: true,
        message: "Lưu hồ sơ cá nhân thành công!",
        severity: "success",
      });
    } catch (error) {
      console.error("Lỗi cập nhật thông tin:", error);
      setSnackbar({
        open: true,
        message: "Cập nhật hồ sơ thất bại. Vui lòng thử lại sau.",
        severity: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      setSnackbar({ open: true, message: "Chỉ chấp nhận định dạng .jpg, .png, .webp", severity: "error" });
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setSnackbar({ open: true, message: "Ảnh không được vượt quá 2MB", severity: "error" });
      return;
    }
    setAvatarPreview(URL.createObjectURL(file));
    handleAvatarUpload(file);
  };

  const handleAvatarUpload = async (file) => {
    setAvatarUploading(true);
    try {
      const result = await uploadAvatar(file);
      const newUrl = result.avatarUrl;
      setFormData((prev) => ({ ...prev, avatarUrl: newUrl }));
      updateAvatarUrl(newUrl);
      setAvatarPreview(null);
      setSnackbar({ open: true, message: "Cập nhật ảnh đại diện thành công!", severity: "success" });
    } catch (error) {
      console.error("Lỗi upload avatar:", error);
      setSnackbar({ open: true, message: error?.response?.data?.message || "Lỗi khi tải ảnh lên", severity: "error" });
      setAvatarPreview(null);
    } finally {
      setAvatarUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="70vh">
        <CircularProgress sx={{ color: "#10b981" }} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 64px)",
        background: isDark
          ? "radial-gradient(ellipse at top, #1e293b 0%, #0f172a 100%)"
          : "radial-gradient(ellipse at top, #f0fdf4 0%, #f8fafc 100%)",
        py: 5,
        px: { xs: 2, md: 4 },
      }}
    >
      <Box sx={{ maxWidth: 960, mx: "auto" }}>
        {/* Header Profile Summary */}
        <Paper
          elevation={0}
          sx={{
            p: 3.5,
            mb: 3,
            borderRadius: 4,
            bgcolor: isDark ? "rgba(30, 41, 59, 0.85)" : "#ffffff",
            boxShadow: isDark
              ? "0 10px 25px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.06)"
              : "0 10px 25px rgba(0,0,0,0.04), 0 0 0 1px rgba(0,0,0,0.04)",
            backdropFilter: "blur(12px)",
          }}
        >
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={3}
            alignItems={{ xs: "center", sm: "center" }}
            justifyContent="space-between"
          >
            <Stack direction="row" spacing={2.5} alignItems="center">
              {/* Avatar with upload overlay */}
              <Box sx={{ position: "relative", display: "inline-flex" }}>
                <Avatar
                  src={avatarPreview || formData.avatarUrl}
                  alt={formData.name}
                  sx={{
                    width: 76,
                    height: 76,
                    border: "3px solid #10b981",
                    boxShadow: "0 4px 12px rgba(16, 185, 129, 0.25)",
                    fontSize: "1.75rem",
                    fontWeight: 700,
                    bgcolor: "#10b981",
                  }}
                >
                  {formData.name ? formData.name.charAt(0).toUpperCase() : "U"}
                </Avatar>
                <Tooltip title="Thay ảnh đại diện">
                  <IconButton
                    onClick={() => fileInputRef.current?.click()}
                    disabled={avatarUploading}
                    size="small"
                    sx={{
                      position: "absolute",
                      bottom: -4,
                      right: -4,
                      bgcolor: "#10b981",
                      color: "white",
                      width: 26,
                      height: 26,
                      border: "2px solid white",
                      "&:hover": { bgcolor: "#059669" },
                    }}
                  >
                    {avatarUploading ? (
                      <CircularProgress size={12} sx={{ color: "white" }} />
                    ) : (
                      <CameraAlt sx={{ fontSize: 14 }} />
                    )}
                  </IconButton>
                </Tooltip>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  hidden
                  onChange={handleAvatarFileChange}
                />
              </Box>

              <Box>
                <Typography variant="h5" fontWeight={700} color={isDark ? "#f8fafc" : "#0f172a"}>
                  {formData.name || "Chưa đặt họ tên"}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {formData.email}
                </Typography>
                {formData.specialization && (
                  <Chip
                    label={formData.specialization}
                    size="small"
                    color="primary"
                    sx={{
                      mt: 1,
                      fontWeight: 600,
                      background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                    }}
                  />
                )}
              </Box>
            </Stack>

            <Button
              variant="contained"
              startIcon={saving ? <CircularProgress size={18} color="inherit" /> : <Save />}
              onClick={handleSubmit}
              disabled={saving}
              sx={{
                borderRadius: 2.5,
                px: 3.5,
                py: 1.2,
                fontWeight: 600,
                textTransform: "none",
                fontSize: "0.95rem",
                background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                boxShadow: "0 4px 12px rgba(16, 185, 129, 0.3)",
                "&:hover": {
                  background: "linear-gradient(135deg, #059669 0%, #047857 100%)",
                },
              }}
            >
              {saving ? "Đang lưu..." : "Lưu thay đổi"}
            </Button>
          </Stack>
        </Paper>

        {/* Tab Navigation */}
        <Paper
          elevation={0}
          sx={{
            borderRadius: 4,
            bgcolor: isDark ? "rgba(30, 41, 59, 0.85)" : "#ffffff",
            boxShadow: isDark
              ? "0 10px 25px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.06)"
              : "0 10px 25px rgba(0,0,0,0.04), 0 0 0 1px rgba(0,0,0,0.04)",
            overflow: "hidden",
          }}
        >
          <Tabs
            value={activeTab}
            onChange={(e, val) => setActiveTab(val)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              borderBottom: 1,
              borderColor: isDark ? "rgba(255,255,255,0.08)" : "divider",
              px: 2,
              "& .MuiTab-root": {
                fontWeight: 600,
                textTransform: "none",
                fontSize: "0.925rem",
                py: 2,
              },
            }}
          >
            <Tab icon={<Person fontSize="small" />} iconPosition="start" label="Thông tin cá nhân" />
            <Tab icon={<Work fontSize="small" />} iconPosition="start" label="Kinh nghiệm & Học vấn" />
            <Tab icon={<Psychology fontSize="small" />} iconPosition="start" label="Kỹ năng & Chứng chỉ" />
            <Tab icon={<Favorite fontSize="small" />} iconPosition="start" label="Sở thích" />
          </Tabs>

          <Box p={{ xs: 2.5, sm: 4 }}>
            {/* Tab 0: Basic Information */}
            {activeTab === 0 && (
              <Box component="form" onSubmit={handleSubmit}>
                <Typography variant="subtitle1" fontWeight={700} color={isDark ? "#f8fafc" : "#0f172a"} mb={2}>
                  Thông tin liên hệ & Cơ bản
                </Typography>
                <Grid container spacing={2.5}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Họ và tên"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Địa chỉ Email"
                      name="email"
                      value={formData.email}
                      disabled
                      helperText="Email định danh tài khoản, không thể thay đổi"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Số điện thoại"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="0987 654 321"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Ngày sinh"
                      name="birthday"
                      type="date"
                      value={formData.birthday}
                      onChange={handleChange}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Chuyên môn / Nghề nghiệp"
                      name="specialization"
                      value={formData.specialization}
                      onChange={handleChange}
                      placeholder="Fullstack Developer, Marketing Specialist..."
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Link ảnh đại diện (URL)"
                      name="avatarUrl"
                      value={formData.avatarUrl}
                      onChange={handleChange}
                      placeholder="https://example.com/avatar.jpg"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Địa chỉ cư trú"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Quận 1, TP. Hồ Chí Minh"
                    />
                  </Grid>
                </Grid>
              </Box>
            )}

            {/* Tab 1: Experience & Education */}
            {activeTab === 1 && (
              <Box>
                {/* Experiences */}
                <Box mb={4}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="subtitle1" fontWeight={700} color={isDark ? "#f8fafc" : "#0f172a"}>
                      Kinh nghiệm làm việc ({formData.experiences.length})
                    </Typography>
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<Add />}
                      onClick={() =>
                        handleAddItem("experiences", {
                          company: "",
                          role: "",
                          time: "",
                          description: "",
                        })
                      }
                      sx={{ textTransform: "none", borderRadius: 2 }}
                    >
                      Thêm kinh nghiệm
                    </Button>
                  </Stack>

                  {formData.experiences.length === 0 ? (
                    <Typography variant="body2" color="textSecondary" sx={{ py: 2, textAlign: "center" }}>
                      Chưa có mục kinh nghiệm làm việc nào. Bấm "Thêm kinh nghiệm" để bổ sung.
                    </Typography>
                  ) : (
                    formData.experiences.map((item, index) => (
                      <Card
                        key={index}
                        variant="outlined"
                        sx={{
                          mb: 2,
                          p: 2.5,
                          borderRadius: 3,
                          bgcolor: isDark ? "rgba(255,255,255,0.02)" : "#fafafa",
                        }}
                      >
                        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1.5}>
                          <Chip
                            label={`Kinh nghiệm #${index + 1}`}
                            size="small"
                            color="success"
                            variant="outlined"
                          />
                          <IconButton size="small" color="error" onClick={() => handleRemoveItem("experiences", index)}>
                            <Delete fontSize="small" />
                          </IconButton>
                        </Stack>
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              size="small"
                              label="Tên công ty / Doanh nghiệp"
                              value={item.company || ""}
                              onChange={(e) => handleListChange("experiences", index, "company", e.target.value)}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              size="small"
                              label="Vị trí / Chức danh"
                              value={item.role || ""}
                              onChange={(e) => handleListChange("experiences", index, "role", e.target.value)}
                            />
                          </Grid>
                          <Grid item xs={12} sm={4}>
                            <TextField
                              fullWidth
                              size="small"
                              label="Thời gian làm việc"
                              placeholder="2022 - Hiện tại"
                              value={item.time || ""}
                              onChange={(e) => handleListChange("experiences", index, "time", e.target.value)}
                            />
                          </Grid>
                          <Grid item xs={12} sm={8}>
                            <TextField
                              fullWidth
                              size="small"
                              label="Mô tả công việc & Thành tựu"
                              multiline
                              rows={2}
                              value={item.description || ""}
                              onChange={(e) => handleListChange("experiences", index, "description", e.target.value)}
                            />
                          </Grid>
                        </Grid>
                      </Card>
                    ))
                  )}
                </Box>

                <Divider sx={{ my: 3 }} />

                {/* Educations */}
                <Box>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="subtitle1" fontWeight={700} color={isDark ? "#f8fafc" : "#0f172a"}>
                      Học vấn & Bằng cấp ({formData.educations.length})
                    </Typography>
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<Add />}
                      onClick={() =>
                        handleAddItem("educations", {
                          school: "",
                          fieldOfStudy: "",
                          degree: "",
                          time: "",
                        })
                      }
                      sx={{ textTransform: "none", borderRadius: 2 }}
                    >
                      Thêm học vấn
                    </Button>
                  </Stack>

                  {formData.educations.length === 0 ? (
                    <Typography variant="body2" color="textSecondary" sx={{ py: 2, textAlign: "center" }}>
                      Chưa có mục học vấn nào. Bấm "Thêm học vấn" để bắt đầu.
                    </Typography>
                  ) : (
                    formData.educations.map((item, index) => (
                      <Card
                        key={index}
                        variant="outlined"
                        sx={{
                          mb: 2,
                          p: 2.5,
                          borderRadius: 3,
                          bgcolor: isDark ? "rgba(255,255,255,0.02)" : "#fafafa",
                        }}
                      >
                        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1.5}>
                          <Chip
                            label={`Học vấn #${index + 1}`}
                            size="small"
                            color="info"
                            variant="outlined"
                          />
                          <IconButton size="small" color="error" onClick={() => handleRemoveItem("educations", index)}>
                            <Delete fontSize="small" />
                          </IconButton>
                        </Stack>
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              size="small"
                              label="Trường / Cơ sở đào tạo"
                              value={item.school || ""}
                              onChange={(e) => handleListChange("educations", index, "school", e.target.value)}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              size="small"
                              label="Ngành học"
                              value={item.fieldOfStudy || ""}
                              onChange={(e) => handleListChange("educations", index, "fieldOfStudy", e.target.value)}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              size="small"
                              label="Bằng cấp / Trình độ"
                              placeholder="Cử nhân, Kỹ sư, Thạc sĩ..."
                              value={item.degree || ""}
                              onChange={(e) => handleListChange("educations", index, "degree", e.target.value)}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              size="small"
                              label="Thời gian học"
                              placeholder="2018 - 2022"
                              value={item.time || ""}
                              onChange={(e) => handleListChange("educations", index, "time", e.target.value)}
                            />
                          </Grid>
                        </Grid>
                      </Card>
                    ))
                  )}
                </Box>
              </Box>
            )}

            {/* Tab 2: Skills & Certificates */}
            {activeTab === 2 && (
              <Box>
                {/* Skills */}
                <Box mb={4}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="subtitle1" fontWeight={700} color={isDark ? "#f8fafc" : "#0f172a"}>
                      Kỹ năng chuyên môn ({formData.skills.length})
                    </Typography>
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<Add />}
                      onClick={() => handleAddItem("skills", { name: "" })}
                      sx={{ textTransform: "none", borderRadius: 2 }}
                    >
                      Thêm kỹ năng
                    </Button>
                  </Stack>

                  <Grid container spacing={2}>
                    {formData.skills.map((item, index) => (
                      <Grid item xs={12} sm={6} md={4} key={index}>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <TextField
                            fullWidth
                            size="small"
                            label={`Kỹ năng #${index + 1}`}
                            value={item.name || ""}
                            onChange={(e) => handleListChange("skills", index, "name", e.target.value)}
                          />
                          <IconButton size="small" color="error" onClick={() => handleRemoveItem("skills", index)}>
                            <Delete fontSize="small" />
                          </IconButton>
                        </Stack>
                      </Grid>
                    ))}
                  </Grid>
                </Box>

                <Divider sx={{ my: 3 }} />

                {/* Certificates */}
                <Box>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="subtitle1" fontWeight={700} color={isDark ? "#f8fafc" : "#0f172a"}>
                      Chứng chỉ & Giải thưởng ({formData.certificates.length})
                    </Typography>
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<Add />}
                      onClick={() =>
                        handleAddItem("certificates", {
                          name: "",
                          issuer: "",
                          issueDate: "",
                        })
                      }
                      sx={{ textTransform: "none", borderRadius: 2 }}
                    >
                      Thêm chứng chỉ
                    </Button>
                  </Stack>

                  {formData.certificates.length === 0 ? (
                    <Typography variant="body2" color="textSecondary" sx={{ py: 2, textAlign: "center" }}>
                      Chưa có chứng chỉ nào. Bấm "Thêm chứng chỉ" để bổ sung.
                    </Typography>
                  ) : (
                    formData.certificates.map((item, index) => (
                      <Card
                        key={index}
                        variant="outlined"
                        sx={{
                          mb: 2,
                          p: 2.5,
                          borderRadius: 3,
                          bgcolor: isDark ? "rgba(255,255,255,0.02)" : "#fafafa",
                        }}
                      >
                        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1.5}>
                          <Chip
                            label={`Chứng chỉ #${index + 1}`}
                            size="small"
                            color="secondary"
                            variant="outlined"
                          />
                          <IconButton size="small" color="error" onClick={() => handleRemoveItem("certificates", index)}>
                            <Delete fontSize="small" />
                          </IconButton>
                        </Stack>
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={5}>
                            <TextField
                              fullWidth
                              size="small"
                              label="Tên chứng chỉ"
                              value={item.name || ""}
                              onChange={(e) => handleListChange("certificates", index, "name", e.target.value)}
                            />
                          </Grid>
                          <Grid item xs={12} sm={4}>
                            <TextField
                              fullWidth
                              size="small"
                              label="Tổ chức cấp"
                              value={item.issuer || ""}
                              onChange={(e) => handleListChange("certificates", index, "issuer", e.target.value)}
                            />
                          </Grid>
                          <Grid item xs={12} sm={3}>
                            <TextField
                              fullWidth
                              size="small"
                              label="Ngày cấp"
                              placeholder="Tháng 06/2023"
                              value={item.issueDate || ""}
                              onChange={(e) => handleListChange("certificates", index, "issueDate", e.target.value)}
                            />
                          </Grid>
                        </Grid>
                      </Card>
                    ))
                  )}
                </Box>
              </Box>
            )}

            {/* Tab 3: Hobbies */}
            {activeTab === 3 && (
              <Box>
                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="subtitle1" fontWeight={700} color={isDark ? "#f8fafc" : "#0f172a"}>
                    Sở thích cá nhân ({formData.hobbies.length})
                  </Typography>
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<Add />}
                    onClick={() => handleAddItem("hobbies", { name: "" })}
                    sx={{ textTransform: "none", borderRadius: 2 }}
                  >
                    Thêm sở thích
                  </Button>
                </Stack>

                <Grid container spacing={2}>
                  {formData.hobbies.map((item, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <TextField
                          fullWidth
                          size="small"
                          label={`Sở thích #${index + 1}`}
                          value={item.name || ""}
                          onChange={(e) => handleListChange("hobbies", index, "name", e.target.value)}
                        />
                        <IconButton size="small" color="error" onClick={() => handleRemoveItem("hobbies", index)}>
                          <Delete fontSize="small" />
                        </IconButton>
                      </Stack>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}
          </Box>
        </Paper>
      </Box>

      {/* Snackbar feedback */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          variant="filled"
          icon={<CheckCircle fontSize="inherit" />}
          sx={{ borderRadius: 2.5 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Information;
