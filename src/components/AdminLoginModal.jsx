import React, { useState } from 'react';
import { X, Lock, Key, Mail, AlertCircle, Info } from 'lucide-react';
import { loginAdmin } from '../firebase';

export function AdminLoginModal({ isOpen, onClose, onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await loginAdmin(email, password);
      if (res.success) {
        onLoginSuccess(res.user);
        onClose();
      } else {
        setError(res.error || 'Failed to authenticate');
      }
    } catch (err) {
      setError(err.message || 'Login error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLocal = () => {
    setEmail('admin@portfolio.local');
    setPassword('admin');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="relative w-full max-w-md bg-white border border-zinc-200 rounded-lg shadow-xl p-6 overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-700 p-1 rounded"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-2.5 mb-5">
          <div className="p-2 bg-zinc-100 border border-zinc-200 rounded">
            <Lock className="w-4 h-4 text-zinc-800" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-zinc-900">Admin Login</h3>
            <p className="text-xs text-zinc-500">Sign in to edit your portfolio information</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded flex items-start space-x-2 text-xs text-red-700">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="vakatipavankumar.official@gmail.com"
                className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-zinc-300 rounded focus:outline-none focus:border-zinc-800 text-zinc-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1">
              Password
            </label>
            <div className="relative">
              <Key className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-zinc-300 rounded focus:outline-none focus:border-zinc-800 text-zinc-900"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-zinc-900 hover:bg-black rounded transition-colors disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Sign In as Admin'}
          </button>
        </form>

        <div className="mt-5 pt-4 border-t border-zinc-100 text-xs text-zinc-500">
          <div className="flex items-start space-x-1.5">
            <Info className="w-3.5 h-3.5 text-zinc-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="leading-relaxed">
                Connects directly to <strong>Firebase Authentication</strong>.
              </p>
              <p className="mt-1 text-zinc-400">
                Quick test login:{' '}
                <button
                  type="button"
                  onClick={handleQuickLocal}
                  className="text-zinc-700 underline font-medium hover:text-black"
                >
                  admin@portfolio.local / admin
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
