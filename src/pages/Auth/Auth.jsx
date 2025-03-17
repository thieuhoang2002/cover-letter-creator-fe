import React from 'react';
import Register from './Register';
import Login from './Login';
function Auth() {
    return (
        <div>
            <h1>Auth Page</h1>
            {/* Phần giao diện chung của Auth Page */}
            <Login></Login>
            <br />
            <Register></Register>
        </div>
    );
}

export default Auth;
