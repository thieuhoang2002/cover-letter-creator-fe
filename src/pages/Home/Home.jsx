import React, { useState } from 'react';
import {
    Container,
    Typography,
    Button,
    Box,
    Grid,
    Card,
    CardContent,
    Paper,
    Chip,
    Tab,
    Tabs,
    useTheme
} from '@mui/material';
import { Link } from 'react-router-dom';
import {
    AutoAwesome as SparklesIcon,
    ArrowForward as ArrowForwardIcon,
    CloudDownload as CloudDownloadIcon,
    CheckCircle as CheckCircleIcon,
    AccountBalance as GovernmentIcon,
    WorkOutline as BusinessIcon,
    Star as StarIcon
} from '@mui/icons-material';
import { useThemeMode } from '../../context/ThemeContext';
import { useAuth } from '../Auth/AuthContext';
import { getTemplatesActive } from '../../apis/template';
import { getActiveModernTemplates } from '../../apis/templateModernCV';

const fallbackSampleTemplates = [
    {
        id: 13,
        title: 'Đơn Đăng Ký Dự Tuyển Viên Chức Nhà Nước (Nghị định 115/2020)',
        category: 'state',
        badge: 'Nhà Nước',
        badgeColor: 'primary',
        description: 'Bố cục trang trọng, đúng quy thức văn bản hành chính Việt Nam, quốc hiệu tiêu ngữ chuẩn mực.',
        link: '/template/13'
    },
    {
        id: 13,
        title: 'Sơ Yếu Lý Lịch Chuẩn Cán Bộ - Công Chức - Viên Chức (Mẫu 2C-BNV)',
        category: 'state',
        badge: 'Nhà Nước',
        badgeColor: 'primary',
        description: 'Định dạng sơ yếu lý lịch cán bộ, trình bày quá trình công tác, đảng viên và thành tích khen thưởng.',
        link: '/modern-cv/13'
    },
    {
        id: 14,
        title: 'Đơn Xin Chuyển Công Tác Cơ Quan Hành Chính Nhà Nước',
        category: 'state',
        badge: 'Nhà Nước',
        badgeColor: 'primary',
        description: 'Văn bản chuyển công tác chuẩn mực dành cho cán bộ, công chức, viên chức chuyển đổi đơn vị.',
        link: '/template/14'
    },
    {
        id: 15,
        title: 'CV Hiện Đại - Kỹ Sư Công Nghệ Thông Tin (Tech Minimalist)',
        category: 'modern',
        badge: 'Công Nghệ',
        badgeColor: 'secondary',
        description: 'Bố cục 2 cột hiện đại, tối ưu cho lập trình viên với khu vực kỹ năng lập trình và dự án nổi bật.',
        link: '/modern-cv/15'
    },
    {
        id: 16,
        title: 'CV Hiện Đại - Quản Lý & Kinh Doanh (Corporate Navy)',
        category: 'modern',
        badge: 'Kinh Doanh',
        badgeColor: 'secondary',
        description: 'Thiết kế màu xanh Navy lịch lãm, làm nổi bật chỉ số KPI, doanh số và kỹ năng đàm phán.',
        link: '/modern-cv/16'
    },
    {
        id: 17,
        title: 'CV Hiện Đại - Thiết Kế & Sáng Tạo (Creative Emerald)',
        category: 'modern',
        badge: 'Sáng Tạo',
        badgeColor: 'secondary',
        description: 'Gam màu Emerald nổi bật, bố trí portfolio trực quan, thể hiện gu thẩm mỹ và tư duy thiết kế.',
        link: '/modern-cv/17'
    }
];

function Home() {
    const { mode } = useThemeMode();
    const { isAuthenticated } = useAuth();
    const theme = useTheme();
    const isDark = mode === 'dark';
    const [activeTab, setActiveTab] = useState('all');
    const [showcaseTemplates, setShowcaseTemplates] = useState(fallbackSampleTemplates);

    useEffect(() => {
        let isMounted = true;
        const fetchTemplates = async () => {
            try {
                const [coverRes, modernRes] = await Promise.allSettled([
                    getTemplatesActive(),
                    getActiveModernTemplates()
                ]);

                const stateList = (coverRes.status === 'fulfilled' && Array.isArray(coverRes.value))
                    ? coverRes.value
                    : [];
                const modernList = (modernRes.status === 'fulfilled' && Array.isArray(modernRes.value))
                    ? modernRes.value
                    : [];

                if (stateList.length > 0 || modernList.length > 0) {
                    const mappedState = stateList.slice(0, 3).map((item) => ({
                        id: item.id,
                        title: item.name,
                        category: 'state',
                        badge: item.type || 'Nhà Nước',
                        badgeColor: 'primary',
                        description: item.description || 'Bố cục trang trọng, đúng quy thức văn bản hành chính Việt Nam, quốc hiệu tiêu ngữ chuẩn mực.',
                        link: `/template/${item.id}`,
                        rawData: item
                    }));

                    const mappedModern = modernList.slice(0, 3).map((item) => ({
                        id: item.id,
                        title: item.name,
                        category: 'modern',
                        badge: item.type || 'Hiện Đại',
                        badgeColor: 'secondary',
                        description: item.description || 'Bố cục 2 cột hiện đại, tối ưu cho nhà tuyển dụng và chuẩn ATS với phong cách chuyên nghiệp.',
                        link: `/modern-cv/${item.id}`,
                        rawData: item
                    }));

                    if (isMounted) {
                        setShowcaseTemplates([...mappedState, ...mappedModern]);
                    }
                }
            } catch (err) {
                console.warn('Lỗi khi tải mẫu nổi bật từ API, dùng danh sách dự phòng:', err);
            }
        };

        fetchTemplates();
        return () => { isMounted = false; };
    }, []);

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    const filteredTemplates = showcaseTemplates.filter((tpl) => {
        if (activeTab === 'all') return true;
        return tpl.category === activeTab;
    });

    return (
        <Box sx={{ minHeight: '100vh', backgroundColor: theme.palette.background.default }}>
            {/* 1. HERO SECTION */}
            <Box
                sx={{
                    position: 'relative',
                    overflow: 'hidden',
                    pt: { xs: 6, md: 12 },
                    pb: { xs: 8, md: 14 },
                    background: isDark
                        ? 'radial-gradient(ellipse at 50% -20%, rgba(59, 130, 246, 0.25) 0%, rgba(9, 13, 22, 0) 70%)'
                        : 'radial-gradient(ellipse at 50% -20%, rgba(37, 99, 235, 0.12) 0%, rgba(248, 250, 252, 0) 70%)'
                }}
            >
                <Container maxWidth="lg">
                    <Box sx={{ textAlign: 'center', maxWidth: 840, mx: 'auto' }}>
                        {/* Version Badge */}
                        <Box
                            sx={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 1,
                                px: 2,
                                py: 0.8,
                                borderRadius: '9999px',
                                mb: 3,
                                backgroundColor: isDark ? 'rgba(59, 130, 246, 0.15)' : 'rgba(37, 99, 235, 0.08)',
                                border: isDark ? '1px solid rgba(59, 130, 246, 0.3)' : '1px solid rgba(37, 99, 235, 0.2)',
                                color: isDark ? '#93c5fd' : '#1d4ed8'
                            }}
                        >
                            <SparklesIcon sx={{ fontSize: 18, color: '#ec4899' }} />
                            <Typography variant="body2" sx={{ fontWeight: 700, fontSize: '0.85rem' }}>
                                🎓 Phiên bản 2.0 • Nâng cấp từ Đồ án Môn học 2025 • Tích hợp Groq AI
                            </Typography>
                        </Box>

                        {/* Main Title */}
                        <Typography
                            variant="h1"
                            sx={{
                                fontSize: { xs: '2.4rem', sm: '3.2rem', md: '4rem' },
                                fontWeight: 900,
                                lineHeight: 1.15,
                                mb: 2.5,
                                color: isDark ? '#f8fafc' : '#0f172a'
                            }}
                        >
                            Tạo CV & Đơn Xin Việc Đỉnh Cao với{' '}
                            <Box
                                component="span"
                                sx={{
                                    background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 50%, #ec4899 100%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent'
                                }}
                            >
                                Trí Tuệ Nhân Tạo
                            </Box>
                        </Typography>

                        {/* Subtitle */}
                        <Typography
                            variant="h6"
                            sx={{
                                fontSize: { xs: '1rem', sm: '1.15rem' },
                                color: isDark ? '#94a3b8' : '#64748b',
                                fontWeight: 400,
                                lineHeight: 1.6,
                                mb: 4.5,
                                px: { xs: 2, md: 4 }
                            }}
                        >
                            Giải pháp toàn diện giúp bạn biến kinh nghiệm thô sơ thành hồ sơ xin việc chuyên nghiệp chỉ sau vài giây. Hỗ trợ chuẩn xác từ <strong>Cơ Quan Nhà Nước</strong> đến <strong>Tập Đoàn Quốc Tế</strong>.
                        </Typography>

                        {/* CTA Buttons */}
                        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                            <Button
                                component={Link}
                                to="/create-cv-with-ai"
                                variant="contained"
                                size="large"
                                startIcon={<SparklesIcon />}
                                sx={{
                                    px: 3.5,
                                    py: 1.6,
                                    fontSize: '1rem',
                                    fontWeight: 700,
                                    background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
                                    color: '#ffffff',
                                    borderRadius: '12px',
                                    boxShadow: '0 8px 25px rgba(37, 99, 235, 0.35)',
                                    '&:hover': {
                                        background: 'linear-gradient(135deg, #1d4ed8 0%, #6d28d9 100%)',
                                        boxShadow: '0 12px 30px rgba(37, 99, 235, 0.45)'
                                    }
                                }}
                            >
                                Tạo CV với AI Thần Kỳ
                            </Button>

                            <Button
                                component={Link}
                                to="/template/all"
                                variant="outlined"
                                size="large"
                                endIcon={<ArrowForwardIcon />}
                                sx={{
                                    px: 3,
                                    py: 1.6,
                                    fontSize: '1rem',
                                    fontWeight: 600,
                                    borderRadius: '12px',
                                    borderColor: isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.15)',
                                    color: isDark ? '#f8fafc' : '#0f172a',
                                    '&:hover': {
                                        borderColor: '#2563eb',
                                        backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)'
                                    }
                                }}
                            >
                                Khám Phá 11 Mẫu
                            </Button>
                        </Box>

                        {/* Social Proof */}
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 4, gap: 1 }}>
                            <Box sx={{ display: 'flex', color: '#f59e0b' }}>
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <StarIcon key={star} sx={{ fontSize: 18 }} />
                                ))}
                            </Box>
                            <Typography variant="body2" sx={{ color: isDark ? '#94a3b8' : '#64748b', fontWeight: 500 }}>
                                10,000+ người tìm việc tin dùng • Xuất PDF chuẩn A4 không watermark
                            </Typography>
                        </Box>
                    </Box>
                </Container>
            </Box>

            {/* 2. STATS BAR */}
            <Container maxWidth="lg" sx={{ mb: 10 }}>
                <Paper
                    elevation={0}
                    sx={{
                        p: { xs: 3, md: 4 },
                        borderRadius: 4,
                        border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.06)',
                        backgroundColor: isDark ? '#111827' : '#ffffff',
                        boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.3)' : '0 4px 20px rgba(0,0,0,0.03)'
                    }}
                >
                    <Grid container spacing={3} textAlign="center">
                        <Grid item xs={6} md={3}>
                            <Typography variant="h3" sx={{ fontWeight: 800, color: '#2563eb', mb: 0.5 }}>
                                2.0s
                            </Typography>
                            <Typography variant="body2" sx={{ color: isDark ? '#94a3b8' : '#64748b', fontWeight: 600 }}>
                                Tốc độ AI sinh CV tức thì
                            </Typography>
                        </Grid>
                        <Grid item xs={6} md={3}>
                            <Typography variant="h3" sx={{ fontWeight: 800, color: '#7c3aed', mb: 0.5 }}>
                                11+
                            </Typography>
                            <Typography variant="body2" sx={{ color: isDark ? '#94a3b8' : '#64748b', fontWeight: 600 }}>
                                Mẫu chuẩn Nhà Nước & Hiện Đại
                            </Typography>
                        </Grid>
                        <Grid item xs={6} md={3}>
                            <Typography variant="h3" sx={{ fontWeight: 800, color: '#059669', mb: 0.5 }}>
                                100%
                            </Typography>
                            <Typography variant="body2" sx={{ color: isDark ? '#94a3b8' : '#64748b', fontWeight: 600 }}>
                                Tải PDF A4 trực tiếp miễn phí
                            </Typography>
                        </Grid>
                        <Grid item xs={6} md={3}>
                            <Typography variant="h3" sx={{ fontWeight: 800, color: '#ec4899', mb: 0.5 }}>
                                24/7
                            </Typography>
                            <Typography variant="body2" sx={{ color: isDark ? '#94a3b8' : '#64748b', fontWeight: 600 }}>
                                Lưu trữ đám mây Cloudflare R2
                            </Typography>
                        </Grid>
                    </Grid>
                </Paper>
            </Container>

            {/* 3. BENTO GRID FEATURES */}
            <Container maxWidth="lg" sx={{ mb: 12 }}>
                <Box sx={{ textAlign: 'center', mb: 6 }}>
                    <Typography variant="overline" sx={{ letterSpacing: 2, fontWeight: 700, color: '#2563eb' }}>
                        TÍNH NĂNG ĐỘT PHÁ
                    </Typography>
                    <Typography variant="h3" sx={{ fontWeight: 800, mt: 1, color: isDark ? '#f8fafc' : '#0f172a' }}>
                        Mọi Công Cụ Bạn Cần Để Có Chiếc CV Hoàn Hảo
                    </Typography>
                </Box>

                <Grid container spacing={3}>
                    {/* Card 1: AI Superpowers */}
                    <Grid item xs={12} md={7}>
                        <Card
                            sx={{
                                height: '100%',
                                p: 3,
                                background: isDark
                                    ? 'linear-gradient(135deg, rgba(37, 99, 235, 0.1) 0%, rgba(124, 58, 237, 0.05) 100%)'
                                    : 'linear-gradient(135deg, rgba(37, 99, 235, 0.05) 0%, rgba(124, 58, 237, 0.02) 100%)',
                                borderColor: isDark ? 'rgba(59, 130, 246, 0.2)' : 'rgba(37, 99, 235, 0.15)'
                            }}
                        >
                            <CardContent>
                                <Box
                                    sx={{
                                        width: 50,
                                        height: 50,
                                        borderRadius: 3,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
                                        color: '#fff',
                                        mb: 2.5
                                    }}
                                >
                                    <SparklesIcon />
                                </Box>
                                <Typography variant="h5" sx={{ fontWeight: 700, mb: 1.5 }}>
                                    Sinh Nội Dung Bằng Trí Tuệ Nhân Tạo Groq LPU
                                </Typography>
                                <Typography variant="body1" sx={{ color: isDark ? '#94a3b8' : '#64748b', lineHeight: 1.7, mb: 3 }}>
                                    Áp dụng mô hình ngôn ngữ lớn <code>openai/gpt-oss-120b</code> xử lý siêu tốc. Bạn chỉ cần nhập vị trí ứng tuyển, AI sẽ tự động phân tích và viết nên bản tóm tắt mục tiêu, kinh nghiệm và kỹ năng xuất sắc.
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                                    <Chip icon={<CheckCircleIcon />} label="Không bị timeout" size="small" variant="outlined" />
                                    <Chip icon={<CheckCircleIcon />} label="Chuẩn ngữ pháp tiếng Việt" size="small" variant="outlined" />
                                    <Chip icon={<CheckCircleIcon />} label="Tự động fallback dự phòng" size="small" variant="outlined" />
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Card 2: State Standard */}
                    <Grid item xs={12} md={5}>
                        <Card sx={{ height: '100%', p: 3 }}>
                            <CardContent>
                                <Box
                                    sx={{
                                        width: 50,
                                        height: 50,
                                        borderRadius: 3,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                                        color: '#fff',
                                        mb: 2.5
                                    }}
                                >
                                    <GovernmentIcon />
                                </Box>
                                <Typography variant="h5" sx={{ fontWeight: 700, mb: 1.5 }}>
                                    Đúng Chuẩn Cơ Quan Nhà Nước
                                </Typography>
                                <Typography variant="body1" sx={{ color: isDark ? '#94a3b8' : '#64748b', lineHeight: 1.7 }}>
                                    Mẫu đơn thiết kế đúng văn phong pháp lý, quốc hiệu tiêu ngữ trang nghiêm, hỗ trợ ứng tuyển viên chức, giáo viên, y bác sĩ và cán bộ nhà nước.
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Card 3: Modern Business */}
                    <Grid item xs={12} md={5}>
                        <Card sx={{ height: '100%', p: 3 }}>
                            <CardContent>
                                <Box
                                    sx={{
                                        width: 50,
                                        height: 50,
                                        borderRadius: 3,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        background: 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)',
                                        color: '#fff',
                                        mb: 2.5
                                    }}
                                >
                                    <BusinessIcon />
                                </Box>
                                <Typography variant="h5" sx={{ fontWeight: 700, mb: 1.5 }}>
                                    Hiện Đại Cho Khối Doanh Nghiệp
                                </Typography>
                                <Typography variant="body1" sx={{ color: isDark ? '#94a3b8' : '#64748b', lineHeight: 1.7 }}>
                                    Dành riêng cho IT, Marketing, Tài chính. Thiết kế 2 cột trực quan, thanh đo kỹ năng sinh động giúp gây ấn tượng mạnh mẽ với nhà tuyển dụng trong 6 giây đầu tiên.
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Card 4: Direct Binary PDF Stream */}
                    <Grid item xs={12} md={7}>
                        <Card
                            sx={{
                                height: '100%',
                                p: 3,
                                background: isDark
                                    ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(5, 150, 105, 0.02) 100%)'
                                    : 'linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(5, 150, 105, 0.01) 100%)'
                            }}
                        >
                            <CardContent>
                                <Box
                                    sx={{
                                        width: 50,
                                        height: 50,
                                        borderRadius: 3,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        background: 'linear-gradient(135deg, #0284c7 0%, #06b6d4 100%)',
                                        color: '#fff',
                                        mb: 2.5
                                    }}
                                >
                                    <CloudDownloadIcon />
                                </Box>
                                <Typography variant="h5" sx={{ fontWeight: 700, mb: 1.5 }}>
                                    Xuất PDF Trực Tiếp & Lưu Trữ Đám Mây Cloudflare R2
                                </Typography>
                                <Typography variant="body1" sx={{ color: isDark ? '#94a3b8' : '#64748b', lineHeight: 1.7, mb: 3 }}>
                                    Không cần qua trung gian Google Drive phức tạp. File PDF được biên dịch bằng bộ render <strong>iText html2pdf</strong> chuẩn font tiếng Việt, gửi qua Binary Stream về máy người dùng và tự động sao lưu trên Cloudflare R2.
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                                    <Chip icon={<CheckCircleIcon />} label="Khổ giấy A4 tuyệt đối" size="small" variant="outlined" />
                                    <Chip icon={<CheckCircleIcon />} label="Chống spam xuất trùng" size="small" variant="outlined" />
                                    <Chip icon={<CheckCircleIcon />} label="Tải tức thì 1-click" size="small" variant="outlined" />
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Container>

            {/* 4. TEMPLATE EXPLORER SHOWCASE */}
            <Container maxWidth="lg" sx={{ mb: 12 }}>
                <Box sx={{ textAlign: 'center', mb: 5 }}>
                    <Typography variant="overline" sx={{ letterSpacing: 2, fontWeight: 700, color: '#7c3aed' }}>
                        KHO MẪU ĐA PHONG CÁCH
                    </Typography>
                    <Typography variant="h3" sx={{ fontWeight: 800, mt: 1, mb: 3, color: isDark ? '#f8fafc' : '#0f172a' }}>
                        Chọn Mẫu Phù Hợp Cho Ngành Nghề Của Bạn
                    </Typography>

                    <Tabs
                        value={activeTab}
                        onChange={handleTabChange}
                        centered
                        sx={{
                            '& .MuiTabs-indicator': {
                                backgroundColor: '#2563eb',
                                height: 3,
                                borderRadius: 1.5
                            },
                            '& .MuiTab-root': {
                                fontWeight: 700,
                                fontSize: '0.95rem',
                                textTransform: 'none',
                                px: 3
                            }
                        }}
                    >
                        <Tab label="Tất cả mẫu (11)" value="all" />
                        <Tab label="Cơ Quan Nhà Nước" value="state" />
                        <Tab label="Doanh Nghiệp Hiện Đại" value="modern" />
                    </Tabs>
                </Box>

                <Grid container spacing={3}>
                    {filteredTemplates.map((tpl) => (
                        <Grid item xs={12} sm={6} md={4} key={tpl.id}>
                            <Card
                                sx={{
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    p: 2.5,
                                    borderRadius: 3,
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        transform: 'translateY(-4px)',
                                        boxShadow: isDark
                                            ? '0 12px 30px rgba(0, 0, 0, 0.5)'
                                            : '0 12px 30px rgba(37, 99, 235, 0.1)'
                                    }
                                }}
                            >
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                    <Chip
                                        label={tpl.badge}
                                        color={tpl.badgeColor}
                                        size="small"
                                        sx={{ fontWeight: 700, borderRadius: 1.5 }}
                                    />
                                    <Typography variant="caption" sx={{ color: isDark ? '#94a3b8' : '#64748b' }}>
                                        Chuẩn A4
                                    </Typography>
                                </Box>

                                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, fontSize: '1.05rem', lineHeight: 1.4 }}>
                                    {tpl.title}
                                </Typography>

                                <Typography variant="body2" sx={{ color: isDark ? '#94a3b8' : '#64748b', mb: 3, flexGrow: 1, lineHeight: 1.6 }}>
                                    {tpl.description}
                                </Typography>

                                <Button
                                    component={Link}
                                    to={tpl.link}
                                    state={{ template: tpl.rawData }}
                                    variant="outlined"
                                    fullWidth
                                    endIcon={<ArrowForwardIcon />}
                                    sx={{
                                        borderRadius: 2,
                                        fontWeight: 600,
                                        py: 1
                                    }}
                                >
                                    Sử Dụng Mẫu Này
                                </Button>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                <Box sx={{ textAlign: 'center', mt: 5 }}>
                    <Button
                        component={Link}
                        to="/modern-cv/all"
                        variant="text"
                        size="large"
                        endIcon={<ArrowForwardIcon />}
                        sx={{ fontWeight: 700, fontSize: '1rem', color: '#2563eb' }}
                    >
                        Xem toàn bộ 11 mẫu trong thư viện
                    </Button>
                </Box>
            </Container>

            {/* 5. CTA BOTTOM BANNER */}
            <Container maxWidth="lg" sx={{ pb: 10 }}>
                <Paper
                    elevation={0}
                    sx={{
                        p: { xs: 4, md: 6 },
                        borderRadius: 4,
                        textAlign: 'center',
                        color: '#ffffff',
                        background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 50%, #7c3aed 100%)',
                        boxShadow: '0 20px 40px rgba(37, 99, 235, 0.25)'
                    }}
                >
                    <Typography variant="h3" sx={{ fontWeight: 800, mb: 2, fontSize: { xs: '1.8rem', md: '2.5rem' } }}>
                        Sẵn Sàng Chinh Phục Công Việc Mơ Ước?
                    </Typography>
                    <Typography variant="body1" sx={{ maxWidth: 640, mx: 'auto', opacity: 0.9, mb: 4, fontSize: '1.05rem' }}>
                        Tạo tài khoản miễn phí ngay hôm nay để trải nghiệm tạo CV bằng AI, không watermark và tải xuống file PDF không giới hạn.
                    </Typography>
                    <Button
                        component={Link}
                        to={isAuthenticated ? "/create-cv-with-ai" : "/register"}
                        variant="contained"
                        size="large"
                        sx={{
                            backgroundColor: '#ffffff',
                            color: '#1e3a8a',
                            fontWeight: 800,
                            px: 4,
                            py: 1.6,
                            borderRadius: '12px',
                            fontSize: '1rem',
                            '&:hover': {
                                backgroundColor: 'rgba(255, 255, 255, 0.9)'
                            }
                        }}
                    >
                        {isAuthenticated ? 'Tạo CV với AI Ngay' : 'Bắt Đầu Hoàn Toàn Miễn Phí'}
                    </Button>
                </Paper>
            </Container>

            {/* 6. FOOTER */}
            <Box
                sx={{
                    py: 4,
                    borderTop: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.06)',
                    backgroundColor: isDark ? '#090d16' : '#f8fafc',
                    textAlign: 'center'
                }}
            >
                <Container maxWidth="lg">
                    <Typography variant="body2" sx={{ color: isDark ? '#64748b' : '#94a3b8' }}>
                        © 2026 <strong>Cover Letter Creator</strong> — Phiên bản 2.0 phát triển & nâng cấp toàn diện từ Đồ án Môn học năm 2025. Nền tảng Java Spring Boot 3 & React Vite.
                    </Typography>
                </Container>
            </Box>
        </Box>
    );
}

export default Home;