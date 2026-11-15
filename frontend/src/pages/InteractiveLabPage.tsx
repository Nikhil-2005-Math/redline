import React, { useState } from 'react';
import {
  FlaskConical,
  Mail,
  Users,
  Camera,
  KeyRound,
  Wifi,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
  RefreshCw,
  Send,
  EyeOff,
  Globe,
  Radio,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { NeonCard } from '../components/common/NeonCard';
import { CyberButton } from '../components/common/CyberButton';
import { Badge } from '../components/common/Badge';

export const InteractiveLabPage: React.FC = () => {
  const [activeSim, setActiveSim] = useState<'phishing' | 'social' | 'camera' | 'password' | 'wifi' | 'scam-speed'>('phishing');

  const simList = [
    { id: 'phishing', label: 'Sim A: Phishing Inspector', icon: Mail, desc: 'Spot red flags on a fake bank email' },
    { id: 'social', label: 'Sim B: Social Engineering Chat', icon: Users, desc: 'Handle a manipulative fake bank manager' },
    { id: 'camera', label: 'Sim C: Camera Permission Trap', icon: Camera, desc: 'Simulated deceptive permission prompts' },
    { id: 'password', label: 'Sim D: Password Cracker Lab', icon: KeyRound, desc: 'Visual brute-force GPU comparison' },
    { id: 'wifi', label: 'Sim E: Public Wi-Fi Sniffing', icon: Wifi, desc: 'Plaintext HTTP vs TLS/HTTPS packets' },
    { id: 'scam-speed', label: 'Sim F: Scam Detection Challenge', icon: ShieldCheck, desc: 'Rapid classification speed test' },
  ];

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#101014] border border-[#FF3038]/30 text-xs font-mono text-[#FF5555] mb-2">
          <FlaskConical className="w-3.5 h-3.5" />
          <span>ISOLATED SIMULATION LABORATORY</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black font-heading uppercase text-white tracking-wide">
          Interactive <span className="text-[#FF3038]">Cyber Lab</span>
        </h1>
        <p className="text-sm text-[#A0A0A8] max-w-3xl mt-1">
          Practice spotting cyber attacks in a 100% safe, fictional simulation sandbox. No real credentials or hardware permissions are ever requested or collected.
        </p>
      </div>

      {/* Simulation Selector Tabs */}
      <div className="flex overflow-x-auto pb-2 scrollbar-none sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {simList.map((s) => {
          const Icon = s.icon;
          const isActive = activeSim === s.id;
          return (
            <button
              key={s.id}
              onClick={() => setActiveSim(s.id as any)}
              className={`p-3 sm:p-3.5 rounded-xl border text-left flex flex-col justify-between shrink-0 min-w-[150px] sm:min-w-0 transition-all ${
                isActive
                  ? 'bg-[#FF3038] text-white border-[#FF3038] shadow-[0_0_15px_rgba(255,48,56,0.4)]'
                  : 'bg-[#101014] text-[#A0A0A8] border-[#FF3038]/20 hover:border-[#FF3038]/60 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5 mb-2 shrink-0" />
              <div>
                <p className="font-heading font-bold text-xs uppercase tracking-wide leading-tight">{s.label}</p>
                <p className={`text-[10px] mt-1 line-clamp-1 ${isActive ? 'text-white/80' : 'text-[#666672]'}`}>
                  {s.desc}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Simulation View */}
      <div>
        {activeSim === 'phishing' && <SimulationPhishing />}
        {activeSim === 'social' && <SimulationSocialEngineering />}
        {activeSim === 'camera' && <SimulationCameraPermission />}
        {activeSim === 'password' && <SimulationPasswordCracker />}
        {activeSim === 'wifi' && <SimulationPublicWifi />}
        {activeSim === 'scam-speed' && <SimulationScamSpeedTest />}
      </div>
    </div>
  );
};

/* ========================================================
   SIMULATION A: PHISHING AWARENESS
======================================================== */
const SimulationPhishing: React.FC = () => {
  const [clickedElements, setClickedElements] = useState<Record<string, boolean>>({});

  const redFlags = [
    {
      id: 'sender',
      label: 'Mismatched Sender Email',
      desc: 'The display name says "HDFC Bank Alert", but the actual RFC address is "security-notice@hdfc-verify-portal.top". Official banks in India use @hdfcbank.com.',
    },
    {
      id: 'urgency',
      label: 'Extreme Panic / Urgency Tactic',
      desc: '"Account will be suspended in 2 hours" is an emotional lever used to panic victims into acting without thinking.',
    },
    {
      id: 'greeting',
      label: 'Generic Anonymous Greeting',
      desc: 'Real banks always address you by your full official registered name, not "Dear Customer" or "Valued Client".',
    },
    {
      id: 'button-link',
      label: 'Deceptive Hyperlink URL',
      desc: 'Hovering reveals the button directs to "http://192.168.1.100/login.php" rather than the verified HDFC netbanking domain.',
    },
  ];

  const toggleFlag = (id: string) => {
    setClickedElements((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const foundCount = Object.values(clickedElements).filter(Boolean).length;

  return (
    <div className="max-w-4xl space-y-6">
      <div className="bg-[#101014] border border-[#FF3038]/40 rounded-2xl p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-heading font-bold text-white uppercase tracking-wider">
              Simulation A: Phishing Email Inspection
            </h2>
            <p className="text-xs text-[#A0A0A8]">
              Click on the suspicious elements inside this fake email inbox to spot all 4 red flags.
            </p>
          </div>
          <Badge variant={foundCount === 4 ? 'emerald' : 'amber'} size="md">
            Identified: {foundCount}/4 Red Flags
          </Badge>
        </div>

        {/* Fake Email Client Window */}
        <div className="rounded-xl border border-white/10 bg-[#07070A] overflow-hidden shadow-2xl">
          {/* Email Toolbar */}
          <div className="bg-[#101014] px-4 py-2.5 border-b border-white/10 flex items-center justify-between text-xs text-[#A0A0A8]">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
              <span className="font-mono ml-2 text-[11px]">Inbox • Urgent Notification</span>
            </div>
            <span className="font-mono text-[11px]">Fictional Simulation</span>
          </div>

          {/* Email Header Info */}
          <div className="p-4 border-b border-white/10 space-y-2 text-xs">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="text-[#A0A0A8]">From: </span>
                <button
                  onClick={() => toggleFlag('sender')}
                  className={`font-mono text-left break-all max-w-full px-2 py-1 rounded border transition ${
                    clickedElements['sender']
                      ? 'bg-red-950/60 border-red-500 text-red-300'
                      : 'bg-white/5 border-white/10 text-white hover:border-[#FF3038]'
                  }`}
                >
                  "HDFC Bank Alert" &lt;security-notice@hdfc-verify-portal.top&gt; 🔍
                </button>
              </div>
              <span className="font-mono text-[#666672]">Today, 10:42 AM</span>
            </div>

            <div>
              <span className="text-[#A0A0A8]">Subject: </span>
              <button
                onClick={() => toggleFlag('urgency')}
                className={`font-semibold text-left break-words max-w-full px-2 py-1 rounded border transition ${
                  clickedElements['urgency']
                    ? 'bg-red-950/60 border-red-500 text-red-300'
                    : 'bg-white/5 border-white/10 text-white hover:border-[#FF3038]'
                }`}
              >
                URGENT: Your NetBanking Access Will Be Suspended Within 2 Hours! 🔍
              </button>
            </div>
          </div>

          {/* Email Body */}
          <div className="p-6 space-y-4 text-xs sm:text-sm text-[#D0D0D8]">
            <p>
              <button
                onClick={() => toggleFlag('greeting')}
                className={`font-semibold px-2 py-0.5 rounded border transition ${
                  clickedElements['greeting']
                    ? 'bg-red-950/60 border-red-500 text-red-300'
                    : 'bg-white/5 border-white/10 text-white hover:border-[#FF3038]'
                }`}
              >
                Dear Valued Customer, 🔍
              </button>
            </p>

            <p className="leading-relaxed">
              Our automated fraud monitoring system has placed a temporary security freeze on your account due to an unverified PAN Card linkage. To prevent permanent deactivation, you must verify your identity immediately.
            </p>

            <div className="py-2 text-center">
              <button
                onClick={() => toggleFlag('button-link')}
                className={`px-6 py-2.5 rounded-lg font-heading font-bold text-xs uppercase tracking-wider border transition ${
                  clickedElements['button-link']
                    ? 'bg-red-950/80 border-red-500 text-red-300 shadow-[0_0_15px_red]'
                    : 'bg-blue-600 hover:bg-blue-700 text-white border-blue-500'
                }`}
              >
                VERIFY ACCOUNT NOW (http://192.168.1.100/login.php) 🔍
              </button>
            </div>

            <p className="text-[11px] text-[#A0A0A8] text-center">
              Failure to update within 120 minutes will result in permanent branch suspension.
            </p>
          </div>
        </div>

        {/* Explanations List */}
        <div className="space-y-3 pt-3">
          <h3 className="font-heading font-bold text-sm uppercase text-[#FF5555]">
            Red Flag Explanations ({foundCount}/4 Discovered):
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {redFlags.map((flag) => {
              const isFound = clickedElements[flag.id];
              return (
                <div
                  key={flag.id}
                  className={`p-3.5 rounded-xl border text-xs space-y-1 transition ${
                    isFound
                      ? 'bg-red-950/30 border-red-500/50 text-red-200'
                      : 'bg-[#07070A] border-white/10 text-[#666672]'
                  }`}
                >
                  <p className="font-heading font-bold flex items-center gap-1.5">
                    {isFound ? '✅' : '❓'} {flag.label}
                  </p>
                  <p className="text-[11px] text-[#A0A0A8] leading-relaxed">
                    {isFound ? flag.desc : 'Click the highlighted red flag in the email to reveal explanation.'}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ========================================================
   SIMULATION B: SOCIAL ENGINEERING AWARENESS
======================================================== */
const SimulationSocialEngineering: React.FC = () => {
  const [step, setStep] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);

  const scenario = [
    {
      caller: 'Fake Bank Manager (Rahul Sharma)',
      message: 'Hello Mr. Mathew, this is Rahul Sharma from SBI Fraud Prevention. An unauthorized debit card charge of ₹48,000 for an iPhone purchase in Dubai is being processed right now. Did you authorize this?',
      options: [
        { text: 'No! I never bought any iPhone! Please cancel it immediately!', scoreDelta: 0, feedback: 'Panic response: Scammers deliberately introduce a high fake transaction amount to cause alarm and suspend your logical thinking.' },
        { text: 'Wait. I did not authorize anything. Let me call SBI official customer care directly from the number on my debit card.', scoreDelta: 10, feedback: 'PERFECT! Never verify fraud with an unsolicited caller. Always hang up and call the number on your physical card.' },
      ],
    },
    {
      caller: 'Fake Bank Manager',
      message: 'Sir, if you hang up, the transaction will clear in 60 seconds! I just sent a 6-digit cancellation OTP to your phone. Read it out to me quickly so I can block the funds!',
      options: [
        { text: 'The OTP is 849201! Please cancel the Dubai charge fast!', scoreDelta: 0, feedback: 'TRAP TRIGGERED: Reading out the OTP authorized the scammer to debit your real money or reset your password!' },
        { text: 'Banks NEVER ask for OTPs to cancel transactions. I am disconnecting now.', scoreDelta: 10, feedback: 'EXCELLENT! OTP is a secret authorization key. Legitimate bank staff never need your OTP.' },
      ],
    },
  ];

  const handleSelectOption = (idx: number) => {
    const selected = scenario[step].options[idx];
    setScore(score + selected.scoreDelta);
    setFeedback(selected.feedback);
  };

  const handleNext = () => {
    setFeedback(null);
    setStep(step + 1);
  };

  const handleReset = () => {
    setStep(0);
    setScore(0);
    setFeedback(null);
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div className="bg-[#101014] border border-[#FF3038]/40 rounded-2xl p-6 md:p-8 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-[#FF3038]/20">
          <div>
            <h2 className="text-xl font-heading font-bold text-white uppercase tracking-wider">
              Simulation B: Social Engineering Phone Call
            </h2>
            <p className="text-xs text-[#A0A0A8]">
              Experience how cybercriminals use urgency and fear to manipulate victims into surrendering secrets.
            </p>
          </div>
          <Badge variant="red">Defense Score: {score}/20</Badge>
        </div>

        {step < scenario.length ? (
          <div className="space-y-5">
            {/* Caller Bubble */}
            <div className="p-4 rounded-xl bg-[#0B0B0F] border border-[#FF3038]/30 flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-[#FF3038] text-white font-bold flex items-center justify-center shrink-0 mt-0.5 font-mono text-xs">
                CALL
              </div>
              <div>
                <p className="font-heading font-bold text-xs uppercase text-[#FF5555]">
                  {scenario[step].caller}
                </p>
                <p className="text-xs sm:text-sm text-white mt-1 leading-relaxed">
                  "{scenario[step].message}"
                </p>
              </div>
            </div>

            {/* Options */}
            {!feedback ? (
              <div className="space-y-2.5">
                <p className="text-xs font-mono uppercase text-[#A0A0A8]">Choose your response:</p>
                {scenario[step].options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(idx)}
                    className="w-full text-left p-3.5 rounded-xl bg-[#15151B] border border-white/10 hover:border-[#FF3038] text-xs sm:text-sm text-[#D0D0D8] hover:text-white transition"
                  >
                    {opt.text}
                  </button>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-[#08080C] border border-amber-500/40 text-xs text-amber-200 leading-relaxed">
                  <p className="font-heading font-bold uppercase text-amber-400 mb-1">Cyber Defense Analysis:</p>
                  <p>{feedback}</p>
                </div>
                <CyberButton variant="primary" size="sm" onClick={handleNext}>
                  Continue Scenario
                </CyberButton>
              </div>
            )}
          </div>
        ) : (
          <div className="py-8 text-center space-y-4">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
            <h3 className="font-heading font-bold text-xl text-white">Scenario Complete</h3>
            <p className="text-xs text-[#A0A0A8] max-w-md mx-auto">
              Your final score: {score}/20 points. Always remember the Golden Rule: Never act out of panic from an unsolicited phone call.
            </p>
            <CyberButton variant="secondary" size="sm" onClick={handleReset}>
              Replay Scenario
            </CyberButton>
          </div>
        )}
      </div>
    </div>
  );
};

/* ========================================================
   SIMULATION C: CAMERA PERMISSION AWARENESS
======================================================== */
const SimulationCameraPermission: React.FC = () => {
  const [permissionState, setPermissionState] = useState<'prompt' | 'granted' | 'blocked'>('prompt');

  return (
    <div className="max-w-3xl space-y-6">
      <div className="bg-[#101014] border border-[#FF3038]/40 rounded-2xl p-6 md:p-8 space-y-5">
        <div>
          <h2 className="text-xl font-heading font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Camera className="w-5 h-5 text-[#FF3038]" />
            Simulation C: Camera & Microphone Permission Traps
          </h2>
          <p className="text-xs text-[#A0A0A8] mt-1">
            Simulates deceptive web prompts (e.g. fake human verification CAPTCHAs) without accessing your real camera.
          </p>
        </div>

        {/* Deceptive website mockup */}
        <div className="rounded-xl border border-white/10 bg-[#07070A] p-6 text-center space-y-4 relative overflow-hidden">
          {/* Simulated Browser Prompt Overlay */}
          {permissionState === 'prompt' && (
            <div className="max-w-sm mx-auto p-4 rounded-xl bg-[#121218] border border-[#FF3038] shadow-[0_0_30px_rgba(255,48,56,0.3)] text-left space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono text-white">
                <Globe className="w-4 h-4 text-[#FF3038]" />
                <span>free-movies-hd2026.xyz wants to:</span>
              </div>
              <p className="text-xs text-[#A0A0A8] pl-6">
                📷 Use your camera and microphone
              </p>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => setPermissionState('blocked')}
                  className="px-3 py-1 rounded bg-white/10 hover:bg-white/20 text-xs text-white"
                >
                  Block
                </button>
                <button
                  onClick={() => setPermissionState('granted')}
                  className="px-3 py-1 rounded bg-[#FF3038] text-white text-xs font-semibold"
                >
                  Allow
                </button>
              </div>
            </div>
          )}

          {permissionState === 'granted' && (
            <div className="p-4 rounded-xl bg-red-950/40 border border-red-500 text-xs text-red-200 text-left space-y-2">
              <p className="font-heading font-bold uppercase text-red-400">
                🚨 RISK DEMONSTRATION: Permission Granted
              </p>
              <p>
                In a real scenario, this malicious streaming site would now be authorized to capture snapshots or stream room audio in the background whenever the tab is open.
              </p>
              <button
                onClick={() => setPermissionState('blocked')}
                className="text-xs text-white underline font-semibold mt-1"
              >
                Click here to simulate revoking this permission in browser settings
              </button>
            </div>
          )}

          {permissionState === 'blocked' && (
            <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500 text-xs text-emerald-200 text-left space-y-2">
              <p className="font-heading font-bold uppercase text-emerald-400">
                🛡️ SAFE CHOICE: Permission Blocked
              </p>
              <p>
                You successfully protected your physical privacy. Streaming sites and video downloaders never have a legitimate need for camera access.
              </p>
              <button
                onClick={() => setPermissionState('prompt')}
                className="text-xs text-white underline font-semibold mt-1"
              >
                Reset Simulation
              </button>
            </div>
          )}
        </div>

        <div className="p-4 rounded-xl bg-[#08080C] border border-white/10 text-xs text-[#A0A0A8] space-y-1">
          <p className="font-heading font-bold text-white uppercase">Remember:</p>
          <p>
            No web CAPTCHA or human-verification test requires camera access. Demanding camera permissions for CAPTCHA is 100% a malicious exploit tactic.
          </p>
        </div>
      </div>
    </div>
  );
};

/* ========================================================
   SIMULATION D: PASSWORD CRACKER LAB
======================================================== */
const SimulationPasswordCracker: React.FC = () => {
  const [selectedExample, setSelectedExample] = useState(0);

  const examples = [
    { pwd: 'password123', crackTime: '0.002 Seconds', entropy: '28 bits', vulnerability: 'Found in top-10 breached dictionary wordlists. Cracking cluster cracks in milliseconds.' },
    { pwd: 'JohnDoe1990', crackTime: '3.4 Minutes', entropy: '38 bits', vulnerability: 'Predictable format: Name + Birth Year. Easily cracked using rule-based mutations in Hashcat.' },
    { pwd: 'P@ssw0rd2026!', crackTime: '4.2 Days', entropy: '54 bits', vulnerability: 'Predictable substitutions (@ for a, 0 for o). Modern wordlists include these exact leetspeak mutations.' },
    { pwd: 'BlueHorseDancingOver99Clouds!', crackTime: '3.8 Trillion Years', entropy: '98 bits', vulnerability: 'High cryptographic entropy. Mathematical permutations exceed the computational capacity of modern supercomputers.' },
  ];

  return (
    <div className="max-w-3xl space-y-6">
      <div className="bg-[#101014] border border-[#FF3038]/40 rounded-2xl p-6 md:p-8 space-y-5">
        <div>
          <h2 className="text-xl font-heading font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <KeyRound className="w-5 h-5 text-[#FF3038]" />
            Simulation D: GPU Password Cracking Lab
          </h2>
          <p className="text-xs text-[#A0A0A8] mt-1">
            Compare how different password architectures withstand automated GPU cluster brute-force attempts.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {examples.map((ex, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedExample(idx)}
              className={`p-3.5 rounded-xl border text-left transition ${
                selectedExample === idx
                  ? 'bg-[#FF3038]/20 border-[#FF3038] text-white shadow-[0_0_15px_rgba(255,48,56,0.3)]'
                  : 'bg-[#07070A] border-white/10 text-[#A0A0A8] hover:border-white/30'
              }`}
            >
              <p className="font-mono text-sm font-semibold text-white">{ex.pwd}</p>
              <p className="text-xs font-mono text-[#FF5555] mt-1">Crack time: {ex.crackTime}</p>
            </button>
          ))}
        </div>

        <div className="p-4 rounded-xl bg-[#08080C] border border-[#FF3038]/30 space-y-2 text-xs">
          <div className="flex items-center justify-between font-mono">
            <span className="text-[#A0A0A8]">Password: <strong className="text-white">{examples[selectedExample].pwd}</strong></span>
            <span className="text-[#FF5555] font-bold">Entropy: {examples[selectedExample].entropy}</span>
          </div>
          <p className="text-[#D0D0D8] leading-relaxed">
            {examples[selectedExample].vulnerability}
          </p>
        </div>
      </div>
    </div>
  );
};

/* ========================================================
   SIMULATION E: PUBLIC WI-FI SNIFFING
======================================================== */
const SimulationPublicWifi: React.FC = () => {
  const [protocol, setProtocol] = useState<'http' | 'https'>('http');

  return (
    <div className="max-w-3xl space-y-6">
      <div className="bg-[#101014] border border-[#FF3038]/40 rounded-2xl p-6 md:p-8 space-y-5">
        <div>
          <h2 className="text-xl font-heading font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Wifi className="w-5 h-5 text-[#FF3038]" />
            Simulation E: Public Wi-Fi Packet Sniffing
          </h2>
          <p className="text-xs text-[#A0A0A8] mt-1">
            Visualizes how attackers on an open coffee-shop network sniff unencrypted HTTP packets versus encrypted TLS/HTTPS tunnels.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setProtocol('http')}
            className={`flex-1 py-2 rounded-xl text-xs font-heading uppercase font-bold border transition ${
              protocol === 'http'
                ? 'bg-red-950/60 border-red-500 text-red-200'
                : 'bg-[#07070A] border-white/10 text-[#A0A0A8]'
            }`}
          >
            Unencrypted (HTTP)
          </button>
          <button
            onClick={() => setProtocol('https')}
            className={`flex-1 py-2 rounded-xl text-xs font-heading uppercase font-bold border transition ${
              protocol === 'https'
                ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200'
                : 'bg-[#07070A] border-white/10 text-[#A0A0A8]'
            }`}
          >
            Encrypted (HTTPS / VPN)
          </button>
        </div>

        {/* Packet Flow Simulation View */}
        <div className="p-6 rounded-xl bg-[#07070A] border border-white/10 space-y-4 font-mono text-xs">
          <p className="text-[#A0A0A8] text-center">
            Packet captured by attacker running Wireshark on same public Wi-Fi:
          </p>
          {protocol === 'http' ? (
            <div className="p-4 rounded-lg bg-red-950/30 border border-red-500 text-red-300 space-y-1">
              <p>GET /login.php HTTP/1.1</p>
              <p>Host: mybank-portal.com</p>
              <p className="font-bold text-red-400">User: victim_john@gmail.com</p>
              <p className="font-bold text-red-400">Pass: MySecretPassword123</p>
              <p className="text-[10px] text-[#A0A0A8] mt-2">
                ⚠️ All credentials transmitted in plaintext! Anyone on the Wi-Fi network can read this.
              </p>
            </div>
          ) : (
            <div className="p-4 rounded-lg bg-emerald-950/30 border border-emerald-500 text-emerald-300 space-y-1">
              <p>TLS v1.3 Encrypted Handshake [AES-256-GCM]</p>
              <p>Encrypted Application Data: 7f 3a 9c b1 02 fe 88 1a d4 5b c9 33...</p>
              <p className="text-[10px] text-[#A0A0A8] mt-2">
                🛡️ Data is cryptographically scrambled into unbreakable ciphertext in transit.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* ========================================================
   SIMULATION F: SCAM DETECTION SPEED CHALLENGE
======================================================== */
const SimulationScamSpeedTest: React.FC = () => {
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [feedback, setFeedback] = useState<any>(null);

  const challenges = [
    {
      msg: 'Your electricity power will be disconnected at 9:30 PM due to pending bill of ₹1,420. Immediately contact power officer on WhatsApp: 9876543210.',
      correct: 'Clearly Fraudulent',
      explanation: 'Utility boards in India never use personal 10-digit WhatsApp numbers to resolve disconnection disputes. This is the widespread Electricity Bill scam.',
    },
    {
      msg: 'Your Google Account verification code is G-482910. Never share this code with anyone.',
      correct: 'Likely Legitimate',
      explanation: 'Official 2FA message containing the standard warning never to share the code and containing no links or request to call someone.',
    },
    {
      msg: 'FedEx: Your parcel #FX-8942 has been seized at Mumbai Customs due to contraband items. A CBI arrest notice has been issued for your Aadhaar card.',
      correct: 'Clearly Fraudulent',
      explanation: 'Classic hook for the Digital Arrest extortion scam. Couriers do not issue CBI arrest notices via SMS.',
    },
  ];

  const handleChoice = (choice: string) => {
    if (answered) return;
    const isCorrect = choice === challenges[index].correct;
    if (isCorrect) setScore(score + 10);
    setFeedback({
      isCorrect,
      explanation: challenges[index].explanation,
    });
    setAnswered(true);
  };

  const handleNext = () => {
    setAnswered(false);
    setFeedback(null);
    setIndex((index + 1) % challenges.length);
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div className="bg-[#101014] border border-[#FF3038]/40 rounded-2xl p-6 md:p-8 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-[#FF3038]/20">
          <div>
            <h2 className="text-xl font-heading font-bold text-white uppercase tracking-wider">
              Simulation F: Rapid Scam Detection Speed Challenge
            </h2>
            <p className="text-xs text-[#A0A0A8]">Classify each scenario as Legitimate or Fraudulent.</p>
          </div>
          <Badge variant="red">Score: {score} pts</Badge>
        </div>

        <div className="p-5 rounded-xl bg-[#08080C] border border-[#FF3038]/30 font-mono text-xs sm:text-sm text-white leading-relaxed">
          "{challenges[index].msg}"
        </div>

        {!answered ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {['Likely Legitimate', 'Clearly Fraudulent', 'Insufficient Information'].map((opt) => (
              <button
                key={opt}
                onClick={() => handleChoice(opt)}
                className="py-3 px-2 rounded-xl bg-[#15151B] border border-white/10 hover:border-[#FF3038] text-xs font-heading font-semibold uppercase tracking-wider text-white transition text-center"
              >
                {opt}
              </button>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            <div className={`p-4 rounded-xl border text-xs leading-relaxed ${feedback.isCorrect ? 'bg-emerald-950/40 border-emerald-500 text-emerald-200' : 'bg-red-950/40 border-red-500 text-red-200'}`}>
              <p className="font-heading font-bold uppercase mb-1">
                {feedback.isCorrect ? '✅ Correct Classification!' : '❌ Incorrect Assessment!'}
              </p>
              <p>{feedback.explanation}</p>
            </div>
            <CyberButton variant="primary" size="sm" onClick={handleNext}>
              Next Challenge
            </CyberButton>
          </div>
        )}
      </div>
    </div>
  );
};
