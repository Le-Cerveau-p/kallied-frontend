import { useState } from "react";
import {
  LayoutDashboard,
  FolderKanban,
  Upload,
  FileText,
  ChartBar,
  MessageSquare,
  Clock,
  BookOpen,
  Menu,
  X,
} from "lucide-react";

interface MenuItem {
  id: string;
  label: string;
  icon: React.ElementType;
  href: string;
}

interface StaffSidebarProps {
  activeItem?: string;
  onItemClick?: (itemId: string) => void;
}

export default function StaffSidebar({
  activeItem = "dashboard",
  onItemClick,
}: StaffSidebarProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const menuItems: MenuItem[] = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      href: "/staff/dashboard",
    },
    {
      id: "projects",
      label: "My Projects",
      icon: FolderKanban,
      href: "projects",
    },
    { id: "upload", label: "Upload Data", icon: Upload, href: "/staff/upload" },
    { id: "reports", label: "Reports", icon: FileText, href: "/staff/reports" },
    {
      id: "powerbi",
      label: "Dashboards (PowerBI)",
      icon: ChartBar,
      href: "/staff/dashboards",
    },
    {
      id: "messages",
      label: "Messages",
      icon: MessageSquare,
      href: "/threads",
    },
    {
      id: "timesheets",
      label: "Timesheets",
      icon: Clock,
      href: "/staff/timesheets",
    },
    {
      id: "resources",
      label: "Resources",
      icon: BookOpen,
      href: "/staff/resources",
    },
  ];

  const handleItemClick = (href: string) => {
    window.location.href = href;
    setIsMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Toggle Button - Positioned in navbar area */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg shadow-lg bg-white"
        style={{ color: "#001f54" }}
      >
        {isMobileOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <Menu className="w-6 h-6" />
        )}
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40 pt-16"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 transition-transform duration-300 z-40 bg-white border-r ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
        style={{ borderColor: "#e0e0e0" }}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div
            className="px-6 py-4 border-b"
            style={{ borderColor: "#e0e0e0" }}
          >
            <h3 className="font-semibold" style={{ color: "#001f54" }}>
              Staff Portal
            </h3>
            <p className="text-xs text-gray-500 mt-1">Manage your work</p>
          </div>

          {/* Sidebar Content */}
          <nav className="flex-1 px-4 py-6 overflow-y-auto">
            <ul className="space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeItem === item.id;

                return (
                  <li key={item.id}>
                    <button
                      onClick={() => handleItemClick(item.href)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                        isActive
                          ? "text-white shadow-sm"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                      style={isActive ? { backgroundColor: "#4169e1" } : {}}
                    >
                      <Icon className="w-5 h-5 flex-shrink-0" />
                      <span className="text-sm font-medium">{item.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Sidebar Footer */}
          <div className="p-4 border-t" style={{ borderColor: "#e0e0e0" }}>
            <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-gray-50">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium"
                style={{ backgroundColor: "#4169e1" }}
              >
                JS
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className="text-sm font-medium truncate"
                  style={{ color: "#001f54" }}
                >
                  John Smith
                </p>
                <p className="text-xs text-gray-500 truncate">Staff Member</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Spacer for main content */}
      <div className="hidden lg:block w-64" />
    </>
  );
}
