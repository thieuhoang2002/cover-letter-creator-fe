import React, { useState, useEffect } from "react";
import {
    Box, Typography, Button, Dialog, DialogActions, DialogContent, DialogTitle,
    TextField, Snackbar, CircularProgress, Select, MenuItem, InputLabel, FormControl
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Editor } from "@tinymce/tinymce-react"; // Import TinyMCE Editor
import { getAllTemplates, createTemplate, deleteTemplate, updateTemplate } from "../../apis/template";

function TemplateManager() {
    const apiKey = import.meta.env.VITE_API_KEY_TINY;
    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [newTemplate, setNewTemplate] = useState({
        name: "",
        type: "",
        content: "",  // TinyMCE sẽ cập nhật giá trị này
        image: "",
        status: "active"
    });
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");

    useEffect(() => {
        fetchTemplates();
    }, []);

    const fetchTemplates = async () => {
        try {
            setLoading(true);
            const data = await getAllTemplates();
            setTemplates(data);
        } catch (error) {
            console.error("Lỗi khi tải danh sách mẫu đơn:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenDialog = (template = null) => {
        if (template) {
            setIsEdit(true);
            setSelectedTemplate(template);
            setNewTemplate({
                name: template.name,
                type: template.type,
                content: template.content, // Load nội dung vào TinyMCE
                image: template.image || "",
                status: template.status
            });
        } else {
            setIsEdit(false);
            setNewTemplate({ name: "", type: "", content: "", image: "", status: "active" });
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedTemplate(null);
    };

    const handleSaveTemplate = async () => {
        try {
            if (isEdit && selectedTemplate) {
                await updateTemplate(selectedTemplate.id, newTemplate);
                setSnackbarMessage("Cập nhật mẫu đơn thành công!");
            } else {
                await createTemplate(newTemplate);
                setSnackbarMessage("Thêm mẫu đơn thành công!");
            }
            setSnackbarOpen(true);
            fetchTemplates();
            handleCloseDialog();
        } catch (error) {
            console.error("Lỗi khi lưu mẫu đơn:", error);
        }
    };

    const handleDeleteTemplate = async (id) => {
        try {
            await deleteTemplate(id);
            setSnackbarMessage("Xóa mẫu đơn thành công!");
            setSnackbarOpen(true);
            fetchTemplates();
        } catch (error) {
            console.error("Lỗi khi xóa mẫu đơn:", error);
        }
    };

    const columns = [
        { field: "id", headerName: "ID", width: 70 },
        { field: "name", headerName: "Tên Mẫu Đơn", width: 200 },
        { field: "type", headerName: "Loại", width: 150 },
        { field: "views", headerName: "Lượt xem", width: 100 },
        { field: "status", headerName: "Trạng thái", width: 120 },
        {
            field: "actions",
            headerName: "Hành động",
            width: 250,
            renderCell: (params) => (
                <>
                    <Button color="primary" onClick={() => handleOpenDialog(params.row)}>
                        Chỉnh sửa
                    </Button>
                    {/* <Button color="error" onClick={() => handleDeleteTemplate(params.row.id)}>
                        Xóa
                    </Button> */}
                </>
            ),
        },
    ];

    return (
        <Box sx={{ width: "100%", p: 3 }}>
            <Typography variant="h6" gutterBottom>
                Quản lý Mẫu Đơn
            </Typography>
            <Button variant="contained" color="primary" onClick={() => handleOpenDialog()}>
                Thêm Mẫu Đơn Mới
            </Button>

            <Box sx={{ height: 400, width: "100%", mt: 2 }}>
                {loading ? <CircularProgress /> : <DataGrid rows={templates} columns={columns} pageSize={5} />}
            </Box>

            {/* Dialog Thêm / Chỉnh sửa template */}
            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth disableEnforceFocus>
                <DialogTitle>{isEdit ? "Chỉnh sửa Template" : "Thêm Template"}</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Tên Mẫu Đơn"
                        fullWidth
                        margin="normal"
                        value={newTemplate.name}
                        onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                    />
                    <TextField
                        label="Loại Mẫu Đơn"
                        fullWidth
                        margin="normal"
                        value={newTemplate.type}
                        onChange={(e) => setNewTemplate({ ...newTemplate, type: e.target.value })}
                    />

                    {/* TinyMCE Editor */}
                    <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
                        Nội dung
                    </Typography>
                    <Editor
                        apiKey={apiKey}
                        value={newTemplate.content}
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
                        onEditorChange={(content) => setNewTemplate({ ...newTemplate, content })}
                    />

                    <TextField
                        label="Hình ảnh (URL)"
                        fullWidth
                        margin="normal"
                        value={newTemplate.image}
                        onChange={(e) => setNewTemplate({ ...newTemplate, image: e.target.value })}
                    />
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Trạng thái</InputLabel>
                        <Select
                            value={newTemplate.status}
                            onChange={(e) => setNewTemplate({ ...newTemplate, status: e.target.value })}
                        >
                            <MenuItem value="active">Active</MenuItem>
                            <MenuItem value="inactive">Inactive</MenuItem>
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Hủy</Button>
                    <Button onClick={handleSaveTemplate} color="primary">
                        {isEdit ? "Cập nhật" : "Thêm"}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar thông báo */}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={() => setSnackbarOpen(false)}
                message={snackbarMessage}
            />
        </Box>
    );
}

export default TemplateManager;
