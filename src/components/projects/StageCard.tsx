import React from 'react';
import {
  Layers,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle2,
  FileCode,
  Send,
  UserCheck,
  Edit3,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { ProjectPhase, PhaseSubmission } from '../../types';
import { FilePreviewCard } from './FilePreviewCard';

interface StageCardProps {
  phase: ProjectPhase;
  phaseIndex: number;
  isSelectedStage: boolean;
  onSelectStage: () => void;
  resolveUserName: (userId: string) => string;
  isAdmin: boolean;
  isAssignedMentor: boolean;
  isAssignedMember: boolean;
  onOpenSubmitDrawer: (phase: ProjectPhase) => void;
  onOpenReviewDrawer: (phase: ProjectPhase) => void;
  onOpenConfigureDrawer: (phase: ProjectPhase) => void;
}

export const StageCard: React.FC<StageCardProps> = ({
  phase,
  phaseIndex,
  isSelectedStage,
  onSelectStage,
  resolveUserName,
  isAdmin,
  isAssignedMentor,
  isAssignedMember,
  onOpenSubmitDrawer,
  onOpenReviewDrawer,
  onOpenConfigureDrawer,
}) => {
  const phaseMeta: Record<string, { title: string; subtitle: string; iconBg: string }> = {
    rd: {
      title: '1. R&D Phase',
      subtitle: 'Mathematical modeling, kinematics, simulation & literature review',
      iconBg: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
    },
    prototyping: {
      title: '2. Prototyping Phase',
      subtitle: '3D CAD, CNC milling, PCB layout & hardware bench testing',
      iconBg: 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-400',
    },
    documentation: {
      title: '3. Documentation Phase',
      subtitle: 'Engineering reports, bill of materials, safety audits & final verification',
      iconBg: 'bg-purple-500/10 text-purple-700 dark:text-purple-400',
    },
  };

  const meta = phaseMeta[phase.phaseType] || {
    title: `Phase ${phaseIndex + 1}`,
    subtitle: 'Engineering stage deliverable tracking',
    iconBg: 'bg-emerald-500/10 text-emerald-700',
  };

  const submissions = phase.submissions || [];
  const latestSubmission = submissions[0] || null;
  const isApproved = phase.status === 'approved';
  const isSubmitted = phase.status === 'submitted';
  const isChangesRequested = phase.status === 'changes_requested';
  const isInProgress = phase.status === 'in_progress';
  const isLocked = phase.status === 'locked';
  const isDeadlinePassed = new Date() > new Date(phase.deadline);

  return (
    <div
      className={`rounded-2xl border transition-all space-y-4 overflow-hidden ${
        isSelectedStage
          ? 'bg-white dark:bg-[#162114] border-emerald-500/60 dark:border-emerald-500/50 shadow-md'
          : isApproved
          ? 'bg-emerald-50/40 dark:bg-emerald-950/15 border-emerald-500/25'
          : 'bg-white/80 dark:bg-[#141E13]/80 border-[#243324]/10 dark:border-white/10'
      }`}
    >
      {/* Card Header */}
      <div className="p-4 sm:p-5 flex flex-wrap items-start justify-between gap-3 border-b border-[#243324]/8 dark:border-white/8">
        <div className="flex items-start gap-3 min-w-0">
          <div className={`w-9 h-9 rounded-xl ${meta.iconBg} font-bold flex items-center justify-center shrink-0`}>
            <Layers className="w-5 h-5" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-base text-[#1F2B1D] dark:text-white truncate">
                {meta.title}
              </h3>

              {/* Status Tag */}
              <span
                className={`px-2.5 py-0.5 rounded-md font-mono font-bold text-[10.5px] uppercase border tracking-wider shrink-0 ${
                  isApproved
                    ? 'bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border-emerald-500/30'
                    : isSubmitted
                    ? 'bg-blue-500/15 text-blue-800 dark:text-blue-300 border-blue-500/30'
                    : isChangesRequested
                    ? 'bg-amber-500/15 text-amber-800 dark:text-amber-300 border-amber-500/30'
                    : isInProgress
                    ? 'bg-emerald-600/15 text-emerald-800 dark:text-emerald-300 border-emerald-500/30'
                    : 'bg-neutral-500/15 text-neutral-600 dark:text-neutral-400 border-neutral-500/20'
                }`}
              >
                {phase.status.replace('_', ' ')}
              </span>
            </div>

            <p className="text-xs text-[#526340] dark:text-[#9FB19A] mt-0.5">
              {meta.subtitle}
            </p>
          </div>
        </div>

        {/* Deadline Badge */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="p-2 rounded-xl bg-[#FAF7F0] dark:bg-[#0E150D] border border-[#243324]/10 dark:border-white/10 text-right text-xs">
            <span className="text-[10px] font-mono font-bold uppercase text-[#526340] dark:text-[#8E9F89] block">
              Deadline:
            </span>
            <span className="font-mono font-bold text-[#1F2B1D] dark:text-white">
              {new Date(phase.deadline).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
          </div>

          <button
            type="button"
            onClick={onSelectStage}
            className="p-2 rounded-xl border border-[#243324]/12 dark:border-white/12 hover:bg-[#243324]/8 dark:hover:bg-white/8 text-[#526340] cursor-pointer"
            aria-label="Toggle stage details"
          >
            {isSelectedStage ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Body */}
      <div className="p-4 sm:p-5 pt-0 space-y-4">
        {/* Requirements Box */}
        <div className="p-3.5 rounded-xl bg-[#FAF7F0] dark:bg-[#0E150D] border border-[#243324]/10 dark:border-white/10 space-y-1 text-xs">
          <span className="text-[10.5px] font-mono font-bold uppercase tracking-wider text-[#526340] dark:text-[#8E9F89]">
            Engineering Requirements Checklist:
          </span>
          <p className="text-[12px] text-[#3F543C] dark:text-[#CBD7C7] leading-relaxed">
            {phase.requirements}
          </p>
        </div>

        {/* Deadline warning banner */}
        {!isApproved && isDeadlinePassed && (
          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-950 dark:text-amber-200 text-xs flex items-center gap-2 font-semibold">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Target deadline has passed! Submissions made now will be flagged as Late.</span>
          </div>
        )}

        {/* Approved signoff banner */}
        {isApproved && phase.approvedBy && (
          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-950 dark:text-emerald-200 text-xs flex items-center gap-2 font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Verified &amp; Signed Off by Mentor: {resolveUserName(phase.approvedBy)}</span>
          </div>
        )}

        {/* Submissions List Section */}
        <div className="space-y-3 pt-2 border-t border-[#243324]/8 dark:border-white/8">
          <div className="flex items-center justify-between text-xs">
            <span className="font-mono font-bold uppercase tracking-wider text-[#526340] dark:text-[#8E9F89]">
              Stage Deliverables &amp; Uploads ({submissions.length})
            </span>
            {submissions.length > 0 && (
              <span className="text-[11px] text-[#526340] dark:text-[#8E9F89]">
                Showing latest revision on top
              </span>
            )}
          </div>

          {submissions.length === 0 ? (
            <div className="p-5 text-center text-xs text-[#526340] dark:text-[#8E9F89] bg-[#FAF7F0] dark:bg-[#0E150D] rounded-xl border border-dashed border-[#243324]/15 dark:border-white/10 space-y-1">
              <FileCode className="w-6 h-6 mx-auto text-emerald-600/40" />
              <p className="font-semibold text-[#1F2B1D] dark:text-white">No deliverables uploaded yet</p>
              <p className="text-[11px]">
                {isInProgress || isChangesRequested
                  ? 'Use the button below to upload your Google Drive docs or GitHub repository.'
                  : 'Deliverables will be unlocked once preceding phases are approved.'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {submissions.map((sub, sIdx) => (
                <FilePreviewCard
                  key={sub.id}
                  submission={sub}
                  resolveUserName={resolveUserName}
                  revisionNumber={submissions.length - sIdx}
                  isLatest={sIdx === 0}
                />
              ))}
            </div>
          )}
        </div>

        {/* Action Controls Toolbar */}
        <div className="pt-3 border-t border-[#243324]/8 dark:border-white/8 flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex items-center gap-2 text-xs text-[#526340] dark:text-[#8E9F89]">
            {isLocked && <span>Stage Locked</span>}
            {isApproved && <span className="text-emerald-700 dark:text-emerald-400 font-semibold">Completed</span>}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Configure Button for Mentors/Admins */}
            {(isAdmin || isAssignedMentor) && !isApproved && (
              <button
                type="button"
                onClick={() => onOpenConfigureDrawer(phase)}
                className="px-3 py-1.5 rounded-lg border border-[#243324]/15 dark:border-white/15 hover:bg-[#243324]/8 dark:hover:bg-white/8 text-xs font-semibold text-[#526340] dark:text-[#CBD7C7] transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Edit3 className="w-3.5 h-3.5 text-purple-500" />
                <span>Configure Settings</span>
              </button>
            )}

            {/* Submit / Resubmit Button for Members */}
            {(isAdmin || isAssignedMentor || isAssignedMember) && (isInProgress || isChangesRequested) && (
              <button
                type="button"
                onClick={() => onOpenSubmitDrawer(phase)}
                className="px-4 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white font-semibold text-xs transition-colors cursor-pointer shadow-xs flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isChangesRequested ? 'Resubmit Work' : 'Submit Work Deliverables'}</span>
              </button>
            )}

            {/* Mentor Review Button */}
            {(isAdmin || isAssignedMentor) && isSubmitted && latestSubmission && (
              <button
                type="button"
                onClick={() => onOpenReviewDrawer(phase)}
                className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors cursor-pointer shadow-xs flex items-center gap-1.5"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Review Deliverables</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
