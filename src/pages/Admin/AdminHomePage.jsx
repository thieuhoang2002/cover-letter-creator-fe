import React, { useState } from "react";
import {
    Box, CssBaseline, Drawer, Toolbar, List, ListItem, ListItemIcon, ListItemText,
    AppBar, Typography, IconButton, Divider, useTheme, Tooltip
} from "@mui/material";
import { Dashboard, People, Settings, Article, Logout, ChevronLeft, ChevronRight } from "@mui/icons-material";
import TemplateManager from "./TemplateManager";
import AdminDashboard from "./AdminDashboard";
import { useNavigate } from 'react-router-dom';

const fullDrawerWidth = 240;
const collapsedDrawerWidth = 60;

function AdminHomePage() {
    const [selectedPage, setSelectedPage] = useState("dashboard");
    const [isCollapsed, setIsCollapsed] = useState(false);
    const theme = useTheme();
    const navigate = useNavigate();

    const menuItems = [
        { text: "Tổng Quan", icon: <Dashboard />, page: "dashboard" },
        // { text: "Users", icon: <People />, page: "users" },
        { text: "Mẫu Đơn", icon: <Article />, page: "templates" },
        // { text: "Settings", icon: <Settings />, page: "settings" },
    ];

    const handleCollapseToggle = () => {
        setIsCollapsed(!isCollapsed);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const drawerContent = (
        <Box>
            {/* Chừa chỗ cho AppBar */}
            <Toolbar />

            {/* Logo và nút toggle */}
            <Box sx={{ p: 2, display: 'flex', justifyContent: isCollapsed ? 'center' : 'space-between', alignItems: 'center' }}>
                {!isCollapsed && (
                    <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#fff' }}>
                        Trang Admin
                    </Typography>
                )}
                <IconButton onClick={handleCollapseToggle} sx={{ color: '#fff' }}>
                    {isCollapsed ? <ChevronRight /> : <ChevronLeft />}
                </IconButton>
            </Box>
            <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />

            {/* Danh sách menu */}
            <List>
                {menuItems.map((item) => (
                    <ListItem
                        key={item.text}
                        onClick={() => setSelectedPage(item.page)}
                        sx={{
                            cursor: "pointer",
                            backgroundColor: selectedPage === item.page ? 'rgba(255,255,255,0.1)' : 'transparent',
                            '&:hover': {
                                backgroundColor: 'rgba(255,255,255,0.2)',
                                transition: 'background-color 0.3s',
                            },
                            py: 1.5,
                            justifyContent: isCollapsed ? 'center' : 'flex-start',
                        }}
                    >
                        <ListItemIcon sx={{ color: "white", minWidth: isCollapsed ? 0 : 40 }}>
                            {item.icon}
                        </ListItemIcon>
                        {!isCollapsed && <ListItemText primary={item.text} />}
                    </ListItem>
                ))}
            </List>
        </Box>
    );

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>
            <CssBaseline />

            {/* Sidebar */}
            <Drawer
                variant="permanent"
                sx={{
                    width: isCollapsed ? collapsedDrawerWidth : fullDrawerWidth,
                    flexShrink: 0,
                    "& .MuiDrawer-paper": {
                        width: isCollapsed ? collapsedDrawerWidth : fullDrawerWidth,
                        boxSizing: "border-box",
                        backgroundColor: "#1e1e2d",
                        color: "white",
                        height: "100vh",
                        borderRight: 'none',
                        boxShadow: '2px 0 8px rgba(0,0,0,0.2)',
                        transition: 'width 0.3s ease-in-out',
                    },
                }}
            >
                {drawerContent}
            </Drawer>

            {/* Nội dung chính */}
            <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                {/* Header */}
                <AppBar
                    position="fixed"
                    sx={{
                        width: `calc(100% - ${isCollapsed ? collapsedDrawerWidth : fullDrawerWidth}px)`,
                        ml: `${isCollapsed ? collapsedDrawerWidth : fullDrawerWidth}px`,
                        backgroundColor: '#fff',
                        color: '#000',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                        transition: 'all 0.3s ease-in-out',
                        zIndex: theme.zIndex.drawer + 1, // Đảm bảo AppBar nằm trên Drawer
                    }}
                >
                    {/* <Toolbar>
                        <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
                            {menuItems.find(item => item.page === selectedPage)?.text || "Admin"}
                        </Typography>
                        <Tooltip title="Đăng xuất">
                            <IconButton onClick={handleLogout} sx={{ color: '#f44336' }}>
                                <Logout />
                            </IconButton>
                        </Tooltip>
                    </Toolbar> */}
                </AppBar>

                {/* Nội dung trang */}
                <Box
                    component="main"
                    sx={{
                        flexGrow: 1,
                        p: 3,
                        mt: '64px',
                        backgroundColor: '#f5f5f5',
                        transition: 'all 0.3s ease-in-out',
                    }}
                >
                    {selectedPage === "dashboard" && <AdminDashboard />}
                    {selectedPage === "templates" && <TemplateManager />}
                    {/* {selectedPage === "users" && <Typography>Quản lý người dùng (Chưa triển khai)</Typography>}
                    {selectedPage === "settings" && <Typography>Cài đặt (Chưa triển khai)</Typography>} */}
                </Box>
            </Box>
        </Box>
    );
}

export default AdminHomePage;