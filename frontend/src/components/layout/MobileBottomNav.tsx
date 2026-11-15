import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, BookOpen, Wrench, FlaskConical, LifeBuoy } from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const items = [
    { label: 'Home', path: '/', icon: Home },
    { label: 'Threats', path: '/threats', icon: BookOpen },
    { label: 'Tools', path: '/tools', icon: Wrench },
    { label: 'Lab', path: '/lab', icon: FlaskConical },
    { label: 'Emergency', path: '/emergency', icon: LifeBuoy, highlight: true },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#07070A]/95 backdrop-blur-lg border-t border-[#FF3038]/30 px-2 py-1.5 shadow-[0_-4px_25px_rgba(0,0,0,0.8)] pb-safe">
      <div className="flex items-center justify-around">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center py-1 px-2.5 rounded-lg text-[10px] font-heading uppercase tracking-wider transition-all ${
                  item.highlight
                    ? isActive
                      ? 'text-white bg-[#FF3038] shadow-[0_0_15px_#FF3038]'
                      : 'text-[#FF5555] bg-[#C81020]/20 border border-[#FF3038]/50'
                    : isActive
                    ? 'text-[#FF5555] font-bold'
                    : 'text-[#A0A0A8] hover:text-white'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    className={`w-5 h-5 mb-0.5 transition ${
                      item.highlight
                        ? isActive
                          ? 'text-white'
                          : 'text-[#FF5555] animate-pulse'
                        : isActive
                        ? 'text-[#FF3038] drop-shadow-[0_0_8px_#FF3038]'
                        : 'text-[#A0A0A8]'
                    }`}
                  />
                  <span className="leading-none">{item.label}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};
