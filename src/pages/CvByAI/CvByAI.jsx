import React, { useState } from "react";
import {
    Box,
    Typography,
    Button,
    Paper,
    CircularProgress,
    Snackbar,
    Alert,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function CvByAI() {
    const navigate = useNavigate();
    const [theme, setTheme] = useState("dark_modern");
    const [layout, setLayout] = useState("2_columns_responsive");
    const [position, setPosition] = useState("");
    const [loading, setLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success",
    });

    const handleGenerateCV = async () => {
        if (!position.trim()) {
            setSnackbar({
                open: true,
                message: "Vui lòng nhập vị trí ứng tuyển.",
                severity: "warning",
            });
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post("http://localhost:8080/api/ai/generate-cv", {
                action: "generate_html_cv",
                theme: theme,
                placeholders: [
                    "Ảnh đại diện", "Họ và tên", "Chuyên ngành",
                    "Vị trí ứng tuyển", // dòng mới
                    "Email", "Số điện thoại", "Địa chỉ", "Ngày sinh",
                    "Kỹ năng", "Sở thích", "Kinh nghiệm làm việc",
                    "Học vấn", "Chứng chỉ"
                ],
                layout: layout,
                font: "Poppins",
                styles: "inline_css_with_gradients",
                response_format: "xaiArtifact",
                position: position.trim(),
            });

            const htmlContent = response.data.content;

            navigate("/modern-cv-editor", {
                state: {
                    template: {
                        name: `CV cho vị trí ${position}`,
                        type: theme,
                        content: htmlContent,
                    },
                },
            });

            setSnackbar({
                open: true,
                message: "Tạo CV thành công! Đang chuyển hướng...",
                severity: "success",
            });
        } catch (error) {
            console.error("Lỗi khi tạo CV:", error);
            setSnackbar({
                open: true,
                message: "Không thể tạo CV. Vui lòng thử lại.",
                severity: "error",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            sx={{
                p: 4,
                minHeight: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                background: "linear-gradient(to right, #e0f7fa, #e1f5fe)",
            }}
        >
            <Paper
                sx={{
                    p: 4,
                    borderRadius: 3,
                    maxWidth: 500,
                    width: "100%",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
                }}
            >
                <Typography
                    variant="h4"
                    gutterBottom
                    sx={{ fontWeight: 600, color: "#1976d2", mb: 3, textAlign: "center" }}
                >
                    Tạo CV với AI
                </Typography>

                <TextField
                    label="Vị trí ứng tuyển"
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    fullWidth
                    sx={{ mb: 3 }}
                />

                <FormControl fullWidth sx={{ mb: 3 }}>
                    <InputLabel>Chủ đề (Theme)</InputLabel>
                    <Select
                        value={theme}
                        onChange={(e) => setTheme(e.target.value)}
                        label="Chủ đề"
                    >
                        <MenuItem value="dark_modern">Hiện đại (Dark)</MenuItem>
                        <MenuItem value="clean_simple">Đơn giản (Sáng)</MenuItem>
                    </Select>
                </FormControl>

                <FormControl fullWidth sx={{ mb: 3 }}>
                    <InputLabel>Bố cục</InputLabel>
                    <Select
                        value={layout}
                        onChange={(e) => setLayout(e.target.value)}
                        label="Bố cục"
                    >
                        <MenuItem value="1_column">1 cột</MenuItem>
                        <MenuItem value="2_columns_responsive">2 cột (responsive)</MenuItem>
                    </Select>
                </FormControl>

                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleGenerateCV}
                    disabled={loading}
                    fullWidth
                    sx={{ py: 1.5 }}
                >
                    {loading ? <CircularProgress size={24} /> : "Tạo CV"}
                </Button>

                <Snackbar
                    open={snackbar.open}
                    autoHideDuration={3000}
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                >
                    <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
                </Snackbar>
            </Paper>
        </Box>
    );
}

export default CvByAI;
