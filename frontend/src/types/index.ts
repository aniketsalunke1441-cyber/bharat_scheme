// frontend/src/types/index.ts

export type Language = 'en' | 'hi' | 'mr';

export interface Scheme {
  id: string;
  slug: string;
  title: string;
  title_en: string;
  title_hi?: string;
  title_mr?: string;
  ministry: string;
  level: string;
  state_name: string;
  category: string;
  brief: string;
  description?: string;
  benefits: string[];
  eligibility_summary?: string;
  eligibility_criteria?: Record<string, any>;
  documents_required?: string[];
  application_steps?: string[];
  official_portal_url: string;
  application_mode: string;
  helpline_number?: string;
  tags: string[];
}

export interface CategoryMetadata {
  id: string;
  name_en: string;
  name_hi: string;
  name_mr: string;
  icon: string;
  color: string;
  description_en: string;
  scheme_count?: number;
}

export interface EligibilityProfile {
  state: string;
  district?: string;
  age: number;
  gender: string;
  caste_category: string;
  occupation: string;
  student_status: boolean;
  education_level?: string;
  annual_income: number;
  is_farmer: boolean;
  has_landholding: boolean;
  is_entrepreneur: boolean;
  is_differently_abled: boolean;
  is_bpl_ration_card_holder: boolean;
  is_minority: boolean;
  language: Language;
}

export interface CriteriaEvaluation {
  criteria_name: string;
  status: 'matched' | 'unmet' | 'neutral' | 'needs_verification';
  message: string;
}

export interface SchemeMatchResult {
  scheme_id: string;
  slug: string;
  title: string;
  category: string;
  level: string;
  state_name: string;
  ministry: string;
  brief: string;
  benefits: string[];
  match_status: 'ELIGIBLE' | 'POTENTIALLY_ELIGIBLE' | 'NOT_ELIGIBLE';
  match_score: number;
  matched_reasons: string[];
  unmet_reasons: string[];
  info_needed: string[];
  criteria_evaluations: CriteriaEvaluation[];
  official_portal_url: string;
  application_mode: string;
  helpline_number?: string;
}

export interface EligibilityCheckResponse {
  total_schemes_analyzed: number;
  eligible_count: number;
  potentially_eligible_count: number;
  not_eligible_count: number;
  user_summary: Record<string, any>;
  results: SchemeMatchResult[];
}

export interface Citation {
  scheme_id: string;
  title: string;
  official_portal_url: string;
  relevance_score: number;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  citations?: Citation[];
  suggested_followups?: string[];
  referenced_schemes?: Array<{
    id: string;
    title: string;
    category: string;
    brief: string;
    portal: string;
    helpline?: string;
  }>;
  timestamp: string;
}

export interface SavedScheme {
  id: string; // scheme_id
  scheme: Scheme;
  notes?: string;
  saved_at: string;
}
