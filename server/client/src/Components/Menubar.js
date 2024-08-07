import React from 'react';
import { Link } from 'react-router-dom';
import './Menubar.css';

const MenuBar = () => {
  return (
    <nav className="menu-bar">
      <ul>
        <li><Link to="/">Home</Link></li>

      </ul>
    </nav>
  );
};

export default MenuBar;
