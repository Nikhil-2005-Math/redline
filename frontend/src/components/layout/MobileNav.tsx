import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  X,
  Home,
  BookOpen,
  Wrench,
  FlaskConical,
  Bot,
  Bell,
  LifeBuoy,
  Award,
  Info,
  User,
  Flag,
  ShieldAlert
} from 'lucide-react';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const navItems = [
    { label: 'Home', path: '/', icon: Home },
    { label: 'Threat Library', path: '/threats', icon: BookOpen },
    { label: 'Security Tools', path: '/tools', icon: Wrench },
    { label: 'Interactive Cyber Lab', path: '/lab', icon: FlaskConical },
    { label: 'AI Cyber Assistant', path: '/ai-assistant', icon: Bot },
    { label: 'Cyber Alerts', path: '/alerts', icon: Bell },
    { label: 'Emergency Help', path: '/emergency', icon: LifeBuoy, highlight: true },
    { label: 'India Safety (1930 & UPI)', path: '/india-safety', icon: Flag },
    { label: 'Cyber Quiz', path: '/quiz', icon: Award },
    { label: 'User Dashboard', path: '/dashboard', icon: User },
    { label: 'About Ecosystem', path: '/about', icon: Info },
  ];

  return (
    <div className="fixed inset-0 z-50 lg:hidden flex">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      {/* Drawer */}
      <div className="relative w-4/5 max-w-xs bg-[#0A0A0E] border-r border-[#FF3038]/40 h-full flex flex-col p-5 shadow-[0_0_35px_rgba(255,48,56,0.25)] z-10 overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-[#FF3038]/20">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-[#FF3038]" />
            <span className="font-display-badge text-lg font-black tracking-wider text-white">
              RED<span className="text-[#FF3038]">LINE</span>
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#A0A0A8] hover:text-white hover:bg-white/5"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Emergency Shortcut */}
        <div className="mt-4 mb-2">
          <NavLink
            to="/emergency"
            onClick={onClose}
            className="flex items-center justify-between w-full py-2.5 px-3 rounded-xl bg-[#C81020]/25 border border-[#FF3038] text-white font-heading font-bold text-xs uppercase tracking-wider"
          >
            <span className="flex items-center gap-2">
              <LifeBuoy className="w-4 h-4 text-[#FF5555] animate-pulse" />
              Emergency Response
            </span>
            <span className="px-2 py-0.5 rounded bg-[#FF3038] text-[11px] font-mono">1930</span>
          </NavLink>
        </div>

        {/* Links */}
        <nav className="flex-1 py-4 space-y-1">
          {navItems.map(item => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                    isActive
                      ? 'bg-[#FF3038]/15 text-white border-l-4 border-l-[#FF3038] font-semibold'
                      : 'text-[#A0A0A8] hover:text-white hover:bg-[#121218]'
                  } ${item.highlight ? 'text-[#FF5555]' : ''}`
                }
              >
                <Icon className="w-4 h-4 text-[#FF3038]" />
                <span className="font-heading">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Footer info */}
        <div className="pt-4 border-t border-[#FF3038]/20 text-[11px] font-mono text-[#A0A0A8]">
          <p className="text-white font-semibold">REDLINE Cyber Safety</p>
          <p className="mt-0.5">Indian Helpline: 1930</p>
          <p className="text-[10px] text-[#FF5555] mt-1">cybercrime.gov.in</p>
        </div>
      </div>
    </div>
  );
};
