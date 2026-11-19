import React from 'react';
import { Lock, ArrowUp } from 'lucide-react';

export function Footer({ isAdmin, onOpenLogin, onLogout }) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="py-8 border-t border-zinc-200 mt-12 bg-white text-xs text-zinc-500">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <p>© {new Date().getFullYear()} Vakati Pavan Kumar. Personal Portfolio.</p>
        </div>

        <div className="flex items-center space-x-4">
          {isAdmin && (
            <>
              <button
                onClick={onLogout}
                className="hover:text-zinc-900 transition-colors"
              >
                Admin Logout
              </button>
              <span className="text-zinc-300">•</span>
            </>
          )}

          <button
            onClick={scrollToTop}
            className="inline-flex items-center space-x-1 hover:text-zinc-900 transition-colors"
          >
            <span>Back to Top</span>
            <ArrowUp className="w-3 h-3" />
          </button>
        </div>
      </div>
    </footer>
  );
}
