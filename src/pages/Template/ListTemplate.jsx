import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllTemplates } from '../../apis/template';// Import hàm từ template.js

function ListTemplate() {
    // Khai báo state
    const [templates, setTemplates] = useState([]); // Lưu danh sách template
    const [loading, setLoading] = useState(true);   // Trạng thái tải dữ liệu
    const [error, setError] = useState(null);       // Lưu lỗi nếu có

    // Gọi API khi component mount
    useEffect(() => {
        const fetchTemplates = async () => {
            try {
                const data = await getAllTemplates(); // Sử dụng hàm từ template.js
                setTemplates(data);                   // Cập nhật state với dữ liệu từ API
                setLoading(false);                    // Tắt trạng thái đang tải
            } catch (err) {
                setError('Không thể tải danh sách template'); // Lưu thông báo lỗi
                setLoading(false);                            // Tắt trạng thái đang tải
            }
        };

        fetchTemplates(); // Thực thi hàm gọi API
    }, []); // Mảng rỗng để chỉ gọi API một lần khi component mount

    // Xử lý giao diện trong các trường hợp khác nhau
    if (loading) {
        return <div>Đang tải...</div>; // Hiển thị khi đang tải dữ liệu
    }

    if (error) {
        return <div>{error}</div>; // Hiển thị lỗi nếu có
    }

    // Render danh sách template khi dữ liệu đã sẵn sàng
    return (
        <div>
            <h1>List Template</h1>
            <ul>
                {templates.map((item) => (
                    <li key={item.id}>
                        ID: {item.id} - Name: <Link to={`/template/${item.id}`} state={{ template: item }}>{item.name}</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ListTemplate;