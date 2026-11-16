import {
  Threat,
  ThreatCategory,
  SecurityTool,
  URLAnalysisResult,
  MessageAnalysisResult,
  EmailHeaderAnalysisResult,
  CyberAlert,
  QuizQuestion,
  QuizSubmissionResult,
  User,
  DashboardSummary
} from '../types';

const API_BASE = import.meta.env.VITE_API_BASE || '/api';

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('redline_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const headers = {
    'Content-Type': 'application/json',
    ...getAuthHeader(),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || `HTTP error ${response.status}`);
  }
  return data as T;
}

export const api = {
  // Threat Library
  async getThreats(params?: { category?: string; difficulty?: string; risk?: string; search?: string }): Promise<{ count: number; threats: Threat[] }> {
    const searchParams = new URLSearchParams();
    if (params?.category) searchParams.set('category', params.category);
    if (params?.difficulty) searchParams.set('difficulty', params.difficulty);
    if (params?.risk) searchParams.set('risk', params.risk);
    if (params?.search) searchParams.set('search', params.search);
    return request<{ count: number; threats: Threat[] }>(`/threats?${searchParams.toString()}`);
  },

  async getThreatCategories(): Promise<{ categories: ThreatCategory[] }> {
    return request<{ categories: ThreatCategory[] }>('/threats/categories');
  },

  async getThreatStats(): Promise<{
    threat_topics: number;
    categories: number;
    security_tools: number;
    learning_quizzes: number;
    simulations_available: number;
  }> {
    return request('/threats/stats');
  },

  async getFeaturedThreats(): Promise<{ featured: Threat[] }> {
    return request<{ featured: Threat[] }>('/threats/featured');
  },

  async getThreatDetail(slug: string): Promise<{ threat: Threat }> {
    return request<{ threat: Threat }>(`/threats/${slug}`);
  },

  // Security Tools
  async getTools(): Promise<{ tools: SecurityTool[] }> {
    return request<{ tools: SecurityTool[] }>('/tools');
  },

  async analyzeUrl(url: string): Promise<URLAnalysisResult> {
    return request<URLAnalysisResult>('/tools/analyze-url', {
      method: 'POST',
      body: JSON.stringify({ url }),
    });
  },

  async analyzeMessage(message: string): Promise<MessageAnalysisResult> {
    return request<MessageAnalysisResult>('/tools/analyze-message', {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
  },

  async inspectEmailHeaders(headers: string): Promise<EmailHeaderAnalysisResult> {
    return request<EmailHeaderAnalysisResult>('/tools/inspect-email-headers', {
      method: 'POST',
      body: JSON.stringify({ headers }),
    });
  },

  // AI Assistant
  async sendChatMessage(message: string, language: 'en' | 'ml' = 'en'): Promise<{
    response: string;
    provider: string;
    language: string;
    is_fallback: boolean;
  }> {
    return request('/ai/chat', {
      method: 'POST',
      body: JSON.stringify({ message, language }),
    });
  },

  // Alerts
  async getAlerts(params?: { severity?: string; category?: string }): Promise<{ count: number; alerts: CyberAlert[] }> {
    const searchParams = new URLSearchParams();
    if (params?.severity) searchParams.set('severity', params.severity);
    if (params?.category) searchParams.set('category', params.category);
    return request<{ count: number; alerts: CyberAlert[] }>(`/alerts?${searchParams.toString()}`);
  },

  // Quiz
  async getQuizQuestions(params?: { category?: string; level?: string }): Promise<{ count: number; questions: QuizQuestion[] }> {
    const searchParams = new URLSearchParams();
    if (params?.category) searchParams.set('category', params.category);
    if (params?.level) searchParams.set('level', params.level);
    return request<{ count: number; questions: QuizQuestion[] }>(`/quizzes?${searchParams.toString()}`);
  },

  async submitQuiz(payload: { answers: Record<number, number>; category: string; level: string }): Promise<QuizSubmissionResult> {
    return request<QuizSubmissionResult>('/quizzes/submit', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  // Authentication
  async register(payload: { username: string; email: string; password: string }): Promise<{ token: string; user: User; message: string }> {
    return request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async login(payload: { identifier: string; password: string }): Promise<{ token: string; user: User; message: string }> {
    return request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async getCurrentUser(): Promise<{ user: User }> {
    return request('/auth/me');
  },

  // User Progress & Dashboard
  async getUserDashboard(): Promise<DashboardSummary> {
    return request<DashboardSummary>('/user/dashboard');
  },

  async updateUserProgress(payload: { item_type: string; item_id: string; completed: boolean; points: number }): Promise<any> {
    return request('/user/progress', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async toggleSaveArticle(threat_id: number): Promise<{ saved: boolean; message: string }> {
    return request('/user/saved-articles', {
      method: 'POST',
      body: JSON.stringify({ threat_id }),
    });
  },

  async getSavedArticles(): Promise<{ saved_articles: any[] }> {
    return request('/user/saved-articles');
  },
};
