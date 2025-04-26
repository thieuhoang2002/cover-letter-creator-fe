// authcallbackgithub.js
import { jwtDecode } from 'jwt-decode';

export async function handleGithubCallback(code, login, navigate) {
    try {

        // const response = await fetch('http://localhost:8080/api/users/github-login', {
        //         method: 'POST',
        //         headers: { 'Content-Type': 'application/json' },
        //         body: JSON.stringify({ code }),
        //     });

        // deploy

        const urlBE = import.meta.env.VITE_BACKEND_URL;
        const response = await fetch(`${urlBE}/api/users/github-login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code }),
        });

        //console.log('Response Status:', response.status); // Log trạng thái response

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText);
        }

        const jwt = await response.text();
        //console.log('JWT from GitHub:', jwt);
        await login(jwt);

        // Giải mã token để lấy role
        const decodedJwt = jwtDecode(jwt);
        const role = decodedJwt.role;

        // Điều hướng dựa trên role
        navigate(role === 'admin' ? '/admin' : '/');
    } catch (error) {
        console.error('GitHub login error:', error.message);
        throw error;
    }
}
