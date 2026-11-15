import React from 'react';
import { NavLink } from 'react-router-dom';
import { ShieldAlert, ExternalLink, PhoneCall, ShieldCheck, HeartHandshake } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#050508] border-t border-[#FF3038]/25 text-[#A0A0A8] text-sm relative z-10">
      {/* Top Warning & Emergency Ticker */}
      <div className="bg-[#101014] border-b border-[#FF3038]/20 px-4 py-3">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-white">
            <span className="w-2 h-2 rounded-full bg-[#FF3038] animate-ping" />
            <span className="font-heading font-semibold uppercase tracking-wider text-[#FF5555]">
              National Cyber Emergency
            </span>
            <span className="hidden md:inline text-[#A0A0A8]">
              — Report financial frauds within the 2-hour Golden Window:
            </span>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="tel:1930"
              className="flex items-center gap-1.5 px-3 py-1 rounded bg-[#FF3038]/15 border border-[#FF3038]/50 text-[#FF5555] font-mono font-bold hover:bg-[#FF3038] hover:text-white transition"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              Dial 1930 (Helpline)
            </a>
            <a
              href="https://cybercrime.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 px-3 py-1 rounded bg-white/5 border border-white/10 text-white font-mono hover:border-[#FF3038] transition"
            >
              <span>cybercrime.gov.in</span>
              <ExternalLink className="w-3 h-3 text-[#A0A0A8]" />
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-6 h-6 text-[#FF3038]" />
              <span className="font-display-badge text-xl font-bold tracking-wider text-white">
                RED<span className="text-[#FF3038]">LINE</span>
              </span>
            </div>
            <p className="text-xs text-[#A0A0A8] leading-relaxed">
              "Understand the Threat. Recognize the Risk. Protect Yourself."
            </p>
            <p className="text-xs text-[#A0A0A8] leading-relaxed">
              A unified cybersecurity education, threat analysis, and interactive simulation ecosystem designed for students, parents, elders, and internet users worldwide.
            </p>
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <span>Zero-Data Transmission Safe Testing</span>
            </div>
          </div>

          {/* Core Modules */}
          <div>
            <h4 className="font-heading font-semibold text-white uppercase tracking-wider text-xs mb-3 text-[#FF5555]">
              Platform Modules
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <NavLink to="/threats" className="hover:text-white transition">
                  Threat Library (35+ Detailed Topics)
                </NavLink>
              </li>
              <li>
                <NavLink to="/tools" className="hover:text-white transition">
                  Security Tools (8 Genuine Checkers)
                </NavLink>
              </li>
              <li>
                <NavLink to="/lab" className="hover:text-white transition">
                  Interactive Cyber Simulation Lab
                </NavLink>
              </li>
              <li>
                <NavLink to="/ai-assistant" className="hover:text-white transition">
                  AI Cyber Assistant (English & മലയാളം)
                </NavLink>
              </li>
              <li>
                <NavLink to="/india-safety" className="hover:text-white transition">
                  India Safety: UPI & Digital Arrest
                </NavLink>
              </li>
              <li>
                <NavLink to="/quiz" className="hover:text-white transition">
                  Cyber Awareness Quizzes & Certs
                </NavLink>
              </li>
            </ul>
          </div>

          {/* Security Checking Tools */}
          <div>
            <h4 className="font-heading font-semibold text-white uppercase tracking-wider text-xs mb-3 text-[#FF5555]">
              Security Tools
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <NavLink to="/tools/url-checker" className="hover:text-white transition">
                  URL Safety Checker
                </NavLink>
              </li>
              <li>
                <NavLink to="/tools/password-analyzer" className="hover:text-white transition">
                  Password Strength Analyzer
                </NavLink>
              </li>
              <li>
                <NavLink to="/tools/message-analyzer" className="hover:text-white transition">
                  Suspicious Message Analyzer
                </NavLink>
              </li>
              <li>
                <NavLink to="/tools/email-inspector" className="hover:text-white transition">
                  Email Authentication Inspector
                </NavLink>
              </li>
              <li>
                <NavLink to="/tools/qr-safety" className="hover:text-white transition">
                  QR Code Safety Guide & Decoder
                </NavLink>
              </li>
              <li>
                <NavLink to="/tools/browser-privacy" className="hover:text-white transition">
                  Browser Privacy & Leak Audit
                </NavLink>
              </li>
            </ul>
          </div>

          {/* Ethics & Disclosures */}
          <div className="space-y-3">
            <h4 className="font-heading font-semibold text-white uppercase tracking-wider text-xs text-[#FF5555]">
              Safety & Ethics Promise
            </h4>
            <p className="text-xs text-[#A0A0A8] leading-relaxed">
              REDLINE is strictly educational. All phishing and social engineering simulations run in isolated fictional sandboxes. No user passwords or private messages are ever stored, logged, or transmitted to third parties.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs font-mono text-[#A0A0A8]">
              <HeartHandshake className="w-4 h-4 text-[#FF3038]" />
              <span>Public Cyber Awareness Initiative</span>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-[#FF3038]/20 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <p>© 2026 REDLINE Cyber Safety & Threat Intelligence Ecosystem. All rights reserved.</p>
          <div className="flex items-center gap-4 text-xs font-mono">
            <NavLink to="/about" className="hover:text-white transition">
              About & Architecture
            </NavLink>
            <span>•</span>
            <NavLink to="/emergency" className="text-[#FF5555] hover:text-white transition font-semibold">
              Emergency Guidance
            </NavLink>
          </div>
        </div>
      </div>
    </footer>
  );
};
