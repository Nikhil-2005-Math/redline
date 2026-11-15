import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Wrench,
  Globe,
  KeyRound,
  MessageSquareWarning,
  MailCheck,
  QrCode,
  FileCode2,
  Sliders,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  Copy,
  ExternalLink,
  Upload,
  RefreshCw,
  Eye,
  EyeOff,
  Camera,
  Mic,
  MapPin,
  Smartphone,
  Laptop
} from 'lucide-react';
import jsQR from 'jsqr';
import { api } from '../services/api';
import { URLAnalysisResult, MessageAnalysisResult, EmailHeaderAnalysisResult } from '../types';
import { NeonCard } from '../components/common/NeonCard';
import { CyberButton } from '../components/common/CyberButton';
import { Badge } from '../components/common/Badge';

export const SecurityToolsPage: React.FC = () => {
  const { toolSlug } = useParams<{ toolSlug?: string }>();
  const navigate = useNavigate();

  const activeTab = toolSlug || 'url-checker';

  const tools = [
    { slug: 'url-checker', name: 'URL Safety Checker', icon: Globe, badge: 'Heuristic + Threat Intel' },
    { slug: 'password-analyzer', name: 'Password Analyzer', icon: KeyRound, badge: '100% Client-Side' },
    { slug: 'message-analyzer', name: 'Suspicious Message Analyzer', icon: MessageSquareWarning, badge: 'Scam Heuristics' },
    { slug: 'email-inspector', name: 'Email Security Inspector', icon: MailCheck, badge: 'SPF / DKIM / DMARC' },
    { slug: 'qr-safety', name: 'QR Code Safety Guide', icon: QrCode, badge: 'Local QR Decoder' },
    { slug: 'file-inspector', name: 'File Security Awareness', icon: FileCode2, badge: 'Double-Extension Audit' },
    { slug: 'permission-guide', name: 'Privacy & Permissions', icon: Sliders, badge: 'OS Guides' },
    { slug: 'browser-privacy', name: 'Browser Privacy Audit', icon: ShieldCheck, badge: 'Live Client Audit' },
  ];

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#101014] border border-[#FF3038]/30 text-xs font-mono text-[#FF5555] mb-2">
          <Wrench className="w-3.5 h-3.5" />
          <span>CYBER DEFENSE UTILITY SUITE</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black font-heading uppercase text-white tracking-wide">
          Security <span className="text-[#FF3038]">Tools</span>
        </h1>
        <p className="text-sm text-[#A0A0A8] max-w-3xl mt-1">
          Genuinely functional educational tools to inspect suspicious links, evaluate password entropy, detect scam language, decode QR codes safely, and audit device permissions.
        </p>
      </div>

      {/* Tools Tabs Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#FF3038]/20 scrollbar-none">
        {tools.map((t) => {
          const Icon = t.icon;
          const isActive = activeTab === t.slug;
          return (
            <button
              key={t.slug}
              onClick={() => navigate(`/tools/${t.slug}`)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-heading uppercase tracking-wider font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-[#FF3038] text-white shadow-[0_0_15px_rgba(255,48,56,0.4)]'
                  : 'bg-[#101014] text-[#A0A0A8] border border-[#FF3038]/20 hover:border-[#FF3038]/60 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{t.name}</span>
            </button>
          );
        })}
      </div>

      {/* Tool Content Panels */}
      <div>
        {activeTab === 'url-checker' && <ToolUrlChecker />}
        {activeTab === 'password-analyzer' && <ToolPasswordAnalyzer />}
        {activeTab === 'message-analyzer' && <ToolMessageAnalyzer />}
        {activeTab === 'email-inspector' && <ToolEmailInspector />}
        {activeTab === 'qr-safety' && <ToolQrSafety />}
        {activeTab === 'file-inspector' && <ToolFileInspector />}
        {activeTab === 'permission-guide' && <ToolPermissionGuide />}
        {activeTab === 'browser-privacy' && <ToolBrowserPrivacy />}
      </div>
    </div>
  );
};

/* ========================================================
   TOOL 1: URL SAFETY CHECKER
======================================================== */
const ToolUrlChecker: React.FC = () => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<URLAnalysisResult | null>(null);
  const [error, setError] = useState('');

  const sampleUrls = [
    'https://secure-login.paypa1-update.com/signin?ref=bank',
    'http://192.168.1.55/sbi-kyc-update.html',
    'https://www.google.com',
    'http://xn--pypal-4ve.com/account/security',
  ];

  const handleAnalyze = async (targetUrl?: string) => {
    const toCheck = targetUrl || url;
    if (!toCheck.trim()) {
      setError('Please enter a web address to inspect.');
      return;
    }
    setError('');
    setIsLoading(true);
    setResult(null);

    try {
      const res = await api.analyzeUrl(toCheck.trim());
      setResult(res);
    } catch (err: any) {
      setError(err.message || 'Inspection failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div className="bg-[#101014] border border-[#FF3038]/40 rounded-2xl p-6 md:p-8 space-y-5">
        <div>
          <h2 className="text-xl font-heading font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Globe className="w-5 h-5 text-[#FF3038]" />
            URL Safety & Threat Checker
          </h2>
          <p className="text-xs text-[#A0A0A8] mt-1">
            Detects homograph deception (Punycode), lookalike brand spoofing, direct IP hostnames, unencrypted HTTP protocols, and known malicious patterns.
          </p>
        </div>

        {/* Input Box */}
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter URL to check (e.g. paypa1-security.com, http://...)"
            className="flex-1 px-4 py-2.5 rounded-xl bg-[#07070A] border border-[#FF3038]/40 focus:border-[#FF3038] text-sm text-white placeholder-[#666672] focus:outline-none transition font-mono"
          />
          <CyberButton
            variant="primary"
            size="md"
            isLoading={isLoading}
            onClick={() => handleAnalyze()}
          >
            Check URL
          </CyberButton>
        </div>

        {/* Sample URLs */}
        <div className="pt-2">
          <p className="text-xs font-mono text-[#A0A0A8] mb-1.5">Try sample URLs for testing:</p>
          <div className="flex flex-wrap gap-2">
            {sampleUrls.map((s, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setUrl(s);
                  handleAnalyze(s);
                }}
                className="text-[11px] font-mono px-2.5 py-1 rounded bg-white/5 border border-white/10 hover:border-[#FF3038] hover:text-[#FF5555] transition text-[#A0A0A8] truncate max-w-xs"
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/40 text-xs text-red-300">
            {error}
          </div>
        )}
      </div>

      {/* Results View */}
      {result && (
        <div className="bg-[#101014] border border-[#FF3038]/40 rounded-2xl p-6 md:p-8 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#FF3038]/20">
            <div>
              <p className="text-xs font-mono text-[#A0A0A8]">Inspection Target:</p>
              <p className="font-mono text-sm text-white font-semibold break-all">{result.url}</p>
            </div>
            <div className="text-right">
              <Badge
                variant={
                  result.risk_level === 'High Risk'
                    ? 'red'
                    : result.risk_level === 'Moderate Risk'
                    ? 'amber'
                    : 'emerald'
                }
                size="md"
              >
                {result.status}
              </Badge>
              <p className="text-xs font-mono text-[#A0A0A8] mt-1">
                Risk Score: {result.score}/100
              </p>
            </div>
          </div>

          {/* Breakdown of findings */}
          <div className="space-y-3">
            <h3 className="font-heading font-semibold text-sm uppercase text-[#FF5555]">
              Diagnostic Findings & Indicators ({result.findings.length})
            </h3>
            {result.findings.length === 0 ? (
              <p className="text-xs text-[#A0A0A8]">No suspicious heuristic patterns detected in this URL.</p>
            ) : (
              result.findings.map((f, idx) => (
                <div
                  key={idx}
                  className={`p-3.5 rounded-xl border text-xs space-y-1 ${
                    f.severity === 'Critical' || f.severity === 'High'
                      ? 'bg-red-950/30 border-red-500/40 text-red-200'
                      : f.severity === 'Medium'
                      ? 'bg-amber-950/30 border-amber-500/40 text-amber-200'
                      : 'bg-white/5 border-white/10 text-[#D0D0D8]'
                  }`}
                >
                  <div className="flex items-center justify-between font-bold">
                    <span>{f.type}</span>
                    <span className="font-mono text-[10px] uppercase px-1.5 py-0.2 rounded bg-black/40">
                      {f.severity}
                    </span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-[#A0A0A8]">{f.description}</p>
                </div>
              ))
            )}
          </div>

          {/* Important Security Disclaimer */}
          <div className="p-4 rounded-xl bg-[#07070A] border border-amber-500/30 text-xs text-amber-300 leading-relaxed space-y-1">
            <p className="font-heading font-bold uppercase tracking-wider text-amber-400">
              ⚠️ MANDATORY SAFETY NOTICE:
            </p>
            <p>{result.disclaimer}</p>
          </div>
        </div>
      )}
    </div>
  );
};

/* ========================================================
   TOOL 2: PASSWORD STRENGTH ANALYZER
======================================================== */
const ToolPasswordAnalyzer: React.FC = () => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Local evaluation purely in browser memory
  const evaluatePassword = (pwd: string) => {
    if (!pwd) {
      return { score: 0, entropy: 0, crackTime: 'Instant', label: 'None', tips: [] };
    }

    let charsetSize = 0;
    if (/[a-z]/.test(pwd)) charsetSize += 26;
    if (/[A-Z]/.test(pwd)) charsetSize += 26;
    if (/[0-9]/.test(pwd)) charsetSize += 10;
    if (/[^a-zA-Z0-9]/.test(pwd)) charsetSize += 33;

    // Shannon Entropy estimation
    const entropy = Math.round(pwd.length * (Math.log2(charsetSize || 1)));

    // Crack time estimation at 10 billion guesses/sec
    const combinations = Math.pow(charsetSize || 1, pwd.length);
    const seconds = combinations / (10 * 1e9);

    let crackTime = 'Instantly';
    if (seconds > 31536000 * 1000) crackTime = `${Math.round(seconds / (31536000 * 1000))} Thousand Years`;
    else if (seconds > 31536000) crackTime = `${Math.round(seconds / 31536000)} Years`;
    else if (seconds > 86400) crackTime = `${Math.round(seconds / 86400)} Days`;
    else if (seconds > 3600) crackTime = `${Math.round(seconds / 3600)} Hours`;
    else if (seconds > 60) crackTime = `${Math.round(seconds / 60)} Minutes`;
    else if (seconds > 1) crackTime = `${Math.round(seconds)} Seconds`;

    const tips: string[] = [];
    if (pwd.length < 12) tips.push('Increase length to at least 12-16 characters.');
    if (!/[A-Z]/.test(pwd)) tips.push('Add uppercase characters.');
    if (!/[0-9]/.test(pwd)) tips.push('Include numbers.');
    if (!/[^a-zA-Z0-9]/.test(pwd)) tips.push('Include special symbols (!@#$%^&*).');
    if (/password|123456|qwerty|admin/i.test(pwd)) tips.push('Avoid common dictionary patterns and keyboard sequences.');

    let label = 'Very Weak';
    let color = 'text-red-500';
    if (entropy >= 80 && pwd.length >= 14) {
      label = 'Cryptographically Excellent';
      color = 'text-emerald-400';
    } else if (entropy >= 60 && pwd.length >= 10) {
      label = 'Strong';
      color = 'text-cyan-400';
    } else if (entropy >= 40) {
      label = 'Moderate';
      color = 'text-amber-400';
    }

    return {
      score: Math.min(Math.round((entropy / 85) * 100), 100),
      entropy,
      crackTime,
      label,
      color,
      tips,
      hasLower: /[a-z]/.test(pwd),
      hasUpper: /[A-Z]/.test(pwd),
      hasNumber: /[0-9]/.test(pwd),
      hasSymbol: /[^a-zA-Z0-9]/.test(pwd),
    };
  };

  const analysis = evaluatePassword(password);

  return (
    <div className="max-w-3xl space-y-6">
      <div className="bg-[#101014] border border-[#FF3038]/40 rounded-2xl p-6 md:p-8 space-y-6">
        <div>
          <h2 className="text-xl font-heading font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <KeyRound className="w-5 h-5 text-[#FF3038]" />
            Password Strength & Entropy Analyzer
          </h2>
          <p className="text-xs text-[#A0A0A8] mt-1">
            Calculates mathematical entropy bits and estimated brute-force GPU cracking time.
          </p>
        </div>

        {/* Zero-storage Privacy Guarantee Notice */}
        <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/40 text-xs text-emerald-300 flex items-center gap-2.5 font-mono">
          <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>
            100% PRIVATE: This evaluation runs completely in your local browser sandbox. Entered passwords are NEVER stored, transmitted over the network, or logged anywhere.
          </span>
        </div>

        {/* Password Input */}
        <div>
          <label className="block text-xs font-mono uppercase text-[#A0A0A8] mb-2">
            Test Password or Passphrase:
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Type a password to test locally (e.g. Correct-Horse-Battery-99!)"
              className="w-full pl-4 pr-12 py-3 rounded-xl bg-[#07070A] border border-[#FF3038]/40 focus:border-[#FF3038] text-sm text-white placeholder-[#666672] focus:outline-none font-mono"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-3.5 text-[#A0A0A8] hover:text-white"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Metrics Grid */}
        {password && (
          <div className="space-y-4 pt-2">
            {/* Strength Meter Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-[#A0A0A8]">Security Rating: <strong className={analysis.color}>{analysis.label}</strong></span>
                <span className="text-white">{analysis.score}%</span>
              </div>
              <div className="h-2 w-full bg-[#07070A] rounded-full overflow-hidden border border-white/10">
                <div
                  className="h-full bg-gradient-to-r from-[#FF3038] via-amber-500 to-emerald-500 transition-all duration-300"
                  style={{ width: `${analysis.score}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3.5 rounded-xl bg-[#08080C] border border-white/10">
                <p className="text-[11px] font-mono text-[#A0A0A8]">Entropy Bits</p>
                <p className="text-xl font-bold font-display-badge text-white mt-0.5">
                  {analysis.entropy} bits
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#08080C] border border-white/10">
                <p className="text-[11px] font-mono text-[#A0A0A8]">GPU Crack Time</p>
                <p className="text-base sm:text-lg font-bold font-heading text-[#FF5555] mt-0.5 truncate">
                  {analysis.crackTime}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#08080C] border border-white/10 col-span-2 sm:col-span-1">
                <p className="text-[11px] font-mono text-[#A0A0A8]">Length</p>
                <p className="text-xl font-bold font-display-badge text-white mt-0.5">
                  {password.length} chars
                </p>
              </div>
            </div>

            {/* Checklist items */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-xs font-mono">
              <span className={`p-2 rounded border flex items-center gap-1.5 ${analysis.hasLower ? 'border-emerald-500/40 text-emerald-400 bg-emerald-950/20' : 'border-white/10 text-[#666672]'}`}>
                {analysis.hasLower ? '✓' : '✗'} a-z Lowercase
              </span>
              <span className={`p-2 rounded border flex items-center gap-1.5 ${analysis.hasUpper ? 'border-emerald-500/40 text-emerald-400 bg-emerald-950/20' : 'border-white/10 text-[#666672]'}`}>
                {analysis.hasUpper ? '✓' : '✗'} A-Z Uppercase
              </span>
              <span className={`p-2 rounded border flex items-center gap-1.5 ${analysis.hasNumber ? 'border-emerald-500/40 text-emerald-400 bg-emerald-950/20' : 'border-white/10 text-[#666672]'}`}>
                {analysis.hasNumber ? '✓' : '✗'} 0-9 Numbers
              </span>
              <span className={`p-2 rounded border flex items-center gap-1.5 ${analysis.hasSymbol ? 'border-emerald-500/40 text-emerald-400 bg-emerald-950/20' : 'border-white/10 text-[#666672]'}`}>
                {analysis.hasSymbol ? '✓' : '✗'} !@# Symbols
              </span>
            </div>

            {/* Improvement Recommendations */}
            {analysis.tips.length > 0 && (
              <div className="p-4 rounded-xl bg-[#08080C] border border-amber-500/30 text-xs space-y-1.5">
                <p className="font-heading font-bold uppercase text-amber-400">Improvement Suggestions:</p>
                <ul className="list-disc list-inside space-y-1 text-[#A0A0A8]">
                  {analysis.tips.map((t, idx) => (
                    <li key={idx}>{t}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

/* ========================================================
   TOOL 3: SUSPICIOUS MESSAGE ANALYZER
======================================================== */
const ToolMessageAnalyzer: React.FC = () => {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<MessageAnalysisResult | null>(null);
  const [error, setError] = useState('');

  const sampleMessages = [
    'URGENT: Your SBI bank account will be suspended tonight at 9:30 PM due to unverified PAN. Please click bit.ly/sbi-pan-kyc and share the OTP to verify.',
    'Congratulations! You have won ₹25,000 cash reward from PhonePe. Scan this QR code and type your UPI PIN to claim immediately.',
    'Dear recipient, Mumbai Police Cyber Crime branch has issued a Digital Arrest warrant for your Skype ID regarding illegal FedEx parcel. Transfer funds to safe custody.',
    'Hey Mom, are we still having dinner at 7 PM tonight?',
  ];

  const handleAnalyze = async (msgText?: string) => {
    const toAnalyze = msgText || message;
    if (!toAnalyze.trim()) {
      setError('Please paste a message body to analyze.');
      return;
    }
    setError('');
    setIsLoading(true);
    setResult(null);

    try {
      const res = await api.analyzeMessage(toAnalyze.trim());
      setResult(res);
    } catch (err: any) {
      setError(err.message || 'Analysis failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div className="bg-[#101014] border border-[#FF3038]/40 rounded-2xl p-6 md:p-8 space-y-5">
        <div>
          <h2 className="text-xl font-heading font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <MessageSquareWarning className="w-5 h-5 text-[#FF3038]" />
            Suspicious Message & Scam NLP Analyzer
          </h2>
          <p className="text-xs text-[#A0A0A8] mt-1">
            Detects artificial urgency, demands for OTPs or UPI PINs, bank/police impersonation, and deceptive links.
          </p>
        </div>

        <div>
          <textarea
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Paste suspicious SMS, WhatsApp message, or email body here..."
            className="w-full p-4 rounded-xl bg-[#07070A] border border-[#FF3038]/40 focus:border-[#FF3038] text-sm text-white placeholder-[#666672] focus:outline-none transition font-mono"
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            {sampleMessages.map((s, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setMessage(s);
                  handleAnalyze(s);
                }}
                className="text-[11px] font-mono px-2.5 py-1 rounded bg-white/5 border border-white/10 hover:border-[#FF3038] text-[#A0A0A8] hover:text-[#FF5555] transition"
              >
                Sample {idx + 1}
              </button>
            ))}
          </div>

          <CyberButton
            variant="primary"
            size="md"
            isLoading={isLoading}
            onClick={() => handleAnalyze()}
          >
            Analyze Message
          </CyberButton>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/40 text-xs text-red-300">
            {error}
          </div>
        )}
      </div>

      {result && (
        <div className="bg-[#101014] border border-[#FF3038]/40 rounded-2xl p-6 md:p-8 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#FF3038]/20">
            <div>
              <p className="text-xs font-mono text-[#A0A0A8]">Threat Assessment:</p>
              <h3 className="font-heading font-bold text-lg text-white">
                {result.risk_level}
              </h3>
            </div>
            <div className="text-right">
              <span
                className="font-display-badge text-xl font-bold px-3 py-1 rounded border font-mono"
                style={{
                  color: result.badge_color,
                  borderColor: result.badge_color,
                  backgroundColor: `${result.badge_color}20`,
                }}
              >
                Risk: {result.score}/100
              </span>
            </div>
          </div>

          {/* Red flags */}
          <div className="space-y-3">
            <h4 className="font-heading font-bold text-sm uppercase text-[#FF5555]">
              Identified Threat Indicators ({result.red_flags_count})
            </h4>
            {result.red_flags.length === 0 ? (
              <p className="text-xs text-emerald-400">No classic scam trigger patterns detected.</p>
            ) : (
              result.red_flags.map((rf, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-[#15151B] border border-red-500/30 text-xs space-y-1"
                >
                  <div className="flex items-center justify-between font-bold text-red-400">
                    <span>{rf.type}</span>
                    <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-red-950/60 border border-red-500/40">
                      Trigger: "{rf.matched_text}"
                    </span>
                  </div>
                  <p className="text-[#A0A0A8] leading-relaxed">{rf.explanation}</p>
                </div>
              ))
            )}
          </div>

          {/* Recommendations */}
          <div className="p-4 rounded-xl bg-[#07070A] border border-[#FF3038]/30 space-y-2 text-xs">
            <p className="font-heading font-bold uppercase text-[#FF5555]">Recommended Defense Steps:</p>
            <ul className="list-disc list-inside space-y-1 text-[#D0D0D8]">
              {result.recommendations.map((rec, idx) => (
                <li key={idx}>{rec}</li>
              ))}
            </ul>
          </div>

          <p className="text-[11px] font-mono text-[#666672]">{result.disclaimer}</p>
        </div>
      )}
    </div>
  );
};

/* ========================================================
   TOOL 4: EMAIL SECURITY AWARENESS & HEADER INSPECTOR
======================================================== */
const ToolEmailInspector: React.FC = () => {
  const [headers, setHeaders] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<EmailHeaderAnalysisResult | null>(null);

  const sampleHeaders = `From: "State Bank of India Support" <noreply@sbi.co.in>
Reply-To: <scam-collector@hacker-server.net>
Subject: Urgent Security Notice: Account Frozen
Authentication-Results: mx.google.com;
       spf=fail (google.com: domain of alert@sbi-updates.xyz does not designate 192.0.2.1 as permitted sender);
       dkim=fail header.i=@sbi-updates.xyz;
       dmarc=fail (p=REJECT sp=REJECT dis=NONE) header.from=sbi.co.in;`;

  const handleInspect = async () => {
    if (!headers.trim()) return;
    setIsLoading(true);
    try {
      const res = await api.inspectEmailHeaders(headers);
      setResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div className="bg-[#101014] border border-[#FF3038]/40 rounded-2xl p-6 md:p-8 space-y-5">
        <div>
          <h2 className="text-xl font-heading font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <MailCheck className="w-5 h-5 text-[#FF3038]" />
            Email Header & Authentication Inspector
          </h2>
          <p className="text-xs text-[#A0A0A8] mt-1">
            Learn how email spoofing works by analyzing RFC 5322 headers, Reply-To mismatches, and SPF/DKIM/DMARC authentication records.
          </p>
        </div>

        <div>
          <textarea
            rows={5}
            value={headers}
            onChange={(e) => setHeaders(e.target.value)}
            placeholder="Paste raw email headers here..."
            className="w-full p-4 rounded-xl bg-[#07070A] border border-[#FF3038]/40 focus:border-[#FF3038] text-xs text-white placeholder-[#666672] focus:outline-none transition font-mono"
          />
        </div>

        <div className="flex items-center justify-between gap-4">
          <button
            onClick={() => {
              setHeaders(sampleHeaders);
            }}
            className="text-xs font-mono text-[#A0A0A8] hover:text-[#FF5555] underline"
          >
            Load Spoofed Email Header Sample
          </button>

          <CyberButton
            variant="primary"
            size="md"
            isLoading={isLoading}
            onClick={handleInspect}
          >
            Inspect Headers
          </CyberButton>
        </div>
      </div>

      {result && (
        <div className="bg-[#101014] border border-[#FF3038]/40 rounded-2xl p-6 md:p-8 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#FF3038]/20">
            <div>
              <p className="text-xs font-mono text-[#A0A0A8]">Analysis Verdict:</p>
              <h3 className="font-heading font-bold text-lg text-white">{result.verdict}</h3>
            </div>
            <Badge variant={result.risk_score >= 50 ? 'red' : 'emerald'} size="md">
              Risk: {result.risk_score}/100
            </Badge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-[#08080C] border border-white/10 text-xs">
              <span className="font-mono text-[#A0A0A8]">SPF Record:</span>
              <p className={`font-bold font-mono mt-1 ${result.spf_status === 'PASS' ? 'text-emerald-400' : 'text-red-400'}`}>
                {result.spf_status}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#08080C] border border-white/10 text-xs">
              <span className="font-mono text-[#A0A0A8]">DKIM Signature:</span>
              <p className={`font-bold font-mono mt-1 ${result.dkim_status === 'PASS' ? 'text-emerald-400' : 'text-red-400'}`}>
                {result.dkim_status}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#08080C] border border-white/10 text-xs">
              <span className="font-mono text-[#A0A0A8]">DMARC Policy:</span>
              <p className={`font-bold font-mono mt-1 ${result.dmarc_status === 'PASS' ? 'text-emerald-400' : 'text-red-400'}`}>
                {result.dmarc_status}
              </p>
            </div>
          </div>

          {result.findings.map((f, idx) => (
            <div key={idx} className="p-3.5 rounded-xl bg-[#15151B] border border-red-500/30 text-xs space-y-1">
              <p className="font-bold text-red-400">{f.title}</p>
              <p className="text-[#A0A0A8] leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/* ========================================================
   TOOL 5: QR CODE SAFETY GUIDE & LOCAL DECODER
======================================================== */
const ToolQrSafety: React.FC = () => {
  const [decodedData, setDecodedData] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Local client-side canvas decoding using jsQR
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);

        if (code) {
          evaluatePayload(code.data);
        } else {
          alert('Could not detect a valid QR code in this image. Ensure the image is clear and well-lit.');
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const evaluatePayload = (data: string) => {
    setDecodedData(data);
    let type = 'Plain Text';
    let isUPI = false;
    let warning = '';
    let isHighRisk = false;

    if (data.startsWith('upi://pay')) {
      type = 'UPI Payment Request String';
      isUPI = true;
      warning = 'CRITICAL WARNING: This QR code directly initiates a UPI payment or money-collect transaction. Remember: You NEVER need to scan a QR code or enter a UPI PIN to RECEIVE money!';
      isHighRisk = true;
    } else if (data.startsWith('http://') || data.startsWith('https://')) {
      type = 'Web URL';
      warning = 'Safety Notice: Inspect the domain carefully before visiting. Do not automatically visit unknown destinations.';
    }

    setAnalysis({ type, isUPI, warning, isHighRisk });
  };

  const loadSample = (sampleType: 'upi' | 'phish') => {
    if (sampleType === 'upi') {
      evaluatePayload('upi://pay?pa=scammer99@ybl&pn=RefundOfficer&am=5000&cu=INR&tn=Cashback%20Reward');
    } else {
      evaluatePayload('https://secure-login.paypa1-update.com/account/verify');
    }
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div className="bg-[#101014] border border-[#FF3038]/40 rounded-2xl p-6 md:p-8 space-y-5">
        <div>
          <h2 className="text-xl font-heading font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <QrCode className="w-5 h-5 text-[#FF3038]" />
            QR Code Safety Guide & Local Safe Decoder
          </h2>
          <p className="text-xs text-[#A0A0A8] mt-1">
            Upload or drop a QR code image to decode it locally in your browser memory. Inspect the plain-text destination and UPI parameters safely without opening it.
          </p>
        </div>

        {/* Upload Box */}
        <div
          onClick={() => fileInputRef.current?.click()}
          className="p-8 border-2 border-dashed border-[#FF3038]/40 hover:border-[#FF3038] rounded-2xl bg-[#07070A] text-center cursor-pointer transition group"
        >
          <Upload className="w-8 h-8 text-[#FF3038] mx-auto mb-2 group-hover:scale-110 transition" />
          <p className="font-heading font-semibold text-sm text-white">Click or Drag & Drop a QR Code Image</p>
          <p className="text-xs text-[#A0A0A8] mt-1">PNG, JPG, or WEBP images decoded 100% locally on your device.</p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>

        {/* Test Samples */}
        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="text-[#A0A0A8]">Or test sample payloads:</span>
          <button
            onClick={() => loadSample('upi')}
            className="px-2.5 py-1 rounded bg-[#FF3038]/15 border border-[#FF3038]/40 text-[#FF5555] hover:bg-[#FF3038] hover:text-white transition"
          >
            Sample: UPI Money Request Trap
          </button>
          <button
            onClick={() => loadSample('phish')}
            className="px-2.5 py-1 rounded bg-white/5 border border-white/10 text-[#A0A0A8] hover:text-white transition"
          >
            Sample: Phishing URL
          </button>
        </div>
      </div>

      {decodedData && (
        <div className="bg-[#101014] border border-[#FF3038]/40 rounded-2xl p-6 md:p-8 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#FF3038]/20">
            <div>
              <p className="text-xs font-mono text-[#A0A0A8]">Detected Payload Format:</p>
              <h3 className="font-heading font-bold text-lg text-white">{analysis?.type}</h3>
            </div>
            {analysis?.isHighRisk && <Badge variant="red">High Risk Trap</Badge>}
          </div>

          <div>
            <p className="text-xs font-mono text-[#A0A0A8] mb-1.5">Decoded Plain-Text Payload (Never auto-opened):</p>
            <div className="p-3.5 rounded-xl bg-[#07070A] border border-white/10 font-mono text-xs text-[#FF5555] break-all select-all">
              {decodedData}
            </div>
          </div>

          {analysis?.warning && (
            <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/40 text-xs text-red-200 leading-relaxed space-y-1">
              <p className="font-heading font-bold text-red-400 uppercase">Analysis Warning:</p>
              <p>{analysis.warning}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

/* ========================================================
   TOOL 6: FILE SECURITY AWARENESS
======================================================== */
const ToolFileInspector: React.FC = () => {
  const [fileMeta, setFileMeta] = useState<any>(null);

  const inspectFile = (file: File) => {
    const name = file.name;
    const parts = name.split('.');
    const ext = parts.pop()?.toLowerCase() || '';
    const isDoubleExt = parts.length > 1;
    const dangerousExts = ['exe', 'scr', 'bat', 'vbs', 'apk', 'jar', 'cmd', 'ps1', 'msi'];
    const isDangerous = dangerousExts.includes(ext);

    setFileMeta({
      name: file.name,
      size: `${(file.size / 1024).toFixed(1)} KB`,
      mimeType: file.type || 'Unknown MIME',
      extension: ext,
      isDoubleExt,
      isDangerous,
      fakeExt: isDoubleExt ? parts[parts.length - 1] : null,
    });
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div className="bg-[#101014] border border-[#FF3038]/40 rounded-2xl p-6 md:p-8 space-y-5">
        <div>
          <h2 className="text-xl font-heading font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <FileCode2 className="w-5 h-5 text-[#FF3038]" />
            File Security & Metadata Inspection
          </h2>
          <p className="text-xs text-[#A0A0A8] mt-1">
            Safe client-side metadata inspection. Identifies deceptive double extensions (e.g. invoice.pdf.exe) and explains safe sandbox scanning with VirusTotal without running dangerous code.
          </p>
        </div>

        <div className="p-8 border-2 border-dashed border-[#FF3038]/40 rounded-2xl bg-[#07070A] text-center">
          <input
            type="file"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) inspectFile(file);
            }}
            className="block w-full text-xs text-[#A0A0A8] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border file:border-[#FF3038]/40 file:bg-[#101014] file:text-white file:font-heading file:cursor-pointer"
          />
        </div>
      </div>

      {fileMeta && (
        <div className="bg-[#101014] border border-[#FF3038]/40 rounded-2xl p-6 md:p-8 space-y-5">
          <h3 className="font-heading font-bold text-lg text-white">Metadata Analysis Report</h3>
          <div className="grid grid-cols-2 gap-3 text-xs font-mono">
            <div className="p-3 rounded-lg bg-[#07070A] border border-white/10">
              <span className="text-[#A0A0A8]">File Name:</span>
              <p className="text-white mt-1 break-all">{fileMeta.name}</p>
            </div>
            <div className="p-3 rounded-lg bg-[#07070A] border border-white/10">
              <span className="text-[#A0A0A8]">Real Extension:</span>
              <p className="text-[#FF5555] font-bold mt-1">.{fileMeta.extension}</p>
            </div>
          </div>

          {fileMeta.isDoubleExt && (
            <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-500 text-xs text-red-200">
              🚨 Double Extension Detected: This file may appear as a harmless .{fileMeta.fakeExt} to the user while actually being an executable .{fileMeta.extension} program.
            </div>
          )}

          <div className="p-4 rounded-xl bg-[#07070A] border border-[#FF3038]/30 text-xs space-y-2">
            <p className="font-heading font-bold text-white uppercase">Safe Malware Scanning Recommendation:</p>
            <p className="text-[#A0A0A8]">
              To scan this file against 70+ antivirus engines without running it on your computer, compute its hash or upload it directly to VirusTotal (virustotal.com).
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

/* ========================================================
   TOOL 7: PRIVACY & PERMISSION GUIDE
======================================================== */
const ToolPermissionGuide: React.FC = () => {
  const [platform, setPlatform] = useState<'android' | 'windows' | 'browser'>('android');

  return (
    <div className="max-w-3xl space-y-6">
      <div className="bg-[#101014] border border-[#FF3038]/40 rounded-2xl p-6 md:p-8 space-y-6">
        <div>
          <h2 className="text-xl font-heading font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Sliders className="w-5 h-5 text-[#FF3038]" />
            Privacy & Device Permission Review Guide
          </h2>
          <p className="text-xs text-[#A0A0A8] mt-1">
            Interactive guide on how to audit and revoke unauthorized camera, microphone, location, and background privileges across Android, Windows, and Web Browsers.
          </p>
        </div>

        {/* Platform Selector */}
        <div className="flex gap-2">
          {[
            { id: 'android', label: 'Android Phone', icon: Smartphone },
            { id: 'windows', label: 'Windows PC', icon: Laptop },
            { id: 'browser', label: 'Web Browser', icon: Globe },
          ].map((p) => {
            const Icon = p.icon;
            return (
              <button
                key={p.id}
                onClick={() => setPlatform(p.id as any)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-heading text-xs uppercase tracking-wider font-semibold border transition ${
                  platform === p.id
                    ? 'bg-[#FF3038] text-white border-[#FF3038]'
                    : 'bg-[#07070A] text-[#A0A0A8] border-[#FF3038]/20 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{p.label}</span>
              </button>
            );
          })}
        </div>

        {/* Step-by-step instructions */}
        <div className="space-y-4 pt-2">
          {platform === 'android' && (
            <div className="space-y-3 text-xs text-[#D0D0D8]">
              <div className="p-4 rounded-xl bg-[#08080C] border border-white/10 space-y-2">
                <p className="font-heading font-bold text-sm text-[#FF5555] uppercase">
                  1. How to Review Camera & Microphone Permissions:
                </p>
                <p>Open <strong>Settings</strong> &gt; <strong>Privacy</strong> &gt; <strong>Permission Manager</strong>.</p>
                <p>Tap on <strong>Camera</strong> or <strong>Microphone</strong> to view all apps with active access. Revoke permissions for any app that has no legitimate need (e.g. calculator, flashlight, wallpaper).</p>
              </div>

              <div className="p-4 rounded-xl bg-[#08080C] border border-white/10 space-y-2">
                <p className="font-heading font-bold text-sm text-[#FF5555] uppercase">
                  2. Watch for Status Bar Indicators:
                </p>
                <p>On Android 12+, a green dot appears in the top right corner whenever your camera or microphone is being accessed by an active application.</p>
              </div>
            </div>
          )}

          {platform === 'windows' && (
            <div className="space-y-3 text-xs text-[#D0D0D8]">
              <div className="p-4 rounded-xl bg-[#08080C] border border-white/10 space-y-2">
                <p className="font-heading font-bold text-sm text-[#FF5555] uppercase">
                  1. Windows Camera & Mic Settings:
                </p>
                <p>Press <strong>Win + I</strong> &gt; <strong>Privacy & security</strong> &gt; <strong>Camera</strong> / <strong>Microphone</strong>.</p>
                <p>Toggle off "Let desktop apps access your camera" for individual unneeded applications.</p>
              </div>
            </div>
          )}

          {platform === 'browser' && (
            <div className="space-y-3 text-xs text-[#D0D0D8]">
              <div className="p-4 rounded-xl bg-[#08080C] border border-white/10 space-y-2">
                <p className="font-heading font-bold text-sm text-[#FF5555] uppercase">
                  1. Chrome & Edge Site Permissions:
                </p>
                <p>Click the <strong>Settings / Tune icon</strong> immediately to the left of the URL in the address bar. Set Camera, Mic, and Location to <strong>Block</strong> or <strong>Reset Permissions</strong>.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* ========================================================
   TOOL 8: BROWSER PRIVACY AWARENESS (LIVE CLIENT AUDIT)
======================================================== */
const ToolBrowserPrivacy: React.FC = () => {
  const [audit, setAudit] = useState<any>({
    userAgent: navigator.userAgent,
    screenResolution: `${window.screen.width} x ${window.screen.height}`,
    cookiesEnabled: navigator.cookieEnabled ? 'Enabled' : 'Disabled',
    doNotTrack: navigator.doNotTrack === '1' ? 'Active' : 'Not Set',
    language: navigator.language,
    isHttps: window.location.protocol === 'https:',
  });

  return (
    <div className="max-w-3xl space-y-6">
      <div className="bg-[#101014] border border-[#FF3038]/40 rounded-2xl p-6 md:p-8 space-y-6">
        <div>
          <h2 className="text-xl font-heading font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#FF3038]" />
            Live Client Browser Privacy Audit
          </h2>
          <p className="text-xs text-[#A0A0A8] mt-1">
            Audits information exposed by your browser to websites, distinguishing between normal browser APIs and tracking vectors.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
          <div className="p-3.5 rounded-xl bg-[#07070A] border border-white/10">
            <span className="text-[#A0A0A8]">Connection Protocol:</span>
            <p className={`font-bold mt-1 ${audit.isHttps ? 'text-emerald-400' : 'text-red-400'}`}>
              {audit.isHttps ? 'HTTPS Encrypted' : 'HTTP Unencrypted'}
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#07070A] border border-white/10">
            <span className="text-[#A0A0A8]">Do Not Track / GPC:</span>
            <p className="font-bold text-white mt-1">{audit.doNotTrack}</p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#07070A] border border-white/10">
            <span className="text-[#A0A0A8]">Screen Resolution:</span>
            <p className="text-white mt-1">{audit.screenResolution}</p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#07070A] border border-white/10">
            <span className="text-[#A0A0A8]">Cookies Allowed:</span>
            <p className="text-white mt-1">{audit.cookiesEnabled}</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#08080C] border border-[#FF3038]/30 text-xs text-[#A0A0A8] space-y-2">
          <p className="font-heading font-bold uppercase text-white">Browser Fingerprinting Insight:</p>
          <p className="leading-relaxed">
            Websites combine your screen resolution, installed fonts, WebGL canvas render hash, and user agent string to identify you without cookies. To minimize fingerprinting, use privacy-focused browsers like Brave, Tor, or Firefox with Strict Tracking Protection.
          </p>
        </div>
      </div>
    </div>
  );
};
