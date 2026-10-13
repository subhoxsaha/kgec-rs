import React from 'react';
import {
  Send,
  UserCheck,
  CheckCircle2,
  Clock,
  Edit3,
  RotateCcw,
  Plus,
  ShieldAlert,
  FolderGit2,
} from 'lucide-react';
import { ProjectPhase, PhaseSubmission } from '../../types';

interface StageActionBarProps {
  phase: ProjectPhase;
  latestSubmission?: PhaseSubmission | null;
  isAdmin: boolean;
  isAssignedMentor: boolean;
  isAssignedMember: boolean;
  onOpenSubmitDrawer: () => void;
  onOpenReviewDrawer: () => void;
  onOpenConfigureDrawer: () => void;
}

export const StageActionBar: React.FC<StageActionBarProps> = ({
  phase,
  latestSubmission,
  isAdmin,
  isAssignedMentor,
  isAssignedMember,
  onOpenSubmitDrawer,
  onOpenReviewDrawer,
  onOpenConfigureDrawer,
}) => {
  const isApproved = phase.status === 'approved';
  const isSubmitted = phase.status === 'submitted';
  const isChangesRequested = phase.status === 'changes_requested';
  const isInProgress = phase.status === 'in_progress';

  return (
    <div className="p-3.5 rounded-xl bg-white dark:bg-[#162114] border border-[#243324]/12 dark:border-white/10 shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs">
      <div className="flex items-center gap-2">
        <span
          className={`w-2.5 h-2.5 rounded-full ${
            isApproved
              ? 'bg-emerald-500'
              : isSubmitted
              ? 'bg-blue-500 animate-pulse'
              : isChangesRequested
              ? 'bg-amber-500'
              : isInProgress
              ? 'bg-emerald-600'
              : 'bg-neutral-400'
          }`}
        />
        <div className="flex flex-col">
          <span className="font-bold text-[#1F2B1D] dark:text-white capitalize">
            Stage State: {phase.status.replace('_', ' ')}
          </span>
          <span className="text-[10.5px] text-[#526340] dark:text-[#8E9F89]">
            {isApproved
              ? 'Deliverables verified and stage signed off.'
              : isSubmitted
              ? 'Deliverables submitted & awaiting mentor review.'
              : isChangesRequested
              ? 'Revision required based on mentor feedback.'
              : isInProgress
              ? 'Active stage in engineering workflow.'
              : 'Locked phase until preceding stage approval.'}
          </span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {/* Mentor / Admin Configure Button */}
        {(isAdmin || isAssignedMentor) && !isApproved && (
          <button
            type="button"
            onClick={onOpenConfigureDrawer}
            className="px-3 py-1.5 rounded-lg border border-[#243324]/15 dark:border-white/15 hover:bg-[#243324]/8 dark:hover:bg-white/8 text-xs font-semibold text-[#526340] dark:text-[#CBD7C7] transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Edit3 className="w-3.5 h-3.5 text-purple-500" />
            <span className="hidden sm:inline">Configure Requirements</span>
            <span className="sm:hidden">Configure</span>
          </button>
        )}

        {/* Member Submit / Resubmit Button */}
        {(isAdmin || isAssignedMentor || isAssignedMember) && (isInProgress || isChangesRequested) && (
          <button
            type="button"
            onClick={onOpenSubmitDrawer}
            className="px-4 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white font-semibold text-xs transition-colors cursor-pointer shadow-xs flex items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isChangesRequested ? 'Resubmit Work' : 'Submit Deliverables'}</span>
          </button>
        )}

        {/* Mentor / Admin Review Button */}
        {(isAdmin || isAssignedMentor) && isSubmitted && latestSubmission && (
          <button
            type="button"
            onClick={onOpenReviewDrawer}
            className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors cursor-pointer shadow-xs flex items-center gap-1.5"
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Review Submission</span>
          </button>
        )}
      </div>
    </div>
  );
};
