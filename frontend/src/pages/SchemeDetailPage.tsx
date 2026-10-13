// frontend/src/pages/SchemeDetailPage.tsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Building2, 
  ExternalLink, 
  Bookmark, 
  PhoneCall, 
  CheckCircle2, 
  FileText, 
  ListChecks, 
  ShieldCheck, 
  ArrowLeft, 
  Share2, 
  Calendar,
  AlertCircle
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useSavedSchemes } from '../context/SavedSchemesContext';
import { Scheme } from '../types';

export const SchemeDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { language, t } = useLanguage();
  const { isSaved, saveScheme, removeScheme } = useSavedSchemes();

  const [scheme, setScheme] = useState<Scheme | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/schemes/${id}?language=${language}`);
        if (res.ok) {
          const data = await res.json();
          setScheme(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchDetail();
    }
  }, [id, language]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 py-16 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-blue-900 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs sm:text-sm text-slate-500 font-semibold">
            Loading official scheme documentation...
          </p>
        </div>
      </div>
    );
  }

  if (!scheme) {
    return (
      <div className="min-h-screen bg-slate-50 py-16 flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md p-8 bg-white rounded-3xl border border-slate-200">
          <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
          <h2 className="text-xl font-bold text-slate-900">Scheme Not Found</h2>
          <p className="text-xs text-slate-500">
            The requested scheme record could not be found or has been updated.
          </p>
          <Link
            to="/categories"
            className="inline-block px-5 py-2.5 rounded-xl bg-blue-900 text-white text-xs font-bold"
          >
            Back to Scheme Directory
          </Link>
        </div>
      </div>
    );
  }

  const saved = isSaved(scheme.id);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 sm:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Navigation & Action Bar */}
        <div className="flex items-center justify-between gap-4">
          <Link
            to="/categories"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Schemes</span>
          </Link>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{copied ? 'Link Copied!' : 'Share'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (saved) {
                  removeScheme(scheme.id);
                } else {
                  saveScheme(scheme);
                }
              }}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border text-xs font-bold transition-colors ${
                saved
                  ? 'bg-orange-50 border-orange-200 text-orange-600'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${saved ? 'fill-orange-500' : ''}`} />
              <span>{saved ? t('savedScheme') : t('saveScheme')}</span>
            </button>
          </div>
        </div>

        {/* Top Hero Banner */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-10 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-md text-xs font-bold bg-blue-50 text-blue-800 border border-blue-100">
              {scheme.level === 'State' ? `State Government (${scheme.state_name})` : 'Central Sector Scheme'}
            </span>
            <span className="px-3 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700">
              {scheme.category}
            </span>
            <span className="px-3 py-1 rounded-md text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-100">
              Application: {scheme.application_mode}
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-500">
            <Building2 className="w-4 h-4 text-slate-400" />
            <span>{scheme.ministry}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 leading-tight">
            {scheme.title}
          </h1>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-3xl">
            {scheme.brief}
          </p>

          {/* Quick Action Strip */}
          <div className="pt-4 flex flex-wrap items-center gap-4 border-t border-slate-100">
            <a
              href={scheme.official_portal_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs sm:text-sm shadow-md transition-all hover:scale-102"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Visit Official Application Portal</span>
              <ExternalLink className="w-3.5 h-3.5 text-orange-200" />
            </a>

            {scheme.helpline_number && (
              <a
                href={`tel:${scheme.helpline_number.split('/')[0].trim()}`}
                className="inline-flex items-center gap-2 px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs sm:text-sm transition-colors"
              >
                <PhoneCall className="w-4 h-4 text-emerald-600" />
                <span>Helpline: {scheme.helpline_number}</span>
              </a>
            )}
          </div>
        </div>

        {/* Detailed Sections Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main 2-Column Content */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Scheme Description */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-3">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-700" />
                <span>Scheme Overview & Objectives</span>
              </h2>
              <div className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                {scheme.description || scheme.brief}
              </div>
            </div>

            {/* Benefits & Financial Assistance */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-4">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>Key Benefits & Entitlements</span>
              </h2>
              <div className="space-y-2.5">
                {scheme.benefits.map((b, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-emerald-50/50 border border-emerald-100">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm font-medium text-emerald-950">{b}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Application Walkthrough (Step by Step) */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-4">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <ListChecks className="w-5 h-5 text-blue-700" />
                <span>Step-by-Step Application Process</span>
              </h2>
              <div className="space-y-3">
                {scheme.application_steps && scheme.application_steps.length > 0 ? (
                  scheme.application_steps.map((st, idx) => (
                    <div key={idx} className="flex items-start gap-3.5 p-3.5 rounded-xl border border-slate-100 bg-slate-50/50">
                      <div className="w-6 h-6 rounded-full bg-blue-900 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                        {idx + 1}
                      </div>
                      <span className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
                        {st}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-500">
                    Visit the official portal at {scheme.official_portal_url} for live application instructions.
                  </p>
                )}
              </div>
            </div>

          </div>

          {/* Right Sidebar: Eligibility & Documents */}
          <div className="space-y-8">
            
            {/* Eligibility Summary Box */}
            <div className="bg-white rounded-3xl border border-blue-200 shadow-sm p-6 sm:p-8 space-y-3">
              <h3 className="text-base font-bold text-slate-900 uppercase tracking-wider text-xs text-blue-900">
                Eligibility Summary
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {scheme.eligibility_summary || "Citizens meeting age, income, and demographic criteria."}
              </p>
              
              <div className="pt-2">
                <Link
                  to="/eligibility"
                  className="block w-full py-2.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-white text-center font-bold text-xs transition-colors shadow-2xs"
                >
                  Check If You Qualify
                </Link>
              </div>
            </div>

            {/* Documents Required Checklist */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-orange-500" />
                <span>Mandatory Documents</span>
              </h3>
              <ul className="space-y-2">
                {scheme.documents_required && scheme.documents_required.length > 0 ? (
                  scheme.documents_required.map((doc, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700">
                      <div className="w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0 mt-1.5" />
                      <span>{doc}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-xs text-slate-500">
                    Aadhaar card, Bank passbook, and proof of address.
                  </li>
                )}
              </ul>
            </div>

            {/* Official Portal Verification Box */}
            <div className="bg-slate-900 text-slate-300 rounded-3xl p-6 sm:p-8 space-y-3">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4" />
                <span>Verified Government Source</span>
              </div>
              <p className="text-xs leading-relaxed text-slate-400">
                BharatScheme AI only references authentic government web domains (.gov.in / .nic.in).
              </p>
              <div className="pt-1">
                <a
                  href={scheme.official_portal_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-white hover:text-orange-400 transition-colors break-all"
                >
                  <span>{scheme.official_portal_url}</span>
                  <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                </a>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
