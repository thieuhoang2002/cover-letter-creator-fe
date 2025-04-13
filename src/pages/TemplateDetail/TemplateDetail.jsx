import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import {
    Container, Card, CardContent, CardMedia, Typography, Button, Box,
    CircularProgress, Alert, Paper, Divider, Grid, Tooltip
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { getTemplateById } from '../../apis/template';

function TemplateDetail() {
    const { templateId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    const [template, setTemplate] = useState(location.state?.template || null);
    const [loading, setLoading] = useState(!template);
    const [error, setError] = useState(null);

    // Lấy dữ liệu template nếu không có trong location.state
    useEffect(() => {
        if (!template) {
            const fetchTemplate = async () => {
                try {
                    setLoading(true);
                    const data = await getTemplateById(templateId);
                    setTemplate(data);
                } catch (err) {
                    console.error('Lỗi khi tải template:', err);
                    setError('Không thể tải dữ liệu mẫu đơn. Vui lòng thử lại sau.');
                } finally {
                    setLoading(false);
                }
            };
            fetchTemplate();
        }
    }, [template, templateId]);

    const handleEdit = () => {
        navigate('/editor', { state: { template } });
    };

    const handleBack = () => {
        navigate('/template/all');
    };

    if (loading) {
        return (
            <Container sx={{ textAlign: 'center', mt: 8 }}>
                <CircularProgress size={50} />
                <Typography variant="body1" sx={{ mt: 2 }}>Đang tải dữ liệu...</Typography>
            </Container>
        );
    }

    if (error) {
        return (
            <Container sx={{ textAlign: 'center', mt: 8 }}>
                <Alert severity="error" sx={{ maxWidth: '500px', mx: 'auto' }}>
                    {error}
                </Alert>
                <Button variant="outlined" color="primary" onClick={handleBack} sx={{ mt: 2 }}>
                    Quay lại danh sách
                </Button>
            </Container>
        );
    }

    return (
        <Container maxWidth="md" sx={{ mt: 6, padding: '20px' }}>
            <Paper elevation={3} sx={{ p: 3, borderRadius: '8px' }}>
                {/* Header */}
                <Grid container alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
                    <Grid item>
                        <Typography variant="h4" component="div">
                            {template.name}
                        </Typography>
                        <Typography variant="subtitle2" color="text.secondary">
                            Loại: {template.type || 'Không xác định'}
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Tooltip title="Quay lại danh sách">
                            <Button
                                variant="outlined"
                                color="secondary"
                                startIcon={<ArrowBackIcon />}
                                onClick={handleBack}
                            >
                                Quay lại
                            </Button>
                        </Tooltip>
                    </Grid>
                </Grid>

                <Divider sx={{ mb: 3 }} />

                {/* Nội dung chi tiết */}
                <Grid container spacing={3}>
                    {/* Hình ảnh (nếu có) */}
                    {/* {template.image && (
                        <Grid item xs={12} md={4}>
                            <CardMedia
                                component="img"
                                image={template.image}
                                alt={template.name}
                                sx={{ borderRadius: '8px', maxHeight: '200px', objectFit: 'cover' }}
                            />
                        </Grid>
                    )} */}

                    {/* Thông tin bổ sung */}
                    {/* <Grid item xs={12} md={template.image ? 8 : 12}> */}
                    <Grid item xs={12} md={12}>

                        {/* Nội dung template */}
                        <Box
                            sx={{
                                border: '1px solid #ddd',
                                p: 2,
                                borderRadius: '5px',
                                backgroundColor: '#f9f9f9',
                                maxHeight: '300px',
                                overflowY: 'auto',
                            }}
                        >
                            <div dangerouslySetInnerHTML={{ __html: template.content }} />
                        </Box>
                    </Grid>
                </Grid>

                {/* Nút hành động */}
                <Box sx={{ mt: 3, textAlign: 'right' }}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleEdit}
                        size="large"
                    >
                        Chỉnh sửa Template
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
}

export default TemplateDetail;