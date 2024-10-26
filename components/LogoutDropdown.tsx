import React, { useState } from 'react';
import { TbTriangleInvertedFilled } from "react-icons/tb";

interface LogoutDropdownProps {
  onLogout: () => void; // Function to call when logging out
}

const LogoutDropdown: React.FC<LogoutDropdownProps> = ({ onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Toggle dropdown visibility
  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div className="relative">
      {/* Triangle Icon */}
      <div 
        onClick={toggleDropdown}
        className="cursor-pointer"
      >
        <TbTriangleInvertedFilled size={16}/>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 bg-white text-black shadow-lg rounded mt-4">
          <button
            onClick={onLogout}
            className="block px-4 py-2 hover:bg-gray-200 w-full text-left"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default LogoutDropdown;
