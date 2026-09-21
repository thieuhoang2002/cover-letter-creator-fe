import React, { useEffect, useState } from "react";
import {
    Box,
    Typography,
    Card,
    CardContent,
    Grid,
    Paper,
    CircularProgress,
    Stack,
    Chip,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from "@mui/material";
import { Bar, Pie } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import { getAllUsers } from "../../apis/profile";
import {
    getAllTemplates,
    getTopViewedTemplates,
} from "../../apis/template";
import {
    getAllModernTemplates,
    getTopViewedModernTemplates,
} from "../../apis/templateModernCV";
import PeopleIcon from "@mui/icons-material/People";
import DescriptionIcon from "@mui/icons-material/Description";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import { useThemeMode } from "../../context/ThemeContext";

// Đăng ký các thành phần của Chart.js
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

function AdminDashboard() {
    const { mode } = useThemeMode();
    const isDark = mode === "dark";

    const [userCount, setUserCount] = useState(0);
    const [classicTemplateCount, setClassicTemplateCount] = useState(0);
    const [modernTemplateCount, setModernTemplateCount] = useState(0);
    const [classicViews, setClassicViews] = useState(0);
    const [modernViews, setModernViews] = useState(0);
    const [topTemplates, setTopTemplates] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                const [users, classicTemplates, modernTemplates, topClassic, topModern] = await Promise.all([
                    getAllUsers().catch(() => []),
                    getAllTemplates().catch(() => []),
                    getAllModernTemplates().catch(() => []),
                    getTopViewedTemplates().catch(() => []),
                    getTopViewedModernTemplates().catch(() => []),
                ]);

                setUserCount(users.length);
                setClassicTemplateCount(classicTemplates.length);
                setModernTemplateCount(modernTemplates.length);

                const classicViewsSum = classicTemplates.reduce(
                    (sum, t) => sum + (t.views || 0), 0
                );
                setClassicViews(classicViewsSum);

                const modernViewsSum = modernTemplates.reduce(
                    (sum, t) => sum + (t.views || 0), 0
                );
                setModernViews(modernViewsSum);

                const markedClassic = topClassic.map(t => ({ ...t, isModern: false }));
                const markedModern = topModern.map(t => ({ ...t, isModern: true }));
                const combinedTop = [...markedClassic, ...markedModern]
                    .sort((a, b) => (b.views || 0) - (a.views || 0))
                    .slice(0, 5);
                setTopTemplates(combinedTop);
            } catch (err) {
                console.error("Lỗi khi tải dữ liệu dashboard:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const textColor = isDark ? "#cbd5e1" : "#475569";
    const gridColor = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)";

    // Dữ liệu biểu đồ cột
    const barData = {
        labels: ["CV Nhà Nước", "CV Hiện Đại"],
        datasets: [
            {
                label: "Số lượng mẫu",
                data: [classicTemplateCount, modernTemplateCount],
                backgroundColor: ["#10b981", "#3b82f6"],
                borderRadius: 8,
            },
        ],
    };

    // Dữ liệu biểu đồ tròn
    const pieData = {
        labels: ["Lượt xem Nhà Nước", "Lượt xem Hiện Đại"],
        datasets: [
            {
                data: [classicViews, modernViews],
                backgroundColor: ["#10b981", "#8b5cf6"],
                hoverOffset: 4,
            },
        ],
    };

    // Dữ liệu biểu đồ ngang Top Templates
    const topTemplatesData = {
        labels: topTemplates.map((t) => t.name),
        datasets: [
            {
                label: "Lượt xem",
                data: topTemplates.map((t) => t.views || 0),
                backgroundColor: "rgba(147, 51, 234, 0.7)",
                borderRadius: 6,
            },
        ],
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
                <CircularProgress sx={{ color: "#9333ea" }} />
            </Box>
        );
    }

    return (
        <Box>
            {/* KPI Cards Grid */}
            <Grid container spacing={2.5} mb={4}>
                {/* Users Card */}
                <Grid item xs={12} sm={6} md={3}>
                    <Card
                        elevation={0}
                        sx={{
                            p: 2.5,
                            borderRadius: 3.5,
                            bgcolor: isDark ? "rgba(30, 41, 59, 0.8)" : "#ffffff",
                            border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)"}`,
                            boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
                            position: "relative",
                            overflow: "hidden",
                        }}
                    >
                        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                            <Box>
                                <Typography variant="caption" color="textSecondary" fontWeight={600} textTransform="uppercase">
                                    Tổng người dùng
                                </Typography>
                                <Typography variant="h4" fontWeight={800} color={isDark ? "#f8fafc" : "#0f172a"} mt={0.5}>
                                    {userCount}
                                </Typography>
                            </Box>
                            <Box
                                sx={{
                                    width: 44,
                                    height: 44,
                                    borderRadius: 2.5,
                                    background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    color: "#fff",
                                }}
                            >
                                <PeopleIcon />
                            </Box>
                        </Stack>
                    </Card>
                </Grid>

                {/* Classic Templates */}
                <Grid item xs={12} sm={6} md={3}>
                    <Card
                        elevation={0}
                        sx={{
                            p: 2.5,
                            borderRadius: 3.5,
                            bgcolor: isDark ? "rgba(30, 41, 59, 0.8)" : "#ffffff",
                            border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)"}`,
                            boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
                        }}
                    >
                        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                            <Box>
                                <Typography variant="caption" color="textSecondary" fontWeight={600} textTransform="uppercase">
                                    Đơn CV Nhà Nước
                                </Typography>
                                <Typography variant="h4" fontWeight={800} color="#10b981" mt={0.5}>
                                    {classicTemplateCount}
                                </Typography>
                            </Box>
                            <Box
                                sx={{
                                    width: 44,
                                    height: 44,
                                    borderRadius: 2.5,
                                    background: "linear-gradient(135deg, #10b981 0%, #047857 100%)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    color: "#fff",
                                }}
                            >
                                <DescriptionIcon />
                            </Box>
                        </Stack>
                    </Card>
                </Grid>

                {/* Modern Templates */}
                <Grid item xs={12} sm={6} md={3}>
                    <Card
                        elevation={0}
                        sx={{
                            p: 2.5,
                            borderRadius: 3.5,
                            bgcolor: isDark ? "rgba(30, 41, 59, 0.8)" : "#ffffff",
                            border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)"}`,
                            boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
                        }}
                    >
                        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                            <Box>
                                <Typography variant="caption" color="textSecondary" fontWeight={600} textTransform="uppercase">
                                    Mẫu CV Hiện Đại
                                </Typography>
                                <Typography variant="h4" fontWeight={800} color="#8b5cf6" mt={0.5}>
                                    {modernTemplateCount}
                                </Typography>
                            </Box>
                            <Box
                                sx={{
                                    width: 44,
                                    height: 44,
                                    borderRadius: 2.5,
                                    background: "linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    color: "#fff",
                                }}
                            >
                                <AutoAwesomeIcon />
                            </Box>
                        </Stack>
                    </Card>
                </Grid>

                {/* Total Views */}
                <Grid item xs={12} sm={6} md={3}>
                    <Card
                        elevation={0}
                        sx={{
                            p: 2.5,
                            borderRadius: 3.5,
                            bgcolor: isDark ? "rgba(30, 41, 59, 0.8)" : "#ffffff",
                            border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)"}`,
                            boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
                        }}
                    >
                        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                            <Box>
                                <Typography variant="caption" color="textSecondary" fontWeight={600} textTransform="uppercase">
                                    Tổng lượt xem
                                </Typography>
                                <Typography variant="h4" fontWeight={800} color="#f59e0b" mt={0.5}>
                                    {classicViews + modernViews}
                                </Typography>
                            </Box>
                            <Box
                                sx={{
                                    width: 44,
                                    height: 44,
                                    borderRadius: 2.5,
                                    background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    color: "#fff",
                                }}
                            >
                                <VisibilityIcon />
                            </Box>
                        </Stack>
                    </Card>
                </Grid>
            </Grid>

            {/* Charts Section */}
            <Grid container spacing={3} mb={4}>
                <Grid item xs={12} md={7}>
                    <Paper
                        elevation={0}
                        sx={{
                            p: 3,
                            borderRadius: 3.5,
                            bgcolor: isDark ? "rgba(30, 41, 59, 0.8)" : "#ffffff",
                            border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)"}`,
                        }}
                    >
                        <Typography variant="subtitle1" fontWeight={700} color={isDark ? "#f8fafc" : "#0f172a"} mb={2}>
                            Thống Kê Số Lượng Mẫu CV
                        </Typography>
                        <Box sx={{ height: 260 }}>
                            <Bar
                                data={barData}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    plugins: { legend: { display: false } },
                                    scales: {
                                        y: { grid: { color: gridColor }, ticks: { color: textColor } },
                                        x: { grid: { display: false }, ticks: { color: textColor } },
                                    },
                                }}
                            />
                        </Box>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={5}>
                    <Paper
                        elevation={0}
                        sx={{
                            p: 3,
                            borderRadius: 3.5,
                            bgcolor: isDark ? "rgba(30, 41, 59, 0.8)" : "#ffffff",
                            border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)"}`,
                        }}
                    >
                        <Typography variant="subtitle1" fontWeight={700} color={isDark ? "#f8fafc" : "#0f172a"} mb={2}>
                            Tỷ Trọng Lượt Xem Mẫu CV
                        </Typography>
                        <Box sx={{ height: 260 }}>
                            <Pie
                                data={pieData}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    plugins: {
                                        legend: {
                                            position: "bottom",
                                            labels: { color: textColor, padding: 15, font: { size: 12 } },
                                        },
                                    },
                                }}
                            />
                        </Box>
                    </Paper>
                </Grid>
            </Grid>

            {/* Top 5 Templates Table */}
            <Paper
                elevation={0}
                sx={{
                    borderRadius: 3.5,
                    bgcolor: isDark ? "rgba(30, 41, 59, 0.8)" : "#ffffff",
                    border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)"}`,
                    overflow: "hidden",
                    p: 3,
                }}
            >
                <Stack direction="row" spacing={1.5} alignItems="center" mb={2}>
                    <TrendingUpIcon color="primary" />
                    <Typography variant="subtitle1" fontWeight={700} color={isDark ? "#f8fafc" : "#0f172a"}>
                        Top 5 Mẫu CV Được Quan Tâm & Sử Dụng Nhiều Nhất
                    </Typography>
                </Stack>

                <TableContainer>
                    <Table size="small">
                        <TableHead>
                            <TableRow sx={{ bgcolor: isDark ? "rgba(255,255,255,0.02)" : "#f8fafc" }}>
                                <TableCell sx={{ fontWeight: 700, width: 80 }}>Xếp Hạng</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Tên Mẫu CV</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Phân Loại</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 700 }}>Lượt Xem</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {topTemplates.map((template, idx) => (
                                <TableRow key={template.id} hover>
                                    <TableCell>
                                        <Chip
                                            label={`#${idx + 1}`}
                                            size="small"
                                            sx={{
                                                fontWeight: 800,
                                                bgcolor: idx === 0 ? "#fef3c7" : idx === 1 ? "#e0e7ff" : idx === 2 ? "#fed7aa" : "transparent",
                                                color: idx === 0 ? "#b45309" : idx === 1 ? "#3730a3" : idx === 2 ? "#c2410c" : "inherit",
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>{template.name}</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={template.isModern ? "Hiện Đại" : "Nhà Nước"}
                                            size="small"
                                            variant="outlined"
                                            color={template.isModern ? "primary" : "success"}
                                            sx={{ borderRadius: 1.5, fontWeight: 600 }}
                                        />
                                    </TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 700, color: "#10b981" }}>
                                        {template.views || 0} lượt
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </Box>
    );
}

export default AdminDashboard;