import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../pages/Auth/AuthContext";
import { Button, CircularProgress, Alert } from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";

// Import hàm từ file loginGithub.js
import { loginWithGithub } from "../apis/logingithub";

function GithubLoginButton() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleGithubLogin = () => {
        // Gọi hàm loginWithGithub với việc truyền các hàm setLoading và setError
        loginWithGithub(setLoading, setError);
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
                    backgroundColor: "#24292e",
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
