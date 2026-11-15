export interface ThreatCategory {
  id: number;
  slug: string;
  name: string;
  description: string;
  icon: string;
  display_order: number;
  threat_count?: number;
}

export interface ThreatQuizQuestion {
  question: string;
  options: string[];
  correct_index: number;
  explanation: string;
}

export interface ThreatContent {
  what_is: string;
  how_it_works: string;
  real_world_examples: string[];
  warning_signs: string[];
  who_affected: string;
  consequences: string;
  prevention: string[];
  what_to_do: string[];
  related_threats: string[];
  quiz: ThreatQuizQuestion[];
}

export interface Threat {
  id: number;
  category_id: number;
  category_name: string;
  category_slug: string;
  slug: string;
  name: string;
  short_desc: string;
  risk_category: 'Critical' | 'High' | 'Medium' | 'Low';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  icon: string;
  views_count: number;
  content?: ThreatContent;
}

export interface SecurityTool {
  id: number;
  slug: string;
  name: string;
  short_desc: string;
  icon: string;
  route: string;
  badge: string;
  features: string[];
}

export interface URLAnalysisResult {
  url: string;
  hostname: string;
  scheme: string;
  status: 'No Known Threat Detected' | 'Suspicious Indicators Found' | 'Known Threat Reported' | 'Unable to verify';
  risk_level: 'High Risk' | 'Moderate Risk' | 'Low Risk';
  score: number;
  findings: Array<{
    severity: 'Critical' | 'High' | 'Medium' | 'Info';
    type: string;
    description: string;
  }>;
  safe_browsing_checked: boolean;
  disclaimer: string;
}

export interface MessageAnalysisResult {
  risk_level: string;
  badge_color: string;
  score: number;
  red_flags_count: number;
  red_flags: Array<{
    type: string;
    matched_text: string;
    severity: string;
    explanation: string;
  }>;
  extracted_urls: string[];
  recommendations: string[];
  disclaimer: string;
}

export interface EmailHeaderAnalysisResult {
  from_header: string;
  reply_to_header: string;
  spf_status: string;
  dkim_status: string;
  dmarc_status: string;
  risk_score: number;
  verdict: string;
  findings: Array<{
    severity: string;
    title: string;
    description: string;
  }>;
}

export interface CyberAlert {
  id: number;
  title: string;
  source: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Info';
  category: string;
  summary: string;
  recommended_action?: string;
  original_url?: string;
  affected_systems: string;
  published_at: string;
  is_active: boolean;
}

export interface QuizQuestion {
  id: number;
  category: string;
  level: string;
  question: string;
  options: string[];
}

export interface QuizSubmissionResult {
  score: number;
  total: number;
  percentage: number;
  badge: string;
  points_awarded: number;
  details: Array<{
    question_id: number;
    question: string;
    selected_index: number;
    correct_index: number;
    is_correct: boolean;
    explanation: string;
  }>;
}

export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  awareness_score: number;
  created_at?: string;
}

export interface DashboardSummary {
  user: User;
  awareness_score: number;
  tier: string;
  level_number: number;
  avg_quiz_score: number;
  quiz_history: any[];
  simulations_completed: any[];
  saved_count: number;
}
