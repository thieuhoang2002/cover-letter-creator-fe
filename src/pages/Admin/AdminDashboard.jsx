import React, { useEffect, useState } from "react";
import { Box, Typography, Card, CardContent, Grid } from "@mui/material";
import { getAllUsers } from "../../apis/user";
import { getAllTemplates } from "../../apis/template";

function AdminDashboard() {
    const [userCount, setUserCount] = useState(0);
    const [templateCount, setTemplateCount] = useState(0);
    const [totalViews, setTotalViews] = useState(0);

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
        </Box>
    );
}

export default AdminDashboard;
// 