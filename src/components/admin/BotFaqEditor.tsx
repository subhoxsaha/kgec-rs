import React, { useState } from 'react';
import {
  MessageSquare,
  Sparkles,
  Search,
  ChevronDown,
  ChevronUp,
  FolderTree,
} from 'lucide-react';
import { BOT_QUICK_QUESTIONS, BotQuickQuestion } from '../../data/robotQuestions';

export const BotFaqEditor: React.FC = () => {
  const [questions] = useState<BotQuickQuestion[]>(() => {
    try {
      const saved = localStorage.getItem('krs_bot_faq_v1');
      if (saved) return JSON.parse(saved);
    } catch {}
    return BOT_QUICK_QUESTIONS;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = questions.filter(
    (q) =>
      q.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4 text-[#243324] dark:text-[#F4EFE6]">
      {/* Header Banner */}
      <div className="p-3.5 rounded-xl bg-teal-500/10 border border-teal-500/20 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start gap-2.5">
          <Sparkles className="w-4 h-4 shrink-0 text-teal-600 dark:text-teal-400 mt-0.5" />
          <div>
            <span className="font-bold text-teal-950 dark:text-teal-200">
              Interactive Hero Robot Mascot Knowledge Base (Read-Only)
            </span>
            <p className="text-teal-900/80 dark:text-teal-300/80 mt-0.5">
              Inspect the hardcoded conversational replies, knowledge questions, and jump targets powering the home screen companion.
            </p>
          </div>
        </div>

        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-semibold bg-teal-500/10 text-teal-800 dark:text-teal-300 border border-teal-500/20 shrink-0">
          <FolderTree className="w-3.5 h-3.5" />
          <span>{questions.length} Questions Cataloged</span>
        </span>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#657351] dark:text-[#8E9F89]" />
        <input
          type="text"
          placeholder="Search bot prompt questions or answers..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-3 py-2 rounded-xl bg-white dark:bg-[#182417] border border-[#243324]/15 dark:border-white/10 text-xs placeholder:text-[#657351]/70"
        />
      </div>

      {/* Questions List */}
      <div className="space-y-2.5">
        {filtered.map((item, idx) => {
          const isExpanded = expandedId === item.id;
          return (
            <div
              key={item.id}
              className="p-3.5 rounded-xl bg-white dark:bg-[#1A2619] border border-[#243324]/10 dark:border-white/10 shadow-2xs space-y-2 text-xs"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="p-1.5 rounded-lg bg-teal-500/15 text-teal-700 dark:text-teal-300 shrink-0">
                    <MessageSquare className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-[#1F2B1D] dark:text-[#F4EFE6] truncate">
                        {item.label}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-black/5 dark:bg-white/10 text-[#657351] dark:text-[#A3B59E]">
                        {item.category}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#526340] dark:text-[#9DAE9A] truncate max-w-md">
                      {item.answer}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setExpandedId(isExpanded ? null : item.id)}
                  className="p-1.5 rounded-lg border border-[#243324]/15 dark:border-white/15 text-xs font-medium hover:bg-[#243324]/10 dark:hover:bg-white/10 flex items-center gap-1 cursor-pointer shrink-0"
                  title={isExpanded ? 'Hide details' : 'View full dialogue'}
                >
                  <span className="text-[11px] font-semibold text-teal-800 dark:text-teal-400">
                    {isExpanded ? 'Hide' : 'Inspect'}
                  </span>
                  {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
              </div>

              {/* Read-Only Details */}
              {isExpanded && (
                <div className="pt-2.5 border-t border-[#243324]/10 dark:border-white/10 space-y-2 bg-[#FAF7F0] dark:bg-[#111910] p-3 rounded-lg animate-in fade-in">
                  <div>
                    <span className="block text-[10px] font-bold text-[#526340] dark:text-[#A3B59E] uppercase mb-0.5">
                      Full Dialog Title
                    </span>
                    <p className="font-semibold text-xs text-[#1F2B1D] dark:text-white">
                      {item.title}
                    </p>
                  </div>

                  <div>
                    <span className="block text-[10px] font-bold text-[#526340] dark:text-[#A3B59E] uppercase mb-0.5">
                      Robot Conversational Response
                    </span>
                    <p className="text-[#3F543C] dark:text-[#CBD7C7] leading-relaxed">
                      {item.answer}
                    </p>
                  </div>

                  {item.navTarget && (
                    <div className="flex items-center gap-2 pt-1 border-t border-[#243324]/8 dark:border-white/8 text-[11px]">
                      <span className="text-[#526340] dark:text-[#A3B59E]">Direct Navigation Link:</span>
                      <code className="font-mono text-teal-700 dark:text-teal-400 bg-teal-500/10 px-1 rounded">
                        {item.navTarget}
                      </code>
                      {item.navLabel && (
                        <span className="text-[10px] opacity-75 font-medium">({item.navLabel})</span>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
