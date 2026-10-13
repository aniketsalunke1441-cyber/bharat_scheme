// frontend/src/context/SavedSchemesContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Scheme } from '../types';

interface SavedItem {
  id: string; // scheme id
  scheme: Scheme;
  notes?: string;
  savedAt: string;
}

interface SavedSchemesContextType {
  savedSchemes: SavedItem[];
  saveScheme: (scheme: Scheme, notes?: string) => void;
  removeScheme: (schemeId: string) => void;
  isSaved: (schemeId: string) => boolean;
  updateNotes: (schemeId: string, notes: string) => void;
}

const SavedSchemesContext = createContext<SavedSchemesContextType | undefined>(undefined);

export const SavedSchemesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [savedSchemes, setSavedSchemes] = useState<SavedItem[]>(() => {
    try {
      const stored = localStorage.getItem('bharatscheme_saved');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('bharatscheme_saved', JSON.stringify(savedSchemes));
    } catch (e) {
      console.error(e);
    }
  }, [savedSchemes]);

  const saveScheme = (scheme: Scheme, notes?: string) => {
    if (!savedSchemes.some(item => item.id === scheme.id)) {
      setSavedSchemes(prev => [
        ...prev,
        {
          id: scheme.id,
          scheme,
          notes,
          savedAt: new Date().toISOString()
        }
      ]);
    }
  };

  const removeScheme = (schemeId: string) => {
    setSavedSchemes(prev => prev.filter(item => item.id !== schemeId));
  };

  const isSaved = (schemeId: string) => {
    return savedSchemes.some(item => item.id === schemeId);
  };

  const updateNotes = (schemeId: string, notes: string) => {
    setSavedSchemes(prev =>
      prev.map(item => (item.id === schemeId ? { ...item, notes } : item))
    );
  };

  return (
    <SavedSchemesContext.Provider
      value={{ savedSchemes, saveScheme, removeScheme, isSaved, updateNotes }}
    >
      {children}
    </SavedSchemesContext.Provider>
  );
};

export const useSavedSchemes = () => {
  const context = useContext(SavedSchemesContext);
  if (!context) {
    throw new Error('useSavedSchemes must be used within SavedSchemesProvider');
  }
  return context;
};
