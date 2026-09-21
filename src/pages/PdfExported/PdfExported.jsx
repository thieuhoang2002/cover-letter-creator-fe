import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchCoverLetters, deleteCoverLetter } from '../../apis/pdf';
import { fetchCoverLetters as fetchCoverLettersModernCV, deleteCoverLetter as deleteCoverLetterModernCV } from '../../apis/pdfModernCV';
import { fetchCoverLetters as fetchCoverLettersAICV, deleteCoverLetter as deleteCoverLetterAICV } from '../../apis/pdfAICV';
import { addFollowedCV } from '../../apis/followedCVApi';
import { useAuth } from '../../pages/Auth/AuthContext';
import {
    Container, Typography, Button, CircularProgress,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, IconButton, Box, Tooltip, TablePagination,
    Snackbar, Dialog, DialogTitle, DialogContent,
    DialogContentText, DialogActions, Tabs, Tab, Stack, Chip
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import AddIcon from '@mui/icons-material/Add';
import Alert from '@mui/material/Alert';
import { useThemeMode } from '../../context/ThemeContext';

const PdfExported = () => {
    const { userId } = useAuth();
    const navigate = useNavigate();
    const { mode } = useThemeMode();
    const isDark = mode === 'dark';

    const [coverLetters, setCoverLetters] = useState([]);
    const [modernCVs, setModernCVs] = useState([]);
    const [aiCVs, setAiCVs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deletingId, setDeletingId] = useState(null);
    const [deletingType, setDeletingType] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [tabValue, setTabValue] = useState(0);

    useEffect(() => {
        if (userId) {
            loadAllData();
        }
    }, [userId]);

    const loadAllData = async () => {
        setLoading(true);
        try {
            const [resLetters, resModern, resAi] = await Promise.all([
                fetchCoverLetters(userId),
                fetchCoverLettersModernCV(userId),
                fetchCoverLettersAICV(userId)
            ]);
            if (resLetters.success) setCoverLetters(resLetters.data || []);
            if (resModern.success) setModernCVs(resModern.data || []);
            if (resAi.success) setAiCVs(resAi.data || []);
        } catch (error) {
            console.error('Lỗi nạp danh sách PDF:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleGeneratePdf = () => {
        if (tabValue === 0) navigate('/template/all');
        else if (tabValue === 1) navigate('/modern-cv/all');
        else navigate('/create-cv-with-ai');
    };

    const handleDelete = (id, type) => {
        setDeletingId(id);
        setDeletingType(type);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = async () => {
        if (!deletingId || !deletingType) return;

        setIsDeleting(true);
        let result;
        if (deletingType === 'coverLetter') {
            result = await deleteCoverLetter(deletingId);
        } else if (deletingType === 'modernCV') {
            result = await deleteCoverLetterModernCV(deletingId);
        } else {
            result = await deleteCoverLetterAICV(deletingId);
        }

        setSnackbarMessage(result.message || 'Đã xóa file PDF thành công');
        setSnackbarSeverity(result.success ? 'success' : 'error');
        setSnackbarOpen(true);

        if (result.success) {
            if (deletingType === 'coverLetter') {
                setCoverLetters(prev => prev.filter(item => item.id !== deletingId));
            } else if (deletingType === 'modernCV') {
                setModernCVs(prev => prev.filter(item => item.id !== deletingId));
            } else {
                setAiCVs(prev => prev.filter(item => item.id !== deletingId));
            }
        }

        setIsDeleting(false);
        setDeleteDialogOpen(false);
        setDeletingId(null);
        setDeletingType(null);
    };

    const handleFollow = async (pdf, type) => {
        const pdfUrl = pdf.urlGoogleDrive || pdf.fileUrl || pdf.url || pdf.downloadUrl || pdf.r2Url || '';
        let cvName = 'CV';
        if (type === 'coverLetter') cvName = pdf.template?.name || 'Đơn xin việc';
        else if (type === 'modernCV') cvName = pdf.templateModernCV?.name || 'CV Hiện đại';
        else cvName = pdf.name || 'CV AI';

        const data = {
            urlGoogleDrive: pdfUrl,
            name: cvName,
            note: 'Đã xuất PDF ngày ' + new Date().toLocaleDateString('vi-VN'),
            company: '',
            status: 'Chờ phản hồi'
        };

        const result = await addFollowedCV(data);
        setSnackbarMessage(result.message || 'Đã thêm vào danh sách theo dõi CV!');
        setSnackbarSeverity(result.success ? 'success' : 'error');
        setSnackbarOpen(true);
        if (result.success) {
            setTimeout(() => {
                navigate('/follow-cv');
            }, 800);
        }
    };

    const currentList = tabValue === 0 ? coverLetters : tabValue === 1 ? modernCVs : aiCVs;
    const currentType = tabValue === 0 ? 'coverLetter' : tabValue === 1 ? 'modernCV' : 'aiCV';

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
                <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    justifyContent="space-between"
                    alignItems={{ xs: 'flex-start', sm: 'center' }}
                    spacing={2}
                    mb={4}
                >
                    <Box>
                        <Typography variant="h4" fontWeight={800} color={isDark ? '#f8fafc' : '#0f172a'} gutterBottom>
                            Hồ Sơ & CV Đã Xuất Bản
                        </Typography>
                        <Typography variant="body1" color="textSecondary">
                            Kho lưu trữ các bản CV / Đơn xin việc đã tạo. Bạn có thể xem lại file PDF hoặc đưa vào theo dõi nộp đơn.
                        </Typography>
                    </Box>

                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={handleGeneratePdf}
                        sx={{
                            borderRadius: 2.5,
                            px: 3,
                            py: 1.2,
                            fontWeight: 600,
                            textTransform: 'none',
                            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                            '&:hover': {
                                background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                            }
                        }}
                    >
                        Tạo {tabValue === 0 ? 'Đơn xin việc' : tabValue === 1 ? 'CV Hiện đại' : 'CV AI'} mới
                    </Button>
                </Stack>

                {/* Tabs */}
                <Paper
                    elevation={0}
                    sx={{
                        borderRadius: 3.5,
                        mb: 3,
                        bgcolor: isDark ? 'rgba(30, 41, 59, 0.85)' : '#ffffff',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
                        overflow: 'hidden'
                    }}
                >
                    <Tabs
                        value={tabValue}
                        onChange={(e, val) => {
                            setTabValue(val);
                            setPage(0);
                        }}
                        variant="scrollable"
                        scrollButtons="auto"
                        sx={{
                            borderBottom: 1,
                            borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'divider',
                            px: 2,
                            '& .MuiTab-root': {
                                fontWeight: 600,
                                textTransform: 'none',
                                fontSize: '0.95rem',
                                py: 2,
                            }
                        }}
                    >
                        <Tab label={`Đơn Xin Việc (${coverLetters.length})`} />
                        <Tab label={`CV Hiện Đại (${modernCVs.length})`} />
                        <Tab label={`AI CV Thần Kỳ (${aiCVs.length})`} />
                    </Tabs>
                </Paper>

                {/* Content Table or Empty State */}
                {currentList.length === 0 ? (
                    <Paper
                        elevation={0}
                        sx={{
                            p: 6,
                            borderRadius: 4,
                            textAlign: 'center',
                            bgcolor: isDark ? 'rgba(30, 41, 59, 0.85)' : '#ffffff',
                        }}
                    >
                        <PictureAsPdfIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                        <Typography variant="h6" fontWeight={700} color={isDark ? '#f8fafc' : '#0f172a'}>
                            Chưa có file PDF nào được xuất bản trong danh mục này
                        </Typography>
                        <Typography variant="body2" color="textSecondary" mt={1} mb={3}>
                            Hãy chọn một mẫu thiết kế để chỉnh sửa và xuất file PDF chất lượng cao.
                        </Typography>
                        <Button
                            variant="outlined"
                            onClick={handleGeneratePdf}
                            sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
                        >
                            Khám phá mẫu ngay
                        </Button>
                    </Paper>
                ) : (
                    <Box>
                        {/* Desktop Table View (Giữ nguyên cho Desktop) */}
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
                                        <TableCell sx={{ fontWeight: 700 }}>Tên Mẫu / CV</TableCell>
                                        <TableCell sx={{ fontWeight: 700 }}>Phân Loại</TableCell>
                                        <TableCell sx={{ fontWeight: 700 }}>Ngày Tạo</TableCell>
                                        <TableCell align="right" sx={{ fontWeight: 700 }}>Hành Động</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {currentList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((pdf) => {
                                        const name = tabValue === 0
                                            ? pdf.template?.name || 'Đơn Xin Việc'
                                            : tabValue === 1
                                            ? pdf.templateModernCV?.name || 'CV Hiện Đại'
                                            : pdf.name || 'CV AI';

                                        const type = tabValue === 0
                                            ? pdf.template?.type || 'Nhà nước'
                                            : tabValue === 1
                                            ? pdf.templateModernCV?.type || 'Hiện đại'
                                            : 'AI Generated';

                                        const pdfUrl = pdf.urlGoogleDrive || pdf.fileUrl || pdf.url || pdf.downloadUrl || pdf.r2Url;

                                        return (
                                            <TableRow
                                                key={pdf.id}
                                                hover
                                                sx={{
                                                    '&:last-child td, &:last-child th': { border: 0 },
                                                    transition: 'background-color 0.2s',
                                                }}
                                            >
                                                <TableCell sx={{ fontWeight: 600 }}>{name}</TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={type}
                                                        size="small"
                                                        variant="outlined"
                                                        color={tabValue === 0 ? 'secondary' : tabValue === 1 ? 'primary' : 'success'}
                                                        sx={{ borderRadius: 1.5, fontWeight: 600 }}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    {pdf.createdAt ? new Date(pdf.createdAt).toLocaleString('vi-VN') : 'Mới tạo'}
                                                </TableCell>
                                                <TableCell align="right">
                                                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                                                        {pdfUrl && (
                                                            <Tooltip title="Xem & Tải file PDF">
                                                                <IconButton
                                                                    component="a"
                                                                    href={pdfUrl}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    size="small"
                                                                    sx={{ color: '#10b981' }}
                                                                >
                                                                    <VisibilityIcon fontSize="small" />
                                                                </IconButton>
                                                            </Tooltip>
                                                        )}
                                                        <Tooltip title="Đưa vào danh sách Theo dõi ứng tuyển">
                                                            <IconButton
                                                                onClick={() => handleFollow(pdf, currentType)}
                                                                size="small"
                                                                sx={{ color: '#3b82f6' }}
                                                            >
                                                                <AddCircleOutlineIcon fontSize="small" />
                                                            </IconButton>
                                                        </Tooltip>
                                                        <Tooltip title="Xóa file đã lưu">
                                                            <IconButton
                                                                onClick={() => handleDelete(pdf.id, currentType)}
                                                                size="small"
                                                                color="error"
                                                                disabled={isDeleting && deletingId === pdf.id}
                                                            >
                                                                {isDeleting && deletingId === pdf.id ? (
                                                                    <CircularProgress size={18} />
                                                                ) : (
                                                                    <DeleteIcon fontSize="small" />
                                                                )}
                                                            </IconButton>
                                                        </Tooltip>
                                                    </Stack>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        {/* Mobile & Tablet Card List View */}
                        <Box sx={{ display: { xs: 'block', md: 'none' } }}>
                            <Stack spacing={2}>
                                {currentList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((pdf) => {
                                    const name = tabValue === 0
                                        ? pdf.template?.name || 'Đơn Xin Việc'
                                        : tabValue === 1
                                        ? pdf.templateModernCV?.name || 'CV Hiện Đại'
                                        : pdf.name || 'CV AI';

                                    const type = tabValue === 0
                                        ? pdf.template?.type || 'Nhà nước'
                                        : tabValue === 1
                                        ? pdf.templateModernCV?.type || 'Hiện đại'
                                        : 'AI Generated';

                                    const pdfUrl = pdf.urlGoogleDrive || pdf.fileUrl || pdf.url || pdf.downloadUrl || pdf.r2Url;

                                    return (
                                        <Paper
                                            key={pdf.id}
                                            elevation={0}
                                            sx={{
                                                p: 2,
                                                borderRadius: 3,
                                                bgcolor: isDark ? 'rgba(30, 41, 59, 0.85)' : '#ffffff',
                                                border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : '#e2e8f0'}`,
                                                boxShadow: '0 4px 14px rgba(0,0,0,0.03)'
                                            }}
                                        >
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1, gap: 1 }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, overflow: 'hidden' }}>
                                                    <PictureAsPdfIcon sx={{ color: '#ef4444', fontSize: 24, flexShrink: 0 }} />
                                                    <Typography variant="subtitle2" sx={{ fontWeight: 700, lineHeight: 1.3 }}>
                                                        {name}
                                                    </Typography>
                                                </Box>
                                                <Chip
                                                    label={type}
                                                    size="small"
                                                    variant="outlined"
                                                    color={tabValue === 0 ? 'secondary' : tabValue === 1 ? 'primary' : 'success'}
                                                    sx={{ borderRadius: 1.5, fontWeight: 600, fontSize: '0.7rem', flexShrink: 0 }}
                                                />
                                            </Box>

                                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1.5 }}>
                                                Tạo lúc: {pdf.createdAt ? new Date(pdf.createdAt).toLocaleString('vi-VN') : 'Mới tạo'}
                                            </Typography>

                                            <Divider sx={{ my: 1 }} />

                                            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'space-between', alignItems: 'center', pt: 0.5 }}>
                                                <Box sx={{ display: 'flex', gap: 1 }}>
                                                    {pdfUrl && (
                                                        <Button
                                                            component="a"
                                                            href={pdfUrl}
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
                                                        startIcon={<AddCircleOutlineIcon />}
                                                        onClick={() => handleFollow(pdf, currentType)}
                                                        sx={{
                                                            borderRadius: 2,
                                                            fontSize: '0.75rem',
                                                            textTransform: 'none',
                                                            fontWeight: 600,
                                                            borderColor: '#3b82f6',
                                                            color: '#3b82f6'
                                                        }}
                                                    >
                                                        Theo dõi
                                                    </Button>
                                                </Box>

                                                <IconButton
                                                    size="small"
                                                    color="error"
                                                    onClick={() => handleDelete(pdf.id, currentType)}
                                                    disabled={isDeleting && deletingId === pdf.id}
                                                    sx={{ bgcolor: isDark ? 'rgba(239, 68, 68, 0.1)' : 'rgba(239, 68, 68, 0.05)' }}
                                                >
                                                    {isDeleting && deletingId === pdf.id ? <CircularProgress size={16} /> : <DeleteIcon fontSize="small" />}
                                                </IconButton>
                                            </Box>
                                        </Paper>
                                    );
                                })}
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
                                count={currentList.length}
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

                {/* Delete confirmation dialog */}
                <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
                    <DialogTitle sx={{ fontWeight: 700 }}>Xác nhận xóa bản PDF</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Bạn có chắc chắn muốn xóa bản PDF này? Tệp tin đã lưu trữ sẽ bị xóa và không thể khôi phục.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions sx={{ px: 3, pb: 2 }}>
                        <Button onClick={() => setDeleteDialogOpen(false)} color="inherit" sx={{ textTransform: 'none' }}>
                            Hủy bỏ
                        </Button>
                        <Button
                            onClick={confirmDelete}
                            color="error"
                            variant="contained"
                            disabled={isDeleting}
                            sx={{ textTransform: 'none', borderRadius: 2 }}
                        >
                            {isDeleting ? <CircularProgress size={20} color="inherit" /> : 'Xóa vĩnh viễn'}
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Toast feedback */}
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

export default PdfExported;