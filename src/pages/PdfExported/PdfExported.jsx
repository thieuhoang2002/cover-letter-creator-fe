import React, { useState, useEffect } from 'react';
import { generatePdf, fetchCoverLetters, deleteCoverLetter } from '../../apis/pdf';
import { fetchCoverLetters as fetchCoverLettersModernCV, deleteCoverLetter as deleteCoverLetterModernCV } from '../../apis/pdfModernCV';
import { useAuth } from '../../pages/Auth/AuthContext';
import {
    Container, Typography, Button, CircularProgress,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, IconButton, Box, Tooltip, TablePagination,
    Snackbar, Dialog, DialogTitle, DialogContent,
    DialogContentText, DialogActions, Tabs, Tab
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Alert from '@mui/material/Alert';

const PdfExported = () => {
    const { userId } = useAuth();
    const [coverLetters, setCoverLetters] = useState([]);
    const [modernCVs, setModernCVs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [pageCoverLetters, setPageCoverLetters] = useState(0);
    const [pageModernCVs, setPageModernCVs] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deletingId, setDeletingId] = useState(null);
    const [deletingType, setDeletingType] = useState(null); // 'coverLetter' hoặc 'modernCV'
    const [isDeleting, setIsDeleting] = useState(false);
    const [tabValue, setTabValue] = useState(0); // Quản lý tab hiện tại

    useEffect(() => {
        if (userId) {
            loadAllData();
        }
    }, [userId]);

    const loadAllData = async () => {
        setLoading(true);
        await Promise.all([loadCoverLetters(), loadModernCVs()]);
        setLoading(false);
    };

    const loadCoverLetters = async () => {
        const result = await fetchCoverLetters(userId);
        if (result.success) {
            setCoverLetters(result.data);
        } else {
            setSnackbarMessage(result.message);
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
            setCoverLetters([]);
        }
    };

    const loadModernCVs = async () => {
        const result = await fetchCoverLettersModernCV(userId);
        if (result.success) {
            setModernCVs(result.data);
            console.log(result.data);
        } else {
            setSnackbarMessage(result.message);
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
            setModernCVs([]);
        }
    };

    const handleGeneratePdf = () => {
        window.history.pushState({}, '', tabValue === 0 ? '/template/all' : '/modern-cv/all');
        window.dispatchEvent(new PopStateEvent('popstate'));
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
        } else {
            result = await deleteCoverLetterModernCV(deletingId);
        }

        setSnackbarMessage(result.message);
        setSnackbarSeverity(result.success ? 'success' : 'error');
        setSnackbarOpen(true);

        if (result.success) {
            await loadAllData(); // Tải lại cả hai danh sách
        }

        setIsDeleting(false);
        setDeleteDialogOpen(false);
        setDeletingId(null);
        setDeletingType(null);
    };

    const handleDeleteDialogClose = () => {
        setDeleteDialogOpen(false);
        setDeletingId(null);
        setDeletingType(null);
    };

    const handleChangePageCoverLetters = (event, newPage) => {
        setPageCoverLetters(newPage);
    };

    const handleChangePageModernCVs = (event, newPage) => {
        setPageModernCVs(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPageCoverLetters(0);
        setPageModernCVs(0);
    };

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    if (loading) {
        return (
            <Container sx={{ textAlign: 'center', mt: 4 }}>
                <CircularProgress />
            </Container>
        );
    }

    return (
        <Container sx={{ mt: 4, padding: '20px' }}>
            <Typography variant="h4" gutterBottom align="center" sx={{ mt: 4 }}>
                Danh Sách Đã Xuất
            </Typography>

            <Box sx={{ mb: 3, textAlign: 'center' }}>
                <Button variant="contained" color="primary" onClick={handleGeneratePdf}>
                    Tạo {tabValue === 0 ? 'Đơn Xin Việc' : 'CV Hiện Đại'} Mới
                </Button>
            </Box>

            <Tabs value={tabValue} onChange={handleTabChange} centered sx={{ mb: 3 }}>
                <Tab label="Đơn Xin Việc" />
                <Tab label="CV Hiện Đại" />
            </Tabs>

            {tabValue === 0 ? (
                coverLetters.length === 0 ? (
                    <Typography align="center" variant="body1" sx={{ mt: 3 }}>
                        Bạn chưa xuất PDF đơn xin việc nào.
                    </Typography>
                ) : (
                    <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell><Typography variant="subtitle1">Tên</Typography></TableCell>
                                    <TableCell><Typography variant="subtitle1">Loại</Typography></TableCell>
                                    <TableCell><Typography variant="subtitle1">Ngày Tạo</Typography></TableCell>
                                    <TableCell><Typography variant="subtitle1">Hành Động</Typography></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {coverLetters.slice(pageCoverLetters * rowsPerPage, pageCoverLetters * rowsPerPage + rowsPerPage).map((pdf) => (
                                    <TableRow key={pdf.id}>
                                        <TableCell>{pdf.template.name}</TableCell>
                                        <TableCell>{pdf.template.type}</TableCell>
                                        <TableCell>{new Date(pdf.createdAt).toLocaleString()}</TableCell>
                                        <TableCell>
                                            <Tooltip title="Xem PDF">
                                                <IconButton
                                                    component="a"
                                                    href={pdf.urlGoogleDrive}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    color="primary"
                                                >
                                                    <VisibilityIcon />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Xóa PDF">
                                                <span>
                                                    <IconButton
                                                        onClick={() => handleDelete(pdf.id, 'coverLetter')}
                                                        color="error"
                                                        disabled={isDeleting && deletingId === pdf.id}
                                                    >
                                                        {isDeleting && deletingId === pdf.id ? (
                                                            <CircularProgress size={24} />
                                                        ) : (
                                                            <DeleteIcon />
                                                        )}
                                                    </IconButton>
                                                </span>
                                            </Tooltip>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25]}
                            component="div"
                            count={coverLetters.length}
                            rowsPerPage={rowsPerPage}
                            page={pageCoverLetters}
                            onPageChange={handleChangePageCoverLetters}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </TableContainer>
                )
            ) : (
                modernCVs.length === 0 ? (
                    <Typography align="center" variant="body1" sx={{ mt: 3 }}>
                        Bạn chưa xuất PDF CV hiện đại nào.
                    </Typography>
                ) : (
                    <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell><Typography variant="subtitle1">Tên</Typography></TableCell>
                                    <TableCell><Typography variant="subtitle1">Loại</Typography></TableCell>
                                    <TableCell><Typography variant="subtitle1">Ngày Tạo</Typography></TableCell>
                                    <TableCell><Typography variant="subtitle1">Hành Động</Typography></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {modernCVs.slice(pageModernCVs * rowsPerPage, pageModernCVs * rowsPerPage + rowsPerPage).map((pdf) => (
                                    <TableRow key={pdf.id}>
                                        <TableCell>{pdf.templateModernCV.name}</TableCell>
                                        <TableCell>{pdf.templateModernCV.type}</TableCell>
                                        <TableCell>{new Date(pdf.createdAt).toLocaleString()}</TableCell>
                                        <TableCell>
                                            <Tooltip title="Xem PDF">
                                                <IconButton
                                                    component="a"
                                                    href={pdf.urlGoogleDrive}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    color="primary"
                                                >
                                                    <VisibilityIcon />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Xóa PDF">
                                                <span>
                                                    <IconButton
                                                        onClick={() => handleDelete(pdf.id, 'modernCV')}
                                                        color="error"
                                                        disabled={isDeleting && deletingId === pdf.id}
                                                    >
                                                        {isDeleting && deletingId === pdf.id ? (
                                                            <CircularProgress size={24} />
                                                        ) : (
                                                            <DeleteIcon />
                                                        )}
                                                    </IconButton>
                                                </span>
                                            </Tooltip>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25]}
                            component="div"
                            count={modernCVs.length}
                            rowsPerPage={rowsPerPage}
                            page={pageModernCVs}
                            onPageChange={handleChangePageModernCVs}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </TableContainer>
                )
            )}

            {/* Dialog xác nhận xóa */}
            <Dialog
                open={deleteDialogOpen}
                onClose={handleDeleteDialogClose}
            >
                <DialogTitle>Xác nhận xóa</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Bạn có chắc chắn muốn xóa {deletingType === 'coverLetter' ? 'đơn xin việc' : 'CV hiện đại'} này không?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteDialogClose} color="primary">
                        Hủy
                    </Button>
                    <Button
                        onClick={confirmDelete}
                        color="error"
                        disabled={isDeleting}
                    >
                        {isDeleting ? <CircularProgress size={20} /> : "Xóa"}
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default PdfExported;