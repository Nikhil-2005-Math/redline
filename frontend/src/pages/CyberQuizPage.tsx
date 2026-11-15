import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  Award,
  CheckCircle2,
  XCircle,
  HelpCircle,
  RotateCcw,
  Sparkles,
  Download,
  Share2,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';
import { api } from '../services/api';
import { QuizQuestion, QuizSubmissionResult } from '../types';
import { NeonCard } from '../components/common/NeonCard';
import { CyberButton } from '../components/common/CyberButton';
import { Badge } from '../components/common/Badge';
import { useAuth } from '../context/AuthContext';

export const CyberQuizPage: React.FC = () => {
  const { user } = useAuth();
  const [level, setLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Beginner');
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [submissionResult, setSubmissionResult] = useState<QuizSubmissionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [certificateName, setCertificateName] = useState(user?.username || 'Cyber Defender');
  const certificateRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      setIsLoading(true);
      try {
        const res = await api.getQuizQuestions({ level });
        setQuestions(res.questions);
        setSelectedAnswers({});
        setSubmissionResult(null);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchQuestions();
  }, [level]);

  const handleSelectOption = (qId: number, optIdx: number) => {
    if (submissionResult) return;
    setSelectedAnswers((prev) => ({ ...prev, [qId]: optIdx }));
  };

  const handleSubmit = async () => {
    if (Object.keys(selectedAnswers).length < questions.length) {
      alert(`Please answer all ${questions.length} questions before submitting.`);
      return;
    }
    setIsLoading(true);
    try {
      const res = await api.submitQuiz({
        answers: selectedAnswers,
        category: 'Cyber Safety & Threat Intelligence',
        level,
      });
      setSubmissionResult(res);
      if (res.percentage >= 60) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#FF3038', '#FF5555', '#C81020', '#FFFFFF'],
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedAnswers({});
    setSubmissionResult(null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#101014] border border-[#FF3038]/30 text-xs font-mono text-[#FF5555] mb-2">
          <Award className="w-3.5 h-3.5" />
          <span>CYBER DEFENSE ACCREDITATION</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black font-heading uppercase text-white tracking-wide">
          Cyber Awareness <span className="text-[#FF3038]">Quiz</span>
        </h1>
        <p className="text-sm text-[#A0A0A8] max-w-2xl mt-1">
          Challenge your threat-detection abilities across Beginner, Intermediate, and Advanced tiers to earn points, awareness badges, and your Certificate of Completion.
        </p>
      </div>

      {/* Level Selection Pills */}
      <div className="flex gap-3">
        {(['Beginner', 'Intermediate', 'Advanced'] as const).map((l) => (
          <button
            key={l}
            onClick={() => setLevel(l)}
            className={`flex-1 py-3 px-4 rounded-xl font-heading text-xs uppercase tracking-wider font-bold border transition ${
              level === l
                ? 'bg-[#FF3038] text-white border-[#FF3038] shadow-[0_0_15px_rgba(255,48,56,0.4)]'
                : 'bg-[#101014] text-[#A0A0A8] border-[#FF3038]/20 hover:text-white hover:border-[#FF3038]/50'
            }`}
          >
            {l} Level
          </button>
        ))}
      </div>

      {/* Quiz Stream */}
      {isLoading && !submissionResult ? (
        <div className="py-20 text-center text-[#A0A0A8]">
          <div className="w-8 h-8 border-2 border-[#FF3038] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="font-mono text-xs uppercase">Loading Skill Evaluation Module...</p>
        </div>
      ) : questions.length === 0 ? (
        <div className="py-16 text-center text-[#A0A0A8] bg-[#101014] rounded-2xl border border-white/10 p-8">
          <p>No questions currently available for this tier.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {questions.map((q, qIdx) => {
            const selectedOpt = selectedAnswers[q.id];
            const detail = submissionResult?.details.find((d) => d.question_id === q.id);

            return (
              <div
                key={q.id}
                className="bg-[#101014] border border-[#FF3038]/30 rounded-2xl p-6 md:p-8 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-[#FF5555]">
                    Question {qIdx + 1} of {questions.length} • {q.category}
                  </span>
                  {detail && (
                    <Badge variant={detail.is_correct ? 'emerald' : 'red'}>
                      {detail.is_correct ? 'Correct (+10 pts)' : 'Incorrect'}
                    </Badge>
                  )}
                </div>

                <h3 className="font-heading font-bold text-base sm:text-lg text-white">
                  {q.question}
                </h3>

                <div className="space-y-2.5">
                  {q.options.map((opt, optIdx) => {
                    const isSelected = selectedOpt === optIdx;
                    let style = 'bg-[#08080C] border-white/10 text-[#D0D0D8] hover:border-white/30';

                    if (detail) {
                      if (detail.correct_index === optIdx) {
                        style = 'bg-emerald-950/40 border-emerald-500 text-emerald-300';
                      } else if (isSelected && !detail.is_correct) {
                        style = 'bg-red-950/40 border-red-500 text-red-300';
                      }
                    } else if (isSelected) {
                      style = 'bg-[#FF3038]/20 border-[#FF3038] text-white shadow-[0_0_10px_rgba(255,48,56,0.3)]';
                    }

                    return (
                      <button
                        key={optIdx}
                        disabled={!!submissionResult}
                        onClick={() => handleSelectOption(q.id, optIdx)}
                        className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm font-medium transition flex items-center justify-between ${style}`}
                      >
                        <span>{opt}</span>
                        {detail && detail.correct_index === optIdx && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 ml-2" />
                        )}
                        {detail && isSelected && !detail.is_correct && (
                          <XCircle className="w-4 h-4 text-red-400 shrink-0 ml-2" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {detail && (
                  <div className="p-4 rounded-xl bg-[#08080C] border border-[#FF3038]/30 text-xs space-y-1">
                    <p className="font-heading font-bold uppercase text-[#FF5555]">Explanation:</p>
                    <p className="text-[#A0A0A8] leading-relaxed">{detail.explanation}</p>
                  </div>
                )}
              </div>
            );
          })}

          {/* Action Button */}
          {!submissionResult ? (
            <div className="flex justify-end pt-2">
              <CyberButton
                variant="primary"
                size="lg"
                onClick={handleSubmit}
                disabled={Object.keys(selectedAnswers).length < questions.length}
              >
                Submit Answers ({Object.keys(selectedAnswers).length}/{questions.length})
              </CyberButton>
            </div>
          ) : (
            <div className="space-y-6 pt-4">
              {/* Results Banner */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-[#101014] to-[#200B0E] border border-[#FF3038] flex flex-col sm:flex-row items-center justify-between gap-6 shadow-[0_0_30px_rgba(255,48,56,0.25)]">
                <div>
                  <Badge variant="red" size="md">
                    {submissionResult.badge}
                  </Badge>
                  <h2 className="text-2xl sm:text-3xl font-black font-heading uppercase text-white mt-2">
                    Score: {submissionResult.score} / {submissionResult.total} ({submissionResult.percentage}%)
                  </h2>
                  <p className="text-xs text-[#A0A0A8] mt-1">
                    Earned +{submissionResult.points_awarded} Cyber Awareness Points!
                  </p>
                </div>
                <CyberButton variant="secondary" size="md" onClick={handleReset}>
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Retake Tier
                </CyberButton>
              </div>

              {/* CERTIFICATE OF COMPLETION (Rendered if score >= 60%) */}
              {submissionResult.percentage >= 60 && (
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h3 className="font-heading font-bold text-lg uppercase text-white flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-[#FF5555]" />
                      Official Certificate of Cyber Awareness
                    </h3>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={certificateName}
                        onChange={(e) => setCertificateName(e.target.value)}
                        placeholder="Your Full Name"
                        className="px-3 py-1.5 rounded-lg bg-[#07070A] border border-[#FF3038]/40 text-xs text-white placeholder-[#666672] font-mono"
                      />
                      <button
                        onClick={() => window.print()}
                        className="px-3 py-1.5 rounded-lg bg-[#FF3038] text-white text-xs font-heading font-semibold uppercase flex items-center gap-1.5"
                      >
                        <Download className="w-3.5 h-3.5" />
                        Print / Save
                      </button>
                    </div>
                  </div>

                  {/* Certificate Graphic Card */}
                  <div
                    ref={certificateRef}
                    className="p-4 sm:p-8 md:p-12 rounded-2xl bg-[#08080C] border-2 sm:border-4 border-[#FF3038] text-center space-y-4 sm:space-y-6 shadow-[0_0_40px_rgba(255,48,56,0.25)] relative overflow-hidden"
                  >
                    <div className="space-y-1">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#101014] border border-[#FF3038] flex items-center justify-center text-[#FF3038] mx-auto shadow-[0_0_15px_#FF3038]">
                        <ShieldCheck className="w-6 h-6 sm:w-7 sm:h-7" />
                      </div>
                      <p className="font-display-badge text-lg sm:text-xl font-black tracking-widest text-white mt-2">
                        RED<span className="text-[#FF3038]">LINE</span>
                      </p>
                      <p className="text-[9px] sm:text-[10px] font-mono tracking-widest text-[#FF5555] uppercase">
                        Cyber Safety & Threat Intelligence Ecosystem
                      </p>
                    </div>

                    <div className="space-y-1.5 sm:space-y-2">
                      <p className="font-mono text-[11px] sm:text-xs uppercase text-[#A0A0A8]">
                        This certifies that
                      </p>
                      <h2 className="text-xl sm:text-3xl md:text-4xl font-heading font-bold text-white uppercase tracking-wider underline decoration-[#FF3038] decoration-2 underline-offset-8 break-words px-2">
                        {certificateName || 'Certified Operator'}
                      </h2>
                    </div>

                    <p className="text-xs sm:text-sm text-[#D0D0D8] max-w-lg mx-auto leading-relaxed px-2">
                      has successfully demonstrated mastery of digital threat recognition, phishing defense, credential security, and incident response at the{' '}
                      <strong className="text-white">{level} Tier</strong> with a passing score of{' '}
                      <strong className="text-emerald-400">{submissionResult.percentage}%</strong>.
                    </p>

                    <div className="pt-4 sm:pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] sm:text-[11px] font-mono text-[#666672]">
                      <span>Credential ID: RL-{Date.now().toString().slice(-8)}</span>
                      <span>Verified: {new Date().toLocaleDateString()}</span>
                      <span className="text-[#FF5555]">Status: ACCREDITED</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
