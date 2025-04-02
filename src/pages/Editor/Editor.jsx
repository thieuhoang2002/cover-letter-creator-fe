import { useRef, useState, useEffect } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { useLocation, useNavigate } from 'react-router-dom';
import {
    Container, Typography, Button, Paper, CircularProgress, Box,
    Grid, Divider, Tooltip, Snackbar, Alert as MuiAlert
} from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import DownloadIcon from '@mui/icons-material/Download';
import RestoreIcon from '@mui/icons-material/Restore';
import { generatePdf } from "../../apis/pdf";
import { useAuth } from "../../pages/Auth/AuthContext";

export default function EditorComponent() {
    const apiKey = import.meta.env.VITE_API_KEY_TINY;
    const editorRef = useRef(null);
    const location = useLocation();
    const navigate = useNavigate();
    const template = location.state?.template;
    const passedContent = location.state?.template?.content;
    const [content, setContent] = useState(passedContent || "<p>Đang tải nội dung...</p>");
    const [loading, setLoading] = useState(!passedContent);
    const [editorLoading, setEditorLoading] = useState(true);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const { userId, email } = useAuth();

    // Kiểm tra và chuyển hướng nếu thiếu dữ liệu
    useEffect(() => {
        if (!passedContent) {
            console.warn("Không có passedContent, chuyển hướng về /template/all");
            setSnackbarMessage('Không tìm thấy nội dung template!');
            setSnackbarSeverity('warning');
            setSnackbarOpen(true);
            setTimeout(() => navigate("/template/all"), 2000);
        }
    }, [passedContent, navigate]);

    const handleBack = () => {
        navigate("/template/all");
    };

    const exportPDF = async () => {
        if (!editorRef.current) return;

        const htmlContent = editorRef.current.getContent();
        if (!userId || !email) {
            setSnackbarMessage('Vui lòng đăng nhập để tạo PDF!');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
            return;
        }

        const requestData = {
            id: userId,
            email: email,
            templateName: template?.name,
            date: new Date().toLocaleDateString(),
            htmlContent: htmlContent
        };

        try {
            setLoading(true);
            await generatePdf(requestData);
            setSnackbarMessage('PDF đã được tạo thành công!');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
        } catch (error) {
            console.error('Lỗi khi tạo PDF:', error);
            setSnackbarMessage('Lỗi khi tạo PDF, vui lòng thử lại!');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        } finally {
            setLoading(false);
            //chuyen den trang home
            setTimeout(() => {
                navigate("/pdf-exported");
            }, 2000);
        }
    };

    const handleSaveDraft = () => {
        if (editorRef.current) {
            const draftContent = editorRef.current.getContent();
            localStorage.setItem(`draft_${template?.id}_${userId}`, draftContent);
            setSnackbarMessage('Đã lưu nháp thành công!');
            setSnackbarSeverity('info');
            setSnackbarOpen(true);
        }
    };

    const handleResetToDefault = () => {
        if (editorRef.current && passedContent) {
            setContent(passedContent); // Đặt lại nội dung về trạng thái ban đầu
            editorRef.current.setContent(passedContent); // Cập nhật trực tiếp editor
            setSnackbarMessage('Đã khôi phục về trạng thái mặc định!');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
        }
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4, padding: '20px' }}>
            <Paper elevation={3} sx={{ p: 3, borderRadius: '12px', backgroundColor: '#fff' }}>
                {/* Header */}
                <Grid container alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
                    <Grid item>
                        <Typography variant="h5" gutterBottom>
                            Đang chỉnh sửa: {template?.name || "Đang tải..."}
                        </Typography>
                        <Typography variant="subtitle2" color="text.secondary">
                            Loại: {template?.type || 'Không xác định'}
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Tooltip title="Quay lại danh sách">
                            <Button
                                variant="outlined"
                                color="secondary"
                                startIcon={<ArrowBackIcon />}
                                onClick={handleBack}
                            >
                                Quay lại
                            </Button>
                        </Tooltip>
                    </Grid>
                </Grid>

                <Divider sx={{ mb: 3 }} />

                {/* Editor */}
                {loading ? (
                    <Box display="flex" justifyContent="center" alignItems="center" height={500}>
                        <CircularProgress size={50} />
                        <Typography variant="body1" sx={{ ml: 2 }}>Đang tải file...</Typography>
                    </Box>
                ) : (
                    <>
                        {editorLoading && (
                            <Box display="flex" justifyContent="center" alignItems="center" height={500}>
                                <CircularProgress />
                            </Box>
                        )}
                        <Box sx={{ display: editorLoading ? "none" : "block", mb: 3 }}>
                            <Editor
                                apiKey={apiKey}
                                onInit={(_evt, editor) => {
                                    editorRef.current = editor;
                                    setEditorLoading(false);
                                    const savedDraft = localStorage.getItem(`draft_${template?.id}_${userId}`);
                                    if (savedDraft) setContent(savedDraft);
                                }}
                                value={content}
                                onEditorChange={(newContent) => setContent(newContent)}
                                init={{
                                    height: 600,
                                    menubar: true,
                                    plugins: [
                                        "advlist autolink lists link image charmap preview anchor",
                                        "searchreplace visualblocks code fullscreen",
                                        "insertdatetime media table code help wordcount",
                                        "template paste textpattern importcss"
                                    ],
                                    toolbar:
                                        "undo redo | formatselect | bold italic underline forecolor backcolor | " +
                                        "alignleft aligncenter alignright alignjustify | " +
                                        "bullist numlist outdent indent | link image media table | " +
                                        "removeformat code preview fullscreen | help",
                                    content_style:
                                        "body { font-family: 'Roboto', Helvetica, Arial, sans-serif; font-size: 16px; background: #ffffff !important; color: #000 !important; }",
                                    templates: [
                                        { title: 'Basic Template', description: 'A simple template', content: '<p>Start here...</p>' }
                                    ],
                                    statusbar: true,
                                    resize: true,
                                }}
                            />
                        </Box>

                        {/* Nút hành động */}
                        <Grid container spacing={2} justifyContent="flex-end">
                            <Grid item>
                                <Tooltip title="Khôi phục nội dung ban đầu">
                                    <Button
                                        variant="outlined"
                                        color="secondary"
                                        startIcon={<RestoreIcon />}
                                        onClick={handleResetToDefault}
                                        disabled={loading || editorLoading}
                                    >
                                        Reset về mặc định
                                    </Button>
                                </Tooltip>
                            </Grid>
                            <Grid item>
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    startIcon={<SaveIcon />}
                                    onClick={handleSaveDraft}
                                    disabled={loading || editorLoading}
                                >
                                    Lưu nháp
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    startIcon={<DownloadIcon />}
                                    onClick={exportPDF}
                                    disabled={loading || editorLoading}
                                >
                                    Tải xuống PDF
                                </Button>
                            </Grid>
                        </Grid>
                    </>
                )}
            </Paper>

            {/* Snackbar thông báo */}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <MuiAlert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </MuiAlert>
            </Snackbar>
        </Container>
    );
}