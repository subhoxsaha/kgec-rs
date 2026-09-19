import React, { useState } from 'react';
import { Calendar, Plus, Trash2, Sparkles, Check } from 'lucide-react';
import { useReportData } from '../../context/ReportDataContext';
import { StrategicGoal } from '../../types';
import { DeleteConfirmModal } from './DeleteConfirmModal';

export const RoadmapEditor: React.FC = () => {
  const { roadmap, updateRoadmapGoal, addRoadmapGoal, deleteRoadmapGoal, showToast } =
    useReportData();

  const [isAddingGoal, setIsAddingGoal] = useState(false);
  const [deleteTargetIndex, setDeleteTargetIndex] = useState<number | null>(null);
  const [newGoal, setNewGoal] = useState<StrategicGoal>({
    title: '',
    pillar: 'Autonomous Systems & AI',
    metric: 'Target KPI',
    description: '',
    targetDate: 'Summer 2027',
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoal.title.trim()) return;
    addRoadmapGoal(newGoal);
    setNewGoal({
      title: '',
      pillar: 'Autonomous Systems & AI',
      metric: 'Target KPI',
      description: '',
      targetDate: 'Summer 2027',
    });
    setIsAddingGoal(false);
    showToast('New milestone added to Vision 2027');
  };

  const targetGoal = deleteTargetIndex !== null ? roadmap[deleteTargetIndex] : null;

  return (
    <div className="space-y-4 text-[#243324] dark:text-[#F4EFE6]">
      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteTargetIndex !== null}
        title="Delete Strategic Milestone?"
        itemName={targetGoal?.title || ''}
        itemType="roadmap milestone"
        warningText="Are you sure you want to permanently delete this milestone from the Vision 2027 roadmap? This will update the timeline on the live site."
        onConfirm={() => {
          if (deleteTargetIndex !== null) {
            deleteRoadmapGoal(deleteTargetIndex);
            setDeleteTargetIndex(null);
          }
        }}
        onCancel={() => setDeleteTargetIndex(null)}
      />

      <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs flex items-start justify-between gap-2">
        <div className="flex items-start gap-2.5">
          <Sparkles className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400 mt-0.5" />
          <p className="text-emerald-950 dark:text-emerald-200">
            Long-term technological milestones, University Rover Challenge targets, and patents.
          </p>
        </div>

        {!isAddingGoal && (
          <button
            type="button"
            onClick={() => setIsAddingGoal(true)}
            className="text-[11px] px-2.5 py-1 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white font-medium flex items-center gap-1 cursor-pointer shrink-0"
          >
            <Plus className="w-3 h-3" />
            <span>Add Milestone</span>
          </button>
        )}
      </div>

      {/* New Goal Form */}
      {isAddingGoal && (
        <form
          onSubmit={handleCreate}
          className="p-3.5 rounded-xl bg-white dark:bg-[#1A2619] border-2 border-emerald-600 dark:border-emerald-400 shadow-sm space-y-2.5 text-xs"
        >
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-xs">Create New Vision 2027 Milestone</h4>
            <button
              type="button"
              onClick={() => setIsAddingGoal(false)}
              className="text-[#657351] hover:text-[#1F2B1D] text-xs cursor-pointer"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div>
              <label className="block text-[10px] font-semibold text-[#526340] dark:text-[#A3B59E] mb-1">
                Goal Title
              </label>
              <input
                type="text"
                placeholder="e.g. URC Utah Rover Deployment"
                value={newGoal.title}
                onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                className="w-full px-2.5 py-1.5 rounded-lg bg-[#FAF7F0] dark:bg-[#111910] border border-[#243324]/15 dark:border-white/15"
                required
              />
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-[#526340] dark:text-[#A3B59E] mb-1">
                Target Date / Timeline
              </label>
              <input
                type="text"
                placeholder="e.g. Q2 2026"
                value={newGoal.targetDate}
                onChange={(e) => setNewGoal({ ...newGoal, targetDate: e.target.value })}
                className="w-full px-2.5 py-1.5 rounded-lg bg-[#FAF7F0] dark:bg-[#111910] border border-[#243324]/15 dark:border-white/15"
              />
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-[#526340] dark:text-[#A3B59E] mb-1">
                Engineering Pillar
              </label>
              <input
                type="text"
                value={newGoal.pillar}
                onChange={(e) => setNewGoal({ ...newGoal, pillar: e.target.value })}
                className="w-full px-2.5 py-1.5 rounded-lg bg-[#FAF7F0] dark:bg-[#111910] border border-[#243324]/15 dark:border-white/15"
              />
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-[#526340] dark:text-[#A3B59E] mb-1">
                Key Deliverable / Metric
              </label>
              <input
                type="text"
                placeholder="e.g. Top 10 Indian Team"
                value={newGoal.metric}
                onChange={(e) => setNewGoal({ ...newGoal, metric: e.target.value })}
                className="w-full px-2.5 py-1.5 rounded-lg bg-[#FAF7F0] dark:bg-[#111910] border border-[#243324]/15 dark:border-white/15"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[10px] font-semibold text-[#526340] dark:text-[#A3B59E] mb-1">
                Technical Brief
              </label>
              <textarea
                rows={2}
                placeholder="Milestone technical scope and execution strategy..."
                value={newGoal.description}
                onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                className="w-full px-2.5 py-1.5 rounded-lg bg-[#FAF7F0] dark:bg-[#111910] border border-[#243324]/15 dark:border-white/15"
              />
            </div>
          </div>

          <button
            type="submit"
            className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white font-medium text-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Check className="w-3 h-3" />
            <span>Save Milestone</span>
          </button>
        </form>
      )}

      {/* Existing Roadmap Goals */}
      <div className="space-y-3">
        {roadmap.map((goal, idx) => (
          <div
            key={idx}
            className="p-3.5 rounded-xl bg-white dark:bg-[#1A2619] border border-[#243324]/10 dark:border-white/10 shadow-2xs space-y-2 text-xs"
          >
            <div className="flex items-center justify-between border-b border-[#243324]/10 dark:border-white/10 pb-2">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-700 text-white flex items-center justify-center text-[10px] font-mono font-bold">
                  {idx + 1}
                </span>
                <span className="font-bold">{goal.title}</span>
              </div>

              <button
                type="button"
                onClick={() => setDeleteTargetIndex(idx)}
                className="text-rose-600 hover:text-rose-700 dark:text-rose-400 p-1 rounded hover:bg-rose-500/10 cursor-pointer"
                title="Delete this milestone"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] font-semibold text-[#526340] dark:text-[#A3B59E] mb-0.5">
                  Title
                </label>
                <input
                  type="text"
                  value={goal.title}
                  onChange={(e) => updateRoadmapGoal(idx, { title: e.target.value })}
                  className="w-full px-2 py-1 rounded bg-[#FAF7F0] dark:bg-[#111910] border border-[#243324]/15 dark:border-white/15"
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-[#526340] dark:text-[#A3B59E] mb-0.5">
                  Target Date
                </label>
                <input
                  type="text"
                  value={goal.targetDate}
                  onChange={(e) => updateRoadmapGoal(idx, { targetDate: e.target.value })}
                  className="w-full px-2 py-1 rounded bg-[#FAF7F0] dark:bg-[#111910] border border-[#243324]/15 dark:border-white/15"
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-[#526340] dark:text-[#A3B59E] mb-0.5">
                  Pillar
                </label>
                <input
                  type="text"
                  value={goal.pillar}
                  onChange={(e) => updateRoadmapGoal(idx, { pillar: e.target.value })}
                  className="w-full px-2 py-1 rounded bg-[#FAF7F0] dark:bg-[#111910] border border-[#243324]/15 dark:border-white/15"
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-[#526340] dark:text-[#A3B59E] mb-0.5">
                  Deliverable Metric
                </label>
                <input
                  type="text"
                  value={goal.metric}
                  onChange={(e) => updateRoadmapGoal(idx, { metric: e.target.value })}
                  className="w-full px-2 py-1 rounded bg-[#FAF7F0] dark:bg-[#111910] border border-[#243324]/15 dark:border-white/15"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[10px] font-semibold text-[#526340] dark:text-[#A3B59E] mb-0.5">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={goal.description}
                  onChange={(e) => updateRoadmapGoal(idx, { description: e.target.value })}
                  className="w-full px-2 py-1 rounded bg-[#FAF7F0] dark:bg-[#111910] border border-[#243324]/15 dark:border-white/15 leading-relaxed"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
