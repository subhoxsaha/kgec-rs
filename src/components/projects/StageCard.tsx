import React, { useState, useRef } from 'react';
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
  FolderGit2,
  GitBranch,
  Link,
  MessageSquare,
  Sparkles,
  AlertCircle,
  RefreshCw,
  Upload,
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
  onOpenSubmitDrawer?: (phase: ProjectPhase) => void;
  onOpenReviewDrawer: (phase: ProjectPhase) => void;
  onOpenConfigureDrawer: (phase: ProjectPhase) => void;
  onSubmitWork?: (phaseId: string, form: { driveUrl: string; gitUrl: string; notes: string }) => Promise<void>;
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
  onOpenReviewDrawer,
  onOpenConfigureDrawer,
  onSubmitWork,
}) => {
  const deliverableFormRef = useRef<HTMLDivElement>(null);
  const [driveUrlInput, setDriveUrlInput] = useState('');
  const [gitUrlInput, setGitUrlInput] = useState('');
  const [notesInput, setNotesInput] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [inlineError, setInlineError] = useState<string | null>(null);
  const [submissionSuccessMsg, setSubmissionSuccessMsg] = useState<string | null>(null);

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

  const canSubmitWork = (isAdmin || isAssignedMentor || isAssignedMember) && (isInProgress || isChangesRequested);

  const scrollToForm = () => {
    if (deliverableFormRef.current) {
      deliverableFormRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      const firstInput = deliverableFormRef.current.querySelector('input');
      if (firstInput) firstInput.focus();
    }
  };

  const handleInlineSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setInlineError(null);
    setSubmissionSuccessMsg(null);

    if (!driveUrlInput.trim() && !gitUrlInput.trim() && !notesInput.trim()) {
      setInlineError('Please enter at least a Google Drive link, GitHub Repository link, or submission notes.');
      return;
    }

    if (!onSubmitWork) return;

    try {
      setSubmitting(true);
      await onSubmitWork(phase.id, {
        driveUrl: driveUrlInput,
        gitUrl: gitUrlInput,
        notes: notesInput,
      });
      setDriveUrlInput('');
      setGitUrlInput('');
      setNotesInput('');
      setSubmissionSuccessMsg('Deliverables submitted successfully and added to stage records!');
      setTimeout(() => setSubmissionSuccessMsg(null), 5000);
    } catch (err: any) {
      setInlineError(err?.message || 'Submission failed. Please check your URLs and try again.');
    } finally {
      setSubmitting(false);
    }
  };

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
      {/* Stage Card Header */}
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

              {/* Status Badge */}
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

        {/* Deadline Badge & Expand Button */}
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
        {/* Requirements Checklist Box */}
        <div className="p-3.5 rounded-xl bg-[#FAF7F0] dark:bg-[#0E150D] border border-[#243324]/10 dark:border-white/10 space-y-1 text-xs">
          <span className="text-[10.5px] font-mono font-bold uppercase tracking-wider text-[#526340] dark:text-[#8E9F89]">
            Engineering Requirements Checklist:
          </span>
          <p className="text-[12px] text-[#3F543C] dark:text-[#CBD7C7] leading-relaxed">
            {phase.requirements}
          </p>
        </div>

        {/* Deadline Warning Banner */}
        {!isApproved && isDeadlinePassed && (
          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-950 dark:text-amber-200 text-xs flex items-center gap-2 font-semibold">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Target deadline has passed! Submissions made now will be flagged as Late.</span>
          </div>
        )}

        {/* Approved Signoff Banner */}
        {isApproved && phase.approvedBy && (
          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-950 dark:text-emerald-200 text-xs flex items-center gap-2 font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Verified &amp; Signed Off by Mentor: {resolveUserName(phase.approvedBy)}</span>
          </div>
        )}

        {/* SINGLE UNCOLLAPSED DELIVERABLE SECTION */}
        <div className="p-4 rounded-xl bg-[#FAF8F3] dark:bg-[#0E160D] border border-emerald-500/35 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#243324]/10 dark:border-white/10">
            <div className="flex items-center gap-2">
              <Upload className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span className="text-xs font-bold text-[#1F2B1D] dark:text-white uppercase tracking-wide">
                Stage Deliverables &amp; Submissions
              </span>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 font-mono font-bold text-[11px] border border-emerald-500/30">
              {submissions.length} Upload{submissions.length === 1 ? '' : 's'}
            </span>
          </div>

          {/* Submission Form - UNCOLLAPSED when stage submission is allowed */}
          {canSubmitWork && (
            <div ref={deliverableFormRef} className="space-y-3 p-3.5 rounded-xl bg-white dark:bg-[#142013] border border-emerald-500/25">
              <div className="flex items-center justify-between">
                <span className="text-[11.5px] font-bold text-[#1F2B1D] dark:text-white flex items-center gap-1.5">
                  <FolderGit2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Submit Stage Deliverable (Google Drive Doc &amp; GitHub Repo)</span>
                </span>
                <span className="text-[10px] font-mono text-[#526340] dark:text-[#8E9F89]">
                  In-Stage Upload
                </span>
              </div>

              <form onSubmit={handleInlineSubmit} className="space-y-3 text-xs">
                {inlineError && (
                  <div className="p-2.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-900 dark:text-red-200 text-xs flex items-center gap-2 font-semibold">
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                    <span>{inlineError}</span>
                  </div>
                )}

                {submissionSuccessMsg && (
                  <div className="p-2.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-900 dark:text-emerald-200 text-xs flex items-center gap-2 font-semibold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{submissionSuccessMsg}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Google Drive Link */}
                  <div className="space-y-1">
                    <label className="font-semibold text-[#526340] dark:text-[#A3B59E] block flex items-center gap-1 text-[11px]">
                      <FolderGit2 className="w-3.5 h-3.5 text-blue-500" />
                      <span>Google Drive / Docs URL:</span>
                    </label>
                    <input
                      type="url"
                      placeholder="https://drive.google.com/drive/folders/... or docs.google.com"
                      value={driveUrlInput}
                      onChange={(e) => setDriveUrlInput(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#162114] border border-[#243324]/15 dark:border-white/15 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-hidden"
                    />
                  </div>

                  {/* GitHub Link */}
                  <div className="space-y-1">
                    <label className="font-semibold text-[#526340] dark:text-[#A3B59E] block flex items-center gap-1 text-[11px]">
                      <GitBranch className="w-3.5 h-3.5 text-purple-500" />
                      <span>GitHub / Git Repository Link:</span>
                    </label>
                    <input
                      type="url"
                      placeholder="https://github.com/organization/kgec-robotics-bot"
                      value={gitUrlInput}
                      onChange={(e) => setGitUrlInput(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#162114] border border-[#243324]/15 dark:border-white/15 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-hidden"
                    />
                  </div>
                </div>

                {/* Revision Notes */}
                <div className="space-y-1">
                  <label className="font-semibold text-[#526340] dark:text-[#A3B59E] block flex items-center gap-1 text-[11px]">
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Submission Notes / Revision Summary:</span>
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Brief description of CAD files, calculations, or code commit updates..."
                    value={notesInput}
                    onChange={(e) => setNotesInput(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-[#162114] border border-[#243324]/15 dark:border-white/15 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 disabled:opacity-50 text-white font-bold text-xs transition-colors cursor-pointer shadow-xs flex items-center gap-1.5"
                  >
                    {submitting ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Submit Deliverables</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Submissions List directly inside deliverable section */}
          <div className="space-y-3 pt-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-mono font-bold uppercase tracking-wider text-[#526340] dark:text-[#8E9F89] text-[11px]">
                Uploaded Revisions &amp; History ({submissions.length})
              </span>
              {submissions.length > 0 && (
                <span className="text-[10.5px] text-[#526340] dark:text-[#8E9F89]">
                  Latest revision on top
                </span>
              )}
            </div>

            {submissions.length === 0 ? (
              <div className="p-4 text-center text-xs text-[#526340] dark:text-[#8E9F89] bg-white dark:bg-[#142013] rounded-xl border border-dashed border-[#243324]/15 dark:border-white/10 space-y-1">
                <FileCode className="w-5 h-5 mx-auto text-emerald-600/50" />
                <p className="font-semibold text-[#1F2B1D] dark:text-white text-xs">No deliverables uploaded yet for this stage</p>
                <p className="text-[11px]">
                  {canSubmitWork
                    ? 'Use the form above to submit your Google Drive document or GitHub repository links.'
                    : 'Deliverable submissions will be enabled when preceding stages are completed.'}
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
        </div>

        {/* Stage Card Footer Action Toolbar */}
        <div className="pt-3 border-t border-[#243324]/8 dark:border-white/8 flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex items-center gap-2 text-xs text-[#526340] dark:text-[#8E9F89]">
            {isLocked && <span>Stage Locked</span>}
            {isApproved && <span className="text-emerald-700 dark:text-emerald-400 font-semibold">Stage Approved &amp; Completed</span>}
            {isSubmitted && <span className="text-blue-600 dark:text-blue-400 font-semibold">Under Mentor Review</span>}
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

            {/* Direct Focus/Submit Button for Members */}
            {canSubmitWork && (
              <button
                type="button"
                onClick={scrollToForm}
                className="px-4 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white font-semibold text-xs transition-colors cursor-pointer shadow-xs flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isChangesRequested ? 'Resubmit Deliverable' : 'Submit Deliverable'}</span>
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
