import React, { useEffect, useState } from "react";
import { Box, Typography, Card, CardContent, Grid } from "@mui/material";
import { getAllUsers } from "../../apis/profile";
import { getAllTemplates } from "../../apis/template";
import { getTopViewedTemplates } from "../../apis/template";

function AdminDashboard() {
    const [userCount, setUserCount] = useState(0);
    const [templateCount, setTemplateCount] = useState(0);
    const [totalViews, setTotalViews] = useState(0);
    const [topTemplates, setTopTemplates] = useState([]);

    useEffect(() => {
        // Lấy số lượng người dùng
        getAllUsers()
            .then(users => setUserCount(users.length))
            .catch(err => console.error("Lỗi khi lấy danh sách người dùng:", err));

        // Lấy số lượng template và tổng view
        getAllTemplates()
            .then(templates => {
                setTemplateCount(templates.length);
                const views = templates.reduce((sum, template) => sum + (template.views || 0), 0);
                setTotalViews(views);
            })
            .catch(err => console.error("Lỗi khi lấy danh sách template:", err));

        getTopViewedTemplates()
            .then(data => setTopTemplates(data))
            .catch(err => console.error("Lỗi khi lấy top-viewed templates:", err));
        
    }, []);

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
                Chào mừng đến với trang quản trị
            </Typography>
    
            <Grid container spacing={3}>
                <Grid item xs={12} sm={4}>
                    <Card sx={{ backgroundColor: "#2196f3", color: "white" }}>
                        <CardContent>
                            <Typography variant="h6">Tổng số người dùng</Typography>
                            <Typography variant="h4">{userCount}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Card sx={{ backgroundColor: "#4caf50", color: "white" }}>
                        <CardContent>
                            <Typography variant="h6">Tổng số template</Typography>
                            <Typography variant="h4">{templateCount}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Card sx={{ backgroundColor: "#ff9800", color: "white" }}>
                        <CardContent>
                            <Typography variant="h6">Tổng lượt xem template</Typography>
                            <Typography variant="h4">{totalViews}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
    
            {/* Box hiển thị Top 5 Template */}
            <Box sx={{ mt: 5 }}>
                <Typography variant="h6" gutterBottom>
                    Top 5 Templates được xem nhiều nhất
                </Typography>
                <Grid container spacing={2}>
                    {topTemplates.map((template, index) => (
                        <Grid item xs={12} sm={6} md={4} key={template.id}>
                            <Card variant="outlined" sx={{ p: 2 }}>
                                <Typography variant="subtitle2" color="text.secondary">
                                    #{index + 1}
                                </Typography>
                                <Typography variant="h6">{template.name}</Typography>
                                <Typography variant="body2">Lượt xem: {template.views}</Typography>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </Box>
    );
    
}

export default AdminDashboard;
// 