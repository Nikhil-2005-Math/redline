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
import { localDataStore } from './localDataStore';

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

  const contentType = response.headers.get('content-type') || '';
  if (!response.ok || !contentType.includes('application/json')) {
    let errMsg = `HTTP error ${response.status}`;
    try {
      const data = await response.json();
      errMsg = data.error || errMsg;
    } catch {
      // response might be HTML (e.g. 404 from Netlify SPA fallback)
    }
    throw new Error(errMsg);
  }

  return (await response.json()) as T;
}

export const api = {
  // Threat Library
  async getThreats(params?: { category?: string; difficulty?: string; risk?: string; search?: string }): Promise<{ count: number; threats: Threat[] }> {
    try {
      const searchParams = new URLSearchParams();
      if (params?.category) searchParams.set('category', params.category);
      if (params?.difficulty) searchParams.set('difficulty', params.difficulty);
      if (params?.risk) searchParams.set('risk', params.risk);
      if (params?.search) searchParams.set('search', params.search);
      return await request<{ count: number; threats: Threat[] }>(`/threats?${searchParams.toString()}`);
    } catch (err) {
      const threats = localDataStore.getThreats(params);
      return { count: threats.length, threats };
    }
  },

  async getThreatCategories(): Promise<{ categories: ThreatCategory[] }> {
    try {
      return await request<{ categories: ThreatCategory[] }>('/threats/categories');
    } catch (err) {
      return { categories: localDataStore.getCategories() };
    }
  },

  async getThreatStats(): Promise<{
    threat_topics: number;
    categories: number;
    security_tools: number;
    learning_quizzes: number;
    simulations_available: number;
  }> {
    try {
      return await request('/threats/stats');
    } catch (err) {
      return localDataStore.getStats();
    }
  },

  async getFeaturedThreats(): Promise<{ featured: Threat[] }> {
    try {
      return await request<{ featured: Threat[] }>('/threats/featured');
    } catch (err) {
      return { featured: localDataStore.getFeaturedThreats() };
    }
  },

  async getThreatDetail(slug: string): Promise<{ threat: Threat }> {
    try {
      return await request<{ threat: Threat }>(`/threats/${slug}`);
    } catch (err) {
      const threat = localDataStore.getThreatDetail(slug);
      if (!threat) throw new Error('Threat article not found');
      return { threat };
    }
  },

  // Security Tools
  async getTools(): Promise<{ tools: SecurityTool[] }> {
    try {
      return await request<{ tools: SecurityTool[] }>('/tools');
    } catch (err) {
      return { tools: localDataStore.getTools() };
    }
  },

  async analyzeUrl(url: string): Promise<URLAnalysisResult> {
    try {
      return await request<URLAnalysisResult>('/tools/analyze-url', {
        method: 'POST',
        body: JSON.stringify({ url }),
      });
    } catch (err) {
      return localDataStore.analyzeUrl(url);
    }
  },

  async analyzeMessage(message: string): Promise<MessageAnalysisResult> {
    try {
      return await request<MessageAnalysisResult>('/tools/analyze-message', {
        method: 'POST',
        body: JSON.stringify({ message }),
      });
    } catch (err) {
      return localDataStore.analyzeMessage(message);
    }
  },

  async inspectEmailHeaders(headers: string): Promise<EmailHeaderAnalysisResult> {
    try {
      return await request<EmailHeaderAnalysisResult>('/tools/inspect-email-headers', {
        method: 'POST',
        body: JSON.stringify({ headers }),
      });
    } catch (err) {
      return localDataStore.inspectEmailHeaders(headers);
    }
  },

  // AI Assistant
  async sendChatMessage(message: string, language: 'en' | 'ml' = 'en'): Promise<{
    response: string;
    provider: string;
    language: string;
    is_fallback: boolean;
  }> {
    try {
      return await request('/ai/chat', {
        method: 'POST',
        body: JSON.stringify({ message, language }),
      });
    } catch (err) {
      return {
        response: localDataStore.generateAiResponse(message, language),
        provider: 'offline-defense-heuristics',
        language,
        is_fallback: true,
      };
    }
  },

  // Alerts
  async getAlerts(params?: { severity?: string; category?: string }): Promise<{ count: number; alerts: CyberAlert[] }> {
    try {
      const searchParams = new URLSearchParams();
      if (params?.severity) searchParams.set('severity', params.severity);
      if (params?.category) searchParams.set('category', params.category);
      return await request<{ count: number; alerts: CyberAlert[] }>(`/alerts?${searchParams.toString()}`);
    } catch (err) {
      const alerts = localDataStore.getAlerts(params);
      return { count: alerts.length, alerts };
    }
  },

  // Quiz
  async getQuizQuestions(params?: { category?: string; level?: string }): Promise<{ count: number; questions: QuizQuestion[] }> {
    try {
      const searchParams = new URLSearchParams();
      if (params?.category) searchParams.set('category', params.category);
      if (params?.level) searchParams.set('level', params.level);
      return await request<{ count: number; questions: QuizQuestion[] }>(`/quizzes?${searchParams.toString()}`);
    } catch (err) {
      const questions = localDataStore.getQuizzes(params);
      return { count: questions.length, questions };
    }
  },

  async submitQuiz(payload: { answers: Record<number, number>; category: string; level: string }): Promise<QuizSubmissionResult> {
    try {
      return await request<QuizSubmissionResult>('/quizzes/submit', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    } catch (err) {
      return localDataStore.evaluateQuiz(payload);
    }
  },

  // Authentication
  async register(payload: { username: string; email: string; password: string }): Promise<{ token: string; user: User; message: string }> {
    try {
      return await request('/auth/register', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    } catch (err) {
      const mockUser: User = {
        id: Date.now(),
        username: payload.username,
        email: payload.email,
        role: 'Defender',
        awareness_score: 100,
        created_at: new Date().toISOString(),
      };
      const token = 'offline_token_' + Date.now();
      localStorage.setItem('redline_token', token);
      localDataStore.setUser(mockUser);
      return { token, user: mockUser, message: 'Offline session registered successfully' };
    }
  },

  async login(payload: { identifier: string; password: string }): Promise<{ token: string; user: User; message: string }> {
    try {
      return await request('/auth/login', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    } catch (err) {
      const mockUser: User = {
        id: 1,
        username: payload.identifier.split('@')[0],
        email: payload.identifier.includes('@') ? payload.identifier : `${payload.identifier}@redline.safety`,
        role: 'Defender',
        awareness_score: 250,
      };
      const token = 'offline_token_' + Date.now();
      localStorage.setItem('redline_token', token);
      localDataStore.setUser(mockUser);
      return { token, user: mockUser, message: 'Logged in to client sandbox' };
    }
  },

  async getCurrentUser(): Promise<{ user: User }> {
    try {
      return await request('/auth/me');
    } catch (err) {
      const user = localDataStore.getUser();
      if (!user) throw new Error('Unauthenticated');
      return { user };
    }
  },

  // User Progress & Dashboard
  async getUserDashboard(): Promise<DashboardSummary> {
    try {
      return await request<DashboardSummary>('/user/dashboard');
    } catch (err) {
      return localDataStore.getDashboard();
    }
  },

  async updateUserProgress(payload: { item_type: string; item_id: string; completed: boolean; points: number }): Promise<any> {
    try {
      return await request('/user/progress', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    } catch (err) {
      return { success: true, points_added: payload.points };
    }
  },

  async toggleSaveArticle(threat_id: number): Promise<{ saved: boolean; message: string }> {
    try {
      return await request<{ saved: boolean; message: string }>('/user/saved-articles', {
        method: 'POST',
        body: JSON.stringify({ threat_id }),
      });
    } catch (err) {
      const saved = localDataStore.toggleSaveArticle(threat_id);
      return { saved, message: saved ? 'Threat saved to favorites' : 'Threat removed from favorites' };
    }
  },

  async getSavedArticles(): Promise<{ saved_articles: any[] }> {
    try {
      return await request<{ saved_articles: any[] }>('/user/saved-articles');
    } catch (err) {
      const savedIds = localDataStore.getSavedArticles();
      const allThreats = localDataStore.getThreats();
      const saved = allThreats.filter(t => savedIds.includes(t.id));
      return { saved_articles: saved };
    }
  },
};
