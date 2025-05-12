import React, { useState, useEffect } from 'react';
import { getCurrentUser } from '../../apis/profile';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Typography,
    TextField,
    Select,
    MenuItem,
    Button,
    FormControl,
    InputLabel,
    Box
} from '@mui/material';

const CvByAI = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const [formData, setFormData] = useState({
        position: '',
        theme: 'light',
        response_format: 'html',
        placeholders: ['[Your Name]', '[Your Email]'],
    });
    const [loading, setLoading] = useState(false);
    const [loadingSeconds, setLoadingSeconds] = useState(0);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const user = await getCurrentUser();
                setUserData(user);
            } catch (err) {
                setError('Failed to fetch user data');
            }
        };
        fetchUserData();
    }, []);

    useEffect(() => {
        let interval;
        if (loading) {
            setLoadingSeconds(0); // Reset giây khi bắt đầu loading
            interval = setInterval(() => {
                setLoadingSeconds((prev) => prev + 1);
            }, 1000);
        } else {
            clearInterval(interval);
        }
        return () => clearInterval(interval); // Dọn dẹp interval khi component unmount hoặc loading thay đổi
    }, [loading]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            // const response = await axios.post('http://localhost:8080/api/ai/generate-cv', {
            //     userData,
            //     ...formData,
            // });

            //deploy
            const getAuthHeader = () => {
                const token = localStorage.getItem('token');
                return token ? { Authorization: `Bearer ${token}` } : {};
            };
            const urlBE = import.meta.env.VITE_BACKEND_URL;
            const response = await axios.post(
                `${urlBE}/api/ai/generate-cv`,
                {
                    userData,
                    ...formData,
                },
                {
                    headers: getAuthHeader(), // Thêm header vào đây
                }
            );

            const cvHtml = response.data.content;
            navigate('/cv-editor-ai', {
                state: {
                    template: {
                        name: `AI-Generated CV for ${formData.position}`,
                        type: 'AI-Generated',
                        content: cvHtml,
                    },
                },
            });
        } catch (err) {
            setError('Failed to generate CV');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="sm" sx={{ py: 4, mt: 6 }}>
            <Typography variant="h4" gutterBottom>
                TẠO CV VỚI AI THẦN KỲ
            </Typography>

            {error && (
                <Typography color="error" variant="body2" sx={{ mb: 2 }}>
                    {error}
                </Typography>
            )}

            <form onSubmit={handleSubmit}>
                <TextField
                    fullWidth
                    label="Vị trí ứng tuyển"
                    name="position"
                    value={formData.position}
                    onChange={handleInputChange}
                    required
                    margin="normal"
                />

                <FormControl fullWidth margin="normal">
                    <InputLabel id="theme-label">Chủ đề màu sắc</InputLabel>
                    <Select
                        labelId="theme-label"
                        id="theme"
                        name="theme"
                        value={formData.theme}
                        onChange={handleInputChange}
                        label="Chủ đề màu sắc"
                    >
                        <MenuItem value="light">Light</MenuItem>
                        <MenuItem value="dark">Dark</MenuItem>
                        <MenuItem value="blue">Blue</MenuItem>
                    </Select>
                </FormControl>

                <Box mt={3}>
                    <Button
                        variant="contained"
                        color="primary"
                        type="submit"
                        fullWidth
                        disabled={loading}
                    >
                        {loading ? `Đang tạo CV... (${loadingSeconds}s)` : 'Tạo CV'}
                    </Button>
                </Box>
            </form>
        </Container>
    );
};

export default CvByAI;