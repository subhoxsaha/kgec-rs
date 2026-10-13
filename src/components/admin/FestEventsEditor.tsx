import React, { useState } from 'react';
import {
  Zap,
  Activity,
  Trophy,
  Search,
  Copy,
  Download,
  RefreshCw,
  FolderTree,
  Check,
  Sparkles,
  Bot,
  Tag,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useReportData } from '../../context/ReportDataContext';
import { FestEvent } from '../../data/techtixZyroEventsData';
import { fetchStaticEventsData } from '../../utils/teamUtils';

export const FestEventsEditor: React.FC = () => {
  const {
    festEvents = [],
    festPhases = [],
    trackPassages = {},
    updateFestEvent,
    showToast,
  } = useReportData();

  const [activeSubTab, setActiveSubTab] = useState<'tracks' | 'timeline' | 'events'>('events');
  const [expandedEventId, setExpandedEventId] = useState<string | null>(null);
  const [eventSearch, setEventSearch] = useState('');
  const [filterFest, setFilterFest] = useState<'ALL' | 'TECHTIX' | 'ZYRO' | 'WORKSHOP'>('ALL');
  const [copiedEventsJson, setCopiedEventsJson] = useState(false);
  const [isSyncingEvents, setIsSyncingEvents] = useState(false);

  const handleCopyEventsJson = () => {
    const fullObj = {
      festEvents,
      festPhases,
      trackPassages,
    };
    navigator.clipboard.writeText(JSON.stringify(fullObj, null, 2));
    setCopiedEventsJson(true);
    showToast('Copied events configuration to clipboard!');
    setTimeout(() => setCopiedEventsJson(false), 2500);
  };

  const handleDownloadEventsJson = () => {
    const fullObj = {
      festEvents,
      festPhases,
      trackPassages,
    };
    const blob = new Blob([JSON.stringify(fullObj, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'events.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Downloaded events.json');
  };

  const handleReloadEventsFile = async () => {
    setIsSyncingEvents(true);
    try {
      const data = await fetchStaticEventsData();
      if (data && Array.isArray(data.festEvents) && data.festEvents.length > 0) {
        data.festEvents.forEach((ev: FestEvent) => {
          updateFestEvent(ev.id, ev);
        });
        showToast(`Synced ${data.festEvents.length} events from /public/data/events.json`);
      }
    } catch {
      showToast('Could not reload from /public/data/events.json');
    } finally {
      setIsSyncingEvents(false);
    }
  };

  const filteredEvents = festEvents.filter((e) => {
    const matchesFest = filterFest === 'ALL' || e.fest === filterFest;
    const matchesSearch =
      e.title.toLowerCase().includes(eventSearch.toLowerCase()) ||
      e.category.toLowerCase().includes(eventSearch.toLowerCase()) ||
      e.tagline.toLowerCase().includes(eventSearch.toLowerCase());
    return matchesFest && matchesSearch;
  });

  return (
    <div className="space-y-4 text-[#243324] dark:text-[#F4EFE6]">
      {/* Static File Architecture Banner */}
      <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-emerald-950 dark:text-emerald-200">
        <div className="flex items-start gap-2.5">
          <FolderTree className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <p className="font-bold">
              Hardcoded Events Architecture: <code className="font-mono bg-emerald-500/20 px-1.5 py-0.5 rounded text-[11px]">public/data/events.json</code> &amp; <code className="font-mono bg-emerald-500/20 px-1.5 py-0.5 rounded text-[11px]">public/events/</code>
            </p>
            <p className="text-[11px] text-[#3F543C] dark:text-[#CBD7C7] leading-relaxed">
              All events, arenas, sprint tracks, and workshop timelines are loaded from hardcoded data.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
          <button
            type="button"
            onClick={handleReloadEventsFile}
            disabled={isSyncingEvents}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-white dark:bg-[#20301F] border border-emerald-500/40 hover:bg-emerald-50 text-[11px] font-semibold text-emerald-900 dark:text-emerald-200 cursor-pointer shadow-2xs"
            title="Reload data from /public/data/events.json"
          >
            <RefreshCw className={`w-3 h-3 ${isSyncingEvents ? 'animate-spin' : ''}`} />
            <span>Reload file</span>
          </button>
          <button
            type="button"
            onClick={handleCopyEventsJson}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-800 hover:bg-emerald-700 text-[11px] font-semibold text-white cursor-pointer shadow-2xs"
            title="Copy JSON configuration for public/data/events.json"
          >
            {copiedEventsJson ? <Check className="w-3 h-3 text-emerald-300" /> : <Copy className="w-3 h-3" />}
            <span>{copiedEventsJson ? 'Copied' : 'Copy JSON'}</span>
          </button>
          <button
            type="button"
            onClick={handleDownloadEventsJson}
            className="p-1 rounded bg-white dark:bg-[#20301F] border border-emerald-500/40 hover:bg-emerald-50 text-emerald-900 dark:text-emerald-200 cursor-pointer"
            title="Download events.json"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Info Strip */}
      <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs flex items-center justify-between gap-2.5">
        <div className="flex items-start gap-2">
          <Sparkles className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400 mt-0.5" />
          <div>
            <p className="text-emerald-950 dark:text-emerald-200 font-semibold">
              TECHTIX &amp; ZYRO Fest Arenas &bull; Read-Only Catalog
            </p>
            <p className="text-emerald-800/80 dark:text-emerald-300/80 text-[11px]">
              Inspect arena rules, sprint timeline directives, and square card passages.
            </p>
          </div>
        </div>

        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-mono font-semibold bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border border-emerald-500/20">
          <Trophy className="w-3 h-3" />
          <span>{festEvents.length} Events Listed</span>
        </span>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#243324]/5 dark:bg-white/5 border border-[#243324]/10 dark:border-white/10 text-xs font-mono overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveSubTab('events')}
          className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
            activeSubTab === 'events'
              ? 'bg-emerald-600 text-white font-semibold shadow-xs'
              : 'text-[#243324]/70 dark:text-white/70 hover:text-[#243324] dark:hover:text-white'
          }`}
        >
          <Trophy className="w-3.5 h-3.5" />
          <span>Fest &amp; Arena Events ({festEvents.length})</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveSubTab('tracks')}
          className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
            activeSubTab === 'tracks'
              ? 'bg-emerald-600 text-white font-semibold shadow-xs'
              : 'text-[#243324]/70 dark:text-white/70 hover:text-[#243324] dark:hover:text-white'
          }`}
        >
          <Zap className="w-3.5 h-3.5" />
          <span>Square Reveal Tracks (4)</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveSubTab('timeline')}
          className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
            activeSubTab === 'timeline'
              ? 'bg-emerald-600 text-white font-semibold shadow-xs'
              : 'text-[#243324]/70 dark:text-white/70 hover:text-[#243324] dark:hover:text-white'
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          <span>Sprint Timeline &amp; Directives</span>
        </button>
      </div>

      {/* 1. FEST & ARENA EVENTS (Read-Only) */}
      {activeSubTab === 'events' && (
        <div className="space-y-3">
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              {(['ALL', 'TECHTIX', 'ZYRO', 'WORKSHOP'] as const).map((fest) => (
                <button
                  key={fest}
                  type="button"
                  onClick={() => setFilterFest(fest)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
                    filterFest === fest
                      ? 'bg-emerald-600 text-white font-semibold'
                      : 'bg-[#243324]/5 dark:bg-white/5 text-[#243324]/70 dark:text-white/70 hover:text-[#243324] dark:hover:text-white'
                  }`}
                >
                  {fest}
                </button>
              ))}
            </div>

            <div className="relative flex-1 sm:w-60">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#243324]/40 dark:text-white/40" />
              <input
                type="text"
                placeholder="Filter events by title or category..."
                value={eventSearch}
                onChange={(e) => setEventSearch(e.target.value)}
                className="w-full pl-8 pr-2.5 py-1.5 rounded-lg bg-[#FAF7F0] dark:bg-[#111910] border border-[#243324]/15 dark:border-white/15 text-xs"
              />
            </div>
          </div>

          {/* Event Cards Catalog */}
          <div className="space-y-2.5">
            {filteredEvents.map((event) => {
              const isExpanded = expandedEventId === event.id;

              return (
                <div
                  key={event.id}
                  className="p-3.5 rounded-xl bg-white dark:bg-[#1A2619] border border-[#243324]/10 dark:border-white/10 shadow-2xs space-y-2 text-xs"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border border-emerald-500/20">
                          {event.fest}
                        </span>
                        <h4 className="font-bold text-sm text-[#1F2B1D] dark:text-white truncate">
                          {event.title}
                        </h4>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/10 text-[#526340] dark:text-[#A3B59E]">
                          {event.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#4A5D44] dark:text-[#CBD7C7] leading-relaxed">
                        {event.tagline || event.description}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setExpandedEventId(isExpanded ? null : event.id)}
                      className="px-2.5 py-1 rounded-lg border border-[#243324]/15 dark:border-white/15 text-xs font-medium hover:bg-[#243324]/10 dark:hover:bg-white/10 flex items-center gap-1 cursor-pointer shrink-0"
                    >
                      <span className="text-emerald-800 dark:text-emerald-400 font-semibold text-[11px]">
                        {isExpanded ? 'Hide Specs' : 'View Rules'}
                      </span>
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  {/* Summary Strip */}
                  <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-[#243324]/8 dark:border-white/8 text-[11px] text-[#526340] dark:text-[#A3B59E]">
                    <span>Prize: <strong className="text-emerald-800 dark:text-emerald-300 font-mono">{event.prizePool}</strong></span>
                    <span>&bull;</span>
                    <span>Team: <strong className="text-[#1F2B1D] dark:text-white">{event.teamSize}</strong></span>
                    <span>&bull;</span>
                    <span>Duration: <strong className="text-[#1F2B1D] dark:text-white">{event.duration}</strong></span>
                    {event.arenaOrTrack && (
                      <>
                        <span>&bull;</span>
                        <span>Arena: <strong className="text-[#1F2B1D] dark:text-white">{event.arenaOrTrack}</strong></span>
                      </>
                    )}
                  </div>

                  {/* Expanded Rules and Requirements */}
                  {isExpanded && (
                    <div className="pt-2.5 border-t border-[#243324]/10 dark:border-white/10 space-y-2 text-xs bg-[#FAF7F0] dark:bg-[#111910] p-3 rounded-lg animate-in fade-in duration-150">
                      {event.description && (
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#526340] dark:text-[#A3B59E] block mb-0.5">
                            Event Description
                          </span>
                          <p className="text-[#3F543C] dark:text-[#CBD7C7] leading-relaxed">
                            {event.description}
                          </p>
                        </div>
                      )}

                      {event.rulesHighlights && event.rulesHighlights.length > 0 && (
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400 block mb-1">
                            Rule Highlights
                          </span>
                          <ul className="list-disc list-inside space-y-0.5 text-[11px] text-[#3F543C] dark:text-[#CBD7C7]">
                            {event.rulesHighlights.map((r, rIdx) => (
                              <li key={rIdx}>{r}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {event.specsRequirements && event.specsRequirements.length > 0 && (
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-800 dark:text-indigo-400 block mb-1">
                            Technical Requirements
                          </span>
                          <ul className="list-disc list-inside space-y-0.5 text-[11px] text-[#3F543C] dark:text-[#CBD7C7]">
                            {event.specsRequirements.map((s, sIdx) => (
                              <li key={sIdx}>{s}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. SQUARE CARD PASSAGES & MISSION TEXTS */}
      {activeSubTab === 'tracks' && (
        <div className="space-y-3">
          <div className="text-xs text-[#526340] dark:text-[#A3B59E]">
            Concisely structured mission passages for the 4 interactive square reveal cards.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { key: 'agv', defaultCode: 'TRACK 01 // AGV', defaultTitle: 'Autonomous Navigation' },
              { key: 'bionics', defaultCode: 'TRACK 02 // BIONICS', defaultTitle: 'Assistive Mechatronics' },
              { key: 'uav', defaultCode: 'TRACK 03 // UAV', defaultTitle: 'Aerial Reconnaissance' },
              { key: 'industrial', defaultCode: 'TRACK 04 // ROBOTICS', defaultTitle: 'Industrial Manipulation' },
            ].map(({ key, defaultCode, defaultTitle }) => {
              const current = trackPassages[key] || {
                code: defaultCode,
                title: defaultTitle,
                passage: '',
              };

              return (
                <div
                  key={key}
                  className="p-3.5 rounded-xl bg-white dark:bg-[#1A2619] border border-[#243324]/10 dark:border-white/10 shadow-2xs space-y-2"
                >
                  <div className="flex items-center justify-between pb-1.5 border-b border-[#243324]/10 dark:border-white/10">
                    <span className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400">
                      {current.code || defaultCode}
                    </span>
                    <span className="text-[11px] font-mono text-[#243324]/60 dark:text-white/60">
                      {current.title || defaultTitle}
                    </span>
                  </div>

                  <div className="p-2.5 rounded bg-[#FAF7F0] dark:bg-[#111910] border border-[#243324]/10 dark:border-white/10 text-xs">
                    <p className="text-[#3F543C] dark:text-[#CBD7C7] leading-relaxed">
                      {current.passage || 'High-performance track testing engineering precision and autonomy.'}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. SPRINT TIMELINE & DIRECTIVES */}
      {activeSubTab === 'timeline' && (
        <div className="space-y-3">
          <div className="text-xs text-[#526340] dark:text-[#A3B59E]">
            Sprint timeline checkpoints and AI verification directives for the 36-hour challenge.
          </div>

          <div className="space-y-2.5">
            {festPhases.map((phase) => (
              <div
                key={phase.step}
                className="p-3.5 rounded-xl bg-white dark:bg-[#1A2619] border border-[#243324]/10 dark:border-white/10 shadow-2xs space-y-2 text-xs"
              >
                <div className="flex items-center justify-between pb-1.5 border-b border-[#243324]/10 dark:border-white/10">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[10px] font-bold font-mono flex items-center justify-center">
                      {phase.step}
                    </span>
                    <h5 className="font-bold text-[#1F2B1D] dark:text-white">{phase.title}</h5>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-700 dark:text-emerald-400 font-semibold">
                    {phase.month}
                  </span>
                </div>

                <p className="text-[11px] text-[#4A5D44] dark:text-[#CBD7C7] leading-relaxed">
                  {phase.desc}
                </p>

                {phase.aiNote && (
                  <div className="p-2 rounded bg-emerald-500/10 border border-emerald-500/20 flex items-start gap-1.5 text-[11px] text-emerald-900 dark:text-emerald-200">
                    <Bot className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <span>Directive: {phase.aiNote}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
