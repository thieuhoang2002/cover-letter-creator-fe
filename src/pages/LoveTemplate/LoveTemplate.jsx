import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Container, Grid, Card, CardContent, CardMedia, Typography,
    Button, CircularProgress, Snackbar, IconButton, Box, Chip, Stack,
    Paper, Tabs, Tab
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditNoteIcon from '@mui/icons-material/EditNote';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import { getCurrentUser, toggleFavoriteTemplate, toggleFavoriteModernTemplate } from '../../apis/profile';
import { useThemeMode } from '../../context/ThemeContext';

function LoveTemplate() {
    const { mode } = useThemeMode();
    const isDark = mode === 'dark';

    const [favorites, setFavorites] = useState({ lovedTemplates: [], lovedModernTemplates: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [filterTab, setFilterTab] = useState(0);

    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                const user = await getCurrentUser();
                setFavorites({
                    lovedTemplates: Array.isArray(user.lovedTemplates) ? user.lovedTemplates : [],
                    lovedModernTemplates: Array.isArray(user.lovedModernTemplates) ? user.lovedModernTemplates : []
                });
            } catch (err) {
                setError('Không thể tải danh sách mẫu yêu thích');
            } finally {
                setLoading(false);
            }
        };
        fetchFavorites();
    }, []);

    const handleToggleFavorite = async (templateId, isModern = false) => {
        try {
            if (isModern) {
                await toggleFavoriteModernTemplate(templateId);
                setFavorites((prev) => ({
                    ...prev,
                    lovedModernTemplates: prev.lovedModernTemplates.filter((item) => item.id !== templateId)
                }));
            } else {
                await toggleFavoriteTemplate(templateId);
                setFavorites((prev) => ({
                    ...prev,
                    lovedTemplates: prev.lovedTemplates.filter((item) => item.id !== templateId)
                }));
            }
            setOpenSnackbar(true);
        } catch (error) {
            console.error('Lỗi khi bỏ yêu thích:', error);
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="70vh">
                <CircularProgress sx={{ color: '#10b981' }} />
            </Box>
        );
    }

    const stateLetters = favorites.lovedTemplates.map(t => ({ ...t, isModern: false }));
    const stateModern = favorites.lovedModernTemplates.map(t => ({ ...t, isModern: true }));

    const displayedList = filterTab === 0
        ? [...stateLetters, ...stateModern]
        : filterTab === 1
        ? stateLetters
        : stateModern;

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
                        Mẫu CV & Đơn Xin Việc Yêu Thích
                    </Typography>
                    <Typography variant="body1" color="textSecondary">
                        Bộ sưu tập các mẫu thiết kế bạn đã lưu lại để sử dụng nhanh chóng bất cứ lúc nào.
                    </Typography>
                </Box>

                {/* Filter Tabs — Modern Segmented Pill Design */}
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        mb: 4
                    }}
                >
                    <Box
                        sx={{
                            p: 0.6,
                            borderRadius: '999px',
                            bgcolor: isDark ? 'rgba(30, 41, 59, 0.75)' : '#f1f5f9',
                            border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : '#e2e8f0'}`,
                            boxShadow: '0 2px 12px rgba(0, 0, 0, 0.03)',
                            width: '100%',
                            maxWidth: 560
                        }}
                    >
                        <Tabs
                            value={filterTab}
                            onChange={(e, val) => setFilterTab(val)}
                            variant="fullWidth"
                            sx={{
                                minHeight: 44,
                                '& .MuiTabs-indicator': {
                                    display: 'none'
                                },
                                '& .MuiTab-root': {
                                    fontWeight: 600,
                                    textTransform: 'none',
                                    fontSize: { xs: '0.825rem', sm: '0.925rem' },
                                    py: 1,
                                    minHeight: 42,
                                    borderRadius: '999px',
                                    transition: 'all 0.25s ease',
                                    color: isDark ? '#94a3b8' : '#64748b',
                                    '&.Mui-selected': {
                                        bgcolor: isDark ? '#2563eb' : '#ffffff',
                                        color: isDark ? '#ffffff' : '#2563eb',
                                        fontWeight: 700,
                                        boxShadow: isDark
                                            ? '0 4px 14px rgba(37, 99, 235, 0.4)'
                                            : '0 2px 10px rgba(0, 0, 0, 0.08)'
                                    }
                                }
                            }}
                        >
                            <Tab label={`Tất Cả (${stateLetters.length + stateModern.length})`} />
                            <Tab label={`Nhà Nước (${stateLetters.length})`} />
                            <Tab label={`Hiện Đại (${stateModern.length})`} />
                        </Tabs>
                    </Box>
                </Box>

                {displayedList.length === 0 ? (
                    <Paper
                        elevation={0}
                        sx={{
                            p: 6,
                            borderRadius: 4,
                            textAlign: 'center',
                            bgcolor: isDark ? 'rgba(30, 41, 59, 0.85)' : '#ffffff',
                            maxWidth: 600,
                            mx: 'auto'
                        }}
                    >
                        <BookmarkBorderIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                        <Typography variant="h6" fontWeight={700} color={isDark ? '#f8fafc' : '#0f172a'}>
                            Bạn chưa lưu mẫu yêu thích nào trong mục này
                        </Typography>
                        <Typography variant="body2" color="textSecondary" mt={1} mb={3}>
                            Nhấp vào biểu tượng trái tim ở các mẫu CV bạn ưng ý để lưu vào đây.
                        </Typography>
                        <Button
                            component={Link}
                            to={filterTab === 1 ? "/template/all" : "/modern-cv/all"}
                            variant="contained"
                            sx={{
                                borderRadius: 2.5,
                                textTransform: 'none',
                                fontWeight: 600,
                                px: 3,
                                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                            }}
                        >
                            Khám phá mẫu CV ngay
                        </Button>
                    </Paper>
                ) : (
                    <Grid container spacing={3.5}>
                        {displayedList.map((item) => {
                            const detailUrl = item.isModern ? `/modern-cv/${item.id}` : `/template/${item.id}`;
                            const editorUrl = item.isModern ? `/modern-cv-editor?templateId=${item.id}` : `/editor?templateId=${item.id}`;

                            return (
                                <Grid item xs={12} sm={6} md={4} key={`${item.isModern ? 'm' : 's'}-${item.id}`}>
                                    <Card
                                        elevation={0}
                                        sx={{
                                            height: '100%',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            borderRadius: 4,
                                            bgcolor: isDark ? 'rgba(30, 41, 59, 0.85)' : '#ffffff',
                                            boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
                                            border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)'}`,
                                            overflow: 'hidden',
                                            transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                                            '&:hover': {
                                                transform: 'translateY(-6px)',
                                                boxShadow: '0 20px 35px rgba(0,0,0,0.1)',
                                            },
                                        }}
                                    >
                                        <Box sx={{ position: 'relative', overflow: 'hidden', height: 220, bgcolor: '#f1f5f9' }}>
                                            <CardMedia
                                                component="img"
                                                image={item.image || 'https://placehold.co/400x260?text=Preview'}
                                                alt={item.name}
                                                sx={{
                                                    height: '100%',
                                                    objectFit: 'cover',
                                                    objectPosition: 'top',
                                                    transition: 'transform 0.4s ease',
                                                    '&:hover': {
                                                        transform: 'scale(1.05)',
                                                    }
                                                }}
                                            />
                                            <Chip
                                                label={item.isModern ? 'Hiện đại' : 'Nhà nước'}
                                                size="small"
                                                color={item.isModern ? 'primary' : 'secondary'}
                                                sx={{
                                                    position: 'absolute',
                                                    top: 12,
                                                    left: 12,
                                                    fontWeight: 700,
                                                    borderRadius: 1.5,
                                                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                                                }}
                                            />
                                            <IconButton
                                                onClick={() => handleToggleFavorite(item.id, item.isModern)}
                                                sx={{
                                                    position: 'absolute',
                                                    top: 8,
                                                    right: 8,
                                                    bgcolor: 'rgba(255,255,255,0.9)',
                                                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                                                    '&:hover': {
                                                        bgcolor: '#ffffff',
                                                        transform: 'scale(1.1)',
                                                    }
                                                }}
                                            >
                                                <FavoriteIcon sx={{ color: '#ef4444' }} />
                                            </IconButton>
                                        </Box>

                                        <CardContent sx={{ p: 2.5, flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                            <Box mb={2}>
                                                <Typography variant="h6" fontWeight={700} color={isDark ? '#f8fafc' : '#0f172a'} gutterBottom noWrap>
                                                    {item.name}
                                                </Typography>
                                                <Typography variant="caption" color="textSecondary" display="block">
                                                    Loại: {item.type || (item.isModern ? 'Mẫu CV Hiện Đại' : 'Đơn Xin Việc')}
                                                </Typography>
                                            </Box>

                                            <Stack direction="row" spacing={1.5}>
                                                <Button
                                                    component={Link}
                                                    to={detailUrl}
                                                    state={{ template: item }}
                                                    variant="outlined"
                                                    fullWidth
                                                    size="small"
                                                    startIcon={<VisibilityIcon fontSize="small" />}
                                                    sx={{
                                                        borderRadius: 2,
                                                        textTransform: 'none',
                                                        fontWeight: 600,
                                                    }}
                                                >
                                                    Chi tiết
                                                </Button>
                                                <Button
                                                    component={Link}
                                                    to={editorUrl}
                                                    variant="contained"
                                                    fullWidth
                                                    size="small"
                                                    startIcon={<EditNoteIcon fontSize="small" />}
                                                    sx={{
                                                        borderRadius: 2,
                                                        textTransform: 'none',
                                                        fontWeight: 600,
                                                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                                    }}
                                                >
                                                    Dùng mẫu
                                                </Button>
                                            </Stack>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            );
                        })}
                    </Grid>
                )}

                <Snackbar
                    open={openSnackbar}
                    autoHideDuration={3000}
                    onClose={() => setOpenSnackbar(false)}
                    message="Đã xóa mẫu khỏi danh sách yêu thích"
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                />
            </Container>
        </Box>
    );
}

export default LoveTemplate;