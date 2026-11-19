import React from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';

const CATEGORY_ICONS = {
  'Hobbies': '📚',
  'Sports': '⚽',
  'Games': '🎮',
  'Creative': '🎨',
  'Other': '✨',
};

export function InterestsSection({ interests = [], isAdmin, onAdd, onEdit, onDelete }) {
  return (
    <section id="interests" className="py-14 border-b border-zinc-200">
      <div className="flex items-center justify-between mb-8">
        <div>
          <span className="text-xs font-semibold tracking-wider uppercase text-zinc-500 block mb-1">
            7. Personal Side
          </span>
          <h2 className="text-2xl font-bold text-zinc-900 tracking-tight">
            Hobbies & Interests
          </h2>
        </div>

        {isAdmin && (
          <button
            onClick={onAdd}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-zinc-800 bg-white border border-zinc-300 rounded hover:bg-zinc-50 hover:border-zinc-400 transition-colors shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Category</span>
          </button>
        )}
      </div>

      {interests.length === 0 ? (
        <div className="py-8 text-center border border-dashed border-zinc-200 rounded text-zinc-500 text-sm">
          No hobbies or interests listed yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {interests.map((group) => (
            <div
              key={group.id}
              className="p-5 bg-white border border-zinc-200 rounded flex flex-col justify-between hover:border-zinc-300 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">
                      {CATEGORY_ICONS[group.category] || '✨'}
                    </span>
                    <h3 className="font-semibold text-sm text-zinc-900 tracking-tight">
                      {group.category}
                    </h3>
                  </div>
                  {isAdmin && (
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => onEdit(group)}
                        title="Edit"
                        className="p-1 text-zinc-400 hover:text-zinc-700 rounded hover:bg-zinc-100"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDelete(group.id)}
                        title="Delete"
                        className="p-1 text-red-400 hover:text-red-600 rounded hover:bg-red-50"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {(group.items || []).map((item, idx) => (
                    <span
                      key={idx}
                      className="inline-block px-2.5 py-1 text-xs font-medium text-zinc-700 bg-zinc-100 border border-zinc-200 rounded"
                    >
                      {item}
                    </span>
                  ))}
                  {(!group.items || group.items.length === 0) && (
                    <span className="text-xs text-zinc-400 italic">No items added</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
