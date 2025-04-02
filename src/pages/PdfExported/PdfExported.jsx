import React, { useState, useEffect } from 'react';
import { generatePdf, fetchCoverLetters, deleteCoverLetter } from '../../apis/pdf';
import { useAuth } from '../../pages/Auth/AuthContext';
import {
    Container, Typography, Button, CircularProgress,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, IconButton, Box, Tooltip, TablePagination,
    Snackbar, Alert as MuiAlert, Dialog, DialogTitle, DialogContent,
    DialogContentText, DialogActions
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';

const PdfExported = () => {
    const { userId } = useAuth();
    const [coverLetters, setCoverLetters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deletingId, setDeletingId] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        if (userId) {
            loadCoverLetters();
        }
    }, [userId]);

    const loadCoverLetters = async () => {
        setLoading(true);
        const result = await fetchCoverLetters(userId);
        if (result.success) {
            setCoverLetters(result.data);
        } else {
            setSnackbarMessage(result.message);
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
            setCoverLetters([]);
        }
        setLoading(false);
    };

    const handleGeneratePdf = () => {
        window.history.pushState({}, '', '/template/all');
        window.dispatchEvent(new PopStateEvent('popstate'));
    };

    const handleDeleteCoverLetter = (id) => {
        setDeletingId(id);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = async () => {
        if (!deletingId) return;

        setIsDeleting(true);
        const result = await deleteCoverLetter(deletingId);

        setSnackbarMessage(result.message);
        setSnackbarSeverity(result.success ? 'success' : 'error');
        setSnackbarOpen(true);

        if (result.success) {
            await loadCoverLetters();
        }

        setIsDeleting(false);
        setDeleteDialogOpen(false);
        setDeletingId(null);
    };

    const handleDeleteDialogClose = () => {
        setDeleteDialogOpen(false);
        setDeletingId(null);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
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
                Danh Sách Đơn Xin Việc Đã Xuất
            </Typography>

            <Box sx={{ mb: 3, textAlign: 'center' }}>
                <Button variant="contained" color="primary" onClick={handleGeneratePdf}>
                    Tạo Đơn Xin Việc Mới
                </Button>
            </Box>

            {coverLetters.length === 0 ? (
                <Typography align="center" variant="body1" sx={{ mt: 3 }}>
                    Bạn chưa xuất PDF lá đơn nào.
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
                            {coverLetters.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((pdf) => (
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
                                                    onClick={() => handleDeleteCoverLetter(pdf.id)}
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
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </TableContainer>
            )}

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <MuiAlert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </MuiAlert>
            </Snackbar>
        </Container>
    );
};

export default PdfExported;