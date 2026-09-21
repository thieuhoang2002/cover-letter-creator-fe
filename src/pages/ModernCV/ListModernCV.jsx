import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { getActiveModernTemplates, getModernTemplateById } from '../../apis/templateModernCV';
import { getCurrentUser, toggleFavoriteModernTemplate } from '../../apis/profile';
import {
    Container,
    Typography,
    Box,
    Grid,
    Card,
    CardMedia,
    CardContent,
    CardActions,
    Button,
    IconButton,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Tooltip,
    Snackbar,
    Alert,
    Chip,
    Skeleton,
    InputAdornment,
    useTheme,
    alpha
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ArticleIcon from '@mui/icons-material/Article';
import ClearIcon from '@mui/icons-material/Clear';
import StarsIcon from '@mui/icons-material/Stars';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import BadgeIcon from '@mui/icons-material/Badge';

const DEFAULT_MODERN_PREVIEW = 'https://images.unsplash.com/photo-1586281380117-5a60ae2050cc?w=600&auto=format&fit=crop&q=80';

function ListModernCV() {
    const navigate = useNavigate();
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [favorites, setFavorites] = useState(new Set());
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOrder, setSortOrder] = useState('popular'); // 'popular', 'desc', 'asc'
    const [selectedCategory, setSelectedCategory] = useState('ALL');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    useEffect(() => {
        const fetchTemplates = async () => {
            try {
                const data = await getActiveModernTemplates();
                setTemplates(Array.isArray(data) ? data : []);

                try {
                    const user = await getCurrentUser();
                    if (user && Array.isArray(user.lovedModernTemplates)) {
                        setFavorites(new Set(user.lovedModernTemplates.map((item) => item.id)));
                    }
                } catch {
                    // Visitor not logged in
                }
            } catch (err) {
                console.error('Lỗi khi tải mẫu CV hiện đại:', err);
                setError('Không thể tải danh sách mẫu CV hiện đại. Vui lòng thử lại sau.');
            } finally {
                setLoading(false);
            }
        };

        fetchTemplates();
    }, []);

    // Unique categories
    const categories = useMemo(() => {
        const types = new Set();
        templates.forEach((t) => {
            if (t.type && t.type.trim()) {
                types.add(t.type.trim());
            }
        });
        return Array.from(types);
    }, [templates]);

    // Filter & Sort
    const filteredTemplates = useMemo(() => {
        let result = [...templates];

        if (searchTerm.trim()) {
            const query = searchTerm.toLowerCase();
            result = result.filter(
                (t) =>
                    (t.name && t.name.toLowerCase().includes(query)) ||
                    (t.type && t.type.toLowerCase().includes(query))
            );
        }

        if (selectedCategory !== 'ALL') {
            result = result.filter((t) => t.type === selectedCategory);
        }

        result.sort((a, b) => {
            if (sortOrder === 'popular') {
                return (b.views || 0) - (a.views || 0);
            }
            const dateA = new Date(a.updateDate || a.createdAt || 0);
            const dateB = new Date(b.updateDate || b.createdAt || 0);
            return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
        });

        return result;
    }, [templates, searchTerm, selectedCategory, sortOrder]);

    const handleToggleFavorite = async (templateId) => {
        try {
            const response = await toggleFavoriteModernTemplate(templateId);
            if (response === 'Modern favorite toggled successfully') {
                setFavorites((prev) => {
                    const next = new Set(prev);
                    if (next.has(templateId)) {
                        next.delete(templateId);
                        setSnackbarMessage('Đã xóa mẫu CV khỏi danh sách yêu thích!');
                    } else {
                        next.add(templateId);
                        setSnackbarMessage('Đã thêm mẫu CV vào danh sách yêu thích!');
                    }
                    return next;
                });
                setSnackbarSeverity('success');
                setSnackbarOpen(true);
            }
        } catch {
            setSnackbarMessage('Vui lòng đăng nhập để lưu mẫu CV vào danh sách yêu thích!');
            setSnackbarSeverity('info');
            setSnackbarOpen(true);
        }
    };

    const handleViewDetail = async (template) => {
        try {
            getModernTemplateById(template.id);
        } catch (e) {
            console.error(e);
        }
        navigate(`/modern-cv/${template.id}`, { state: { template } });
    };

    const handleUseDirectly = (template) => {
        navigate('/modern-cv-editor', { state: { template } });
    };

    return (
        <Box sx={{ minHeight: '85vh', py: { xs: 4, md: 6 }, bgcolor: isDark ? 'background.default' : '#f8fafc' }}>
            <Container maxWidth="lg">
                {/* Header Banner */}
                <Box sx={{ textAlign: 'center', mb: 5 }}>
                    <Box
                        sx={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 1,
                            px: 2,
                            py: 0.75,
                            borderRadius: 50,
                            bgcolor: alpha(theme.palette.secondary.main, 0.1),
                            color: theme.palette.secondary.main,
                            fontWeight: 700,
                            fontSize: '0.875rem',
                            mb: 2
                        }}
                    >
                        <StarsIcon sx={{ fontSize: 18 }} />
                        MẪU CV HIỆN ĐẠI • TỐI ƯU ATS • NÂNG TẦM HỒ SƠ ỨNG TUYỂN
                    </Box>

                    <Typography
                        variant="h3"
                        component="h1"
                        sx={{
                            fontWeight: 800,
                            fontSize: { xs: '1.85rem', sm: '2.4rem', md: '2.8rem' },
                            background: isDark
                                ? 'linear-gradient(135deg, #ffffff 0%, #a855f7 100%)'
                                : 'linear-gradient(135deg, #0f172a 0%, #7c3aed 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            mb: 1.5,
                            letterSpacing: '-0.5px'
                        }}
                    >
                        Kho Mẫu CV Hiện Đại Chuẩn ATS
                    </Typography>

                    <Typography
                        variant="body1"
                        sx={{
                            color: 'text.secondary',
                            maxWidth: 700,
                            mx: 'auto',
                            fontSize: { xs: '0.95rem', md: '1.05rem' },
                            lineHeight: 1.6
                        }}
                    >
                        Các mẫu CV được tinh chỉnh tỉ mỉ theo tiêu chuẩn ATS quốc tế, tương thích với các thuật toán sàng lọc hồ sơ
                        của các tập đoàn công nghệ, doanh nghiệp lớn và cơ quan nhà nước.
                    </Typography>
                </Box>

                {/* Filter and Search Controls Card */}
                <Card
                    elevation={0}
                    sx={{
                        p: { xs: 2.5, md: 3 },
                        mb: 4,
                        borderRadius: 3.5,
                        border: '1px solid',
                        borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
                        bgcolor: isDark ? '#1e293b' : '#ffffff',
                        boxShadow: '0 4px 20px -5px rgba(0,0,0,0.05)'
                    }}
                >
                    <Grid container spacing={2} alignItems="center">
                        {/* Search Input */}
                        <Grid item xs={12} md={7}>
                            <TextField
                                fullWidth
                                placeholder="Tìm kiếm mẫu CV (VD: Kỹ sư CNTT, Sơ yếu lý lịch 2C, Quản lý, Thiết kế...)"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon color="action" />
                                        </InputAdornment>
                                    ),
                                    endAdornment: searchTerm && (
                                        <InputAdornment position="end">
                                            <IconButton size="small" onClick={() => setSearchTerm('')}>
                                                <ClearIcon fontSize="small" />
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 3,
                                    }
                                }}
                            />
                        </Grid>

                        {/* Sort Order Selector */}
                        <Grid item xs={12} md={5}>
                            <FormControl fullWidth>
                                <InputLabel id="modern-sort-label">Sắp xếp theo</InputLabel>
                                <Select
                                    labelId="modern-sort-label"
                                    value={sortOrder}
                                    label="Sắp xếp theo"
                                    onChange={(e) => setSortOrder(e.target.value)}
                                    sx={{ borderRadius: 3 }}
                                >
                                    <MenuItem value="popular">🔥 Được xem nhiều nhất</MenuItem>
                                    <MenuItem value="desc">✨ Mới cập nhật nhất</MenuItem>
                                    <MenuItem value="asc">📅 Cũ nhất trước</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>

                    {/* Category Filter Chips */}
                    <Box sx={{ mt: 2.5, display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.secondary', mr: 1 }}>
                            Phân loại:
                        </Typography>
                        <Chip
                            label="Tất cả mẫu CV"
                            clickable
                            color={selectedCategory === 'ALL' ? 'secondary' : 'default'}
                            variant={selectedCategory === 'ALL' ? 'filled' : 'outlined'}
                            onClick={() => setSelectedCategory('ALL')}
                            sx={{ borderRadius: 2, fontWeight: 600 }}
                        />
                        {categories.map((cat) => (
                            <Chip
                                key={cat}
                                label={cat}
                                clickable
                                color={selectedCategory === cat ? 'secondary' : 'default'}
                                variant={selectedCategory === cat ? 'filled' : 'outlined'}
                                onClick={() => setSelectedCategory(cat)}
                                sx={{ borderRadius: 2, fontWeight: 500 }}
                            />
                        ))}
                    </Box>
                </Card>

                {/* Templates Count Badge */}
                <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                        Hiển thị <strong>{filteredTemplates.length}</strong> mẫu CV hiện đại sẵn sàng sử dụng
                    </Typography>
                </Box>

                {/* Error Banner */}
                {error && (
                    <Alert severity="error" sx={{ mb: 4, borderRadius: 3 }}>
                        {error}
                    </Alert>
                )}

                {/* Grid of Templates */}
                <Grid container spacing={3}>
                    {loading ? (
                        Array.from(new Array(6)).map((_, idx) => (
                            <Grid item xs={12} sm={6} md={4} key={idx}>
                                <Card sx={{ borderRadius: 3.5, overflow: 'hidden', height: '100%' }}>
                                    <Skeleton variant="rectangular" height={190} />
                                    <Box sx={{ p: 2.5 }}>
                                        <Skeleton variant="text" width="60%" height={24} sx={{ mb: 1 }} />
                                        <Skeleton variant="text" width="90%" height={28} />
                                        <Skeleton variant="text" width="40%" height={20} sx={{ mt: 1 }} />
                                        <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                                            <Skeleton variant="rounded" width="50%" height={36} />
                                            <Skeleton variant="rounded" width="50%" height={36} />
                                        </Box>
                                    </Box>
                                </Card>
                            </Grid>
                        ))
                    ) : filteredTemplates.length > 0 ? (
                        filteredTemplates.map((template) => {
                            const isFavorite = favorites.has(template.id);
                            const imgSrc = template.image && !template.image.includes('placehold')
                                ? template.image
                                : DEFAULT_MODERN_PREVIEW;

                            return (
                                <Grid item xs={12} sm={6} md={4} key={template.id}>
                                    <Card
                                        elevation={0}
                                        sx={{
                                            height: '100%',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            borderRadius: 3.5,
                                            border: '1px solid',
                                            borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
                                            bgcolor: isDark ? '#1e293b' : '#ffffff',
                                            transition: 'all 0.25s ease-in-out',
                                            overflow: 'hidden',
                                            position: 'relative',
                                            '&:hover': {
                                                transform: 'translateY(-5px)',
                                                boxShadow: isDark
                                                    ? '0 16px 30px -10px rgba(0,0,0,0.6)'
                                                    : '0 16px 30px -10px rgba(124, 58, 237, 0.15)',
                                                borderColor: theme.palette.secondary.main,
                                            }
                                        }}
                                    >
                                        {/* Image Box with Floating Badges */}
                                        <Box sx={{ position: 'relative', height: 180, bgcolor: isDark ? '#0f172a' : '#f1f5f9', overflow: 'hidden' }}>
                                            <CardMedia
                                                component="img"
                                                height="180"
                                                image={imgSrc}
                                                alt={template.name}
                                                sx={{
                                                    objectFit: 'cover',
                                                    transition: 'transform 0.4s ease',
                                                    '&:hover': {
                                                        transform: 'scale(1.05)'
                                                    }
                                                }}
                                            />

                                            {/* Category Tag Overlay */}
                                            <Chip
                                                label={template.type || 'Chuyên nghiệp'}
                                                size="small"
                                                sx={{
                                                    position: 'absolute',
                                                    top: 12,
                                                    left: 12,
                                                    fontWeight: 700,
                                                    fontSize: '0.72rem',
                                                    bgcolor: 'rgba(15, 23, 42, 0.8)',
                                                    color: '#ffffff',
                                                    backdropFilter: 'blur(8px)',
                                                    border: '1px solid rgba(255,255,255,0.2)'
                                                }}
                                            />

                                            {/* Favorite Action Button */}
                                            <Tooltip title={isFavorite ? 'Bỏ yêu thích' : 'Thêm vào yêu thích'}>
                                                <IconButton
                                                    size="small"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleToggleFavorite(template.id);
                                                    }}
                                                    sx={{
                                                        position: 'absolute',
                                                        top: 10,
                                                        right: 10,
                                                        bgcolor: 'rgba(255, 255, 255, 0.9)',
                                                        backdropFilter: 'blur(4px)',
                                                        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                                                        '&:hover': {
                                                            bgcolor: '#ffffff',
                                                            transform: 'scale(1.1)'
                                                        }
                                                    }}
                                                >
                                                    {isFavorite ? (
                                                        <FavoriteIcon sx={{ color: '#ef4444', fontSize: 20 }} />
                                                    ) : (
                                                        <FavoriteBorderIcon sx={{ color: '#64748b', fontSize: 20 }} />
                                                    )}
                                                </IconButton>
                                            </Tooltip>

                                            {/* Views Counter Badge */}
                                            <Box
                                                sx={{
                                                    position: 'absolute',
                                                    bottom: 8,
                                                    right: 10,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 0.5,
                                                    px: 1,
                                                    py: 0.25,
                                                    borderRadius: 1.5,
                                                    bgcolor: 'rgba(15, 23, 42, 0.75)',
                                                    color: '#ffffff',
                                                    fontSize: '0.72rem',
                                                    fontWeight: 600,
                                                    backdropFilter: 'blur(4px)'
                                                }}
                                            >
                                                <VisibilityIcon sx={{ fontSize: 13 }} />
                                                {template.views || 0} lượt xem
                                            </Box>
                                        </Box>

                                        {/* Card Body */}
                                        <CardContent sx={{ flexGrow: 1, p: 2.5 }}>
                                            <Typography
                                                variant="h6"
                                                component="h2"
                                                sx={{
                                                    fontWeight: 700,
                                                    fontSize: '1.05rem',
                                                    lineHeight: 1.4,
                                                    mb: 1.5,
                                                    height: 48,
                                                    display: '-webkit-box',
                                                    WebkitLineClamp: 2,
                                                    WebkitBoxOrient: 'vertical',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis'
                                                }}
                                            >
                                                {template.name}
                                            </Typography>

                                            {/* Metadata */}
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, color: 'text.secondary', fontSize: '0.8rem' }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                    <CalendarMonthIcon sx={{ fontSize: 15 }} />
                                                    {new Date(template.updateDate || template.createdAt || Date.now()).toLocaleDateString('vi-VN')}
                                                </Box>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                    <BadgeIcon sx={{ fontSize: 15 }} />
                                                    Chuẩn ATS 2 Cột
                                                </Box>
                                            </Box>
                                        </CardContent>

                                        {/* Actions */}
                                        <CardActions sx={{ p: 2, pt: 0, gap: 1 }}>
                                            <Button
                                                fullWidth
                                                variant="outlined"
                                                size="small"
                                                onClick={() => handleViewDetail(template)}
                                                sx={{
                                                    borderRadius: 2.5,
                                                    textTransform: 'none',
                                                    fontWeight: 600,
                                                    fontSize: '0.85rem',
                                                    py: 0.8
                                                }}
                                            >
                                                Xem Chi Tiết
                                            </Button>

                                            <Button
                                                fullWidth
                                                variant="contained"
                                                size="small"
                                                endIcon={<ArrowForwardIcon />}
                                                onClick={() => handleUseDirectly(template)}
                                                sx={{
                                                    borderRadius: 2.5,
                                                    textTransform: 'none',
                                                    fontWeight: 700,
                                                    fontSize: '0.85rem',
                                                    py: 0.8,
                                                    background: 'linear-gradient(135deg, #7c3aed 0%, #9333ea 100%)',
                                                    boxShadow: '0 4px 12px rgba(124, 58, 237, 0.3)',
                                                    '&:hover': {
                                                        boxShadow: '0 6px 16px rgba(124, 58, 237, 0.45)',
                                                    }
                                                }}
                                            >
                                                Dùng Mẫu Này
                                            </Button>
                                        </CardActions>
                                    </Card>
                                </Grid>
                            );
                        })
                    ) : (
                        <Grid item xs={12}>
                            <Card
                                elevation={0}
                                sx={{
                                    p: 6,
                                    textAlign: 'center',
                                    borderRadius: 4,
                                    border: '1px dashed',
                                    borderColor: 'divider',
                                    bgcolor: 'transparent'
                                }}
                            >
                                <ArticleIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2, opacity: 0.5 }} />
                                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                                    Không tìm thấy mẫu CV nào phù hợp
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
                                    Hãy thử tìm kiếm với từ khóa khác hoặc xóa bộ lọc phân loại.
                                </Typography>
                                <Button
                                    variant="outlined"
                                    onClick={() => {
                                        setSearchTerm('');
                                        setSelectedCategory('ALL');
                                    }}
                                    sx={{ borderRadius: 2.5, textTransform: 'none' }}
                                >
                                    Xem tất cả mẫu CV
                                </Button>
                            </Card>
                        </Grid>
                    )}
                </Grid>

                {/* Snackbar */}
                <Snackbar
                    open={snackbarOpen}
                    autoHideDuration={3000}
                    onClose={() => setSnackbarOpen(false)}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                >
                    <Alert
                        onClose={() => setSnackbarOpen(false)}
                        severity={snackbarSeverity}
                        sx={{ width: '100%', borderRadius: 2.5, boxShadow: 3 }}
                    >
                        {snackbarMessage}
                    </Alert>
                </Snackbar>
            </Container>
        </Box>
    );
}

export default ListModernCV;
