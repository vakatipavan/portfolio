import React from 'react';
import { Pencil, Mail, Phone, MapPin, Linkedin, Github, Twitter, ExternalLink } from 'lucide-react';

export function ContactSection({ contact = {}, isAdmin, onEdit }) {
  const { email, phone, location, linkedin, github, twitter } = contact;

  return (
    <section id="contact" className="py-14">
      <div className="flex items-center justify-between mb-8">
        <div>
          <span className="text-xs font-semibold tracking-wider uppercase text-zinc-500 block mb-1">
            7. Get In Touch
          </span>
          <h2 className="text-2xl font-bold text-zinc-900 tracking-tight">
            Contact Details
          </h2>
        </div>

        {isAdmin && (
          <button
            onClick={onEdit}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-zinc-700 bg-white border border-zinc-300 rounded hover:bg-zinc-50 hover:border-zinc-400 transition-colors shadow-sm"
          >
            <Pencil className="w-3.5 h-3.5 text-zinc-500" />
            <span>Edit Contact</span>
          </button>
        )}
      </div>

      <div className="p-6 bg-white border border-zinc-200 rounded max-w-2xl">
        <div className="space-y-4 text-sm">
          {/* Email */}
          <div className="flex items-start space-x-3">
            <Mail className="w-4 h-4 text-zinc-400 mt-0.5 flex-shrink-0" />
            <div>
              <span className="text-xs font-medium text-zinc-400 block uppercase tracking-wider">
                Email
              </span>
              {email ? (
                <a
                  href={`mailto:${email}`}
                  className="text-zinc-900 hover:underline font-medium break-all"
                >
                  {email}
                </a>
              ) : (
                <span className="text-zinc-400 italic">Not specified</span>
              )}
            </div>
          </div>

          {/* Phone */}
          {phone ? (
            <div className="flex items-start space-x-3">
              <Phone className="w-4 h-4 text-zinc-400 mt-0.5 flex-shrink-0" />
              <div>
                <span className="text-xs font-medium text-zinc-400 block uppercase tracking-wider">
                  Phone
                </span>
                <a
                  href={`tel:${phone}`}
                  className="text-zinc-900 hover:underline font-medium"
                >
                  {phone}
                </a>
              </div>
            </div>
          ) : isAdmin ? (
            <div className="flex items-start space-x-3 text-zinc-400 italic text-xs">
              <Phone className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>Phone number not set (Click Edit Contact to add)</span>
            </div>
          ) : null}

          {/* Location */}
          {location && (
            <div className="flex items-start space-x-3">
              <MapPin className="w-4 h-4 text-zinc-400 mt-0.5 flex-shrink-0" />
              <div>
                <span className="text-xs font-medium text-zinc-400 block uppercase tracking-wider">
                  Location
                </span>
                <span className="text-zinc-700">{location}</span>
              </div>
            </div>
          )}

          {/* Social Links */}
          <div className="pt-4 border-t border-zinc-100 flex flex-wrap gap-4 text-xs font-medium">
            {linkedin && (
              <a
                href={linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1.5 text-zinc-700 hover:text-black transition-colors"
              >
                <Linkedin className="w-4 h-4 text-zinc-500" />
                <span>LinkedIn</span>
                <ExternalLink className="w-3 h-3 text-zinc-400" />
              </a>
            )}

            {github && (
              <a
                href={github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1.5 text-zinc-700 hover:text-black transition-colors"
              >
                <Github className="w-4 h-4 text-zinc-500" />
                <span>GitHub</span>
                <ExternalLink className="w-3 h-3 text-zinc-400" />
              </a>
            )}

            {twitter && (
              <a
                href={twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1.5 text-zinc-700 hover:text-black transition-colors"
              >
                <Twitter className="w-4 h-4 text-zinc-500" />
                <span>Twitter / X</span>
                <ExternalLink className="w-3 h-3 text-zinc-400" />
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
