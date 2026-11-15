import React from 'react';
import {
  Flag,
  PhoneCall,
  ExternalLink,
  ShieldAlert,
  AlertTriangle,
  CreditCard,
  QrCode,
  FileText,
  Lock,
  ChevronRight,
  Landmark,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { NeonCard } from '../components/common/NeonCard';
import { Badge } from '../components/common/Badge';

export const IndiaSafetyPage: React.FC = () => {
  const topics = [
    {
      title: 'UPI Payment & QR Code Fraud',
      rule: 'ENTERING UPI PIN ALWAYS SENDS MONEY OUT',
      desc: 'Scammers on OLX or WhatsApp claim they are transferring money to you and instruct you to scan a QR code and enter your PIN. In reality, entering your PIN authorizes a debit from your account.',
      prevention: 'Never enter your PIN to receive money. Decline any collect requests from strangers on PhonePe, GPay, or Paytm.',
      icon: CreditCard,
    },
    {
      title: 'Digital Arrest Syndicates',
      rule: 'NO LEGAL CONCEPT OF "DIGITAL ARREST" IN INDIA',
      desc: 'Criminals impersonating CBI, ED, or Mumbai Police call on Skype/WhatsApp in fake police uniforms, claiming parcels contain narcotics and holding victims on video calls to extort money.',
      prevention: 'Indian law enforcement NEVER arrests people or conducts interrogations over video calls. Hang up immediately.',
      icon: ShieldAlert,
    },
    {
      title: 'Fake Courier & Customs SMS (FedEx / India Post)',
      rule: 'NEVER DOWNLOAD APKs FROM COURIER SMS',
      desc: 'SMS claiming: "Your parcel address is incomplete, click link to update address or pay ₹5". The link downloads a trojan APK that steals bank OTPs.',
      prevention: 'Track parcels directly on the official courier website or app, never through third-party SMS links.',
      icon: FileText,
    },
    {
      title: 'Aadhaar Biometric Locking',
      rule: 'LOCK YOUR BIOMETRICS VIA mAADHAAR APP',
      desc: 'Scammers use leaked Aadhaar numbers and silicone fingerprint clones to execute unauthorized AePS (Aadhaar-enabled Payment System) bank withdrawals.',
      prevention: 'Open the mAadhaar app or visit resident.uidai.gov.in and click "Lock Biometrics". Unlock it only when you visit a bank in person.',
      icon: Lock,
    },
    {
      title: 'Electricity Bill Disconnection SMS',
      rule: 'POWER BOARDS DO NOT USE PERSONAL WHATSAPP',
      desc: 'SMS claiming power will be cut off tonight at 9:30 PM due to unpaid bills, prompting you to call a 10-digit mobile number.',
      prevention: 'Pay electricity bills exclusively through the official DISCOM portal or verified utility section in payment apps.',
      icon: AlertTriangle,
    },
    {
      title: 'Telegram / WhatsApp Part-Time Job Scams',
      rule: 'NEVER PAY A DEPOSIT TO WORK',
      desc: 'Offers to earn ₹2,000 daily by liking YouTube videos or rating hotels, requiring upfront deposits of ₹5,000+ that cannot be withdrawn.',
      prevention: 'Legitimate employers never demand registration fees or security deposits to work.',
      icon: Landmark,
    },
  ];

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#101014] border border-[#FF3038]/30 text-xs font-mono text-[#FF5555] mb-2">
          <Flag className="w-3.5 h-3.5" />
          <span>NATIONAL CYBER SECURITY PORTAL</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black font-heading uppercase text-white tracking-wide">
          India <span className="text-[#FF3038]">Cyber Safety Guide</span>
        </h1>
        <p className="text-sm text-[#A0A0A8] max-w-3xl mt-1">
          Essential awareness on prevalent Indian cyber frauds: UPI traps, Digital Arrest syndicates, AePS biometric misuse, and official 1930 reporting procedures.
        </p>
      </div>

      {/* Official Helplines Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#150608] via-[#24080C] to-[#150608] border border-[#FF3038] shadow-[0_0_30px_rgba(255,48,56,0.3)] flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <Badge variant="red" pulse>
            National Cyber Crime Reporting
          </Badge>
          <h2 className="text-xl sm:text-2xl font-black font-heading text-white uppercase tracking-wider">
            Official Indian Helpline: 1930
          </h2>
          <p className="text-xs text-[#E0E0E8] max-w-xl leading-relaxed">
            Report within the <strong>"Golden Hour" (first 2 hours)</strong>. The 1930 helpline connects directly with the Indian Financial Cyber Fraud Reporting and Management System (CFCFRMS) to freeze money in scammer mule accounts before it is cashed out.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 shrink-0">
          <a
            href="tel:1930"
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#FF3038] hover:bg-[#FF454D] text-white font-heading font-bold text-xs uppercase tracking-wider transition shadow-[0_0_15px_#FF3038]"
          >
            <PhoneCall className="w-4 h-4" />
            <span>Call 1930</span>
          </a>
          <a
            href="https://cybercrime.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/20 text-white font-mono text-xs transition"
          >
            <span>cybercrime.gov.in</span>
            <ExternalLink className="w-4 h-4 text-[#A0A0A8]" />
          </a>
        </div>
      </div>

      {/* Topics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {topics.map((t, idx) => {
          const Icon = t.icon;
          return (
            <NeonCard key={idx} className="p-6 space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-[#08080C] border border-[#FF3038]/40 flex items-center justify-center text-[#FF3038]">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-lg text-white">
                      {t.title}
                    </h3>
                    <p className="text-[10px] font-mono text-[#FF5555] font-semibold tracking-wider uppercase">
                      ⚠️ {t.rule}
                    </p>
                  </div>
                </div>

                <p className="text-xs text-[#A0A0A8] leading-relaxed mb-3">
                  {t.desc}
                </p>

                <div className="p-3 rounded-xl bg-[#08080C] border border-emerald-500/30 text-xs text-emerald-300 flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Safety Action:</strong> {t.prevention}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-[#FF3038]/15 flex items-center justify-between text-xs font-mono">
                <span className="text-[#666672]">India Cyber Advisory</span>
                <NavLink to="/emergency" className="text-[#FF5555] hover:text-white flex items-center gap-1 font-semibold">
                  Incident Recovery <ChevronRight className="w-3.5 h-3.5" />
                </NavLink>
              </div>
            </NeonCard>
          );
        })}
      </div>
    </div>
  );
};
