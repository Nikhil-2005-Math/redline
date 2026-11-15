import React, { useState, useEffect } from 'react';
import { useParams, NavLink, useNavigate } from 'react-router-dom';
import {
  ShieldAlert,
  ArrowLeft,
  Bookmark,
  Share2,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  ShieldCheck,
  LifeBuoy,
  ChevronRight,
  ExternalLink,
  BookOpen,
  Eye,
  Check,
  X
} from 'lucide-react';
import { api } from '../services/api';
import { Threat } from '../types';
import { NeonCard } from '../components/common/NeonCard';
import { Badge } from '../components/common/Badge';
import { CyberButton } from '../components/common/CyberButton';
import { useAuth } from '../context/AuthContext';

export const ThreatDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [threat, setThreat] = useState<Threat | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Quiz state
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<Record<number, boolean>>({});

  useEffect(() => {
    const fetchDetail = async () => {
      if (!slug) return;
      setIsLoading(true);
      setError('');
      try {
        const res = await api.getThreatDetail(slug);
        setThreat(res.threat);
        setSelectedAnswers({});
        setQuizSubmitted({});
      } catch (err: any) {
        setError(err.message || 'Failed to load threat intelligence page.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchDetail();
  }, [slug]);

  const handleBookmark = async () => {
    if (!threat) return;
    if (!user) {
      alert('Please sign in to save articles to your profile!');
      return;
    }
    try {
      const res = await api.toggleSaveArticle(threat.id);
      setIsBookmarked(res.saved);
    } catch (err) {
      console.error(err);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleOptionSelect = (qIdx: number, optIdx: number) => {
    if (quizSubmitted[qIdx]) return;
    setSelectedAnswers(prev => ({ ...prev, [qIdx]: optIdx }));
  };

  const handleCheckAnswer = (qIdx: number) => {
    setQuizSubmitted(prev => ({ ...prev, [qIdx]: true }));
  };

  if (isLoading) {
    return (
      <div className="py-24 text-center">
        <div className="w-10 h-10 border-2 border-[#FF3038] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="font-mono text-xs uppercase tracking-widest text-[#FF5555]">
          Decrypting Threat Intelligence File...
        </p>
      </div>
    );
  }

  if (error || !threat || !threat.content) {
    return (
      <div className="py-16 text-center max-w-lg mx-auto bg-[#101014] border border-[#FF3038]/30 rounded-2xl p-8">
        <AlertTriangle className="w-12 h-12 text-[#FF3038] mx-auto mb-4" />
        <h2 className="text-xl font-heading font-bold text-white mb-2">Threat Intelligence Record Not Found</h2>
        <p className="text-xs text-[#A0A0A8] mb-6">
          The requested security topic could not be located in our repository.
        </p>
        <CyberButton variant="secondary" onClick={() => navigate('/threats')}>
          Return to Threat Library
        </CyberButton>
      </div>
    );
  }

  const { content } = threat;
  const riskColor =
    threat.risk_category === 'Critical'
      ? 'red'
      : threat.risk_category === 'High'
      ? 'amber'
      : 'emerald';

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-16">
      {/* Top Breadcrumb & Action bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          onClick={() => navigate('/threats')}
          className="flex items-center gap-2 text-xs font-mono text-[#A0A0A8] hover:text-white transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Threat Library</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleBookmark}
            className={`p-2 rounded-lg border text-xs flex items-center gap-1.5 transition ${
              isBookmarked
                ? 'bg-[#FF3038]/20 border-[#FF3038] text-[#FF5555]'
                : 'bg-[#101014] border-[#FF3038]/30 text-[#A0A0A8] hover:text-white'
            }`}
            title="Bookmark Threat"
          >
            <Bookmark className="w-4 h-4" />
            <span className="hidden sm:inline">{isBookmarked ? 'Saved' : 'Save'}</span>
          </button>

          <button
            onClick={handleShare}
            className="p-2 rounded-lg bg-[#101014] border border-[#FF3038]/30 text-[#A0A0A8] hover:text-white text-xs flex items-center gap-1.5 transition"
            title="Copy URL"
          >
            {copiedLink ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            <span className="hidden sm:inline">{copiedLink ? 'Copied' : 'Share'}</span>
          </button>
        </div>
      </div>

      {/* Main Threat Header Card */}
      <div className="relative rounded-2xl bg-[#101014] border border-[#FF3038]/50 p-6 md:p-8 shadow-[0_0_30px_rgba(255,48,56,0.2)]">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <Badge variant="cyan">{threat.category_name}</Badge>
          <Badge variant={riskColor}>{threat.risk_category} Risk</Badge>
          <span className="text-xs font-mono text-[#A0A0A8] bg-white/5 px-2.5 py-0.5 rounded border border-white/10">
            Level: {threat.difficulty}
          </span>
          <span className="text-xs font-mono text-[#666672] ml-auto flex items-center gap-1">
            <Eye className="w-3.5 h-3.5" /> {threat.views_count} Reads
          </span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black font-heading uppercase text-white tracking-wide">
          {threat.name}
        </h1>
        <p className="text-sm sm:text-base text-[#A0A0A8] mt-3 leading-relaxed">
          {threat.short_desc}
        </p>

        {/* Quick Emergency Banner if Critical */}
        {threat.risk_category === 'Critical' && (
          <div className="mt-6 p-4 rounded-xl bg-[#C81020]/15 border border-[#FF3038] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-white">
              <LifeBuoy className="w-4 h-4 text-[#FF5555] animate-pulse" />
              <span>Are you currently affected by a {threat.name} incident?</span>
            </div>
            <CyberButton
              variant="danger"
              size="sm"
              onClick={() => navigate('/emergency')}
            >
              Open Recovery Checklist
            </CyberButton>
          </div>
        )}
      </div>

      {/* 10 STRUCTURED SECTIONS */}
      <div className="space-y-8">
        {/* Section 1: What is this threat? */}
        <section className="bg-[#101014] border border-[#FF3038]/25 rounded-2xl p-6 md:p-8 space-y-3">
          <div className="flex items-center gap-2.5 text-[#FF5555]">
            <BookOpen className="w-5 h-5" />
            <h2 className="font-heading font-bold text-xl uppercase tracking-wider text-white">
              1. What is this Threat?
            </h2>
          </div>
          <p className="text-sm sm:text-base text-[#D0D0D8] leading-relaxed">
            {content.what_is}
          </p>
        </section>

        {/* Section 2: How does it work? */}
        <section className="bg-[#101014] border border-[#FF3038]/25 rounded-2xl p-6 md:p-8 space-y-3">
          <div className="flex items-center gap-2.5 text-[#FF5555]">
            <ShieldAlert className="w-5 h-5" />
            <h2 className="font-heading font-bold text-xl uppercase tracking-wider text-white">
              2. How Does It Work?
            </h2>
          </div>
          <p className="text-sm sm:text-base text-[#D0D0D8] leading-relaxed">
            {content.how_it_works}
          </p>
        </section>

        {/* Section 3: Real-World Examples */}
        <section className="bg-[#101014] border border-[#FF3038]/25 rounded-2xl p-6 md:p-8 space-y-4">
          <h2 className="font-heading font-bold text-xl uppercase tracking-wider text-white flex items-center gap-2.5">
            <span className="text-[#FF5555]">3.</span> Real-World Scenarios & Attacks
          </h2>
          <div className="grid grid-cols-1 gap-3">
            {content.real_world_examples.map((eg, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-[#08080C] border border-white/10 text-xs sm:text-sm text-[#D0D0D8] flex items-start gap-3"
              >
                <div className="w-6 h-6 rounded-full bg-[#FF3038]/20 border border-[#FF3038]/50 flex items-center justify-center text-[#FF5555] font-mono text-xs shrink-0 mt-0.5">
                  {idx + 1}
                </div>
                <p className="leading-relaxed">{eg}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 4: Common Warning Signs / Red Flags */}
        <section className="bg-[#101014] border border-[#FF3038]/25 rounded-2xl p-6 md:p-8 space-y-4">
          <h2 className="font-heading font-bold text-xl uppercase tracking-wider text-white flex items-center gap-2.5">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            <span>4. Common Warning Signs & Red Flags</span>
          </h2>
          <div className="space-y-2.5">
            {content.warning_signs.map((sign, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-[#15151B] border border-amber-500/30 flex items-start gap-3 text-xs sm:text-sm text-[#E0E0E8]"
              >
                <span className="text-amber-400 font-bold shrink-0 mt-0.5">⚠️</span>
                <p className="leading-relaxed">{sign}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 5 & 6: Who is Affected & Potential Consequences */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <section className="bg-[#101014] border border-[#FF3038]/25 rounded-2xl p-6 space-y-3">
            <h3 className="font-heading font-bold text-lg uppercase tracking-wider text-white">
              5. Who Can Be Affected?
            </h3>
            <p className="text-xs sm:text-sm text-[#A0A0A8] leading-relaxed">
              {content.who_affected}
            </p>
          </section>

          <section className="bg-[#101014] border border-[#FF3038]/25 rounded-2xl p-6 space-y-3">
            <h3 className="font-heading font-bold text-lg uppercase tracking-wider text-[#FF5555]">
              6. Potential Consequences
            </h3>
            <p className="text-xs sm:text-sm text-[#A0A0A8] leading-relaxed">
              {content.consequences}
            </p>
          </section>
        </div>

        {/* Section 7: Prevention Methods */}
        <section className="bg-[#101014] border border-[#FF3038]/25 rounded-2xl p-6 md:p-8 space-y-4">
          <h2 className="font-heading font-bold text-xl uppercase tracking-wider text-white flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span>7. Prevention Methods & Best Practices</span>
          </h2>
          <div className="space-y-2.5">
            {content.prevention.map((prev, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-[#0B150F] border border-emerald-500/30 flex items-start gap-3 text-xs sm:text-sm text-[#D8EED8]"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <p className="leading-relaxed">{prev}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 8: What To Do If Affected */}
        <section className="bg-gradient-to-br from-[#101014] to-[#200B0E] border border-[#FF3038] rounded-2xl p-6 md:p-8 space-y-4 shadow-[0_0_20px_rgba(255,48,56,0.15)]">
          <div className="flex items-center justify-between">
            <h2 className="font-heading font-bold text-xl uppercase tracking-wider text-white flex items-center gap-2.5">
              <LifeBuoy className="w-5 h-5 text-[#FF5555] animate-pulse" />
              <span>8. What To Do If Affected (Immediate Recovery)</span>
            </h2>
            <Badge variant="red">Emergency Plan</Badge>
          </div>
          <div className="space-y-3">
            {content.what_to_do.map((step, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-[#09090C] border border-[#FF3038]/30 flex items-start gap-3 text-xs sm:text-sm text-white"
              >
                <span className="w-5 h-5 rounded-full bg-[#FF3038] text-white font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <p className="leading-relaxed">{step}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 9: Related Threats */}
        {content.related_threats && content.related_threats.length > 0 && (
          <section className="bg-[#101014] border border-[#FF3038]/25 rounded-2xl p-6 space-y-3">
            <h3 className="font-heading font-bold text-lg uppercase tracking-wider text-white">
              9. Related Cyber Threats
            </h3>
            <div className="flex flex-wrap gap-2 pt-1">
              {content.related_threats.map((relSlug, idx) => (
                <NavLink
                  key={idx}
                  to={`/threats/${relSlug}`}
                  className="px-3 py-1.5 rounded-lg bg-[#07070A] border border-[#FF3038]/40 hover:border-[#FF3038] text-xs font-mono text-[#FF5555] hover:text-white transition flex items-center gap-1.5"
                >
                  <span>{relSlug.replace(/-/g, ' ').toUpperCase()}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </NavLink>
              ))}
            </div>
          </section>
        )}

        {/* Section 10: Interactive Knowledge-Check Question */}
        {content.quiz && content.quiz.length > 0 && (
          <section className="bg-[#101014] border border-[#FF3038]/40 rounded-2xl p-6 md:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-[#FF3038]/20 pb-3">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-[#FF3038]" />
                <h2 className="font-heading font-bold text-xl uppercase tracking-wider text-white">
                  10. Knowledge Check
                </h2>
              </div>
              <Badge variant="red">Interactive Test</Badge>
            </div>

            {content.quiz.map((q, qIdx) => {
              const hasAnswered = quizSubmitted[qIdx];
              const selectedOpt = selectedAnswers[qIdx];

              return (
                <div key={qIdx} className="space-y-4">
                  <p className="font-heading font-semibold text-base text-white">
                    {q.question}
                  </p>

                  <div className="space-y-2">
                    {q.options.map((opt, optIdx) => {
                      const isSelected = selectedOpt === optIdx;
                      const isCorrect = q.correct_index === optIdx;

                      let btnStyle = 'bg-[#08080C] border-white/10 text-[#D0D0D8] hover:border-white/30';
                      if (hasAnswered) {
                        if (isCorrect) {
                          btnStyle = 'bg-emerald-950/40 border-emerald-500 text-emerald-300';
                        } else if (isSelected && !isCorrect) {
                          btnStyle = 'bg-red-950/40 border-red-500 text-red-300';
                        }
                      } else if (isSelected) {
                        btnStyle = 'bg-[#FF3038]/20 border-[#FF3038] text-white';
                      }

                      return (
                        <button
                          key={optIdx}
                          disabled={hasAnswered}
                          onClick={() => handleOptionSelect(qIdx, optIdx)}
                          className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm font-medium transition flex items-center justify-between ${btnStyle}`}
                        >
                          <span>{opt}</span>
                          {hasAnswered && isCorrect && (
                            <Check className="w-4 h-4 text-emerald-400 shrink-0 ml-2" />
                          )}
                          {hasAnswered && isSelected && !isCorrect && (
                            <X className="w-4 h-4 text-red-400 shrink-0 ml-2" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {!hasAnswered && selectedOpt !== undefined && (
                    <CyberButton
                      variant="primary"
                      size="sm"
                      onClick={() => handleCheckAnswer(qIdx)}
                    >
                      Check Answer
                    </CyberButton>
                  )}

                  {hasAnswered && (
                    <div className="p-4 rounded-xl bg-[#08080C] border border-[#FF3038]/30 space-y-1 text-xs">
                      <p className="font-heading font-bold uppercase tracking-wider text-[#FF5555]">
                        Explanation & Insight:
                      </p>
                      <p className="text-[#A0A0A8] leading-relaxed">{q.explanation}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </section>
        )}
      </div>
    </div>
  );
};
