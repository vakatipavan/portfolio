import React from 'react';
import { Plus, Pencil, Trash2, Award, CheckCircle, ExternalLink, Trophy } from 'lucide-react';

export function AchievementsSection({
  achievements = [],
  certifications = [],
  competitions = [],
  isAdmin,
  onAddAchievement,
  onEditAchievement,
  onDeleteAchievement,
  onAddCertificate,
  onEditCertificate,
  onDeleteCertificate,
  onAddCompetition,
  onEditCompetition,
  onDeleteCompetition
}) {
  return (
    <section id="achievements" className="py-14 border-b border-zinc-200">
      <div className="mb-8">
        <span className="text-xs font-semibold tracking-wider uppercase text-zinc-500 block mb-1">
          5. Events, Recognition & Credentials
        </span>
        <h2 className="text-2xl font-bold text-zinc-900 tracking-tight">
          Competitions, Achievements & Certifications
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Column 1: Competitions & Events Participated */}
        <div>
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-zinc-200">
            <h3 className="text-base font-semibold text-zinc-900 flex items-center space-x-2">
              <Trophy className="w-4 h-4 text-zinc-700" />
              <span>Competitions & Events</span>
            </h3>
            {isAdmin && (
              <button
                onClick={onAddCompetition}
                className="inline-flex items-center space-x-1 px-2.5 py-1 text-xs font-medium text-zinc-800 bg-white border border-zinc-300 rounded hover:bg-zinc-50 transition-colors"
              >
                <Plus className="w-3 h-3" />
                <span>Add</span>
              </button>
            )}
          </div>

          {competitions.length === 0 ? (
            <div className="py-6 text-center border border-dashed border-zinc-200 rounded text-zinc-400 text-xs">
              No competitions or events listed yet.
            </div>
          ) : (
            <div className="space-y-4">
              {competitions.map((item) => (
                <div
                  key={item.id}
                  className="p-4 bg-white border border-zinc-200 rounded hover:border-zinc-300 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold text-sm text-zinc-900">
                        {item.name}
                      </h4>
                      {item.organizer && (
                        <p className="text-xs text-zinc-500 mt-0.5">
                          {item.organizer}
                        </p>
                      )}
                    </div>

                    {item.link && (
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-zinc-400 hover:text-zinc-800 p-1"
                        title="View Event / Certificate Link"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>

                  {item.role && (
                    <p className="text-xs font-medium text-zinc-700 mt-1.5">
                      Role / Status: <span className="text-zinc-900">{item.role}</span>
                    </p>
                  )}

                  {item.description && (
                    <p className="text-xs text-zinc-600 mt-2 leading-relaxed">
                      {item.description}
                    </p>
                  )}

                  {isAdmin && (
                    <div className="mt-3 pt-2 border-t border-zinc-100 flex items-center justify-end space-x-2">
                      <button
                        onClick={() => onEditCompetition(item)}
                        className="text-xs text-zinc-500 hover:text-zinc-900 flex items-center space-x-1"
                      >
                        <Pencil className="w-3 h-3" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => onDeleteCompetition(item.id)}
                        className="text-xs text-red-500 hover:text-red-700 flex items-center space-x-1"
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
        </div>

        {/* Column 2: Achievements */}
        <div>
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-zinc-200">
            <h3 className="text-base font-semibold text-zinc-900 flex items-center space-x-2">
              <Award className="w-4 h-4 text-zinc-700" />
              <span>Achievements</span>
            </h3>
            {isAdmin && (
              <button
                onClick={onAddAchievement}
                className="inline-flex items-center space-x-1 px-2.5 py-1 text-xs font-medium text-zinc-800 bg-white border border-zinc-300 rounded hover:bg-zinc-50 transition-colors"
              >
                <Plus className="w-3 h-3" />
                <span>Add</span>
              </button>
            )}
          </div>

          {achievements.length === 0 ? (
            <div className="py-6 text-center border border-dashed border-zinc-200 rounded text-zinc-400 text-xs">
              No achievements listed yet.
            </div>
          ) : (
            <div className="space-y-4">
              {achievements.map((item) => (
                <div
                  key={item.id}
                  className="p-4 bg-white border border-zinc-200 rounded hover:border-zinc-300 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold text-sm text-zinc-900">
                        {item.title}
                      </h4>
                      {item.issuer && (
                        <p className="text-xs text-zinc-500 mt-0.5">
                          {item.issuer}
                        </p>
                      )}
                    </div>
                  </div>

                  {item.description && (
                    <p className="text-xs text-zinc-600 mt-2 leading-relaxed">
                      {item.description}
                    </p>
                  )}

                  {isAdmin && (
                    <div className="mt-3 pt-2 border-t border-zinc-100 flex items-center justify-end space-x-2">
                      <button
                        onClick={() => onEditAchievement(item)}
                        className="text-xs text-zinc-500 hover:text-zinc-900 flex items-center space-x-1"
                      >
                        <Pencil className="w-3 h-3" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => onDeleteAchievement(item.id)}
                        className="text-xs text-red-500 hover:text-red-700 flex items-center space-x-1"
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
        </div>

        {/* Column 3: Certifications */}
        <div>
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-zinc-200">
            <h3 className="text-base font-semibold text-zinc-900 flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-zinc-700" />
              <span>Certifications</span>
            </h3>
            {isAdmin && (
              <button
                onClick={onAddCertificate}
                className="inline-flex items-center space-x-1 px-2.5 py-1 text-xs font-medium text-zinc-800 bg-white border border-zinc-300 rounded hover:bg-zinc-50 transition-colors"
              >
                <Plus className="w-3 h-3" />
                <span>Add</span>
              </button>
            )}
          </div>

          {certifications.length === 0 ? (
            <div className="py-6 text-center border border-dashed border-zinc-200 rounded text-zinc-400 text-xs">
              No certifications listed yet.
            </div>
          ) : (
            <div className="space-y-4">
              {certifications.map((cert) => (
                <div
                  key={cert.id}
                  className="p-4 bg-white border border-zinc-200 rounded hover:border-zinc-300 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold text-sm text-zinc-900">
                        {cert.title}
                      </h4>
                      <p className="text-xs text-zinc-500 mt-0.5">
                        {cert.issuer} {cert.issuer && cert.date ? '•' : ''} {cert.date}
                      </p>
                    </div>

                    {cert.link && (
                      <a
                        href={cert.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-zinc-400 hover:text-zinc-800 p-1"
                        title="View Credential"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>

                  {cert.credentialId && (
                    <p className="text-xs text-zinc-400 mt-1.5 font-mono">
                      ID: {cert.credentialId}
                    </p>
                  )}

                  {isAdmin && (
                    <div className="mt-3 pt-2 border-t border-zinc-100 flex items-center justify-end space-x-2">
                      <button
                        onClick={() => onEditCertificate(cert)}
                        className="text-xs text-zinc-500 hover:text-zinc-900 flex items-center space-x-1"
                      >
                        <Pencil className="w-3 h-3" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => onDeleteCertificate(cert.id)}
                        className="text-xs text-red-500 hover:text-red-700 flex items-center space-x-1"
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
        </div>
      </div>
    </section>
  );
}
