import React, { useState } from 'react';
import '../../stylecomponent/navabaresyle.css';

const Navbar = () => {
  const [activeItem, setActiveItem] = useState('Home');

  const menuItems = ['Home', 'Contact', 'About', 'FAQ'];

  const handleItemClick = (item) => {
    setActiveItem(item);
  };

  return (
    <div className="nav">
      <div className="container">
        {menuItems.map((item, index) => (
          <div
            key={item}
            className={`btn ${activeItem === item ? 'active' : ''}`}
            onClick={() => handleItemClick(item)}
          >
            {item}
          </div>
        ))}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 400 60"
          height="60"
          width="400"
          overflow="visible"
          className="outline"
        >
          <rect
            strokeWidth="5"
            fill="transparent"
            height="60"
            width="400"
            y="0"
            x="0"
            pathLength="100"
            className="rect"
          ></rect>
        </svg>
      </div>
    </div>
  );
};

export default Navbar;