import React, { useState } from 'react';
import { Cpu, Sparkles, Plus, Trash2, Edit2, Check, X } from 'lucide-react';
import { useReportData } from '../../context/ReportDataContext';
import { RoboticsWing } from '../../types';
import { DeleteConfirmModal } from './DeleteConfirmModal';

export const WingsEditor: React.FC = () => {
  const { wings, updateWing, addWing, deleteWing, showToast } = useReportData();

  const [isAdding, setIsAdding] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<RoboticsWing | null>(null);

  const [newWing, setNewWing] = useState<Partial<RoboticsWing>>({
    name: '',
    leadSpecialty: 'Autonomous Embedded Robotics',
    members: 35,
    projectsCount: 6,
    podiums: 10,
    description: '',
    flagshipBot: 'Titan 4.0',
    hardwareStack: 'STM32, ROS 2, NVIDIA Jetson, Carbon Fiber',
    labLocation: 'Robotics Center Lab, 2nd Floor Old IT Building',
    focusAreas: ['Autonomous Navigation', 'Robotic Vision'],
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWing.name?.trim()) {
      showToast('Wing name is required');
      return;
    }

    const id = newWing.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const wing: RoboticsWing = {
      id,
      name: newWing.name.trim(),
      leadSpecialty: newWing.leadSpecialty || 'Robotics Engineering',
      members: Number(newWing.members) || 20,
      projectsCount: Number(newWing.projectsCount) || 4,
      podiums: Number(newWing.podiums) || 0,
      description: newWing.description || 'Specialized division of the society.',
      focusAreas: newWing.focusAreas || ['Embedded Hardware', 'AI'],
      flagshipBot: newWing.flagshipBot || 'Prototype 1',
      hardwareStack: newWing.hardwareStack || 'Microcontrollers, Actuators',
      labLocation: newWing.labLocation || 'KGEC Campus',
      borough: newWing.name.trim(),
      hives: Number(newWing.podiums) || 0,
      sites: Number(newWing.projectsCount) || 4,
    };

    addWing(wing);
    setIsAdding(false);
    setNewWing({
      name: '',
      leadSpecialty: 'Autonomous Embedded Robotics',
      members: 35,
      projectsCount: 6,
      podiums: 10,
      description: '',
      flagshipBot: '',
      hardwareStack: '',
      labLocation: '',
      focusAreas: [],
    });
  };

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;
    deleteWing(deleteTarget.id);
    setDeleteTarget(null);
  };

  return (
    <div className="space-y-4 text-[#243324] dark:text-[#F4EFE6]">
      {/* Universal Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Technical Division Wing?"
        itemName={deleteTarget?.name || ''}
        itemType="technical wing"
        warningText="Are you sure you want to delete this technical wing? Any team member directories and associated project badges will no longer link to this wing."
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />

      {/* Header Banner */}
      <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start gap-2.5">
          <Cpu className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400 mt-0.5" />
          <div>
            <p className="text-emerald-950 dark:text-emerald-200 font-semibold">
              Technical Wings &amp; Divisions Management
            </p>
            <p className="text-emerald-800/80 dark:text-emerald-300/80 text-[11px]">
              {wings.length} operational divisions driving competitive engineering and hardware R&amp;D.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsAdding(!isAdding)}
          className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white font-medium text-xs flex items-center gap-1.5 cursor-pointer shrink-0 shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{isAdding ? 'Cancel' : 'Add Wing'}</span>
        </button>
      </div>

      {/* Add New Wing Form */}
      {isAdding && (
        <form
          onSubmit={handleCreate}
          className="p-4 rounded-xl bg-white dark:bg-[#1A2619] border-2 border-emerald-600 dark:border-emerald-400 shadow-md space-y-3 text-xs"
        >
          <h4 className="font-bold text-xs flex items-center gap-1.5 text-emerald-800 dark:text-emerald-300">
            <Plus className="w-4 h-4" />
            Register New Engineering Wing
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <div>
              <label className="block text-[10px] font-bold text-[#526340] dark:text-[#A3B59E] mb-1">
                Wing Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Swarm Robotics & Bio-Mimicry"
                value={newWing.name}
                onChange={(e) => setNewWing({ ...newWing, name: e.target.value })}
                className="w-full px-2.5 py-1.5 rounded-lg bg-[#FAF7F0] dark:bg-[#111910] border border-[#243324]/15 dark:border-white/15"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-[#526340] dark:text-[#A3B59E] mb-1">
                Lead Specialty
              </label>
              <input
                type="text"
                placeholder="e.g. Multi-Agent Systems & SLAM"
                value={newWing.leadSpecialty}
                onChange={(e) => setNewWing({ ...newWing, leadSpecialty: e.target.value })}
                className="w-full px-2.5 py-1.5 rounded-lg bg-[#FAF7F0] dark:bg-[#111910] border border-[#243324]/15 dark:border-white/15"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-[#526340] dark:text-[#A3B59E] mb-1">
                National Podiums
              </label>
              <input
                type="number"
                value={newWing.podiums || 0}
                onChange={(e) => setNewWing({ ...newWing, podiums: Number(e.target.value) || 0 })}
                className="w-full px-2.5 py-1.5 rounded-lg bg-[#FAF7F0] dark:bg-[#111910] border border-[#243324]/15 dark:border-white/15 font-mono"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-[#526340] dark:text-[#A3B59E] mb-1">
                Active Engineers (Members)
              </label>
              <input
                type="number"
                value={newWing.members || 20}
                onChange={(e) => setNewWing({ ...newWing, members: Number(e.target.value) || 0 })}
                className="w-full px-2.5 py-1.5 rounded-lg bg-[#FAF7F0] dark:bg-[#111910] border border-[#243324]/15 dark:border-white/15 font-mono"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-[#526340] dark:text-[#A3B59E] mb-1">
                Projects Count
              </label>
              <input
                type="number"
                value={newWing.projectsCount || 4}
                onChange={(e) => setNewWing({ ...newWing, projectsCount: Number(e.target.value) || 0 })}
                className="w-full px-2.5 py-1.5 rounded-lg bg-[#FAF7F0] dark:bg-[#111910] border border-[#243324]/15 dark:border-white/15 font-mono"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-[#526340] dark:text-[#A3B59E] mb-1">
                Flagship Bot / Machine
              </label>
              <input
                type="text"
                placeholder="e.g. SwarmBot Alpha"
                value={newWing.flagshipBot}
                onChange={(e) => setNewWing({ ...newWing, flagshipBot: e.target.value })}
                className="w-full px-2.5 py-1.5 rounded-lg bg-[#FAF7F0] dark:bg-[#111910] border border-[#243324]/15 dark:border-white/15"
              />
            </div>

            <div className="sm:col-span-3">
              <label className="block text-[10px] font-bold text-[#526340] dark:text-[#A3B59E] mb-1">
                Mission Description
              </label>
              <textarea
                rows={2}
                placeholder="Enter scope, objectives, and research directives of this wing..."
                value={newWing.description}
                onChange={(e) => setNewWing({ ...newWing, description: e.target.value })}
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
              className="px-4 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white font-bold"
            >
              Save Wing
            </button>
          </div>
        </form>
      )}

      {/* Existing Wings List */}
      <div className="space-y-3">
        {wings.map((wing, idx) => (
          <div
            key={wing.id || idx}
            className="p-3.5 rounded-xl bg-white dark:bg-[#1A2619] border border-[#243324]/10 dark:border-white/10 shadow-2xs space-y-2.5"
          >
            <div className="flex items-center justify-between border-b border-[#243324]/10 dark:border-white/10 pb-2">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-emerald-800 text-white">
                  <Cpu className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#1F2B1D] dark:text-[#F4EFE6]">{wing.name}</h4>
                  <span className="text-[10px] font-mono text-[#657351] dark:text-[#9FB19A]">
                    Wing #{idx + 1} &bull; ID: {wing.id} &bull; {wing.members} Engineers &bull; {wing.podiums} Podiums
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setDeleteTarget(wing)}
                className="p-1.5 rounded-lg border border-rose-500/30 text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 cursor-pointer"
                title="Delete this wing"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
              <div>
                <label className="block text-[10px] font-semibold text-[#526340] dark:text-[#A3B59E] mb-0.5">
                  Wing Name
                </label>
                <input
                  type="text"
                  value={wing.name}
                  onChange={(e) => updateWing(idx, { name: e.target.value })}
                  className="w-full px-2 py-1 rounded bg-[#FAF7F0] dark:bg-[#111910] border border-[#243324]/15 dark:border-white/15 font-semibold"
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-[#526340] dark:text-[#A3B59E] mb-0.5">
                  Lead Specialty
                </label>
                <input
                  type="text"
                  value={wing.leadSpecialty || ''}
                  onChange={(e) => updateWing(idx, { leadSpecialty: e.target.value })}
                  className="w-full px-2 py-1 rounded bg-[#FAF7F0] dark:bg-[#111910] border border-[#243324]/15 dark:border-white/15"
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-[#526340] dark:text-[#A3B59E] mb-0.5">
                  National Podiums Won
                </label>
                <input
                  type="number"
                  value={wing.podiums || 0}
                  onChange={(e) => updateWing(idx, { podiums: Number(e.target.value) || 0 })}
                  className="w-full px-2 py-1 rounded bg-[#FAF7F0] dark:bg-[#111910] border border-[#243324]/15 dark:border-white/15 font-mono"
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-[#526340] dark:text-[#A3B59E] mb-0.5">
                  Squad Members
                </label>
                <input
                  type="number"
                  value={wing.members || 0}
                  onChange={(e) => updateWing(idx, { members: Number(e.target.value) || 0 })}
                  className="w-full px-2 py-1 rounded bg-[#FAF7F0] dark:bg-[#111910] border border-[#243324]/15 dark:border-white/15 font-mono"
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-[#526340] dark:text-[#A3B59E] mb-0.5">
                  Projects Count
                </label>
                <input
                  type="number"
                  value={wing.projectsCount || 0}
                  onChange={(e) => updateWing(idx, { projectsCount: Number(e.target.value) || 0 })}
                  className="w-full px-2 py-1 rounded bg-[#FAF7F0] dark:bg-[#111910] border border-[#243324]/15 dark:border-white/15 font-mono"
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-[#526340] dark:text-[#A3B59E] mb-0.5">
                  Flagship Robot
                </label>
                <input
                  type="text"
                  value={wing.flagshipBot || ''}
                  onChange={(e) => updateWing(idx, { flagshipBot: e.target.value })}
                  className="w-full px-2 py-1 rounded bg-[#FAF7F0] dark:bg-[#111910] border border-[#243324]/15 dark:border-white/15"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="block text-[10px] font-semibold text-[#526340] dark:text-[#A3B59E] mb-0.5">
                  Technical Mission &amp; Focus
                </label>
                <textarea
                  rows={2}
                  value={wing.description}
                  onChange={(e) => updateWing(idx, { description: e.target.value })}
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
