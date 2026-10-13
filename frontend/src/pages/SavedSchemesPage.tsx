// frontend/src/pages/SavedSchemesPage.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Bookmark, 
  Trash2, 
  ExternalLink, 
  Printer, 
  FileEdit, 
  Save, 
  ShieldCheck, 
  Building2, 
  CheckSquare,
  ArrowRight
} from 'lucide-react';
import { useSavedSchemes } from '../context/SavedSchemesContext';
import { useLanguage } from '../context/LanguageContext';

export const SavedSchemesPage: React.FC = () => {
  const { savedSchemes, removeScheme, updateNotes } = useSavedSchemes();
  const { t } = useLanguage();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempNotes, setTempNotes] = useState<string>('');

  const handleStartEdit = (id: string, currentNotes?: string) => {
    setEditingId(id);
    setTempNotes(currentNotes || '');
  };

  const handleSaveNotes = (id: string) => {
    updateNotes(id, tempNotes);
    setEditingId(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 sm:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-semibold mb-2">
              <Bookmark className="w-3.5 h-3.5 text-orange-600" />
              <span>Personal Bookmarks & Application Checklist</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Saved Schemes ({savedSchemes.length})
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-500">
              Manage schemes you plan to apply for, add personal notes, and generate an application checklist.
            </p>
          </div>

          {savedSchemes.length > 0 && (
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-bold shadow-2xs transition-colors self-start sm:self-auto"
            >
              <Printer className="w-4 h-4 text-slate-500" />
              <span>Print Checklist</span>
            </button>
          )}
        </div>

        {/* List of Saved Schemes */}
        {savedSchemes.length > 0 ? (
          <div className="space-y-6">
            {savedSchemes.map(({ id, scheme, notes, savedAt }) => (
              <div
                key={id}
                className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 hover:border-blue-200 transition-all space-y-4"
              >
                {/* Top Details */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-blue-50 text-blue-800 border border-blue-100">
                      {scheme.level === 'State' ? `State (${scheme.state_name})` : 'Central'}
                    </span>
                    <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700">
                      {scheme.category}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Saved on {new Date(savedAt).toLocaleDateString()}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeScheme(id)}
                    className="self-start sm:self-auto inline-flex items-center gap-1.5 text-xs text-rose-600 hover:text-rose-800 font-semibold transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Remove</span>
                  </button>
                </div>

                {/* Title & Ministry */}
                <div>
                  <div className="text-xs font-medium text-slate-500 mb-1 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    <span>{scheme.ministry}</span>
                  </div>
                  <Link to={`/scheme/${scheme.id}`} className="hover:text-blue-700">
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
                      {scheme.title}
                    </h3>
                  </Link>
                  <p className="mt-2 text-xs sm:text-sm text-slate-600">
                    {scheme.brief}
                  </p>
                </div>

                {/* Personal Notes Section */}
                <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                      <FileEdit className="w-3.5 h-3.5 text-amber-700" />
                      <span>My Application Notes</span>
                    </div>
                    {editingId !== id && (
                      <button
                        type="button"
                        onClick={() => handleStartEdit(id, notes)}
                        className="text-xs font-bold text-amber-900 hover:underline"
                      >
                        {notes ? 'Edit Note' : '+ Add Note'}
                      </button>
                    )}
                  </div>

                  {editingId === id ? (
                    <div className="space-y-2 mt-2">
                      <textarea
                        rows={2}
                        value={tempNotes}
                        onChange={(e) => setTempNotes(e.target.value)}
                        placeholder="e.g. Need to collect land 7/12 extract from Talathi office; CSC visit on Monday..."
                        className="w-full p-2.5 text-xs rounded-xl border border-amber-300 bg-white text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setEditingId(null)}
                          className="px-3 py-1 rounded-lg text-xs font-semibold text-slate-600 bg-white border border-slate-200"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSaveNotes(id)}
                          className="px-3 py-1 rounded-lg text-xs font-bold text-white bg-amber-700 hover:bg-amber-800 flex items-center gap-1"
                        >
                          <Save className="w-3 h-3" />
                          <span>Save</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-amber-950/80 italic">
                      {notes || 'No notes added yet. Add notes about application deadlines or pending documents.'}
                    </p>
                  )}
                </div>

                {/* Action Links */}
                <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-100">
                  <div className="text-xs text-slate-500 font-medium">
                    Application Mode: <strong>{scheme.application_mode}</strong>
                  </div>

                  <div className="flex items-center gap-3">
                    <a
                      href={scheme.official_portal_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs shadow-2xs transition-colors"
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Official Portal</span>
                      <ExternalLink className="w-3 h-3 text-orange-200" />
                    </a>

                    <Link
                      to={`/scheme/${scheme.id}`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-blue-700 hover:text-blue-900"
                    >
                      <span>Full Details & Documents</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
            <div className="w-16 h-16 rounded-2xl bg-orange-50 text-orange-500 mx-auto flex items-center justify-center mb-4">
              <Bookmark className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              No Saved Schemes Yet
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mt-1 mb-6">
              When you browse schemes or complete your personalized eligibility check, bookmark schemes to create your application checklist here.
            </p>
            <div className="flex justify-center gap-3">
              <Link
                to="/eligibility"
                className="px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs shadow-md transition-colors"
              >
                Start Eligibility Check
              </Link>
              <Link
                to="/categories"
                className="px-6 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors"
              >
                Browse Directory
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
