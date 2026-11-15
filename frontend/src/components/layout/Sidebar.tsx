import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  ShieldAlert,
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
  Radio
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const navItems = [
    { label: 'Home', path: '/', icon: Home },
    { label: 'Threat Library', path: '/threats', icon: BookOpen },
    { label: 'Security Tools', path: '/tools', icon: Wrench },
    { label: 'Interactive Lab', path: '/lab', icon: FlaskConical },
    { label: 'AI Cyber Assistant', path: '/ai-assistant', icon: Bot },
    { label: 'Cyber Alerts', path: '/alerts', icon: Bell },
    { label: 'India Safety', path: '/india-safety', icon: Flag },
    { label: 'Cyber Quiz', path: '/quiz', icon: Award },
    { label: 'User Dashboard', path: '/dashboard', icon: User },
    { label: 'About', path: '/about', icon: Info },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 h-screen sticky top-0 bg-[#07070A] border-r border-[#FF3038]/30 shadow-[5px_0_25px_rgba(0,0,0,0.7)] z-30 select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-[#FF3038]/20 flex items-center justify-between">
        <NavLink to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-[#101014] border border-[#FF3038] flex items-center justify-center shadow-[0_0_15px_rgba(255,48,56,0.4)] group-hover:shadow-[0_0_22px_rgba(255,48,56,0.7)] transition">
            <ShieldAlert className="w-6 h-6 text-[#FF3038] group-hover:scale-110 transition" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-display-badge text-xl font-black tracking-widest text-white">
                RED<span className="text-[#FF3038] drop-shadow-[0_0_8px_#FF3038]">LINE</span>
              </span>
            </div>
            <p className="text-[10px] font-mono tracking-wider text-[#A0A0A8] uppercase">
              Cyber Defense System
            </p>
          </div>
        </NavLink>
      </div>

      {/* Emergency Fast Action Banner */}
      <div className="p-3">
        <NavLink
          to="/emergency"
          className="flex items-center justify-center gap-2 w-full py-2.5 px-3 rounded-lg bg-[#C81020]/20 border border-[#FF3038] text-white hover:bg-[#FF3038] transition-all shadow-[0_0_15px_rgba(255,48,56,0.3)] hover:shadow-[0_0_25px_rgba(255,48,56,0.6)] group"
        >
          <LifeBuoy className="w-4 h-4 text-[#FF5555] group-hover:text-white group-hover:rotate-45 transition animate-pulse" />
          <span className="font-heading font-bold text-xs uppercase tracking-wider">
            Emergency Help
          </span>
          <span className="text-[10px] font-mono bg-[#FF3038] text-white px-1.5 py-0.2 rounded-full font-bold ml-auto">
            1930
          </span>
        </NavLink>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
        {navItems.map(item => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all group ${
                  isActive
                    ? 'bg-[#FF3038]/15 text-white border-l-4 border-l-[#FF3038] border border-[#FF3038]/40 shadow-[0_0_15px_rgba(255,48,56,0.2)]'
                    : 'text-[#A0A0A8] hover:text-white hover:bg-[#121218] border border-transparent'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    className={`w-4 h-4 transition ${
                      isActive
                        ? 'text-[#FF3038] drop-shadow-[0_0_6px_#FF3038]'
                        : 'text-[#A0A0A8] group-hover:text-[#FF5555]'
                    }`}
                  />
                  <span className="font-heading text-[13px] tracking-wide">{item.label}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Threat Monitoring Indicator */}
      <div className="p-4 border-t border-[#FF3038]/20 bg-[#050505]">
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="text-[#A0A0A8] font-mono text-[11px] flex items-center gap-1.5">
            <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
            Threat Guard
          </span>
          <span className="text-emerald-400 font-mono font-semibold text-[11px]">ACTIVE</span>
        </div>
        <div className="w-full bg-[#1A1A22] h-1.5 rounded-full overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-500 via-[#FF3038] to-[#FF5555] h-full w-full animate-pulse" />
        </div>
        <p className="text-[10px] text-[#A0A0A8] mt-2 font-mono">
          Safe Sandbox Mode • v1.0
        </p>
      </div>
    </aside>
  );
};
