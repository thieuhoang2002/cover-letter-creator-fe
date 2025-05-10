import React, { useState, useEffect } from 'react';
import { useAuth } from '../../pages/Auth/AuthContext';
import {
    Container, Typography, CircularProgress,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, IconButton, Box, TablePagination,
    Snackbar, Alert, Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, Button, DialogContentText
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { fetchFollowedCVs, updateFollowedCV, deleteFollowedCV } from '../../apis/followedCVApi';

const FollowCV = () => {
    const { token } = useAuth(); // Giả định useAuth cung cấp token
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
    const [formData, setFormData] = useState({ note: '', company: '', status: '' });

    useEffect(() => {
        if (token) {
            loadFollowedCVs();
        }
    }, [token]);

    const loadFollowedCVs = async () => {
        setLoading(true);
        const result = await fetchFollowedCVs();
        if (result.success) {
            setFollowedCVs(result.data);
            setSnackbarMessage(result.message);
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
        } else {
            setSnackbarMessage(result.message);
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
            setFollowedCVs([]);
        }
        setLoading(false);
    };

    const handleEdit = (cv) => {
        setEditingCV(cv);
        setFormData({ note: cv.note || '', company: cv.company || '', status: cv.status || 'pending' });
        setEditDialogOpen(true);
    };

    const handleUpdate = async () => {
        const result = await updateFollowedCV(editingCV.id, formData);
        setSnackbarMessage(result.message);
        setSnackbarSeverity(result.success ? 'success' : 'error');
        setSnackbarOpen(true);
        if (result.success) {
            setEditDialogOpen(false);
            loadFollowedCVs(); // Tải lại danh sách
            setTimeout(() => {
                window.location.reload();
            }, 500);
        }
    };

    const handleDelete = (cvId) => {
        setDeletingCVId(cvId);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = async () => {
        if (!deletingCVId) return;
        const result = await deleteFollowedCV(deletingCVId);
        setSnackbarMessage(result.message);
        setSnackbarSeverity(result.success ? 'success' : 'error');
        setSnackbarOpen(true);
        if (result.success) {
            setDeleteDialogOpen(false);
            setDeletingCVId(null);
            loadFollowedCVs(); // Tải lại danh sách
            setTimeout(() => {
                window.location.reload();
            }
                , 500);
        }
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

    const handleEditDialogClose = () => {
        setEditDialogOpen(false);
        setEditingCV(null);
        setFormData({ note: '', company: '', status: '' });
    };

    const handleDeleteDialogClose = () => {
        setDeleteDialogOpen(false);
        setDeletingCVId(null);
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
                Danh Sách CV Theo Dõi
            </Typography>

            {followedCVs.length === 0 ? (
                <Typography align="center" variant="body1" sx={{ mt: 3 }}>
                    Bạn chưa theo dõi CV nào.
                </Typography>
            ) : (
                <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell><Typography variant="subtitle1">Tên</Typography></TableCell>
                                <TableCell><Typography variant="subtitle1">Công Ty</Typography></TableCell>
                                <TableCell><Typography variant="subtitle1">Ghi Chú</Typography></TableCell>
                                <TableCell><Typography variant="subtitle1">Trạng Thái</Typography></TableCell>
                                <TableCell><Typography variant="subtitle1">Hành Động</Typography></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {followedCVs.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((cv) => (
                                <TableRow key={cv.id}>
                                    <TableCell>{cv.name}</TableCell>
                                    <TableCell>{cv.company || 'Chưa cập nhật'}</TableCell>
                                    <TableCell>{cv.note || 'Chưa có ghi chú'}</TableCell>
                                    <TableCell>{cv.status}</TableCell>
                                    <TableCell>
                                        <IconButton
                                            component="a"
                                            href={cv.urlGoogleDrive}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            color="primary"
                                        >
                                            <VisibilityIcon />
                                        </IconButton>
                                        <IconButton
                                            onClick={() => handleEdit(cv)}
                                            color="primary"
                                        >
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton
                                            onClick={() => handleDelete(cv.id)}
                                            color="error"
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={followedCVs.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </TableContainer>
            )}

            {/* Dialog chỉnh sửa CV */}
            <Dialog open={editDialogOpen} onClose={handleEditDialogClose}>
                <DialogTitle>Chỉnh sửa CV Theo Dõi</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Ghi Chú"
                        fullWidth
                        value={formData.note}
                        onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                        margin="normal"
                    />
                    <TextField
                        label="Công Ty"
                        fullWidth
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        margin="normal"
                    />
                    <TextField
                        label="Trạng Thái"
                        fullWidth
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        margin="normal"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleEditDialogClose} color="primary">
                        Hủy
                    </Button>
                    <Button onClick={handleUpdate} color="primary">
                        Lưu
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Dialog xác nhận xóa CV */}
            <Dialog open={deleteDialogOpen} onClose={handleDeleteDialogClose}>
                <DialogTitle>Xác nhận xóa</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Bạn có chắc chắn muốn xóa CV theo dõi này không?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteDialogClose} color="primary">
                        Hủy
                    </Button>
                    <Button onClick={confirmDelete} color="error">
                        Xóa
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

export default FollowCV;