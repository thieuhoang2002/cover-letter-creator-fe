import React, { useState, useEffect } from 'react';
import {
    Box, Typography, Card, CardContent, Stack, Chip, Button,
    CircularProgress, Divider, TextField, Dialog, DialogTitle,
    DialogContent, DialogActions, Alert, Grid, Avatar, Snackbar
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import { useThemeMode } from '../../context/ThemeContext';
import { BACKEND_URL } from '../../apis/config';

const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

const PLAN_LABELS = { pro: 'Pro VIP', enterprise: 'Enterprise' };

const STATUS_CONFIG = {
    pending:  { label: 'Chờ duyệt', color: 'warning', icon: <HourglassEmptyIcon fontSize="small" /> },
    approved: { label: 'Đã duyệt',  color: 'success', icon: <CheckCircleIcon fontSize="small" /> },
    rejected: { label: 'Từ chối',   color: 'error',   icon: <CancelIcon fontSize="small" /> },
};

export default function AdminVipRequests() {
    const { mode } = useThemeMode();
    const isDark = mode === 'dark';

    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionDialog, setActionDialog] = useState({ open: false, type: '', id: null });
    const [adminNote, setAdminNote] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    const loadRequests = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${BACKEND_URL}/api/admin/vip-requests`, { headers: getAuthHeader() });
            const data = await res.json();
            setRequests(data.data || []);
        } catch {
            setRequests([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadRequests(); }, []);

    const handleAction = (type, id) => {
        setAdminNote('');
        setActionDialog({ open: true, type, id });
    };

    const confirmAction = async () => {
        setSubmitting(true);
        try {
            const endpoint = `${BACKEND_URL}/api/admin/vip-requests/${actionDialog.id}/${actionDialog.type}`;
            const res = await fetch(endpoint, {
                method: 'PUT',
                headers: { ...getAuthHeader(), 'Content-Type': 'application/json' },
                body: JSON.stringify({ adminNote }),
            });
            const data = await res.json();
            setSnackbar({ open: true, message: data.message || 'Thành công!', severity: res.ok ? 'success' : 'error' });
            if (res.ok) loadRequests();
        } catch (e) {
            setSnackbar({ open: true, message: 'Lỗi khi thực hiện thao tác', severity: 'error' });
        } finally {
            setSubmitting(false);
            setActionDialog({ open: false, type: '', id: null });
        }
    };

    const cardBg = isDark ? 'rgba(30, 41, 59, 0.85)' : '#ffffff';
    const borderColor = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)';

    if (loading) return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
            <CircularProgress sx={{ color: '#10b981' }} />
        </Box>
    );

    // Summary stats
    const pending  = requests.filter(r => r.status === 'pending').length;
    const approved = requests.filter(r => r.status === 'approved').length;
    const rejected = requests.filter(r => r.status === 'rejected').length;

    return (
        <Box>
            {/* Stats */}
            <Grid container spacing={2} mb={3}>
                {[
                    { label: 'Chờ duyệt', value: pending,  color: '#f59e0b' },
                    { label: 'Đã duyệt',  value: approved, color: '#10b981' },
                    { label: 'Từ chối',   value: rejected, color: '#ef4444' },
                ].map(s => (
                    <Grid item xs={12} sm={4} key={s.label}>
                        <Card elevation={0} sx={{ borderRadius: 3, bgcolor: cardBg, border: `1px solid ${borderColor}`, borderLeft: `4px solid ${s.color}`, p: 2 }}>
                            <Typography variant="caption" color="textSecondary" fontWeight={600} textTransform="uppercase">{s.label}</Typography>
                            <Typography variant="h4" fontWeight={800} color={s.color}>{s.value}</Typography>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Request list */}
            {requests.length === 0 ? (
                <Card elevation={0} sx={{ borderRadius: 3, bgcolor: cardBg, border: `1px solid ${borderColor}`, p: 4, textAlign: 'center' }}>
                    <WorkspacePremiumIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
                    <Typography color="textSecondary">Chưa có yêu cầu nâng cấp VIP nào.</Typography>
                </Card>
            ) : (
                <Stack spacing={2}>
                    {requests.map(req => {
                        const sc = STATUS_CONFIG[req.status] || STATUS_CONFIG.pending;
                        return (
                            <Card key={req.id} elevation={0} sx={{ borderRadius: 3, bgcolor: cardBg, border: `1px solid ${borderColor}`, overflow: 'hidden' }}>
                                <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                                    <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={2}>
                                        <Stack direction="row" spacing={2} alignItems="center">
                                            <Avatar sx={{ bgcolor: '#8b5cf6', width: 44, height: 44, fontWeight: 700 }}>
                                                {req.userEmail?.[0]?.toUpperCase() || 'U'}
                                            </Avatar>
                                            <Box>
                                                <Typography fontWeight={700} color={isDark ? '#f8fafc' : '#0f172a'}>
                                                    {req.userEmail}
                                                </Typography>
                                                <Stack direction="row" spacing={1} alignItems="center" mt={0.5}>
                                                    <Chip
                                                        label={PLAN_LABELS[req.plan] || req.plan}
                                                        size="small"
                                                        sx={{ bgcolor: '#8b5cf6', color: 'white', fontWeight: 700, fontSize: '0.7rem' }}
                                                    />
                                                    <Chip
                                                        icon={sc.icon}
                                                        label={sc.label}
                                                        size="small"
                                                        color={sc.color}
                                                        sx={{ fontWeight: 700, fontSize: '0.7rem' }}
                                                    />
                                                </Stack>
                                            </Box>
                                        </Stack>

                                        {req.status === 'pending' && (
                                            <Stack direction="row" spacing={1}>
                                                <Button
                                                    variant="contained"
                                                    size="small"
                                                    startIcon={<CheckCircleIcon />}
                                                    onClick={() => handleAction('approve', req.id)}
                                                    sx={{ background: 'linear-gradient(135deg, #10b981, #059669)', color: 'white', textTransform: 'none', fontWeight: 700, borderRadius: 2 }}
                                                >
                                                    Duyệt
                                                </Button>
                                                <Button
                                                    variant="outlined"
                                                    size="small"
                                                    color="error"
                                                    startIcon={<CancelIcon />}
                                                    onClick={() => handleAction('reject', req.id)}
                                                    sx={{ textTransform: 'none', fontWeight: 700, borderRadius: 2 }}
                                                >
                                                    Từ chối
                                                </Button>
                                            </Stack>
                                        )}
                                    </Stack>

                                    {(req.note || req.adminNote) && (
                                        <>
                                            <Divider sx={{ my: 1.5 }} />
                                            {req.note && (
                                                <Typography variant="caption" color="textSecondary">
                                                    💬 User: {req.note}
                                                </Typography>
                                            )}
                                            {req.adminNote && (
                                                <Typography variant="caption" display="block" color="textSecondary" mt={0.5}>
                                                    🛡️ Admin: {req.adminNote}
                                                </Typography>
                                            )}
                                        </>
                                    )}

                                    <Typography variant="caption" color="textSecondary" display="block" mt={1}>
                                        📅 {new Date(req.createdAt).toLocaleString('vi-VN')}
                                        {req.updatedAt && ` · Cập nhật: ${new Date(req.updatedAt).toLocaleString('vi-VN')}`}
                                    </Typography>
                                </CardContent>
                            </Card>
                        );
                    })}
                </Stack>
            )}

            {/* Approve/Reject Confirmation Dialog */}
            <Dialog open={actionDialog.open} onClose={() => setActionDialog({ open: false, type: '', id: null })} maxWidth="xs" fullWidth>
                <DialogTitle fontWeight={700}>
                    {actionDialog.type === 'approve' ? '✅ Xác nhận Duyệt VIP' : '❌ Xác nhận Từ Chối'}
                </DialogTitle>
                <DialogContent>
                    <TextField
                        label="Ghi chú Admin (tùy chọn)"
                        fullWidth
                        size="small"
                        multiline
                        rows={2}
                        value={adminNote}
                        onChange={e => setAdminNote(e.target.value)}
                        sx={{ mt: 1 }}
                    />
                    {actionDialog.type === 'approve' && (
                        <Alert severity="info" sx={{ mt: 2, borderRadius: 2 }}>
                            Người dùng sẽ được nâng cấp role thành <strong>VIP</strong> ngay lập tức.
                        </Alert>
                    )}
                </DialogContent>
                <DialogActions sx={{ p: 2, gap: 1 }}>
                    <Button onClick={() => setActionDialog({ open: false, type: '', id: null })} color="inherit" sx={{ textTransform: 'none' }}>Hủy</Button>
                    <Button
                        onClick={confirmAction}
                        variant="contained"
                        disabled={submitting}
                        color={actionDialog.type === 'approve' ? 'success' : 'error'}
                        sx={{ textTransform: 'none', fontWeight: 700, borderRadius: 2 }}
                    >
                        {submitting ? <CircularProgress size={18} /> : (actionDialog.type === 'approve' ? 'Duyệt' : 'Từ chối')}
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar(p => ({ ...p, open: false }))} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
                <Alert severity={snackbar.severity} sx={{ borderRadius: 2 }}>{snackbar.message}</Alert>
            </Snackbar>
        </Box>
    );
}
