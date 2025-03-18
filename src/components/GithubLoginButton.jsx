import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../pages/Auth/AuthContext";
import { Button, CircularProgress, Alert } from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";

function GithubLoginButton() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleGithubLogin = () => {
        setLoading(true);
        setError(null);

        const clientId = import.meta.env.VITE_GITHUB_CLIENT_ID; // Thêm vào .env
        const redirectUri = "http://localhost:5173/auth-callback";
        const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=user:email`;

        window.location.href = githubAuthUrl; // Chuyển hướng tới GitHub
    };

    return (
        <div>
            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            <Button
                variant="contained"
                fullWidth
                startIcon={<GitHubIcon />}
                onClick={handleGithubLogin}
                disabled={loading}
                sx={{
                    backgroundColor: "#24292e", // Màu nền GitHub
                    color: "#ffffff",
                    fontSize: "16px",
                    fontWeight: "bold",
                    padding: "10px 20px",
                    textTransform: "none",
                    "&:hover": {
                        backgroundColor: "#1b1f23",
                    },
                }}
            >
                {loading ? <CircularProgress size={24} color="inherit" /> : "Đăng nhập bằng GitHub"}
            </Button>
        </div>
    );
}

export default GithubLoginButton;
