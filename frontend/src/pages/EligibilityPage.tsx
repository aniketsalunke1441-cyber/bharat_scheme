// frontend/src/pages/EligibilityPage.tsx
import React, { useState } from 'react';
import { 
  CheckCircle2, 
  AlertCircle, 
  HelpCircle, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  Filter, 
  Printer, 
  ExternalLink, 
  Bookmark, 
  ShieldCheck, 
  RotateCcw,
  Building,
  User,
  IndianRupee,
  Briefcase,
  ChevronRight
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useSavedSchemes } from '../context/SavedSchemesContext';
import { EligibilityProfile, EligibilityCheckResponse, SchemeMatchResult } from '../types';

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", 
  "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", 
  "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", 
  "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", 
  "Uttar Pradesh", "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands", 
  "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Jammu and Kashmir", 
  "Ladakh", "Lakshadweep", "Puducherry"
];

export const EligibilityPage: React.FC = () => {
  const { language, t } = useLanguage();
  const { isSaved, saveScheme, removeScheme } = useSavedSchemes();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [submitting, setSubmitting] = useState(false);
  const [resultsData, setResultsData] = useState<EligibilityCheckResponse | null>(null);
  const [activeTab, setActiveTab] = useState<'ALL' | 'ELIGIBLE' | 'POTENTIALLY_ELIGIBLE' | 'NOT_ELIGIBLE'>('ELIGIBLE');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');

  // Form State
  const [formData, setFormData] = useState<EligibilityProfile>({
    state: "Maharashtra",
    district: "",
    age: 24,
    gender: "female",
    caste_category: "General",
    occupation: "student",
    student_status: true,
    education_level: "undergraduate",
    annual_income: 180000,
    is_farmer: false,
    has_landholding: false,
    is_entrepreneur: false,
    is_differently_abled: false,
    is_bpl_ration_card_holder: false,
    is_minority: false,
    language: language
  });

  const handleInputChange = (field: keyof EligibilityProfile, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleOccupationChange = (occ: string) => {
    const isStudent = occ === 'student';
    const isFarmer = occ === 'farmer';
    const isEnt = ['entrepreneur', 'self_employed', 'artisan', 'street_vendor'].includes(occ);

    setFormData(prev => ({
      ...prev,
      occupation: occ,
      student_status: isStudent,
      is_farmer: isFarmer,
      is_entrepreneur: isEnt
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        language: language
      };

      const res = await fetch('/api/eligibility/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const data: EligibilityCheckResponse = await res.json();
        setResultsData(data);
        // Default to showing eligible schemes first, or potential if none eligible
        if (data.eligible_count > 0) {
          setActiveTab('ELIGIBLE');
        } else if (data.potentially_eligible_count > 0) {
          setActiveTab('POTENTIALLY_ELIGIBLE');
        } else {
          setActiveTab('ALL');
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (err) {
      console.error('Eligibility check error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setResultsData(null);
    setStep(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Filter schemes in results view
  const filteredSchemes = resultsData ? resultsData.results.filter(item => {
    if (activeTab !== 'ALL' && item.match_status !== activeTab) {
      return false;
    }
    if (categoryFilter !== 'All' && item.category !== categoryFilter) {
      return false;
    }
    return true;
  }) : [];

  const availableCategories = resultsData
    ? Array.from(new Set(resultsData.results.map(r => r.category)))
    : [];

  return (
    <div className="min-h-screen bg-slate-50 py-10 sm:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Rule-Based Citizen Matching Engine</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Personalized Scheme Eligibility Finder
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-2xl mx-auto">
            Provide basic criteria below to discover schemes you qualify for, understand exact reasons, and access verified application steps.
          </p>
        </div>

        {/* IF RESULTS ARE AVAILABLE: DISPLAY RESULTS DASHBOARD */}
        {resultsData ? (
          <div className="space-y-8 animate-in fade-in duration-300">
            
            {/* Top Scorecard */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Analysis Completed
                  </span>
                  <h2 className="text-2xl font-black text-slate-900 mt-0.5">
                    Your Personalized Eligibility Report
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Evaluated across {resultsData.total_schemes_analyzed} Central & State schemes for a resident of {formData.state} (Age {formData.age}).
                  </p>
                </div>

                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs sm:text-sm font-semibold transition-colors"
                  >
                    <Printer className="w-4 h-4 text-slate-500" />
                    <span>Print / Save PDF</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleReset}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-semibold transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Modify Profile</span>
                  </button>
                </div>
              </div>

              {/* Stats Counters */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                
                <div 
                  onClick={() => setActiveTab('ELIGIBLE')}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    activeTab === 'ELIGIBLE' 
                      ? 'bg-emerald-50 border-emerald-300 ring-2 ring-emerald-500/20' 
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Eligible</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="mt-2 text-3xl font-extrabold text-emerald-900">
                    {resultsData.eligible_count}
                  </div>
                  <p className="text-[11px] text-emerald-700 mt-0.5">100% Criteria Satisfied</p>
                </div>

                <div 
                  onClick={() => setActiveTab('POTENTIALLY_ELIGIBLE')}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    activeTab === 'POTENTIALLY_ELIGIBLE' 
                      ? 'bg-amber-50 border-amber-300 ring-2 ring-amber-500/20' 
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">Potential</span>
                    <AlertCircle className="w-4 h-4 text-amber-600" />
                  </div>
                  <div className="mt-2 text-3xl font-extrabold text-amber-900">
                    {resultsData.potentially_eligible_count}
                  </div>
                  <p className="text-[11px] text-amber-700 mt-0.5">Verification Needed</p>
                </div>

                <div 
                  onClick={() => setActiveTab('ALL')}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    activeTab === 'ALL' 
                      ? 'bg-blue-50 border-blue-300 ring-2 ring-blue-500/20' 
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-800 uppercase tracking-wider">Total</span>
                    <Filter className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="mt-2 text-3xl font-extrabold text-blue-900">
                    {resultsData.total_schemes_analyzed}
                  </div>
                  <p className="text-[11px] text-blue-700 mt-0.5">All Analyzed Schemes</p>
                </div>

                <div 
                  onClick={() => setActiveTab('NOT_ELIGIBLE')}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    activeTab === 'NOT_ELIGIBLE' 
                      ? 'bg-rose-50 border-rose-300 ring-2 ring-rose-500/20' 
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Ineligible</span>
                    <HelpCircle className="w-4 h-4 text-slate-400" />
                  </div>
                  <div className="mt-2 text-3xl font-extrabold text-slate-700">
                    {resultsData.not_eligible_count}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">Criteria Unmet</p>
                </div>

              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-slate-500 mr-1">Filter Sector:</span>
              <button
                type="button"
                onClick={() => setCategoryFilter('All')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  categoryFilter === 'All'
                    ? 'bg-slate-900 text-white'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                All Sectors ({resultsData.results.length})
              </button>
              {availableCategories.map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    categoryFilter === cat
                      ? 'bg-blue-800 text-white'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Schemes Results List */}
            <div className="space-y-6">
              {filteredSchemes.length > 0 ? (
                filteredSchemes.map((item) => {
                  const saved = isSaved(item.scheme_id);
                  const isEligible = item.match_status === 'ELIGIBLE';
                  const isPotential = item.match_status === 'POTENTIALLY_ELIGIBLE';

                  return (
                    <div 
                      key={item.scheme_id}
                      className={`bg-white rounded-3xl border transition-all p-6 sm:p-8 shadow-xs hover:shadow-md ${
                        isEligible 
                          ? 'border-emerald-200 bg-linear-to-b from-white to-emerald-50/20' 
                          : isPotential
                          ? 'border-amber-200 bg-linear-to-b from-white to-amber-50/20'
                          : 'border-slate-200 opacity-80'
                      }`}
                    >
                      {/* Top Bar with Badges and Bookmark */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                        <div className="flex flex-wrap items-center gap-2">
                          {/* Match Score Badge */}
                          <span className={`px-3 py-1 rounded-full text-xs font-black tracking-wide ${
                            isEligible 
                              ? 'bg-emerald-600 text-white' 
                              : isPotential 
                              ? 'bg-amber-500 text-white'
                              : 'bg-slate-400 text-white'
                          }`}>
                            {item.match_score}% Match • {
                              isEligible ? t('eligibleBadge') : isPotential ? t('potentiallyEligibleBadge') : t('notEligibleBadge')
                            }
                          </span>

                          <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-50 text-blue-800 border border-blue-100">
                            {item.level === 'State' ? `State (${item.state_name})` : 'Central'}
                          </span>

                          <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700">
                            {item.category}
                          </span>
                        </div>

                        {/* Save Button */}
                        <button
                          type="button"
                          onClick={() => {
                            if (saved) {
                              removeScheme(item.scheme_id);
                            } else {
                              saveScheme({
                                id: item.scheme_id,
                                slug: item.slug,
                                title: item.title,
                                title_en: item.title,
                                ministry: item.ministry,
                                level: item.level,
                                state_name: item.state_name,
                                category: item.category,
                                brief: item.brief,
                                benefits: item.benefits,
                                official_portal_url: item.official_portal_url,
                                application_mode: item.application_mode,
                                helpline_number: item.helpline_number,
                                tags: []
                              });
                            }
                          }}
                          className={`self-start sm:self-auto inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors ${
                            saved
                              ? 'bg-orange-50 border-orange-200 text-orange-600'
                              : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          <Bookmark className={`w-3.5 h-3.5 ${saved ? 'fill-orange-500' : ''}`} />
                          <span>{saved ? t('savedScheme') : t('saveScheme')}</span>
                        </button>
                      </div>

                      {/* Ministry & Title */}
                      <div className="text-xs font-medium text-slate-500 mb-1">
                        {item.ministry}
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 leading-snug">
                        {item.title}
                      </h3>
                      <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                        {item.brief}
                      </p>

                      {/* Explainability Breakdown (Why you qualify / What is missing) */}
                      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 pt-5 border-t border-slate-100">
                        
                        {/* Matched Criteria */}
                        <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100 space-y-2">
                          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-800">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            <span>Why You Qualify ({item.matched_reasons.length})</span>
                          </div>
                          <ul className="space-y-1.5 text-xs text-emerald-950">
                            {item.matched_reasons.map((reason, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <span className="text-emerald-500 font-bold shrink-0">•</span>
                                <span>{reason}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Unmet Criteria / Missing Information */}
                        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-700">
                            <AlertCircle className="w-4 h-4 text-amber-500" />
                            <span>
                              {item.unmet_reasons.length > 0 ? `Unmet Criteria (${item.unmet_reasons.length})` : 'Requirements & Documents Needed'}
                            </span>
                          </div>
                          
                          {item.unmet_reasons.length > 0 ? (
                            <ul className="space-y-1.5 text-xs text-rose-800">
                              {item.unmet_reasons.map((unmet, idx) => (
                                <li key={idx} className="flex items-start gap-2">
                                  <span className="text-rose-500 font-bold shrink-0">✕</span>
                                  <span>{unmet}</span>
                                </li>
                              ))}
                            </ul>
                          ) : item.info_needed.length > 0 ? (
                            <ul className="space-y-1.5 text-xs text-amber-900">
                              {item.info_needed.map((info, idx) => (
                                <li key={idx} className="flex items-start gap-2">
                                  <span className="text-amber-500 font-bold shrink-0">⚠</span>
                                  <span>{info}</span>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-xs text-slate-500">
                              All specified demographic and income prerequisites fully satisfied.
                            </p>
                          )}
                        </div>

                      </div>

                      {/* Card Bottom CTA Links */}
                      <div className="mt-6 flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-100">
                        <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
                          <span>Application: <strong>{item.application_mode}</strong></span>
                          {item.helpline_number && (
                            <span>• Helpline: <strong>{item.helpline_number}</strong></span>
                          )}
                        </div>

                        <div className="flex items-center gap-3">
                          <a
                            href={item.official_portal_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs shadow-xs transition-colors"
                          >
                            <ShieldCheck className="w-3.5 h-3.5" />
                            <span>Apply on Official Portal</span>
                            <ExternalLink className="w-3 h-3 text-orange-200" />
                          </a>

                          <a
                            href={`/scheme/${item.scheme_id}`}
                            className="inline-flex items-center gap-1 text-xs font-bold text-blue-700 hover:text-blue-900"
                          >
                            <span>Full Scheme Details</span>
                            <ChevronRight className="w-4 h-4" />
                          </a>
                        </div>
                      </div>

                    </div>
                  );
                })
              ) : (
                <div className="text-center py-12 bg-white rounded-3xl border border-slate-200">
                  <AlertCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-slate-600 font-semibold">No schemes match the selected tab filter.</p>
                  <button
                    type="button"
                    onClick={() => { setActiveTab('ALL'); setCategoryFilter('All'); }}
                    className="mt-3 text-xs font-bold text-blue-700 hover:underline"
                  >
                    View all analyzed schemes
                  </button>
                </div>
              )}
            </div>

          </div>
        ) : (
          /* STEP-BY-STEP ELIGIBILITY FORM */
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
            
            {/* Step Progress Indicators */}
            <div className="grid grid-cols-3 border-b border-slate-200 bg-slate-50/70">
              <div 
                className={`py-4 px-3 sm:px-6 text-center border-r border-slate-200 transition-colors ${
                  step === 1 ? 'bg-white font-bold text-blue-900 border-b-2 border-b-blue-600' : 'text-slate-500'
                }`}
              >
                <div className="text-[11px] uppercase tracking-wider text-slate-400">Step 1</div>
                <div className="text-xs sm:text-sm font-semibold truncate">Demographics & State</div>
              </div>

              <div 
                className={`py-4 px-3 sm:px-6 text-center border-r border-slate-200 transition-colors ${
                  step === 2 ? 'bg-white font-bold text-blue-900 border-b-2 border-b-blue-600' : 'text-slate-500'
                }`}
              >
                <div className="text-[11px] uppercase tracking-wider text-slate-400">Step 2</div>
                <div className="text-xs sm:text-sm font-semibold truncate">Socio-Economic & Income</div>
              </div>

              <div 
                className={`py-4 px-3 sm:px-6 text-center transition-colors ${
                  step === 3 ? 'bg-white font-bold text-blue-900 border-b-2 border-b-blue-600' : 'text-slate-500'
                }`}
              >
                <div className="text-[11px] uppercase tracking-wider text-slate-400">Step 3</div>
                <div className="text-xs sm:text-sm font-semibold truncate">Occupation & Specifics</div>
              </div>
            </div>

            {/* FORM CONTAINER */}
            <form onSubmit={handleSubmit} className="p-6 sm:p-10">
              
              {/* STEP 1: DEMOGRAPHICS & LOCATION */}
              {step === 1 && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">
                      Where do you live, and what is your age?
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1">
                      Helps match State-level schemes (e.g. Maharashtra Ladki Bahin or Jyotirao Phule Jan Arogya) and age brackets.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* State Dropdown */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        State or Union Territory *
                      </label>
                      <select
                        value={formData.state}
                        onChange={(e) => handleInputChange('state', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                        required
                      >
                        {INDIAN_STATES.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>

                    {/* District Optional */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        District (Optional)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Pune, Nagpur, Nashik"
                        value={formData.district || ''}
                        onChange={(e) => handleInputChange('district', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  {/* Age Input */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Your Age (Years) *
                    </label>
                    <div className="flex items-center gap-4">
                      <input
                        type="number"
                        min="0"
                        max="110"
                        value={formData.age}
                        onChange={(e) => handleInputChange('age', parseInt(e.target.value) || 0)}
                        className="w-32 px-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm font-bold text-center focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                        required
                      />
                      <div className="flex flex-wrap gap-2 text-xs">
                        {[18, 22, 28, 35, 45, 60, 70].map((quickAge) => (
                          <button
                            key={quickAge}
                            type="button"
                            onClick={() => handleInputChange('age', quickAge)}
                            className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors"
                          >
                            {quickAge} yrs
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Gender Selector */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Gender *
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { id: 'female', label: 'Female / महिला' },
                        { id: 'male', label: 'Male / पुरुष' },
                        { id: 'other', label: 'Other / अन्य' }
                      ].map((g) => (
                        <button
                          key={g.id}
                          type="button"
                          onClick={() => handleInputChange('gender', g.id)}
                          className={`p-3.5 rounded-xl border text-xs sm:text-sm font-bold text-center transition-all ${
                            formData.gender === g.id
                              ? 'bg-blue-900 text-white border-blue-900 shadow-sm'
                              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          {g.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Bottom Navigation */}
                  <div className="pt-6 flex justify-end">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-sm shadow-md transition-colors"
                    >
                      <span>Continue to Step 2</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: SOCIO-ECONOMIC & INCOME */}
              {step === 2 && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">
                      Socio-Economic & Household Income Details
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1">
                      Required for merit-cum-means scholarships, welfare pensions, and subsidised housing grants.
                    </p>
                  </div>

                  {/* Caste Category */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                      Social Category / Caste Group *
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                      {['General', 'OBC', 'SC', 'ST', 'EWS'].map((caste) => (
                        <button
                          key={caste}
                          type="button"
                          onClick={() => handleInputChange('caste_category', caste)}
                          className={`p-3 rounded-xl border text-xs sm:text-sm font-bold text-center transition-all ${
                            formData.caste_category === caste
                              ? 'bg-blue-900 text-white border-blue-900 shadow-sm'
                              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          {caste}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Annual Household Income */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                      Total Annual Household Income (₹ per year) *
                    </label>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="relative flex-1">
                          <IndianRupee className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                          <input
                            type="number"
                            min="0"
                            step="10000"
                            value={formData.annual_income}
                            onChange={(e) => handleInputChange('annual_income', parseFloat(e.target.value) || 0)}
                            className="w-full pl-9 pr-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm font-bold focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                            required
                          />
                        </div>
                        <span className="text-sm font-semibold text-slate-500">
                          (₹{(formData.annual_income / 100000).toFixed(2)} Lakhs)
                        </span>
                      </div>

                      {/* Quick Income Brackets */}
                      <div className="flex flex-wrap gap-2 text-xs">
                        {[
                          { label: '< ₹1 Lakh (BPL)', val: 80000 },
                          { label: '₹1.5 Lakhs', val: 150000 },
                          { label: '₹2.5 Lakhs (Ceiling)', val: 250000 },
                          { label: '₹4.5 Lakhs (Scholarships)', val: 450000 },
                          { label: '₹8 Lakhs (EWS limit)', val: 800000 },
                        ].map((b) => (
                          <button
                            key={b.val}
                            type="button"
                            onClick={() => handleInputChange('annual_income', b.val)}
                            className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors"
                          >
                            {b.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* BPL / Ration Card Toggle */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <div>
                      <div className="text-sm font-bold text-slate-900">
                        Hold Below Poverty Line (BPL) / Yellow / Orange Ration Card?
                      </div>
                      <div className="text-xs text-slate-500">
                        Enables direct eligibility for PM Awas Yojana, NFSA food security, and state health covers.
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.is_bpl_ration_card_holder}
                        onChange={(e) => handleInputChange('is_bpl_ration_card_holder', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-300 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600" />
                    </label>
                  </div>

                  {/* Navigation Buttons */}
                  <div className="pt-6 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-100 transition-colors"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Back</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-sm shadow-md transition-colors"
                    >
                      <span>Continue to Step 3</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: OCCUPATION & SECTOR SPECIFICS */}
              {step === 3 && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">
                      Occupation & Special Eligibility Circumstances
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1">
                      Matches sector-specific benefits (e.g., PM-KISAN, MUDRA loans, PM Vishwakarma, AICTE Pragati).
                    </p>
                  </div>

                  {/* Primary Occupation Selection */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                      Current Primary Occupation / Activity *
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {[
                        { id: 'student', label: 'Student / विद्यार्थी' },
                        { id: 'farmer', label: 'Farmer / शेतकरी' },
                        { id: 'entrepreneur', label: 'Business / Entrepreneur' },
                        { id: 'artisan', label: 'Artisan / Traditional Craft' },
                        { id: 'street_vendor', label: 'Street Vendor / फेरीवाला' },
                        { id: 'salaried', label: 'Salaried Employee' },
                        { id: 'unemployed', label: 'Unemployed Youth' },
                        { id: 'homemaker', label: 'Homemaker / गृहिणी' },
                      ].map((occ) => (
                        <button
                          key={occ.id}
                          type="button"
                          onClick={() => handleOccupationChange(occ.id)}
                          className={`p-3 rounded-xl border text-xs sm:text-sm font-semibold text-center transition-all ${
                            formData.occupation === occ.id
                              ? 'bg-blue-900 text-white border-blue-900 shadow-sm'
                              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          {occ.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* CONDITIONAL: IF STUDENT -> Education Level */}
                  {(formData.occupation === 'student' || formData.student_status) && (
                    <div className="p-4.5 rounded-2xl bg-blue-50/80 border border-blue-200 space-y-2">
                      <label className="block text-xs font-bold uppercase tracking-wider text-blue-900">
                        Current Course / Education Level
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {['10th', '12th', 'undergraduate', 'postgraduate', 'vocational'].map((lvl) => (
                          <button
                            key={lvl}
                            type="button"
                            onClick={() => handleInputChange('education_level', lvl)}
                            className={`p-2.5 rounded-lg border text-xs font-semibold capitalize transition-all ${
                              formData.education_level === lvl
                                ? 'bg-blue-900 text-white border-blue-900'
                                : 'bg-white border-blue-200 text-slate-700 hover:bg-blue-100/50'
                            }`}
                          >
                            {lvl}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* CONDITIONAL: IF FARMER -> Landholding Toggle */}
                  {(formData.occupation === 'farmer' || formData.is_farmer) && (
                    <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 flex items-center justify-between">
                      <div>
                        <div className="text-sm font-bold text-emerald-950">
                          Do you possess cultivable agricultural land (7/12 / Patta)?
                        </div>
                        <div className="text-xs text-emerald-800">
                          Mandatory for PM-KISAN ₹6,000 direct income transfers.
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.has_landholding}
                          onChange={(e) => handleInputChange('has_landholding', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-300 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600" />
                      </label>
                    </div>
                  )}

                  {/* Special Inclusion Checkboxes */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    {/* Differently Abled */}
                    <div className="p-3.5 rounded-xl border border-slate-200 flex items-center justify-between bg-slate-50/50">
                      <div>
                        <div className="text-xs font-bold text-slate-900">Differently Abled (Divyangjan)</div>
                        <div className="text-[11px] text-slate-500">Qualifies for ADIP aids & special quotas</div>
                      </div>
                      <input
                        type="checkbox"
                        checked={formData.is_differently_abled}
                        onChange={(e) => handleInputChange('is_differently_abled', e.target.checked)}
                        className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
                      />
                    </div>

                    {/* Entrepreneur / MSME */}
                    <div className="p-3.5 rounded-xl border border-slate-200 flex items-center justify-between bg-slate-50/50">
                      <div>
                        <div className="text-xs font-bold text-slate-900">Registered MSME / Micro-Business</div>
                        <div className="text-[11px] text-slate-500">Qualifies for MUDRA & Stand-Up India</div>
                      </div>
                      <input
                        type="checkbox"
                        checked={formData.is_entrepreneur}
                        onChange={(e) => handleInputChange('is_entrepreneur', e.target.checked)}
                        className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Bottom Navigation & Submit */}
                  <div className="pt-6 flex items-center justify-between border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-100 transition-colors"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Back</span>
                    </button>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-sm shadow-lg shadow-orange-900/20 disabled:opacity-50 transition-all hover:scale-102 cursor-pointer"
                    >
                      {submitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Matching Rules...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" />
                          <span>Analyze & Discover Eligible Schemes</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

            </form>
          </div>
        )}

      </div>
    </div>
  );
};
