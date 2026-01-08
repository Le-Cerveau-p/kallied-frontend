import { useState, useEffect } from 'react';
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from 'lucide-react';
import { Button } from '../ui/button';

export default function Footer() {
  return (
    <footer
      className="py-12 text-white"
      style={{ backgroundColor: '#001f54' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div
              className="font-bold text-2xl mb-4"
              style={{ color: '#a7fc00' }}
            >
              K-ALLIED SOLUTIONS
            </div>
            <p className="text-white/70">
              Delivering reliable technology, security and project solutions across
              Nigeria and beyond.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Services</h4>
            <ul className="space-y-2 text-white/70">
              <li>
                <Link to="/features" className="hover:text-white transition-colors">
                  Solutions & Capabilities
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-white transition-colors">
                  Consulting & Support
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-white transition-colors">
                  Implementation
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-white/70">
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-white transition-colors">
                  Projects
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-white transition-colors">
                  Partners
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-white/70">
              <li>
                <Link to="#" className="hover:text-white transition-colors">
                  Help & Resources
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-white transition-colors">
                  Request Quote
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/20 pt-8 text-center text-white/70">
          <p>&copy; {new Date().getFullYear()} K-Allied Integrated Solutions Ltd. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}