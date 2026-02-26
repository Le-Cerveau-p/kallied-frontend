import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import {
  Bell,
  LayoutDashboard,
  User,
  Settings,
  LogOut,
  Menu,
  X,
  TriangleAlert,
  Loader,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

interface DashboardNavbarProps {
  currentPage?: string;
  userName?: string;
  userEmail?: string;
  userAvatar?: string;
  notificationCount?: number;
}

export default function AuthNavbar({
  currentPage = "dashboard",
  userName,
  userEmail,
  userAvatar,
  notificationCount = 3,
}: DashboardNavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { logout } = useAuth();

  const navItems = [
    { name: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
    { name: "Profile", icon: User, href: "/profile" },
    { name: "Settings", icon: Settings, href: "/settings" },
  ];

  const INACTIVITY_LIMIT = 30 * 60 * 1000; // 30 minutes
  let inactivityTimer: ReturnType<typeof setTimeout>;

  const resetTimer = () => {
    clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(() => {
      logout();
    }, INACTIVITY_LIMIT);
  };

  useEffect(() => {
    // Actions that count as "activity"
    const events = ["mousemove", "keydown", "click", "scroll", "touchstart"];

    events.forEach((event) => window.addEventListener(event, resetTimer));

    // start timer initially
    resetTimer();

    return () => {
      events.forEach((event) => window.removeEventListener(event, resetTimer));
      clearTimeout(inactivityTimer);
    };
  }, []);

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleLogoutConfirm = async () => {
    setIsLoggingOut(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800));

    logout();

    setIsLoggingOut(false);
    setShowLogoutModal(false);
  };

  const handleLogoutCancel = () => {
    setShowLogoutModal(false);
  };

  const getInitials = (name?: string) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const displayName = userName || "—";
  const displayEmail = userEmail || "";
  const displayAvatar = userAvatar || "";

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 shadow-md"
      style={{ backgroundColor: "#001f54" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 lg:ml-0 ml-12">
            <a href="/" className="flex items-center">
              <img
                src="/K-ALLIED_icon.png"
                alt="K-Allied"
                className="h-12 w-auto"
                onError={(e) => {
                  e.currentTarget.src = "/Logo.png";
                }}
              />
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.name.toLowerCase();
              return (
                <a
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    isActive ? "text-white" : "text-gray-300 hover:text-white"
                  }`}
                  style={isActive ? { backgroundColor: "#4169e1" } : {}}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = "#4169e1";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }
                  }}
                >
                  <Icon size={20} />
                  <span>{item.name}</span>
                </a>
              );
            })}
          </div>

          {/* Right Section - Notifications & User Menu */}
          <div className="flex items-center gap-4">
            {/* Notification Bell */}
            <button
              className="relative p-2 rounded-lg text-white hover:bg-[#4169e1] transition-colors duration-200"
              aria-label="Notifications"
            >
              <Bell size={20} />
              {notificationCount > 0 && (
                <span
                  className="absolute top-0 right-0 flex items-center justify-center text-xs text-[#001f54] rounded-full min-w-[18px] h-[18px] px-1"
                  style={{ backgroundColor: "#a7fc00" }}
                >
                  {notificationCount > 9 ? "9+" : notificationCount}
                </span>
              )}
            </button>

            {/* User Avatar Dropdown - Desktop */}
            <div className="hidden md:block">
              <DropdownMenu>
                <DropdownMenuTrigger className="focus:outline-none">
                  <div className="flex items-center gap-3 p-1 rounded-lg hover:bg-[#4169e1] transition-colors duration-200">
                    <Avatar className="w-9 h-9">
                      <AvatarImage src={displayAvatar} alt={displayName} />
                      <AvatarFallback
                        className="text-[#001f54]"
                        style={{ backgroundColor: "#a7fc00" }}
                      >
                        {getInitials(displayName)}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-56 mt-2"
                  style={{ backgroundColor: "white" }}
                >
                  {/* User Info */}
                  <div className="px-2 py-3 border-b">
                    <p className="font-semibold" style={{ color: "#001f54" }}>
                      {displayName}
                    </p>
                    <p className="text-sm text-gray-500">{displayEmail}</p>
                  </div>

                  {/* Menu Items */}
                  <DropdownMenuItem asChild>
                    <a
                      href="/profile"
                      className="flex items-center gap-2 px-2 py-2 cursor-pointer hover:bg-gray-100 transition-colors"
                    >
                      <User size={16} style={{ color: "#4169e1" }} />
                      <span>Profile</span>
                    </a>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <a
                      href="/settings"
                      className="flex items-center gap-2 px-2 py-2 cursor-pointer hover:bg-gray-100 transition-colors"
                    >
                      <Settings size={16} style={{ color: "#4169e1" }} />
                      <span>Settings</span>
                    </a>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  {/* Logout */}
                  <DropdownMenuItem
                    onClick={handleLogoutClick}
                    className="flex items-center gap-2 px-2 py-2 cursor-pointer text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut size={16} />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-white hover:bg-[#4169e1] transition-colors duration-200"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isMobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
        style={{ backgroundColor: "#001f54" }}
      >
        <div className="px-4 pt-2 pb-4 space-y-2 border-t border-[#4169e1]/30">
          {/* Mobile User Info */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-[#4169e1]/30">
            <Avatar className="w-10 h-10">
              <AvatarImage src={displayAvatar} alt={displayName} />
              <AvatarFallback
                className="text-[#001f54]"
                style={{ backgroundColor: "#a7fc00" }}
              >
                {getInitials(displayName)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-white">{displayName}</p>
              <p className="text-sm text-gray-300">{displayEmail}</p>
            </div>
          </div>

          {/* Mobile Navigation - Icon Only */}
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.name.toLowerCase();
            return (
              <a
                key={item.name}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive ? "text-white" : "text-gray-300 hover:text-white"
                }`}
                style={isActive ? { backgroundColor: "#4169e1" } : {}}
              >
                <Icon size={20} />
                <span>{item.name}</span>
              </a>
            );
          })}

          {/* Mobile Logout */}
          <button
            onClick={() => {
              handleLogoutClick();
              setIsMobileMenuOpen(false);
            }}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-red-400 hover:bg-red-900/20 transition-all duration-200 mt-2 border-t border-[#4169e1]/30"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </div>
      {/* Logout Modal */}
      {showLogoutModal && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in"
          onClick={handleLogoutCancel}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-red-100">
                <TriangleAlert size={24} className="text-red-600" />
              </div>
              <h3 className="text-xl font-bold" style={{ color: "#001f54" }}>
                Confirm Logout
              </h3>
            </div>

            <p className="text-gray-600 mb-6">
              Are you sure you want to log out? This will end your current
              session and you'll need to log in again to access your account.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleLogoutCancel}
                disabled={isLoggingOut}
                className="flex-1 px-6 py-3 rounded-lg font-semibold border-2 transition-all duration-300 hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed"
                style={{ borderColor: "#4169e1", color: "#4169e1" }}
              >
                Cancel
              </button>
              <button
                onClick={handleLogoutConfirm}
                disabled={isLoggingOut}
                className="flex-1 px-6 py-3 rounded-lg font-semibold bg-red-600 text-white hover:bg-red-700 transition-all duration-300 hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoggingOut ? (
                  <>
                    <Loader size={20} className="animate-spin" />
                    Logging out...
                  </>
                ) : (
                  <>
                    <LogOut size={20} />
                    Logout
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
