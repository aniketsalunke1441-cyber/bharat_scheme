// frontend/src/context/LanguageContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language } from '../types';

interface Translations {
  [key: string]: {
    en: string;
    hi: string;
    mr: string;
  };
}

export const dictionary: Translations = {
  appName: {
    en: "BharatScheme AI",
    hi: "भारतस्कीम एआई",
    mr: "भारतस्कीम एआय"
  },
  tagline: {
    en: "Discover Benefits. Understand Eligibility. Apply with Confidence.",
    hi: "लाभ खोजें। पात्रता समझें। विश्वास के साथ आवेदन करें।",
    mr: "योजनांचे लाभ शोधा. पात्रता समजून घ्या. आत्मविश्वासाने अर्ज करा."
  },
  disclaimer: {
    en: "BharatScheme AI is an independent informational project and is not an official government portal.",
    hi: "भारतस्कीम एआई एक स्वतंत्र सूचनात्मक परियोजना है और यह कोई आधिकारिक सरकारी पोर्टल नहीं है।",
    mr: "भारतस्कीम एआय हा एक स्वतंत्र माहितीपर प्रकल्प असून हे अधिकृत शासकीय पोर्टल नाही."
  },
  navHome: {
    en: "Home",
    hi: "होम",
    mr: "मुख्यपृष्ठ"
  },
  navFindSchemes: {
    en: "Find Schemes",
    hi: "योजना खोजें",
    mr: "योजना शोधा"
  },
  navCategories: {
    en: "Categories",
    hi: "श्रेणियां",
    mr: "वर्गवारी"
  },
  navAssistant: {
    en: "AI Assistant",
    hi: "एआई सहायक",
    mr: "एआय सहाय्यक"
  },
  navSaved: {
    en: "Saved Schemes",
    hi: "सहेजी गई योजनाएं",
    mr: "जतन केलेल्या योजना"
  },
  navAbout: {
    en: "About",
    hi: "हमारे बारे में",
    mr: "प्रकल्पाविषयी"
  },
  heroHeading: {
    en: "Find Government Schemes You May Be Eligible For",
    hi: "सरकारी योजनाएं खोजें जिनके लिए आप पात्र हो सकते हैं",
    mr: "तुम्ही पात्र असणाऱ्या शासकीय योजना शोधा"
  },
  heroSubtitle: {
    en: "Discover relevant central and state government schemes through personalized matching and AI-powered guidance.",
    hi: "व्यक्तिगत मिलान और एआई-संचालित मार्गदर्शन के माध्यम से प्रासंगिक केंद्र और राज्य सरकार की योजनाएं खोजें।",
    mr: "वैयक्तिक माहितीवर आधारित आणि एआय मार्गदर्शनाने योग्य केंद्र व राज्य शासकीय योजना शोधा."
  },
  btnFindSchemes: {
    en: "Find My Schemes",
    hi: "मेरी योजनाएं खोजें",
    mr: "माझ्या योजना शोधा"
  },
  btnAskAssistant: {
    en: "Ask AI Assistant",
    hi: "एआई सहायक से पूछें",
    mr: "एआय सहाय्यकाला विचारा"
  },
  searchPlaceholder: {
    en: "Search schemes by name, keyword, or sector (e.g. Kisan, Scholarship, Mudra)...",
    hi: "नाम, कीवर्ड या क्षेत्र द्वारा योजना खोजें (जैसे किसान, छात्रवृत्ति, मुद्रा)...",
    mr: "नाव, कीवर्ड किंवा क्षेत्रानुसार शोधा (उदा. किसान, शिष्यवृत्ती, मुद्रा)..."
  },
  howItWorksTitle: {
    en: "How BharatScheme AI Works",
    hi: "भारतस्कीम एआई कैसे काम करता है",
    mr: "भारतस्कीम एआय कसे कार्य करते"
  },
  howStep1Title: {
    en: "1. Share Basic Profile",
    hi: "1. अपनी बुनियादी जानकारी दें",
    mr: "१. मूलभूत माहिती भरा"
  },
  howStep1Desc: {
    en: "Select your state, age, occupation, and household income in an easy 3-step form.",
    hi: "3 आसान चरणों में अपना राज्य, आयु, पेशा और पारिवारिक आय चुनें।",
    mr: "३ सोप्या टप्प्यांमध्ये आपले राज्य, वय, व्यवसाय व कौटुंबिक उत्पन्न निवडा."
  },
  howStep2Title: {
    en: "2. Transparent Rule Matching",
    hi: "2. पारदर्शी नियम मिलान",
    mr: "२. पारदर्शक निकष पडताळणी"
  },
  howStep2Desc: {
    en: "Our algorithm evaluates eligibility against official criteria and clearly explains why you qualify.",
    hi: "हमारा एल्गोरिथ्म आधिकारिक मानदंडों के साथ आपकी पात्रता का मूल्यांकन कर स्पष्ट कारण बताता है।",
    mr: "आमची प्रणाली अधिकृत नियमांनुसार पडताळणी करून तुम्ही का पात्र आहात हे स्पष्ट करते."
  },
  howStep3Title: {
    en: "3. Direct Official Portals",
    hi: "3. सीधे आधिकारिक पोर्टल पर आवेदन",
    mr: "३. थेट अधिकृत पोर्टलवरून अर्ज"
  },
  howStep3Desc: {
    en: "Access verified government links, application steps, helpline numbers, and document checklists.",
    hi: "सत्यापित सरकारी लिंक, आवेदन के चरण, हेल्पलाइन नंबर और आवश्यक दस्तावेज सूची प्राप्त करें।",
    mr: "अधिकृत शासकीय संकेतस्थळ, अर्जाच्या पायऱ्या, हेल्पलाईन क्रमांक व कागदपत्रांची यादी मिळवा."
  },
  featuredTitle: {
    en: "Featured National & State Schemes",
    hi: "प्रमुख राष्ट्रीय एवं राज्य योजनाएं",
    mr: "महत्त्वाच्या राष्ट्रीय व राज्य योजना"
  },
  viewDetails: {
    en: "View Details",
    hi: "विवरण देखें",
    mr: "सविस्तर माहिती"
  },
  officialPortal: {
    en: "Official Portal",
    hi: "आधिकारिक पोर्टल",
    mr: "अधिकृत संकेतस्थळ"
  },
  faqTitle: {
    en: "Frequently Asked Questions",
    hi: "अक्सर पूछे जाने वाले प्रश्न",
    mr: "वारंवार विचारले जाणारे प्रश्न"
  },
  saveScheme: {
    en: "Save Scheme",
    hi: "सहेजें",
    mr: "जतन करा"
  },
  savedScheme: {
    en: "Saved",
    hi: "सहेजा गया",
    mr: "जतन केले"
  },
  eligibleBadge: {
    en: "100% Eligible",
    hi: "पूर्णतः पात्र",
    mr: "१००% पात्र"
  },
  potentiallyEligibleBadge: {
    en: "Potentially Eligible",
    hi: "संभावित पात्र",
    mr: "संभाव्य पात्र"
  },
  notEligibleBadge: {
    en: "Not Eligible",
    hi: "अपात्र",
    mr: "अपात्र"
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('bharatscheme_lang');
    return (saved as Language) || 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('bharatscheme_lang', lang);
  };

  const t = (key: string): string => {
    if (!dictionary[key]) {
      return key;
    }
    return dictionary[key][language] || dictionary[key]['en'] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
