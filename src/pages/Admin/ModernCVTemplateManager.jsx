import React, { useState, useEffect } from "react";
import {
    Box, Typography, Button, Dialog, DialogActions, DialogContent, DialogTitle,
    TextField, Snackbar, Alert, CircularProgress, Select, MenuItem, InputLabel,
    FormControl, useTheme, Card, Grid, InputAdornment, Chip, IconButton, Tooltip,
    Divider, Tabs, Tab
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Editor } from "@tinymce/tinymce-react";
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Search as SearchIcon,
    Refresh as RefreshIcon,
    Visibility as VisibilityIcon,
    Close as CloseIcon,
    Image as ImageIcon,
    Article as ArticleIcon,
    CheckCircle as CheckCircleIcon,
    Cancel as CancelIcon
} from "@mui/icons-material";
import {
    getAllModernTemplates,
    createModernTemplate,
    deleteModernTemplate,
    updateModernTemplate
} from "../../apis/templateModernCV";

function ModernCVTemplateManager() {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";
    const apiKey = import.meta.env.VITE_API_KEY_TINY;

    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    // Dialog state
    const [openDialog, setOpenDialog] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [activeTab, setActiveTab] = useState(0);

    // Form data
    const [formData, setFormData] = useState({
        name: "",
        type: "",
        content: "",
        image: "",
        status: "active"
    });

    // Delete modal state
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);

    // Snackbar state
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

    const showSnackbar = (message, severity = "success") => {
        setSnackbar({ open: true, message, severity });
    };

    useEffect(() => {
        fetchTemplates();
    }, []);

    const fetchTemplates = async () => {
        try {
            setLoading(true);
            const data = await getAllModernTemplates();
            setTemplates(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Lỗi khi tải danh sách mẫu CV hiện đại:", error);
            showSnackbar("Không thể tải danh sách mẫu CV!", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleOpenDialog = (template = null) => {
        setActiveTab(0);
        if (template) {
            setIsEdit(true);
            setSelectedTemplate(template);
            setFormData({
                name: template.name || "",
                type: template.type || "",
                content: template.content || "",
                image: template.image || "",
                status: template.status || "active"
            });
        } else {
            setIsEdit(false);
            setSelectedTemplate(null);
            setFormData({
                name: "",
                type: "",
                content: "<p>Nội dung mẫu CV hiện đại bắt đầu từ đây...</p>",
                image: "",
                status: "active"
            });
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedTemplate(null);
    };

    const handleSaveTemplate = async () => {
        if (!formData.name.trim()) {
            showSnackbar("Vui lòng nhập tên mẫu CV!", "warning");
            return;
        }

        try {
            setSubmitting(true);
            if (isEdit && selectedTemplate) {
                await updateModernTemplate(selectedTemplate.id, formData);
                showSnackbar("Cập nhật mẫu CV hiện đại thành công!");
            } else {
                await createModernTemplate(formData);
                showSnackbar("Tạo mẫu CV mới thành công!");
            }
            fetchTemplates();
            handleCloseDialog();
        } catch (error) {
            console.error("Lỗi khi lưu mẫu CV hiện đại:", error);
            showSnackbar("Có lỗi xảy ra khi lưu mẫu CV!", "error");
        } finally {
            setSubmitting(false);
        }
    };

    const handleConfirmDelete = (template) => {
        setItemToDelete(template);
        setDeleteModalOpen(true);
    };

    const handleDeleteTemplate = async () => {
        if (!itemToDelete) return;
        try {
            await deleteModernTemplate(itemToDelete.id);
            showSnackbar(`Đã xóa mẫu CV "${itemToDelete.name}" thành công!`);
            setDeleteModalOpen(false);
            setItemToDelete(null);
            fetchTemplates();
        } catch (error) {
            console.error("Lỗi khi xóa mẫu CV hiện đại:", error);
            showSnackbar("Không thể xóa mẫu CV này!", "error");
        }
    };

    // Filter logic
    const filteredTemplates = templates.filter((t) => {
        const matchesSearch =
            (t.name && t.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (t.type && t.type.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesStatus =
            statusFilter === "all" ||
            (t.status && t.status.toLowerCase() === statusFilter.toLowerCase());

        return matchesSearch && matchesStatus;
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
            field: "template",
            headerName: "Mẫu CV",
            flex: 1.8,
            minWidth: 260,
            renderCell: (params) => (
                <Box sx={{ display: "flex", alignItems: "center", gap: 2, py: 1 }}>
                    <Box
                        sx={{
                            width: 48,
                            height: 60,
                            borderRadius: 1.5,
                            overflow: "hidden",
                            bgcolor: isDark ? "#334155" : "#f1f5f9",
                            border: `1px solid ${isDark ? "#475569" : "#e2e8f0"}`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0
                        }}
                    >
                        {params.row.image ? (
                            <Box
                                component="img"
                                src={params.row.image}
                                alt={params.row.name}
                                sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                                onError={(e) => { e.target.style.display = 'none'; }}
                            />
                        ) : (
                            <ArticleIcon sx={{ color: "text.secondary", fontSize: 24 }} />
                        )}
                    </Box>
                    <Box sx={{ overflow: "hidden" }}>
                        <Typography variant="body2" sx={{ fontWeight: 600, lineHeight: 1.3 }} noWrap>
                            {params.row.name || "Chưa có tên"}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 0.5 }}>
                            Phong cách: <strong>{params.row.type || "Hiện đại"}</strong>
                        </Typography>
                    </Box>
                </Box>
            )
        },
        {
            field: "type",
            headerName: "Phong cách / Ngành",
            width: 160,
            renderCell: (params) => (
                <Chip
                    label={params.value || "Tiêu chuẩn"}
                    size="small"
                    variant="outlined"
                    sx={{
                        borderRadius: 1.5,
                        fontWeight: 500,
                        borderColor: isDark ? "#475569" : "#cbd5e1"
                    }}
                />
            )
        },
        {
            field: "views",
            headerName: "Lượt xem",
            width: 130,
            headerAlign: "center",
            align: "center",
            renderCell: (params) => (
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.8, color: "text.secondary" }}>
                    <VisibilityIcon sx={{ fontSize: 16 }} />
                    <Typography variant="body2" sx={{ fontWeight: 600, color: "text.primary" }}>
                        {params.value || 0}
                    </Typography>
                </Box>
            )
        },
        {
            field: "status",
            headerName: "Trạng thái",
            width: 140,
            headerAlign: "center",
            align: "center",
            renderCell: (params) => {
                const isActive = (params.value || "").toLowerCase() === "active";
                return (
                    <Chip
                        icon={isActive ? <CheckCircleIcon sx={{ fontSize: "15px !important" }} /> : <CancelIcon sx={{ fontSize: "15px !important" }} />}
                        label={isActive ? "Hoạt động" : "Tạm ẩn"}
                        size="small"
                        sx={{
                            fontWeight: 600,
                            fontSize: "0.75rem",
                            bgcolor: isActive
                                ? (isDark ? "rgba(16, 185, 129, 0.2)" : "rgba(16, 185, 129, 0.1)")
                                : (isDark ? "rgba(239, 68, 68, 0.2)" : "rgba(239, 68, 68, 0.1)"),
                            color: isActive
                                ? (isDark ? "#34d399" : "#059669")
                                : (isDark ? "#f87171" : "#dc2626"),
                            border: `1px solid ${isActive
                                ? (isDark ? "rgba(16, 185, 129, 0.3)" : "rgba(16, 185, 129, 0.2)")
                                : (isDark ? "rgba(239, 68, 68, 0.3)" : "rgba(239, 68, 68, 0.2)")}`
                        }}
                    />
                );
            }
        },
        {
            field: "actions",
            headerName: "Hành động",
            width: 130,
            headerAlign: "center",
            align: "center",
            sortable: false,
            renderCell: (params) => (
                <Box sx={{ display: "flex", gap: 0.5 }}>
                    <Tooltip title="Chỉnh sửa mẫu CV">
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
                    <Tooltip title="Xóa mẫu CV">
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
                        Quản lý Mẫu CV Hiện Đại
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        Tạo và cập nhật các mẫu CV đa phong cách chuẩn quốc tế cho người tìm việc
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
                    Thêm Mẫu CV
                </Button>
            </Box>

            {/* Filter & Toolbar */}
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
                            placeholder="Tìm kiếm mẫu CV theo tên, phong cách..."
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
                            <InputLabel>Trạng thái</InputLabel>
                            <Select
                                value={statusFilter}
                                label="Trạng thái"
                                onChange={(e) => setStatusFilter(e.target.value)}
                                sx={{ borderRadius: 2 }}
                            >
                                <MenuItem value="all">Tất cả trạng thái</MenuItem>
                                <MenuItem value="active">Đang hoạt động (Active)</MenuItem>
                                <MenuItem value="inactive">Tạm ẩn (Inactive)</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={2} md={4} sx={{ display: "flex", justifyContent: { xs: "flex-start", sm: "flex-end" }, gap: 1 }}>
                        <Button
                            variant="outlined"
                            size="small"
                            startIcon={<RefreshIcon />}
                            onClick={fetchTemplates}
                            sx={{ borderRadius: 2, textTransform: "none" }}
                        >
                            Làm mới
                        </Button>
                    </Grid>
                </Grid>
            </Card>

            {/* Table */}
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
                        rows={filteredTemplates}
                        columns={columns}
                        pageSizeOptions={[10, 25, 50]}
                        initialState={{
                            pagination: { paginationModel: { pageSize: 10, page: 0 } },
                        }}
                        loading={loading}
                        rowHeight={70}
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

            {/* Dialog Add / Edit Template */}
            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                maxWidth="lg"
                fullWidth
                disableEnforceFocus
                PaperProps={{
                    sx: {
                        borderRadius: 3,
                        bgcolor: isDark ? "#1e293b" : "#ffffff",
                        backgroundImage: "none",
                        minHeight: "80vh"
                    }
                }}
            >
                <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", pb: 1, px: 3 }}>
                    <Box>
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                            {isEdit ? "Chỉnh sửa Mẫu CV" : "Tạo Mẫu CV Mới"}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {isEdit ? `ID: #${selectedTemplate?.id} • Chỉnh sửa cấu hình và nội dung mẫu CV` : "Thiết lập cấu hình và nội dung bố cục CV hiện đại"}
                        </Typography>
                    </Box>
                    <IconButton onClick={handleCloseDialog} size="small">
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>

                <Tabs
                    value={activeTab}
                    onChange={(e, val) => setActiveTab(val)}
                    sx={{ px: 3, borderBottom: `1px solid ${isDark ? "#334155" : "#e2e8f0"}` }}
                >
                    <Tab label="1. Thông tin cấu hình" sx={{ textTransform: "none", fontWeight: 600 }} />
                    <Tab label="2. Soạn thảo nội dung (Editor)" sx={{ textTransform: "none", fontWeight: 600 }} />
                </Tabs>

                <DialogContent sx={{ p: 3 }}>
                    {activeTab === 0 && (
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={7}>
                                <TextField
                                    fullWidth
                                    label="Tên Mẫu CV *"
                                    value={formData.name}
                                    placeholder="VD: Mẫu CV Hiện Đại - Tech & Startups"
                                    margin="normal"
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                                <TextField
                                    fullWidth
                                    label="Phong cách / Nhóm ngành"
                                    value={formData.type}
                                    placeholder="VD: Hiện đại, Sáng tạo, Tối giản, Kỹ thuật..."
                                    margin="normal"
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                />
                                <FormControl fullWidth margin="normal">
                                    <InputLabel>Trạng thái hiển thị</InputLabel>
                                    <Select
                                        value={formData.status}
                                        label="Trạng thái hiển thị"
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                    >
                                        <MenuItem value="active">Hoạt động (Hiển thị cho người dùng)</MenuItem>
                                        <MenuItem value="inactive">Tạm ẩn (Không hiển thị ra trang chủ)</MenuItem>
                                    </Select>
                                </FormControl>
                                <TextField
                                    fullWidth
                                    label="URL Hình ảnh xem trước (Thumbnail)"
                                    value={formData.image}
                                    placeholder="https://example.com/cv-thumbnail.jpg"
                                    margin="normal"
                                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                    helperText="Dán liên kết ảnh đại diện mẫu CV để hiển thị trong kho mẫu"
                                />
                            </Grid>

                            <Grid item xs={12} md={5}>
                                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                                    Xem trước Thumbnail
                                </Typography>
                                <Box
                                    sx={{
                                        width: "100%",
                                        height: 280,
                                        borderRadius: 2.5,
                                        border: `2px dashed ${isDark ? "#475569" : "#cbd5e1"}`,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        overflow: "hidden",
                                        bgcolor: isDark ? "#0f172a" : "#f8fafc"
                                    }}
                                >
                                    {formData.image ? (
                                        <Box
                                            component="img"
                                            src={formData.image}
                                            alt="Preview"
                                            sx={{ width: "100%", height: "100%", objectFit: "contain" }}
                                            onError={(e) => { e.target.style.display = 'none'; }}
                                        />
                                    ) : (
                                        <Box sx={{ textAlign: "center", p: 2 }}>
                                            <ImageIcon sx={{ fontSize: 48, color: "text.secondary", mb: 1 }} />
                                            <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
                                                Chưa có ảnh xem trước
                                            </Typography>
                                        </Box>
                                    )}
                                </Box>
                            </Grid>
                        </Grid>
                    )}

                    {activeTab === 1 && (
                        <Box sx={{ mt: 1 }}>
                            <Editor
                                apiKey={apiKey}
                                value={formData.content}
                                init={{
                                    height: 520,
                                    menubar: 'file edit view insert format tools table help',
                                    plugins: 'preview importcss searchreplace autolink autosave save directionality code visualblocks visualchars fullscreen image link media codesample table charmap pagebreak nonbreaking anchor insertdatetime advlist lists wordcount help charmap quickbars emoticons accordion',
                                    toolbar: "undo redo | accordion accordionremove | blocks fontfamily fontsize | bold italic underline strikethrough | align numlist bullist | link image | table media | lineheight outdent indent| forecolor backcolor removeformat | charmap emoticons | code fullscreen preview | save print | pagebreak anchor codesample | ltr rtl",
                                    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:16px; line-height: 1.6; padding: 15px; }',
                                    skin: isDark ? "oxide-dark" : "oxide",
                                    content_css: isDark ? "dark" : "default"
                                }}
                                onEditorChange={(content) => setFormData({ ...formData, content })}
                            />
                        </Box>
                    )}
                </DialogContent>

                <Divider />
                <DialogActions sx={{ px: 3, py: 2 }}>
                    <Button onClick={handleCloseDialog} color="inherit" sx={{ textTransform: "none", fontWeight: 600 }}>
                        Hủy
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleSaveTemplate}
                        disabled={submitting}
                        sx={{
                            background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
                            textTransform: "none",
                            fontWeight: 600,
                            px: 3,
                            borderRadius: 2
                        }}
                    >
                        {submitting ? <CircularProgress size={22} color="inherit" /> : (isEdit ? "Cập nhật mẫu" : "Tạo mẫu mới")}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Modal Confirm Delete */}
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
                    Xác nhận xóa mẫu CV?
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body2">
                        Bạn có chắc chắn muốn xóa mẫu CV <strong>"{itemToDelete?.name}"</strong>?
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 1 }}>
                        Thao tác này sẽ gỡ bỏ mẫu CV khỏi kho mẫu hệ thống.
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={() => setDeleteModalOpen(false)} color="inherit" sx={{ textTransform: "none" }}>
                        Hủy
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={handleDeleteTemplate}
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

export default ModernCVTemplateManager;