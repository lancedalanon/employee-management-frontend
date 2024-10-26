import React from 'react';

interface LogoutDropdownProps {
  onLogout: () => void;
}

const LogoutDropdown: React.FC<LogoutDropdownProps> = ({ onLogout }) => {
  return (
    <div className="absolute right-4 top-12 mt-4 bg-white shadow-lg rounded-lg w-40 py-2 z-50 border">
      <ul className="flex flex-col">
        <li>
          <button
            onClick={onLogout}
            className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
          >
            Logout
          </button>
        </li>
      </ul>
    </div>
  );
};

export default LogoutDropdown;
