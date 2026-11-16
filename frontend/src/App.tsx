import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Layout } from './components/layout/Layout';

// Pages
import { HomePage } from './pages/HomePage';
import { ThreatLibraryPage } from './pages/ThreatLibraryPage';
import { ThreatDetailPage } from './pages/ThreatDetailPage';
import { SecurityToolsPage } from './pages/SecurityToolsPage';
import { InteractiveLabPage } from './pages/InteractiveLabPage';
import { AIAssistantPage } from './pages/AIAssistantPage';
import { CyberAlertsPage } from './pages/CyberAlertsPage';
import { EmergencyHelpPage } from './pages/EmergencyHelpPage';
import { IndiaSafetyPage } from './pages/IndiaSafetyPage';
import { CyberQuizPage } from './pages/CyberQuizPage';
import { DashboardPage } from './pages/DashboardPage';
import { AboutPage } from './pages/AboutPage';
import { AdminPage } from './pages/AdminPage';

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="threats" element={<ThreatLibraryPage />} />
            <Route path="threats/:slug" element={<ThreatDetailPage />} />
            <Route path="tools" element={<SecurityToolsPage />} />
            <Route path="tools/:toolSlug" element={<SecurityToolsPage />} />
            <Route path="lab" element={<InteractiveLabPage />} />
            <Route path="ai-assistant" element={<AIAssistantPage />} />
            <Route path="alerts" element={<CyberAlertsPage />} />
            <Route path="emergency" element={<EmergencyHelpPage />} />
            <Route path="india-safety" element={<IndiaSafetyPage />} />
            <Route path="quiz" element={<CyberQuizPage />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="admin" element={<AdminPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};
