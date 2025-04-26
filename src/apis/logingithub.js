
export const loginWithGithub = (setLoading, setError) => {
    // Bật trạng thái loading và reset lỗi
    setLoading(true);
    setError(null);

    // Lấy client ID từ biến môi trường
    const clientId = import.meta.env.VITE_GITHUB_CLIENT_ID;
    const redirectUri = "http://localhost:5173/auth-callback";

    // deploy
    //const redirectUri = "https://cover-letter-creator-fe.vercel.app/auth-callback";


    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=user:email`;

    // Chuyển hướng trình duyệt tới URL đăng nhập
    window.location.href = githubAuthUrl;
};
