import { useRef, useState, useEffect } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { useLocation } from 'react-router-dom';
import axios from "axios";
import { Container, Typography, Button, Paper, CircularProgress, Box } from "@mui/material";
import { generatePdf } from "../../apis/pdf"; // Import API tạo PDF

export default function EditorComponent() {
    const apiKey = import.meta.env.VITE_API_KEY_TINY;
    const editorRef = useRef(null);
    const location = useLocation();
    const template = location.state?.template;
    const passedContent = location.state?.template.content;
    const [content, setContent] = useState(passedContent || "<p>Đang tải nội dung...</p>");
    const [loading, setLoading] = useState(!passedContent);
    const [editorLoading, setEditorLoading] = useState(true); // Trạng thái loading riêng cho Editor

    useEffect(() => {
        if (!passedContent) {
            fetch("/donxinviec_dev.json")
                .then((res) => res.json())
                .then((data) => {
                    setContent(data.content);
                    setLoading(false);
                })
                .catch((err) => {
                    console.error("Lỗi tải JSON:", err);
                    setLoading(false);
                });
        }
    }, [passedContent]);

    const exportPDF = async () => {
        if (editorRef.current) {
            const htmlContent = editorRef.current.getContent();
            console.log("HTML gửi đi:", htmlContent);

            try {
                await generatePdf(htmlContent);
                console.log('PDF đã được tạo và tải xuống');
            } catch (error) {
                console.error('Lỗi khi tạo PDF:', error);
            }
        }
    };

    return (
        <Container maxWidth="md">
            <Paper elevation={3} sx={{ p: 3, mt: 4, marginTop: '64px', padding: '20px' }}>
                <Typography variant="h5" gutterBottom>
                    Đang chỉnh sửa: {template?.name || "Đang tải..."}
                </Typography>

                {loading ? (
                    <Box display="flex" justifyContent="center" alignItems="center" height={200}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <>
                        {editorLoading && (
                            <Box display="flex" justifyContent="center" alignItems="center" height={500}>
                                <CircularProgress />
                            </Box>
                        )}

                        <Box sx={{ display: editorLoading ? "none" : "block" }}>
                            <Editor
                                apiKey={apiKey}
                                onInit={(_evt, editor) => {
                                    editorRef.current = editor;
                                    setEditorLoading(false); // Khi Editor sẵn sàng, tắt loading
                                }}
                                value={content}
                                onEditorChange={(newContent) => setContent(newContent)}
                                init={{
                                    height: 500,
                                    menubar: false,
                                    plugins: [
                                        "advlist", "autolink", "lists", "link", "image", "charmap", "preview",
                                        "anchor", "searchreplace", "visualblocks", "code", "fullscreen",
                                        "insertdatetime", "media", "table", "code", "help", "wordcount",
                                    ],
                                    toolbar:
                                        "undo redo | blocks | code " +
                                        "bold italic forecolor | alignleft aligncenter " +
                                        "alignright alignjustify | bullist numlist outdent indent | " +
                                        "removeformat | help",
                                    content_style:
                                        "body { font-family:Helvetica,Arial,sans-serif; font-size:14px; background: #ffffff !important; color: #000 !important; }",
                                }}
                            />
                        </Box>
                    </>
                )}

                <Button
                    variant="contained"
                    color="primary"
                    sx={{ mt: 3 }}
                    onClick={exportPDF}
                    disabled={loading}
                >
                    Tải xuống dưới dạng PDF
                </Button>
            </Paper>
        </Container>
    );
}
