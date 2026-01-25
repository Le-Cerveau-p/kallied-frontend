import { useState } from "react";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  ChartBar,
  Receipt,
  Activity,
  Settings,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  ShoppingCart,
  FolderOpen,
} from "lucide-react";

interface MenuItem {
  id: string;
  label: string;
  icon: React.ElementType;
  href: string;
}

interface AdminSidebarProps {
  activeItem?: string;
  onItemClick?: (itemId: string) => void;
}

export default function AdminSidebar({
  activeItem = "dashboard",
  onItemClick,
}: AdminSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const menuItems: MenuItem[] = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      href: "/admin/dashboard",
    },
    {
      id: "users",
      label: "User Management",
      icon: Users,
      href: "/admin/users",
    },
    {
      id: "projects",
      label: "Projects",
      icon: Briefcase,
      href: "/admin/projects",
    },
    {
      id: "procurements",
      label: "Procurements",
      icon: ShoppingCart,
      href: "/admin/procurements",
    },
    {
      id: "threads",
      label: "Messages",
      icon: MessageSquare,
      href: "/admin/threads",
    },
    {
      id: "analytics",
      label: "Analytics",
      icon: ChartBar,
      href: "/admin/analytics",
    },
    {
      id: "billing",
      label: "Billing & Contracts",
      icon: Receipt,
      href: "/admin/billing",
    },
    { id: "logs", label: "Activity Logs", icon: Activity, href: "/admin/logs" },
    {
      id: "resources",
      label: "Resources",
      icon: FolderOpen,
      href: "/admin/resources",
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      href: "/admin/settings",
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
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
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
        className={`fixed left-0 top-16 h-[calc(100vh-4rem)] transition-all duration-300 z-40 ${
          isCollapsed ? "w-20" : "w-64"
        } ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
        style={{ backgroundColor: "#001f54" }}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Content */}
          <nav className="flex-1 px-3 py-6 overflow-y-auto">
            <ul className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeItem === item.id;

                return (
                  <li key={item.id}>
                    <button
                      onClick={() => handleItemClick(item.href)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                        isActive
                          ? "text-white shadow-md"
                          : "text-gray-300 hover:text-white hover:bg-white/10"
                      }`}
                      style={isActive ? { backgroundColor: "#4169e1" } : {}}
                      title={isCollapsed ? item.label : ""}
                    >
                      <Icon
                        className={`${isCollapsed ? "w-6 h-6" : "w-5 h-5"} flex-shrink-0`}
                      />
                      {!isCollapsed && (
                        <span className="text-sm font-medium">
                          {item.label}
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Collapse Toggle Button - Desktop Only */}
          <div className="hidden lg:block p-3 border-t border-white/10">
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200"
            >
              {isCollapsed ? (
                <ChevronRight className="w-5 h-5" />
              ) : (
                <>
                  <ChevronLeft className="w-5 h-5" />
                  <span className="text-sm">Collapse</span>
                </>
              )}
            </button>
          </div>
        </div>
      </aside>

      {/* Spacer for main content */}
      <div
        className={`hidden lg:block transition-all duration-300 ${isCollapsed ? "w-20" : "w-64"}`}
      />
    </>
  );
}
