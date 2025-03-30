import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getTemplatesActive } from '../../apis/template';
import { Container, Grid, Card, CardContent, CardMedia, Typography, Button, CircularProgress, Alert, IconButton } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

function ListTemplate() {
    const [templates, setTemplates] = useState([]); // Khởi tạo mặc định là mảng rỗng
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [favorites, setFavorites] = useState(new Set());

    useEffect(() => {
        const fetchTemplates = async () => {
            try {
                const data = await getTemplatesActive();
                console.log('Templates:', data); // Kiểm tra dữ liệu nhận được
                // Đảm bảo data là mảng, nếu không thì gán mảng rỗng
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
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:8080/api/users/profile/me/love-template/${templateId}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
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
                {(Array.isArray(templates) ? templates : []).map((item) => ( // Thêm kiểm tra ở đây
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
        </Container>
    );
}

async function fetchUserFavorites() {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:8080/api/users/profile/me', {
            headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!response.ok) throw new Error('Failed to fetch user favorites');
        const user = await response.json();
        console.log('User favorites:', user.lovedTemplates); // Log để kiểm tra
        return Array.isArray(user.lovedTemplates) ? user.lovedTemplates : [];
    } catch (error) {
        console.error('Error fetching favorites:', error);
        return [];
    }
}

export default ListTemplate;