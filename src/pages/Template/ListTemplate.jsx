import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllTemplates } from '../../apis/template';
import { Container, Grid, Card, CardContent, CardMedia, Typography, Button, CircularProgress, Alert } from '@mui/material';

function ListTemplate() {
    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTemplates = async () => {
            try {
                const data = await getAllTemplates();
                setTemplates(data);
                setLoading(false);
            } catch (err) {
                setError('Không thể tải danh sách template');
                setLoading(false);
            }
        };

        fetchTemplates();
    }, []);

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
                {templates.map((item) => (
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
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
}

export default ListTemplate;
