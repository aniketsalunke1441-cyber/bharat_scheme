// frontend/src/components/SchemeCard.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, 
  ExternalLink, 
  Bookmark, 
  ArrowRight, 
  CheckCircle, 
  ShieldCheck, 
  Phone
} from 'lucide-react';
import { Scheme } from '../types';
import { useSavedSchemes } from '../context/SavedSchemesContext';
import { useLanguage } from '../context/LanguageContext';

interface SchemeCardProps {
  scheme: Scheme;
  matchScore?: number;
  matchStatus?: 'ELIGIBLE' | 'POTENTIALLY_ELIGIBLE' | 'NOT_ELIGIBLE';
}

export const SchemeCard: React.FC<SchemeCardProps> = ({ scheme, matchScore, matchStatus }) => {
  const { isSaved, saveScheme, removeScheme } = useSavedSchemes();
  const { t } = useLanguage();
  const saved = isSaved(scheme.id);

  const handleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (saved) {
      removeScheme(scheme.id);
    } else {
      saveScheme(scheme);
    }
  };

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/90 hover:border-blue-300 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between overflow-hidden">
      
      {/* Top Banner & Tags */}
      <div className="p-5 sm:p-6 pb-4">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100">
              {scheme.level === 'State' ? `State (${scheme.state_name})` : 'Central Scheme'}
            </span>
            <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700">
              {scheme.category}
            </span>
          </div>

          {/* Bookmark Button */}
          <button
            type="button"
            onClick={handleBookmark}
            aria-label={saved ? "Remove bookmark" : "Save scheme"}
            className={`p-2 rounded-xl border transition-colors ${
              saved 
                ? 'bg-orange-50 border-orange-200 text-orange-600' 
                : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${saved ? 'fill-orange-500' : ''}`} />
          </button>
        </div>

        {/* Ministry */}
        <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-2 font-medium">
          <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="truncate">{scheme.ministry}</span>
        </div>

        {/* Title */}
        <Link to={`/scheme/${scheme.id}`} className="block group-hover:text-blue-700 transition-colors">
          <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug line-clamp-2">
            {scheme.title}
          </h3>
        </Link>

        {/* Brief */}
        <p className="mt-2 text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed">
          {scheme.brief}
        </p>

        {/* Benefits Preview */}
        {scheme.benefits && scheme.benefits.length > 0 && (
          <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Key Benefits
            </div>
            {scheme.benefits.slice(0, 2).map((benefit, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span className="line-clamp-1">{benefit}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="px-5 sm:px-6 py-3.5 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between gap-3">
        {/* Verified link to official portal */}
        <a
          href={scheme.official_portal_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-blue-700 transition-colors"
          title="Opens verified official portal in a new tab"
        >
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Verified Portal</span>
          <ExternalLink className="w-3 h-3 text-slate-400" />
        </a>

        {/* View Details Link */}
        <Link
          to={`/scheme/${scheme.id}`}
          className="inline-flex items-center gap-1 text-xs font-bold text-blue-700 hover:text-blue-900 group/link"
        >
          <span>{t('viewDetails')}</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
};
