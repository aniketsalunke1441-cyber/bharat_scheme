// frontend/src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { SavedSchemesProvider } from './context/SavedSchemesContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { EligibilityPage } from './pages/EligibilityPage';
import { CategoriesPage } from './pages/CategoriesPage';
import { AssistantPage } from './pages/AssistantPage';
import { SavedSchemesPage } from './pages/SavedSchemesPage';
import { SchemeDetailPage } from './pages/SchemeDetailPage';
import { AboutPage } from './pages/AboutPage';

export const App: React.FC = () => {
  return (
    <LanguageProvider>
      <SavedSchemesProvider>
        <Router>
          <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/eligibility" element={<EligibilityPage />} />
                <Route path="/categories" element={<CategoriesPage />} />
                <Route path="/assistant" element={<AssistantPage />} />
                <Route path="/saved" element={<SavedSchemesPage />} />
                <Route path="/scheme/:id" element={<SchemeDetailPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </SavedSchemesProvider>
    </LanguageProvider>
  );
};

export default App;
