import React from 'react';
import { Outlet } from 'react-router-dom';

function ModernCV() {
    return (
        <div>
            {/* <h1>Template Page</h1> */}
            {/* Phần giao diện chung của Template Page */}

            {/* Nơi hiển thị các component con (ListTemplate) */}
            <Outlet />
        </div>
    );
}

export default ModernCV;
