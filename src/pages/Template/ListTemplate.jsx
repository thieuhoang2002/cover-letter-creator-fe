import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getTemplatesActive } from '../../apis/template';
import { Container, Grid, Card, CardContent, CardMedia, Typography, Button, CircularProgress, Alert, IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, toggleFavoriteTemplate } from '../../apis/user';

function ListTemplate() {
    const navigate = useNavigate();

    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [favorites, setFavorites] = useState(new Set());
    const [openDialog, setOpenDialog] = useState(false); // Trạng thái mở/đóng Dialog
    const [selectedTemplateId, setSelectedTemplateId] = useState(null); // Lưu templateId khi mở Dialog

    useEffect(() => {
        const fetchTemplates = async () => {
            try {
                const data = await getTemplatesActive();
                setTemplates(Array.isArray(data) ? data : []);
                setLoading(false);

                const userFavorites = await fetchUserFavorites();
                setFavorites(new Set(userFavorites.map(item => item.id)));
            } catch (err) {
                setError('Không thể tải danh sách template');
                setLoading(false);
            }
        };

        fetchTemplates();
    }, []);

    const handleToggleFavorite = async (templateId) => {
        try {
            const response = await toggleFavoriteTemplate(templateId);
            console.log(response); // Log phản hồi từ API (nếu cần)
            if (response === "Favorite toggled successfully") {
                setFavorites(prev => {
                    const newFavorites = new Set(prev);
                    if (newFavorites.has(templateId)) {
                        newFavorites.delete(templateId);
                    } else {
                        newFavorites.add(templateId);
                    }
                    return newFavorites;
                });
            } else {
                console.error('Failed to toggle favorite');
            }
        } catch (error) {
            console.error('Error toggling favorite:', error);
        }
    };

    const handleDialogClose = () => {
        setOpenDialog(false);
    };

    const handleLoginRedirect = () => {
        setOpenDialog(false);
        navigate('/login'); // Chuyển hướng đến trang đăng nhập
    };

    if (loading) {
        return <Container sx={{ textAlign: 'center', mt: 4 }}><CircularProgress /></Container>;
    }

    if (error) {
        return <Container sx={{ textAlign: 'center', mt: 4 }}><Alert severity="error">{error}</Alert></Container>;
    }

    return (
        <Container sx={{ mt: 4, marginTop: '64px', padding: '20px' }}>
            <Typography variant="h4" gutterBottom>Danh Sách Mẫu Đơn</Typography>
            <Grid container spacing={3}>
                {(Array.isArray(templates) ? templates : []).map((item) => (
                    <Grid item xs={12} sm={6} md={4} key={item.id}>
                        <Card>
                            <CardMedia
                                component="img"
                                height="140"
                                image={item.image}
                                alt={item.name}
                            />
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    {item.name}
                                </Typography>
                                <Button
                                    component={Link}
                                    to={`/template/${item.id}`}
                                    state={{ template: item }}
                                    variant="contained"
                                    color="primary"
                                >
                                    Xem Chi Tiết
                                </Button>
                                <IconButton
                                    onClick={() => handleToggleFavorite(item.id)}
                                    sx={{ ml: 1 }}
                                >
                                    {favorites.has(item.id) ? (
                                        <FavoriteIcon color="error" />
                                    ) : (
                                        <FavoriteBorderIcon />
                                    )}
                                </IconButton>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Dialog thông báo */}
            <Dialog
                open={openDialog}
                onClose={handleDialogClose}
            >
                <DialogTitle>Thông Báo</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Bạn cần đăng nhập để yêu thích mẫu này. Bạn có muốn đăng nhập không?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose} color="secondary">
                        Hủy
                    </Button>
                    <Button onClick={handleLoginRedirect} color="primary" autoFocus>
                        Đăng Nhập
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}

async function fetchUserFavorites() {
    try {
        const user = await getCurrentUser(); // Gọi hàm getCurrentUser
        return Array.isArray(user.lovedTemplates) ? user.lovedTemplates : [];
    } catch (error) {
        console.error('Error fetching favorites:', error);
        return [];
    }
}

export default ListTemplate;