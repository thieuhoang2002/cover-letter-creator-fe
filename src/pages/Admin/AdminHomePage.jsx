import React, { useState } from "react";
import {
    Box, Drawer, List, ListItem, ListItemIcon, ListItemText,
    Typography, IconButton, Divider, Tooltip, Stack, Chip, Paper
} from "@mui/material";
import {
    Dashboard as DashboardIcon,
    People as PeopleIcon,
    Description as DescriptionIcon,
    Article as ArticleIcon,
    ChevronLeft,
    ChevronRight,
    AdminPanelSettings as AdminIcon,
    ArrowBack
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import TemplateManager from "./TemplateManager";
import UserManager from "./UserManager";
import AdminDashboard from "./AdminDashboard";
import ModernCVTemplateManager from "./ModernCVTemplateManager";
import { useThemeMode } from "../../context/ThemeContext";

const fullDrawerWidth = 260;
const collapsedDrawerWidth = 72;

function AdminHomePage() {
    const [selectedPage, setSelectedPage] = useState("dashboard");
    const [isCollapsed, setIsCollapsed] = useState(false);
    const { mode } = useThemeMode();
    const isDark = mode === "dark";

    const menuItems = [
        { text: "Tổng Quan Hệ Thống", shortText: "Tổng quan", icon: <DashboardIcon />, page: "dashboard" },
        { text: "Quản Lý Người Dùng", shortText: "Người dùng", icon: <PeopleIcon />, page: "users" },
        { text: "Mẫu Đơn Nhà Nước", shortText: "Nhà nước", icon: <DescriptionIcon />, page: "templates" },
        { text: "Mẫu CV Hiện Đại", shortText: "Hiện đại", icon: <ArticleIcon />, page: "moderncvs" },
    ];

    const handleCollapseToggle = () => {
        setIsCollapsed(!isCollapsed);
    };

    return (
        <Box
            sx={{
                display: "flex",
                minHeight: "calc(100vh - 72px)",
                background: isDark
                    ? "radial-gradient(ellipse at top, #0f172a 0%, #090d16 100%)"
                    : "#f8fafc",
            }}
        >
            {/* Sidebar */}
            <Box
                component="aside"
                sx={{
                    width: isCollapsed ? collapsedDrawerWidth : fullDrawerWidth,
                    flexShrink: 0,
                    transition: "width 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                    borderRight: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)"}`,
                    bgcolor: isDark ? "rgba(15, 23, 42, 0.95)" : "#ffffff",
                    display: "flex",
                    flexDirection: "column",
                    zIndex: 10,
                }}
            >
                {/* Sidebar Header */}
                <Box
                    sx={{
                        p: 2.5,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: isCollapsed ? "center" : "space-between",
                        borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)"}`,
                    }}
                >
                    {!isCollapsed && (
                        <Stack direction="row" spacing={1.5} alignItems="center">
                            <Box
                                sx={{
                                    width: 36,
                                    height: 36,
                                    borderRadius: 2,
                                    background: "linear-gradient(135deg, #9333ea 0%, #7c3aed 100%)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    color: "#fff",
                                    boxShadow: "0 4px 10px rgba(147, 51, 234, 0.3)",
                                }}
                            >
                                <AdminIcon fontSize="small" />
                            </Box>
                            <Box>
                                <Typography variant="subtitle2" fontWeight={800} color={isDark ? "#f8fafc" : "#0f172a"}>
                                    Bảng Quản Trị
                                </Typography>
                                <Typography variant="caption" color="textSecondary">
                                    Portal Quản lý CV
                                </Typography>
                            </Box>
                        </Stack>
                    )}

                    <IconButton
                        onClick={handleCollapseToggle}
                        size="small"
                        sx={{
                            color: isDark ? "#94a3b8" : "#64748b",
                            bgcolor: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)",
                            "&:hover": {
                                bgcolor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)",
                            },
                        }}
                    >
                        {isCollapsed ? <ChevronRight fontSize="small" /> : <ChevronLeft fontSize="small" />}
                    </IconButton>
                </Box>

                {/* Sidebar Menu List */}
                <List sx={{ px: 1.5, py: 2 }}>
                    {menuItems.map((item) => {
                        const isSelected = selectedPage === item.page;
                        return (
                            <Tooltip
                                key={item.page}
                                title={isCollapsed ? item.text : ""}
                                placement="right"
                                arrow
                            >
                                <ListItem
                                    onClick={() => setSelectedPage(item.page)}
                                    sx={{
                                        mb: 0.8,
                                        borderRadius: 2.5,
                                        cursor: "pointer",
                                        py: 1.3,
                                        px: isCollapsed ? 1 : 2,
                                        justifyContent: isCollapsed ? "center" : "flex-start",
                                        backgroundColor: isSelected
                                            ? isDark
                                                ? "rgba(147, 51, 234, 0.2)"
                                                : "rgba(147, 51, 234, 0.08)"
                                            : "transparent",
                                        color: isSelected
                                            ? (isDark ? "#c084fc" : "#7e22ce")
                                            : (isDark ? "#94a3b8" : "#64748b"),
                                        fontWeight: isSelected ? 700 : 500,
                                        transition: "all 0.2s ease",
                                        "&:hover": {
                                            backgroundColor: isSelected
                                                ? isDark ? "rgba(147, 51, 234, 0.25)" : "rgba(147, 51, 234, 0.12)"
                                                : isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)",
                                            color: isDark ? "#ffffff" : "#0f172a",
                                        },
                                    }}
                                >
                                    <ListItemIcon
                                        sx={{
                                            color: isSelected ? (isDark ? "#c084fc" : "#7e22ce") : "inherit",
                                            minWidth: isCollapsed ? 0 : 38,
                                            justifyContent: "center",
                                        }}
                                    >
                                        {item.icon}
                                    </ListItemIcon>
                                    {!isCollapsed && (
                                        <ListItemText
                                            primary={item.text}
                                            primaryTypographyProps={{
                                                fontSize: "0.925rem",
                                                fontWeight: isSelected ? 700 : 500,
                                            }}
                                        />
                                    )}
                                </ListItem>
                            </Tooltip>
                        );
                    })}
                </List>

                {/* Return to Home link at bottom */}
                <Box sx={{ mt: "auto", p: 2, borderTop: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)"}` }}>
                    <Tooltip title={isCollapsed ? "Về trang chủ" : ""} placement="right" arrow>
                        <ListItem
                            component={Link}
                            to="/"
                            sx={{
                                borderRadius: 2.5,
                                textDecoration: "none",
                                color: isDark ? "#94a3b8" : "#64748b",
                                px: isCollapsed ? 1 : 2,
                                py: 1.2,
                                justifyContent: isCollapsed ? "center" : "flex-start",
                                "&:hover": {
                                    bgcolor: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)",
                                    color: isDark ? "#fff" : "#0f172a",
                                },
                            }}
                        >
                            <ListItemIcon sx={{ color: "inherit", minWidth: isCollapsed ? 0 : 38, justifyContent: "center" }}>
                                <ArrowBack fontSize="small" />
                            </ListItemIcon>
                            {!isCollapsed && (
                                <ListItemText
                                    primary="Về trang chủ"
                                    primaryTypographyProps={{ fontSize: "0.9rem", fontWeight: 500 }}
                                />
                            )}
                        </ListItem>
                    </Tooltip>
                </Box>
            </Box>

            {/* Main Content Area */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: { xs: 2.5, md: 4 },
                    overflowX: "hidden",
                }}
            >
                {/* Page Title & Breadcrumbs */}
                <Box mb={3.5}>
                    <Stack direction="row" alignItems="center" spacing={1.5} mb={0.5}>
                        <Typography variant="h5" fontWeight={800} color={isDark ? "#f8fafc" : "#0f172a"}>
                            {menuItems.find((i) => i.page === selectedPage)?.text || "Quản Trị"}
                        </Typography>
                        <Chip
                            label="Admin Zone"
                            size="small"
                            sx={{
                                height: 22,
                                fontWeight: 700,
                                fontSize: "0.68rem",
                                background: "linear-gradient(135deg, #9333ea 0%, #7c3aed 100%)",
                                color: "#fff",
                            }}
                        />
                    </Stack>
                    <Typography variant="body2" color="textSecondary">
                        {selectedPage === "dashboard" && "Thống kê chỉ số hoạt động, lượt xem mẫu CV và người dùng toàn hệ thống."}
                        {selectedPage === "users" && "Quản lý danh sách tài khoản, vai trò phân quyền và cập nhật hồ sơ người dùng."}
                        {selectedPage === "templates" && "Quản lý các mẫu Đơn Xin Việc Chuẩn Nhà Nước (Thêm mới, chỉnh sửa nội dung, xóa)."}
                        {selectedPage === "moderncvs" && "Quản lý danh mục Mẫu CV Hiện Đại & Tiêu Chuẩn Doanh Nghiệp Tư Nhân."}
                    </Typography>
                </Box>

                {/* Sub-pages */}
                {selectedPage === "dashboard" && <AdminDashboard />}
                {selectedPage === "users" && <UserManager />}
                {selectedPage === "templates" && <TemplateManager />}
                {selectedPage === "moderncvs" && <ModernCVTemplateManager />}
            </Box>
        </Box>
    );
}

export default AdminHomePage;