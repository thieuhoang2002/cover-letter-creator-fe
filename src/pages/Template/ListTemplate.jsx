import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getTemplatesActive } from '../../apis/template';
import {
    Container, Typography, CircularProgress, Box, Grid, Card, CardMedia,
    CardContent, CardActions, Button, IconButton, TextField, FormControl,
    InputLabel, Select, MenuItem, Tooltip, Snackbar
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, toggleFavoriteTemplate } from '../../apis/profile';
import { viewTemplateById } from '../../apis/template';
import Alert from '@mui/material/Alert';

function ListTemplate() {
    const navigate = useNavigate();

    const [templates, setTemplates] = useState([]);
    const [filteredTemplates, setFilteredTemplates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [favorites, setFavorites] = useState(new Set());
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOrder, setSortOrder] = useState('desc'); // 'asc' hoặc 'desc'
    const [industryFilter, setIndustryFilter] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [industries, setIndustries] = useState([]); // Danh sách ngành nghề

    // Giả định danh sách ngành nghề (có thể lấy từ API nếu có)
    //const industries = ['Công nghệ', 'Y tế', 'Giáo dục', 'Kinh doanh', 'Khác'];

    useEffect(() => {
        const fetchTemplates = async () => {
            try {
                const data = await getTemplatesActive();
                setTemplates(Array.isArray(data) ? data : []);
                setFilteredTemplates(Array.isArray(data) ? data : []);
                setLoading(false);

                const userFavorites = await fetchUserFavorites();
                setFavorites(new Set(userFavorites.map(item => item.id)));
                setIndustries([...new Set(data.map(template => template.type))]); // Lấy danh sách ngành nghề từ dữ liệu mẫu đơn
            } catch (err) {
                setError('Không thể tải danh sách mẫu đơn. Vui lòng thử lại sau.');
                setLoading(false);
            }
        };

        fetchTemplates();
    }, []);

    // Lọc và sắp xếp danh sách
    useEffect(() => {
        let filtered = [...templates];

        // Lọc theo tên
        if (searchTerm) {
            filtered = filtered.filter(template =>
                template.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Lọc theo ngành nghề
        if (industryFilter) {
            filtered = filtered.filter(template =>
                template.type === industryFilter // Giả định template có trường industry
            );
        }

        // Sắp xếp theo thời gian (giả định có trường createdAt)
        filtered.sort((a, b) => {
            const dateA = new Date(a.updateDate || 0);
            const dateB = new Date(b.updateDate || 0);
            return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
        });

        setFilteredTemplates(filtered);
    }, [searchTerm, sortOrder, industryFilter, templates]);

    const handleToggleFavorite = async (templateId) => {
        try {
            const response = await toggleFavoriteTemplate(templateId);
            if (response === "Favorite toggled successfully") {
                setFavorites(prev => {
                    const newFavorites = new Set(prev);
                    if (newFavorites.has(templateId)) {
                        newFavorites.delete(templateId);
                        setSnackbarMessage('Đã bỏ yêu thích mẫu đơn!');
                    } else {
                        newFavorites.add(templateId);
                        setSnackbarMessage('Đã thêm vào danh sách yêu thích!');
                    }
                    setSnackbarSeverity('success');
                    setSnackbarOpen(true);
                    return newFavorites;
                });
            } else {
                throw new Error('Failed to toggle favorite');
            }
        } catch (error) {
            setSnackbarMessage('Lỗi khi thay đổi trạng thái yêu thích. Vui lòng đăng nhập!');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
            navigate('/login');
        }
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    const handleViewDetail = async (template) => {
        try {
            navigate(`/template/${template.id}`, { state: { template } }); // Điều hướng đến trang chi tiết
            await viewTemplateById(template.id); // Gọi API tăng view
        } catch (error) {
            console.error('Lỗi khi tăng lượt xem:', error);
        }
    };
    

    if (loading) {
        return (
            <Container sx={{ textAlign: 'center', mt: 4 }}>
                <CircularProgress />
            </Container>
        );
    }

    if (error) {
        return (
            <Container sx={{ textAlign: 'center', mt: 4 }}>
                <Alert severity="error">{error}</Alert>
            </Container>
        );
    }

    return (
        <Container sx={{ mt: 4, padding: '20px' }}>
            <Typography variant="h4" gutterBottom align="center" sx={{ mt: 4 }}>
                Danh Sách Mẫu Đơn
            </Typography>

            {/* Bộ lọc tìm kiếm nâng cao */}
            <Box sx={{ mb: 4, display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                <TextField
                    label="Tìm kiếm theo tên mẫu đơn"
                    variant="outlined"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    sx={{ minWidth: 200, flex: 1 }}
                />
                <FormControl sx={{ minWidth: 200, flex: 1 }}>
                    <InputLabel>Sắp xếp theo thời gian</InputLabel>
                    <Select
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                        label="Sắp xếp theo thời gian"
                    >
                        <MenuItem value="desc">Mới nhất trước</MenuItem>
                        <MenuItem value="asc">Cũ nhất trước</MenuItem>
                    </Select>
                </FormControl>
                <FormControl sx={{ minWidth: 200, flex: 1 }}>
                    <InputLabel>Ngành nghề</InputLabel>
                    <Select
                        value={industryFilter}
                        onChange={(e) => setIndustryFilter(e.target.value)}
                        label="Ngành nghề"
                    >
                        <MenuItem value="">Tất cả</MenuItem>
                        {industries.map((industry) => (
                            <MenuItem key={industry} value={industry}>
                                {industry}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>

            {/* Hiển thị danh sách template dưới dạng Card */}
            <Grid container spacing={3}>
                {filteredTemplates.length > 0 ? (
                    filteredTemplates.map((template) => (
                        <Grid item xs={12} sm={6} md={4} key={template.id}>
                            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', boxShadow: 3 }}>
                                <CardMedia
                                    component="img"
                                    height="140"
                                    image={template.image || 'https://placehold.co/150'}
                                    alt={template.name}
                                    sx={{ objectFit: 'cover' }}
                                />
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Typography variant="h6" gutterBottom>
                                        {template.name}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Ngành: {template.type || 'Không xác định'}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Lượt xem: {template.views || 0}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Cập nhật: {new Date(template.updateDate).toLocaleDateString()}
                                    </Typography>
                                </CardContent>
                                <CardActions sx={{ justifyContent: 'space-between', p: 2 }}>
                                <Button
                                    onClick={() => handleViewDetail(template)}
                                    variant="contained"
                                    color="primary"
                                    size="small"
                                >
                                    Xem Chi Tiết
                                </Button>
                                    <Tooltip title={favorites.has(template.id) ? "Bỏ yêu thích" : "Thêm vào yêu thích"}>
                                        <IconButton onClick={() => handleToggleFavorite(template.id)}>
                                            {favorites.has(template.id) ? (
                                                <FavoriteIcon color="error" />
                                            ) : (
                                                <FavoriteBorderIcon />
                                            )}
                                        </IconButton>
                                    </Tooltip>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))
                ) : (
                    <Typography variant="body1" align="center" sx={{ width: '100%', mt: 3 }}>
                        Không tìm thấy mẫu đơn nào phù hợp.
                    </Typography>
                )}
            </Grid>

            {/* Snackbar thông báo */}
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
}

async function fetchUserFavorites() {
    try {
        const user = await getCurrentUser();
        return Array.isArray(user.lovedTemplates) ? user.lovedTemplates : [];
    } catch (error) {
        console.error('Error fetching favorites:', error);
        return [];
    }
}

export default ListTemplate;