import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Grid, Card, CardContent, CardMedia, Typography, Button, CircularProgress, Snackbar, IconButton } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { getCurrentUser, toggleFavoriteTemplate, toggleFavoriteModernTemplate } from '../../apis/profile';

function LoveTemplate() {
    const [favorites, setFavorites] = useState({ lovedTemplates: [], lovedModernTemplates: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openSnackbar, setOpenSnackbar] = useState(false);

    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                const user = await getCurrentUser();
                console.log('User data:', user); // Debugging line
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
            setOpenSnackbar(true); // Show snackbar after toggle
        } catch (error) {
            console.error('Lỗi khi bỏ yêu thích:', error);
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
                <Typography variant="h6" color="error">{error}</Typography>
            </Container>
        );
    }

    const allFavorites = [...favorites.lovedTemplates, ...favorites.lovedModernTemplates];

    return (
        <Container sx={{ mt: 4, padding: '20px' }}>
            <Typography variant="h4" gutterBottom align="center" sx={{ mt: 4 }}>Mẫu Đơn Yêu Thích</Typography>
            <Grid container spacing={3}>
                {allFavorites.length === 0 ? (
                    <Typography variant="h6" color="textSecondary" align="center">Bạn chưa có mẫu yêu thích nào.</Typography>
                ) : (
                    allFavorites.map((item) => (
                        <Grid item xs={12} sm={6} md={4} key={item.id}>
                            <Card
                                sx={{
                                    transition: 'transform 0.3s ease-in-out',
                                    '&:hover': {
                                        transform: 'scale(1.05)',
                                        boxShadow: 6,
                                    },
                                }}
                            >
                                <CardMedia
                                    component="img"
                                    height="140"
                                    image={item.image}
                                    alt={item.name}
                                />
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>{item.name}</Typography>
                                    <Button
                                        component={Link}
                                        to={favorites.lovedTemplates.includes(item) ? `/template/${item.id}` : `/modern-cv/${item.id}`}
                                        state={{ template: item }}
                                        variant="contained"
                                        color="primary"
                                        fullWidth
                                        sx={{ mb: 2 }}
                                    >
                                        Xem Chi Tiết
                                    </Button>
                                    <IconButton
                                        onClick={() => handleToggleFavorite(item.id, favorites.lovedModernTemplates.includes(item))}
                                        sx={{ ml: 1 }}
                                    >
                                        <FavoriteIcon color="error" />
                                    </IconButton>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))
                )}
            </Grid>

            <Snackbar
                open={openSnackbar}
                autoHideDuration={3000}
                onClose={() => setOpenSnackbar(false)}
                message="Đã bỏ yêu thích mẫu"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            />
        </Container>
    );
}

export default LoveTemplate;