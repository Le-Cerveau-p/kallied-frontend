import { useState } from "react";
import {
  LayoutDashboard,
  FolderOpen,
  FileText,
  ChartBar,
  MessageCircle,
  Receipt,
  User,
  Menu,
  X,
} from "lucide-react";

interface MenuItem {
  id: string;
  label: string;
  icon: React.ElementType;
  href: string;
}

interface ClientSidebarProps {
  activeItem?: string;
  onItemClick?: (itemId: string) => void;
}

export default function ClientSidebar({
  activeItem = "dashboard",
  onItemClick,
}: ClientSidebarProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const menuItems: MenuItem[] = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      href: "/dashboard",
    },
    { id: "projects", label: "Projects", icon: FolderOpen, href: "/projects" },
    {
      id: "reports",
      label: "Reports",
      icon: FileText,
      href: "/client/reports",
    },
    // {
    //   id: "dashboards",
    //   label: "Dashboards",
    //   icon: ChartBar,
    //   href: "/client/dashboards",
    // },
    // {
    //   id: "requests",
    //   label: "Requests",
    //   icon: MessageCircle,
    //   href: "/client/requests",
    // },
    {
      id: "invoices",
      label: "Invoices",
      icon: Receipt,
      href: "/client/invoices",
    },
    {
      id: "messages",
      label: "Messages",
      icon: MessageCircle,
      href: "/threads",
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
        style={{ borderColor: "#e5e7eb" }}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div
            className="px-6 py-5 border-b"
            style={{ borderColor: "#e5e7eb" }}
          >
            <h3 className="text-lg font-semibold" style={{ color: "#001f54" }}>
              Client Portal
            </h3>
            <p className="text-xs text-gray-500 mt-1">Welcome back!</p>
          </div>

          {/* Sidebar Content */}
          <nav className="flex-1 px-4 py-6 overflow-y-auto">
            <ul className="space-y-1.5">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeItem === item.id;

                return (
                  <li key={item.id}>
                    <button
                      onClick={() => handleItemClick(item.href)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                        isActive
                          ? "shadow-sm font-medium"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                      style={
                        isActive
                          ? { backgroundColor: "#a7fc00", color: "#001f54" }
                          : {}
                      }
                    >
                      <Icon className="w-5 h-5 flex-shrink-0" />
                      <span className="text-sm">{item.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Sidebar Footer - Help Section */}
          <div className="p-4 border-t" style={{ borderColor: "#e5e7eb" }}>
            <div
              className="rounded-lg p-4"
              style={{ backgroundColor: "#f0f9ff" }}
            >
              <h4
                className="text-sm font-semibold mb-1"
                style={{ color: "#001f54" }}
              >
                Need Help?
              </h4>
              <p className="text-xs text-gray-600 mb-3">
                Our support team is here for you
              </p>
              <button
                className="w-full px-3 py-2 rounded-lg text-xs font-medium transition-all hover:shadow-md"
                style={{ backgroundColor: "#4169e1", color: "white" }}
              >
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Spacer for main content */}
      <div className="hidden lg:block w-64" />
    </>
  );
}
