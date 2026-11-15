import React from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';

export function PositionsSection({ positions = [], isAdmin, onAdd, onEdit, onDelete }) {
  return (
    <section id="positions" className="py-14 border-b border-zinc-200">
      <div className="flex items-center justify-between mb-8">
        <div>
          <span className="text-xs font-semibold tracking-wider uppercase text-zinc-500 block mb-1">
            6. Leadership & Involvement
          </span>
          <h2 className="text-2xl font-bold text-zinc-900 tracking-tight">
            Positions & Responsibilities
          </h2>
        </div>

        {isAdmin && (
          <button
            onClick={onAdd}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-zinc-800 bg-white border border-zinc-300 rounded hover:bg-zinc-50 hover:border-zinc-400 transition-colors shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Position</span>
          </button>
        )}
      </div>

      {positions.length === 0 ? (
        <div className="py-8 text-center border border-dashed border-zinc-200 rounded text-zinc-500 text-sm">
          No positions or responsibilities listed yet.
          {isAdmin && (
            <div className="mt-2">
              <button
                onClick={onAdd}
                className="text-xs text-zinc-800 font-medium underline"
              >
                Add a position or leadership responsibility
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {positions.map((pos) => (
            <div
              key={pos.id}
              className="p-5 bg-white border border-zinc-200 rounded hover:border-zinc-300 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <div>
                  <h3 className="font-semibold text-base text-zinc-900">
                    {pos.role}
                  </h3>
                  {pos.organization && (
                    <p className="text-sm text-zinc-600 font-medium mt-0.5">
                      {pos.organization}
                    </p>
                  )}
                </div>

                {pos.duration && (
                  <span className="text-xs text-zinc-500 font-medium sm:text-right">
                    {pos.duration}
                  </span>
                )}
              </div>

              {pos.description && (
                <p className="text-sm text-zinc-600 mt-3 leading-relaxed whitespace-pre-line">
                  {pos.description}
                </p>
              )}

              {isAdmin && (
                <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-end space-x-2">
                  <button
                    onClick={() => onEdit(pos)}
                    className="inline-flex items-center space-x-1 px-2.5 py-1 text-xs text-zinc-600 hover:text-zinc-900 border border-zinc-200 rounded hover:bg-zinc-50"
                  >
                    <Pencil className="w-3 h-3" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => onDelete(pos.id)}
                    className="inline-flex items-center space-x-1 px-2.5 py-1 text-xs text-red-600 hover:text-red-700 border border-red-200 rounded hover:bg-red-50"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Delete</span>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
