import React from 'react';
import { NavLink } from 'react-router-dom';
import { Search, Menu, LifeBuoy, Bot, User, LogOut, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface NavbarProps {
  onOpenSearch: () => void;
  onToggleMobileNav: () => void;
  onOpenAuthModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenSearch,
  onToggleMobileNav,
  onOpenAuthModal,
}) => {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-20 h-16 bg-[#07070A]/90 backdrop-blur-md border-b border-[#FF3038]/25 px-4 md:px-8 flex items-center justify-between shadow-[0_4px_20px_rgba(0,0,0,0.6)]">
      {/* Left: Mobile Menu Button & Brand on mobile */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileNav}
          className="lg:hidden p-2 rounded-lg bg-[#101014] border border-[#FF3038]/30 text-[#A0A0A8] hover:text-white"
          aria-label="Toggle menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <NavLink to="/" className="lg:hidden flex items-center gap-2">
          <span className="font-display-badge text-lg font-black tracking-wider text-white">
            RED<span className="text-[#FF3038]">LINE</span>
          </span>
        </NavLink>
      </div>

      {/* Center: Global Search Pill */}
      <div className="flex-1 max-w-md mx-4 hidden md:block">
        <button
          onClick={onOpenSearch}
          className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl bg-[#101014] border border-[#FF3038]/30 hover:border-[#FF3038] text-[#A0A0A8] hover:text-white text-xs font-mono transition group shadow-[0_0_10px_rgba(255,48,56,0.1)] hover:shadow-[0_0_15px_rgba(255,48,56,0.25)]"
        >
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-[#FF3038] group-hover:scale-110 transition" />
            <span>Search threats, tools, emergency playbooks...</span>
          </div>
          <kbd className="px-2 py-0.5 rounded bg-white/10 text-[10px] text-[#A0A0A8] border border-white/10">
            Ctrl K
          </kbd>
        </button>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2.5">
        {/* Mobile Search Button */}
        <button
          onClick={onOpenSearch}
          className="md:hidden p-2 rounded-lg bg-[#101014] border border-[#FF3038]/30 text-[#FF3038]"
          aria-label="Search"
        >
          <Search className="w-4 h-4" />
        </button>

        {/* AI Assistant Pill */}
        <NavLink
          to="/ai-assistant"
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#101014] border border-[#FF3038]/40 hover:border-[#FF3038] text-white text-xs font-heading uppercase tracking-wider transition hover:shadow-[0_0_12px_rgba(255,48,56,0.3)]"
        >
          <Bot className="w-4 h-4 text-[#FF3038]" />
          <span>AI Defense</span>
        </NavLink>

        {/* Emergency Shortcut */}
        <NavLink
          to="/emergency"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#C81020]/20 border border-[#FF3038] text-[#FF5555] hover:text-white hover:bg-[#FF3038] text-xs font-heading font-bold uppercase tracking-wider transition shadow-[0_0_12px_rgba(255,48,56,0.25)]"
        >
          <LifeBuoy className="w-4 h-4 animate-spin-slow" />
          <span className="hidden xs:inline">Emergency</span>
        </NavLink>

        {/* User Auth / Profile */}
        {user ? (
          <div className="flex items-center gap-2 pl-2 border-l border-[#FF3038]/30">
            <NavLink
              to="/dashboard"
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-[#101014] border border-[#FF3038]/40 hover:border-[#FF3038] transition text-xs font-mono text-white"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="max-w-[90px] truncate">{user.username}</span>
              <span className="text-[10px] text-[#FF5555] font-bold">
                {user.awareness_score || 0} pts
              </span>
            </NavLink>
            <button
              onClick={logout}
              title="Sign Out"
              className="p-1.5 text-[#A0A0A8] hover:text-[#FF3038] transition"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={onOpenAuthModal}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#101014] border border-[#FF3038]/40 hover:border-[#FF3038] text-xs font-heading font-medium text-white hover:bg-[#FF3038]/10 transition"
          >
            <User className="w-3.5 h-3.5 text-[#FF3038]" />
            <span>Sign In</span>
          </button>
        )}
      </div>
    </header>
  );
};
