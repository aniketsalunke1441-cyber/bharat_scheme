// frontend/src/pages/AboutPage.tsx
import React from 'react';
import { 
  Sparkles, 
  Cpu, 
  Database, 
  Code2, 
  Layers, 
  ShieldCheck, 
  BookOpen, 
  GraduationCap, 
  Workflow, 
  CheckCircle2,
  Lock,
  ExternalLink
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const AboutPage: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-slate-50 py-10 sm:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Top Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-900 text-xs font-bold mb-3">
            <GraduationCap className="w-4 h-4 text-orange-600" />
            <span>B.Tech Artificial Intelligence & Data Science Mini Project</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
            About BharatScheme AI
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
            An intelligent, multilingual Indian digital public infrastructure assistant designed to democratize welfare discovery, eligibility explainability, and citizen empowerment.
          </p>
        </div>

        {/* Project Genesis & Problem Statement */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-10 space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            1. Problem Statement & Motivation
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            India operates some of the world's most progressive social welfare programs, including direct income transfers (PM-KISAN), universal secondary healthcare (Ayushman Bharat PM-JAY), higher education scholarships, and collateral-free enterprise credits (MUDRA, Stand-Up India).
          </p>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            However, ordinary citizens frequently struggle to discover schemes relevant to their age, state, caste, and income. Information is dispersed across disparate departments, guidelines are buried in lengthy government gazettes, and official details are often unavailable in regional vernacular languages like Marathi and Hindi.
          </p>
          <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 text-xs sm:text-sm text-blue-950 font-medium">
            <strong>Project Mission:</strong> Transform complicated bureaucratic gazettes into personalized, transparent, and multilingual recommendations with verified government source links.
          </div>
        </div>

        {/* System Architecture Grid */}
        <div className="space-y-6">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            2. Technical Stack & AI/ML Architecture
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Frontend */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
                <Code2 className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Modern Frontend</h3>
              <ul className="space-y-1.5 text-xs text-slate-600">
                <li>• React 19 & TypeScript</li>
                <li>• Vite build toolchain</li>
                <li>• Tailwind CSS v4 design system</li>
                <li>• Lucide icons & React Router</li>
                <li>• Responsive tricolor digital design</li>
              </ul>
            </div>

            {/* Backend */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-800 flex items-center justify-center font-bold">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Python Backend</h3>
              <ul className="space-y-1.5 text-xs text-slate-600">
                <li>• FastAPI high-performance server</li>
                <li>• Pydantic V2 schema validation</li>
                <li>• SQLAlchemy ORM</li>
                <li>• SQLite (PostgreSQL compatible)</li>
                <li>• Comprehensive Pytest suite</li>
              </ul>
            </div>

            {/* AI/ML & RAG */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                <Workflow className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">AI/ML & RAG Engine</h3>
              <ul className="space-y-1.5 text-xs text-slate-600">
                <li>• Explainable rule-based matching</li>
                <li>• TF-IDF & Cosine vector retrieval</li>
                <li>• Grounded citation synthesis</li>
                <li>• Trilingual (EN, HI, MR) RAG</li>
                <li>• Configurable Gemini/OpenAI API</li>
              </ul>
            </div>

          </div>
        </div>

        {/* Explainability & Rule Engine Methodology */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-10 space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
            <CheckCircle2 className="w-6 h-6 text-emerald-600" />
            <span>3. Explainable AI (XAI) Eligibility Methodology</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Unlike "black-box" classifiers, BharatScheme AI implements an <strong>Explainable Eligibility Decision Engine</strong>. Each scheme is evaluated along structured dimensions:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <strong className="text-slate-900">Geographic Jurisdiction:</strong> Verifies central nationwide applicability vs state-specific domicile requirements (e.g. Maharashtra).
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <strong className="text-slate-900">Demographic Range:</strong> Strictly evaluates age brackets, targeted gender provisions, and affirmative action categories.
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <strong className="text-slate-900">Economic Caps:</strong> Validates against statutory household income thresholds (e.g., ₹2.5 Lakhs for BPL/PM-JAY, ₹4.5 Lakhs for NSP, ₹8 Lakhs for EWS).
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <strong className="text-slate-900">Occupational Validation:</strong> Validates requirements such as active landholding records (PM-KISAN), student enrollment, or artisanal trades (PM Vishwakarma).
            </div>
          </div>
        </div>

        {/* Ethics & Responsible AI */}
        <div className="bg-slate-900 text-slate-300 rounded-3xl p-6 sm:p-10 space-y-4">
          <div className="flex items-center gap-2 text-orange-400 font-bold text-xs uppercase tracking-wider">
            <ShieldCheck className="w-5 h-5" />
            <span>Responsible AI & Data Privacy Commitment</span>
          </div>
          <h2 className="text-xl font-bold text-white">
            Independent Informational Architecture
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            BharatScheme AI is strictly an independent informational project designed for academic evaluation. We do not impersonate government agencies, fabricate success metrics, or collect confidential citizen documents like Aadhaar OTPs or banking PINs. All applications are directed to official, cryptographically verified portals ending in <code>.gov.in</code> or <code>.nic.in</code>.
          </p>
        </div>

      </div>
    </div>
  );
};
