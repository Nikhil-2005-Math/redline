import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, ShieldAlert, Wrench, FlaskConical, Bot, LifeBuoy, BookOpen, ExternalLink } from 'lucide-react';
import { api } from '../../services/api';
import { Threat } from '../../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [threats, setThreats] = useState<Threat[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Static indexed items for quick navigation
  const staticItems = [
    { title: 'Emergency Help Center', path: '/emergency', category: 'Emergency', icon: LifeBuoy, desc: 'Immediate incident triage: clicked link, shared OTP, hacked account.' },
    { title: 'URL Safety Checker', path: '/tools/url-checker', category: 'Tool', icon: Wrench, desc: 'Analyze suspicious links for phishing and lookalike domains.' },
    { title: 'Password Strength Analyzer', path: '/tools/password-analyzer', category: 'Tool', icon: Wrench, desc: 'Local entropy and GPU crack-time testing without transmission.' },
    { title: 'Suspicious Message Analyzer', path: '/tools/message-analyzer', category: 'Tool', icon: Wrench, desc: 'Detect urgency, OTP requests, and impersonation in SMS/WhatsApp.' },
    { title: 'Email Security Awareness', path: '/tools/email-inspector', category: 'Tool', icon: Wrench, desc: 'SPF, DKIM, DMARC, and reply-to address spoofing inspection.' },
    { title: 'QR Code Safety Guide', path: '/tools/qr-safety', category: 'Tool', icon: Wrench, desc: 'Safely decode QR codes locally and detect UPI payment traps.' },
    { title: 'Interactive Cyber Lab', path: '/lab', category: 'Simulation', icon: FlaskConical, desc: 'Practice spotting phishing, social engineering, and rogue Wi-Fi.' },
    { title: 'AI Cyber Safety Assistant', path: '/ai-assistant', category: 'AI Assistant', icon: Bot, desc: 'Ask cybersecurity questions in simple English or Malayalam.' },
    { title: 'India Cyber Safety (1930 & UPI)', path: '/india-safety', category: 'India Portal', icon: ShieldAlert, desc: 'Digital Arrest, UPI payment scams, Aadhaar biometric lock.' },
    { title: 'Cyber Awareness Quiz', path: '/quiz', category: 'Quiz', icon: BookOpen, desc: 'Test your security knowledge and earn a Cyber Defender Certificate.' },
  ];

  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      setThreats([]);
      return;
    }

    const timer = setTimeout(async () => {
      if (query.trim().length > 1) {
        setIsLoading(true);
        try {
          const res = await api.getThreats({ search: query.trim() });
          setThreats(res.threats);
        } catch {
          setThreats([]);
        } finally {
          setIsLoading(false);
        }
      } else {
        setThreats([]);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query, isOpen]);

  // Handle Ctrl+K shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredStatic = query.trim()
    ? staticItems.filter(
        item =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.desc.toLowerCase().includes(query.toLowerCase())
      )
    : staticItems.slice(0, 6);

  const handleSelect = (path: string) => {
    navigate(path);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-4 sm:pt-20 px-2 sm:px-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-2xl bg-[#101014] border border-[#FF3038]/50 rounded-2xl shadow-[0_0_40px_rgba(255,48,56,0.25)] overflow-hidden max-h-[90vh] flex flex-col">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-[#FF3038]/20 bg-[#0B0B0F]">
          <Search className="w-5 h-5 text-[#FF3038] mr-3 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search threats, tools, emergency playbooks, simulations... (e.g., Phishing, OTP, UPI)"
            className="w-full bg-transparent text-white placeholder-[#A0A0A8] focus:outline-none text-base"
          />
          {query && (
            <button onClick={() => setQuery('')} className="p-1 text-[#A0A0A8] hover:text-white mr-2">
              <X className="w-4 h-4" />
            </button>
          )}
          <span className="text-xs font-mono text-[#A0A0A8] bg-white/5 border border-white/10 px-2 py-0.5 rounded">
            ESC
          </span>
        </div>

        {/* Results Area */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
          {/* Threats Matches */}
          {threats.length > 0 && (
            <div>
              <p className="text-xs font-mono uppercase tracking-wider text-[#FF5555] mb-2 px-2">
                Threat Library Topics ({threats.length})
              </p>
              <div className="space-y-1.5">
                {threats.map(threat => (
                  <button
                    key={threat.id}
                    onClick={() => handleSelect(`/threats/${threat.slug}`)}
                    className="w-full text-left flex items-start gap-3 p-2.5 rounded-lg hover:bg-[#FF3038]/10 hover:border hover:border-[#FF3038]/40 transition group"
                  >
                    <ShieldAlert className="w-5 h-5 text-[#FF3038] shrink-0 mt-0.5 group-hover:drop-shadow-[0_0_8px_#FF3038]" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-heading font-semibold text-white group-hover:text-[#FF5555]">
                          {threat.name}
                        </span>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-white/10 text-[#A0A0A8]">
                          {threat.category_name}
                        </span>
                      </div>
                      <p className="text-xs text-[#A0A0A8] truncate mt-0.5">{threat.short_desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quick Tools & Features */}
          {filteredStatic.length > 0 && (
            <div>
              <p className="text-xs font-mono uppercase tracking-wider text-[#A0A0A8] mb-2 px-2">
                {query ? 'Features & Security Tools' : 'Quick Access Navigation'}
              </p>
              <div className="space-y-1.5">
                {filteredStatic.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelect(item.path)}
                      className="w-full text-left flex items-center justify-between p-2.5 rounded-lg hover:bg-white/5 border border-transparent hover:border-white/10 transition group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#0B0B0F] border border-[#FF3038]/30 flex items-center justify-center text-[#FF3038]">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-white group-hover:text-[#FF5555]">
                            {item.title}
                          </p>
                          <p className="text-xs text-[#A0A0A8] truncate">{item.desc}</p>
                        </div>
                      </div>
                      <ExternalLink className="w-4 h-4 text-[#A0A0A8] opacity-0 group-hover:opacity-100 transition" />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Empty State */}
          {query.trim().length > 1 && threats.length === 0 && filteredStatic.length === 0 && !isLoading && (
            <div className="py-8 text-center text-[#A0A0A8]">
              <p>No results found for "{query}".</p>
              <p className="text-xs mt-1">Try searching for keywords like "Phishing", "OTP", "UPI", "Ransomware".</p>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 bg-[#0B0B0F] border-t border-[#FF3038]/20 flex items-center justify-between text-xs text-[#A0A0A8]">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            REDLINE Global Threat Index Active
          </span>
          <span className="font-mono">Press ESC to dismiss</span>
        </div>
      </div>
    </div>
  );
};
