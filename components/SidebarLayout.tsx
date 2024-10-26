import { ReactNode, useEffect, useRef, useState } from "react";
import { LuArrowLeftToLine, LuArrowRightToLine } from "react-icons/lu";
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import Avatar from './Avatar'; 
import { useRouter } from 'next/navigation';
import { logout } from '@/store/authSlice';
import { clearUserData } from '@/store/userSlice';
import LogoutDropdown from '@/components/LogoutDropdown';
import CookieUtils from '@/app/utils/useCookies';
import { GiHamburgerMenu } from "react-icons/gi";

interface LayoutProps {
  children: ReactNode;
}

const SidebarLayout: React.FC<LayoutProps> = ({ children }) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isOffcanvasOpen, setIsOffcanvasOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);
  const username = useSelector((state: RootState) => state.user.username);
  const avatarUrl = useSelector((state: RootState) => state.user.avatarUrl);
  const router = useRouter();
  const dispatch = useDispatch();
  const avatarRef = useRef<HTMLDivElement>(null);

  // Control loading based on username availability
  useEffect(() => {
    if (username !== null) {
      setIsLoading(false);
    }
  }, [username]);

  // Logout handler
  const handleLogout = async () => {
    await dispatch(clearUserData());
    await dispatch(logout());
    CookieUtils.deleteCookie('userData', { path: '/' });
    router.push('/auth/login');
  };

  // Toggle Sidebar on larger screens
  const toggleSidebar = () => {
    setIsMinimized((prev) => !prev);
  };

  // Toggle dropdown for user avatar
  const toggleDropdown = () => {
    setShowDropdown(prev => !prev);
  };

  // Control offcanvas menu visibility on mobile
  const openOffcanvas = () => {
    setIsOffcanvasOpen(true);
  };

  const closeOffcanvas = () => {
    setIsOffcanvasOpen(false);
  };

  // Close offcanvas and reset when resizing screen
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsOffcanvasOpen(false); // Close offcanvas on large screens
        setIsMinimized(false); // Reset sidebar
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (avatarRef.current && !avatarRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar - visible on larger screens */}
      <aside
        className={`bg-primary flex flex-col p-4 fixed h-full text-white transition-all duration-300 ease-in-out transform z-20 ${
          isMinimized ? "w-16" : "w-64"
        } hidden md:flex`}
      >
        <h1 className={`text-xl font-bold mb-4 ${isMinimized ? "hidden" : ""}`}>
          Employee Management
        </h1>

        <nav className={`flex flex-col space-y-2 mt-4 ${isMinimized ? "hidden" : ""}`}>
          <a href="/profile" className="text-lg">Profile</a>
        </nav>
      </aside>

      {/* Offcanvas menu for mobile */}
      {isOffcanvasOpen && (
        <div className="fixed inset-0 bg-primary bg-opacity-50 z-40 flex">
          {/* Offcanvas Sidebar */}
          <div className="bg-primary w-64 h-full text-white flex flex-col">
            <div className="flex justify-between items-center p-4">
              <h1 className="text-xl font-bold">Employee Management</h1>
              {/* Close button with "X" */}
              <button
                onClick={closeOffcanvas}
                aria-label="Close offcanvas"
                className="bg-transparent text-white px-2 py-1 rounded-md text-xl hover:bg-opacity-40"
              >
                X
              </button>
            </div>
            
            <nav className="flex flex-col space-y-2 mt-4 mb-auto px-4">
              <a href="/profile" className="text-lg">Profile</a>
            </nav>

            <nav className="text-lg mt-auto p-4">
              Logout
            </nav>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main
        className={`flex-1 bg-secondary transition-all duration-300 ease-in-out ${
          isMinimized ? "md:ml-16" : "md:ml-64"
        }`}
      >
        {/* Top bar with User Greeting */}
        <div className="flex justify-between items-center bg-primary text-white p-4 sticky top-0 z-30">
          {/* Sidebar toggle button on larger screens */}
          <button
            className="text-white hidden md:flex"
            onClick={toggleSidebar}
            aria-label={isMinimized ? "Expand sidebar" : "Minimize sidebar"}
          >
            {isMinimized ? (
              <LuArrowRightToLine size={28} />
            ) : (
              <LuArrowLeftToLine size={28} />
            )}
          </button>

          {/* Hamburger menu button for mobile */}
          <button
            className="text-white flex md:hidden"
            onClick={openOffcanvas}
            aria-label="Open offcanvas"
          >
            <GiHamburgerMenu size={28} />
          </button>

          {/* Avatar and greeting section on larger screens */}
          <div className="items-center hidden md:flex" ref={avatarRef}>
            <span className="text-lg mr-2">
              Hello, {isLoading ? 'Loading...' : username ? username : 'Guest'}!
            </span>

            {/* Avatar clickable to toggle dropdown */}
            <div onClick={toggleDropdown} className="cursor-pointer">
              <Avatar src={avatarUrl} alt="User Avatar" size={32} />
            </div>

            {/* Logout dropdown */}
            {showDropdown && <LogoutDropdown onLogout={handleLogout} />}
          </div>
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto h-[calc(100vh-64px)]">
          {children}
        </div>
      </main>
    </div>
  );
};

export default SidebarLayout;
