/**
 * Utility hỗ trợ tải file Binary Stream (Blob) PDF trực tiếp về máy người dùng
 * và giải mã thông báo lỗi dạng Blob từ backend.
 */

/**
 * Trích xuất tên file từ header Content-Disposition hoặc sử dụng tên mặc định
 * @param {string|null} contentDisposition Header Content-Disposition từ Axios response
 * @param {string} fallbackName Tên file dự phòng
 * @returns {string} Tên file đã chuẩn hóa
 */
export const extractFilename = (contentDisposition, fallbackName = 'CV_Export.pdf') => {
    let fileName = fallbackName;
    if (contentDisposition) {
        // Hỗ trợ chuẩn RFC 5987 (filename*=UTF-8''...)
        const utf8Match = contentDisposition.match(/filename\*=UTF-8''([^;]+)/i);
        if (utf8Match && utf8Match[1]) {
            try {
                fileName = decodeURIComponent(utf8Match[1]);
            } catch (e) {
                console.warn('Lỗi khi decode UTF-8 filename:', e);
            }
        } else {
            // Hỗ trợ chuẩn thông thường (filename="...")
            const regularMatch = contentDisposition.match(/filename=["']?([^"';]+)["']?/i);
            if (regularMatch && regularMatch[1]) {
                fileName = regularMatch[1].trim();
            }
        }
    }

    // Đảm bảo đuôi .pdf
    if (!fileName.toLowerCase().endsWith('.pdf')) {
        fileName += '.pdf';
    }

    return fileName;
};

/**
 * Tạo Blob URL, kích hoạt thẻ download ảo và giải phóng bộ nhớ
 * @param {Blob|ArrayBuffer} data Dữ liệu nhị phân PDF
 * @param {string} fileName Tên file cần lưu
 */
export const triggerBlobDownload = (data, fileName = 'CV_Export.pdf') => {
    const blob = data instanceof Blob ? data : new Blob([data], { type: 'application/pdf' });
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Giải phóng bộ nhớ sau 2 giây để tránh memory leak
    setTimeout(() => {
        window.URL.revokeObjectURL(downloadUrl);
    }, 2000);
};

/**
 * Trích xuất thông báo lỗi khi Axios gửi request với responseType: 'blob'
 * @param {Error} error Đối tượng lỗi từ Axios
 * @param {string} defaultMessage Thông báo lỗi mặc định
 * @returns {Promise<string>} Chuỗi thông báo lỗi
 */
export const parseBlobError = async (error, defaultMessage = 'Lỗi khi tạo PDF, vui lòng thử lại!') => {
    if (error.response?.data instanceof Blob) {
        try {
            const errorText = await error.response.data.text();
            try {
                const errorJson = JSON.parse(errorText);
                return errorJson.message || errorJson.error || errorText || defaultMessage;
            } catch {
                return errorText || defaultMessage;
            }
        } catch {
            return defaultMessage;
        }
    }
    return error.response?.data?.message || (typeof error.response?.data === 'string' ? error.response.data : null) || error.message || defaultMessage;
};
