import React, { useState } from 'react';
import {
  MessageSquare,
  Plus,
  Trash2,
  Edit2,
  Check,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Search,
} from 'lucide-react';
import { BOT_QUICK_QUESTIONS, BotQuickQuestion } from '../../data/robotQuestions';
import { DeleteConfirmModal } from './DeleteConfirmModal';
import { useReportData } from '../../context/ReportDataContext';

export const BotFaqEditor: React.FC = () => {
  const { showToast } = useReportData();
  const [questions, setQuestions] = useState<BotQuickQuestion[]>(() => {
    try {
      const saved = localStorage.getItem('krs_bot_faq_v1');
      if (saved) return JSON.parse(saved);
    } catch {}
    return BOT_QUICK_QUESTIONS;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<BotQuickQuestion | null>(null);

  const [newQuestion, setNewQuestion] = useState<Partial<BotQuickQuestion>>({
    label: '',
    title: '',
    category: 'General',
    answer: '',
  });

  const saveToStorage = (next: BotQuickQuestion[]) => {
    try {
      localStorage.setItem('krs_bot_faq_v1', JSON.stringify(next));
    } catch {}
  };

  const handleUpdate = (id: string, updates: Partial<BotQuickQuestion>) => {
    const next = questions.map((q) => (q.id === id ? { ...q, ...updates } : q));
    setQuestions(next);
    saveToStorage(next);
    showToast('Companion bot Q&A updated');
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion.label?.trim() || !newQuestion.answer?.trim()) {
      showToast('Label and Answer are required');
      return;
    }

    const item: BotQuickQuestion = {
      id: `bot-q-${Date.now().toString(36)}`,
      label: newQuestion.label.trim(),
      title: newQuestion.title?.trim() || newQuestion.label.trim(),
      category: newQuestion.category || 'General',
      answer: newQuestion.answer.trim(),
      keywords: [newQuestion.label.toLowerCase()],
      followUps: [],
    };

    const next = [item, ...questions];
    setQuestions(next);
    saveToStorage(next);
    setIsAdding(false);
    setNewQuestion({ label: '', title: '', category: 'General', answer: '' });
    showToast(`Added new bot question: "${item.label}"`);
  };

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;
    const next = questions.filter((q) => q.id !== deleteTarget.id);
    setQuestions(next);
    saveToStorage(next);
    showToast(`Deleted bot question: "${deleteTarget.label}"`);
    setDeleteTarget(null);
  };

  const filtered = questions.filter(
    (q) =>
      q.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4 text-[#243324] dark:text-[#F4EFE6]">
      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Companion Question?"
        itemName={deleteTarget?.label || ''}
        itemType="companion question"
        warningText="This will remove this query from the interactive robot companion suggestions on the hero screen."
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />

      {/* Header Banner */}
      <div className="p-3.5 rounded-xl bg-teal-500/10 border border-teal-500/20 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start gap-2.5">
          <Sparkles className="w-4 h-4 shrink-0 text-teal-600 dark:text-teal-400 mt-0.5" />
          <div>
            <span className="font-bold text-teal-950 dark:text-teal-200">
              Interactive Hero Robot Mascot Knowledge Base
            </span>
            <p className="text-teal-900/80 dark:text-teal-300/80 mt-0.5">
              Edit the prompt pills, answers, and nested follow-up options presented by the autonomous
              robot on the home screen.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsAdding(!isAdding)}
          className="px-3 py-1.5 rounded-lg bg-teal-700 hover:bg-teal-600 text-white font-medium flex items-center gap-1.5 cursor-pointer shrink-0 text-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{isAdding ? 'Cancel' : 'Add Question'}</span>
        </button>
      </div>

      {/* Add New Question Form */}
      {isAdding && (
        <form
          onSubmit={handleAdd}
          className="p-4 rounded-xl bg-white dark:bg-[#1A2619] border-2 border-teal-600 dark:border-teal-400 shadow-md space-y-3 text-xs"
        >
          <h4 className="font-bold text-sm text-teal-900 dark:text-teal-200 flex items-center gap-1.5">
            <Plus className="w-4 h-4" />
            Add New Companion Question
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <div>
              <label className="block text-[10px] font-bold text-[#526340] dark:text-[#A3B59E] mb-1">
                Pill Label (Short) *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Lab Timings"
                value={newQuestion.label}
                onChange={(e) => setNewQuestion({ ...newQuestion, label: e.target.value })}
                className="w-full px-2.5 py-1.5 rounded-lg bg-[#FAF7F0] dark:bg-[#111910] border border-[#243324]/15 dark:border-white/15"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-[#526340] dark:text-[#A3B59E] mb-1">
                Full Title *
              </label>
              <input
                type="text"
                placeholder="e.g. When is the Robotics Lab Open?"
                value={newQuestion.title}
                onChange={(e) => setNewQuestion({ ...newQuestion, title: e.target.value })}
                className="w-full px-2.5 py-1.5 rounded-lg bg-[#FAF7F0] dark:bg-[#111910] border border-[#243324]/15 dark:border-white/15"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-[#526340] dark:text-[#A3B59E] mb-1">
                Category
              </label>
              <input
                type="text"
                placeholder="e.g. General / Lab"
                value={newQuestion.category}
                onChange={(e) => setNewQuestion({ ...newQuestion, category: e.target.value })}
                className="w-full px-2.5 py-1.5 rounded-lg bg-[#FAF7F0] dark:bg-[#111910] border border-[#243324]/15 dark:border-white/15"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-[#526340] dark:text-[#A3B59E] mb-1">
                Jump Target (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. #projects-section or #wings-section"
                value={newQuestion.navTarget || ''}
                onChange={(e) => setNewQuestion({ ...newQuestion, navTarget: e.target.value })}
                className="w-full px-2.5 py-1.5 font-mono text-xs rounded-lg bg-[#FAF7F0] dark:bg-[#111910] border border-[#243324]/15 dark:border-white/15"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[10px] font-bold text-[#526340] dark:text-[#A3B59E] mb-1">
                Jump Button Label (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Explore Flagship Bot Fleet →"
                value={newQuestion.navLabel || ''}
                onChange={(e) => setNewQuestion({ ...newQuestion, navLabel: e.target.value })}
                className="w-full px-2.5 py-1.5 rounded-lg bg-[#FAF7F0] dark:bg-[#111910] border border-[#243324]/15 dark:border-white/15"
              />
            </div>

            <div className="sm:col-span-3">
              <label className="block text-[10px] font-bold text-[#526340] dark:text-[#A3B59E] mb-1">
                Robot Answer Text *
              </label>
              <textarea
                required
                rows={3}
                placeholder="Enter the conversational speech reply typed out by the robot..."
                value={newQuestion.answer}
                onChange={(e) => setNewQuestion({ ...newQuestion, answer: e.target.value })}
                className="w-full px-2.5 py-1.5 rounded-lg bg-[#FAF7F0] dark:bg-[#111910] border border-[#243324]/15 dark:border-white/15 leading-relaxed"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-white/15 hover:bg-black/5"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-teal-700 hover:bg-teal-600 text-white font-bold"
            >
              Save Question
            </button>
          </div>
        </form>
      )}

      {/* Search Input */}
      <div className="relative">
        <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#657351] dark:text-[#8E9F89]" />
        <input
          type="text"
          placeholder="Search bot prompt questions or answers..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-3 py-2 rounded-xl bg-white dark:bg-[#182417] border border-[#243324]/15 dark:border-white/10 text-xs"
        />
      </div>

      {/* Questions List */}
      <div className="space-y-2.5">
        {filtered.map((item) => {
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

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => setExpandedId(isExpanded ? null : item.id)}
                    className="p-1.5 rounded-lg border border-[#243324]/15 dark:border-white/15 text-xs font-medium hover:bg-[#243324]/10 dark:hover:bg-white/10 flex items-center gap-1 cursor-pointer"
                  >
                    <Edit2 className="w-3 h-3 text-teal-600 dark:text-teal-400" />
                    <span className="hidden sm:inline text-[11px]">{isExpanded ? 'Close' : 'Edit'}</span>
                    {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeleteTarget(item)}
                    className="p-1.5 rounded-lg border border-rose-500/30 text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 cursor-pointer"
                    title="Delete question with confirmation"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Edit Details */}
              {isExpanded && (
                <div className="pt-2.5 border-t border-[#243324]/10 dark:border-white/10 space-y-2.5 animate-in fade-in">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold text-[#526340] dark:text-[#A3B59E] mb-0.5">
                        Pill Label
                      </label>
                      <input
                        type="text"
                        value={item.label}
                        onChange={(e) => handleUpdate(item.id, { label: e.target.value })}
                        className="w-full px-2 py-1 rounded bg-[#FAF7F0] dark:bg-[#111910] border border-[#243324]/15 dark:border-white/15"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-[#526340] dark:text-[#A3B59E] mb-0.5">
                        Category
                      </label>
                      <input
                        type="text"
                        value={item.category}
                        onChange={(e) => handleUpdate(item.id, { category: e.target.value })}
                        className="w-full px-2 py-1 rounded bg-[#FAF7F0] dark:bg-[#111910] border border-[#243324]/15 dark:border-white/15"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-[#526340] dark:text-[#A3B59E] mb-0.5">
                      Robot Answer Text
                    </label>
                    <textarea
                      rows={3}
                      value={item.answer}
                      onChange={(e) => handleUpdate(item.id, { answer: e.target.value })}
                      className="w-full px-2 py-1 rounded bg-[#FAF7F0] dark:bg-[#111910] border border-[#243324]/15 dark:border-white/15 leading-relaxed"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold text-[#526340] dark:text-[#A3B59E] mb-0.5">
                        Jump Section Target (e.g. #projects-section)
                      </label>
                      <input
                        type="text"
                        value={item.navTarget || ''}
                        onChange={(e) => handleUpdate(item.id, { navTarget: e.target.value })}
                        placeholder="#projects-section"
                        className="w-full px-2 py-1 font-mono text-xs rounded bg-[#FAF7F0] dark:bg-[#111910] border border-[#243324]/15 dark:border-white/15"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-[#526340] dark:text-[#A3B59E] mb-0.5">
                        Jump Button Label
                      </label>
                      <input
                        type="text"
                        value={item.navLabel || ''}
                        onChange={(e) => handleUpdate(item.id, { navLabel: e.target.value })}
                        placeholder="e.g. Explore Flagship Bot Fleet →"
                        className="w-full px-2 py-1 rounded bg-[#FAF7F0] dark:bg-[#111910] border border-[#243324]/15 dark:border-white/15"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-1">
                    <button
                      type="button"
                      onClick={() => setExpandedId(null)}
                      className="px-3 py-1 rounded-lg bg-teal-700 hover:bg-teal-600 text-white font-semibold cursor-pointer"
                    >
                      Done Editing
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
