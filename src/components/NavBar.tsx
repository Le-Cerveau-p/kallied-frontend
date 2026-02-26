import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Menu, X } from "lucide-react";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface NavbarProps {
  currentPage?: string;
}

export default function Navbar({ currentPage = "home" }: NavbarProps) {
  const { user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  var userName = null;
  var userAvatar = "";
  if (user) {
    userName = localStorage.getItem("username");
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Handle scroll to add shadow when scrolled
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when clicking on a link
  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Features", href: "/features" },
    { name: "Services", href: "/services" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "shadow-lg" : ""
      }`}
      style={{ backgroundColor: "#001f54" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <img
                src="/K-ALLIED_icon.png"
                alt="K-Allied"
                className="h-12 w-auto"
                onError={(e) => {
                  e.currentTarget.src = "/Logo.png";
                }}
              />
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                  currentPage === link.name.toLowerCase()
                    ? "text-white"
                    : "text-gray-300 hover:text-white"
                }`}
                style={
                  currentPage === link.name.toLowerCase()
                    ? { backgroundColor: "#4169e1" }
                    : {}
                }
                onMouseEnter={(e) => {
                  if (currentPage !== link.name.toLowerCase()) {
                    e.currentTarget.style.backgroundColor = "#4169e1";
                  }
                }}
                onMouseLeave={(e) => {
                  if (currentPage !== link.name.toLowerCase()) {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }
                }}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {!user ? (
              <>
                <Link
                  to="/login"
                  className="text-white hover:text-[#a7fc00] transition-colors duration-200"
                >
                  Login
                </Link>
                <Button
                  asChild
                  className="text-[#001f54] hover:opacity-90 transition-all duration-200"
                  style={{ backgroundColor: "#a7fc00" }}
                >
                  <Link to="/signup">Sign Up</Link>
                </Button>
              </>
            ) : (
              <>
                <div className="flex items-center gap-3 p-1 rounded-lg hover:bg-[#4169e1] transition-colors duration-200">
                  <Link to="/dashboard">
                    <Avatar className="w-9 h-9">
                      <AvatarImage src={userAvatar} alt={userName} />
                      <AvatarFallback
                        className="text-[#001f54]"
                        style={{ backgroundColor: "#a7fc00" }}
                      >
                        {getInitials(userName)}
                      </AvatarFallback>
                    </Avatar>
                  </Link>
                </div>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white p-2 rounded-lg hover:bg-[#4169e1] transition-colors duration-200"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden transition-all duration-300 ease-in-out ${
          isMenuOpen
            ? "max-h-[calc(100vh-4rem)] opacity-100 overflow-y-auto"
            : "max-h-0 opacity-0 overflow-hidden"
        }`}
        style={{ backgroundColor: "#001f54" }}
      >
        <div className="px-4 pt-2 pb-4 space-y-2 border-t border-[#4169e1]/30">
          {/* Mobile Navigation Links */}
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              onClick={handleLinkClick}
              className={`block px-4 py-3 rounded-lg transition-all duration-200 ${
                currentPage === link.name.toLowerCase()
                  ? "text-white"
                  : "text-gray-300 hover:text-white"
              }`}
              style={
                currentPage === link.name.toLowerCase()
                  ? { backgroundColor: "#4169e1" }
                  : {}
              }
              onTouchStart={(e) => {
                if (currentPage !== link.name.toLowerCase()) {
                  e.currentTarget.style.backgroundColor = "#4169e1";
                }
              }}
              onTouchEnd={(e) => {
                if (currentPage !== link.name.toLowerCase()) {
                  e.currentTarget.style.backgroundColor = "transparent";
                }
              }}
            >
              {link.name}
            </Link>
          ))}

          {/* Mobile Auth Buttons */}
          <div className="pt-4 space-y-2 border-t border-[#4169e1]/30">
            {!user ? (
              <>
                <Link
                  to="/login"
                  onClick={handleLinkClick}
                  className="block w-full text-center px-4 py-3 rounded-lg text-white hover:bg-[#4169e1] transition-colors duration-200"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  onClick={handleLinkClick}
                  className="block w-full text-center px-4 py-3 rounded-lg text-[#001f54] transition-all duration-200"
                  style={{ backgroundColor: "#a7fc00" }}
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <>
                <div className="flex items-center gap-3 p-1 rounded-lg hover:bg-[#4169e1] transition-colors duration-200">
                  <Link to="/dashboard">
                    <Avatar className="w-9 h-9">
                      <AvatarImage src={userAvatar} alt={userName} />
                      <AvatarFallback
                        className="text-[#001f54]"
                        style={{ backgroundColor: "#a7fc00" }}
                      >
                        {getInitials(userName)}
                      </AvatarFallback>
                    </Avatar>
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
