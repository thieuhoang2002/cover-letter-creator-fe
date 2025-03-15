import React from 'react';
import { Link } from 'react-router-dom';
import { TEMPLATES } from '../../../public/template';

function ListTemplate() {
    return (
        <div>
            <h1>List Template</h1>
            <ul>
                {TEMPLATES.map((item) => (
                    <li key={item.id}>
                        ID: {item.id} - Name: <Link to={`/template/${item.id}`} state={{ template: item }}>{item.name}</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ListTemplate;
