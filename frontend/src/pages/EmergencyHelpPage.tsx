import React, { useState } from 'react';
import {
  LifeBuoy,
  PhoneCall,
  ExternalLink,
  CheckSquare,
  Square,
  AlertOctagon,
  ShieldAlert,
  ArrowRight,
  Clock,
  Landmark,
  FileText,
  Lock,
  Smartphone,
  Camera,
  MessageSquare
} from 'lucide-react';
import { NeonCard } from '../components/common/NeonCard';
import { Badge } from '../components/common/Badge';

export const EmergencyHelpPage: React.FC = () => {
  const [selectedIncident, setSelectedIncident] = useState('otp');
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  const incidentTypes = [
    { id: 'otp', title: 'I shared an OTP / PIN', icon: Landmark, urgency: 'Critical', color: 'red' },
    { id: 'payment', title: 'I made a fraudulent payment', icon: Landmark, urgency: 'Critical', color: 'red' },
    { id: 'link', title: 'I clicked a suspicious link', icon: ShieldAlert, urgency: 'High', color: 'amber' },
    { id: 'account', title: 'My account was compromised', icon: Lock, urgency: 'High', color: 'amber' },
    { id: 'apk', title: 'I installed a suspicious APK/App', icon: Smartphone, urgency: 'High', color: 'amber' },
    { id: 'camera', title: 'Suspected camera/mic spyware', icon: Camera, urgency: 'High', color: 'amber' },
    { id: 'blackmail', title: 'Blackmail, sextortion, or threats', icon: MessageSquare, urgency: 'Critical', color: 'red' },
    { id: 'leak', title: 'My documents/data were exposed', icon: FileText, urgency: 'Medium', color: 'cyan' },
  ];

  const playbooks: Record<string, {
    title: string;
    criticalRule: string;
    stages: Array<{
      timeframe: string;
      tasks: string[];
    }>;
  }> = {
    otp: {
      title: 'Emergency Triage: OTP Shared with Scammer',
      criticalRule: 'ACT IMMEDIATELY (Golden Window: First 2 Hours). Banks can freeze transactions before scammers withdraw funds to mule accounts.',
      stages: [
        {
          timeframe: 'Immediate (Minutes 0 - 15)',
          tasks: [
            'Call the National Cyber Crime Helpline: Dial 1930 immediately.',
            'Call your bank’s 24x7 emergency card/netbanking block number.',
            'Open your mobile banking app and freeze all debit/credit cards and UPI access.',
            'Do NOT delete SMS messages containing the OTP or transaction reference numbers.',
          ],
        },
        {
          timeframe: 'Containment (Minutes 15 - 60)',
          tasks: [
            'Log into your primary email from a known safe computer and check for password reset alerts.',
            'Change netbanking and email passwords immediately.',
            'Terminate all other active sessions in your Google / Apple ID security settings.',
          ],
        },
        {
          timeframe: 'Evidence & Formal Complaint',
          tasks: [
            'Take screenshots of the SMS with OTP, caller ID number, and transaction debit alerts.',
            'Obtain the 12-digit UTR (Unique Transaction Reference) number from your bank.',
            'Submit a detailed formal report on https://cybercrime.gov.in.',
          ],
        },
      ],
    },
    payment: {
      title: 'Emergency Triage: Fraudulent Payment Executed',
      criticalRule: 'Report the transaction within 2 hours to trigger the RBI and National Cyber Crime Portal auto-hold protocol on the beneficiary account.',
      stages: [
        {
          timeframe: 'Immediate (First 60 Minutes)',
          tasks: [
            'Dial 1930 (Cyber Crime Helpline) and report transaction details (UTR, Bank, Recipient UPI ID).',
            'Contact your bank immediately to file a formal dispute and dispute transaction chargeback.',
            'Contact the beneficiary bank / payment app (PhonePe, Google Pay, Paytm) to flag the merchant account.',
          ],
        },
        {
          timeframe: 'Evidence Preservation',
          tasks: [
            'Save transaction receipts showing UTR, date, timestamp, and beneficiary account/UPI ID.',
            'Preserve all WhatsApp, Telegram, or SMS chat histories with the fraudster (do not block or delete them yet).',
            'File an FIR at your local Cyber Crime Police Station or online at cybercrime.gov.in.',
          ],
        },
      ],
    },
    link: {
      title: 'Emergency Triage: Clicked a Suspicious Link',
      criticalRule: 'Disconnect immediately from Wi-Fi and mobile data to halt active background data transfers.',
      stages: [
        {
          timeframe: 'Immediate Isolation',
          tasks: [
            'Turn off Wi-Fi and Cellular Mobile Data immediately.',
            'Did a file download? Open your Downloads folder and delete any recent .apk, .exe, or .zip files WITHOUT opening them.',
            'Clear your browser cache, cookies, and active session history.',
          ],
        },
        {
          timeframe: 'Account Security Review',
          tasks: [
            'Did you enter any passwords or OTPs on that page? If YES, change those passwords immediately from a separate, clean device.',
            'Enable Authenticator App 2FA on your email and banking accounts.',
            'Run a full offline scan using Google Play Protect (on Android) or Windows Security (on PC).',
          ],
        },
      ],
    },
    account: {
      title: 'Emergency Triage: Account Compromised / Hacked',
      criticalRule: 'Revoke active sessions and secure recovery email/phone before the attacker changes them.',
      stages: [
        {
          timeframe: 'Account Recovery',
          tasks: [
            'Visit the official recovery page (e.g. accounts.google.com/signin/recovery or instagram.com/hacked).',
            'Change password to a strong 16+ character passphrase.',
            'Click "Log out of all devices" or "Revoke all active sessions".',
            'Verify recovery phone number and backup email address have not been altered.',
          ],
        },
        {
          timeframe: 'Lockdown & Multi-Factor',
          tasks: [
            'Remove unauthorized third-party apps connected to your Google/Apple account.',
            'Switch 2FA from SMS to Google Authenticator or hardware security keys.',
            'Check email forwarding rules to ensure the attacker is not silently receiving copies of your emails.',
          ],
        },
      ],
    },
    apk: {
      title: 'Emergency Triage: Malicious APK / Software Installed',
      criticalRule: 'Boot your device into Safe Mode immediately to prevent the malware from blocking uninstallation.',
      stages: [
        {
          timeframe: 'Isolation & Removal',
          tasks: [
            'Turn on Airplane Mode immediately to stop background spyware transmission.',
            'Restart phone into Safe Mode (press and hold Power, then long-press Power Off icon on Android).',
            'Go to Settings > Apps and uninstall the suspicious application.',
            'Go to Settings > Accessibility and verify no unknown apps have screen control permissions.',
          ],
        },
        {
          timeframe: 'Post-Infection Lockdown',
          tasks: [
            'Change all banking and email passwords from another safe device.',
            'Scan device with Malwarebytes or Google Play Protect.',
            'If the app obtained Device Administrator privileges, consider performing a clean factory reset.',
          ],
        },
      ],
    },
    camera: {
      title: 'Emergency Triage: Unauthorized Camera or Mic Access',
      criticalRule: 'Apply physical lens cover and revoke operating system hardware privileges.',
      stages: [
        {
          timeframe: 'Immediate Hardware Isolation',
          tasks: [
            'Place opaque tape or a sliding camera cover over the webcam lens.',
            'On Android: Go to Settings > Privacy > Permission Manager > Camera/Microphone and revoke access for all unknown apps.',
            'On Windows: Press Win + I > Privacy & Security > Camera > Turn off access for desktop apps.',
          ],
        },
        {
          timeframe: 'System Inspection',
          tasks: [
            'Check Task Manager / Activity Monitor for unrecognized background processes using high CPU or GPU.',
            'Run a full offline Microsoft Defender scan or Malwarebytes scan.',
          ],
        },
      ],
    },
    blackmail: {
      title: 'Emergency Triage: Blackmail, Sextortion, or Video Threats',
      criticalRule: 'DO NOT PAY. Paying money NEVER stops blackmail; extortionists immediately demand more money.',
      stages: [
        {
          timeframe: 'Immediate Psychological Defense',
          tasks: [
            'DO NOT transfer any money or cryptocurrency. Paying marks you as a paying victim and escalates extortion.',
            'Do NOT delete chat history or call recordings; you need them as legal evidence.',
            'Immediately lock or privatize all your social media profiles (Facebook, Instagram, LinkedIn).',
          ],
        },
        {
          timeframe: 'Official Reporting & Evidence Preservation',
          tasks: [
            'Take clear screenshots of threatening messages, phone numbers, and profile handles.',
            'If intimate images are threatened: Visit https://stopncii.org (Stop Non-Consensual Intimate Image Sharing) to create cryptographic hashes that prevent their upload on major tech platforms.',
            'Dial 1930 or visit cybercrime.gov.in to report cyber blackmail / harassment.',
          ],
        },
      ],
    },
    leak: {
      title: 'Emergency Triage: Documents / Aadhaar / PAN Exposed',
      criticalRule: 'Lock your biometrics via UIDAI portal or mAadhaar app to prevent identity theft.',
      stages: [
        {
          timeframe: 'Immediate Biometric Lock',
          tasks: [
            'Open the official mAadhaar mobile app or visit resident.uidai.gov.in.',
            'Enable "Lock Aadhaar Biometrics". Once locked, no one can use your fingerprint or iris authentication for SIM cards or loans.',
            'Check your CIBIL / Experian credit report to verify no unauthorized credit cards or personal loans were issued in your name.',
          ],
        },
        {
          timeframe: 'Monitoring & Protection',
          tasks: [
            'Set up credit alerts on Paisabazaar, OneScore, or direct bureau portals.',
            'File a police general diary (GD) or report identity theft at cybercrime.gov.in.',
          ],
        },
      ],
    },
  };

  const activePlaybook = playbooks[selectedIncident] || playbooks['otp'];

  const toggleCheck = (id: string) => {
    setCheckedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C81020]/20 border border-[#FF3038] text-xs font-mono text-[#FF5555] mb-2 animate-pulse">
          <LifeBuoy className="w-3.5 h-3.5" />
          <span>CYBER INCIDENT EMERGENCY RESPONSE</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black font-heading uppercase text-white tracking-wide">
          Emergency <span className="text-[#FF3038]">Help Center</span>
        </h1>
        <p className="text-sm text-[#A0A0A8] max-w-3xl mt-1">
          Follow prioritized, step-by-step recovery checklists designed to contain damage, freeze funds, protect accounts, and report to authorities.
        </p>
      </div>

      {/* Emergency Contact Strip */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#1A0507] via-[#2A080C] to-[#1A0507] border border-[#FF3038] shadow-[0_0_25px_rgba(255,48,56,0.3)] flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-[#FF3038] text-white flex items-center justify-center shrink-0 shadow-[0_0_15px_#FF3038]">
            <PhoneCall className="w-6 h-6 animate-bounce" />
          </div>
          <div>
            <p className="font-heading font-black text-lg text-white uppercase tracking-wider">
              National Cyber Crime Helpline (India): 1930
            </p>
            <p className="text-xs text-[#E0E0E8]">
              Operational 24x7. Call immediately within the 2-hour Golden Window to freeze fraudulent banking transactions.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <a
            href="tel:1930"
            className="px-5 py-2.5 rounded-xl bg-[#FF3038] hover:bg-[#FF454D] text-white font-heading font-bold text-xs uppercase tracking-wider transition shadow-[0_0_15px_#FF3038]"
          >
            Call 1930 Now
          </a>
          <a
            href="https://cybercrime.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/20 text-white font-mono text-xs flex items-center gap-1.5 transition"
          >
            <span>cybercrime.gov.in</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Incident Categories Grid */}
      <div>
        <p className="text-xs font-mono uppercase tracking-wider text-[#A0A0A8] mb-3">
          Select Your Active Crisis Scenario:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {incidentTypes.map((item) => {
            const Icon = item.icon;
            const isSelected = selectedIncident === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setSelectedIncident(item.id)}
                className={`p-4 rounded-xl border text-left flex items-start gap-3 transition-all ${
                  isSelected
                    ? 'bg-[#FF3038] text-white border-[#FF3038] shadow-[0_0_18px_rgba(255,48,56,0.45)]'
                    : 'bg-[#101014] text-[#A0A0A8] border-[#FF3038]/20 hover:border-[#FF3038]/60 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5 shrink-0 mt-0.5" />
                <div>
                  <p className="font-heading font-bold text-xs uppercase tracking-wide leading-snug">
                    {item.title}
                  </p>
                  <span
                    className={`inline-block text-[10px] font-mono uppercase mt-1 px-1.5 py-0.2 rounded ${
                      isSelected ? 'bg-black/30 text-white' : 'bg-white/5 text-[#FF5555]'
                    }`}
                  >
                    {item.urgency} Urgency
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Detailed Playbook Checklist */}
      <div className="bg-[#101014] border border-[#FF3038]/40 rounded-2xl p-6 md:p-8 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#FF3038]/20">
          <div>
            <h2 className="text-xl sm:text-2xl font-black font-heading uppercase text-white">
              {activePlaybook.title}
            </h2>
            <p className="text-xs text-[#FF5555] font-mono mt-1 font-semibold">
              ⚡ {activePlaybook.criticalRule}
            </p>
          </div>
          <Badge variant="red" size="md" pulse>
            Prioritized Recovery
          </Badge>
        </div>

        {/* Stages Checklist */}
        <div className="space-y-6">
          {activePlaybook.stages.map((stage, sIdx) => (
            <div key={sIdx} className="space-y-3">
              <h3 className="font-heading font-bold text-sm uppercase tracking-wider text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#FF3038]" />
                <span>{stage.timeframe}</span>
              </h3>

              <div className="space-y-2">
                {stage.tasks.map((task, tIdx) => {
                  const checkId = `${selectedIncident}-${sIdx}-${tIdx}`;
                  const isChecked = !!checkedItems[checkId];

                  return (
                    <div
                      key={tIdx}
                      onClick={() => toggleCheck(checkId)}
                      className={`p-3.5 rounded-xl border text-xs sm:text-sm flex items-start gap-3 cursor-pointer select-none transition ${
                        isChecked
                          ? 'bg-emerald-950/20 border-emerald-500/50 text-[#A0E0A0] line-through opacity-70'
                          : 'bg-[#08080C] border-white/10 text-white hover:border-[#FF3038]'
                      }`}
                    >
                      {isChecked ? (
                        <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      ) : (
                        <Square className="w-4 h-4 text-[#FF3038] shrink-0 mt-0.5" />
                      )}
                      <span className="leading-relaxed">{task}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
