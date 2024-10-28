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
import Link from "next/link";
import { HiCube } from "react-icons/hi2";
import { IoPersonCircle, IoLogOut } from "react-icons/io5";
import { BiSolidSpreadsheet } from "react-icons/bi";
import { AiFillProject } from "react-icons/ai";
import { RiCalendarScheduleFill } from "react-icons/ri";

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
        className={`bg-primary min-h-screen flex flex-col h-full text-white transition-all duration-300 ease-in-out transform sticky left-0 top-0 z-20 ${
          isMinimized ? "w-16" : "w-64"
        } hidden md:flex`}
      >
        <div className="p-4 flex items-center">
          <HiCube size={48} className={`${isMinimized ? "" : "mr-2"}`} /> 
          <h1 className={`text-lg font-bold ${isMinimized ? "hidden" : ""}`}>
            Employee Management System
          </h1>
        </div>

        <nav className="flex flex-col space-y-2 p-4">
          <Link href="/profile" className="flex items-center text-lg">
            <IoPersonCircle size={36} className={`mr-2 ${isMinimized ? "mr-0" : ""}`} />
            <span className={`${isMinimized ? "hidden" : ""}`}>Profile</span>
          </Link>
        </nav>

        <nav className="flex flex-col space-y-2 p-4">
          <Link href="/daily-time-record" className="flex items-center text-lg">
            <BiSolidSpreadsheet size={36} className={`mr-2 ${isMinimized ? "mr-0" : ""}`} />
            <span className={`${isMinimized ? "hidden" : ""}`}>Daily Time Record</span>
          </Link>
        </nav>

        <nav className="flex flex-col space-y-2 p-4">
          <Link href="/projects" className="flex items-center text-lg">
            <AiFillProject size={36} className={`mr-2 ${isMinimized ? "mr-0" : ""}`} />
            <span className={`${isMinimized ? "hidden" : ""}`}>Projects</span>
          </Link>
        </nav>

        <nav className="flex flex-col space-y-2 p-4">
          <Link href="/leave-requests" className="flex items-center text-lg">
            <RiCalendarScheduleFill size={36} className={`mr-2 ${isMinimized ? "mr-0" : ""}`} />
            <span className={`${isMinimized ? "hidden" : ""}`}>Leave Requests</span>
          </Link>
        </nav>
      </aside>

      {/* Offcanvas menu for mobile */}
      {isOffcanvasOpen && (
        <div className="fixed inset-0 bg-primary bg-opacity-50 z-50 flex">
          {/* Offcanvas Sidebar */}
          <div className="bg-primary w-64 h-full text-white flex flex-col">
            <div className="flex justify-between items-center p-4 border-b">
              <h1 className="text-xl font-bold">Employee Management System</h1>
              {/* Close button with "X" */}
              <button
                onClick={closeOffcanvas}
                aria-label="Close offcanvas"
                className="bg-transparent text-white px-2 py-1 rounded-md text-xl hover:bg-opacity-40"
              >
                X
              </button>
            </div>
            
            <nav className="flex flex-col space-y-8 mt-4 p-4">
              <Link href="/profile" className="flex items-center text-lg">
                <IoPersonCircle size={36} className="mr-2" />
                <span>Profile</span>
              </Link>

              <Link href="/daily-time-record" className="flex items-center text-lg">
                <BiSolidSpreadsheet size={36} className="mr-2" />
                <span>Daily Time Record</span>
              </Link>

              <Link href="/projects" className="flex items-center text-lg">
                <AiFillProject size={36} className="mr-2" />
                <span>Projects</span>
              </Link>

              <Link href="/leave-requests" className="flex items-center text-lg">
                <RiCalendarScheduleFill size={36} className="mr-2" />
                <span>Leave Requests</span>
              </Link>
            </nav>
            <div className="p-4 border-t mt-auto">
              <Link href="#" onClick={handleLogout} className="flex items-center text-lg">
                <IoLogOut size={36} className="mr-2" />
                <span>Logout</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col">
        {/* Top bar with User Greeting */}
        <div
          className={`flex justify-between items-center bg-primary text-white fixed top-0 z-20 transition-all duration-300 p-6 w-full ${
            isMinimized ? "md:w-[calc(100%-4rem)]" : "md:w-[calc(100%-16rem)]"
          }`}
        >
          {/* Sidebar toggle button on larger screens */}
          <button
            className="text-white hidden md:flex"
            onClick={toggleSidebar}
            aria-label={isMinimized ? "Expand sidebar" : "Minimize sidebar"}
          >
            {isMinimized ? <LuArrowRightToLine size={28} /> : <LuArrowLeftToLine size={28} />}
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

        <main
          className={`flex-1 bg-secondary transition-all duration-300 ease-in-out`}
        >
          {/* Scrollable content */}
          <div className="p-4 overflow-y-auto h-auto mt-28">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default SidebarLayout;
