import React, { useState, useEffect } from 'react';
import { useAuth } from '../../pages/Auth/AuthContext';
import {
    Container, Typography, CircularProgress,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, IconButton, Box, TablePagination,
    Snackbar, Alert, Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, Button, DialogContentText, Chip, MenuItem, Select, FormControl, InputLabel,
    Grid, Card, CardContent, Stack, Divider
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AssignmentIcon from '@mui/icons-material/Assignment';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import WorkIcon from '@mui/icons-material/Work';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { fetchFollowedCVs, updateFollowedCV, deleteFollowedCV } from '../../apis/followedCVApi';
import { useThemeMode } from '../../context/ThemeContext';

const STATUS_CONFIG = {
    pending: { label: 'Chờ phản hồi', color: 'warning', icon: <HourglassEmptyIcon fontSize="small" /> },
    'đang chờ': { label: 'Chờ phản hồi', color: 'warning', icon: <HourglassEmptyIcon fontSize="small" /> },
    interview: { label: 'Phỏng vấn', color: 'info', icon: <WorkIcon fontSize="small" /> },
    'phỏng vấn': { label: 'Phỏng vấn', color: 'info', icon: <WorkIcon fontSize="small" /> },
    accepted: { label: 'Trúng tuyển', color: 'success', icon: <CheckCircleOutlineIcon fontSize="small" /> },
    'trúng tuyển': { label: 'Trúng tuyển', color: 'success', icon: <CheckCircleOutlineIcon fontSize="small" /> },
    rejected: { label: 'Từ chối', color: 'error', icon: <HighlightOffIcon fontSize="small" /> },
    'từ chối': { label: 'Từ chối', color: 'error', icon: <HighlightOffIcon fontSize="small" /> },
};

const getStatusBadge = (rawStatus) => {
    const key = (rawStatus || '').toLowerCase().trim();
    const config = STATUS_CONFIG[key] || { label: rawStatus || 'Chưa cập nhật', color: 'default' };
    return (
        <Chip
            size="small"
            label={config.label}
            color={config.color}
            variant="outlined"
            icon={config.icon}
            sx={{ fontWeight: 600, borderRadius: 2 }}
        />
    );
};

const FollowCV = () => {
    const { token } = useAuth();
    const { mode } = useThemeMode();
    const isDark = mode === 'dark';

    const [followedCVs, setFollowedCVs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [editingCV, setEditingCV] = useState(null);
    const [deletingCVId, setDeletingCVId] = useState(null);
    const [formData, setFormData] = useState({ note: '', company: '', status: 'Chờ phản hồi' });

    useEffect(() => {
        if (token) {
            loadFollowedCVs();
        }
    }, [token]);

    const loadFollowedCVs = async () => {
        setLoading(true);
        const result = await fetchFollowedCVs();
        if (result.success) {
            setFollowedCVs(result.data || []);
        } else {
            setFollowedCVs([]);
        }
        setLoading(false);
    };

    const handleEdit = (cv) => {
        setEditingCV(cv);
        setFormData({
            note: cv.note || '',
            company: cv.company || '',
            status: cv.status || 'Chờ phản hồi'
        });
        setEditDialogOpen(true);
    };

    const handleUpdate = async () => {
        if (!editingCV) return;
        const result = await updateFollowedCV(editingCV.id, formData);
        setSnackbarMessage(result.message || 'Cập nhật trạng thái thành công!');
        setSnackbarSeverity(result.success ? 'success' : 'error');
        setSnackbarOpen(true);
        if (result.success) {
            setEditDialogOpen(false);
            setFollowedCVs((prev) =>
                prev.map((item) => (item.id === editingCV.id ? { ...item, ...formData } : item))
            );
        }
    };

    const handleDelete = (cvId) => {
        setDeletingCVId(cvId);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = async () => {
        if (!deletingCVId) return;
        const result = await deleteFollowedCV(deletingCVId);
        setSnackbarMessage(result.message || 'Đã xóa CV khỏi danh sách theo dõi');
        setSnackbarSeverity(result.success ? 'success' : 'error');
        setSnackbarOpen(true);
        if (result.success) {
            setDeleteDialogOpen(false);
            setFollowedCVs((prev) => prev.filter((item) => item.id !== deletingCVId));
            setDeletingCVId(null);
        }
    };

    // Stats calculations
    const stats = {
        total: followedCVs.length,
        pending: followedCVs.filter(c => ['pending', 'đang chờ', 'chờ phản hồi'].includes((c.status || '').toLowerCase().trim())).length,
        interview: followedCVs.filter(c => ['interview', 'phỏng vấn'].includes((c.status || '').toLowerCase().trim())).length,
        accepted: followedCVs.filter(c => ['accepted', 'trúng tuyển'].includes((c.status || '').toLowerCase().trim())).length,
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="70vh">
                <CircularProgress sx={{ color: '#10b981' }} />
            </Box>
        );
    }

    return (
        <Box
            sx={{
                minHeight: 'calc(100vh - 64px)',
                background: isDark
                    ? 'radial-gradient(ellipse at top, #1e293b 0%, #0f172a 100%)'
                    : 'radial-gradient(ellipse at top, #f0fdf4 0%, #f8fafc 100%)',
                py: 5,
                px: { xs: 2, md: 4 },
            }}
        >
            <Container maxWidth="lg">
                {/* Header */}
                <Box mb={4} textAlign="center">
                    <Typography variant="h4" fontWeight={800} color={isDark ? '#f8fafc' : '#0f172a'} gutterBottom>
                        Theo Dõi Tiến Trình Ứng Tuyển
                    </Typography>
                    <Typography variant="body1" color="textSecondary">
                        Quản lý trạng thái phỏng vấn, công ty đã nộp và ghi chú hồ sơ xin việc của bạn.
                    </Typography>
                </Box>

                {/* KPI Metrics */}
                <Grid container spacing={2.5} mb={4}>
                    <Grid item xs={6} sm={3}>
                        <Card
                            elevation={0}
                            sx={{
                                p: 2.5,
                                borderRadius: 3.5,
                                bgcolor: isDark ? 'rgba(30, 41, 59, 0.85)' : '#ffffff',
                                boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
                                borderLeft: '4px solid #10b981',
                            }}
                        >
                            <Typography variant="caption" color="textSecondary" fontWeight={600} textTransform="uppercase">
                                Tổng số hồ sơ
                            </Typography>
                            <Typography variant="h4" fontWeight={800} color={isDark ? '#f8fafc' : '#0f172a'} mt={0.5}>
                                {stats.total}
                            </Typography>
                        </Card>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                        <Card
                            elevation={0}
                            sx={{
                                p: 2.5,
                                borderRadius: 3.5,
                                bgcolor: isDark ? 'rgba(30, 41, 59, 0.85)' : '#ffffff',
                                boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
                                borderLeft: '4px solid #f59e0b',
                            }}
                        >
                            <Typography variant="caption" color="textSecondary" fontWeight={600} textTransform="uppercase">
                                Chờ phản hồi
                            </Typography>
                            <Typography variant="h4" fontWeight={800} color="#f59e0b" mt={0.5}>
                                {stats.pending}
                            </Typography>
                        </Card>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                        <Card
                            elevation={0}
                            sx={{
                                p: 2.5,
                                borderRadius: 3.5,
                                bgcolor: isDark ? 'rgba(30, 41, 59, 0.85)' : '#ffffff',
                                boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
                                borderLeft: '4px solid #3b82f6',
                            }}
                        >
                            <Typography variant="caption" color="textSecondary" fontWeight={600} textTransform="uppercase">
                                Đang phỏng vấn
                            </Typography>
                            <Typography variant="h4" fontWeight={800} color="#3b82f6" mt={0.5}>
                                {stats.interview}
                            </Typography>
                        </Card>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                        <Card
                            elevation={0}
                            sx={{
                                p: 2.5,
                                borderRadius: 3.5,
                                bgcolor: isDark ? 'rgba(30, 41, 59, 0.85)' : '#ffffff',
                                boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
                                borderLeft: '4px solid #10b981',
                            }}
                        >
                            <Typography variant="caption" color="textSecondary" fontWeight={600} textTransform="uppercase">
                                Đã trúng tuyển
                            </Typography>
                            <Typography variant="h4" fontWeight={800} color="#10b981" mt={0.5}>
                                {stats.accepted}
                            </Typography>
                        </Card>
                    </Grid>
                </Grid>

                {/* Table */}
                {followedCVs.length === 0 ? (
                    <Paper
                        elevation={0}
                        sx={{
                            p: 6,
                            borderRadius: 4,
                            textAlign: 'center',
                            bgcolor: isDark ? 'rgba(30, 41, 59, 0.85)' : '#ffffff',
                        }}
                    >
                        <AssignmentIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                        <Typography variant="h6" fontWeight={700} color={isDark ? '#f8fafc' : '#0f172a'}>
                            Chưa có CV nào trong danh sách theo dõi
                        </Typography>
                        <Typography variant="body2" color="textSecondary" mt={1}>
                            Bạn có thể thêm CV vào mục theo dõi từ trang "Danh sách CV đã xuất" để quản lý quá trình nộp đơn.
                        </Typography>
                    </Paper>
                ) : (
                    <Box>
                        {/* Desktop Table View (Giữ nguyên không đổi cho Desktop) */}
                        <TableContainer
                            component={Paper}
                            elevation={0}
                            sx={{
                                display: { xs: 'none', md: 'block' },
                                borderRadius: 4,
                                bgcolor: isDark ? 'rgba(30, 41, 59, 0.85)' : '#ffffff',
                                boxShadow: '0 10px 30px rgba(0,0,0,0.04)',
                                overflow: 'hidden',
                            }}
                        >
                            <Table>
                                <TableHead sx={{ bgcolor: isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc' }}>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: 700 }}>Tên Hồ Sơ / CV</TableCell>
                                        <TableCell sx={{ fontWeight: 700 }}>Công Ty Ứng Tuyển</TableCell>
                                        <TableCell sx={{ fontWeight: 700 }}>Ghi Chú Tiến Độ</TableCell>
                                        <TableCell sx={{ fontWeight: 700 }}>Trạng Thái</TableCell>
                                        <TableCell align="right" sx={{ fontWeight: 700 }}>Thao Tác</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {followedCVs.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((cv) => (
                                        <TableRow
                                            key={cv.id}
                                            hover
                                            sx={{
                                                '&:last-child td, &:last-child th': { border: 0 },
                                                transition: 'background-color 0.2s',
                                            }}
                                        >
                                            <TableCell sx={{ fontWeight: 600 }}>{cv.name}</TableCell>
                                            <TableCell>{cv.company || <Typography variant="caption" color="textSecondary">Chưa nhập</Typography>}</TableCell>
                                            <TableCell sx={{ maxWidth: 260 }}>{cv.note || <Typography variant="caption" color="textSecondary">Chưa có ghi chú</Typography>}</TableCell>
                                            <TableCell>{getStatusBadge(cv.status)}</TableCell>
                                            <TableCell align="right">
                                                <Stack direction="row" spacing={1} justifyContent="flex-end">
                                                    {(cv.urlGoogleDrive || cv.fileUrl || cv.url || cv.downloadUrl || cv.r2Url) && (
                                                        <IconButton
                                                            component="a"
                                                            href={cv.urlGoogleDrive || cv.fileUrl || cv.url || cv.downloadUrl || cv.r2Url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            size="small"
                                                            sx={{ color: '#10b981' }}
                                                            title="Xem file PDF"
                                                        >
                                                            <VisibilityIcon fontSize="small" />
                                                        </IconButton>
                                                    )}
                                                    <IconButton
                                                        onClick={() => handleEdit(cv)}
                                                        size="small"
                                                        sx={{ color: '#3b82f6' }}
                                                        title="Chỉnh sửa ghi chú & trạng thái"
                                                    >
                                                        <EditIcon fontSize="small" />
                                                    </IconButton>
                                                    <IconButton
                                                        onClick={() => handleDelete(cv.id)}
                                                        size="small"
                                                        color="error"
                                                        title="Xóa theo dõi"
                                                    >
                                                        <DeleteIcon fontSize="small" />
                                                    </IconButton>
                                                </Stack>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        {/* Mobile & Tablet Card List View */}
                        <Box sx={{ display: { xs: 'block', md: 'none' } }}>
                            <Stack spacing={2}>
                                {followedCVs.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((cv) => (
                                    <Paper
                                        key={cv.id}
                                        elevation={0}
                                        sx={{
                                            p: 2,
                                            borderRadius: 3,
                                            bgcolor: isDark ? 'rgba(30, 41, 59, 0.85)' : '#ffffff',
                                            border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : '#e2e8f0'}`,
                                            boxShadow: '0 4px 14px rgba(0,0,0,0.03)'
                                        }}
                                    >
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5, gap: 1 }}>
                                            <Typography variant="subtitle2" sx={{ fontWeight: 700, lineHeight: 1.3 }}>
                                                {cv.name}
                                            </Typography>
                                            <Box sx={{ flexShrink: 0 }}>
                                                {getStatusBadge(cv.status)}
                                            </Box>
                                        </Box>

                                        <Box sx={{ mb: 1 }}>
                                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontWeight: 600 }}>
                                                Công ty ứng tuyển:
                                            </Typography>
                                            <Typography variant="body2" sx={{ fontWeight: 500, color: cv.company ? 'text.primary' : 'text.secondary' }}>
                                                {cv.company || 'Chưa cập nhật tên công ty'}
                                            </Typography>
                                        </Box>

                                        {cv.note && (
                                            <Box sx={{ mb: 1.5, p: 1.2, borderRadius: 2, bgcolor: isDark ? 'rgba(15, 23, 42, 0.5)' : '#f8fafc' }}>
                                                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontWeight: 600 }}>
                                                    Ghi chú:
                                                </Typography>
                                                <Typography variant="caption" sx={{ color: 'text.primary' }}>
                                                    {cv.note}
                                                </Typography>
                                            </Box>
                                        )}

                                        <Divider sx={{ my: 1 }} />

                                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'space-between', alignItems: 'center', pt: 0.5 }}>
                                            <Box sx={{ display: 'flex', gap: 1 }}>
                                                {(cv.urlGoogleDrive || cv.fileUrl || cv.url || cv.downloadUrl || cv.r2Url) && (
                                                    <Button
                                                        component="a"
                                                        href={cv.urlGoogleDrive || cv.fileUrl || cv.url || cv.downloadUrl || cv.r2Url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        size="small"
                                                        variant="outlined"
                                                        startIcon={<VisibilityIcon />}
                                                        sx={{
                                                            borderRadius: 2,
                                                            fontSize: '0.75rem',
                                                            textTransform: 'none',
                                                            fontWeight: 600,
                                                            borderColor: '#10b981',
                                                            color: '#10b981'
                                                        }}
                                                    >
                                                        Xem PDF
                                                    </Button>
                                                )}
                                                <Button
                                                    size="small"
                                                    variant="outlined"
                                                    startIcon={<EditIcon />}
                                                    onClick={() => handleEdit(cv)}
                                                    sx={{
                                                        borderRadius: 2,
                                                        fontSize: '0.75rem',
                                                        textTransform: 'none',
                                                        fontWeight: 600,
                                                        borderColor: '#3b82f6',
                                                        color: '#3b82f6'
                                                    }}
                                                >
                                                    Cập nhật
                                                </Button>
                                            </Box>

                                            <IconButton
                                                size="small"
                                                color="error"
                                                onClick={() => handleDelete(cv.id)}
                                                sx={{ bgcolor: isDark ? 'rgba(239, 68, 68, 0.1)' : 'rgba(239, 68, 68, 0.05)' }}
                                            >
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </Box>
                                    </Paper>
                                ))}
                            </Stack>
                        </Box>

                        {/* Pagination (Dùng chung cho cả Desktop và Mobile) */}
                        <Paper
                            elevation={0}
                            sx={{
                                mt: 2,
                                borderRadius: 3,
                                bgcolor: isDark ? 'rgba(30, 41, 59, 0.85)' : '#ffffff',
                                border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : '#e2e8f0'}`,
                                overflow: 'hidden'
                            }}
                        >
                            <TablePagination
                                rowsPerPageOptions={[5, 10, 25]}
                                component="div"
                                count={followedCVs.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={(e, newPage) => setPage(newPage)}
                                onRowsPerPageChange={(e) => {
                                    setRowsPerPage(parseInt(e.target.value, 10));
                                    setPage(0);
                                }}
                                labelRowsPerPage="Số hàng:"
                            />
                        </Paper>
                    </Box>
                )}

                {/* Edit Dialog */}
                <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
                    <DialogTitle sx={{ fontWeight: 700 }}>
                        Cập nhật tiến trình CV: {editingCV?.name}
                    </DialogTitle>
                    <DialogContent>
                        <TextField
                            label="Tên Công Ty"
                            fullWidth
                            value={formData.company}
                            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                            margin="normal"
                            placeholder="Tập đoàn FPT, Viettel, Shopee..."
                        />
                        <FormControl fullWidth margin="normal">
                            <InputLabel id="status-label">Trạng Thái Ứng Tuyển</InputLabel>
                            <Select
                                labelId="status-label"
                                label="Trạng Thái Ứng Tuyển"
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                            >
                                <MenuItem value="Chờ phản hồi">⏳ Chờ phản hồi</MenuItem>
                                <MenuItem value="Phỏng vấn">💼 Đang phỏng vấn</MenuItem>
                                <MenuItem value="Trúng tuyển">🎉 Đã trúng tuyển</MenuItem>
                                <MenuItem value="Từ chối">❌ Đã bị từ chối</MenuItem>
                            </Select>
                        </FormControl>
                        <TextField
                            label="Ghi Chú Tiến Độ"
                            fullWidth
                            multiline
                            rows={3}
                            value={formData.note}
                            onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                            margin="normal"
                            placeholder="Ví dụ: Vòng 1 phỏng vấn kỹ thuật ngày 25/09, chuẩn bị kiến thức Spring Boot..."
                        />
                    </DialogContent>
                    <DialogActions sx={{ px: 3, pb: 2.5 }}>
                        <Button onClick={() => setEditDialogOpen(false)} color="inherit" sx={{ textTransform: 'none' }}>
                            Hủy bỏ
                        </Button>
                        <Button
                            onClick={handleUpdate}
                            variant="contained"
                            sx={{
                                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                textTransform: 'none',
                                fontWeight: 600,
                                borderRadius: 2,
                            }}
                        >
                            Lưu thông tin
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Delete Dialog */}
                <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
                    <DialogTitle sx={{ fontWeight: 700 }}>Xác nhận ngừng theo dõi</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Bạn có chắc chắn muốn xóa hồ sơ này khỏi danh sách theo dõi? Thao tác này không thể hoàn tác.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions sx={{ px: 3, pb: 2 }}>
                        <Button onClick={() => setDeleteDialogOpen(false)} color="inherit" sx={{ textTransform: 'none' }}>
                            Hủy
                        </Button>
                        <Button onClick={confirmDelete} color="error" variant="contained" sx={{ textTransform: 'none', borderRadius: 2 }}>
                            Xác nhận xóa
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Feedback Snackbar */}
                <Snackbar
                    open={snackbarOpen}
                    autoHideDuration={3000}
                    onClose={() => setSnackbarOpen(false)}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                >
                    <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity} sx={{ borderRadius: 2 }}>
                        {snackbarMessage}
                    </Alert>
                </Snackbar>
            </Container>
        </Box>
    );
};

export default FollowCV;