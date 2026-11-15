import React from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Lock,
  HeartHandshake,
  Cpu,
  Layers,
  Database,
  Terminal,
  ExternalLink
} from 'lucide-react';
import { NeonCard } from '../components/common/NeonCard';
import { Badge } from '../components/common/Badge';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-16">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#101014] border border-[#FF3038]/30 text-xs font-mono text-[#FF5555] mb-2">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>PROJECT ARCHITECTURE & ETHICAL CHARTER</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black font-heading uppercase text-white tracking-wide">
          About <span className="text-[#FF3038]">REDLINE</span>
        </h1>
        <p className="text-base text-[#A0A0A8] max-w-2xl mt-2 leading-relaxed">
          "Understand the Threat. Recognize the Risk. Protect Yourself."
        </p>
      </div>

      {/* Mission Banner */}
      <div className="p-6 md:p-8 rounded-2xl bg-[#101014] border border-[#FF3038]/40 space-y-4 shadow-[0_0_25px_rgba(255,48,56,0.2)]">
        <h2 className="text-xl sm:text-2xl font-black font-heading text-white uppercase tracking-wider">
          Unified Cyber Safety & Threat Intelligence Ecosystem
        </h2>
        <p className="text-sm text-[#D0D0D8] leading-relaxed">
          REDLINE was engineered to solve a critical societal gap: while cyberattacks are becoming increasingly automated and sophisticated—weaponizing AI deepfakes, Digital Arrest syndicates, and deceptive UPI payment traps—ordinary internet users, students, elders, and families are left with static, confusing brochures.
        </p>
        <p className="text-sm text-[#D0D0D8] leading-relaxed">
          REDLINE bridges this divide by delivering an interactive, functional cybersecurity platform where users don’t just read about attacks—they inspect them, test them in isolated sandboxes, verify suspicious URLs with threat intelligence heuristics, and access prioritized crisis playbooks.
        </p>
      </div>

      {/* Ethical Sandbox & Privacy Promise */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <NeonCard className="p-6 space-y-3">
          <div className="flex items-center gap-2.5 text-emerald-400">
            <ShieldCheck className="w-6 h-6" />
            <h3 className="font-heading font-bold text-lg text-white uppercase">
              Zero-Data Transmission Privacy
            </h3>
          </div>
          <p className="text-xs text-[#A0A0A8] leading-relaxed">
            The Password Analyzer and QR Code Decoder run 100% locally inside the user's browser sandbox using JavaScript and Web APIs. Entered passwords and private decoded data are never transmitted across the network, stored in databases, or logged.
          </p>
        </NeonCard>

        <NeonCard className="p-6 space-y-3">
          <div className="flex items-center gap-2.5 text-[#FF5555]">
            <HeartHandshake className="w-6 h-6" />
            <h3 className="font-heading font-bold text-lg text-white uppercase">
              Ethical Educational Sandboxes
            </h3>
          </div>
          <p className="text-xs text-[#A0A0A8] leading-relaxed">
            All simulations in the Interactive Cyber Lab operate with strictly fictional data. The platform explicitly forbids real credential harvesting, real malware deployment, secret recording, or unauthorized exploitation.
          </p>
        </NeonCard>
      </div>

      {/* System Architecture Grid */}
      <div className="bg-[#101014] border border-[#FF3038]/30 rounded-2xl p-6 md:p-8 space-y-6">
        <h3 className="font-heading font-bold text-xl uppercase text-white">
          System Architecture & Tech Stack
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-[#08080C] border border-white/10 space-y-1.5">
            <div className="flex items-center gap-2 text-[#FF5555]">
              <Layers className="w-4 h-4" />
              <span className="font-heading font-bold uppercase">Frontend Layer</span>
            </div>
            <p className="text-[#A0A0A8] leading-relaxed">
              React 18 + TypeScript + Vite, Tailwind CSS, Lucide Icons, Canvas Matrix Animations.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#08080C] border border-white/10 space-y-1.5">
            <div className="flex items-center gap-2 text-[#FF5555]">
              <Terminal className="w-4 h-4" />
              <span className="font-heading font-bold uppercase">Backend Engine</span>
            </div>
            <p className="text-[#A0A0A8] leading-relaxed">
              Python Flask REST API, PyJWT Authentication, Bcrypt Password Hashing, Safe Browsing heuristics.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#08080C] border border-white/10 space-y-1.5">
            <div className="flex items-center gap-2 text-[#FF5555]">
              <Database className="w-4 h-4" />
              <span className="font-heading font-bold uppercase">Database Layer</span>
            </div>
            <p className="text-[#A0A0A8] leading-relaxed">
              SQLAlchemy ORM supporting MySQL 8.0 with zero-configuration SQLite local fallback.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
