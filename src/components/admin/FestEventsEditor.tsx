import React, { useState } from 'react';
import {
  Zap,
  Activity,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  Sparkles,
  Trophy,
  Flame,
  Bot,
  RotateCcw,
  Tag,
  Search,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useReportData } from '../../context/ReportDataContext';
import { FestEvent } from '../../data/techtixZyroEventsData';
import { PhaseItem } from '../ZyroSection';

export const FestEventsEditor: React.FC = () => {
  const {
    festEvents = [],
    festPhases = [],
    trackPassages = {},
    updateFestEvent,
    addFestEvent,
    deleteFestEvent,
    updateFestPhase,
    updateTrackPassage,
    resetFestDataToDefaults,
    showToast,
  } = useReportData();

  const [activeSubTab, setActiveSubTab] = useState<'tracks' | 'timeline' | 'events' | 'workshops'>('tracks');
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [editingEventForm, setEditingEventForm] = useState<Partial<FestEvent>>({});
  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [eventSearch, setEventSearch] = useState('');
  const [filterFest, setFilterFest] = useState<'ALL' | 'TECHTIX' | 'ZYRO' | 'WORKSHOP'>('ALL');

  // New Event Form State
  const [newEventForm, setNewEventForm] = useState<Partial<FestEvent>>({
    fest: 'TECHTIX',
    title: '',
    tagline: '',
    category: 'Combat Mechatronics',
    arenaOrTrack: 'Main Arena',
    prizePool: '₹25,000+',
    teamSize: '2–4 Members',
    duration: '2 Rounds',
    description: '',
    bannerUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
    rulesHighlights: [],
    specsRequirements: [],
  });

  const handleStartEditEvent = (event: FestEvent) => {
    setEditingEventId(event.id);
    setEditingEventForm({ ...event });
  };

  const handleSaveEditEvent = () => {
    if (!editingEventId) return;
    updateFestEvent(editingEventId, editingEventForm);
    setEditingEventId(null);
    setEditingEventForm({});
    showToast('Event updated successfully in CMS');
  };

  const handleCreateEvent = () => {
    if (!newEventForm.title?.trim()) {
      showToast('Please enter an event title');
      return;
    }
    const id = `event-${Date.now().toString(36)}`;
    const fullEvent: FestEvent = {
      id,
      fest: newEventForm.fest || 'TECHTIX',
      title: newEventForm.title || 'New Event',
      tagline: newEventForm.tagline || 'Engineering Challenge',
      category: newEventForm.category || 'Robotics',
      arenaOrTrack: newEventForm.arenaOrTrack || 'Arena',
      prizePool: newEventForm.prizePool || '₹10,000+',
      teamSize: newEventForm.teamSize || '2–4 Members',
      duration: newEventForm.duration || 'Full Day',
      description: newEventForm.description || '',
      rulesHighlights: newEventForm.rulesHighlights || ['Adhere to technical safety specifications'],
      specsRequirements: newEventForm.specsRequirements || ['Battery voltage limits verified'],
      bannerUrl: newEventForm.bannerUrl || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
    };
    addFestEvent(fullEvent);
    setIsAddingEvent(false);
    setNewEventForm({
      fest: 'TECHTIX',
      title: '',
      tagline: '',
      category: 'Combat Mechatronics',
      arenaOrTrack: 'Main Arena',
      prizePool: '₹25,000+',
      teamSize: '2–4 Members',
      duration: '2 Rounds',
      description: '',
      bannerUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
      rulesHighlights: [],
      specsRequirements: [],
    });
    showToast('New event created in CMS');
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
      {/* Banner */}
      <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs flex items-center justify-between gap-2.5">
        <div className="flex items-start gap-2">
          <Sparkles className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400 mt-0.5" />
          <p className="text-emerald-950 dark:text-emerald-200 font-medium">
            Full CMS Control for TECHTIX & ZYRO: Edit tracks, square card passages, sprint timeline, and event rules.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            if (confirm('Reset all TECHTIX & ZYRO data, tracks, and timeline to defaults?')) {
              resetFestDataToDefaults();
              showToast('Reset TECHTIX & ZYRO to defaults');
            }
          }}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-mono text-emerald-800 dark:text-emerald-300 hover:bg-emerald-500/20 border border-emerald-500/30 transition-colors shrink-0 cursor-pointer"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset Defaults</span>
        </button>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#243324]/5 dark:bg-white/5 border border-[#243324]/10 dark:border-white/10 text-xs font-mono overflow-x-auto">
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
          <span>Sprint Timeline & AI Directives</span>
        </button>
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
          <span>Fest & Arena Events</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 1. SQUARE CARD PASSAGES & MISSION TEXTS                                    */}
      {/* ========================================================================= */}
      {activeSubTab === 'tracks' && (
        <div className="space-y-3">
          <div className="text-xs text-[#526340] dark:text-[#A3B59E]">
            Edit the concise 1–2 sentence mission passages displayed on the back of the 4 square reveal cards.
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
                  className="p-3.5 rounded-xl bg-white dark:bg-[#1A2619] border border-[#243324]/10 dark:border-white/10 shadow-2xs space-y-2.5"
                >
                  <div className="flex items-center justify-between pb-1.5 border-b border-[#243324]/10 dark:border-white/10">
                    <span className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400">
                      {current.code || defaultCode}
                    </span>
                    <span className="text-[11px] font-mono text-[#243324]/60 dark:text-white/60">
                      {current.title || defaultTitle}
                    </span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div>
                      <label className="block text-[10px] font-mono font-semibold text-[#526340] dark:text-[#A3B59E] mb-1">
                        Track Code Header
                      </label>
                      <input
                        type="text"
                        value={current.code || ''}
                        onChange={(e) => updateTrackPassage(key, { code: e.target.value })}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-[#FAF7F0] dark:bg-[#111910] border border-[#243324]/15 dark:border-white/15 font-mono text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono font-semibold text-[#526340] dark:text-[#A3B59E] mb-1">
                        Track Title
                      </label>
                      <input
                        type="text"
                        value={current.title || ''}
                        onChange={(e) => updateTrackPassage(key, { title: e.target.value })}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-[#FAF7F0] dark:bg-[#111910] border border-[#243324]/15 dark:border-white/15 text-xs font-semibold"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono font-semibold text-[#526340] dark:text-[#A3B59E] mb-1">
                        Back of Card Passage (1–2 sentences)
                      </label>
                      <textarea
                        rows={3}
                        value={current.passage || ''}
                        onChange={(e) => updateTrackPassage(key, { passage: e.target.value })}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-[#FAF7F0] dark:bg-[#111910] border border-[#243324]/15 dark:border-white/15 text-xs leading-relaxed"
                        placeholder="Concise mission statement for the back of the reveal card..."
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. SPRINT TIMELINE & AI DIRECTIVES                                         */}
      {/* ========================================================================= */}
      {activeSubTab === 'timeline' && (
        <div className="space-y-3">
          <div className="text-xs text-[#526340] dark:text-[#A3B59E]">
            Edit timeline milestone steps, months, descriptions, and the dynamic AI directive displayed under selected milestones.
          </div>

          <div className="space-y-3">
            {festPhases.map((phase: PhaseItem) => (
              <div
                key={phase.step}
                className="p-3.5 rounded-xl bg-white dark:bg-[#1A2619] border border-[#243324]/10 dark:border-white/10 shadow-2xs space-y-2.5"
              >
                <div className="flex items-center justify-between pb-1.5 border-b border-[#243324]/10 dark:border-white/10">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-mono text-[10px] font-bold flex items-center justify-center">
                      {phase.step}
                    </span>
                    <span className="text-xs font-bold text-[#1F2B1D] dark:text-white">
                      Step {phase.step}: {phase.title}
                    </span>
                  </div>
                  <span className="text-xs font-mono font-semibold text-emerald-700 dark:text-emerald-400">
                    {phase.month}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  <div>
                    <label className="block text-[10px] font-mono font-semibold text-[#526340] dark:text-[#A3B59E] mb-1">
                      Step Number
                    </label>
                    <input
                      type="text"
                      value={phase.step}
                      onChange={(e) => updateFestPhase(phase.step, { step: e.target.value })}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-[#FAF7F0] dark:bg-[#111910] border border-[#243324]/15 dark:border-white/15 font-mono text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono font-semibold text-[#526340] dark:text-[#A3B59E] mb-1">
                      Month Label
                    </label>
                    <input
                      type="text"
                      value={phase.month}
                      onChange={(e) => updateFestPhase(phase.step, { month: e.target.value })}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-[#FAF7F0] dark:bg-[#111910] border border-[#243324]/15 dark:border-white/15 font-mono text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono font-semibold text-[#526340] dark:text-[#A3B59E] mb-1">
                      Milestone Title
                    </label>
                    <input
                      type="text"
                      value={phase.title}
                      onChange={(e) => updateFestPhase(phase.step, { title: e.target.value })}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-[#FAF7F0] dark:bg-[#111910] border border-[#243324]/15 dark:border-white/15 text-xs font-semibold"
                    />
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <div>
                    <label className="block text-[10px] font-mono font-semibold text-[#526340] dark:text-[#A3B59E] mb-1">
                      Phase Summary Description
                    </label>
                    <input
                      type="text"
                      value={phase.desc}
                      onChange={(e) => updateFestPhase(phase.step, { desc: e.target.value })}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-[#FAF7F0] dark:bg-[#111910] border border-[#243324]/15 dark:border-white/15 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono font-semibold text-emerald-700 dark:text-emerald-400 mb-1 flex items-center gap-1">
                      <Bot className="w-3 h-3" />
                      <span>AI Directive (Expanded upon scroll selection)</span>
                    </label>
                    <textarea
                      rows={2}
                      value={phase.aiNote || ''}
                      onChange={(e) => updateFestPhase(phase.step, { aiNote: e.target.value })}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-[#FAF7F0] dark:bg-[#111910] border border-[#243324]/15 dark:border-white/15 text-xs leading-relaxed font-mono"
                      placeholder="Single clean sentence summarizing AI verification target..."
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. FEST & ARENA EVENTS CMS                                                */}
      {/* ========================================================================= */}
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

            <div className="flex items-center gap-2">
              <div className="relative flex-1 sm:w-48">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#243324]/40 dark:text-white/40" />
                <input
                  type="text"
                  placeholder="Filter events..."
                  value={eventSearch}
                  onChange={(e) => setEventSearch(e.target.value)}
                  className="w-full pl-8 pr-2.5 py-1 rounded-lg bg-[#FAF7F0] dark:bg-[#111910] border border-[#243324]/15 dark:border-white/15 text-xs"
                />
              </div>

              <button
                type="button"
                onClick={() => setIsAddingEvent(!isAddingEvent)}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium bg-emerald-600 hover:bg-emerald-700 text-white transition-colors cursor-pointer shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Event</span>
              </button>
            </div>
          </div>

          {/* Add Event Form Modal / Inline Box */}
          {isAddingEvent && (
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-emerald-500/20">
                <h4 className="text-xs font-bold font-mono text-emerald-900 dark:text-emerald-300 uppercase">
                  Add New Fest Event
                </h4>
                <button
                  type="button"
                  onClick={() => setIsAddingEvent(false)}
                  className="text-emerald-800 dark:text-emerald-300 hover:text-emerald-950 dark:hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                <div>
                  <label className="block text-[10px] font-mono font-semibold mb-1">Fest Division</label>
                  <select
                    value={newEventForm.fest}
                    onChange={(e) => setNewEventForm({ ...newEventForm, fest: e.target.value as any })}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-[#111910] border border-emerald-500/30 text-xs"
                  >
                    <option value="TECHTIX">TECHTIX</option>
                    <option value="ZYRO">ZYRO</option>
                    <option value="WORKSHOP">WORKSHOP</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[10px] font-mono font-semibold mb-1">Event Title</label>
                  <input
                    type="text"
                    value={newEventForm.title || ''}
                    onChange={(e) => setNewEventForm({ ...newEventForm, title: e.target.value })}
                    placeholder="e.g. ROBO-CLASH: Heavyweight Robowars"
                    className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-[#111910] border border-emerald-500/30 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                <div>
                  <label className="block text-[10px] font-mono font-semibold mb-1">Tagline</label>
                  <input
                    type="text"
                    value={newEventForm.tagline || ''}
                    onChange={(e) => setNewEventForm({ ...newEventForm, tagline: e.target.value })}
                    placeholder="e.g. Extreme Mechatronics in Steel Cage"
                    className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-[#111910] border border-emerald-500/30 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono font-semibold mb-1">Category</label>
                  <input
                    type="text"
                    value={newEventForm.category || ''}
                    onChange={(e) => setNewEventForm({ ...newEventForm, category: e.target.value })}
                    placeholder="e.g. Combat Mechatronics"
                    className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-[#111910] border border-emerald-500/30 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                <div>
                  <label className="block text-[10px] font-mono font-semibold mb-1">Prize Pool</label>
                  <input
                    type="text"
                    value={newEventForm.prizePool || ''}
                    onChange={(e) => setNewEventForm({ ...newEventForm, prizePool: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-[#111910] border border-emerald-500/30 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono font-semibold mb-1">Team Size</label>
                  <input
                    type="text"
                    value={newEventForm.teamSize || ''}
                    onChange={(e) => setNewEventForm({ ...newEventForm, teamSize: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-[#111910] border border-emerald-500/30 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono font-semibold mb-1">Duration / Rounds</label>
                  <input
                    type="text"
                    value={newEventForm.duration || ''}
                    onChange={(e) => setNewEventForm({ ...newEventForm, duration: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-[#111910] border border-emerald-500/30 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono font-semibold mb-1">Description</label>
                <textarea
                  rows={2}
                  value={newEventForm.description || ''}
                  onChange={(e) => setNewEventForm({ ...newEventForm, description: e.target.value })}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-[#111910] border border-emerald-500/30 text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsAddingEvent(false)}
                  className="px-3 py-1.5 rounded-lg text-xs border border-emerald-500/30 text-emerald-900 dark:text-emerald-200"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleCreateEvent}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700"
                >
                  Save Event
                </button>
              </div>
            </div>
          )}

          {/* Events List */}
          <div className="space-y-2.5">
            {filteredEvents.map((event) => {
              const isEditing = editingEventId === event.id;

              if (isEditing) {
                return (
                  <div
                    key={event.id}
                    className="p-3.5 rounded-xl bg-white dark:bg-[#1A2619] border-2 border-emerald-500 shadow-md space-y-2.5 text-xs"
                  >
                    <div className="flex items-center justify-between pb-1.5 border-b border-[#243324]/10 dark:border-white/10">
                      <span className="font-mono font-bold text-emerald-600">Editing: {event.title}</span>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={handleSaveEditEvent}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-600 text-white font-semibold text-xs hover:bg-emerald-700"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Done</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingEventId(null)}
                          className="p-1 rounded text-[#243324]/70 dark:text-white/70 hover:bg-[#243324]/10"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-mono font-semibold mb-0.5">Title</label>
                        <input
                          type="text"
                          value={editingEventForm.title || ''}
                          onChange={(e) => setEditingEventForm({ ...editingEventForm, title: e.target.value })}
                          className="w-full px-2 py-1 rounded bg-[#FAF7F0] dark:bg-[#111910] border border-[#243324]/15 dark:border-white/15"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono font-semibold mb-0.5">Tagline</label>
                        <input
                          type="text"
                          value={editingEventForm.tagline || ''}
                          onChange={(e) => setEditingEventForm({ ...editingEventForm, tagline: e.target.value })}
                          className="w-full px-2 py-1 rounded bg-[#FAF7F0] dark:bg-[#111910] border border-[#243324]/15 dark:border-white/15"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <div>
                        <label className="block text-[10px] font-mono font-semibold mb-0.5">Category</label>
                        <input
                          type="text"
                          value={editingEventForm.category || ''}
                          onChange={(e) => setEditingEventForm({ ...editingEventForm, category: e.target.value })}
                          className="w-full px-2 py-1 rounded bg-[#FAF7F0] dark:bg-[#111910] border border-[#243324]/15 dark:border-white/15"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono font-semibold mb-0.5">Prize Pool</label>
                        <input
                          type="text"
                          value={editingEventForm.prizePool || ''}
                          onChange={(e) => setEditingEventForm({ ...editingEventForm, prizePool: e.target.value })}
                          className="w-full px-2 py-1 rounded bg-[#FAF7F0] dark:bg-[#111910] border border-[#243324]/15 dark:border-white/15"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono font-semibold mb-0.5">Duration</label>
                        <input
                          type="text"
                          value={editingEventForm.duration || ''}
                          onChange={(e) => setEditingEventForm({ ...editingEventForm, duration: e.target.value })}
                          className="w-full px-2 py-1 rounded bg-[#FAF7F0] dark:bg-[#111910] border border-[#243324]/15 dark:border-white/15"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono font-semibold mb-0.5">Description</label>
                      <textarea
                        rows={2}
                        value={editingEventForm.description || ''}
                        onChange={(e) => setEditingEventForm({ ...editingEventForm, description: e.target.value })}
                        className="w-full px-2 py-1 rounded bg-[#FAF7F0] dark:bg-[#111910] border border-[#243324]/15 dark:border-white/15"
                      />
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={event.id}
                  className="p-3 rounded-xl bg-white dark:bg-[#1A2619] border border-[#243324]/10 dark:border-white/10 shadow-2xs flex items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-0.5 min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-emerald-500/15 text-emerald-700 dark:text-emerald-400">
                        {event.fest}
                      </span>
                      <h4 className="font-semibold text-[#1F2B1D] dark:text-white truncate">
                        {event.title}
                      </h4>
                    </div>
                    <p className="text-[11px] text-[#4A5D44] dark:text-[#CBD7C7] truncate">
                      {event.tagline || event.category} • Prize: {event.prizePool}
                    </p>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleStartEditEvent(event)}
                      className="p-1.5 rounded-lg text-[#243324]/70 dark:text-white/70 hover:bg-[#243324]/10 dark:hover:bg-white/10"
                      title="Edit event"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`Delete event "${event.title}"?`)) {
                          deleteFestEvent(event.id);
                          showToast('Event deleted from CMS');
                        }
                      }}
                      className="p-1.5 rounded-lg text-rose-600 dark:text-rose-400 hover:bg-rose-500/10"
                      title="Delete event"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
