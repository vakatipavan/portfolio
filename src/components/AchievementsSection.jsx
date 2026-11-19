import React, { useState } from 'react';
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
  const [compIndex, setCompIndex] = useState(0);
  const [certIndex, setCertIndex] = useState(0);

  // Safety checks if length changed
  const safeCompIndex = compIndex < competitions.length ? compIndex : 0;
  const safeCertIndex = certIndex < certifications.length ? certIndex : 0;

  const currentComp = competitions[safeCompIndex];
  const currentCert = certifications[safeCertIndex];

  const compRemaining = competitions.length > 0 ? competitions.length - 1 - safeCompIndex : 0;
  const certRemaining = certifications.length > 0 ? certifications.length - 1 - safeCertIndex : 0;

  const handleNextComp = () => {
    if (competitions.length > 1) {
      setCompIndex((prev) => (prev + 1) % competitions.length);
    }
  };

  const handleNextCert = () => {
    if (certifications.length > 1) {
      setCertIndex((prev) => (prev + 1) % certifications.length);
    }
  };

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
        {/* Column 1: Competitions & Events (Overlapping Stack) */}
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
            <div className="relative pb-5">
              {/* Background overlapping cards effect */}
              {competitions.length > 2 && (
                <div className="absolute top-4 inset-x-4 h-[calc(100%-16px)] bg-zinc-100 border border-zinc-200/80 rounded-md -z-20 pointer-events-none" />
              )}
              {competitions.length > 1 && (
                <div className="absolute top-2 inset-x-2 h-[calc(100%-10px)] bg-zinc-50 border border-zinc-200 rounded-md -z-10 pointer-events-none" />
              )}

              {/* Active Front Card */}
              <div
                onClick={handleNextComp}
                className="relative z-10 p-5 bg-white border border-zinc-300 hover:border-zinc-500 rounded-md shadow-sm transition-all cursor-pointer select-none group min-h-[175px] flex flex-col justify-between"
                title="Click card to view next"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-semibold text-sm text-zinc-900 leading-snug">
                      {currentComp.name}
                    </h4>

                    {/* How many left badge */}
                    {competitions.length > 1 && (
                      <span className="flex-shrink-0 px-2 py-0.5 text-[11px] font-semibold text-zinc-700 bg-zinc-100 border border-zinc-300 rounded-full group-hover:bg-zinc-900 group-hover:text-white transition-colors">
                        {compRemaining > 0 ? `+${compRemaining} more` : '↺ loop'}
                      </span>
                    )}
                  </div>

                  {currentComp.organizer && (
                    <p className="text-xs text-zinc-500 mt-1">
                      {currentComp.organizer}
                    </p>
                  )}

                  {currentComp.role && (
                    <p className="text-xs font-medium text-zinc-700 mt-2">
                      Role / Status: <span className="text-zinc-900">{currentComp.role}</span>
                    </p>
                  )}

                  {currentComp.description && (
                    <p className="text-xs text-zinc-600 mt-2 leading-relaxed">
                      {currentComp.description}
                    </p>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between text-[11px] text-zinc-400">
                  <span className="font-medium text-zinc-500">
                    {safeCompIndex + 1} of {competitions.length} • Click for next
                  </span>

                  <div className="flex items-center space-x-2">
                    {currentComp.link && (
                      <a
                        href={currentComp.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-zinc-500 hover:text-zinc-900 inline-flex items-center space-x-1"
                        title="View Link"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Link</span>
                      </a>
                    )}

                    {isAdmin && (
                      <div className="flex items-center space-x-1 ml-2" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => onEditCompetition(currentComp)}
                          className="text-xs text-zinc-500 hover:text-zinc-900 p-1"
                          title="Edit"
                        >
                          <Pencil className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => onDeleteCompetition(currentComp.id)}
                          className="text-xs text-red-500 hover:text-red-700 p-1"
                          title="Delete"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
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
                  className="p-5 bg-white border border-zinc-200 rounded hover:border-zinc-300 transition-colors"
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

        {/* Column 3: Certifications (Overlapping Stack) */}
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
            <div className="relative pb-5">
              {/* Background overlapping cards effect */}
              {certifications.length > 2 && (
                <div className="absolute top-4 inset-x-4 h-[calc(100%-16px)] bg-zinc-100 border border-zinc-200/80 rounded-md -z-20 pointer-events-none" />
              )}
              {certifications.length > 1 && (
                <div className="absolute top-2 inset-x-2 h-[calc(100%-10px)] bg-zinc-50 border border-zinc-200 rounded-md -z-10 pointer-events-none" />
              )}

              {/* Active Front Card */}
              <div
                onClick={handleNextCert}
                className="relative z-10 p-5 bg-white border border-zinc-300 hover:border-zinc-500 rounded-md shadow-sm transition-all cursor-pointer select-none group min-h-[175px] flex flex-col justify-between"
                title="Click card to view next"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-semibold text-sm text-zinc-900 leading-snug">
                      {currentCert.title}
                    </h4>

                    {/* How many left badge */}
                    {certifications.length > 1 && (
                      <span className="flex-shrink-0 px-2 py-0.5 text-[11px] font-semibold text-zinc-700 bg-zinc-100 border border-zinc-300 rounded-full group-hover:bg-zinc-900 group-hover:text-white transition-colors">
                        {certRemaining > 0 ? `+${certRemaining} more` : '↺ loop'}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-zinc-500 mt-1">
                    {currentCert.issuer} {currentCert.issuer && currentCert.date ? '•' : ''} {currentCert.date}
                  </p>

                  {currentCert.credentialId && (
                    <p className="text-xs text-zinc-400 mt-2 font-mono">
                      ID: {currentCert.credentialId}
                    </p>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between text-[11px] text-zinc-400">
                  <span className="font-medium text-zinc-500">
                    {safeCertIndex + 1} of {certifications.length} • Click for next
                  </span>

                  <div className="flex items-center space-x-2">
                    {currentCert.link && (
                      <a
                        href={currentCert.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-zinc-500 hover:text-zinc-900 inline-flex items-center space-x-1"
                        title="View Credential"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Link</span>
                      </a>
                    )}

                    {isAdmin && (
                      <div className="flex items-center space-x-1 ml-2" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => onEditCertificate(currentCert)}
                          className="text-xs text-zinc-500 hover:text-zinc-900 p-1"
                          title="Edit"
                        >
                          <Pencil className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => onDeleteCertificate(currentCert.id)}
                          className="text-xs text-red-500 hover:text-red-700 p-1"
                          title="Delete"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
