// frontend/src/components/Navbar.tsx
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FileText, 
  Sparkles, 
  Bookmark, 
  Menu, 
  X, 
  Compass, 
  Layers, 
  Globe2, 
  Info,
  CheckCircle2
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useSavedSchemes } from '../context/SavedSchemesContext';
import { Language } from '../types';

export const Navbar: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const { savedSchemes } = useSavedSchemes();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const navLinks = [
    { path: '/', label: t('navHome'), icon: Compass },
    { path: '/eligibility', label: t('navFindSchemes'), icon: CheckCircle2, highlight: true },
    { path: '/categories', label: t('navCategories'), icon: Layers },
    { path: '/assistant', label: t('navAssistant'), icon: Sparkles },
    { path: '/saved', label: t('navSaved'), icon: Bookmark, badge: savedSchemes.length },
    { path: '/about', label: t('navAbout'), icon: Info },
  ];

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value as Language);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Tricolor accent bar */}
      <div className="tricolor-stripe" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & Product Title */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-200">
              <FileText className="w-5 h-5 text-orange-400" />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-600 rounded-full flex items-center justify-center border-2 border-white">
                <Sparkles className="w-2.5 h-2.5 text-white" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-slate-900">
                  Bharat<span className="text-orange-600">Scheme</span>
                </span>
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-300">
                  AI
                </span>
              </div>
              <p className="text-[10px] sm:text-xs text-slate-500 font-medium hidden sm:block">
                Indian Government Scheme Finder
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1.5">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              const Icon = link.icon;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all duration-150 ${
                    active
                      ? 'bg-blue-50 text-blue-900 border border-blue-200/80 shadow-xs'
                      : link.highlight
                      ? 'bg-orange-50 text-orange-800 hover:bg-orange-100/80 border border-orange-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-blue-700' : link.highlight ? 'text-orange-600' : 'text-slate-400'}`} />
                  <span>{link.label}</span>
                  {link.badge !== undefined && link.badge > 0 && (
                    <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-xs font-bold bg-orange-600 text-white">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Language Selector & Mobile Toggle */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Language dropdown */}
            <div className="flex items-center bg-slate-100 rounded-lg p-1 border border-slate-200">
              <Globe2 className="w-4 h-4 text-slate-500 ml-1.5 hidden sm:block" />
              <select
                aria-label="Select Language"
                value={language}
                onChange={handleLanguageChange}
                className="bg-transparent text-xs sm:text-sm font-medium text-slate-800 py-1 px-1.5 sm:px-2 rounded focus:outline-hidden cursor-pointer"
              >
                <option value="en">English (EN)</option>
                <option value="hi">हिंदी (HI)</option>
                <option value="mr">मराठी (MR)</option>
              </select>
            </div>

            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-1 shadow-lg animate-in slide-in-from-top-2">
          {navLinks.map((link) => {
            const active = isActive(link.path);
            const Icon = link.icon;
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-semibold ${
                  active
                    ? 'bg-blue-50 text-blue-900 border border-blue-200'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 ${active ? 'text-blue-700' : 'text-slate-500'}`} />
                  <span>{link.label}</span>
                </div>
                {link.badge !== undefined && link.badge > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-orange-600 text-white">
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
};
