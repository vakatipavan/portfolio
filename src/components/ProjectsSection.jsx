import React from 'react';
import { Plus, Pencil, Trash2, ExternalLink, Github } from 'lucide-react';

export function ProjectsSection({ projects = [], isAdmin, onAdd, onEdit, onDelete }) {
  return (
    <section id="projects" className="py-14 border-b border-zinc-200">
      <div className="flex items-center justify-between mb-8">
        <div>
          <span className="text-xs font-semibold tracking-wider uppercase text-zinc-500 block mb-1">
            4. Practical Work
          </span>
          <h2 className="text-2xl font-bold text-zinc-900 tracking-tight">
            My Projects
          </h2>
        </div>

        {isAdmin && (
          <button
            onClick={onAdd}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-zinc-800 bg-white border border-zinc-300 rounded hover:bg-zinc-50 hover:border-zinc-400 transition-colors shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Project</span>
          </button>
        )}
      </div>

      {projects.length === 0 ? (
        <div className="py-10 text-center border border-dashed border-zinc-200 rounded text-zinc-500 text-sm">
          No projects listed yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((proj) => (
            <div
              key={proj.id}
              className="p-5 bg-white border border-zinc-200 rounded flex flex-col justify-between hover:border-zinc-300 transition-colors"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-semibold text-base text-zinc-900">
                    {proj.title}
                  </h3>
                  <div className="flex items-center space-x-2 flex-shrink-0">
                    {proj.github && (
                      <a
                        href={proj.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-zinc-500 hover:text-zinc-900 transition-colors p-1"
                        title="GitHub Repository"
                      >
                        <Github className="w-4 h-4" />
                      </a>
                    )}
                    {proj.live && (
                      <a
                        href={proj.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-zinc-500 hover:text-zinc-900 transition-colors p-1"
                        title="Live Preview / Deployment"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>

                {proj.description && (
                  <p className="text-zinc-600 text-sm mt-2 leading-relaxed">
                    {proj.description}
                  </p>
                )}

                {proj.technologies && proj.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {proj.technologies.map((tech, i) => (
                      <span
                        key={i}
                        className="inline-block px-2 py-0.5 text-xs text-zinc-700 bg-zinc-100 rounded border border-zinc-200"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {isAdmin && (
                <div className="mt-5 pt-3 border-t border-zinc-100 flex items-center justify-end space-x-2">
                  <button
                    onClick={() => onEdit(proj)}
                    className="inline-flex items-center space-x-1 px-2.5 py-1 text-xs text-zinc-600 hover:text-zinc-900 border border-zinc-200 rounded hover:bg-zinc-50"
                  >
                    <Pencil className="w-3 h-3" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => onDelete(proj.id)}
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
