/**
 * Cấu hình Endpoint Backend tập trung
 * Tự động fallback về http://localhost:8080 nếu biến môi trường VITE_BACKEND_URL không được định nghĩa.
 */
export const BACKEND_URL = (import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080').replace(/\/+$/, '');
