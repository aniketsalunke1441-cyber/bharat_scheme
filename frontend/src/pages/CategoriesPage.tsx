// frontend/src/pages/CategoriesPage.tsx
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  Layers, 
  Building2, 
  RotateCcw,
  SlidersHorizontal
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { SchemeCard } from '../components/SchemeCard';
import { Scheme, CategoryMetadata } from '../types';

export const CategoriesPage: React.FC = () => {
  const { language, t } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();

  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [categories, setCategories] = useState<CategoryMetadata[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters state from URL query params or defaults
  const [selectedCategory, setSelectedCategory] = useState<string>(
    searchParams.get('category') || 'All'
  );
  const [selectedLevel, setSelectedLevel] = useState<string>(
    searchParams.get('level') || 'All'
  );
  const [searchQuery, setSearchQuery] = useState<string>(
    searchParams.get('search') || ''
  );

  useEffect(() => {
    // Sync URL when state changes
    const params: Record<string, string> = {};
    if (selectedCategory !== 'All') params.category = selectedCategory;
    if (selectedLevel !== 'All') params.level = selectedLevel;
    if (searchQuery.trim()) params.search = searchQuery.trim();
    setSearchParams(params, { replace: true });
  }, [selectedCategory, selectedLevel, searchQuery]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`/api/categories?language=${language}`);
        if (res.ok) {
          const data = await res.json();
          setCategories(data);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchCategories();
  }, [language]);

  useEffect(() => {
    const fetchSchemes = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (selectedCategory !== 'All') queryParams.append('category', selectedCategory);
        if (selectedLevel !== 'All') queryParams.append('level', selectedLevel);
        if (searchQuery.trim()) queryParams.append('search', searchQuery.trim());
        queryParams.append('language', language);

        const res = await fetch(`/api/schemes?${queryParams.toString()}`);
        if (res.ok) {
          const data = await res.json();
          setSchemes(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSchemes();
  }, [selectedCategory, selectedLevel, searchQuery, language]);

  const handleResetFilters = () => {
    setSelectedCategory('All');
    setSelectedLevel('All');
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold mb-3">
            <Layers className="w-3.5 h-3.5 text-blue-600" />
            <span>Official Government Directory</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Explore Government Scheme Directory
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-2xl">
            Browse through Central and State schemes across Education, Agriculture, Healthcare, Women's Welfare, and Entrepreneurship.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 mb-8 space-y-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder="Search scheme name, tags, or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-300 bg-slate-50/50 focus:bg-white text-slate-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-600"
              />
            </div>

            {/* Level Filter (Central vs State) */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider shrink-0">
                Level:
              </span>
              <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200 text-xs font-semibold">
                {['All', 'Central', 'State'].map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setSelectedLevel(lvl)}
                    className={`px-3 py-1.5 rounded-lg transition-colors ${
                      selectedLevel === lvl
                        ? 'bg-white text-slate-900 shadow-2xs font-bold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            {/* Reset Button */}
            {(selectedCategory !== 'All' || selectedLevel !== 'All' || searchQuery) && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-semibold transition-colors shrink-0"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            )}

          </div>

          {/* Category Filter Pills Bar */}
          <div className="pt-2 border-t border-slate-100 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <button
              type="button"
              onClick={() => setSelectedCategory('All')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-colors ${
                selectedCategory === 'All'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Categories
            </button>
            {categories.map((cat) => {
              const catTitle = language === 'hi' ? cat.name_hi : language === 'mr' ? cat.name_mr : cat.name_en;
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-colors ${
                    isSelected
                      ? 'bg-blue-800 text-white font-bold'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {catTitle} ({cat.scheme_count ?? 0})
                </button>
              );
            })}
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between mb-6 text-xs sm:text-sm text-slate-500 font-medium">
          <div>
            Showing <strong className="text-slate-900">{schemes.length}</strong> verified government schemes
            {selectedCategory !== 'All' && <span> in <strong>{selectedCategory}</strong></span>}
            {selectedLevel !== 'All' && <span> ({selectedLevel})</span>}
          </div>
        </div>

        {/* Schemes Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-72 rounded-2xl bg-slate-200/60 animate-pulse" />
            ))}
          </div>
        ) : schemes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {schemes.map((scheme) => (
              <SchemeCard key={scheme.id} scheme={scheme} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200">
            <SlidersHorizontal className="w-10 h-10 text-slate-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-900">No schemes found matching your filters</h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-sm mx-auto">
              Try resetting your search query or selecting a different category.
            </p>
            <button
              type="button"
              onClick={handleResetFilters}
              className="mt-4 px-5 py-2 rounded-xl bg-blue-900 text-white text-xs font-bold hover:bg-blue-800"
            >
              Reset All Filters
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
