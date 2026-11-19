import React, { useState } from 'react';
import { Lock, LogOut, Menu, X, Database } from 'lucide-react';

export function Navbar({ isAdmin, adminUser, onOpenLogin, onLogout, onOpenDbSettings }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Personal', href: '#personal' },
    { label: 'Education', href: '#education' },
    { label: 'Skills', href: '#skills' },
    { label: 'Projects', href: '#projects' },
    { label: 'Competitions & Achievements', href: '#achievements' },
    { label: 'Positions', href: '#positions' },
    { label: 'Interests', href: '#interests' },
    { label: 'Contact', href: '#contact' },
  ];

  const handleLinkClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-zinc-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Name / Brand */}
        <a 
          href="#personal" 
          className="font-bold text-lg text-zinc-900 tracking-tight hover:text-black transition-colors"
        >
          Vakati Pavan Kumar
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-6 text-sm">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-zinc-600 hover:text-zinc-900 font-medium transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right side controls */}
        <div className="hidden sm:flex items-center space-x-3 text-sm">
          {isAdmin ? (
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-zinc-100 text-zinc-800 border border-zinc-300">
                Admin
              </span>
              
              <button
                onClick={onOpenDbSettings}
                title="Firebase Settings"
                className="p-1.5 text-zinc-500 hover:text-zinc-900 border border-zinc-200 rounded hover:bg-zinc-50 transition-colors"
              >
                <Database className="w-4 h-4" />
              </button>

              <button
                onClick={onLogout}
                className="inline-flex items-center space-x-1 px-2.5 py-1 text-xs font-medium text-zinc-700 bg-white border border-zinc-300 rounded hover:bg-zinc-50 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenLogin}
              className="inline-flex items-center space-x-1.5 text-xs text-zinc-500 hover:text-zinc-900 py-1 px-2.5 rounded border border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50 transition-colors"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Admin Login</span>
            </button>
          )}
        </div>

        {/* Mobile menu hamburger */}
        <div className="flex items-center space-x-2 lg:hidden">
          {isAdmin ? (
            <span className="px-1.5 py-0.5 text-xs bg-zinc-100 text-zinc-800 border border-zinc-300 rounded font-medium">
              Admin
            </span>
          ) : null}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-zinc-700 hover:text-black rounded focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-zinc-200 bg-white px-4 pt-2 pb-4 space-y-2">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={handleLinkClick}
              className="block py-2 text-sm text-zinc-700 hover:text-black font-medium border-b border-zinc-100 last:border-0"
            >
              {link.label}
            </a>
          ))}

          <div className="pt-3 flex items-center justify-between">
            {isAdmin ? (
              <div className="flex items-center space-x-3 w-full justify-between">
                <button
                  onClick={() => {
                    handleLinkClick();
                    onOpenDbSettings();
                  }}
                  className="text-xs text-zinc-600 flex items-center space-x-1 border border-zinc-200 px-2.5 py-1.5 rounded"
                >
                  <Database className="w-3.5 h-3.5" />
                  <span>Firebase Config</span>
                </button>
                <button
                  onClick={() => {
                    handleLinkClick();
                    onLogout();
                  }}
                  className="text-xs text-zinc-700 font-medium flex items-center space-x-1 border border-zinc-300 px-3 py-1.5 rounded bg-zinc-50"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  handleLinkClick();
                  onOpenLogin();
                }}
                className="w-full text-center text-xs text-zinc-700 font-medium flex items-center justify-center space-x-1.5 border border-zinc-300 py-2 rounded bg-zinc-50 hover:bg-zinc-100"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Admin Login</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
