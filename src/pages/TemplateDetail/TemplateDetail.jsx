import React from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';

function TemplateDetail() {
    const { templateId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const template = location.state?.template; // Lấy dữ liệu từ state được truyền qua Link

    if (!template) {
        return (
            <div>
                <h1>Template Detail</h1>
                <p>Không có dữ liệu template được truyền từ trang trước. Template ID: {templateId}</p>
                {/* Bạn có thể thêm logic để load template dựa trên ID nếu cần */}
            </div>
        );
    }

    const handleEdit = () => {
        // Chuyển hướng sang Editor và truyền template.content qua state
        navigate('/editor', { state: { content: template.content } });
    };

    return (
        <div>
            <h1>Template Detail</h1>
            <p>ID của template: {template.id}</p>
            <p>Tên template: {template.name}</p>
            <div dangerouslySetInnerHTML={{ __html: template.content }}></div>
            <button onClick={handleEdit}>Chỉnh sửa</button>
        </div>
    );
}

export default TemplateDetail;
