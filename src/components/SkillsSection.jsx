import React from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';

export function SkillsSection({ skills = [], isAdmin, onAdd, onEdit, onDelete }) {
  return (
    <section id="skills" className="py-14 border-b border-zinc-200">
      <div className="flex items-center justify-between mb-8">
        <div>
          <span className="text-xs font-semibold tracking-wider uppercase text-zinc-500 block mb-1">
            3. Core Proficiencies
          </span>
          <h2 className="text-2xl font-bold text-zinc-900 tracking-tight">
            Technical Skills
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

      {skills.length === 0 ? (
        <div className="py-8 text-center border border-dashed border-zinc-200 rounded text-zinc-500 text-sm">
          No skills listed yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {skills.map((group) => (
            <div
              key={group.id}
              className="p-5 bg-white border border-zinc-200 rounded flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-sm text-zinc-900 tracking-tight">
                    {group.category}
                  </h3>
                  {isAdmin && (
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => onEdit(group)}
                        title="Edit category"
                        className="p-1 text-zinc-400 hover:text-zinc-700 rounded hover:bg-zinc-100"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDelete(group.id)}
                        title="Delete category"
                        className="p-1 text-red-400 hover:text-red-600 rounded hover:bg-red-50"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {(group.items || []).map((skill, idx) => (
                    <span
                      key={idx}
                      className="inline-block px-2.5 py-1 text-xs font-medium text-zinc-800 bg-zinc-100 border border-zinc-200 rounded"
                    >
                      {skill}
                    </span>
                  ))}
                  {(!group.items || group.items.length === 0) && (
                    <span className="text-xs text-zinc-400 italic">No skills in this group</span>
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
