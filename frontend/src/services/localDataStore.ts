import {
  Threat,
  ThreatCategory,
  SecurityTool,
  CyberAlert,
  QuizQuestion,
  QuizSubmissionResult,
  URLAnalysisResult,
  MessageAnalysisResult,
  EmailHeaderAnalysisResult,
  User,
  DashboardSummary
} from '../types';
import { INITIAL_DATA, FullQuizQuestion } from '../data/initialData';

const STORAGE_KEYS = {
  THREATS: 'redline_data_threats',
  CATEGORIES: 'redline_data_categories',
  ALERTS: 'redline_data_alerts',
  TOOLS: 'redline_data_tools',
  QUIZZES: 'redline_data_quizzes',
  SAVED_ARTICLES: 'redline_saved_articles',
  USER: 'redline_local_user',
  DASHBOARD: 'redline_local_dashboard',
};

function getStorageItem<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultValue;
    return JSON.parse(raw) as T;
  } catch (e) {
    console.error(`Error reading ${key} from localStorage:`, e);
    return defaultValue;
  }
}

function setStorageItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error saving ${key} to localStorage:`, e);
  }
}

class LocalDataStore {
  // --- Initialization & Data Fetching ---
  getCategories(): ThreatCategory[] {
    const cats = getStorageItem<ThreatCategory[]>(STORAGE_KEYS.CATEGORIES, INITIAL_DATA.categories);
    const threats = this.getThreats();
    return cats.map(c => ({
      ...c,
      threat_count: threats.filter(t => t.category_id === c.id || t.category_slug === c.slug).length,
    }));
  }

  getThreats(params?: { category?: string; difficulty?: string; risk?: string; search?: string }): Threat[] {
    let list = getStorageItem<Threat[]>(STORAGE_KEYS.THREATS, INITIAL_DATA.threats);

    if (params?.category && params.category !== 'all') {
      list = list.filter(t => t.category_slug === params.category || String(t.category_id) === params.category);
    }
    if (params?.difficulty && params.difficulty !== 'all') {
      list = list.filter(t => t.difficulty.toLowerCase() === params.difficulty?.toLowerCase());
    }
    if (params?.risk && params.risk !== 'all') {
      list = list.filter(t => t.risk_category.toLowerCase() === params.risk?.toLowerCase());
    }
    if (params?.search && params.search.trim()) {
      const q = params.search.toLowerCase().trim();
      list = list.filter(t =>
        t.name.toLowerCase().includes(q) ||
        t.short_desc.toLowerCase().includes(q) ||
        t.slug.toLowerCase().includes(q) ||
        (t.content?.what_is && t.content.what_is.toLowerCase().includes(q))
      );
    }
    return list;
  }

  getThreatDetail(slug: string): Threat | undefined {
    const threats = this.getThreats();
    const found = threats.find(t => t.slug === slug || String(t.id) === slug);
    if (found) {
      // increment view count
      found.views_count = (found.views_count || 0) + 1;
      this.saveThreat(found);
    }
    return found;
  }

  getFeaturedThreats(): Threat[] {
    const threats = this.getThreats();
    return threats.slice(0, 3);
  }

  getStats() {
    const threats = this.getThreats();
    const categories = this.getCategories();
    const tools = this.getTools();
    const quizzes = this.getQuizzes();
    return {
      threat_topics: threats.length,
      categories: categories.length,
      security_tools: tools.length,
      learning_quizzes: quizzes.length,
      simulations_available: 4,
    };
  }

  getTools(): SecurityTool[] {
    return getStorageItem<SecurityTool[]>(STORAGE_KEYS.TOOLS, INITIAL_DATA.tools);
  }

  getAlerts(params?: { severity?: string; category?: string }): CyberAlert[] {
    let alerts = getStorageItem<CyberAlert[]>(STORAGE_KEYS.ALERTS, INITIAL_DATA.alerts);
    if (params?.severity && params.severity !== 'all') {
      alerts = alerts.filter(a => a.severity.toLowerCase() === params.severity?.toLowerCase());
    }
    if (params?.category && params.category !== 'all') {
      alerts = alerts.filter(a => a.category.toLowerCase().includes(params.category?.toLowerCase() || ''));
    }
    return alerts;
  }

  getQuizzes(params?: { category?: string; level?: string }): FullQuizQuestion[] {
    let list = getStorageItem<FullQuizQuestion[]>(STORAGE_KEYS.QUIZZES, INITIAL_DATA.quizzes);
    if (params?.category && params.category !== 'all') {
      list = list.filter(q => q.category.toLowerCase() === params.category?.toLowerCase());
    }
    if (params?.level && params.level !== 'all') {
      list = list.filter(q => q.level.toLowerCase() === params.level?.toLowerCase());
    }
    return list;
  }

  // --- CRUD Operations (Used by Admin Page) ---
  saveThreat(threat: Threat): void {
    const list = getStorageItem<Threat[]>(STORAGE_KEYS.THREATS, INITIAL_DATA.threats);
    const idx = list.findIndex(t => t.id === threat.id || t.slug === threat.slug);
    if (idx >= 0) {
      list[idx] = { ...list[idx], ...threat };
    } else {
      if (!threat.id) {
        threat.id = Date.now();
      }
      list.unshift(threat);
    }
    setStorageItem(STORAGE_KEYS.THREATS, list);
  }

  deleteThreat(id: number): void {
    let list = getStorageItem<Threat[]>(STORAGE_KEYS.THREATS, INITIAL_DATA.threats);
    list = list.filter(t => t.id !== id);
    setStorageItem(STORAGE_KEYS.THREATS, list);
  }

  saveAlert(alert: CyberAlert): void {
    const list = getStorageItem<CyberAlert[]>(STORAGE_KEYS.ALERTS, INITIAL_DATA.alerts);
    const idx = list.findIndex(a => a.id === alert.id);
    if (idx >= 0) {
      list[idx] = { ...list[idx], ...alert };
    } else {
      if (!alert.id) alert.id = Date.now();
      if (!alert.published_at) alert.published_at = new Date().toISOString();
      list.unshift(alert);
    }
    setStorageItem(STORAGE_KEYS.ALERTS, list);
  }

  deleteAlert(id: number): void {
    let list = getStorageItem<CyberAlert[]>(STORAGE_KEYS.ALERTS, INITIAL_DATA.alerts);
    list = list.filter(a => a.id !== id);
    setStorageItem(STORAGE_KEYS.ALERTS, list);
  }

  saveQuiz(question: FullQuizQuestion): void {
    const list = getStorageItem<FullQuizQuestion[]>(STORAGE_KEYS.QUIZZES, INITIAL_DATA.quizzes);
    const idx = list.findIndex(q => q.id === question.id);
    if (idx >= 0) {
      list[idx] = { ...list[idx], ...question };
    } else {
      if (!question.id) question.id = Date.now();
      list.push(question);
    }
    setStorageItem(STORAGE_KEYS.QUIZZES, list);
  }

  deleteQuiz(id: number): void {
    let list = getStorageItem<FullQuizQuestion[]>(STORAGE_KEYS.QUIZZES, INITIAL_DATA.quizzes);
    list = list.filter(q => q.id !== id);
    setStorageItem(STORAGE_KEYS.QUIZZES, list);
  }

  resetToDefaults(): void {
    localStorage.removeItem(STORAGE_KEYS.THREATS);
    localStorage.removeItem(STORAGE_KEYS.CATEGORIES);
    localStorage.removeItem(STORAGE_KEYS.ALERTS);
    localStorage.removeItem(STORAGE_KEYS.TOOLS);
    localStorage.removeItem(STORAGE_KEYS.QUIZZES);
  }

  exportAllData(): string {
    return JSON.stringify({
      threats: this.getThreats(),
      categories: this.getCategories(),
      alerts: this.getAlerts(),
      quizzes: this.getQuizzes(),
      tools: this.getTools(),
      exported_at: new Date().toISOString(),
      version: '1.0'
    }, null, 2);
  }

  importAllData(jsonStr: string): boolean {
    try {
      const parsed = JSON.parse(jsonStr);
      if (Array.isArray(parsed.threats)) setStorageItem(STORAGE_KEYS.THREATS, parsed.threats);
      if (Array.isArray(parsed.categories)) setStorageItem(STORAGE_KEYS.CATEGORIES, parsed.categories);
      if (Array.isArray(parsed.alerts)) setStorageItem(STORAGE_KEYS.ALERTS, parsed.alerts);
      if (Array.isArray(parsed.quizzes)) setStorageItem(STORAGE_KEYS.QUIZZES, parsed.quizzes);
      if (Array.isArray(parsed.tools)) setStorageItem(STORAGE_KEYS.TOOLS, parsed.tools);
      return true;
    } catch (e) {
      console.error('Failed to import JSON data:', e);
      return false;
    }
  }

  // --- Offline Quiz Evaluator ---
  evaluateQuiz(payload: { answers: Record<number, number>; category: string; level: string }): QuizSubmissionResult {
    const allQuestions = this.getQuizzes();
    const details = Object.entries(payload.answers).map(([qIdStr, selectedIdx]) => {
      const qId = Number(qIdStr);
      const question = allQuestions.find(q => q.id === qId);
      const isCorrect = question ? question.correct_index === selectedIdx : false;
      return {
        question_id: qId,
        question: question ? question.question : `Question #${qId}`,
        selected_index: selectedIdx,
        correct_index: question ? question.correct_index : 0,
        is_correct: isCorrect,
        explanation: question ? question.explanation : 'Standard cyber safety principle applies.',
      };
    });

    const correctCount = details.filter(d => d.is_correct).length;
    const total = details.length || 1;
    const percentage = Math.round((correctCount / total) * 100);

    let badge = 'Novice Defender';
    if (percentage >= 90) badge = 'Master Cyber Guardian';
    else if (percentage >= 70) badge = 'Vigilant Sentinel';
    else if (percentage >= 50) badge = 'Apprentice Scout';

    return {
      score: correctCount,
      total,
      percentage,
      badge,
      points_awarded: correctCount * 25,
      details,
    };
  }

  // --- Client-Side Security Heuristic Tools ---
  analyzeUrl(rawUrl: string): URLAnalysisResult {
    let url = rawUrl.trim();
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }

    let parsed: URL;
    try {
      parsed = new URL(url);
    } catch {
      return {
        url: rawUrl,
        hostname: 'invalid',
        scheme: 'unknown',
        status: 'Unable to verify',
        risk_level: 'High Risk',
        score: 95,
        findings: [{
          severity: 'Critical',
          type: 'Malformed URL Syntax',
          description: 'The URL provided does not match standard RFC 3986 URL specifications.'
        }],
        safe_browsing_checked: false,
        disclaimer: 'Always verify domain names before entering credentials.'
      };
    }

    const hostname = parsed.hostname.toLowerCase();
    const findings: URLAnalysisResult['findings'] = [];
    let score = 0;

    // Check HTTP vs HTTPS
    if (parsed.protocol === 'http:') {
      score += 25;
      findings.push({
        severity: 'Medium',
        type: 'Unencrypted Connection (HTTP)',
        description: 'This website transmits traffic in clear text. Sensitive credentials or cookies could be intercepted.'
      });
    }

    // IP address instead of domain
    if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(hostname)) {
      score += 45;
      findings.push({
        severity: 'High',
        type: 'Raw IP Hostname Detected',
        description: 'Legitimate institutions almost never send bare IP addresses. Attackers host phishing kits on direct IP nodes.'
      });
    }

    // Suspicious TLDs
    const highRiskTlds = ['.tk', '.ml', '.ga', '.cf', '.gq', '.top', '.work', '.click', '.buzz', '.quest'];
    if (highRiskTlds.some(tld => hostname.endsWith(tld))) {
      score += 35;
      findings.push({
        severity: 'High',
        type: 'High-Abuse Top Level Domain',
        description: `Domain uses a TLD (${hostname.split('.').pop()}) frequently associated with disposable phishing campaigns.`
      });
    }

    // Punycode check
    if (hostname.includes('xn--')) {
      score += 50;
      findings.push({
        severity: 'Critical',
        type: 'IDN Homograph Punycode Obfuscation',
        description: 'Domain uses internationalized characters to visually impersonate familiar brands.'
      });
    }

    // Brand impersonation keyword check
    const popularBrands = ['paypal', 'google', 'apple', 'microsoft', 'amazon', 'netflix', 'sbi', 'hdfc', 'icici', 'axis', 'paytm', 'phonepe'];
    for (const brand of popularBrands) {
      if (hostname.includes(brand) && !hostname.endsWith(`.${brand}.com`) && !hostname.endsWith(`.${brand}.in`) && hostname !== `${brand}.com` && hostname !== `${brand}.in`) {
        score += 40;
        findings.push({
          severity: 'Critical',
          type: `Brand Impersonation (${brand.toUpperCase()})`,
          description: `Hostname contains brand keyword "${brand}" but is not officially hosted on ${brand}'s root domain.`
        });
      }
    }

    // Excessive subdomains
    if (hostname.split('.').length > 4) {
      score += 20;
      findings.push({
        severity: 'Medium',
        type: 'Excessive Subdomain Depth',
        description: 'Deeply nested subdomains are often crafted to push the real registrar domain out of view on mobile screens.'
      });
    }

    if (findings.length === 0) {
      findings.push({
        severity: 'Info',
        type: 'Standard Structure Verified',
        description: 'No obvious phishing markers, punycode, or raw IP hosts detected.'
      });
    }

    let status: URLAnalysisResult['status'] = 'No Known Threat Detected';
    let risk_level: URLAnalysisResult['risk_level'] = 'Low Risk';

    if (score >= 60) {
      status = 'Known Threat Reported';
      risk_level = 'High Risk';
    } else if (score >= 25) {
      status = 'Suspicious Indicators Found';
      risk_level = 'Moderate Risk';
    }

    return {
      url,
      hostname,
      scheme: parsed.protocol.replace(':', ''),
      status,
      risk_level,
      score: Math.min(100, score),
      findings,
      safe_browsing_checked: true,
      disclaimer: 'Offline heuristic verification. Never enter sensitive passwords or banking OTPs into unverified portals.'
    };
  }

  analyzeMessage(text: string): MessageAnalysisResult {
    const raw = (text || '').trim();
    if (!raw) {
      return {
        risk_level: 'Safe',
        badge_color: 'emerald',
        score: 0,
        red_flags_count: 0,
        red_flags: [],
        extracted_urls: [],
        recommendations: ['Enter a suspicious SMS, email, or WhatsApp message to scan.'],
        disclaimer: 'Client-side heuristic engine.'
      };
    }

    const lower = raw.toLowerCase();
    const red_flags: MessageAnalysisResult['red_flags'] = [];
    let score = 0;

    const checks = [
      { pattern: /\b(otp|one time password|cvv|upi pin|pin|secret code)\b/i, type: 'Request for Confidential Credentials', severity: 'Critical', expl: 'Legitimate banks and organizations NEVER request your OTP, PIN, or CVV over SMS or phone call.' },
      { pattern: /\b(immediately|urgent|within \d+ hours?|within \d+ mins?|expires soon|last chance|immediate action)\b/i, type: 'Artificial Urgency Trigger', severity: 'High', expl: 'Scammers induce emotional panic to bypass rational caution.' },
      { pattern: /\b(blocked|suspended|terminated|deactivated|disconnected|legal notice|arrest|court warrant)\b/i, type: 'Threat of Service Termination or Legal Coercion', severity: 'High', expl: 'Intimidation tactics commonly used in fake electricity, SIM block, and police scams.' },
      { pattern: /\b(lottery|won ₹|claim reward|cashback|bonus credited|lucky draw|free gift)\b/i, type: 'Unsolicited Financial Bait', severity: 'High', expl: 'Promises of windfall money or lottery rewards are universally fraudulent.' },
      { pattern: /\b(sbi|hdfc|icici|axis|punjab national|rbi|customs|cbi|ncb|mumbai police)\b/i, type: 'Institution / Authority Impersonation', severity: 'High', expl: 'Posing as reputable banks or law enforcement agencies to demand urgent payments.' },
      { pattern: /\b(\.apk|anydesk|teamviewer|rustdesk|quicksupport)\b/i, type: 'Malicious App or Remote Access Lure', severity: 'Critical', expl: 'Instructions to install unknown APKs or remote desktop apps allow attackers to take over your mobile device.' },
    ];

    checks.forEach(chk => {
      const match = lower.match(chk.pattern);
      if (match) {
        score += chk.severity === 'Critical' ? 35 : 20;
        red_flags.push({
          type: chk.type,
          matched_text: match[0],
          severity: chk.severity,
          explanation: chk.expl
        });
      }
    });

    const urlRegex = /(https?:\/\/[^\s]+|www\.[^\s]+|[a-zA-Z0-9-]+\.[a-zA-Z]{2,}\/[^\s]*)/gi;
    const extracted_urls = (raw.match(urlRegex) || []).slice(0, 5);

    score = Math.min(100, score);
    let risk_level = 'Low Risk';
    let badge_color = 'emerald';
    if (score >= 60) {
      risk_level = 'Critical Phishing Threat';
      badge_color = 'red';
    } else if (score >= 30) {
      risk_level = 'Moderate Scam Probability';
      badge_color = 'amber';
    }

    const recommendations = [];
    if (score >= 30) {
      recommendations.push('Do NOT click any links or download attached APK files.');
      recommendations.push('Never forward or speak your OTP/PIN to anyone.');
      recommendations.push('Call the official customer care number directly from the company website or debit card back.');
      recommendations.push('Report financial scams immediately to National Cyber Crime helpline: 1930.');
    } else {
      recommendations.push('Always verify unexpected sender numbers and email headers.');
    }

    return {
      risk_level,
      badge_color,
      score,
      red_flags_count: red_flags.length,
      red_flags,
      extracted_urls,
      recommendations,
      disclaimer: 'Powered by REDLINE Rule-Based Heuristic Safety Engine.'
    };
  }

  inspectEmailHeaders(headers: string): EmailHeaderAnalysisResult {
    const raw = headers || '';
    const findings: EmailHeaderAnalysisResult['findings'] = [];
    let risk_score = 0;

    const fromMatch = raw.match(/^From:\s*(.+)$/im);
    const replyToMatch = raw.match(/^Reply-To:\s*(.+)$/im);
    const from_header = fromMatch ? fromMatch[1].trim() : 'Unknown';
    const reply_to_header = replyToMatch ? replyToMatch[1].trim() : '';

    if (reply_to_header && from_header) {
      const fromDomain = from_header.split('@')[1]?.replace('>', '').trim().toLowerCase();
      const replyDomain = reply_to_header.split('@')[1]?.replace('>', '').trim().toLowerCase();
      if (fromDomain && replyDomain && fromDomain !== replyDomain) {
        risk_score += 40;
        findings.push({
          severity: 'Critical',
          title: 'From & Reply-To Domain Discrepancy',
          description: `Replies are directed to "${replyDomain}", which does not match the sender domain "${fromDomain}". Classic spoofing technique.`
        });
      }
    }

    const spfMatch = raw.match(/spf=([a-z]+)/i);
    const spf_status = spfMatch ? spfMatch[1].toLowerCase() : 'none';
    if (['fail', 'softfail'].includes(spf_status)) {
      risk_score += 35;
      findings.push({
        severity: 'High',
        title: `SPF Authentication ${spf_status.toUpperCase()}`,
        description: 'The sending server IP is not authorized by the domain owner to dispatch emails on their behalf.'
      });
    }

    const dkimMatch = raw.match(/dkim=([a-z]+)/i);
    const dkim_status = dkimMatch ? dkimMatch[1].toLowerCase() : 'none';
    if (dkim_status === 'fail') {
      risk_score += 35;
      findings.push({
        severity: 'High',
        title: 'DKIM Signature Verification Failed',
        description: 'The cryptographic signature of this email does not match the public key in domain DNS, indicating message tampering.'
      });
    }

    const dmarcMatch = raw.match(/dmarc=([a-z]+)/i);
    const dmarc_status = dmarcMatch ? dmarcMatch[1].toLowerCase() : 'none';

    let verdict = 'Email Appears Authenticated';
    if (risk_score >= 60) verdict = 'High Spoofing & Impersonation Probability';
    else if (risk_score >= 25) verdict = 'Suspicious Header Inconsistencies Detected';

    return {
      from_header,
      reply_to_header: reply_to_header || 'Matches sender',
      spf_status: spf_status.toUpperCase(),
      dkim_status: dkim_status.toUpperCase(),
      dmarc_status: dmarc_status.toUpperCase(),
      risk_score: Math.min(100, risk_score),
      verdict,
      findings
    };
  }

  // --- Offline AI Cyber Assistant ---
  generateAiResponse(prompt: string, language: 'en' | 'ml' = 'en'): string {
    const q = prompt.toLowerCase();

    if (language === 'ml') {
      if (q.includes('otp') || q.includes('പണം') || q.includes('തട്ടിപ്പ്') || q.includes('scam')) {
        return 'ശ്രദ്ധിക്കുക: നിങ്ങളുടെ OTP, ബാങ്ക് PIN, അല്ലെങ്കിൽ CVV ഒരു കാരണവശാലും ആരുമായും പങ്കിടരുത്. പണം നഷ്ടപ്പെട്ടാൽ ഉടൻ തന്നെ 1930 നമ്പറിലോ cybercrime.gov.in വഴിയോ പരാതി നൽകുക. കൂടാതെ നിങ്ങളുടെ ബാങ്കിൽ വിളിച്ച് അക്കൗണ്ട് ഫ്രീസ് ചെയ്യുക.';
      }
      return 'റെഡ്‌ലൈൻ സൈബർ സുരക്ഷാ സഹായി: ഓൺലൈൻ സുരക്ഷ, ഫിഷിംഗ് തട്ടിപ്പുകൾ, UPI തട്ടിപ്പുകൾ എന്നിവയെക്കുറിച്ച് നിങ്ങൾക്ക് ഏത് സംശയവും ചോദിക്കാം. അടിയന്തര സാഹചര്യങ്ങളിൽ 1930 ഡയൽ ചെയ്യുക.';
    }

    if (q.includes('otp') || q.includes('cvv') || q.includes('pin')) {
      return 'CRITICAL ADVICE: Legitimate banks, police, or tech support will NEVER ask for your OTP, PIN, or CVV. If you recently shared an OTP with someone, immediately call your bank to block your cards/net banking, and dial the National Cyber Crime Helpline at 1930.';
    }
    if (q.includes('1930') || q.includes('helpline') || q.includes('complaint') || q.includes('police')) {
      return 'To report cyber fraud in India:\n1. Call 1930 immediately (National Cyber Crime Reporting Helpline).\n2. File a formal complaint online at https://cybercrime.gov.in.\n3. Keep bank transaction IDs, SMS screenshots, and scam phone numbers ready.';
    }
    if (q.includes('phishing') || q.includes('link') || q.includes('sms')) {
      return 'Phishing Safety Rules:\n1. Check the domain carefully (e.g. sbi.co.in vs sbi-kyc-update.com).\n2. Never install APK files sent via WhatsApp or SMS.\n3. Do not scan unknown QR codes to "receive" money—scanning a QR code always DEDUCTS money from your account.';
    }
    if (q.includes('password') || q.includes('protect')) {
      return 'Password Best Practices:\n1. Use a passphrase of 14+ characters mixing words, numbers, and symbols.\n2. Always enable Two-Factor Authentication (2FA) with an authenticator app (Google Authenticator) rather than SMS where possible.\n3. Never reuse the same password across multiple online accounts.';
    }

    return `REDLINE AI Cyber Defense Guard: I am monitoring for cyber threats. You can ask me how to identify phishing links, protect your UPI payments, recover from account compromise, or report financial fraud (Helpline: 1930). How can I assist you with your security today?`;
  }

  // --- Offline User / Auth Support ---
  getUser(): User | null {
    return getStorageItem<User | null>(STORAGE_KEYS.USER, null);
  }

  setUser(user: User | null): void {
    setStorageItem(STORAGE_KEYS.USER, user);
  }

  getDashboard(): DashboardSummary {
    const user = this.getUser() || {
      id: 1,
      username: 'CyberGuardian',
      email: 'user@redline.safety',
      role: 'Defender',
      awareness_score: 240,
    };
    return {
      user,
      awareness_score: user.awareness_score || 240,
      tier: 'Shield Sentinel',
      level_number: 2,
      avg_quiz_score: 85,
      quiz_history: [
        { topic: 'Phishing Awareness', score: 100, date: 'Today' },
        { topic: 'UPI Safety', score: 80, date: 'Yesterday' }
      ],
      simulations_completed: [
        { id: 'url-checker', name: 'Malicious URL Inspection' },
        { id: 'sms-analyzer', name: 'Scam SMS Detection' }
      ],
      saved_count: this.getSavedArticles().length
    };
  }

  getSavedArticles(): number[] {
    return getStorageItem<number[]>(STORAGE_KEYS.SAVED_ARTICLES, [1, 3]);
  }

  toggleSaveArticle(threatId: number): boolean {
    let saved = this.getSavedArticles();
    let isSaved = false;
    if (saved.includes(threatId)) {
      saved = saved.filter(id => id !== threatId);
      isSaved = false;
    } else {
      saved.push(threatId);
      isSaved = true;
    }
    setStorageItem(STORAGE_KEYS.SAVED_ARTICLES, saved);
    return isSaved;
  }
}

export const localDataStore = new LocalDataStore();
