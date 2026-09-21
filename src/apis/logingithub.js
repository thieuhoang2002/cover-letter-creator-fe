
export const loginWithGithub = (setLoading, setError) => {
    // Bật trạng thái loading và reset lỗi
    setLoading(true);
    setError(null);

    // Lấy client ID từ biến môi trường
    const clientId = import.meta.env.VITE_GITHUB_CLIENT_ID;
    const redirectUri = import.meta.env.VITE_GITHUB_REDIRECT_URI || `${window.location.origin}/auth-callback`;

    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=user:email`;

    // Chuyển hướng trình duyệt tới URL đăng nhập
    window.location.href = githubAuthUrl;
};
