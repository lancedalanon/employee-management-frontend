import { ReactNode, useEffect, useState } from "react";
import { LuArrowLeftToLine, LuArrowRightToLine } from "react-icons/lu";
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import Avatar from './Avatar'; 
import { useRouter } from 'next/navigation';
import LogoutDropdown from './LogoutDropdown';
import { logout } from '@/store/authSlice';
import { clearUserData } from '@/store/userSlice';
import CookieUtils from '@/app/utils/useCookies';

interface LayoutProps {
  children: ReactNode;
}

const SidebarLayout: React.FC<LayoutProps> = ({ children }) => {
  // State to manage sidebar visibility and loading
  const [isMinimized, setIsMinimized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const username = useSelector((state: RootState) => state.user.username);
  const avatarUrl = useSelector((state: RootState) => state.user.avatarUrl); // Assuming avatarUrl is part of the user state
  const router = useRouter();
  const dispatch = useDispatch();

  // Effect to set loading to false once username is available
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

  // Toggle sidebar visibility
  const toggleSidebar = () => {
    setIsMinimized((prev) => !prev);
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside
        className={`bg-primary flex flex-col p-4 fixed h-full text-white transition-all duration-300 ease-in-out transform ${
          isMinimized ? "w-16" : "w-64"
        }`}
      >
        <h1 className={`text-xl font-bold mb-4 ${isMinimized ? "hidden" : ""}`}>
          Employee Management
        </h1>

        <nav className={`flex flex-col space-y-2 ${isMinimized ? "hidden" : ""}`}>
          <a href="/profile">Profile</a>
        </nav>
      </aside>

      {/* Main Content */}
      <main
        className={`flex-1 bg-secondary transition-all duration-300 ease-in-out ml-${isMinimized ? "16" : "64"}`}
      >
        {/* User Greeting Section */}
        <div className="flex justify-between items-center bg-primary text-white p-4 sticky top-0 z-10">
          {/* Minimize/Maximize Button */}
          <button
            className="text-white"
            onClick={toggleSidebar}
            aria-label={isMinimized ? "Expand sidebar" : "Minimize sidebar"}
          >
            {isMinimized ? (
              <LuArrowRightToLine size={28} />
            ) : (
              <LuArrowLeftToLine size={28} />
            )}
          </button>

          <div className="flex items-center">
            <span className="text-lg text-light mr-2">
              Hello, {isLoading ? 'Loading...' : username ? username : 'Guest'}!
            </span>
            <Avatar src={avatarUrl} alt="User Avatar" size={32} />
            <LogoutDropdown onLogout={handleLogout} />
          </div>
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto h-[calc(100vh-64px)]"> {/* Subtracting greeting section height */}
          {children}
        </div>
      </main>
    </div>
  );
};

export default SidebarLayout;
