import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

const SidebarLayout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white flex flex-col p-4">
        <h1 className="text-2xl font-bold mb-4">Sidebar</h1>
        <nav className="flex flex-col space-y-2">
          <a href="/profile" className="text-gray-300 hover:text-white">Profile</a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-gray-100 p-6">
        {children}
      </main>
    </div>
  );
};

export default SidebarLayout;
