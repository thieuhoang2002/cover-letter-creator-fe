import React, { useState, useEffect } from "react";
import {
    Box, Typography, Button, Dialog, DialogActions, DialogContent, DialogTitle,
    TextField, Snackbar, Alert, CircularProgress, Select, MenuItem,
    Avatar, Chip, IconButton, Tooltip, InputAdornment, Grid, Card, CardContent,
    FormControl, InputLabel, useTheme, Divider
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Search as SearchIcon,
    Refresh as RefreshIcon,
    AdminPanelSettings as AdminIcon,
    Person as PersonIcon,
    Visibility as VisibilityIcon,
    VisibilityOff as VisibilityOffIcon,
    Close as CloseIcon,
    Phone as PhoneIcon,
    Email as EmailIcon
} from "@mui/icons-material";
import { getAllUsers, createUser, updateUser, deleteUser } from "../../apis/profile";

function UserManager() {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");

    // Modal Add/Edit
    const [openDialog, setOpenDialog] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // Delete confirmation
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);

    // Form state
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "user",
        avatarUrl: "",
        birthday: "",
        address: "",
        phone: "",
        specialization: ""
    });

    // Alert feedback
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

    const showSnackbar = (message, severity = "success") => {
        setSnackbar({ open: true, message, severity });
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const data = await getAllUsers();
            setUsers(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Lỗi khi tải danh sách người dùng:", error);
            showSnackbar("Không thể tải danh sách người dùng", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleOpenDialog = (user = null) => {
        setShowPassword(false);
        if (user) {
            setIsEdit(true);
            setSelectedUser(user);
            setFormData({
                name: user.name || "",
                email: user.email || "",
                password: "", // Bỏ trống khi edit để tránh mã hóa lại mật khẩu cũ
                role: (user.role || "user").toLowerCase(),
                avatarUrl: user.avatarUrl || "",
                birthday: user.birthday || "",
                address: user.address || "",
                phone: user.phone || "",
                specialization: user.specialization || ""
            });
        } else {
            setIsEdit(false);
            setSelectedUser(null);
            setFormData({
                name: "",
                email: "",
                password: "",
                role: "user",
                avatarUrl: "",
                birthday: "",
                address: "",
                phone: "",
                specialization: ""
            });
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedUser(null);
    };

    const handleSaveUser = async () => {
        if (!formData.name.trim() || !formData.email.trim()) {
            showSnackbar("Họ tên và email không được để trống!", "warning");
            return;
        }

        if (!isEdit && !formData.password) {
            showSnackbar("Vui lòng nhập mật khẩu cho người dùng mới!", "warning");
            return;
        }

        try {
            setSubmitting(true);
            // Payload chuẩn bị
            const payload = { ...formData };
            // Nếu edit mà password trống thì không gửi password
            if (isEdit && !payload.password) {
                delete payload.password;
            }

            if (isEdit && selectedUser) {
                await updateUser(selectedUser.id, payload);
                showSnackbar("Cập nhật thông tin người dùng thành công!");
            } else {
                await createUser(payload);
                showSnackbar("Tạo người dùng mới thành công!");
            }

            fetchUsers();
            handleCloseDialog();
        } catch (error) {
            console.error("Lỗi khi lưu người dùng:", error);
            const msg = error.response?.data?.message || "Có lỗi xảy ra khi lưu người dùng!";
            showSnackbar(msg, "error");
        } finally {
            setSubmitting(false);
        }
    };

    const handleConfirmDelete = (user) => {
        setUserToDelete(user);
        setDeleteModalOpen(true);
    };

    const handleDeleteUser = async () => {
        if (!userToDelete) return;
        try {
            await deleteUser(userToDelete.id);
            showSnackbar(`Đã xóa người dùng "${userToDelete.name}" thành công!`);
            setDeleteModalOpen(false);
            setUserToDelete(null);
            fetchUsers();
        } catch (error) {
            console.error("Lỗi khi xóa người dùng:", error);
            showSnackbar("Lỗi khi xóa người dùng!", "error");
        }
    };

    // Filter users
    const filteredUsers = users.filter((u) => {
        const matchesSearch =
            (u.name && u.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (u.email && u.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (u.phone && u.phone.includes(searchTerm)) ||
            (u.specialization && u.specialization.toLowerCase().includes(searchTerm.toLowerCase()));

        const roleStr = (u.role || "").toLowerCase();
        const matchesRole =
            roleFilter === "all" ||
            (roleFilter === "admin" && roleStr === "admin") ||
            (roleFilter === "user" && roleStr !== "admin");

        return matchesSearch && matchesRole;
    });

    const columns = [
        {
            field: "id",
            headerName: "ID",
            width: 70,
            headerAlign: "center",
            align: "center"
        },
        {
            field: "user",
            headerName: "Người dùng",
            flex: 1.5,
            minWidth: 240,
            renderCell: (params) => (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, py: 1 }}>
                    <Avatar
                        src={params.row.avatarUrl}
                        alt={params.row.name}
                        sx={{
                            width: 40,
                            height: 40,
                            bgcolor: isDark ? "primary.dark" : "primary.light",
                            fontWeight: "bold",
                            border: `2px solid ${isDark ? "#334155" : "#e2e8f0"}`
                        }}
                    >
                        {params.row.name ? params.row.name.charAt(0).toUpperCase() : "U"}
                    </Avatar>
                    <Box sx={{ overflow: "hidden" }}>
                        <Typography variant="body2" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
                            {params.row.name || "Chưa có tên"}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
                            {params.row.specialization || "Thành viên"}
                        </Typography>
                    </Box>
                </Box>
            )
        },
        {
            field: "email",
            headerName: "Email",
            flex: 1.3,
            minWidth: 200,
            renderCell: (params) => (
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
                    <EmailIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                    <Typography variant="body2" sx={{ color: "text.primary" }}>
                        {params.value}
                    </Typography>
                </Box>
            )
        },
        {
            field: "role",
            headerName: "Vai trò",
            width: 140,
            headerAlign: "center",
            align: "center",
            renderCell: (params) => {
                const isAdmin = (params.value || "").toLowerCase() === "admin";
                return (
                    <Chip
                        icon={isAdmin ? <AdminIcon sx={{ fontSize: "16px !important" }} /> : <PersonIcon sx={{ fontSize: "16px !important" }} />}
                        label={isAdmin ? "Quản trị viên" : "Người dùng"}
                        size="small"
                        sx={{
                            fontWeight: 600,
                            fontSize: "0.75rem",
                            px: 0.5,
                            bgcolor: isAdmin
                                ? (isDark ? "rgba(168, 85, 247, 0.2)" : "rgba(124, 58, 237, 0.1)")
                                : (isDark ? "rgba(59, 130, 246, 0.2)" : "rgba(37, 99, 235, 0.1)"),
                            color: isAdmin
                                ? (isDark ? "#c084fc" : "#7c3aed")
                                : (isDark ? "#60a5fa" : "#2563eb"),
                            border: `1px solid ${isAdmin
                                ? (isDark ? "rgba(168, 85, 247, 0.3)" : "rgba(124, 58, 237, 0.2)")
                                : (isDark ? "rgba(59, 130, 246, 0.3)" : "rgba(37, 99, 235, 0.2)")}`
                        }}
                    />
                );
            }
        },
        {
            field: "phone",
            headerName: "Số điện thoại",
            width: 140,
            renderCell: (params) => (
                <Typography variant="body2" color={params.value ? "text.primary" : "text.secondary"}>
                    {params.value || "—"}
                </Typography>
            )
        },
        {
            field: "address",
            headerName: "Địa chỉ",
            flex: 1,
            minWidth: 160,
            renderCell: (params) => (
                <Typography variant="body2" color={params.value ? "text.primary" : "text.secondary"} noWrap>
                    {params.value || "—"}
                </Typography>
            )
        },
        {
            field: "actions",
            headerName: "Hành động",
            width: 120,
            headerAlign: "center",
            align: "center",
            sortable: false,
            renderCell: (params) => (
                <Box sx={{ display: "flex", gap: 0.5 }}>
                    <Tooltip title="Chỉnh sửa">
                        <IconButton
                            size="small"
                            onClick={() => handleOpenDialog(params.row)}
                            sx={{
                                color: "primary.main",
                                "&:hover": { bgcolor: isDark ? "rgba(59, 130, 246, 0.15)" : "rgba(37, 99, 235, 0.1)" }
                            }}
                        >
                            <EditIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Xóa tài khoản">
                        <IconButton
                            size="small"
                            onClick={() => handleConfirmDelete(params.row)}
                            sx={{
                                color: "error.main",
                                "&:hover": { bgcolor: isDark ? "rgba(239, 68, 68, 0.15)" : "rgba(220, 38, 38, 0.1)" }
                            }}
                        >
                            <DeleteIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                </Box>
            )
        }
    ];

    return (
        <Box sx={{ p: { xs: 2, md: 3 }, width: "100%", maxWidth: 1400, mx: "auto" }}>
            {/* Header Section */}
            <Box
                sx={{
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    justifyContent: "space-between",
                    alignItems: { xs: "flex-start", sm: "center" },
                    mb: 3,
                    gap: 2
                }}
            >
                <Box>
                    <Typography variant="h5" sx={{ fontWeight: 700, letterSpacing: "-0.5px" }}>
                        Quản lý Người Dùng
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        Quản lý tài khoản, thông tin cá nhân và phân quyền hệ thống
                    </Typography>
                </Box>

                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpenDialog()}
                    sx={{
                        background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
                        boxShadow: "0 4px 14px rgba(37, 99, 235, 0.3)",
                        borderRadius: 2,
                        px: 2.5,
                        py: 1,
                        textTransform: "none",
                        fontWeight: 600,
                        "&:hover": {
                            background: "linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)",
                            boxShadow: "0 6px 20px rgba(37, 99, 235, 0.4)"
                        }
                    }}
                >
                    Thêm Người Dùng
                </Button>
            </Box>

            {/* Toolbar & Filters */}
            <Card
                elevation={0}
                sx={{
                    mb: 2.5,
                    p: 2,
                    borderRadius: 3,
                    border: `1px solid ${isDark ? "#334155" : "#e2e8f0"}`,
                    bgcolor: isDark ? "#1e293b" : "#ffffff"
                }}
            >
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={6} md={5}>
                        <TextField
                            fullWidth
                            size="small"
                            placeholder="Tìm kiếm theo tên, email, SĐT, chuyên ngành..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon sx={{ color: "text.secondary", fontSize: 20 }} />
                                    </InputAdornment>
                                ),
                                sx: { borderRadius: 2 }
                            }}
                        />
                    </Grid>

                    <Grid item xs={12} sm={4} md={3}>
                        <FormControl fullWidth size="small">
                            <InputLabel>Vai trò</InputLabel>
                            <Select
                                value={roleFilter}
                                label="Vai trò"
                                onChange={(e) => setRoleFilter(e.target.value)}
                                sx={{ borderRadius: 2 }}
                            >
                                <MenuItem value="all">Tất cả vai trò</MenuItem>
                                <MenuItem value="admin">Quản trị viên (Admin)</MenuItem>
                                <MenuItem value="user">Người dùng (User)</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={2} md={4} sx={{ display: "flex", justifyContent: { xs: "flex-start", sm: "flex-end" }, gap: 1 }}>
                        <Button
                            variant="outlined"
                            size="small"
                            startIcon={<RefreshIcon />}
                            onClick={fetchUsers}
                            sx={{ borderRadius: 2, textTransform: "none" }}
                        >
                            Làm mới
                        </Button>
                    </Grid>
                </Grid>
            </Card>

            {/* DataGrid Table */}
            <Card
                elevation={0}
                sx={{
                    borderRadius: 3,
                    border: `1px solid ${isDark ? "#334155" : "#e2e8f0"}`,
                    bgcolor: isDark ? "#1e293b" : "#ffffff",
                    overflow: "hidden"
                }}
            >
                <Box sx={{ height: 600, width: "100%" }}>
                    <DataGrid
                        rows={filteredUsers}
                        columns={columns}
                        pageSizeOptions={[10, 25, 50]}
                        initialState={{
                            pagination: { paginationModel: { pageSize: 10, page: 0 } },
                        }}
                        loading={loading}
                        disableRowSelectionOnClick
                        sx={{
                            border: "none",
                            "& .MuiDataGrid-columnHeaders": {
                                bgcolor: isDark ? "#0f172a" : "#f8fafc",
                                borderBottom: `1px solid ${isDark ? "#334155" : "#e2e8f0"}`,
                                fontWeight: 600,
                            },
                            "& .MuiDataGrid-row": {
                                borderBottom: `1px solid ${isDark ? "#334155" : "#f1f5f9"}`,
                                "&:hover": {
                                    bgcolor: isDark ? "rgba(51, 65, 85, 0.4)" : "rgba(248, 250, 252, 0.8)",
                                }
                            },
                            "& .MuiDataGrid-cell": {
                                display: "flex",
                                alignItems: "center"
                            },
                            "& .MuiDataGrid-footerContainer": {
                                borderTop: `1px solid ${isDark ? "#334155" : "#e2e8f0"}`,
                                bgcolor: isDark ? "#0f172a" : "#f8fafc"
                            }
                        }}
                    />
                </Box>
            </Card>

            {/* Dialog Thêm / Chỉnh sửa User */}
            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                maxWidth="md"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: 3,
                        bgcolor: isDark ? "#1e293b" : "#ffffff",
                        backgroundImage: "none",
                        p: 1
                    }
                }}
            >
                <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", pb: 1 }}>
                    <Box>
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                            {isEdit ? "Chỉnh sửa Người Dùng" : "Thêm Người Dùng Mới"}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {isEdit ? `ID: #${selectedUser?.id} • Cập nhật hồ sơ và vai trò` : "Nhập đầy đủ thông tin để cấp tài khoản mới"}
                        </Typography>
                    </Box>
                    <IconButton onClick={handleCloseDialog} size="small">
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <Divider />

                <DialogContent sx={{ pt: 3 }}>
                    <Grid container spacing={2.5}>
                        {/* Avatar preview & Link */}
                        <Grid item xs={12} sx={{ display: "flex", alignItems: "center", gap: 2.5, mb: 1 }}>
                            <Avatar
                                src={formData.avatarUrl}
                                alt={formData.name}
                                sx={{
                                    width: 72,
                                    height: 72,
                                    bgcolor: "primary.main",
                                    fontSize: 28,
                                    boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
                                }}
                            >
                                {formData.name ? formData.name.charAt(0).toUpperCase() : "U"}
                            </Avatar>
                            <Box sx={{ flex: 1 }}>
                                <TextField
                                    fullWidth
                                    size="small"
                                    label="URL Ảnh Đại Diện"
                                    value={formData.avatarUrl}
                                    placeholder="https://example.com/avatar.jpg"
                                    onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
                                />
                                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: "block" }}>
                                    Dán đường dẫn ảnh đại diện trực tiếp để hiển thị xem trước
                                </Typography>
                            </Box>
                        </Grid>

                        {/* Thông tin đăng nhập */}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Họ và Tên *"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Email Đăng Nhập *"
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label={isEdit ? "Mật khẩu mới (Bỏ trống nếu không đổi)" : "Mật khẩu *"}
                                type={showPassword ? "text" : "password"}
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" size="small">
                                                {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }}
                                helperText={isEdit ? "Chỉ nhập khi bạn muốn thiết lập lại mật khẩu cho tài khoản này" : ""}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel>Vai trò hệ thống</InputLabel>
                                <Select
                                    value={formData.role}
                                    label="Vai trò hệ thống"
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                >
                                    <MenuItem value="user">Người dùng (User)</MenuItem>
                                    <MenuItem value="admin">Quản trị viên (Admin)</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        {/* Thông tin hồ sơ */}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Chuyên ngành / Vị trí ứng tuyển"
                                value={formData.specialization}
                                placeholder="VD: Fullstack Developer, Kế toán..."
                                onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Số điện thoại"
                                value={formData.phone}
                                placeholder="VD: 0912345678"
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Ngày sinh"
                                type="date"
                                value={formData.birthday}
                                InputLabelProps={{ shrink: true }}
                                onChange={(e) => setFormData({ ...formData, birthday: e.target.value })}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Địa chỉ"
                                value={formData.address}
                                placeholder="VD: Hà Nội, Việt Nam"
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>

                <DialogActions sx={{ px: 3, pb: 2.5, pt: 1.5 }}>
                    <Button onClick={handleCloseDialog} color="inherit" sx={{ textTransform: "none", fontWeight: 600 }}>
                        Hủy
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleSaveUser}
                        disabled={submitting}
                        sx={{
                            background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
                            textTransform: "none",
                            fontWeight: 600,
                            px: 3,
                            borderRadius: 2
                        }}
                    >
                        {submitting ? <CircularProgress size={22} color="inherit" /> : (isEdit ? "Cập nhật" : "Tạo mới")}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Modal Xác nhận Xóa */}
            <Dialog
                open={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                maxWidth="xs"
                fullWidth
                PaperProps={{
                    sx: { borderRadius: 3, bgcolor: isDark ? "#1e293b" : "#ffffff", p: 1 }
                }}
            >
                <DialogTitle sx={{ fontWeight: 700, color: "error.main" }}>
                    Xác nhận xóa tài khoản?
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body2">
                        Bạn có chắc chắn muốn xóa người dùng <strong>{userToDelete?.name}</strong> ({userToDelete?.email})?
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 1 }}>
                        Hành động này không thể hoàn tác và sẽ xóa vĩnh viễn dữ liệu hồ sơ liên quan.
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={() => setDeleteModalOpen(false)} color="inherit" sx={{ textTransform: "none" }}>
                        Hủy
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={handleDeleteUser}
                        sx={{ textTransform: "none", fontWeight: 600, borderRadius: 2 }}
                    >
                        Xóa vĩnh viễn
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={3500}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            >
                <Alert
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                    severity={snackbar.severity}
                    variant="filled"
                    sx={{ width: "100%", borderRadius: 2, fontWeight: 500 }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}

export default UserManager;