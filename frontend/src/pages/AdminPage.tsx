import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import {
  ShieldAlert,
  Plus,
  Trash2,
  Edit,
  Download,
  Upload,
  RotateCcw,
  Search,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
  Bell,
  Award,
  Database,
  Layers,
  X,
  Save,
  Radio,
  Lock,
  Unlock,
  KeyRound,
  Eye,
  EyeOff,
  LogOut,
  User as UserIcon,
  ArrowLeft,
  ShieldCheck
} from 'lucide-react';
import { NeonCard } from '../components/common/NeonCard';
import { CyberButton } from '../components/common/CyberButton';
import { Badge } from '../components/common/Badge';
import { localDataStore } from '../services/localDataStore';
import { Threat, ThreatCategory, CyberAlert } from '../types';
import { FullQuizQuestion } from '../data/initialData';

export const AdminPage: React.FC = () => {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('redline_admin_auth') === 'true';
  });
  const [adminId, setAdminId] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // Tab & Notification State
  const [activeTab, setActiveTab] = useState<'threats' | 'alerts' | 'quizzes' | 'sync'>('threats');
  const [searchTerm, setSearchTerm] = useState('');
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Data states
  const [threats, setThreats] = useState<Threat[]>([]);
  const [categories, setCategories] = useState<ThreatCategory[]>([]);
  const [alerts, setAlerts] = useState<CyberAlert[]>([]);
  const [quizzes, setQuizzes] = useState<FullQuizQuestion[]>([]);

  // Threat Modal State
  const [isThreatModalOpen, setIsThreatModalOpen] = useState(false);
  const [editingThreat, setEditingThreat] = useState<Partial<Threat> | null>(null);
  const [threatRealExamples, setThreatRealExamples] = useState('');
  const [threatWarningSigns, setThreatWarningSigns] = useState('');
  const [threatPrevention, setThreatPrevention] = useState('');
  const [threatWhatToDo, setThreatWhatToDo] = useState('');

  // Alert Modal State
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [editingAlert, setEditingAlert] = useState<Partial<CyberAlert> | null>(null);

  // Quiz Modal State
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState<Partial<FullQuizQuestion> | null>(null);
  const [quizOptionsStr, setQuizOptionsStr] = useState('');

  const loadData = () => {
    setThreats(localDataStore.getThreats());
    setCategories(localDataStore.getCategories());
    setAlerts(localDataStore.getAlerts());
    setQuizzes(localDataStore.getQuizzes());
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // --- Login & Logout Handlers ---
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticating(true);
    setLoginError('');

    setTimeout(() => {
      // Validate credentials
      if (adminId.trim() === 'admin' && adminPassword === 'anyone123') {
        sessionStorage.setItem('redline_admin_auth', 'true');
        setIsAuthenticated(true);
        loadData();
        showNotification('Admin clearance authorized. Welcome to REDLINE Command Operations.');
      } else {
        setLoginError('ACCESS DENIED: Invalid Admin ID or Passphrase.');
      }
      setIsAuthenticating(false);
    }, 400);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('redline_admin_auth');
    setIsAuthenticated(false);
    setAdminId('');
    setAdminPassword('');
    showNotification('Admin terminal locked.');
  };

  // --- Threat Handlers ---
  const handleOpenThreatModal = (t?: Threat) => {
    if (t) {
      setEditingThreat({ ...t });
      setThreatRealExamples((t.content?.real_world_examples || []).join('\n'));
      setThreatWarningSigns((t.content?.warning_signs || []).join('\n'));
      setThreatPrevention((t.content?.prevention || []).join('\n'));
      setThreatWhatToDo((t.content?.what_to_do || []).join('\n'));
    } else {
      setEditingThreat({
        name: '',
        slug: '',
        category_id: categories[0]?.id || 1,
        category_slug: categories[0]?.slug || 'social-engineering',
        category_name: categories[0]?.name || 'Social Engineering',
        risk_category: 'High',
        difficulty: 'Beginner',
        icon: 'ShieldAlert',
        short_desc: '',
        content: {
          what_is: '',
          how_it_works: '',
          real_world_examples: [],
          warning_signs: [],
          who_affected: 'General public, smartphone users, digital banking customers',
          consequences: 'Unauthorized account access, financial loss, confidential data leak',
          prevention: [],
          what_to_do: [],
          related_threats: [],
          quiz: [],
        },
      });
      setThreatRealExamples('');
      setThreatWarningSigns('');
      setThreatPrevention('');
      setThreatWhatToDo('');
    }
    setIsThreatModalOpen(true);
  };

  const handleSaveThreat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingThreat || !editingThreat.name || !editingThreat.short_desc) {
      showNotification('Please fill in required fields (Name & Short Description)', 'error');
      return;
    }

    const selectedCat = categories.find(c => c.id === Number(editingThreat.category_id)) || categories[0];
    const generatedSlug = editingThreat.slug?.trim() || editingThreat.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const fullThreat: Threat = {
      id: editingThreat.id || Date.now(),
      category_id: selectedCat.id,
      category_slug: selectedCat.slug,
      category_name: selectedCat.name,
      slug: generatedSlug,
      name: editingThreat.name,
      short_desc: editingThreat.short_desc,
      risk_category: (editingThreat.risk_category as any) || 'High',
      difficulty: (editingThreat.difficulty as any) || 'Beginner',
      icon: editingThreat.icon || 'ShieldAlert',
      views_count: editingThreat.views_count || 0,
      content: {
        what_is: editingThreat.content?.what_is || editingThreat.short_desc,
        how_it_works: editingThreat.content?.how_it_works || 'Attackers systematically deceive targets into compliance.',
        real_world_examples: threatRealExamples.split('\n').map(s => s.trim()).filter(Boolean),
        warning_signs: threatWarningSigns.split('\n').map(s => s.trim()).filter(Boolean),
        who_affected: editingThreat.content?.who_affected || 'General public',
        consequences: editingThreat.content?.consequences || 'Financial and credential compromise',
        prevention: threatPrevention.split('\n').map(s => s.trim()).filter(Boolean),
        what_to_do: threatWhatToDo.split('\n').map(s => s.trim()).filter(Boolean),
        related_threats: editingThreat.content?.related_threats || [],
        quiz: editingThreat.content?.quiz || [],
      },
    };

    localDataStore.saveThreat(fullThreat);
    loadData();
    setIsThreatModalOpen(false);
    showNotification(`Threat "${fullThreat.name}" saved successfully!`);
  };

  const handleDeleteThreat = (id: number, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      localDataStore.deleteThreat(id);
      loadData();
      showNotification(`Deleted threat: ${name}`);
    }
  };

  // --- Alert Handlers ---
  const handleOpenAlertModal = (a?: CyberAlert) => {
    if (a) {
      setEditingAlert({ ...a });
    } else {
      setEditingAlert({
        title: '',
        source: 'CERT-In',
        severity: 'High',
        category: 'Malware / Exploit',
        summary: '',
        recommended_action: 'Apply security patches and avoid clicking unsolicited links.',
        affected_systems: 'Android, Windows, iOS',
        is_active: true,
      });
    }
    setIsAlertModalOpen(true);
  };

  const handleSaveAlert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAlert || !editingAlert.title || !editingAlert.summary) {
      showNotification('Title and summary are required', 'error');
      return;
    }

    const fullAlert: CyberAlert = {
      id: editingAlert.id || Date.now(),
      title: editingAlert.title,
      source: editingAlert.source || 'CERT-In',
      severity: (editingAlert.severity as any) || 'High',
      category: editingAlert.category || 'Threat Advisory',
      summary: editingAlert.summary,
      recommended_action: editingAlert.recommended_action || 'Review security posture immediately.',
      affected_systems: editingAlert.affected_systems || 'Universal',
      published_at: editingAlert.published_at || new Date().toISOString(),
      is_active: true,
      original_url: editingAlert.original_url || '',
    };

    localDataStore.saveAlert(fullAlert);
    loadData();
    setIsAlertModalOpen(false);
    showNotification(`Alert "${fullAlert.title}" published!`);
  };

  const handleDeleteAlert = (id: number, title: string) => {
    if (window.confirm(`Delete alert "${title}"?`)) {
      localDataStore.deleteAlert(id);
      loadData();
      showNotification(`Alert deleted`);
    }
  };

  // --- Quiz Handlers ---
  const handleOpenQuizModal = (q?: FullQuizQuestion) => {
    if (q) {
      setEditingQuiz({ ...q });
      setQuizOptionsStr(q.options.join('\n'));
    } else {
      setEditingQuiz({
        category: 'Phishing Awareness',
        level: 'Beginner',
        question: '',
        correct_index: 0,
        explanation: '',
      });
      setQuizOptionsStr('Option 1\nOption 2\nOption 3\nOption 4');
    }
    setIsQuizModalOpen(true);
  };

  const handleSaveQuiz = (e: React.FormEvent) => {
    e.preventDefault();
    const opts = quizOptionsStr.split('\n').map(s => s.trim()).filter(Boolean);
    if (!editingQuiz || !editingQuiz.question || opts.length < 2) {
      showNotification('Please enter a question and at least 2 options', 'error');
      return;
    }

    const fullQ: FullQuizQuestion = {
      id: editingQuiz.id || Date.now(),
      category: editingQuiz.category || 'Phishing Awareness',
      level: editingQuiz.level || 'Beginner',
      question: editingQuiz.question,
      options: opts,
      correct_index: Number(editingQuiz.correct_index) || 0,
      explanation: editingQuiz.explanation || 'Review standard security protocols.',
    };

    localDataStore.saveQuiz(fullQ);
    loadData();
    setIsQuizModalOpen(false);
    showNotification('Quiz question saved!');
  };

  const handleDeleteQuiz = (id: number) => {
    if (window.confirm('Delete this quiz question?')) {
      localDataStore.deleteQuiz(id);
      loadData();
      showNotification('Question deleted');
    }
  };

  // --- Export & Import ---
  const handleExportJson = () => {
    const dataStr = localDataStore.exportAllData();
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `redline_dataset_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showNotification('Backup downloaded successfully!');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = evt => {
      const content = evt.target?.result as string;
      if (localDataStore.importAllData(content)) {
        loadData();
        showNotification('Import completed successfully! All data updated.');
      } else {
        showNotification('Failed to parse imported JSON file.', 'error');
      }
    };
    reader.readAsText(file);
  };

  const handleResetDefaults = () => {
    if (window.confirm('Reset all content back to factory seed data? Any custom edits will be reverted.')) {
      localDataStore.resetToDefaults();
      loadData();
      showNotification('Dataset restored to default seed catalog.');
    }
  };

  // Filtering
  const filteredThreats = threats.filter(t =>
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.category_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.short_desc.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ==========================================
  // VIEW 1: GATEKEEPER LOGIN SCREEN
  // ==========================================
  if (!isAuthenticated) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center py-12 px-4 animate-fade-in">
        <div className="max-w-md w-full space-y-6">
          <NeonCard glow={true} className="p-8 border-[#FF3038] shadow-[0_0_35px_rgba(255,48,56,0.35)] relative overflow-hidden">
            {/* Top scanning pulse bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#FF3038] to-transparent animate-pulse" />

            <div className="text-center space-y-3 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-[#101014] border-2 border-[#FF3038] mx-auto flex items-center justify-center shadow-[0_0_20px_rgba(255,48,56,0.5)]">
                <Lock className="w-8 h-8 text-[#FF3038] animate-pulse" />
              </div>
              <div className="inline-block px-3 py-1 rounded-full bg-[#FF3038]/20 border border-[#FF3038]/50 text-[#FF5555] font-mono text-[10px] tracking-widest uppercase font-bold">
                Level-5 Clearance Required
              </div>
              <h1 className="font-display-badge text-2xl font-black text-white tracking-wider">
                RED<span className="text-[#FF3038]">LINE</span> COMMAND GATEWAY
              </h1>
              <p className="text-[#A0A0A8] text-xs leading-relaxed">
                Enter your administrative credentials to unlock threat management, cyber advisories, and system operations.
              </p>
            </div>

            {loginError && (
              <div className="mb-4 p-3 rounded-xl bg-red-950/50 border border-red-500/60 text-red-300 text-xs flex items-center gap-2 animate-shake">
                <AlertTriangle className="w-4 h-4 text-[#FF3038] flex-shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-[#A0A0A8] text-[11px] font-mono uppercase mb-1.5 flex items-center gap-1.5">
                  <UserIcon className="w-3.5 h-3.5 text-[#FF3038]" />
                  <span>Admin ID</span>
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  placeholder="admin"
                  value={adminId}
                  onChange={e => setAdminId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#101014] border border-[#FF3038]/40 text-white placeholder-[#606068] text-xs font-mono focus:outline-none focus:border-[#FF3038] focus:shadow-[0_0_15px_rgba(255,48,56,0.3)] transition"
                />
              </div>

              <div>
                <label className="block text-[#A0A0A8] text-[11px] font-mono uppercase mb-1.5 flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-[#FF3038]" />
                  <span>Master Passphrase</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••••••"
                    value={adminPassword}
                    onChange={e => setAdminPassword(e.target.value)}
                    className="w-full pl-3.5 pr-10 py-2.5 rounded-xl bg-[#101014] border border-[#FF3038]/40 text-white placeholder-[#606068] text-xs font-mono focus:outline-none focus:border-[#FF3038] focus:shadow-[0_0_15px_rgba(255,48,56,0.3)] transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A0A0A8] hover:text-white transition"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <CyberButton
                type="submit"
                variant="primary"
                className="w-full mt-2"
                isLoading={isAuthenticating}
                icon={<Unlock className="w-4 h-4" />}
              >
                Authenticate Terminal
              </CyberButton>
            </form>

            <div className="mt-6 pt-4 border-t border-white/10 text-center">
              <NavLink
                to="/"
                className="inline-flex items-center gap-1.5 text-xs font-mono text-[#A0A0A8] hover:text-[#FF5555] transition"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Public Dashboard</span>
              </NavLink>
            </div>
          </NeonCard>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW 2: AUTHENTICATED ADMIN PORTAL
  // ==========================================
  return (
    <div className="py-8 px-4 md:px-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#FF3038]/20 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="p-1.5 rounded-lg bg-[#FF3038]/20 border border-[#FF3038] text-[#FF5555]">
              <Database className="w-5 h-5 text-[#FF3038]" />
            </span>
            <span className="font-mono text-xs text-[#FF5555] uppercase tracking-widest font-bold">
              Content Control & Operations
            </span>
          </div>
          <h1 className="font-display-badge text-3xl md:text-4xl font-black text-white tracking-wide">
            RED<span className="text-[#FF3038]">LINE</span> ADMIN PORTAL
          </h1>
          <p className="text-[#A0A0A8] text-sm mt-1">
            Manage threat definitions, real-time cyber alerts, quizzes, and sync content directly to your live ecosystem.
          </p>
        </div>

        {/* Admin Status & Logout Action */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="px-3.5 py-2 rounded-xl bg-[#101014] border border-emerald-500/40 flex items-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <div>
              <p className="text-[10px] font-mono text-[#A0A0A8] uppercase">Clearance Verified</p>
              <p className="text-xs font-mono text-emerald-400 font-bold">ROOT ADMIN (admin)</p>
            </div>
          </div>

          <CyberButton
            variant="danger"
            size="sm"
            onClick={handleLogout}
            icon={<LogOut className="w-4 h-4" />}
          >
            Lock Terminal
          </CyberButton>
        </div>
      </div>

      {/* Notifications */}
      {notification && (
        <div
          className={`p-4 rounded-xl border flex items-center gap-3 ${
            notification.type === 'success'
              ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200'
              : 'bg-red-950/40 border-red-500/50 text-red-200'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0" />
          )}
          <span className="text-sm font-medium">{notification.message}</span>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[#FF3038]/20 pb-2">
        <button
          onClick={() => setActiveTab('threats')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs md:text-sm font-heading uppercase tracking-wider transition ${
            activeTab === 'threats'
              ? 'bg-[#FF3038] text-white font-bold shadow-[0_0_15px_rgba(255,48,56,0.4)]'
              : 'bg-[#101014] text-[#A0A0A8] hover:text-white border border-[#FF3038]/30'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Threats ({threats.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('alerts')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs md:text-sm font-heading uppercase tracking-wider transition ${
            activeTab === 'alerts'
              ? 'bg-[#FF3038] text-white font-bold shadow-[0_0_15px_rgba(255,48,56,0.4)]'
              : 'bg-[#101014] text-[#A0A0A8] hover:text-white border border-[#FF3038]/30'
          }`}
        >
          <Bell className="w-4 h-4" />
          <span>Cyber Alerts ({alerts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('quizzes')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs md:text-sm font-heading uppercase tracking-wider transition ${
            activeTab === 'quizzes'
              ? 'bg-[#FF3038] text-white font-bold shadow-[0_0_15px_rgba(255,48,56,0.4)]'
              : 'bg-[#101014] text-[#A0A0A8] hover:text-white border border-[#FF3038]/30'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Quizzes ({quizzes.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('sync')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs md:text-sm font-heading uppercase tracking-wider transition ${
            activeTab === 'sync'
              ? 'bg-[#FF3038] text-white font-bold shadow-[0_0_15px_rgba(255,48,56,0.4)]'
              : 'bg-[#101014] text-[#A0A0A8] hover:text-white border border-[#FF3038]/30'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>Data Sync & Backup</span>
        </button>
      </div>

      {/* TAB 1: THREATS */}
      {activeTab === 'threats' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-[#A0A0A8] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search threats by title or category..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#101014] border border-[#FF3038]/30 text-white placeholder-[#707078] text-xs font-mono focus:outline-none focus:border-[#FF3038]"
              />
            </div>
            <CyberButton onClick={() => handleOpenThreatModal()} icon={<Plus className="w-4 h-4" />}>
              Add New Threat
            </CyberButton>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredThreats.map(t => (
              <NeonCard key={t.id} className="flex flex-col justify-between p-5 space-y-4">
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-[11px] font-mono text-[#FF5555] uppercase tracking-wider font-semibold">
                      {t.category_name}
                    </span>
                    <Badge variant={t.risk_category.toLowerCase() as any} size="sm">
                      {t.risk_category}
                    </Badge>
                  </div>
                  <h3 className="font-heading font-bold text-white text-base leading-snug group-hover:text-[#FF5555] transition">
                    {t.name}
                  </h3>
                  <p className="text-[#A0A0A8] text-xs mt-2 line-clamp-3 leading-relaxed">
                    {t.short_desc}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#FF3038]/20 flex items-center justify-between text-xs font-mono">
                  <span className="text-[#707078]">Views: {t.views_count || 0}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenThreatModal(t)}
                      className="p-1.5 rounded-lg bg-[#181820] text-blue-400 hover:text-white hover:bg-blue-600 transition"
                      title="Edit Threat"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteThreat(t.id, t.name)}
                      className="p-1.5 rounded-lg bg-[#181820] text-red-400 hover:text-white hover:bg-red-600 transition"
                      title="Delete Threat"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </NeonCard>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: ALERTS */}
      {activeTab === 'alerts' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-lg font-bold text-white">Active Cyber Advisories & Alerts</h2>
            <CyberButton onClick={() => handleOpenAlertModal()} icon={<Plus className="w-4 h-4" />}>
              Publish Alert
            </CyberButton>
          </div>

          <div className="space-y-3">
            {alerts.map(a => (
              <NeonCard key={a.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant={a.severity.toLowerCase() as any} size="sm">
                      {a.severity}
                    </Badge>
                    <span className="text-[11px] font-mono text-[#A0A0A8] bg-white/5 px-2 py-0.5 rounded">
                      {a.source}
                    </span>
                    <span className="text-[11px] font-mono text-[#707078]">
                      {new Date(a.published_at).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="font-heading font-bold text-white text-base">{a.title}</h3>
                  <p className="text-xs text-[#A0A0A8] leading-relaxed">{a.summary}</p>
                </div>

                <div className="flex items-center gap-2 self-end md:self-center">
                  <button
                    onClick={() => handleOpenAlertModal(a)}
                    className="p-2 rounded-lg bg-[#181820] text-blue-400 hover:text-white hover:bg-blue-600 transition"
                    title="Edit Alert"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteAlert(a.id, a.title)}
                    className="p-2 rounded-lg bg-[#181820] text-red-400 hover:text-white hover:bg-red-600 transition"
                    title="Delete Alert"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </NeonCard>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: QUIZZES */}
      {activeTab === 'quizzes' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-lg font-bold text-white">Quiz Question Repository</h2>
            <CyberButton onClick={() => handleOpenQuizModal()} icon={<Plus className="w-4 h-4" />}>
              Add Question
            </CyberButton>
          </div>

          <div className="space-y-3">
            {quizzes.map((q, idx) => (
              <NeonCard key={q.id || idx} className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono bg-[#FF3038]/20 text-[#FF5555] px-2 py-0.5 rounded font-bold">
                        {q.category}
                      </span>
                      <span className="text-[10px] font-mono text-[#A0A0A8]">
                        Level: {q.level}
                      </span>
                    </div>
                    <h3 className="font-heading font-semibold text-white text-sm">{q.question}</h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenQuizModal(q)}
                      className="p-1.5 rounded-lg bg-[#181820] text-blue-400 hover:text-white"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteQuiz(q.id)}
                      className="p-1.5 rounded-lg bg-[#181820] text-red-400 hover:text-white"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                  {q.options.map((opt, optIdx) => (
                    <div
                      key={optIdx}
                      className={`p-2 rounded-lg border ${
                        optIdx === q.correct_index
                          ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300 font-bold'
                          : 'bg-[#101014] border-white/10 text-[#A0A0A8]'
                      }`}
                    >
                      {optIdx === q.correct_index ? '✓ ' : '• '} {opt}
                    </div>
                  ))}
                </div>
                <p className="text-[11px] text-[#A0A0A8] italic">Explanation: {q.explanation}</p>
              </NeonCard>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: SYNC & BACKUP */}
      {activeTab === 'sync' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <NeonCard className="p-6 space-y-4">
            <div className="flex items-center gap-3 text-emerald-400">
              <Download className="w-6 h-6" />
              <h3 className="font-heading text-lg font-bold text-white">Export Dataset (JSON)</h3>
            </div>
            <p className="text-xs text-[#A0A0A8] leading-relaxed">
              Export all threats, alerts, quiz questions, and tools currently saved in the client store into a single JSON file. You can keep this as a safe backup or upload it into any other deployment.
            </p>
            <CyberButton onClick={handleExportJson} icon={<Download className="w-4 h-4" />}>
              Download redline_backup.json
            </CyberButton>
          </NeonCard>

          <NeonCard className="p-6 space-y-4">
            <div className="flex items-center gap-3 text-blue-400">
              <Upload className="w-6 h-6" />
              <h3 className="font-heading text-lg font-bold text-white">Import / Upload Dataset (JSON)</h3>
            </div>
            <p className="text-xs text-[#A0A0A8] leading-relaxed">
              Upload a previously exported JSON backup or new content file. It will instantly populate the database and immediately refresh all pages.
            </p>
            <label className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#101014] border border-[#FF3038] text-white font-heading text-xs uppercase tracking-wider cursor-pointer hover:bg-[#FF3038]/20 transition">
              <Upload className="w-4 h-4 text-[#FF3038]" />
              <span>Choose JSON File</span>
              <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
            </label>
          </NeonCard>

          <NeonCard className="p-6 space-y-4 md:col-span-2 border-red-500/40">
            <div className="flex items-center gap-3 text-[#FF5555]">
              <RotateCcw className="w-6 h-6" />
              <h3 className="font-heading text-lg font-bold text-white">Reset to Default Seed Data</h3>
            </div>
            <p className="text-xs text-[#A0A0A8] leading-relaxed">
              Restores all 24 curated cyber threats, categories, alerts, and quizzes back to factory default values exported from the REDLINE core cybersecurity engine.
            </p>
            <CyberButton variant="outline" onClick={handleResetDefaults} icon={<RotateCcw className="w-4 h-4" />}>
              Restore Default Seed Catalog
            </CyberButton>
          </NeonCard>
        </div>
      )}

      {/* --- THREAT MODAL --- */}
      {isThreatModalOpen && editingThreat && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#0B0B0E] border border-[#FF3038] rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-[0_0_30px_rgba(255,48,56,0.3)] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#FF3038]/30 pb-3">
              <h2 className="font-heading text-lg font-bold text-white">
                {editingThreat.id ? 'Edit Cyber Threat' : 'Create New Cyber Threat'}
              </h2>
              <button onClick={() => setIsThreatModalOpen(false)} className="text-[#A0A0A8] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveThreat} className="space-y-4 text-xs font-mono">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#A0A0A8] mb-1 font-heading uppercase text-[10px]">Threat Title *</label>
                  <input
                    type="text"
                    required
                    value={editingThreat.name || ''}
                    onChange={e => setEditingThreat({ ...editingThreat, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#14141A] border border-white/20 text-white focus:outline-none focus:border-[#FF3038]"
                    placeholder="e.g. SIM Swap Fraud"
                  />
                </div>
                <div>
                  <label className="block text-[#A0A0A8] mb-1 font-heading uppercase text-[10px]">Category</label>
                  <select
                    value={editingThreat.category_id || 1}
                    onChange={e => setEditingThreat({ ...editingThreat, category_id: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg bg-[#14141A] border border-white/20 text-white focus:outline-none focus:border-[#FF3038]"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#A0A0A8] mb-1 font-heading uppercase text-[10px]">Severity Level</label>
                  <select
                    value={editingThreat.risk_category || 'High'}
                    onChange={e => setEditingThreat({ ...editingThreat, risk_category: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-lg bg-[#14141A] border border-white/20 text-white focus:outline-none focus:border-[#FF3038]"
                  >
                    <option value="Critical">Critical</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[#A0A0A8] mb-1 font-heading uppercase text-[10px]">Target Audience Difficulty</label>
                  <select
                    value={editingThreat.difficulty || 'Beginner'}
                    onChange={e => setEditingThreat({ ...editingThreat, difficulty: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-lg bg-[#14141A] border border-white/20 text-white focus:outline-none focus:border-[#FF3038]"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[#A0A0A8] mb-1 font-heading uppercase text-[10px]">Short Summary *</label>
                <textarea
                  rows={2}
                  required
                  value={editingThreat.short_desc || ''}
                  onChange={e => setEditingThreat({ ...editingThreat, short_desc: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#14141A] border border-white/20 text-white focus:outline-none focus:border-[#FF3038]"
                  placeholder="Concise 1-2 sentence overview shown in cards."
                />
              </div>

              <div>
                <label className="block text-[#A0A0A8] mb-1 font-heading uppercase text-[10px]">Warning Signs (One per line)</label>
                <textarea
                  rows={3}
                  value={threatWarningSigns}
                  onChange={e => setThreatWarningSigns(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#14141A] border border-white/20 text-white focus:outline-none focus:border-[#FF3038]"
                  placeholder="Sudden loss of cellular network reception&#10;Unsolicited SMS about eSIM upgrade"
                />
              </div>

              <div>
                <label className="block text-[#A0A0A8] mb-1 font-heading uppercase text-[10px]">Prevention Measures (One per line)</label>
                <textarea
                  rows={3}
                  value={threatPrevention}
                  onChange={e => setThreatPrevention(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#14141A] border border-white/20 text-white focus:outline-none focus:border-[#FF3038]"
                  placeholder="Never share OTPs with callers&#10;Set a PIN lock on your physical SIM"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-[#FF3038]/20">
                <CyberButton variant="ghost" type="button" onClick={() => setIsThreatModalOpen(false)}>
                  Cancel
                </CyberButton>
                <CyberButton variant="primary" type="submit" icon={<Save className="w-4 h-4" />}>
                  Save Threat
                </CyberButton>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- ALERT MODAL --- */}
      {isAlertModalOpen && editingAlert && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0B0B0E] border border-[#FF3038] rounded-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#FF3038]/30 pb-3">
              <h2 className="font-heading text-lg font-bold text-white">Publish Threat Advisory</h2>
              <button onClick={() => setIsAlertModalOpen(false)} className="text-[#A0A0A8] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAlert} className="space-y-4 text-xs font-mono">
              <div>
                <label className="block text-[#A0A0A8] mb-1 font-heading uppercase text-[10px]">Alert Headline *</label>
                <input
                  type="text"
                  required
                  value={editingAlert.title || ''}
                  onChange={e => setEditingAlert({ ...editingAlert, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#14141A] border border-white/20 text-white focus:outline-none focus:border-[#FF3038]"
                  placeholder="e.g. Critical Android Malware Campaign Spreading via WhatsApp"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#A0A0A8] mb-1 font-heading uppercase text-[10px]">Source Agency</label>
                  <input
                    type="text"
                    value={editingAlert.source || 'CERT-In'}
                    onChange={e => setEditingAlert({ ...editingAlert, source: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#14141A] border border-white/20 text-white focus:outline-none focus:border-[#FF3038]"
                  />
                </div>
                <div>
                  <label className="block text-[#A0A0A8] mb-1 font-heading uppercase text-[10px]">Severity</label>
                  <select
                    value={editingAlert.severity || 'High'}
                    onChange={e => setEditingAlert({ ...editingAlert, severity: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-lg bg-[#14141A] border border-white/20 text-white focus:outline-none focus:border-[#FF3038]"
                  >
                    <option value="Critical">Critical</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Info">Info</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[#A0A0A8] mb-1 font-heading uppercase text-[10px]">Summary *</label>
                <textarea
                  rows={3}
                  required
                  value={editingAlert.summary || ''}
                  onChange={e => setEditingAlert({ ...editingAlert, summary: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#14141A] border border-white/20 text-white focus:outline-none focus:border-[#FF3038]"
                  placeholder="Detailed threat briefing and tactical advisory..."
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-[#FF3038]/20">
                <CyberButton variant="ghost" type="button" onClick={() => setIsAlertModalOpen(false)}>
                  Cancel
                </CyberButton>
                <CyberButton variant="primary" type="submit" icon={<Save className="w-4 h-4" />}>
                  Publish Advisory
                </CyberButton>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- QUIZ MODAL --- */}
      {isQuizModalOpen && editingQuiz && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0B0B0E] border border-[#FF3038] rounded-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#FF3038]/30 pb-3">
              <h2 className="font-heading text-lg font-bold text-white">Create Quiz Question</h2>
              <button onClick={() => setIsQuizModalOpen(false)} className="text-[#A0A0A8] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveQuiz} className="space-y-4 text-xs font-mono">
              <div>
                <label className="block text-[#A0A0A8] mb-1 font-heading uppercase text-[10px]">Question Text *</label>
                <input
                  type="text"
                  required
                  value={editingQuiz.question || ''}
                  onChange={e => setEditingQuiz({ ...editingQuiz, question: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#14141A] border border-white/20 text-white focus:outline-none focus:border-[#FF3038]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#A0A0A8] mb-1 font-heading uppercase text-[10px]">Category</label>
                  <input
                    type="text"
                    value={editingQuiz.category || 'Phishing Awareness'}
                    onChange={e => setEditingQuiz({ ...editingQuiz, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#14141A] border border-white/20 text-white focus:outline-none focus:border-[#FF3038]"
                  />
                </div>
                <div>
                  <label className="block text-[#A0A0A8] mb-1 font-heading uppercase text-[10px]">Difficulty Level</label>
                  <select
                    value={editingQuiz.level || 'Beginner'}
                    onChange={e => setEditingQuiz({ ...editingQuiz, level: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#14141A] border border-white/20 text-white focus:outline-none focus:border-[#FF3038]"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[#A0A0A8] mb-1 font-heading uppercase text-[10px]">Options (One per line)</label>
                <textarea
                  rows={4}
                  required
                  value={quizOptionsStr}
                  onChange={e => setQuizOptionsStr(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#14141A] border border-white/20 text-white focus:outline-none focus:border-[#FF3038]"
                />
              </div>

              <div>
                <label className="block text-[#A0A0A8] mb-1 font-heading uppercase text-[10px]">Correct Option Index (0 = 1st, 1 = 2nd...)</label>
                <input
                  type="number"
                  min={0}
                  max={3}
                  value={editingQuiz.correct_index ?? 0}
                  onChange={e => setEditingQuiz({ ...editingQuiz, correct_index: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-lg bg-[#14141A] border border-white/20 text-white focus:outline-none focus:border-[#FF3038]"
                />
              </div>

              <div>
                <label className="block text-[#A0A0A8] mb-1 font-heading uppercase text-[10px]">Explanation</label>
                <textarea
                  rows={2}
                  value={editingQuiz.explanation || ''}
                  onChange={e => setEditingQuiz({ ...editingQuiz, explanation: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#14141A] border border-white/20 text-white focus:outline-none focus:border-[#FF3038]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-[#FF3038]/20">
                <CyberButton variant="ghost" type="button" onClick={() => setIsQuizModalOpen(false)}>
                  Cancel
                </CyberButton>
                <CyberButton variant="primary" type="submit" icon={<Save className="w-4 h-4" />}>
                  Save Question
                </CyberButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
