import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
    return (
        <nav>
            <ul style={{ listStyle: 'none', padding: 0 }}>
                <li>
                    <Link to="/">Home</Link>
                </li>
                <li>
                    <Link to="/auth">Auth</Link>
                </li>
                <li>
                    <Link to="/template/all">Template Page</Link>
                </li>
            </ul>
        </nav>
    );
}

export default Navbar;
