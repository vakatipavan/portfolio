import React, { useState, useEffect } from 'react';
import { X, Database, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { getFirebaseConfig, saveFirebaseConfig, clearFirebaseConfig, initFirebase } from '../firebase';

export function FirebaseSettingsModal({ isOpen, onClose, onConfigSaved }) {
  const [config, setConfig] = useState({
    apiKey: '',
    authDomain: '',
    projectId: '',
    storageBucket: '',
    messagingSenderId: '',
    appId: ''
  });
  const [currentSource, setCurrentSource] = useState(null);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (isOpen) {
      const active = getFirebaseConfig();
      if (active) {
        setConfig({
          apiKey: active.apiKey || '',
          authDomain: active.authDomain || '',
          projectId: active.projectId || '',
          storageBucket: active.storageBucket || '',
          messagingSenderId: active.messagingSenderId || '',
          appId: active.appId || ''
        });
        setCurrentSource(active.source);
      } else {
        setCurrentSource(null);
      }
      setMessage(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setConfig((prev) => ({ ...prev, [name]: value.trim() }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!config.apiKey || !config.projectId) {
      setMessage({ type: 'error', text: 'API Key and Project ID are required.' });
      return;
    }

    saveFirebaseConfig(config);
    const result = initFirebase();
    if (result.isConfigured) {
      setMessage({ type: 'success', text: 'Firebase configuration saved and activated successfully!' });
      setCurrentSource('storage');
      if (onConfigSaved) onConfigSaved();
    } else {
      setMessage({ type: 'error', text: 'Firebase failed to initialize: ' + (result.error || 'Check credentials') });
    }
  };

  const handleClear = () => {
    clearFirebaseConfig();
    setConfig({
      apiKey: '',
      authDomain: '',
      projectId: '',
      storageBucket: '',
      messagingSenderId: '',
      appId: ''
    });
    setCurrentSource(null);
    setMessage({ type: 'info', text: 'Custom Firebase configuration removed. Operating in fallback offline mode.' });
    if (onConfigSaved) onConfigSaved();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-white border border-zinc-200 rounded-lg shadow-xl p-6 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-700 p-1 rounded"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-2.5 mb-4">
          <div className="p-2 bg-zinc-100 border border-zinc-200 rounded">
            <Database className="w-4 h-4 text-zinc-800" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-zinc-900">Firebase & Database Settings</h3>
            <p className="text-xs text-zinc-500">
              Permanent cloud storage for portfolio edits via Firebase Firestore & Auth
            </p>
          </div>
        </div>

        {/* Status banner */}
        <div className="mb-4 p-3 bg-zinc-50 border border-zinc-200 rounded text-xs flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-zinc-700">Status:</span>
            {currentSource ? (
              <span className="inline-flex items-center text-zinc-900 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-zinc-700 mr-1" />
                Active (from {currentSource === 'env' ? '.env file' : 'browser config'})
              </span>
            ) : (
              <span className="text-zinc-500">
                Not connected (Saving to browser localStorage)
              </span>
            )}
          </div>
        </div>

        {message && (
          <div className={`mb-4 p-3 rounded text-xs flex items-start space-x-2 ${
            message.type === 'success' 
              ? 'bg-zinc-100 text-zinc-900 border border-zinc-300' 
              : message.type === 'error'
              ? 'bg-red-50 text-red-700 border border-red-200'
              : 'bg-zinc-100 text-zinc-700 border border-zinc-200'
          }`}>
            {message.type === 'error' ? (
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            ) : (
              <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
            )}
            <span>{message.text}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-3 text-xs">
          <div>
            <label className="block font-semibold text-zinc-700 mb-1">
              API Key (VITE_FIREBASE_API_KEY)
            </label>
            <input
              type="text"
              name="apiKey"
              value={config.apiKey}
              onChange={handleChange}
              placeholder="AIzaSy..."
              className="w-full px-3 py-2 bg-white border border-zinc-300 rounded focus:border-zinc-800 text-zinc-900"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-zinc-700 mb-1">
                Project ID (VITE_FIREBASE_PROJECT_ID)
              </label>
              <input
                type="text"
                name="projectId"
                value={config.projectId}
                onChange={handleChange}
                placeholder="my-portfolio-12345"
                className="w-full px-3 py-2 bg-white border border-zinc-300 rounded focus:border-zinc-800 text-zinc-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-zinc-700 mb-1">
                Auth Domain
              </label>
              <input
                type="text"
                name="authDomain"
                value={config.authDomain}
                onChange={handleChange}
                placeholder="my-portfolio-12345.firebaseapp.com"
                className="w-full px-3 py-2 bg-white border border-zinc-300 rounded focus:border-zinc-800 text-zinc-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-zinc-700 mb-1">
                Storage Bucket
              </label>
              <input
                type="text"
                name="storageBucket"
                value={config.storageBucket}
                onChange={handleChange}
                placeholder="my-portfolio-12345.appspot.com"
                className="w-full px-3 py-2 bg-white border border-zinc-300 rounded focus:border-zinc-800 text-zinc-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-zinc-700 mb-1">
                App ID
              </label>
              <input
                type="text"
                name="appId"
                value={config.appId}
                onChange={handleChange}
                placeholder="1:1234567890:web:abcdef..."
                className="w-full px-3 py-2 bg-white border border-zinc-300 rounded focus:border-zinc-800 text-zinc-900"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between">
            {currentSource === 'storage' && (
              <button
                type="button"
                onClick={handleClear}
                className="text-xs text-red-600 hover:text-red-800 font-medium"
              >
                Reset Configuration
              </button>
            )}
            <div className="ml-auto flex items-center space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 border border-zinc-300 rounded text-zinc-700 hover:bg-zinc-50"
              >
                Close
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-zinc-900 text-white rounded font-medium hover:bg-black"
              >
                Save & Connect
              </button>
            </div>
          </div>
        </form>

        <div className="mt-5 pt-3 border-t border-zinc-100 text-[11px] text-zinc-500 leading-relaxed">
          <p className="font-semibold text-zinc-700 mb-1">How to setup in Firebase Console:</p>
          <ol className="list-decimal pl-4 space-y-0.5">
            <li>Go to <a href="https://console.firebase.google.com" target="_blank" rel="noreferrer" className="underline text-zinc-700">console.firebase.google.com</a> and create a project.</li>
            <li>In <strong>Build &gt; Authentication</strong>, enable <em>Email/Password</em> provider.</li>
            <li>In <strong>Build &gt; Firestore Database</strong>, create a database. Set read/write rules.</li>
            <li>Add a Web App (&lt;/&gt;) in Project Settings and paste the keys above or into <code>.env</code>.</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
