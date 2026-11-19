import React from 'react';
import { Pencil, Mail, Phone, Linkedin, Github } from 'lucide-react';

export function PersonalSection({ data, isAdmin, onEdit }) {
  const { name, title, intro } = data.personal || {};
  const contact = data.contact || {};

  return (
    <section id="personal" className="pt-12 pb-16 border-b border-zinc-200">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div className="max-w-3xl">
          <span className="text-xs font-semibold tracking-wider uppercase text-zinc-500 mb-2 block">
            1. Personal Details
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold text-zinc-900 tracking-tight">
            {name || "Your Name"}
          </h1>
          {title && (
            <p className="text-lg sm:text-xl text-zinc-600 font-medium mt-2">
              {title}
            </p>
          )}
          {intro ? (
            <p className="text-zinc-700 text-base sm:text-lg leading-relaxed mt-4 whitespace-pre-line">
              {intro}
            </p>
          ) : (
            <p className="text-zinc-400 italic text-sm mt-4">
              No introduction provided yet.
            </p>
          )}

          {/* Profile Quick Links (Phone, Email, LinkedIn, GitHub) */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-6 text-xs text-zinc-600 font-medium">
            {contact.email && (
              <a
                href={`mailto:${contact.email}`}
                className="inline-flex items-center space-x-1.5 px-2.5 py-1 bg-zinc-50 border border-zinc-200 rounded hover:border-zinc-300 hover:text-black transition-colors"
                title="Email"
              >
                <Mail className="w-3.5 h-3.5 text-zinc-500" />
                <span>{contact.email}</span>
              </a>
            )}

            {contact.phone && (
              <a
                href={`tel:${contact.phone}`}
                className="inline-flex items-center space-x-1.5 px-2.5 py-1 bg-zinc-50 border border-zinc-200 rounded hover:border-zinc-300 hover:text-black transition-colors"
                title="Phone"
              >
                <Phone className="w-3.5 h-3.5 text-zinc-500" />
                <span>{contact.phone}</span>
              </a>
            )}

            {contact.linkedin && (
              <a
                href={contact.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1.5 px-2.5 py-1 bg-zinc-50 border border-zinc-200 rounded hover:border-zinc-300 hover:text-black transition-colors"
                title="LinkedIn Profile"
              >
                <Linkedin className="w-3.5 h-3.5 text-zinc-500" />
                <span>LinkedIn</span>
              </a>
            )}

            {contact.github && (
              <a
                href={contact.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1.5 px-2.5 py-1 bg-zinc-50 border border-zinc-200 rounded hover:border-zinc-300 hover:text-black transition-colors"
                title="GitHub Profile"
              >
                <Github className="w-3.5 h-3.5 text-zinc-500" />
                <span>GitHub</span>
              </a>
            )}
          </div>
        </div>

        {isAdmin && (
          <div className="flex-shrink-0 self-start">
            <button
              onClick={onEdit}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-zinc-700 bg-white border border-zinc-300 rounded hover:bg-zinc-50 hover:border-zinc-400 transition-colors shadow-sm"
            >
              <Pencil className="w-3.5 h-3.5 text-zinc-500" />
              <span>Edit Details</span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
