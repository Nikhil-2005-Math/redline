import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, ShieldAlert, ArrowRight, Filter, AlertTriangle, Layers, Eye } from 'lucide-react';
import { api } from '../services/api';
import { Threat, ThreatCategory } from '../types';
import { NeonCard } from '../components/common/NeonCard';
import { Badge } from '../components/common/Badge';

export const ThreatLibraryPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [threats, setThreats] = useState<Threat[]>([]);
  const [categories, setCategories] = useState<ThreatCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const selectedCategory = searchParams.get('category') || 'all';
  const selectedDifficulty = searchParams.get('difficulty') || 'all';
  const selectedRisk = searchParams.get('risk') || 'all';
  const searchInput = searchParams.get('search') || '';

  const [searchTerm, setSearchTerm] = useState(searchInput);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await api.getThreatCategories();
        setCategories(res.categories);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCats();
  }, []);

  useEffect(() => {
    const fetchThreatsData = async () => {
      setIsLoading(true);
      try {
        const res = await api.getThreats({
          category: selectedCategory !== 'all' ? selectedCategory : undefined,
          difficulty: selectedDifficulty !== 'all' ? selectedDifficulty : undefined,
          risk: selectedRisk !== 'all' ? selectedRisk : undefined,
          search: searchTerm.trim() || undefined,
        });
        setThreats(res.threats);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    const timer = setTimeout(fetchThreatsData, 200);
    return () => clearTimeout(timer);
  }, [selectedCategory, selectedDifficulty, selectedRisk, searchTerm]);

  const updateFilter = (key: string, val: string) => {
    const next = new URLSearchParams(searchParams);
    if (val === 'all' || !val) {
      next.delete(key);
    } else {
      next.set(key, val);
    }
    setSearchParams(next);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#101014] border border-[#FF3038]/30 text-xs font-mono text-[#FF5555] mb-2">
          <Layers className="w-3.5 h-3.5" />
          <span>COMPREHENSIVE KNOWLEDGE BASE</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black font-heading uppercase text-white tracking-wide">
          Threat <span className="text-[#FF3038]">Library</span>
        </h1>
        <p className="text-sm text-[#A0A0A8] max-w-2xl mt-1">
          Explore structured intelligence on modern cyber threats, how attacks are executed, real-world examples, warning signs, and verified recovery checklists.
        </p>
      </div>

      {/* Filter and Search Controls */}
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="relative max-w-xl">
          <Search className="w-4 h-4 text-[#FF3038] absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search threats by keyword (e.g., Phishing, UPI, Ransomware, Camera)..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#101014] border border-[#FF3038]/30 focus:border-[#FF3038] text-sm text-white placeholder-[#666672] focus:outline-none transition shadow-[0_0_10px_rgba(255,48,56,0.1)]"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => updateFilter('category', 'all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-heading uppercase tracking-wider font-semibold whitespace-nowrap transition ${
              selectedCategory === 'all'
                ? 'bg-[#FF3038] text-white shadow-[0_0_12px_rgba(255,48,56,0.5)]'
                : 'bg-[#101014] text-[#A0A0A8] border border-[#FF3038]/20 hover:border-[#FF3038]/60 hover:text-white'
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => updateFilter('category', cat.slug)}
              className={`px-3 py-1.5 rounded-lg text-xs font-heading uppercase tracking-wider font-semibold whitespace-nowrap transition ${
                selectedCategory === cat.slug
                  ? 'bg-[#FF3038] text-white shadow-[0_0_12px_rgba(255,48,56,0.5)]'
                  : 'bg-[#101014] text-[#A0A0A8] border border-[#FF3038]/20 hover:border-[#FF3038]/60 hover:text-white'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Secondary Filters (Difficulty & Risk) */}
        <div className="flex flex-wrap items-center gap-3 pt-1 text-xs">
          <div className="flex items-center gap-1.5 text-[#A0A0A8] font-mono">
            <Filter className="w-3.5 h-3.5 text-[#FF3038]" />
            <span>Difficulty:</span>
          </div>
          {['all', 'Beginner', 'Intermediate', 'Advanced'].map((diff) => (
            <button
              key={diff}
              onClick={() => updateFilter('difficulty', diff)}
              className={`px-2.5 py-1 rounded text-xs font-mono transition ${
                selectedDifficulty === diff
                  ? 'bg-white/15 text-white border border-white/30'
                  : 'text-[#A0A0A8] hover:text-white'
              }`}
            >
              {diff === 'all' ? 'Any' : diff}
            </button>
          ))}

          <div className="h-4 w-px bg-white/10 mx-2" />

          <div className="flex items-center gap-1.5 text-[#A0A0A8] font-mono">
            <span>Risk Level:</span>
          </div>
          {['all', 'Critical', 'High', 'Medium'].map((r) => (
            <button
              key={r}
              onClick={() => updateFilter('risk', r)}
              className={`px-2.5 py-1 rounded text-xs font-mono transition ${
                selectedRisk === r
                  ? 'bg-[#FF3038]/20 text-[#FF5555] border border-[#FF3038]/40'
                  : 'text-[#A0A0A8] hover:text-white'
              }`}
            >
              {r === 'all' ? 'Any' : r}
            </button>
          ))}
        </div>
      </div>

      {/* Threats Grid */}
      {isLoading ? (
        <div className="py-20 text-center text-[#A0A0A8]">
          <div className="w-8 h-8 border-2 border-[#FF3038] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="font-mono text-xs uppercase tracking-wider">Scanning Threat Repository...</p>
        </div>
      ) : threats.length === 0 ? (
        <div className="py-16 text-center text-[#A0A0A8] bg-[#101014] rounded-2xl border border-[#FF3038]/20 p-8">
          <AlertTriangle className="w-10 h-10 text-[#FF3038] mx-auto mb-3" />
          <h3 className="text-lg font-heading font-bold text-white mb-1">No matching threat topics found</h3>
          <p className="text-xs max-w-md mx-auto">
            Try adjusting your search query or reset filters to explore our complete cybersecurity catalog.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {threats.map((threat) => {
            const riskColor =
              threat.risk_category === 'Critical'
                ? 'red'
                : threat.risk_category === 'High'
                ? 'amber'
                : 'emerald';

            return (
              <NeonCard
                key={threat.id}
                className="p-5 flex flex-col justify-between group"
                onClick={() => navigate(`/threats/${threat.slug}`)}
              >
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-[11px] font-mono text-[#A0A0A8] bg-white/5 border border-white/10 px-2 py-0.5 rounded">
                      {threat.category_name}
                    </span>
                    <Badge variant={riskColor}>{threat.risk_category}</Badge>
                  </div>

                  <h3 className="font-heading font-bold text-lg text-white group-hover:text-[#FF5555] transition mb-2">
                    {threat.name}
                  </h3>

                  <p className="text-xs text-[#A0A0A8] leading-relaxed line-clamp-3 mb-4">
                    {threat.short_desc}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#FF3038]/20 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-[#666672] font-mono text-[11px]">
                    <span>{threat.difficulty}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3" /> {threat.views_count}
                    </span>
                  </div>

                  <span className="text-[#FF5555] font-heading font-semibold uppercase tracking-wider flex items-center gap-1 group-hover:translate-x-1 transition">
                    Deep Dive <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </NeonCard>
            );
          })}
        </div>
      )}
    </div>
  );
};
