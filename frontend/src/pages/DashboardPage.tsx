import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import {
  User,
  ShieldCheck,
  Award,
  Bookmark,
  CheckCircle2,
  Lock,
  ArrowRight,
  TrendingUp,
  Clock,
  Sparkles,
  LifeBuoy
} from 'lucide-react';
import { api } from '../services/api';
import { DashboardSummary } from '../types';
import { useAuth } from '../context/AuthContext';
import { NeonCard } from '../components/common/NeonCard';
import { CyberButton } from '../components/common/CyberButton';
import { Badge } from '../components/common/Badge';

export const DashboardPage: React.FC = () => {
  const { user, logout } = useAuth();
  const [dashboard, setDashboard] = useState<DashboardSummary | null>(null);
  const [savedArticles, setSavedArticles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    const fetchDashboard = async () => {
      setIsLoading(true);
      try {
        const res = await api.getUserDashboard();
        setDashboard(res);
        const savedRes = await api.getSavedArticles();
        setSavedArticles(savedRes.saved_articles);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboard();
  }, [user]);

  if (!user) {
    return (
      <div className="max-w-md mx-auto py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-[#101014] border border-[#FF3038] flex items-center justify-center text-[#FF3038] mx-auto shadow-[0_0_20px_rgba(255,48,56,0.3)]">
          <User className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-heading font-black uppercase text-white tracking-wide">
          User Dashboard
        </h2>
        <p className="text-xs text-[#A0A0A8] leading-relaxed">
          Sign in to save your cyber awareness score, track completed simulations, view quiz history, and bookmark threat articles.
        </p>
        <div className="pt-2">
          <p className="text-xs font-mono text-emerald-400">
            Note: All educational sections, tools, and simulations can be explored freely without an account.
          </p>
        </div>
      </div>
    );
  }

  const score = dashboard?.awareness_score || user.awareness_score || 0;
  const tier = dashboard?.tier || 'Awareness Cadet';

  return (
    <div className="space-y-8 pb-16">
      {/* Header Profile Banner */}
      <div className="p-6 md:p-8 rounded-2xl bg-[#101014] border border-[#FF3038]/50 shadow-[0_0_30px_rgba(255,48,56,0.2)] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-[#08080C] border-2 border-[#FF3038] flex items-center justify-center text-[#FF3038] shadow-[0_0_15px_#FF3038]">
            <ShieldCheck className="w-9 h-9" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-heading font-black uppercase text-white tracking-wide">
                {user.username}
              </h1>
              <Badge variant="red">{tier}</Badge>
            </div>
            <p className="text-xs text-[#A0A0A8] font-mono mt-0.5">{user.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-xs font-mono text-[#A0A0A8]">Awareness Score</p>
            <p className="text-3xl font-black font-display-badge text-[#FF5555]">
              {score} <span className="text-xs text-white">PTS</span>
            </p>
          </div>
          <CyberButton variant="ghost" size="sm" onClick={logout}>
            Sign Out
          </CyberButton>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <NeonCard className="p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#08080C] border border-[#FF3038]/40 flex items-center justify-center text-[#FF3038]">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-bold font-display-badge text-white">
              {dashboard?.avg_quiz_score ? `${dashboard.avg_quiz_score}%` : '0%'}
            </p>
            <p className="text-xs font-heading uppercase text-[#FF5555] font-semibold">Average Quiz Score</p>
          </div>
        </NeonCard>

        <NeonCard className="p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#08080C] border border-[#FF3038]/40 flex items-center justify-center text-[#FF3038]">
            <Bookmark className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-bold font-display-badge text-white">
              {savedArticles.length}
            </p>
            <p className="text-xs font-heading uppercase text-[#FF5555] font-semibold">Saved Threat Guides</p>
          </div>
        </NeonCard>

        <NeonCard className="p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#08080C] border border-[#FF3038]/40 flex items-center justify-center text-[#FF3038]">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-bold font-display-badge text-white">
              {dashboard?.simulations_completed?.length || 0}
            </p>
            <p className="text-xs font-heading uppercase text-[#FF5555] font-semibold">Simulations Cleared</p>
          </div>
        </NeonCard>
      </div>

      {/* Saved Articles List */}
      <div className="bg-[#101014] border border-[#FF3038]/30 rounded-2xl p-6 md:p-8 space-y-4">
        <h3 className="font-heading font-bold text-lg uppercase text-white flex items-center gap-2">
          <Bookmark className="w-5 h-5 text-[#FF3038]" />
          Bookmarked Threat Articles ({savedArticles.length})
        </h3>
        {savedArticles.length === 0 ? (
          <p className="text-xs text-[#A0A0A8]">
            No articles bookmarked yet. Browse the Threat Library and click "Save" on topics you want to review.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {savedArticles.map((s, idx) => (
              <NavLink
                key={idx}
                to={`/threats/${s.threat.slug}`}
                className="p-3.5 rounded-xl bg-[#08080C] border border-white/10 hover:border-[#FF3038] text-xs flex items-center justify-between group transition"
              >
                <div>
                  <p className="font-semibold text-white group-hover:text-[#FF5555]">
                    {s.threat.name}
                  </p>
                  <p className="text-[11px] text-[#A0A0A8] truncate mt-0.5">{s.threat.short_desc}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-[#A0A0A8] group-hover:translate-x-1 transition shrink-0 ml-2" />
              </NavLink>
            ))}
          </div>
        )}
      </div>

      {/* Quiz History */}
      {dashboard?.quiz_history && dashboard.quiz_history.length > 0 && (
        <div className="bg-[#101014] border border-[#FF3038]/30 rounded-2xl p-6 md:p-8 space-y-4">
          <h3 className="font-heading font-bold text-lg uppercase text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#FF3038]" />
            Recent Quiz Attempts
          </h3>
          <div className="space-y-2">
            {dashboard.quiz_history.map((att: any, idx: number) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-[#08080C] border border-white/10 flex items-center justify-between text-xs"
              >
                <div>
                  <p className="font-semibold text-white">{att.category} ({att.level})</p>
                  <p className="text-[11px] text-[#666672]">{att.completed_at?.slice(0, 10)}</p>
                </div>
                <span className="font-mono font-bold text-[#FF5555]">
                  {att.score}/{att.max_score} ({att.percentage}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
