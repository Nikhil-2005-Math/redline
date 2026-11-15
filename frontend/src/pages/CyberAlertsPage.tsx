import React, { useState, useEffect } from 'react';
import {
  Bell,
  ExternalLink,
  ShieldAlert,
  Calendar,
  Layers,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Radio
} from 'lucide-react';
import { api } from '../services/api';
import { CyberAlert } from '../types';
import { NeonCard } from '../components/common/NeonCard';
import { Badge } from '../components/common/Badge';

export const CyberAlertsPage: React.FC = () => {
  const [alerts, setAlerts] = useState<CyberAlert[]>([]);
  const [selectedSeverity, setSelectedSeverity] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAlerts = async () => {
      setIsLoading(true);
      try {
        const res = await api.getAlerts({
          severity: selectedSeverity !== 'all' ? selectedSeverity : undefined,
        });
        setAlerts(res.alerts);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAlerts();
  }, [selectedSeverity]);

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#101014] border border-[#FF3038]/30 text-xs font-mono text-[#FF5555] mb-2">
          <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          <span>OFFICIAL SECURITY INTELLIGENCE FEED</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black font-heading uppercase text-white tracking-wide">
          Cyber <span className="text-[#FF3038]">Alerts & Advisories</span>
        </h1>
        <p className="text-sm text-[#A0A0A8] max-w-3xl mt-1">
          Curated real-time advisories, scam warnings, and vulnerability bulletins from verified cybersecurity authorities (CERT-In, CISA, Google Security, RBI).
        </p>
      </div>

      {/* Severity Filter Pills */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-mono text-[#A0A0A8] mr-2 flex items-center gap-1.5">
          <Filter className="w-3.5 h-3.5 text-[#FF3038]" /> Filter Severity:
        </span>
        {['all', 'Critical', 'High', 'Medium'].map((sev) => (
          <button
            key={sev}
            onClick={() => setSelectedSeverity(sev)}
            className={`px-3 py-1 rounded-lg text-xs font-heading uppercase tracking-wider font-semibold border transition ${
              selectedSeverity === sev
                ? 'bg-[#FF3038] text-white border-[#FF3038] shadow-[0_0_12px_rgba(255,48,56,0.4)]'
                : 'bg-[#101014] text-[#A0A0A8] border-[#FF3038]/20 hover:text-white'
            }`}
          >
            {sev === 'all' ? 'All Alerts' : sev}
          </button>
        ))}
      </div>

      {/* Alerts Stream */}
      {isLoading ? (
        <div className="py-20 text-center text-[#A0A0A8]">
          <div className="w-8 h-8 border-2 border-[#FF3038] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="font-mono text-xs uppercase">Fetching Official Advisories...</p>
        </div>
      ) : alerts.length === 0 ? (
        <div className="py-16 text-center text-[#A0A0A8] bg-[#101014] rounded-2xl border border-white/10 p-8">
          <p>No active alerts matching this filter.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {alerts.map((alert) => {
            const sevColor =
              alert.severity === 'Critical'
                ? 'red'
                : alert.severity === 'High'
                ? 'amber'
                : 'emerald';

            return (
              <NeonCard key={alert.id} className="p-6 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant={sevColor}>{alert.severity}</Badge>
                    <span className="text-xs font-mono text-white bg-white/5 border border-white/10 px-2 py-0.5 rounded">
                      Source: {alert.source}
                    </span>
                    <span className="text-xs font-mono text-[#A0A0A8] bg-white/5 px-2 py-0.5 rounded">
                      Category: {alert.category}
                    </span>
                  </div>

                  <span className="text-xs font-mono text-[#666672] flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    {alert.published_at}
                  </span>
                </div>

                <div>
                  <h3 className="font-heading font-bold text-lg sm:text-xl text-white">
                    {alert.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#A0A0A8] leading-relaxed mt-2">
                    {alert.summary}
                  </p>
                </div>

                {alert.recommended_action && (
                  <div className="p-3.5 rounded-xl bg-[#08080C] border border-emerald-500/30 text-xs text-[#D8EED8] space-y-1">
                    <p className="font-heading font-bold uppercase text-emerald-400">Recommended Protective Action:</p>
                    <p className="leading-relaxed">{alert.recommended_action}</p>
                  </div>
                )}

                <div className="pt-2 border-t border-[#FF3038]/15 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <span className="font-mono text-[#666672]">
                    Affected: {alert.affected_systems}
                  </span>

                  {alert.original_url && (
                    <a
                      href={alert.original_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#FF5555] hover:text-white font-mono flex items-center gap-1 font-semibold"
                    >
                      <span>Official Source Advisory</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </NeonCard>
            );
          })}
        </div>
      )}
    </div>
  );
};
