import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Container, Card, CardContent, Typography, Button, Box, CircularProgress } from '@mui/material';
import { getTemplateById } from '../../apis/template'; // Import API call

function TemplateDetail() {
    const { templateId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    const [template, setTemplate] = useState(location.state?.template || null);
    const [loading, setLoading] = useState(!template);
    const [error, setError] = useState(null);

    // Nếu không có template từ location.state, gọi API lấy dữ liệu theo ID
    useEffect(() => {
        if (!template) {
            getTemplateById(templateId)
                .then((data) => {
                    setTemplate(data);
                    setLoading(false);
                })
                .catch((err) => {
                    console.error('Lỗi khi tải template:', err);
                    setError('Không thể tải dữ liệu mẫu đơn.');
                    setLoading(false);
                });
        }
    }, [template, templateId]);

    const handleEdit = () => {
        navigate('/editor', { state: { template: template } });
    };

    return (
        <Container maxWidth="md">
            <Card sx={{ mt: 4, p: 3 }}>
                <CardContent>
                    {loading ? (
                        <CircularProgress />
                    ) : error ? (
                        <Typography color="error">{error}</Typography>
                    ) : (
                        <>
                            <Typography variant="h4" component="div" gutterBottom>
                                {template.name}
                            </Typography>
                            <Box sx={{ border: '1px solid #ddd', p: 2, mt: 2, borderRadius: '5px', backgroundColor: '#f9f9f9' }}>
                                <div dangerouslySetInnerHTML={{ __html: template.content }}></div>
                            </Box>
                            <Button variant="contained" color="primary" sx={{ mt: 3 }} onClick={handleEdit}>
                                Chỉnh sửa
                            </Button>
                        </>
                    )}
                </CardContent>
            </Card>
        </Container>
    );
}

export default TemplateDetail;
