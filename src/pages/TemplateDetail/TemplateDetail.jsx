import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate, Link as RouterLink } from 'react-router-dom';
import {
    Container,
    Typography,
    Button,
    Box,
    CircularProgress,
    Paper,
    Divider,
    Grid,
    Chip,
    Alert,
    Card,
    useTheme,
    alpha
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditNoteIcon from '@mui/icons-material/EditNote';
import ExploreIcon from '@mui/icons-material/Explore';
import ArticleIcon from '@mui/icons-material/Article';
import { getTemplateById, getTemplatesActive } from '../../apis/template';

function TemplateDetail() {
    const { templateId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    const [template, setTemplate] = useState(location.state?.template || null);
    const [loading, setLoading] = useState(!template);
    const [error, setError] = useState(null);
    const [availableTemplates, setAvailableTemplates] = useState([]);

    useEffect(() => {
        // If template was already passed via route state, no need to fetch
        if (template) {
            setLoading(false);
            return;
        }

        const fetchTemplate = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await getTemplateById(templateId);
                setTemplate(data);
            } catch (err) {
                console.warn(`Không tìm thấy mẫu đơn #${templateId}, đang tải danh sách gợi ý...`, err);
                try {
                    const activeList = await getTemplatesActive();
                    if (Array.isArray(activeList) && activeList.length > 0) {
                        setAvailableTemplates(activeList.slice(0, 4));
                    }
                } catch {
                    // ignore
                }
                setError(`Không tìm thấy mẫu đơn với mã định danh #${templateId}. Mẫu có thể đã được cập nhật hoặc cơ sở dữ liệu đã thay đổi.`);
            } finally {
                setLoading(false);
            }
        };

        fetchTemplate();
    }, [templateId]);

    const handleEdit = () => {
        navigate('/editor', { state: { template } });
    };

    const handleSelectAlternative = (altTemplate) => {
        setTemplate(altTemplate);
        setError(null);
        navigate(`/template/${altTemplate.id}`, { state: { template: altTemplate }, replace: true });
    };

    if (loading) {
        return (
            <Container sx={{ textAlign: 'center', py: 12 }}>
                <CircularProgress size={48} thickness={4} />
                <Typography variant="body1" sx={{ mt: 2.5, fontWeight: 600, color: 'text.secondary' }}>
                    Đang tải thông tin mẫu đơn xin việc...
                </Typography>
            </Container>
        );
    }

    if (error || !template) {
        return (
            <Box sx={{ minHeight: '80vh', py: 6, bgcolor: isDark ? 'background.default' : '#f8fafc' }}>
                <Container maxWidth="md">
                    <Card
                        elevation={0}
                        sx={{
                            p: { xs: 3, md: 5 },
                            borderRadius: 4,
                            border: '1px solid',
                            borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
                            textAlign: 'center',
                            bgcolor: isDark ? '#1e293b' : '#ffffff'
                        }}
                    >
                        <ArticleIcon sx={{ fontSize: 64, color: '#f59e0b', mb: 2 }} />
                        <Typography variant="h5" sx={{ fontWeight: 800, mb: 1.5 }}>
                            Không Tìm Thấy Mẫu Đơn #{templateId}
                        </Typography>
                        <Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: 550, mx: 'auto', mb: 4 }}>
                            Mẫu đơn này hiện không có trong cơ sở dữ liệu (có thể do mã ID đã được cập nhật).
                            Bạn có thể chọn một trong các mẫu đơn đang có sẵn dưới đây:
                        </Typography>

                        {availableTemplates.length > 0 && (
                            <Box sx={{ mb: 4 }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2, textAlign: 'left' }}>
                                    ✨ Các mẫu đơn xin việc khả dụng:
                                </Typography>
                                <Grid container spacing={2}>
                                    {availableTemplates.map((item) => (
                                        <Grid item xs={12} sm={6} key={item.id}>
                                            <Paper
                                                elevation={0}
                                                onClick={() => handleSelectAlternative(item)}
                                                sx={{
                                                    p: 2,
                                                    borderRadius: 3,
                                                    border: '1px solid',
                                                    borderColor: isDark ? 'rgba(255,255,255,0.1)' : '#e2e8f0',
                                                    textAlign: 'left',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s',
                                                    '&:hover': {
                                                        borderColor: theme.palette.primary.main,
                                                        transform: 'translateY(-2px)'
                                                    }
                                                }}
                                            >
                                                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5 }}>
                                                    {item.name}
                                                </Typography>
                                                <Chip label={item.type || 'Nhà nước'} size="small" sx={{ fontSize: '0.7rem' }} />
                                            </Paper>
                                        </Grid>
                                    ))}
                                </Grid>
                            </Box>
                        )}

                        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                            <Button
                                component={RouterLink}
                                to="/template/all"
                                variant="contained"
                                startIcon={<ExploreIcon />}
                                sx={{ borderRadius: 2.5, px: 3, py: 1, textTransform: 'none', fontWeight: 700 }}
                            >
                                Khám Phá Kho Mẫu Đơn
                            </Button>
                            <Button
                                component={RouterLink}
                                to="/"
                                variant="outlined"
                                startIcon={<ArrowBackIcon />}
                                sx={{ borderRadius: 2.5, px: 3, py: 1, textTransform: 'none', fontWeight: 600 }}
                            >
                                Quay Về Trang Chủ
                            </Button>
                        </Box>
                    </Card>
                </Container>
            </Box>
        );
    }

    return (
        <Box sx={{ minHeight: '85vh', pt: { xs: 2.5, md: 6 }, pb: { xs: 10, md: 6 }, bgcolor: isDark ? 'background.default' : '#f8fafc' }}>
            <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
                {/* Top Nav & Breadcrumb */}
                <Box sx={{ mb: { xs: 2, md: 3 }, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1.5 }}>
                    <Button
                        component={RouterLink}
                        to="/template/all"
                        startIcon={<ArrowBackIcon />}
                        sx={{ color: 'text.secondary', textTransform: 'none', fontWeight: 600, fontSize: { xs: '0.85rem', sm: '0.9rem' } }}
                    >
                        Quay lại Danh Sách Mẫu Đơn
                    </Button>

                    {/* Desktop Edit Button */}
                    <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                        <Button
                            variant="contained"
                            size="large"
                            startIcon={<EditNoteIcon />}
                            onClick={handleEdit}
                            sx={{
                                borderRadius: 3,
                                px: 3.5,
                                py: 1.25,
                                fontWeight: 700,
                                textTransform: 'none',
                                background: 'linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%)',
                                boxShadow: '0 8px 20px -5px rgba(37, 99, 235, 0.4)'
                            }}
                        >
                            Sử Dụng & Chỉnh Sửa Mẫu Này
                        </Button>
                    </Box>
                </Box>

                {/* Main Content Card */}
                <Paper
                    elevation={0}
                    sx={{
                        p: { xs: 2, sm: 3, md: 4 },
                        borderRadius: { xs: 3, md: 4 },
                        border: '1px solid',
                        borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
                        bgcolor: isDark ? '#1e293b' : '#ffffff',
                    }}
                >
                    {/* Header Info */}
                    <Box sx={{ mb: { xs: 2, md: 3 } }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, flexWrap: 'wrap' }}>
                            <Chip
                                label={template.type || 'Mẫu Đơn'}
                                color="primary"
                                size="small"
                                sx={{ fontWeight: 700, borderRadius: 1.5 }}
                            />
                            <Chip
                                label="Quy chuẩn A4 Hành Chính"
                                variant="outlined"
                                size="small"
                                sx={{ fontWeight: 600, borderRadius: 1.5 }}
                            />
                        </Box>
                        <Typography
                            variant="h4"
                            component="h1"
                            sx={{
                                fontWeight: 800,
                                mb: 1,
                                letterSpacing: '-0.5px',
                                fontSize: { xs: '1.35rem', sm: '1.75rem', md: '2.125rem' },
                                lineHeight: { xs: 1.3, md: 1.2 }
                            }}
                        >
                            {template.name}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: { xs: '0.85rem', sm: '0.9rem' } }}>
                            Văn bản soạn thảo đúng quy chuẩn hành chính, biểu mẫu chuẩn mực và câu từ trang trọng.
                        </Typography>
                    </Box>

                    <Divider sx={{ mb: { xs: 2, md: 3 } }} />

                    {/* Preview Paper Area */}
                    <Box
                        sx={{
                            border: '1px solid',
                            borderColor: isDark ? 'rgba(255,255,255,0.1)' : '#e2e8f0',
                            borderRadius: 3,
                            p: { xs: 1.5, sm: 3, md: 4 },
                            bgcolor: isDark ? '#0f172a' : '#ffffff',
                            boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)',
                            maxHeight: { xs: '65vh', md: '75vh' },
                            overflowY: 'auto',
                            overflowX: 'auto',
                            WebkitOverflowScrolling: 'touch',
                            '& table': {
                                maxWidth: '100% !important',
                                fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem' }
                            },
                            '& p, & div': {
                                fontSize: { xs: '0.88rem', sm: '0.95rem', md: '1rem' },
                                lineHeight: 1.6
                            }
                        }}
                    >
                        <div dangerouslySetInnerHTML={{ __html: template.content || '<p>Đang chuẩn bị nội dung mẫu...</p>' }} />
                    </Box>

                    {/* Bottom Action Footer - Desktop only */}
                    <Box sx={{ mt: 3.5, display: { xs: 'none', md: 'flex' }, justifyContent: 'flex-end', gap: 2 }}>
                        <Button
                            component={RouterLink}
                            to="/template/all"
                            variant="outlined"
                            sx={{ borderRadius: 2.5, textTransform: 'none', fontWeight: 600 }}
                        >
                            Xem Mẫu Khác
                        </Button>
                        <Button
                            variant="contained"
                            startIcon={<EditNoteIcon />}
                            onClick={handleEdit}
                            sx={{
                                borderRadius: 2.5,
                                px: 3,
                                textTransform: 'none',
                                fontWeight: 700,
                                background: 'linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%)',
                            }}
                        >
                            Chỉnh Sửa Ngay
                        </Button>
                    </Box>
                </Paper>
            </Container>

            {/* Sticky Bottom Action Bar - Mobile & Tablet Only */}
            <Box
                sx={{
                    display: { xs: 'block', md: 'none' },
                    position: 'fixed',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    p: 1.5,
                    bgcolor: isDark ? 'rgba(15, 23, 42, 0.92)' : 'rgba(255, 255, 255, 0.92)',
                    backdropFilter: 'blur(10px)',
                    borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : '#e2e8f0'}`,
                    zIndex: 1000,
                    boxShadow: '0 -4px 20px rgba(0,0,0,0.1)'
                }}
            >
                <Box sx={{ display: 'flex', gap: 1.5, maxWidth: 600, mx: 'auto' }}>
                    <Button
                        component={RouterLink}
                        to="/template/all"
                        variant="outlined"
                        sx={{
                            borderRadius: 2.5,
                            textTransform: 'none',
                            fontWeight: 600,
                            flex: 1,
                            fontSize: '0.85rem'
                        }}
                    >
                        Mẫu Khác
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<EditNoteIcon />}
                        onClick={handleEdit}
                        sx={{
                            borderRadius: 2.5,
                            textTransform: 'none',
                            fontWeight: 700,
                            flex: 2,
                            fontSize: '0.9rem',
                            background: 'linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%)',
                            boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)'
                        }}
                    >
                        Chỉnh Sửa Ngay
                    </Button>
                </Box>
            </Box>
        </Box>
    );
}

export default TemplateDetail;