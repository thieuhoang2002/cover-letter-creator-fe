import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../pages/Auth/AuthContext';
import {
    Container, Typography, CircularProgress,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, IconButton, Box, TablePagination,
    Snackbar, Alert, Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, Button, DialogContentText, Chip, MenuItem, Select, FormControl, InputLabel,
    Grid, Card, CardContent, Stack, Divider, LinearProgress, Tooltip
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AssignmentIcon from '@mui/icons-material/Assignment';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import WorkIcon from '@mui/icons-material/Work';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import { fetchFollowedCVs, updateFollowedCV, deleteFollowedCV, uploadCvPdf, getUploadQuota, submitVipRequest } from '../../apis/followedCVApi';
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

    // Upload CV states
    const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
    const [vipModalOpen, setVipModalOpen] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploadFile, setUploadFile] = useState(null);
    const [uploadForm, setUploadForm] = useState({ name: '', company: '', note: '' });
    const [quota, setQuota] = useState({ isVip: false, used: 0, max: 3, remaining: 3 });
    const [vipPlan, setVipPlan] = useState('pro');
    const [vipNote, setVipNote] = useState('');
    const [vipSubmitting, setVipSubmitting] = useState(false);
    const uploadFileInputRef = useRef(null);

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

    const loadQuota = async () => {
        const q = await getUploadQuota();
        setQuota(q);
    };

    useEffect(() => {
        if (token) loadQuota();
    }, [token, followedCVs]);

    const handleOpenUploadDialog = () => {
        setUploadFile(null);
        setUploadForm({ name: '', company: '', note: '' });
        setUploadDialogOpen(true);
    };

    const handleUploadFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (file.type !== 'application/pdf') {
            setSnackbarMessage('Chỉ chấp nhận file PDF!');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
            return;
        }
        if (file.size > 10 * 1024 * 1024) {
            setSnackbarMessage('File PDF không được vượt quá 10MB!');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
            return;
        }
        setUploadFile(file);
        if (!uploadForm.name) {
            setUploadForm(prev => ({ ...prev, name: file.name.replace('.pdf', '') }));
        }
    };

    const handleDoUpload = async () => {
        if (!uploadFile) return;
        setUploading(true);
        const result = await uploadCvPdf(uploadFile, uploadForm.name, uploadForm.company, uploadForm.note);
        setUploading(false);
        if (result.success) {
            setUploadDialogOpen(false);
            setSnackbarMessage('Tải lên CV thành công!');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
            loadFollowedCVs();
        } else if (result.quotaExceeded) {
            setUploadDialogOpen(false);
            setVipModalOpen(true);
        } else {
            setSnackbarMessage(result.message);
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
    };

    const handleSubmitVipRequest = async () => {
        setVipSubmitting(true);
        const result = await submitVipRequest(vipPlan, vipNote);
        setVipSubmitting(false);
        setVipModalOpen(false);
        setSnackbarMessage(result.message);
        setSnackbarSeverity(result.success ? 'success' : 'error');
        setSnackbarOpen(true);
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
                    <Typography variant="body1" color="textSecondary" mb={2}>
                        Quản lý trạng thái phỏng vấn, công ty đã nộp và ghi chú hồ sơ xin việc của bạn.
                    </Typography>
                    {/* Upload CV button + quota */}
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center" alignItems="center" mb={1}>
                        <Button
                            variant="contained"
                            startIcon={<UploadFileIcon />}
                            onClick={handleOpenUploadDialog}
                            sx={{
                                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                color: 'white',
                                fontWeight: 700,
                                borderRadius: 2.5,
                                px: 3,
                                '&:hover': { background: 'linear-gradient(135deg, #059669 0%, #047857 100%)' },
                            }}
                        >
                            Tải lên CV từ thiết bị
                        </Button>
                        {quota.isVip ? (
                            <Chip icon={<WorkspacePremiumIcon />} label="VIP — Không giới hạn" color="warning" sx={{ fontWeight: 700 }} />
                        ) : (
                            <Tooltip title={`Đã dùng ${quota.used}/${quota.max} file CV`}>
                                <Box sx={{ minWidth: 180, textAlign: 'left' }}>
                                    <Typography variant="caption" color="textSecondary" fontWeight={600}>
                                        Quota: {quota.used}/{quota.max} CV đã upload
                                    </Typography>
                                    <LinearProgress
                                        variant="determinate"
                                        value={Math.min(100, (quota.used / quota.max) * 100)}
                                        sx={{
                                            height: 6, borderRadius: 3,
                                            bgcolor: isDark ? '#334155' : '#e2e8f0',
                                            '& .MuiLinearProgress-bar': {
                                                background: quota.remaining === 0
                                                    ? 'linear-gradient(90deg, #ef4444, #dc2626)'
                                                    : 'linear-gradient(90deg, #10b981, #059669)',
                                            },
                                        }}
                                    />
                                </Box>
                            </Tooltip>
                        )}
                    </Stack>
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
                                            <TableCell sx={{ fontWeight: 600 }}>
                                                <Stack direction="row" spacing={1} alignItems="center">
                                                    <span>{cv.name}</span>
                                                    {cv.source === 'uploaded'
                                                        ? <Chip label="📎 Upload" size="small" sx={{ fontSize: '0.65rem', height: 20, bgcolor: '#dbeafe', color: '#1d4ed8', fontWeight: 700 }} />
                                                        : <Chip label="🔗 Link" size="small" sx={{ fontSize: '0.65rem', height: 20, bgcolor: isDark ? '#1e293b' : '#f1f5f9', color: 'text.secondary', fontWeight: 600 }} />
                                                    }
                                                </Stack>
                                            </TableCell>
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
                                            <Box>
                                                <Typography variant="subtitle2" sx={{ fontWeight: 700, lineHeight: 1.3 }}>
                                                    {cv.name}
                                                </Typography>
                                                {cv.source === 'uploaded'
                                                    ? <Chip label="📎 Đã upload" size="small" sx={{ mt: 0.5, fontSize: '0.62rem', height: 18, bgcolor: '#dbeafe', color: '#1d4ed8', fontWeight: 700 }} />
                                                    : <Chip label="🔗 Theo dõi link" size="small" sx={{ mt: 0.5, fontSize: '0.62rem', height: 18, bgcolor: isDark ? '#1e293b' : '#f1f5f9', color: 'text.secondary', fontWeight: 600 }} />
                                                }
                                            </Box>
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
                {/* ===== UPLOAD CV DIALOG ===== */}
                <Dialog open={uploadDialogOpen} onClose={() => setUploadDialogOpen(false)} maxWidth="sm" fullWidth>
                    <DialogTitle sx={{ fontWeight: 700 }}>
                        <Stack direction="row" alignItems="center" spacing={1}>
                            <UploadFileIcon color="success" />
                            <span>Tải lên CV từ thiết bị</span>
                        </Stack>
                    </DialogTitle>
                    <DialogContent>
                        <Stack spacing={2} mt={1}>
                            {/* File picker */}
                            <Box
                                onClick={() => uploadFileInputRef.current?.click()}
                                sx={{
                                    border: '2px dashed',
                                    borderColor: uploadFile ? '#10b981' : (isDark ? '#475569' : '#cbd5e1'),
                                    borderRadius: 3,
                                    p: 3,
                                    textAlign: 'center',
                                    cursor: 'pointer',
                                    bgcolor: isDark ? 'rgba(16,185,129,0.05)' : 'rgba(16,185,129,0.03)',
                                    transition: 'border-color 0.2s',
                                    '&:hover': { borderColor: '#10b981' },
                                }}
                            >
                                <UploadFileIcon sx={{ fontSize: 40, color: uploadFile ? '#10b981' : 'text.secondary' }} />
                                <Typography variant="body2" color={uploadFile ? '#10b981' : 'textSecondary'} mt={1} fontWeight={600}>
                                    {uploadFile ? uploadFile.name : 'Nhấn để chọn file PDF (tối đa 10MB)'}
                                </Typography>
                                {uploadFile && (
                                    <Typography variant="caption" color="textSecondary">
                                        {(uploadFile.size / 1024 / 1024).toFixed(2)} MB
                                    </Typography>
                                )}
                            </Box>
                            <input ref={uploadFileInputRef} type="file" accept="application/pdf" hidden onChange={handleUploadFileChange} />

                            <TextField
                                label="Tên CV / Vị trí ứng tuyển"
                                size="small"
                                fullWidth
                                value={uploadForm.name}
                                onChange={e => setUploadForm(p => ({ ...p, name: e.target.value }))}
                            />
                            <TextField
                                label="Công ty"
                                size="small"
                                fullWidth
                                value={uploadForm.company}
                                onChange={e => setUploadForm(p => ({ ...p, company: e.target.value }))}
                            />
                            <TextField
                                label="Ghi chú"
                                size="small"
                                fullWidth
                                multiline
                                rows={2}
                                value={uploadForm.note}
                                onChange={e => setUploadForm(p => ({ ...p, note: e.target.value }))}
                            />

                            {!quota.isVip && (
                                <Box sx={{ bgcolor: isDark ? '#1e293b' : '#f1f5f9', borderRadius: 2, p: 1.5 }}>
                                    <Typography variant="caption" color="textSecondary">
                                        📦 Quota: <strong>{quota.used}/{quota.max}</strong> CV đã upload. Còn lại: <strong>{quota.remaining}</strong>
                                    </Typography>
                                </Box>
                            )}
                        </Stack>
                    </DialogContent>
                    <DialogActions sx={{ p: 2, gap: 1 }}>
                        <Button onClick={() => setUploadDialogOpen(false)} color="inherit" sx={{ textTransform: 'none' }}>Hủy</Button>
                        <Button
                            onClick={handleDoUpload}
                            variant="contained"
                            disabled={!uploadFile || uploading}
                            sx={{ background: 'linear-gradient(135deg, #10b981, #059669)', color: 'white', textTransform: 'none', fontWeight: 700, borderRadius: 2 }}
                        >
                            {uploading ? <CircularProgress size={20} sx={{ color: 'white' }} /> : 'Tải lên'}
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* ===== VIP UPGRADE MODAL ===== */}
                <Dialog open={vipModalOpen} onClose={() => setVipModalOpen(false)} maxWidth="sm" fullWidth>
                    <DialogTitle sx={{ fontWeight: 800, textAlign: 'center' }}>
                        <WorkspacePremiumIcon sx={{ color: '#f59e0b', mr: 1, verticalAlign: 'middle' }} />
                        Nâng cấp lên VIP
                    </DialogTitle>
                    <DialogContent>
                        <Typography variant="body2" color="textSecondary" textAlign="center" mb={3}>
                            Bạn đã dùng hết <strong>{quota.used}/{quota.max}</strong> lượt upload CV miễn phí.
                            Nâng cấp để upload không giới hạn!
                        </Typography>

                        {/* Plans */}
                        <Grid container spacing={2} mb={3}>
                            {[
                                { id: 'pro', name: 'Pro VIP', price: '99.000₫/tháng', features: ['Upload không giới hạn', 'Ưu tiên hàng đợi AI', 'Hỗ trợ ưu tiên'], color: '#10b981' },
                                { id: 'enterprise', name: 'Enterprise', price: 'Liên hệ', features: ['Tất cả tính năng Pro', 'API Access', 'SLA 99.9%', 'Hỗ trợ 24/7'], color: '#8b5cf6' },
                            ].map(plan => (
                                <Grid item xs={12} sm={6} key={plan.id}>
                                    <Card
                                        onClick={() => setVipPlan(plan.id)}
                                        sx={{
                                            cursor: 'pointer',
                                            border: '2px solid',
                                            borderColor: vipPlan === plan.id ? plan.color : (isDark ? '#334155' : '#e2e8f0'),
                                            borderRadius: 3,
                                            p: 2,
                                            bgcolor: vipPlan === plan.id
                                                ? (isDark ? `${plan.color}15` : `${plan.color}08`)
                                                : (isDark ? 'rgba(30,41,59,0.7)' : '#ffffff'),
                                            transition: 'all 0.2s',
                                        }}
                                    >
                                        <Typography variant="h6" fontWeight={800} color={plan.color}>{plan.name}</Typography>
                                        <Typography variant="h5" fontWeight={700} mb={1}>{plan.price}</Typography>
                                        {plan.features.map(f => (
                                            <Typography key={f} variant="caption" display="block" color="textSecondary">✓ {f}</Typography>
                                        ))}
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>

                        <TextField
                            label="Ghi chú cho Admin (tùy chọn)"
                            fullWidth
                            size="small"
                            multiline
                            rows={2}
                            value={vipNote}
                            onChange={e => setVipNote(e.target.value)}
                        />
                        <Typography variant="caption" color="textSecondary" mt={1} display="block">
                            * Sau khi gửi, Admin sẽ liên hệ và kích hoạt gói VIP cho bạn trong vòng 24h.
                        </Typography>
                    </DialogContent>
                    <DialogActions sx={{ p: 2, gap: 1 }}>
                        <Button onClick={() => setVipModalOpen(false)} color="inherit" sx={{ textTransform: 'none' }}>Đóng</Button>
                        <Button
                            onClick={handleSubmitVipRequest}
                            variant="contained"
                            disabled={vipSubmitting}
                            sx={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: 'white', textTransform: 'none', fontWeight: 700, borderRadius: 2 }}
                        >
                            {vipSubmitting ? <CircularProgress size={20} sx={{ color: 'white' }} /> : `Gửi yêu cầu ${vipPlan === 'pro' ? 'Pro VIP' : 'Enterprise'}`}
                        </Button>
                    </DialogActions>
                </Dialog>

            </Container>

        </Box>
    );
};

export default FollowCV;