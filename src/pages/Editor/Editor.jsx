import { useRef, useState, useEffect } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { useLocation } from 'react-router-dom';
import axios from "axios";

export default function EditorComponent() {
    const apiKey = import.meta.env.VITE_API_KEY_TINY;
    const editorRef = useRef(null);
    const location = useLocation();
    // Lấy content được truyền từ state, nếu có
    const passedContent = location.state?.content;
    const [content, setContent] = useState(passedContent || "<p>Đang tải nội dung...</p>");

    useEffect(() => {
        // Nếu không có content từ state, fetch nội dung mặc định
        if (!passedContent) {
            fetch("/donxinviec_dev.json")
                .then((res) => res.json())
                .then((data) => setContent(data.content))
                .catch((err) => console.error("Lỗi tải JSON:", err));
        }
    }, [passedContent]);

    const exportPDF = async () => {
        if (editorRef.current) {
            const contentHtml = editorRef.current.getContent();
            console.log("HTML gửi đi:", contentHtml);

            try {
                const response = await axios.post(
                    "http://localhost:8080/api/pdf/generate",
                    contentHtml,
                    {
                        headers: {
                            "Content-Type": "text/html",
                        },
                        responseType: "blob",
                    }
                );

                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement("a");
                link.href = url;
                link.setAttribute("download", "don_xin_viec.pdf");
                document.body.appendChild(link);
                link.click();
                link.remove();
            } catch (error) {
                console.error("Lỗi khi tạo PDF:", error);
                if (error.response) {
                    console.error("Response data:", error.response.data);
                    console.error("Response status:", error.response.status);
                } else if (error.request) {
                    console.error("Request error:", error.request);
                }
            }
        }
    };

    return (
        <>
            <Editor
                apiKey={apiKey}
                onInit={(_evt, editor) => (editorRef.current = editor)}
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
                        "undo redo | blocks | " +
                        "bold italic forecolor | alignleft aligncenter " +
                        "alignright alignjustify | bullist numlist outdent indent | " +
                        "removeformat | help",
                    content_style:
                        "body { font-family:Helvetica,Arial,sans-serif; font-size:14px; background: #ffffff !important; color: #000 !important; }",
                }}
            />
            <button onClick={exportPDF}>Tải xuống dưới dạng PDF</button>
        </>
    );
}
