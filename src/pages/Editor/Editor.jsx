import { useRef, useState, useEffect } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { useLocation, useNavigate } from 'react-router-dom';
import {
    Container, Typography, Button, Paper, CircularProgress, Box,
    Grid, Divider, Tooltip, Snackbar
} from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import DownloadIcon from '@mui/icons-material/Download';
import RestoreIcon from '@mui/icons-material/Restore';
import { generatePdf } from "../../apis/pdf";
import { useAuth } from "../../pages/Auth/AuthContext";
import { fetchUserProfile } from '../../apis/authcontext';
import he from 'he';
import Alert from '@mui/material/Alert';

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
    const { userId, email, token } = useAuth();
    const [templateUser, setTemplateUser] = useState(null);


    useEffect(() => {
        const fetchData = async () => {
            if (!passedContent) {
                console.warn("Không có passedContent, chuyển hướng về /template/all");
                setSnackbarMessage('Không tìm thấy nội dung template!');
                setSnackbarSeverity('warning');
                setSnackbarOpen(true);
                setTimeout(() => navigate("/template/all"), 2000);
                return;
            }
    
            try {
                const user = await fetchUserProfile(token);
                setTemplateUser(user);
                //console.log("Passed content:", passedContent);
                //console.log("User:", user);
            } catch (error) {
                console.error("Lỗi khi lấy thông tin người dùng:", error);
            }
        };
    
        fetchData();
    }, [passedContent, navigate, token]);

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

    const fillUserInfo = () => {
        if (!editorRef.current || !userId) return;
    
        let rawContent = editorRef.current.getContent();
        rawContent = he.decode(rawContent); // <-- Decode HTML entities
        //console.log("raw content:", rawContent);
    
        const formattedBirthday = new Date(templateUser.birthday).toLocaleDateString('vi-VN');
    
        const replacedContent = rawContent
            .replace(/\[Họ và tên\]/g, templateUser.name)
            .replace(/\[Ngày sinh\]/g, formattedBirthday)
            .replace(/\[Địa chỉ\]/g, templateUser.address || '')
            .replace(/\[Số điện thoại\]/g, templateUser.phone || '')
            .replace(/\[Email\]/g, templateUser.email || '')
            .replace(/\[Trường\]/g, templateUser.school || '')
            .replace(/\[Chuyên ngành\]/g, templateUser.specialization || '');
    
        setContent(replacedContent);
        editorRef.current.setContent(replacedContent);
    
        setSnackbarMessage('Đã thêm thông tin cá nhân vào đơn!');
        setSnackbarSeverity('info');
        setSnackbarOpen(true);
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
                                    selector: 'textarea#open-source-plugins',
                                    plugins: 'preview importcss searchreplace autolink autosave save directionality code visualblocks visualchars fullscreen image link media codesample table charmap pagebreak nonbreaking anchor insertdatetime advlist lists wordcount help charmap quickbars emoticons accordion',
                                    editimage_cors_hosts: ['picsum.photos'],
                                    menubar: 'file edit view insert format tools table help',
                                    toolbar: "undo redo | accordion accordionremove | blocks fontfamily fontsize | bold italic underline strikethrough | align numlist bullist | link image | table media | lineheight outdent indent| forecolor backcolor removeformat | charmap emoticons | code fullscreen preview | save print | pagebreak anchor codesample | ltr rtl",
                                    autosave_ask_before_unload: true,
                                    autosave_interval: '30s',
                                    autosave_prefix: '{path}{query}-{id}-',
                                    autosave_restore_when_empty: false,
                                    autosave_retention: '2m',
                                    image_advtab: true,
                                    link_list: [
                                      { title: 'My page 1', value: 'https://www.tiny.cloud' },
                                      { title: 'My page 2', value: 'http://www.moxiecode.com' }
                                    ],
                                    image_list: [
                                      { title: 'My page 1', value: 'https://www.tiny.cloud' },
                                      { title: 'My page 2', value: 'http://www.moxiecode.com' }
                                    ],
                                    image_class_list: [
                                      { title: 'None', value: '' },
                                      { title: 'Some class', value: 'class-name' }
                                    ],
                                    importcss_append: true,
                                    file_picker_callback: (callback, value, meta) => {
                                      /* Provide file and text for the link dialog */
                                      if (meta.filetype === 'file') {
                                        callback('https://www.google.com/logos/google.jpg', { text: 'My text' });
                                      }
                                  
                                      /* Provide image and alt text for the image dialog */
                                      if (meta.filetype === 'image') {
                                        callback('https://www.google.com/logos/google.jpg', { alt: 'My alt text' });
                                      }
                                  
                                      /* Provide alternative source and posted for the media dialog */
                                      if (meta.filetype === 'media') {
                                        callback('movie.mp4', { source2: 'alt.ogg', poster: 'https://www.google.com/logos/google.jpg' });
                                      }
                                    },
                                    height: 600,
                                    image_caption: true,
                                    quickbars_selection_toolbar: 'bold italic | quicklink h2 h3 blockquote quickimage quicktable',
                                    noneditable_class: 'mceNonEditable',
                                    toolbar_mode: 'sliding',
                                    contextmenu: 'link image table',
                                    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:16px }'
                                  }}
                            />
                        </Box>

                        {/* Nút hành động */}
                        <Grid container spacing={2} justifyContent="flex-end">
                            <Grid item>
                                <Tooltip title="Thêm thông tin cá nhân vào đơn">
                                    <Button
                                        variant="outlined"
                                        color="success"
                                        onClick={fillUserInfo}
                                        disabled={loading || editorLoading || !templateUser}
                                    >
                                        Thêm thông tin
                                    </Button>
                                </Tooltip>
                            </Grid>
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
                            {/* <Grid item>
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    startIcon={<SaveIcon />}
                                    onClick={handleSaveDraft}
                                    disabled={loading || editorLoading}
                                >
                                    Lưu nháp
                                </Button>
                            </Grid> */}
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
                <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Container>
    );
}