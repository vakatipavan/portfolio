import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export function EditModal({ isOpen, title, fields = [], initialData = {}, onSave, onClose }) {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (isOpen) {
      setFormData(initialData || {});
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-white border border-zinc-200 rounded-lg shadow-xl p-6 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-700 p-1 rounded"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-lg font-bold text-zinc-900 mb-1">
          {title}
        </h3>
        <p className="text-xs text-zinc-500 mb-5">
          Make your edits below. Changes are saved permanently to your portfolio.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.map((field) => {
            const val = formData[field.name] !== undefined ? formData[field.name] : '';

            if (field.type === 'textarea') {
              return (
                <div key={field.name}>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">
                    {field.label} {field.required && <span className="text-red-500">*</span>}
                  </label>
                  <textarea
                    rows={field.rows || 3}
                    required={field.required}
                    value={val}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                    placeholder={field.placeholder || ''}
                    className="w-full px-3 py-2 text-sm bg-white border border-zinc-300 rounded focus:outline-none focus:border-zinc-800 text-zinc-900"
                  />
                  {field.helper && (
                    <p className="text-[11px] text-zinc-400 mt-1">{field.helper}</p>
                  )}
                </div>
              );
            }

            if (field.type === 'select') {
              return (
                <div key={field.name}>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">
                    {field.label} {field.required && <span className="text-red-500">*</span>}
                  </label>
                  <select
                    required={field.required}
                    value={val}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-white border border-zinc-300 rounded focus:outline-none focus:border-zinc-800 text-zinc-900"
                  >
                    {field.options.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              );
            }

            return (
              <div key={field.name}>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">
                  {field.label} {field.required && <span className="text-red-500">*</span>}
                </label>
                <input
                  type={field.type || 'text'}
                  required={field.required}
                  value={val}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  placeholder={field.placeholder || ''}
                  className="w-full px-3 py-2 text-sm bg-white border border-zinc-300 rounded focus:outline-none focus:border-zinc-800 text-zinc-900"
                />
                {field.helper && (
                  <p className="text-[11px] text-zinc-400 mt-1">{field.helper}</p>
                )}
              </div>
            );
          })}

          <div className="pt-4 border-t border-zinc-100 flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-zinc-700 bg-white border border-zinc-300 rounded hover:bg-zinc-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-zinc-900 rounded hover:bg-black transition-colors"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
