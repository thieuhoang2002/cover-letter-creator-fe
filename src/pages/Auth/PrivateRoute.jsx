import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";

const PrivateRoute = ({ allowedRoles = [] }) => {
    const { role } = useAuth(); // Lấy role từ context

    if (!role) {
        return <Navigate to="/login" replace />; // Chưa đăng nhập -> Chuyển hướng về login
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
        return <Navigate to="/" replace />; // Không có quyền -> Chuyển hướng về trang chủ
    }

    return <Outlet />; // Nếu hợp lệ, hiển thị component
};

export default PrivateRoute;
