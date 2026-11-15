import React from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';

export function EducationSection({ education = [], isAdmin, onAdd, onEdit, onDelete }) {
  return (
    <section id="education" className="py-14 border-b border-zinc-200">
      <div className="flex items-center justify-between mb-8">
        <div>
          <span className="text-xs font-semibold tracking-wider uppercase text-zinc-500 block mb-1">
            2. Academic Background
          </span>
          <h2 className="text-2xl font-bold text-zinc-900 tracking-tight">
            Education
          </h2>
        </div>

        {isAdmin && (
          <button
            onClick={onAdd}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-zinc-800 bg-white border border-zinc-300 rounded hover:bg-zinc-50 hover:border-zinc-400 transition-colors shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Record</span>
          </button>
        )}
      </div>

      {education.length === 0 ? (
        <div className="py-8 text-center border border-dashed border-zinc-200 rounded text-zinc-500 text-sm">
          No education records added yet.
          {isAdmin && (
            <div className="mt-2">
              <button
                onClick={onAdd}
                className="text-xs text-zinc-800 font-medium underline"
              >
                Add your first education record
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {education.map((item) => (
            <div
              key={item.id}
              className="group relative p-5 bg-white border border-zinc-200 rounded hover:border-zinc-300 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                <div className="flex items-center space-x-2.5">
                  <span className="inline-block px-2.5 py-0.5 text-xs font-semibold text-zinc-700 bg-zinc-100 border border-zinc-200 rounded">
                    {item.level || "Education"}
                  </span>
                  <h3 className="text-base font-semibold text-zinc-900">
                    {item.degree || "Degree / Course"}
                  </h3>
                </div>

                {item.period && (
                  <span className="text-xs font-medium text-zinc-500 sm:text-right">
                    {item.period}
                  </span>
                )}
              </div>

              <div className="mt-2 text-sm text-zinc-700">
                {item.institution ? (
                  <p className="font-medium text-zinc-800">{item.institution}</p>
                ) : (
                  <p className="italic text-zinc-400">
                    {isAdmin ? "Institution: [Click Edit to enter institution name]" : ""}
                  </p>
                )}

                {item.score && (
                  <p className="text-xs font-medium text-zinc-600 mt-1">
                    Grade / Score: <span className="text-zinc-800">{item.score}</span>
                  </p>
                )}

                {item.details && (
                  <p className="text-xs text-zinc-500 mt-2 leading-relaxed">
                    {item.details}
                  </p>
                )}
              </div>

              {isAdmin && (
                <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-end space-x-2">
                  <button
                    onClick={() => onEdit(item)}
                    className="inline-flex items-center space-x-1 px-2.5 py-1 text-xs text-zinc-600 hover:text-zinc-900 border border-zinc-200 rounded hover:bg-zinc-50"
                  >
                    <Pencil className="w-3 h-3" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => onDelete(item.id)}
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
