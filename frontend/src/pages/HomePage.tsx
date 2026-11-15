import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  ShieldAlert,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  Wrench,
  Sparkles,
  Flame,
  LifeBuoy,
  RefreshCw,
  Lock,
  Globe,
  Camera,
  CreditCard,
  Radio,
  FileCheck2,
  Users,
  Cpu,
  Smartphone,
  Eye,
  KeyRound,
  ExternalLink
} from 'lucide-react';
import { api } from '../services/api';
import { Threat } from '../types';
import { NeonCard } from '../components/common/NeonCard';
import { CyberButton } from '../components/common/CyberButton';
import { Badge } from '../components/common/Badge';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    threat_topics: 14,
    categories: 7,
    security_tools: 8,
    learning_quizzes: 12,
    simulations_available: 6,
  });
  const [featuredThreats, setFeaturedThreats] = useState<Threat[]>([]);
  const [tipIndex, setTipIndex] = useState(0);

  // Daily Cyber Tips pool
  const dailyTips = [
    {
      title: 'The UPI Golden Rule',
      content: 'You NEVER need to enter your UPI PIN or scan a QR code to RECEIVE money. Entering your PIN always sends money OUT of your bank account.',
      category: 'Financial Safety',
    },
    {
      title: 'Spotting Double File Extensions',
      content: 'Windows hides file extensions by default. A file named "document.pdf.exe" may appear as "document.pdf" but execute malicious trojan code when clicked.',
      category: 'Malware Defense',
    },
    {
      title: 'Digital Arrest is 100% Fake',
      content: 'No law enforcement agency in India (Police, CBI, ED, Customs) conducts investigations, arrests, or demands money transfers over Skype or WhatsApp video calls.',
      category: 'Scam Awareness',
    },
    {
      title: 'Webcam Physical Slider Guarantee',
      content: 'A physical sliding camera cover provides 100% optical safety against zero-day webcam spyware, even if software permissions are somehow bypassed.',
      category: 'Privacy Protection',
    },
    {
      title: 'Passphrase Entropy',
      content: 'A 4-word passphrase like "Dancing-Blue-Elephant-99!" takes millions of years to brute-force on modern GPU rigs, compared to minutes for "P@ssword2026".',
      category: 'Account Security',
    },
  ];

  useEffect(() => {
    // Fetch live platform stats & featured threats
    const loadData = async () => {
      try {
        const statsRes = await api.getThreatStats();
        setStats(statsRes);
        const threatsRes = await api.getFeaturedThreats();
        setFeaturedThreats(threatsRes.featured);
      } catch (err) {
        console.error('Failed to fetch home data', err);
      }
    };
    loadData();
  }, []);

  // Icon mapper helper
  const getThreatIcon = (slug: string) => {
    switch (slug) {
      case 'phishing': return Globe;
      case 'ransomware': return Lock;
      case 'upi-scams': return CreditCard;
      case 'camera-privacy-risks': return Camera;
      case 'sim-swapping': return Smartphone;
      case 'password-attacks': return KeyRound;
      case 'pretexting': return Users;
      case 'rogue-access-points': return Radio;
      case 'digital-arrest-scams': return ShieldAlert;
      case 'spyware': return Eye;
      case 'credential-stuffing': return KeyRound;
      case 'deepfake-scams': return Cpu;
      default: return AlertTriangle;
    }
  };

  return (
    <div className="space-y-16 pb-12">
      {/* 1. HERO SECTION */}
      <section className="relative pt-6 pb-12 md:py-16 text-center space-y-6">
        {/* Neon Status Beacon */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#101014] border border-[#FF3038]/40 shadow-[0_0_15px_rgba(255,48,56,0.25)] text-xs font-mono">
          <span className="w-2 h-2 rounded-full bg-[#FF3038] animate-ping" />
          <span className="text-[#FF5555] font-semibold tracking-wider uppercase">
            REDLINE DEFENSE NETWORK
          </span>
          <span className="text-[#A0A0A8]">• Cyber Safety Ecosystem</span>
        </div>

        {/* Main Heading */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black font-heading tracking-wider uppercase text-white max-w-4xl mx-auto leading-tight drop-shadow-[0_2px_15px_rgba(0,0,0,0.8)]">
          THE DIGITAL WORLD IS <br />
          <span className="text-[#FF3038] neon-text-glow">FULL OF THREATS.</span>
        </h1>

        {/* Supporting Text */}
        <p className="text-base sm:text-lg text-[#A0A0A8] max-w-2xl mx-auto leading-relaxed">
          Understand cyber risks, identify suspicious activities and protect your digital life with one unified cybersecurity platform.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <CyberButton
            variant="primary"
            size="lg"
            icon={<ShieldAlert className="w-5 h-5" />}
            onClick={() => navigate('/threats')}
          >
            Explore Threats
          </CyberButton>

          <CyberButton
            variant="secondary"
            size="lg"
            icon={<Wrench className="w-5 h-5" />}
            onClick={() => navigate('/tools')}
          >
            Open Security Tools
          </CyberButton>

          <CyberButton
            variant="outline"
            size="lg"
            icon={<LifeBuoy className="w-5 h-5" />}
            onClick={() => navigate('/emergency')}
          >
            Emergency Help
          </CyberButton>
        </div>

        {/* Core Tagline Pill */}
        <div className="pt-6">
          <p className="font-mono text-xs uppercase tracking-widest text-[#FF5555]/80">
            "Understand the Threat. Recognize the Risk. Protect Yourself."
          </p>
        </div>
      </section>

      {/* 2. PLATFORM STATISTICS BAR */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Threat Topics', value: stats.threat_topics, icon: AlertTriangle, desc: 'Detailed educational guides' },
          { label: 'Learning Categories', value: stats.categories, icon: ShieldCheck, desc: 'Organized threat taxonomy' },
          { label: 'Security Tools', value: stats.security_tools, icon: Wrench, desc: 'Functional checking utilities' },
          { label: 'Active Quizzes', value: stats.learning_quizzes, icon: Sparkles, desc: 'Interactive skill tests' },
        ].map((item, idx) => {
          const Icon = item.icon;
          return (
            <NeonCard key={idx} className="p-3.5 sm:p-5 flex items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#08080C] border border-[#FF3038]/40 flex items-center justify-center text-[#FF3038] shadow-[0_0_12px_rgba(255,48,56,0.2)] shrink-0">
                <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="min-w-0">
                <p className="text-xl sm:text-2xl lg:text-3xl font-black font-display-badge text-white">
                  {item.value}
                </p>
                <p className="text-[11px] sm:text-xs font-heading font-semibold text-[#FF5555] uppercase tracking-wide truncate">
                  {item.label}
                </p>
                <p className="text-[10px] sm:text-[11px] text-[#A0A0A8] truncate mt-0.5">{item.desc}</p>
              </div>
            </NeonCard>
          );
        })}
      </section>

      {/* 3. CYBER AWARENESS CENTER (Daily Tip, Common Scam, Alert Ticker) */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Daily Tip */}
        <NeonCard className="p-6 flex flex-col justify-between" glow>
          <div>
            <div className="flex items-center justify-between mb-4">
              <Badge variant="red" pulse>
                Daily Cyber Safety Tip
              </Badge>
              <button
                onClick={() => setTipIndex((tipIndex + 1) % dailyTips.length)}
                className="text-[#A0A0A8] hover:text-[#FF3038] transition p-1"
                title="Shuffle Tip"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
            <h3 className="text-lg font-heading font-bold text-white mb-2">
              {dailyTips[tipIndex].title}
            </h3>
            <p className="text-sm text-[#A0A0A8] leading-relaxed">
              {dailyTips[tipIndex].content}
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-[#FF3038]/20 flex items-center justify-between text-xs font-mono text-[#A0A0A8]">
            <span>Category: {dailyTips[tipIndex].category}</span>
            <span className="text-[#FF5555] font-semibold">Tip {tipIndex + 1}/{dailyTips.length}</span>
          </div>
        </NeonCard>

        {/* Common Scam Awareness Spotlight */}
        <NeonCard className="p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Flame className="w-5 h-5 text-[#FF3038]" />
              <h3 className="text-sm font-heading font-bold uppercase tracking-wider text-white">
                Scam Spotlight: Digital Arrest Fraud
              </h3>
            </div>
            <p className="text-xs text-[#A0A0A8] leading-relaxed mb-3">
              Organized syndicates pose as Mumbai Police or CBI on video calls, claiming parcels contain narcotics and placing victims under fake "video detention".
            </p>
            <div className="p-2.5 rounded-lg bg-[#07070A] border border-[#FF3038]/30 text-xs font-mono text-[#FF5555]">
              🚨 FACT: Indian law enforcement NEVER arrests citizens over WhatsApp or Skype.
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-[#FF3038]/20 flex items-center justify-between">
            <span className="text-xs font-mono text-[#A0A0A8]">Helpline: 1930</span>
            <NavLink
              to="/india-safety"
              className="text-xs font-heading font-bold uppercase tracking-wider text-[#FF5555] hover:text-white flex items-center gap-1"
            >
              Learn More <ArrowRight className="w-3.5 h-3.5" />
            </NavLink>
          </div>
        </NeonCard>

        {/* Emergency Shortcut Card */}
        <NeonCard className="p-6 flex flex-col justify-between bg-gradient-to-br from-[#101014] to-[#25080B] border-[#FF3038]">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <LifeBuoy className="w-5 h-5 text-[#FF5555] animate-pulse" />
              <h3 className="text-sm font-heading font-bold uppercase tracking-wider text-white">
                Facing an Active Cyber Emergency?
              </h3>
            </div>
            <p className="text-xs text-[#A0A0A8] leading-relaxed mb-3">
              Did you accidentally share an OTP, click a deceptive link, or make a fraudulent payment? Access step-by-step containment checklists immediately.
            </p>
            <div className="space-y-1.5 text-xs text-[#F5F5F5]">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF3038]" />
                <span>Action within 2 hours ("Golden Window")</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF3038]" />
                <span>Bank freeze protocols & evidence capture</span>
              </div>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-[#FF3038]/30">
            <CyberButton
              variant="danger"
              size="sm"
              className="w-full"
              onClick={() => navigate('/emergency')}
            >
              Open Emergency Triage
            </CyberButton>
          </div>
        </NeonCard>
      </section>

      {/* 4. INTERACTIVE THREAT OVERVIEW (12 Required Threat Cards) */}
      <section className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <p className="text-xs font-mono uppercase tracking-widest text-[#FF5555]">
              Core Threat Taxonomy
            </p>
            <h2 className="text-2xl sm:text-3xl font-black font-heading tracking-wide uppercase text-white mt-1">
              Top Cyber Risks & Attack Vectors
            </h2>
          </div>
          <NavLink
            to="/threats"
            className="text-xs font-heading font-bold uppercase tracking-wider text-[#FF5555] hover:text-white flex items-center gap-1.5 transition self-start"
          >
            <span>View Full Threat Library (35+ Topics)</span>
            <ArrowRight className="w-4 h-4" />
          </NavLink>
        </div>

        {/* 12 Threat Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {featuredThreats.map((threat) => {
            const Icon = getThreatIcon(threat.slug);
            const riskColor =
              threat.risk_category === 'Critical'
                ? 'red'
                : threat.risk_category === 'High'
                ? 'amber'
                : 'emerald';

            return (
              <NeonCard
                key={threat.id}
                className="p-5 flex flex-col justify-between group"
                onClick={() => navigate(`/threats/${threat.slug}`)}
              >
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 rounded-lg bg-[#07070A] border border-[#FF3038]/40 flex items-center justify-center text-[#FF3038] group-hover:scale-110 group-hover:shadow-[0_0_15px_#FF3038] transition">
                      <Icon className="w-5 h-5" />
                    </div>
                    <Badge variant={riskColor}>{threat.risk_category}</Badge>
                  </div>

                  <h3 className="font-heading font-bold text-lg text-white group-hover:text-[#FF5555] transition mb-1.5">
                    {threat.name}
                  </h3>

                  <p className="text-xs text-[#A0A0A8] leading-relaxed line-clamp-3">
                    {threat.short_desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#FF3038]/20 flex items-center justify-between text-xs">
                  <span className="font-mono text-[#666672] text-[11px]">
                    {threat.difficulty}
                  </span>
                  <span className="text-[#FF5555] font-heading font-semibold uppercase tracking-wider flex items-center gap-1 group-hover:translate-x-1 transition">
                    Learn More <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </NeonCard>
            );
          })}
        </div>
      </section>

      {/* 5. SECURITY TOOLS SHOWCASE */}
      <section className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <p className="text-xs font-mono uppercase tracking-widest text-[#FF5555]">
              Genuinely Functional Utilities
            </p>
            <h2 className="text-2xl sm:text-3xl font-black font-heading tracking-wide uppercase text-white mt-1">
              Educational Security Tools
            </h2>
          </div>
          <NavLink
            to="/tools"
            className="text-xs font-heading font-bold uppercase tracking-wider text-[#FF5555] hover:text-white flex items-center gap-1.5 transition self-start"
          >
            <span>Explore All 8 Security Tools</span>
            <ArrowRight className="w-4 h-4" />
          </NavLink>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              name: 'URL Safety Checker',
              desc: 'Analyze suspicious links for lookalike domains, punycode spoofing, and insecure protocols.',
              route: '/tools/url-checker',
              icon: Globe,
              badge: 'Heuristic + Threat Intel',
            },
            {
              name: 'Password Strength Analyzer',
              desc: 'Evaluate entropy bits and GPU brute-force crack time 100% locally in your browser.',
              route: '/tools/password-analyzer',
              icon: KeyRound,
              badge: 'Zero-Transmission Private',
            },
            {
              name: 'Suspicious Message Analyzer',
              desc: 'Paste SMS or WhatsApp messages to scan for urgency patterns, OTP requests, and scam indicators.',
              route: '/tools/message-analyzer',
              icon: AlertTriangle,
              badge: 'Scam Heuristics',
            },
            {
              name: 'QR Code Safety Guide',
              desc: 'Safely decode QR code images locally to inspect raw plain text URLs and UPI traps before opening.',
              route: '/tools/qr-safety',
              icon: FileCheck2,
              badge: 'Safe Local Decoder',
            },
          ].map((tool, idx) => {
            const Icon = tool.icon;
            return (
              <NeonCard
                key={idx}
                className="p-5 flex flex-col justify-between group"
                onClick={() => navigate(tool.route)}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-lg bg-[#07070A] border border-[#FF3038]/40 flex items-center justify-center text-[#FF3038] group-hover:scale-110 transition">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[#A0A0A8]">
                      {tool.badge}
                    </span>
                  </div>
                  <h3 className="font-heading font-bold text-base text-white group-hover:text-[#FF5555] transition mb-1.5">
                    {tool.name}
                  </h3>
                  <p className="text-xs text-[#A0A0A8] leading-relaxed">
                    {tool.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#FF3038]/20 flex items-center justify-end text-xs text-[#FF5555] font-heading font-semibold uppercase tracking-wider group-hover:translate-x-1 transition">
                  Launch Tool <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </div>
              </NeonCard>
            );
          })}
        </div>
      </section>

      {/* 6. INTERACTIVE LAB & SIMULATIONS BANNER */}
      <section className="relative rounded-2xl bg-gradient-to-r from-[#101014] via-[#1A0A0E] to-[#101014] border border-[#FF3038]/40 p-8 md:p-12 overflow-hidden shadow-[0_0_30px_rgba(255,48,56,0.15)]">
        <div className="relative z-10 max-w-3xl space-y-4">
          <Badge variant="red" pulse>
            Isolated Educational Sandbox
          </Badge>
          <h2 className="text-2xl sm:text-4xl font-black font-heading uppercase text-white tracking-wide">
            Practice Cybersecurity in the <span className="text-[#FF3038]">Interactive Lab</span>
          </h2>
          <p className="text-sm sm:text-base text-[#A0A0A8] leading-relaxed">
            Test your instincts across 6 isolated simulated scenarios: inspect spoofed phishing emails, handle fake bank manager social engineering calls, simulate camera permission prompts, and solve rapid scam detection challenges with fictional data.
          </p>
          <div className="pt-2 flex flex-wrap gap-4">
            <CyberButton
              variant="primary"
              size="md"
              onClick={() => navigate('/lab')}
            >
              Enter Simulation Lab
            </CyberButton>
            <CyberButton
              variant="outline"
              size="md"
              onClick={() => navigate('/quiz')}
            >
              Take Awareness Quiz
            </CyberButton>
          </div>
        </div>
      </section>
    </div>
  );
};
