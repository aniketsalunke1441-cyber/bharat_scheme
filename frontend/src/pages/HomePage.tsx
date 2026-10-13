// frontend/src/pages/HomePage.tsx
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, 
  Sparkles, 
  ArrowRight, 
  GraduationCap, 
  Wheat, 
  HeartHandshake, 
  Briefcase, 
  Activity, 
  Home, 
  TrendingUp, 
  Users, 
  ShieldCheck,
  ChevronDown,
  HelpCircle,
  FileCheck2,
  CheckCircle2,
  ExternalLink,
  Flame,
  Filter
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { SchemeCard } from '../components/SchemeCard';
import { Scheme, CategoryMetadata } from '../types';

// Map icon strings to Lucide components
const iconMap: Record<string, any> = {
  GraduationCap,
  Wheat,
  HeartHandshake,
  Briefcase,
  Activity,
  Home,
  TrendingUp,
  Users,
  ShieldCheck,
};

export const HomePage: React.FC = () => {
  const { language, t } = useLanguage();
  const navigate = useNavigate();

  const [categories, setCategories] = useState<CategoryMetadata[]>([]);
  const [featuredSchemes, setFeaturedSchemes] = useState<Scheme[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [catsRes, featuredRes] = await Promise.all([
          fetch(`/api/categories?language=${language}`),
          fetch(`/api/featured?language=${language}`)
        ]);

        if (catsRes.ok) {
          const catsData = await catsRes.json();
          setCategories(catsData);
        }

        if (featuredRes.ok) {
          const featData = await featuredRes.json();
          setFeaturedSchemes(featData);
        }
      } catch (err) {
        console.error('Error fetching home page data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [language]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/categories?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  const faqs = [
    {
      q: "How does the eligibility matcher work?",
      a: "BharatScheme AI checks your submitted demographic, geographic, educational, and income details against the documented qualification rules from official scheme guidelines. It highlights exact matches and details any unmet criteria with complete transparency."
    },
    {
      q: "Does BharatScheme AI apply for schemes on my behalf?",
      a: "No. BharatScheme AI is an independent informational discovery engine. For security and official protocol, all actual applications must be submitted directly through the verified official government portals (such as pmkisan.gov.in, scholarships.gov.in, or pmjay.gov.in) linked on every scheme card."
    },
    {
      q: "Is my personal data saved or shared?",
      a: "No. Your eligibility form calculations are processed in real-time. We do not store sensitive identifiers like Aadhaar, bank credentials, or tax returns."
    },
    {
      q: "Are state-specific government schemes included?",
      a: "Yes! The database includes major Central Government flagship programs as well as prominent State schemes (such as Maharashtra's Mukhyamantri Majhi Ladki Bahin Yojana and Mahatma Jyotirao Phule Jan Arogya Yojana)."
    },
    {
      q: "How does the AI Assistant answer scheme questions?",
      a: "The assistant uses Retrieval-Augmented Generation (RAG). When you ask a query in English, Hindi, or Marathi, it retrieves verified clauses, criteria, and official documents from our curated database to generate grounded, hallucination-free answers with source citations."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-900 via-slate-900 to-slate-950 text-white pt-16 pb-24 sm:pt-20 sm:pb-32">
        {/* Subtle decorative background circles */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full overflow-hidden pointer-events-none opacity-20">
          <div className="absolute top-10 left-10 w-96 h-96 bg-orange-500 rounded-full blur-3xl" />
          <div className="absolute top-20 right-10 w-96 h-96 bg-emerald-500 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-orange-300 text-xs sm:text-sm font-semibold mb-6 backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-orange-400" />
            <span>AI-Powered Citizen Portal & Eligibility Engine</span>
          </div>

          {/* Master Hero Heading */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            {t('heroHeading')}
          </h1>

          {/* Subtitle */}
          <p className="mt-5 text-base sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            {t('heroSubtitle')}
          </p>

          {/* Hero Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/eligibility"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-base shadow-lg shadow-orange-950/40 hover:scale-102 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>{t('btnFindSchemes')}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/assistant"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/25 text-white font-semibold text-base backdrop-blur-md transition-all duration-200 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-5 h-5 text-orange-400" />
              <span>{t('btnAskAssistant')}</span>
            </Link>
          </div>

          {/* Live Search Input Box */}
          <form onSubmit={handleSearchSubmit} className="mt-12 max-w-3xl mx-auto">
            <div className="relative flex items-center bg-white rounded-2xl shadow-2xl p-1.5 border border-slate-200">
              <Search className="w-5 h-5 text-slate-400 ml-4 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('searchPlaceholder')}
                className="w-full bg-transparent px-3 py-3 text-slate-900 placeholder:text-slate-400 text-sm sm:text-base focus:outline-hidden"
              />
              <button
                type="submit"
                className="px-5 sm:px-7 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-semibold text-sm transition-colors shrink-0"
              >
                Search
              </button>
            </div>
            
            {/* Quick search tags */}
            <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-400">
              <span className="font-medium text-slate-300">Quick Searches:</span>
              {['PM-KISAN', 'Ayushman Bharat', 'MUDRA Loan', 'Post-Matric Scholarship', 'Ladki Bahin', 'PM Vishwakarma'].map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => {
                    setSearchQuery(tag);
                    navigate(`/categories?search=${encodeURIComponent(tag)}`);
                  }}
                  className="px-2.5 py-1 rounded-md bg-white/10 hover:bg-white/20 text-slate-200 transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>
          </form>

        </div>
      </section>

      {/* 2. SCHEME CATEGORIES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-10">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-orange-600 mb-1">
                Explore Portfolios
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Scheme Categories
              </h2>
            </div>
            <Link
              to="/categories"
              className="text-sm font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1.5"
            >
              <span>View All Categories</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 lg:gap-6">
            {categories.map((cat) => {
              const Icon = iconMap[cat.icon] || FileCheck2;
              const catTitle = language === 'hi' ? cat.name_hi : language === 'mr' ? cat.name_mr : cat.name_en;
              return (
                <Link
                  key={cat.id}
                  to={`/categories?category=${encodeURIComponent(cat.id)}`}
                  className="group p-5 rounded-2xl border border-slate-200/80 hover:border-blue-400 hover:shadow-md transition-all duration-200 flex items-start gap-4 bg-slate-50/50 hover:bg-white"
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-white shrink-0 shadow-xs transition-transform group-hover:scale-105"
                    style={{ backgroundColor: cat.color || '#1e40af' }}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-slate-900 text-sm sm:text-base group-hover:text-blue-700 transition-colors truncate">
                      {catTitle}
                    </h3>
                    <p className="mt-1 text-xs text-slate-500 line-clamp-2">
                      {cat.description_en}
                    </p>
                    <div className="mt-2.5 flex items-center gap-1.5 text-xs font-semibold text-slate-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span>{cat.scheme_count ?? 3}+ Schemes Available</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

        </div>
      </section>

      {/* 3. HOW IT WORKS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="text-xs font-bold uppercase tracking-wider text-blue-700 mb-2">
            Simplicity & Transparency
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
            {t('howItWorksTitle')}
          </h2>
          <p className="mt-3 text-slate-600 text-sm sm:text-base">
            Find and apply for government schemes without confusing bureaucratic jargon or hidden criteria.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Step 1 */}
          <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-xs hover:shadow-md transition-all text-center">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-orange-100 text-orange-700 flex items-center justify-center font-extrabold text-xl mb-6">
              1
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-3">
              {t('howStep1Title')}
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              {t('howStep1Desc')}
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-xs hover:shadow-md transition-all text-center">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center font-extrabold text-xl mb-6">
              2
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-3">
              {t('howStep2Title')}
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              {t('howStep2Desc')}
            </p>
          </div>

          {/* Step 3 */}
          <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-xs hover:shadow-md transition-all text-center">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-extrabold text-xl mb-6">
              3
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-3">
              {t('howStep3Title')}
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              {t('howStep3Desc')}
            </p>
          </div>

        </div>
      </section>

      {/* 4. FEATURED SCHEMES SHOWCASE */}
      <section className="bg-slate-100/70 border-y border-slate-200 py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-orange-600 mb-1">
                <Flame className="w-4 h-4 text-orange-500" />
                <span>Verified Official Database</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                {t('featuredTitle')}
              </h2>
            </div>
            <Link
              to="/categories"
              className="text-sm font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1.5"
            >
              <span>Explore All Schemes</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Scheme Cards Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="h-64 rounded-2xl bg-slate-200/60 animate-pulse" />
              ))}
            </div>
          ) : featuredSchemes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredSchemes.map((scheme) => (
                <SchemeCard key={scheme.id} scheme={scheme} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
              <p className="text-slate-500">No schemes found.</p>
            </div>
          )}

        </div>
      </section>

      {/* 5. FREQUENTLY ASKED QUESTIONS */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-700 mb-2">
            <HelpCircle className="w-4 h-4" />
            <span>Citizen Knowledge Base</span>
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900">
            {t('faqTitle')}
          </h2>
          <p className="mt-2 text-slate-600 text-sm">
            Everything you need to know about navigating government scheme eligibility and official applications.
          </p>
        </div>

        <div className="space-y-3.5">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-2xs transition-all"
            >
              <button
                type="button"
                onClick={() => toggleFaq(idx)}
                className="w-full px-6 py-4.5 text-left flex items-center justify-between gap-4 font-bold text-slate-900 text-sm sm:text-base hover:text-blue-700 transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${
                    openFaq === idx ? 'rotate-180 text-blue-700' : ''
                  }`}
                />
              </button>
              {openFaq === idx && (
                <div className="px-6 pb-5 pt-1 text-xs sm:text-sm text-slate-600 border-t border-slate-100 leading-relaxed bg-slate-50/50">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 6. CALL TO ACTION STRIP */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-8 sm:p-12 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-2xl sm:text-3xl font-extrabold">
              Ready to find schemes meant for you?
            </h3>
            <p className="text-sm sm:text-base text-slate-300 max-w-xl">
              Complete the 2-minute personalized eligibility check to discover all applicable benefits for your family.
            </p>
          </div>
          <Link
            to="/eligibility"
            className="px-8 py-3.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-base shrink-0 shadow-lg transition-transform hover:scale-105"
          >
            Start Eligibility Check
          </Link>
        </div>
      </section>

    </div>
  );
};
