import { ReactNode, useState } from "react";
import { LuArrowLeftToLine, LuArrowRightToLine } from "react-icons/lu";

interface LayoutProps {
  children: ReactNode;
}

const SidebarLayout: React.FC<LayoutProps> = ({ children }) => {
  // State to manage sidebar visibility
  const [isMinimized, setIsMinimized] = useState(false);

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

          <span className="text-lg text-light">Hi User!</span>
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
