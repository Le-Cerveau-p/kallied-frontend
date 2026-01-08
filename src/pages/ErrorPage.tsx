import { useState, useEffect } from 'react';
import Navbar from '../components/NavBar';
import {
  House,
  ArrowLeft,
  FileQuestion,
  ShieldAlert,
  Search,
  MapPin,
} from 'lucide-react';

interface ErrorPageProps {
  type?: '404' | '401' | '403' | '500';
}

export default function ErrorPage({ type = '404' }: ErrorPageProps) {
  const [isAnimated, setIsAnimated] = useState(false);

  useEffect(() => {
    // Trigger animation after component mounts
    setTimeout(() => setIsAnimated(true), 100);
  }, []);

  const errorConfig = {
    '404': {
      icon: FileQuestion,
      title: '404',
      heading: 'Page Not Found',
      message: "Oops! The page you're looking for seems to have wandered off. It might have been moved, deleted, or perhaps it never existed.",
      suggestion: 'Try checking the URL or head back to safety.',
      primaryButton: 'Go to Homepage',
      primaryLink: '/',
      secondaryButton: 'Go to Dashboard',
      secondaryLink: '/dashboard',
      accentColor: '#a7fc00',
    },
    '401': {
      icon: ShieldAlert,
      title: '401',
      heading: 'Unauthorized Access',
      message: "You don't have permission to access this page. You may need to log in or contact an administrator for access.",
      suggestion: 'Please log in to continue or return to the homepage.',
      primaryButton: 'Log In',
      primaryLink: '/login',
      secondaryButton: 'Go to Homepage',
      secondaryLink: '/',
      accentColor: '#a7fc00',
    },
    '403': {
      icon: ShieldAlert,
      title: '403',
      heading: 'Access Forbidden',
      message: "You don't have the necessary permissions to view this page. If you believe this is a mistake, please contact support.",
      suggestion: 'Return to a page you have access to.',
      primaryButton: 'Go to Dashboard',
      primaryLink: '/dashboard',
      secondaryButton: 'Contact Support',
      secondaryLink: '/contact',
      accentColor: '#a7fc00',
    },
    '500': {
      icon: ShieldAlert,
      title: '500',
      heading: 'Server Error',
      message: "Something went wrong on our end. We're working to fix the issue. Please try again in a few moments.",
      suggestion: 'If the problem persists, please contact support.',
      primaryButton: 'Try Again',
      primaryLink: '/',
      secondaryButton: 'Contact Support',
      secondaryLink: '/contact',
      accentColor: '#a7fc00',
    },
  };

  const config = errorConfig[type];
  const Icon = config.icon;

  const quickLinks = [
    { name: 'Home', href: '/', icon: House },
    { name: 'Features', href: '/features', icon: MapPin },
    { name: 'About Us', href: '/about', icon: MapPin },
    { name: 'Contact', href: '/contact', icon: MapPin },
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Navbar */}
      <Navbar currentPage="error" />

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-4xl w-full text-center">
          {/* Error Icon and Code */}
          <div
            className={`transition-all duration-700 ${
              isAnimated ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'
            }`}
          >
            <div className="flex justify-center mb-8">
              <div
                className="relative w-32 h-32 rounded-full flex items-center justify-center"
                style={{ backgroundColor: '#4169e120' }}
              >
                <Icon size={64} style={{ color: '#4169e1' }} />
                {/* Decorative circles */}
                <div
                  className="absolute -top-2 -right-2 w-8 h-8 rounded-full"
                  style={{ backgroundColor: '#a7fc00' }}
                ></div>
                <div
                  className="absolute -bottom-2 -left-2 w-6 h-6 rounded-full"
                  style={{ backgroundColor: '#4169e1' }}
                ></div>
              </div>
            </div>

            <div
              className="inline-block px-6 py-2 rounded-full mb-6"
              style={{ backgroundColor: '#a7fc0020', border: '2px solid #a7fc00' }}
            >
              <span
                className="text-2xl font-bold"
                style={{ color: '#001f54' }}
              >
                Error {config.title}
              </span>
            </div>
          </div>

          {/* Error Message */}
          <div
            className={`transition-all duration-700 delay-200 ${
              isAnimated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <h1
              className="text-5xl md:text-6xl font-bold mb-6"
              style={{ color: '#001f54' }}
            >
              {config.heading}
            </h1>
            <p className="text-xl text-gray-600 mb-4 max-w-2xl mx-auto">
              {config.message}
            </p>
            <p className="text-lg text-gray-500 mb-12">
              {config.suggestion}
            </p>
          </div>

          {/* Action Buttons */}
          <div
            className={`flex flex-col sm:flex-row gap-4 justify-center mb-16 transition-all duration-700 delay-400 ${
              isAnimated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <a
              href={config.primaryLink}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-lg"
              style={{ backgroundColor: '#a7fc00', color: '#001f54' }}
            >
              <House size={20} />
              {config.primaryButton}
            </a>
            <a
              href={config.secondaryLink}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg font-semibold text-lg border-2 transition-all duration-300 hover:scale-105"
              style={{ borderColor: '#4169e1', color: '#4169e1' }}
            >
              <ArrowLeft size={20} />
              {config.secondaryButton}
            </a>
          </div>

          {/* Quick Links */}
          <div
            className={`transition-all duration-700 delay-600 ${
              isAnimated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <div className="border-t border-gray-200 pt-12">
              <h2
                className="text-2xl font-bold mb-6"
                style={{ color: '#001f54' }}
              >
                Quick Links
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
                {quickLinks.map((link, index) => (
                  <a
                    key={index}
                    href={link.href}
                    className="p-6 rounded-xl border-2 border-gray-200 hover:border-[#4169e1] transition-all duration-300 hover:scale-105 hover:shadow-lg group"
                  >
                    <div
                      className="w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform"
                      style={{ backgroundColor: '#4169e120' }}
                    >
                      <link.icon size={24} style={{ color: '#4169e1' }} />
                    </div>
                    <p
                      className="font-semibold"
                      style={{ color: '#001f54' }}
                    >
                      {link.name}
                    </p>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Search Suggestion */}
          {type === '404' && (
            <div
              className={`mt-12 transition-all duration-700 delay-700 ${
                isAnimated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              <div className="max-w-md mx-auto">
                <p className="text-sm text-gray-500 mb-3">
                  Looking for something specific?
                </p>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search our site..."
                    className="w-full px-5 py-3 pl-12 rounded-lg border-2 border-gray-300 focus:border-[#4169e1] outline-none transition-all duration-300"
                  />
                  <Search
                    size={20}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Help Text */}
          <div
            className={`mt-12 transition-all duration-700 delay-800 ${
              isAnimated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <p className="text-sm text-gray-500">
              Need help?{' '}
              <a
                href="/contact"
                className="font-semibold underline"
                style={{ color: '#4169e1' }}
              >
                Contact our support team
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="fixed top-20 left-10 w-20 h-20 rounded-full opacity-20 pointer-events-none" style={{ backgroundColor: '#a7fc00' }}></div>
      <div className="fixed top-40 right-20 w-32 h-32 rounded-full opacity-10 pointer-events-none" style={{ backgroundColor: '#4169e1' }}></div>
      <div className="fixed bottom-20 left-1/4 w-16 h-16 rounded-full opacity-15 pointer-events-none" style={{ backgroundColor: '#4169e1' }}></div>
      <div className="fixed bottom-40 right-1/3 w-24 h-24 rounded-full opacity-10 pointer-events-none" style={{ backgroundColor: '#a7fc00' }}></div>

      {/* Footer */}
      <footer
        className="py-8 text-white"
        style={{ backgroundColor: '#001f54' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-white/70">
            &copy; 2026 TechPlatform. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}