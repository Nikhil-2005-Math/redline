import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { MobileNav } from './MobileNav';
import { MobileBottomNav } from './MobileBottomNav';
import { Footer } from './Footer';
import { SearchModal } from './SearchModal';
import { AuthModal } from './AuthModal';
import { CyberMatrix } from '../common/CyberMatrix';

export const Layout: React.FC = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#050505] text-[#F5F5F5] flex flex-col relative selection:bg-[#FF3038] selection:text-white">
      {/* Background Matrix Canvas */}
      <CyberMatrix />

      <div className="flex flex-1 relative z-10">
        {/* Desktop Sidebar */}
        <Sidebar />

        {/* Mobile Navigation Drawer */}
        <MobileNav
          isOpen={isMobileNavOpen}
          onClose={() => setIsMobileNavOpen(false)}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          <Navbar
            onOpenSearch={() => setIsSearchOpen(true)}
            onToggleMobileNav={() => setIsMobileNavOpen(true)}
            onOpenAuthModal={() => setIsAuthModalOpen(true)}
          />

          <main className="flex-1 p-3.5 sm:p-6 md:p-8 lg:p-10 max-w-7xl mx-auto w-full pb-20 lg:pb-10">
            <Outlet />
          </main>

          <Footer />
        </div>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <MobileBottomNav />

      {/* Global Modals */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
};
