// authcontext.js
export async function fetchUserProfile(token) {
    try {

        // const response = await fetch('http://localhost:8080/api/users/profile/me', {
        //     headers: {
        //         'Authorization': `Bearer ${token}`,
        //     },
        // });

        // deploy

        const urlBE = import.meta.env.VITE_BACKEND_URL;
        const response = await fetch(`${urlBE}/api/users/profile/me`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (response.ok) {
            const user = await response.json();
            //console.log('User profile:', user);
            return user;
        } else {
            throw new Error('Error fetching user profile');
        }
    } catch (error) {
        console.error('Error fetching user profile:', error);
        throw error;
    }
}
