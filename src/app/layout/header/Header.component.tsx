import React from "react";
import './Header.styles.scss';
import {Link} from "react-router-dom";

const Header: React.FC = () => {
    return (
        <header>
            <h1>ToDoApp</h1>
            <nav>
                <ul>
                    <li><Link to="/">Week View</Link></li>
                    <li><Link to="/tasks">Tasks</Link></li>
                </ul>
            </nav>
        </header>
    );
};
export default Header;