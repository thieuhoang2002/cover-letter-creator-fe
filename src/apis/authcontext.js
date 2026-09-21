// authcontext.js
import { BACKEND_URL } from './config';

export async function fetchUserProfile(token) {
    try {
        const response = await fetch(`${BACKEND_URL}/api/users/profile/me`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (response.ok) {
            const user = await response.json();
            console.log('User profile:', user);
            return user;
        } else {
            throw new Error('Error fetching user profile');
        }
    } catch (error) {
        console.error('Error fetching user profile:', error);
        throw error;
    }
}
