import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    AppBar,
    Box,
    Toolbar,
    IconButton,
    Typography,
    Menu,
    MenuItem,
    Container,
    Button,
    Avatar,
    Tooltip,
    Chip,
    Divider,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    useTheme
} from '@mui/material';
import {
    Menu as MenuIcon,
    Close as CloseIcon,
    Brightness4 as DarkModeIcon,
    Brightness7 as LightModeIcon,
    Person as PersonIcon,
    Favorite as FavoriteIcon,
    PictureAsPdf as PdfIcon,
    Work as WorkIcon,
    Lock as LockIcon,
    AdminPanelSettings as AdminIcon,
    Logout as LogoutIcon,
    AutoAwesome as SparklesIcon,
    Home as HomeIcon,
    Description as DescriptionIcon,
    Article as ArticleIcon
} from '@mui/icons-material';
import { useAuth } from '../pages/Auth/AuthContext';
import { useThemeMode } from '../context/ThemeContext';

const navigationPages = [
    { name: 'Trang chủ', path: '/', icon: <HomeIcon fontSize="small" /> },
    { 
        name: 'Tạo CV với AI', 
        path: '/create-cv-with-ai', 
        icon: <SparklesIcon fontSize="small" sx={{ color: '#ec4899' }} />,
        highlight: true 
    },
    { name: 'Đơn Xin Việc Nhà Nước', path: '/template/all', icon: <DescriptionIcon fontSize="small" /> },
    { name: 'List CV Hiện Đại', path: '/modern-cv/all', icon: <ArticleIcon fontSize="small" /> }
];

function Navbar() {
    const { isAuthenticated, role, avatarUrl, user, logout } = useAuth();
    const { mode, toggleTheme } = useThemeMode();
    const location = useLocation();

    const [anchorElUser, setAnchorElUser] = useState(null);
    const [mobileOpen, setMobileOpen] = useState(false);

    const isDark = mode === 'dark';

    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleLogout = () => {
        logout();
        handleCloseUserMenu();
        window.location.href = '/';
    };

    const userSettings = [
        { name: 'Thông tin cá nhân', path: '/information', icon: <PersonIcon fontSize="small" /> },
        { name: 'Mẫu đơn yêu thích', path: '/my-love-templates', icon: <FavoriteIcon fontSize="small" /> },
        { name: 'Tệp đã xuất', path: '/pdf-exported', icon: <PdfIcon fontSize="small" /> },
        { name: 'Theo dõi CV', path: '/follow-cv', icon: <WorkIcon fontSize="small" /> },
        { name: 'Đổi mật khẩu', path: '/change-password', icon: <LockIcon fontSize="small" /> }
    ];

    return (
        <AppBar
            position="sticky"
            elevation={0}
            sx={{
                top: 0,
                zIndex: (th) => th.zIndex.drawer + 1,
                backgroundColor: isDark ? 'rgba(17, 24, 39, 0.85)' : 'rgba(255, 255, 255, 0.85)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                borderBottom: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.06)',
                color: isDark ? '#f8fafc' : '#0f172a',
                transition: 'all 0.3s ease'
            }}
        >
            <Container maxWidth="xl">
                <Toolbar disableGutters sx={{ minHeight: { xs: 64, md: 72 } }}>
                    {/* Brand Logo & Name (Desktop) */}
                    <Box
                        component={Link}
                        to="/"
                        sx={{
                            mr: 4,
                            display: { xs: 'none', md: 'flex' },
                            alignItems: 'center',
                            gap: 1.5,
                            textDecoration: 'none',
                            color: 'inherit'
                        }}
                    >
                        <Box
                            component="img"
                            src="/logo.png"
                            alt="CoverCraft Logo"
                            onError={(e) => {
                                e.target.style.display = 'none';
                            }}
                            sx={{ width: 36, height: 36, objectFit: 'contain' }}
                        />
                        <Typography
                            variant="h6"
                            noWrap
                            sx={{
                                fontWeight: 800,
                                fontSize: '1.25rem',
                                background: isDark
                                    ? 'linear-gradient(135deg, #60a5fa 0%, #c084fc 100%)'
                                    : 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                letterSpacing: '-0.02em'
                            }}
                        >
                            CoverCraft AI
                        </Typography>
                    </Box>

                    {/* Mobile Menu Icon */}
                    <Box sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }}>
                        <IconButton
                            size="medium"
                            aria-label="open mobile drawer"
                            onClick={handleDrawerToggle}
                            sx={{ color: isDark ? '#e2e8f0' : '#334155' }}
                        >
                            <MenuIcon />
                        </IconButton>
                    </Box>

                    {/* Brand Logo & Name (Mobile) */}
                    <Box
                        component={Link}
                        to="/"
                        sx={{
                            display: { xs: 'flex', md: 'none' },
                            flexGrow: 1,
                            alignItems: 'center',
                            gap: 1,
                            textDecoration: 'none',
                            color: 'inherit'
                        }}
                    >
                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: 800,
                                fontSize: '1.1rem',
                                background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent'
                            }}
                        >
                            CoverCraft
                        </Typography>
                    </Box>

                    {/* Desktop Navigation Links */}
                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, gap: 0.5 }}>
                        {navigationPages.map((page) => {
                            const isActive = location.pathname === page.path;
                            return (
                                <Button
                                    key={page.name}
                                    component={Link}
                                    to={page.path}
                                    startIcon={page.icon}
                                    sx={{
                                        px: 2,
                                        py: 1,
                                        borderRadius: '10px',
                                        fontSize: '0.9rem',
                                        fontWeight: isActive ? 700 : 500,
                                        color: isActive
                                            ? (isDark ? '#60a5fa' : '#2563eb')
                                            : (isDark ? '#cbd5e1' : '#475569'),
                                        backgroundColor: isActive
                                            ? (isDark ? 'rgba(59, 130, 246, 0.12)' : 'rgba(37, 99, 235, 0.08)')
                                            : 'transparent',
                                        '&:hover': {
                                            backgroundColor: isDark
                                                ? 'rgba(255, 255, 255, 0.05)'
                                                : 'rgba(0, 0, 0, 0.04)',
                                            color: isDark ? '#ffffff' : '#0f172a'
                                        }
                                    }}
                                >
                                    {page.name}
                                    {page.highlight && (
                                        <Chip
                                            label="AI"
                                            size="small"
                                            sx={{
                                                ml: 1,
                                                height: 18,
                                                fontSize: '0.65rem',
                                                fontWeight: 800,
                                                background: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)',
                                                color: '#fff'
                                            }}
                                        />
                                    )}
                                </Button>
                            );
                        })}
                    </Box>

                    {/* Right Action Icons & User Menu */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        {/* Dark / Light Mode Toggle */}
                        <Tooltip title={isDark ? 'Chuyển sang chế độ sáng' : 'Chuyển sang chế độ tối'}>
                            <IconButton
                                onClick={toggleTheme}
                                sx={{
                                    p: 1,
                                    color: isDark ? '#facc15' : '#64748b',
                                    borderRadius: '10px',
                                    backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)',
                                    '&:hover': {
                                        backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.06)'
                                    }
                                }}
                            >
                                {isDark ? <LightModeIcon fontSize="small" /> : <DarkModeIcon fontSize="small" />}
                            </IconButton>
                        </Tooltip>

                        {/* Authenticated / Guest Actions */}
                        {isAuthenticated ? (
                            <>
                                <Tooltip title="Cài đặt tài khoản">
                                    <IconButton
                                        onClick={handleOpenUserMenu}
                                        sx={{
                                            p: 0.5,
                                            border: isDark ? '2px solid rgba(96, 165, 250, 0.4)' : '2px solid rgba(37, 99, 235, 0.3)',
                                            transition: 'transform 0.2s ease',
                                            '&:hover': { transform: 'scale(1.05)' }
                                        }}
                                    >
                                        <Avatar
                                            alt="User Avatar"
                                            src={avatarUrl || ''}
                                            sx={{ width: 36, height: 36, bgcolor: '#2563eb', fontSize: '0.9rem', fontWeight: 'bold' }}
                                        >
                                            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                                        </Avatar>
                                    </IconButton>
                                </Tooltip>
                                <Menu
                                    sx={{
                                        mt: '48px',
                                        '& .MuiPaper-root': {
                                            minWidth: 240,
                                            borderRadius: 3,
                                            border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.06)',
                                            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
                                            p: 1
                                        }
                                    }}
                                    id="menu-appbar"
                                    anchorEl={anchorElUser}
                                    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                                    keepMounted
                                    transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                                    open={Boolean(anchorElUser)}
                                    onClose={handleCloseUserMenu}
                                >
                                    {/* User Info Header */}
                                    <Box sx={{ px: 2, py: 1.5 }}>
                                        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                                            {user?.name || 'Tài khoản người dùng'}
                                        </Typography>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                                            <Chip
                                                label={role === 'admin' ? 'Quản Trị Viên' : 'Thành viên'}
                                                size="small"
                                                color={role === 'admin' ? 'secondary' : 'default'}
                                                sx={{ height: 20, fontSize: '0.7rem', fontWeight: 600 }}
                                            />
                                        </Box>
                                    </Box>
                                    <Divider sx={{ my: 1 }} />

                                    {/* Admin Route (If role === 'admin') */}
                                    {role === 'admin' && (
                                        <MenuItem
                                            component={Link}
                                            to="/admin"
                                            onClick={handleCloseUserMenu}
                                            sx={{
                                                borderRadius: 1.5,
                                                color: '#9333ea',
                                                fontWeight: 700,
                                                py: 1
                                            }}
                                        >
                                            <ListItemIcon sx={{ color: '#9333ea' }}>
                                                <AdminIcon fontSize="small" />
                                            </ListItemIcon>
                                            <ListItemText primary="Trang Quản Trị" />
                                        </MenuItem>
                                    )}

                                    {/* Standard User Items */}
                                    {userSettings.map((setting) => (
                                        <MenuItem
                                            key={setting.name}
                                            component={Link}
                                            to={setting.path}
                                            onClick={handleCloseUserMenu}
                                            sx={{ borderRadius: 1.5, py: 1 }}
                                        >
                                            <ListItemIcon sx={{ color: 'inherit' }}>
                                                {setting.icon}
                                            </ListItemIcon>
                                            <ListItemText primary={setting.name} />
                                        </MenuItem>
                                    ))}

                                    <Divider sx={{ my: 1 }} />
                                    <MenuItem
                                        onClick={handleLogout}
                                        sx={{
                                            borderRadius: 1.5,
                                            color: '#ef4444',
                                            py: 1,
                                            '&:hover': { bgcolor: 'rgba(239, 68, 68, 0.08)' }
                                        }}
                                    >
                                        <ListItemIcon sx={{ color: '#ef4444' }}>
                                            <LogoutIcon fontSize="small" />
                                        </ListItemIcon>
                                        <ListItemText primary="Đăng xuất" />
                                    </MenuItem>
                                </Menu>
                            </>
                        ) : (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Button
                                    component={Link}
                                    to="/login"
                                    variant="text"
                                    sx={{
                                        color: isDark ? '#f1f5f9' : '#0f172a',
                                        fontWeight: 600
                                    }}
                                >
                                    Đăng nhập
                                </Button>
                                <Button
                                    component={Link}
                                    to="/register"
                                    variant="contained"
                                    sx={{
                                        display: { xs: 'none', sm: 'inline-flex' },
                                        background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
                                        color: '#ffffff',
                                        fontWeight: 600,
                                        px: 2.5
                                    }}
                                >
                                    Đăng ký
                                </Button>
                            </Box>
                        )}
                    </Box>
                </Toolbar>
            </Container>

            {/* Mobile Drawer */}
            <Drawer
                anchor="left"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{ keepMounted: true }}
                sx={{
                    display: { xs: 'block', md: 'none' },
                    '& .MuiDrawer-paper': {
                        boxSizing: 'border-box',
                        width: 280,
                        backgroundColor: isDark ? '#111827' : '#ffffff',
                        p: 2
                    }
                }}
            >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography
                        variant="h6"
                        sx={{
                            fontWeight: 800,
                            background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
                        }}
                    >
                        CoverCraft AI
                    </Typography>
                    <IconButton onClick={handleDrawerToggle}>
                        <CloseIcon />
                    </IconButton>
                </Box>
                <Divider sx={{ mb: 2 }} />

                <List>
                    {navigationPages.map((page) => (
                        <ListItem key={page.name} disablePadding sx={{ mb: 1 }}>
                            <ListItemButton
                                component={Link}
                                to={page.path}
                                onClick={handleDrawerToggle}
                                selected={location.pathname === page.path}
                                sx={{
                                    borderRadius: 2,
                                    py: 1.2,
                                    '&.Mui-selected': {
                                        backgroundColor: isDark ? 'rgba(59, 130, 246, 0.15)' : 'rgba(37, 99, 235, 0.1)',
                                        color: isDark ? '#60a5fa' : '#2563eb',
                                        fontWeight: 700
                                    }
                                }}
                            >
                                <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
                                    {page.icon}
                                </ListItemIcon>
                                <ListItemText primary={page.name} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>

                {!isAuthenticated && (
                    <Box sx={{ mt: 'auto', pt: 3 }}>
                        <Button
                            component={Link}
                            to="/login"
                            variant="outlined"
                            fullWidth
                            onClick={handleDrawerToggle}
                            sx={{ mb: 1.5 }}
                        >
                            Đăng nhập
                        </Button>
                        <Button
                            component={Link}
                            to="/register"
                            variant="contained"
                            fullWidth
                            onClick={handleDrawerToggle}
                            sx={{
                                background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
                                color: '#fff'
                            }}
                        >
                            Đăng ký miễn phí
                        </Button>
                    </Box>
                )}
            </Drawer>
        </AppBar>
    );
}

export default Navbar;