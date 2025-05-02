import React, { useEffect, useState } from "react";
import {
    Box,
    Typography,
    Card,
    CardContent,
    Grid,
    Paper,
    Divider,
    CircularProgress,
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

                // Lấy số lượng người dùng
                const users = await getAllUsers();
                setUserCount(users.length);

                // Lấy số lượng và lượt xem template nhà nước
                const classicTemplates = await getAllTemplates();
                setClassicTemplateCount(classicTemplates.length);
                const classicViewsSum = classicTemplates.reduce(
                    (sum, template) => sum + (template.views || 0),
                    0
                );
                setClassicViews(classicViewsSum);

                // Lấy số lượng và lượt xem template hiện đại
                const modernTemplates = await getAllModernTemplates();
                setModernTemplateCount(modernTemplates.length);
                const modernViewsSum = modernTemplates.reduce(
                    (sum, template) => sum + (template.views || 0),
                    0
                );
                setModernViews(modernViewsSum);

                // Lấy top template được xem nhiều nhất
                const topClassic = await getTopViewedTemplates();
                const topModern = await getTopViewedModernTemplates();
                const combinedTop = [...topClassic, ...topModern]
                    .sort((a, b) => (b.views || 0) - (a.views || 0))
                    .slice(0, 5);
                setTopTemplates(combinedTop);
            } catch (err) {
                console.error("Lỗi khi lấy dữ liệu:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Dữ liệu cho biểu đồ cột (số lượng người dùng và template)
    const barData = {
        labels: ["CV Nhà nước", "CV Hiện đại"],
        datasets: [
            {
                label: "Số lượng",
                data: [classicTemplateCount, modernTemplateCount],
                backgroundColor: ["#4caf50", "#ff9800"],
                borderColor: ["#388e3c", "#f57c00"],
                borderWidth: 1,
            },
        ],
    };

    // Dữ liệu cho biểu đồ tròn (phân bố lượt xem)
    const pieData = {
        labels: ["CV Nhà nước", "CV Hiện đại"],
        datasets: [
            {
                data: [classicViews, modernViews],
                backgroundColor: ["#4caf50", "#ff9800"],
                borderColor: ["#388e3c", "#f57c00"],
                borderWidth: 1,
            },
        ],
    };

    // Dữ liệu cho biểu đồ cột ngang (top template)
    const topTemplatesData = {
        labels: topTemplates.map((t) => t.name),
        datasets: [
            {
                label: "Lượt xem",
                data: topTemplates.map((t) => t.views || 0),
                backgroundColor: "rgba(33, 150, 243, 0.6)",
                borderColor: "#1976d2",
                borderWidth: 1,
            },
        ],
    };

    return (
        <Box sx={{ p: 4, background: "linear-gradient(135deg, #f6f9fc 0%, #e3f2fd 100%)", minHeight: "100vh" }}>
            <Typography
                variant="h4"
                gutterBottom
                sx={{ fontWeight: "bold", color: "#1976d2", mb: 4 }}
            >
                Trang Quản Trị
            </Typography>

            {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
                    <CircularProgress size={50} />
                </Box>
            ) : (
                <>
                    {/* Thống kê tổng quan */}
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={4}>
                            <Card
                                sx={{
                                    background: "linear-gradient(to right, #2196f3, #64b5f6)",
                                    color: "white",
                                    borderRadius: 3,
                                    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                                    transition: "transform 0.3s",
                                    "&:hover": { transform: "scale(1.05)" },
                                }}
                            >
                                <CardContent sx={{ display: "flex", alignItems: "center" }}>
                                    <PeopleIcon sx={{ fontSize: 40, mr: 2 }} />
                                    <Box>
                                        <Typography variant="h6">Tổng số người dùng</Typography>
                                        <Typography variant="h4">{userCount}</Typography>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Card
                                sx={{
                                    background: "linear-gradient(to right, #4caf50, #81c784)",
                                    color: "white",
                                    borderRadius: 3,
                                    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                                    transition: "transform 0.3s",
                                    "&:hover": { transform: "scale(1.05)" },
                                }}
                            >
                                <CardContent sx={{ display: "flex", alignItems: "center" }}>
                                    <DescriptionIcon sx={{ fontSize: 40, mr: 2 }} />
                                    <Box>
                                        <Typography variant="h6">Tổng số template</Typography>
                                        <Typography variant="h4">
                                            {classicTemplateCount + modernTemplateCount}
                                        </Typography>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Card
                                sx={{
                                    background: "linear-gradient(to right, #ff9800, #ffb74d)",
                                    color: "white",
                                    borderRadius: 3,
                                    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                                    transition: "transform 0.3s",
                                    "&:hover": { transform: "scale(1.05)" },
                                }}
                            >
                                <CardContent sx={{ display: "flex", alignItems: "center" }}>
                                    <VisibilityIcon sx={{ fontSize: 40, mr: 2 }} />
                                    <Box>
                                        <Typography variant="h6">Tổng lượt xem</Typography>
                                        <Typography variant="h4">{classicViews + modernViews}</Typography>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>

                    {/* Biểu đồ thống kê */}
                    <Grid container spacing={3} sx={{ mt: 4 }}>
                        <Grid item xs={12} md={6}>
                            <Paper sx={{ p: 3, borderRadius: 3, boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}>
                                <Typography variant="h6" gutterBottom sx={{ color: "#1976d2" }}>
                                    Thống kê số lượng
                                </Typography>
                                <Box sx={{ height: 300 }}>
                                    <Bar
                                        data={barData}
                                        options={{
                                            responsive: true,
                                            maintainAspectRatio: false,
                                            plugins: {
                                                legend: { display: false },
                                                title: { display: true, text: "Số lượng người dùng và template" },
                                            },
                                        }}
                                    />
                                </Box>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Paper sx={{ p: 3, borderRadius: 3, boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}>
                                <Typography variant="h6" gutterBottom sx={{ color: "#1976d2" }}>
                                    Phân bố lượt xem
                                </Typography>
                                <Box sx={{ height: 300 }}>
                                    <Pie
                                        data={pieData}
                                        options={{
                                            responsive: true,
                                            maintainAspectRatio: false,
                                            plugins: {
                                                legend: { position: "top" },
                                                title: { display: true, text: "Lượt xem CV Nhà nước vs Hiện đại" },
                                            },
                                        }}
                                    />
                                </Box>
                            </Paper>
                        </Grid>
                    </Grid>

                    {/* Top Templates */}
                    <Box sx={{ mt: 5 }}>
                        <Typography variant="h6" gutterBottom sx={{ color: "#1976d2", fontWeight: "bold" }}>
                            Top 5 Template được xem nhiều nhất
                        </Typography>
                        <Paper sx={{ p: 3, borderRadius: 3, boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}>
                            <Box sx={{ height: 300 }}>
                                <Bar
                                    data={topTemplatesData}
                                    options={{
                                        indexAxis: "y",
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        plugins: {
                                            legend: { display: false },
                                            title: { display: true, text: "Top 5 Template theo lượt xem" },
                                        },
                                        scales: {
                                            x: { title: { display: true, text: "Lượt xem" } },
                                        },
                                    }}
                                />
                            </Box>
                        </Paper>
                    </Box>
                </>
            )}
        </Box>
    );
}

export default AdminDashboard;