import React, { useState, useEffect } from 'react';
import { getCurrentUser } from '../../apis/profile';
import axios from 'axios';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
    Container,
    Typography,
    TextField,
    Button,
    Box,
    Card,
    Grid,
    Chip,
    Alert,
    LinearProgress,
    Stack,
    Paper,
    Divider,
    IconButton,
    Tooltip,
    useTheme,
    alpha
} from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import PaletteIcon from '@mui/icons-material/Palette';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined';
import EditNoteIcon from '@mui/icons-material/EditNote';

const POPULAR_ROLES = [
    { label: 'Kỹ sư Phần mềm (Fullstack)', category: 'IT' },
    { label: 'Frontend Developer (React)', category: 'IT' },
    { label: 'Chuyên viên Marketing & SEO', category: 'Kinh doanh' },
    { label: 'Nhân viên Kinh doanh (Sales)', category: 'Kinh doanh' },
    { label: 'Kế toán viên Tổng hợp', category: 'Tài chính' },
    { label: 'Chuyên viên Hành chính Nhà nước', category: 'Hành chính' },
    { label: 'Thiết kế Đồ họa (UI/UX)', category: 'Sáng tạo' },
    { label: 'Quản lý Dự án (Project Manager)', category: 'Quản lý' },
];

const THEME_OPTIONS = [
    {
        id: 'light',
        title: 'Sáng Tối Giản',
        subtitle: 'Thanh lịch, chuẩn ATS quốc tế',
        previewColors: ['#f8fafc', '#1e293b', '#2563eb'],
        badge: 'Khuyên Dùng'
    },
    {
        id: 'blue',
        title: 'Xanh Doanh Nghiệp',
        subtitle: 'Chuyên nghiệp, tin cậy, vững chắc',
        previewColors: ['#0f172a', '#1e40af', '#60a5fa'],
        badge: 'Phổ Biến'
    },
    {
        id: 'dark',
        title: 'Tối Đẳng Cấp',
        subtitle: 'Hiện đại, nổi bật cho ngành công nghệ',
        previewColors: ['#09090b', '#27272a', '#38bdf8'],
        badge: 'Tech & Modern'
    },
    {
        id: 'emerald',
        title: 'Xanh Ngọc Tinh Tế',
        subtitle: 'Sáng tạo, gần gũi, tươi mới',
        previewColors: ['#064e3b', '#059669', '#34d399'],
        badge: 'Creative'
    }
];

const LOADING_TIPS = [
    'Đang phân tích thông tin kinh nghiệm & học vấn từ hồ sơ của bạn...',
    'Đang đối chuẩn bộ lọc ATS và tối ưu hóa từ khóa chuyên ngành...',
    'Đang canh chỉnh bố cục chuẩn khổ giấy A4, ngăn ngừa tràn trang...',
    'Đang tạo mã giao diện và chuẩn bị đưa bạn vào trình soạn thảo trực quan...'
];

const CvByAI = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    const [userData, setUserData] = useState(null);
    const [formData, setFormData] = useState({
        position: '',
        theme: 'light',
        response_format: 'html',
        placeholders: ['[Your Name]', '[Your Email]'],
    });
    const [loading, setLoading] = useState(false);
    const [loadingSeconds, setLoadingSeconds] = useState(0);
    const [tipIndex, setTipIndex] = useState(0);
    const [error, setError] = useState('');
    const [queueStatus, setQueueStatus] = useState(null);


    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const user = await getCurrentUser();
                setUserData(user);
            } catch (err) {
                console.warn('Không thể tải thông tin user, tiếp tục chế độ tiêu chuẩn.');
            }
        };
        fetchUserData();
    }, []);

    useEffect(() => {
        let interval;
        let tipInterval;
        let queueInterval;
        if (loading) {
            setLoadingSeconds(0);
            setTipIndex(0);
            interval = setInterval(() => {
                setLoadingSeconds((prev) => prev + 1);
            }, 1000);
            tipInterval = setInterval(() => {
                setTipIndex((prev) => (prev + 1) % LOADING_TIPS.length);
            }, 2500);
            // Poll queue status every 5 seconds
            const pollQueue = async () => {
                try {
                    const urlBE = (import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080').replace(/\/+$/, '');
                    const res = await fetch(`${urlBE}/api/ai/queue-status`, {
                        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                    });
                    if (res.ok) setQueueStatus(await res.json());
                } catch { /* ignore */ }
            };
            pollQueue();
            queueInterval = setInterval(pollQueue, 5000);
        } else {
            setQueueStatus(null);
        }
        return () => {
            clearInterval(interval);
            clearInterval(tipInterval);
            clearInterval(queueInterval);
        };
    }, [loading]);


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSelectRole = (roleTitle) => {
        setFormData((prev) => ({ ...prev, position: roleTitle }));
    };

    const handleSelectTheme = (themeId) => {
        setFormData((prev) => ({ ...prev, theme: themeId }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.position.trim()) {
            setError('Vui lòng nhập hoặc chọn vị trí ứng tuyển mong muốn.');
            return;
        }

        setLoading(true);
        setError('');
        try {
            const getAuthHeader = () => {
                const token = localStorage.getItem('token');
                return token ? { Authorization: `Bearer ${token}` } : {};
            };
            const urlBE = (import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080').replace(/\/+$/, '');
            const response = await axios.post(
                `${urlBE}/api/ai/generate-cv`,
                {
                    userData,
                    ...formData,
                },
                {
                    headers: getAuthHeader(),
                }
            );

            const cvHtml = response.data?.content || '';
            if (!cvHtml) {
                throw new Error('Dữ liệu trả về rỗng từ AI');
            }

            navigate('/cv-editor-ai', {
                state: {
                    template: {
                        name: `AI-Generated CV - ${formData.position}`,
                        type: 'AI-Generated',
                        content: cvHtml,
                    },
                },
            });
        } catch (err) {
            console.error('Lỗi khi tạo CV:', err);
            const msg = err.response?.data?.message || err.message || 'Không thể tạo CV bằng AI vào lúc này. Vui lòng kiểm tra lại kết nối hoặc thử lại sau ít phút!';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ minHeight: '85vh', py: { xs: 4, md: 6 }, bgcolor: isDark ? 'background.default' : '#f8fafc' }}>
            <Container maxWidth="md">
                {/* Top Navigation / Breadcrumb */}
                <Box sx={{ mb: 3 }}>
                    <Button
                        component={RouterLink}
                        to="/"
                        startIcon={<ArrowBackIcon />}
                        sx={{ color: 'text.secondary', textTransform: 'none', fontWeight: 600 }}
                    >
                        Quay về Trang chủ
                    </Button>
                </Box>

                {/* Main Card */}
                <Card
                    elevation={0}
                    sx={{
                        p: { xs: 3, sm: 4, md: 5 },
                        borderRadius: 4,
                        border: '1px solid',
                        borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
                        background: isDark
                            ? 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)'
                            : '#ffffff',
                        boxShadow: isDark
                            ? '0 20px 40px -15px rgba(0,0,0,0.5)'
                            : '0 20px 40px -15px rgba(15, 23, 42, 0.08)',
                        position: 'relative',
                        overflow: 'hidden'
                    }}
                >
                    {/* Header Banner */}
                    <Box sx={{ textAlign: 'center', mb: 4 }}>
                        <Box
                            sx={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 1,
                                px: 2,
                                py: 0.75,
                                borderRadius: 50,
                                bgcolor: alpha(theme.palette.primary.main, 0.1),
                                color: theme.palette.primary.main,
                                fontWeight: 700,
                                fontSize: '0.875rem',
                                mb: 2
                            }}
                        >
                            <AutoAwesomeIcon sx={{ fontSize: 18 }} />
                            COVER LETTER CREATOR AI STUDIO v2.0
                        </Box>
                        <Typography
                            variant="h3"
                            component="h1"
                            sx={{
                                fontWeight: 800,
                                fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.5rem' },
                                background: isDark
                                    ? 'linear-gradient(135deg, #ffffff 0%, #94a3b8 100%)'
                                    : 'linear-gradient(135deg, #0f172a 0%, #2563eb 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                mb: 1.5,
                                letterSpacing: '-0.5px'
                            }}
                        >
                            Tạo CV Với AI Thần Kỳ
                        </Typography>
                        <Typography
                            variant="body1"
                            sx={{
                                color: 'text.secondary',
                                maxWidth: 650,
                                mx: 'auto',
                                fontSize: { xs: '0.95rem', md: '1.05rem' },
                                lineHeight: 1.6
                            }}
                        >
                            Công nghệ AI kết hợp dữ liệu hồ sơ cá nhân của bạn để tạo ra mẫu CV 1 trang A4 hoàn mỹ,
                            chuẩn hóa ATS và tương thích cao nhất với nhà tuyển dụng.
                        </Typography>
                    </Box>

                    {/* User Profile Sync Status Banner */}
                    {userData && (
                        <Paper
                            elevation={0}
                            sx={{
                                p: 2,
                                mb: 4,
                                borderRadius: 3,
                                bgcolor: isDark ? alpha(theme.palette.success.main, 0.1) : '#f0fdf4',
                                border: '1px solid',
                                borderColor: isDark ? alpha(theme.palette.success.main, 0.3) : '#bbf7d0',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                flexWrap: 'wrap',
                                gap: 1.5
                            }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <CheckCircleIcon color="success" />
                                <Box>
                                    <Typography variant="body2" sx={{ fontWeight: 700, color: isDark ? '#4ade80' : '#15803d' }}>
                                        Đã đồng bộ hồ sơ: {userData.fullName || userData.email || 'Người dùng'}
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                        AI sẽ tự động đọc kỹ năng & kinh nghiệm của bạn để cá nhân hóa CV tốt nhất.
                                    </Typography>
                                </Box>
                            </Box>
                            <Button
                                component={RouterLink}
                                to="/profile"
                                size="small"
                                startIcon={<EditNoteIcon />}
                                sx={{ textTransform: 'none', fontWeight: 600, fontSize: '0.8rem' }}
                            >
                                Sửa hồ sơ
                            </Button>
                        </Paper>
                    )}

                    {error && (
                        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }} onClose={() => setError('')}>
                            {error}
                        </Alert>
                    )}

                    {/* Form Section */}
                    <form onSubmit={handleSubmit}>
                        {/* 1. Job Role Input */}
                        <Box sx={{ mb: 3.5 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                <WorkOutlineIcon sx={{ color: theme.palette.primary.main, fontSize: 20 }} />
                                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                                    1. Vị trí công việc ứng tuyển <span style={{ color: '#ef4444' }}>*</span>
                                </Typography>
                            </Box>

                            <TextField
                                fullWidth
                                placeholder="VD: Kỹ sư Phần mềm Fullstack, Trưởng phòng Marketing, Kế toán..."
                                name="position"
                                value={formData.position}
                                onChange={handleInputChange}
                                required
                                disabled={loading}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 3,
                                        bgcolor: isDark ? 'rgba(0,0,0,0.2)' : '#ffffff',
                                        fontSize: '1rem',
                                    }
                                }}
                            />

                            {/* Quick Select Chips */}
                            <Box sx={{ mt: 1.5 }}>
                                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.75, fontWeight: 600 }}>
                                    Gợi ý vị trí phổ biến (nhấp để chọn nhanh):
                                </Typography>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
                                    {POPULAR_ROLES.map((role) => (
                                        <Chip
                                            key={role.label}
                                            label={role.label}
                                            size="small"
                                            clickable={!loading}
                                            onClick={() => handleSelectRole(role.label)}
                                            variant={formData.position === role.label ? 'filled' : 'outlined'}
                                            color={formData.position === role.label ? 'primary' : 'default'}
                                            sx={{
                                                borderRadius: 2,
                                                fontWeight: 500,
                                                fontSize: '0.78rem',
                                                transition: 'all 0.15s ease',
                                                '&:hover': {
                                                    transform: 'translateY(-1px)',
                                                }
                                            }}
                                        />
                                    ))}
                                </Box>
                            </Box>
                        </Box>

                        <Divider sx={{ my: 3.5, opacity: 0.6 }} />

                        {/* 2. Theme Selection */}
                        <Box sx={{ mb: 4 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                                <PaletteIcon sx={{ color: theme.palette.primary.main, fontSize: 20 }} />
                                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                                    2. Chọn phong cách & bảng màu giao diện
                                </Typography>
                            </Box>

                            <Grid container spacing={2}>
                                {THEME_OPTIONS.map((item) => {
                                    const isSelected = formData.theme === item.id;
                                    return (
                                        <Grid item xs={12} sm={6} key={item.id}>
                                            <Paper
                                                elevation={0}
                                                onClick={() => !loading && handleSelectTheme(item.id)}
                                                sx={{
                                                    p: 2,
                                                    borderRadius: 3,
                                                    cursor: loading ? 'default' : 'pointer',
                                                    border: '2px solid',
                                                    borderColor: isSelected
                                                        ? theme.palette.primary.main
                                                        : isDark ? 'rgba(255,255,255,0.08)' : '#e2e8f0',
                                                    bgcolor: isSelected
                                                        ? alpha(theme.palette.primary.main, isDark ? 0.15 : 0.05)
                                                        : isDark ? 'rgba(0,0,0,0.15)' : '#ffffff',
                                                    transition: 'all 0.2s ease',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    gap: 1.5,
                                                    position: 'relative',
                                                    '&:hover': {
                                                        borderColor: theme.palette.primary.main,
                                                        transform: 'translateY(-2px)'
                                                    }
                                                }}
                                            >
                                                {/* Header & Badge */}
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                                                        {item.title}
                                                    </Typography>
                                                    <Chip
                                                        label={item.badge}
                                                        size="small"
                                                        sx={{
                                                            height: 20,
                                                            fontSize: '0.65rem',
                                                            fontWeight: 700,
                                                            bgcolor: isSelected ? theme.palette.primary.main : 'action.selected',
                                                            color: isSelected ? '#ffffff' : 'text.secondary'
                                                        }}
                                                    />
                                                </Box>

                                                {/* Color Preview Swatches */}
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    {item.previewColors.map((color, idx) => (
                                                        <Box
                                                            key={idx}
                                                            sx={{
                                                                width: 24,
                                                                height: 24,
                                                                borderRadius: '50%',
                                                                bgcolor: color,
                                                                border: '2px solid #ffffff',
                                                                boxShadow: '0 2px 4px rgba(0,0,0,0.15)'
                                                            }}
                                                        />
                                                    ))}
                                                    <Typography variant="caption" sx={{ color: 'text.secondary', ml: 1, fontSize: '0.75rem' }}>
                                                        {item.subtitle}
                                                    </Typography>
                                                </Box>
                                            </Paper>
                                        </Grid>
                                    );
                                })}
                            </Grid>
                        </Box>

                        {/* Loading State Display */}
                        {loading && (
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 3,
                                    mb: 3,
                                    borderRadius: 3,
                                    border: '1px solid',
                                    borderColor: alpha(theme.palette.primary.main, 0.3),
                                    bgcolor: alpha(theme.palette.primary.main, 0.04),
                                    textAlign: 'center'
                                }}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1.5, mb: 1.5 }}>
                                    <AutoAwesomeIcon
                                        sx={{
                                            color: theme.palette.primary.main,
                                            animation: 'spin 3s linear infinite',
                                            '@keyframes spin': {
                                                '0%': { transform: 'rotate(0deg) scale(1)' },
                                                '50%': { transform: 'rotate(180deg) scale(1.2)' },
                                                '100%': { transform: 'rotate(360deg) scale(1)' },
                                            }
                                        }}
                                    />
                                    <Typography variant="h6" sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
                                        AI Đang Thiết Kế CV Của Bạn... ({loadingSeconds}s)
                                    </Typography>
                                </Box>

                                {/* Queue status info */}
                                {queueStatus && queueStatus.waiting > 0 && (
                                    <Box sx={{ mb: 1.5, p: 1.5, borderRadius: 2, bgcolor: alpha('#f59e0b', 0.1), border: '1px solid', borderColor: alpha('#f59e0b', 0.3) }}>
                                        <Typography variant="body2" sx={{ color: '#d97706', fontWeight: 600 }}>
                                            ⏳ Hàng đợi AI: {queueStatus.waiting} yêu cầu đang chờ · Ước tính ~{Math.max(15, queueStatus.waiting * 15)}-{Math.max(30, queueStatus.waiting * 30)}s
                                        </Typography>
                                    </Box>
                                )}
                                {queueStatus && queueStatus.waiting === 0 && (
                                    <Box sx={{ mb: 1.5 }}>
                                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                            ✅ Đang xử lý ngay · Không có ai trong hàng đợi
                                        </Typography>
                                    </Box>
                                )}

                                <LinearProgress
                                    sx={{
                                        height: 8,
                                        borderRadius: 4,
                                        mb: 2,
                                        bgcolor: alpha(theme.palette.primary.main, 0.15),
                                        '& .MuiLinearProgress-bar': {
                                            borderRadius: 4,
                                            background: 'linear-gradient(90deg, #2563eb, #9333ea)',
                                        }
                                    }}
                                />

                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                                    <LightbulbOutlinedIcon sx={{ fontSize: 18, color: '#f59e0b' }} />
                                    <Typography variant="body2" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
                                        {LOADING_TIPS[tipIndex]}
                                    </Typography>
                                </Box>
                            </Paper>
                        )}


                        {/* Submit Action Button */}
                        <Button
                            variant="contained"
                            type="submit"
                            fullWidth
                            size="large"
                            disabled={loading}
                            startIcon={!loading && <AutoAwesomeIcon />}
                            sx={{
                                py: 1.75,
                                borderRadius: 3,
                                fontSize: '1.05rem',
                                fontWeight: 700,
                                textTransform: 'none',
                                background: loading
                                    ? undefined
                                    : 'linear-gradient(135deg, #1d4ed8 0%, #7c3aed 100%)',
                                boxShadow: '0 8px 25px -5px rgba(37, 99, 235, 0.5)',
                                transition: 'all 0.2s ease',
                                '&:hover': {
                                    boxShadow: '0 12px 30px -5px rgba(37, 99, 235, 0.7)',
                                    transform: 'translateY(-2px)'
                                }
                            }}
                        >
                            {loading ? `Đang Xử Lý Bằng AI (${loadingSeconds}s)...` : 'Tạo CV Với AI Thần Kỳ Ngay'}
                        </Button>
                    </form>

                    {/* Footer Tips */}
                    <Box sx={{ mt: 4, pt: 3, borderTop: '1px dashed', borderColor: 'divider', textAlign: 'center' }}>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            💡 <strong>Mẹo hay:</strong> Sau khi AI tạo xong, bạn có thể tự do chỉnh sửa văn bản, thay đổi font chữ, thêm ảnh thẻ và xuất file PDF chất lượng cao tại trình chỉnh sửa trực quan.
                        </Typography>
                    </Box>
                </Card>
            </Container>
        </Box>
    );
};

export default CvByAI;