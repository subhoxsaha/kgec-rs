import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Send,
  FolderGit2,
  GitBranch,
  FileCode,
  UserCheck,
  RotateCcw,
  CheckCircle2,
  ExternalLink,
  AlertCircle,
  Clock,
  Award,
} from 'lucide-react';
import { ProjectPhase, PhaseSubmission } from '../../types';

interface StageDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'submit' | 'review' | 'configure';
  phase: ProjectPhase;
  projectTitle: string;
  latestSubmission?: PhaseSubmission | null;
  activeActorRole: string;
  onSubmitWork?: (phaseId: string, form: { driveUrl: string; gitUrl: string; notes: string }) => Promise<void>;
  onReviewWork?: (phaseId: string, submissionId: string, form: { decision: 'approved' | 'changes_requested'; feedback: string }) => Promise<void>;
  onSavePhaseConfig?: (phaseId: string, form: { deadline: string; requirements: string }) => Promise<void>;
  resolveUserName: (userId: string) => string;
}

export const StageDrawer: React.FC<StageDrawerProps> = ({
  isOpen,
  onClose,
  mode,
  phase,
  projectTitle,
  latestSubmission,
  activeActorRole,
  onSubmitWork,
  onReviewWork,
  onSavePhaseConfig,
  resolveUserName,
}) => {
  // Submission Form State
  const [submissionForm, setSubmissionForm] = useState({
    driveUrl: '',
    gitUrl: '',
    notes: '',
  });

  // Review Form State
  const [reviewForm, setReviewForm] = useState({
    decision: 'approved' as 'approved' | 'changes_requested',
    feedback: '',
  });

  // Configure Phase State
  const [phaseEditForm, setPhaseEditForm] = useState({
    deadline: phase.deadline ? phase.deadline.slice(0, 10) : '',
    requirements: phase.requirements || '',
  });

  const [drawerError, setDrawerError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setPhaseEditForm({
      deadline: phase.deadline ? phase.deadline.slice(0, 10) : '',
      requirements: phase.requirements || '',
    });
    setDrawerError(null);
  }, [phase]);

  const phaseTypeTitle =
    phase.phaseType === 'rd'
      ? '1. R&D Phase'
      : phase.phaseType === 'prototyping'
      ? '2. Prototyping Phase'
      : '3. Documentation Phase';

  const validateUrlFeedback = (url: string, type: 'drive' | 'git') => {
    if (!url.trim()) return null;
    let normalized = url.trim();
    if (!/^https?:\/\//i.test(normalized)) {
      normalized = `https://${normalized}`;
    }
    try {
      const parsed = new URL(normalized);
      const host = parsed.hostname.toLowerCase();
      if (type === 'drive') {
        const isDrive = host.includes('drive.google.com') || host.includes('docs.google.com');
        return isDrive ? { valid: true } : { valid: false, message: 'Must be a Google Drive or Google Docs link' };
      }
      if (type === 'git') {
        const isGit = host.includes('github.com') || host.includes('gitlab.com') || host.includes('bitbucket.org');
        return isGit ? { valid: true } : { valid: false, message: 'Must be a GitHub or Git repository link' };
      }
    } catch {
      return { valid: false, message: 'Invalid URL format' };
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setDrawerError(null);

    if (mode === 'submit') {
      if (!submissionForm.driveUrl && !submissionForm.gitUrl && !submissionForm.notes.trim()) {
        setDrawerError('Please provide a Google Drive link, GitHub link, or submission notes.');
        return;
      }

      if (submissionForm.driveUrl) {
        const check = validateUrlFeedback(submissionForm.driveUrl, 'drive');
        if (check && !check.valid) {
          setDrawerError(check.message || 'Invalid Drive URL');
          return;
        }
      }

      if (submissionForm.gitUrl) {
        const check = validateUrlFeedback(submissionForm.gitUrl, 'git');
        if (check && !check.valid) {
          setDrawerError(check.message || 'Invalid GitHub URL');
          return;
        }
      }

      if (onSubmitWork) {
        setSubmitting(true);
        try {
          await onSubmitWork(phase.id, submissionForm);
          setSubmissionForm({ driveUrl: '', gitUrl: '', notes: '' });
          onClose();
        } catch (err: any) {
          setDrawerError(err?.message || 'Submission failed');
        } finally {
          setSubmitting(false);
        }
      }
    } else if (mode === 'configure') {
      if (!phaseEditForm.deadline) {
        setDrawerError('Please set a deadline date.');
        return;
      }
      if (onSavePhaseConfig) {
        setSubmitting(true);
        try {
          await onSavePhaseConfig(phase.id, phaseEditForm);
          onClose();
        } catch (err: any) {
          setDrawerError(err?.message || 'Configuration save failed');
        } finally {
          setSubmitting(false);
        }
      }
    }
  };

  const handleReviewAction = async (decision: 'approved' | 'changes_requested') => {
    if (!latestSubmission) return;
    if (onReviewWork) {
      setSubmitting(true);
      setDrawerError(null);
      try {
        await onReviewWork(phase.id, latestSubmission.id, {
          decision,
          feedback: reviewForm.feedback,
        });
        setReviewForm({ decision: 'approved', feedback: '' });
        onClose();
      } catch (err: any) {
        setDrawerError(err?.message || 'Review submission failed');
      } finally {
        setSubmitting(false);
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-xs">
          {/* Backdrop Click */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0"
          />

          {/* Slide-Up Drawer Container */}
          <motion.div
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative z-10 w-full max-w-lg bg-white dark:bg-[#182417] text-[#1F2B1D] dark:text-[#F4EFE6] rounded-t-2xl sm:rounded-2xl border-t sm:border border-[#243324]/15 dark:border-white/15 p-5 sm:p-6 shadow-2xl max-h-[90vh] flex flex-col"
          >
            {/* Drawer Handle (Mobile) */}
            <div className="w-12 h-1.5 bg-[#243324]/20 dark:bg-white/20 rounded-full mx-auto mb-3 sm:hidden" />

            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#243324]/10 dark:border-white/10">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 block">
                  {projectTitle} &mdash; {phaseTypeTitle}
                </span>
                <h3 className="font-bold text-base text-[#1F2B1D] dark:text-white flex items-center gap-1.5">
                  {mode === 'submit' ? (
                    <>
                      <FileCode className="w-4 h-4 text-emerald-600" />
                      <span>{phase.status === 'changes_requested' ? 'Resubmit Deliverables' : 'Submit Stage Deliverables'}</span>
                    </>
                  ) : mode === 'review' ? (
                    <>
                      <UserCheck className="w-4 h-4 text-blue-600" />
                      <span>Evaluate &amp; Review Stage Upload</span>
                    </>
                  ) : (
                    <>
                      <Award className="w-4 h-4 text-purple-600" />
                      <span>Configure Stage Requirements</span>
                    </>
                  )}
                </h3>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-lg hover:bg-[#243324]/10 dark:hover:bg-white/10 text-[#526340] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Area */}
            <div className="overflow-y-auto flex-1 py-4 space-y-4 text-xs">
              {drawerError && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-900 dark:text-red-200 p-3 rounded-xl flex items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2 min-w-0">
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                    <span className="font-semibold">{drawerError}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setDrawerError(null)}
                    className="p-1 rounded hover:bg-red-500/20 text-red-700 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* MODE 1: SUBMIT DELIVERABLES */}
              {mode === 'submit' && (
                <form onSubmit={handleSubmit} className="space-y-3.5">
                  <div className="p-3 rounded-xl bg-[#FAF7F0] dark:bg-[#0E150D] border border-[#243324]/10 dark:border-white/10 space-y-1">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#526340] dark:text-[#A3B59E]">
                      Current Requirements Checklist:
                    </span>
                    <p className="text-[11.5px] text-[#3F543C] dark:text-[#CBD7C7] leading-relaxed">
                      {phase.requirements}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold block text-[#526340] dark:text-[#A3B59E] flex items-center gap-1.5">
                      <FolderGit2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Google Drive Folder or Document Link:</span>
                    </label>
                    <input
                      type="url"
                      placeholder="https://drive.google.com/..."
                      value={submissionForm.driveUrl}
                      onChange={(e) => setSubmissionForm({ ...submissionForm, driveUrl: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-[#FAF7F0] dark:bg-[#0E150D] border border-[#243324]/15 dark:border-white/15 font-mono text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold block text-[#526340] dark:text-[#A3B59E] flex items-center gap-1.5">
                      <GitBranch className="w-3.5 h-3.5 text-indigo-600" />
                      <span>GitHub Code Repository Link:</span>
                    </label>
                    <input
                      type="url"
                      placeholder="https://github.com/..."
                      value={submissionForm.gitUrl}
                      onChange={(e) => setSubmissionForm({ ...submissionForm, gitUrl: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-[#FAF7F0] dark:bg-[#0E150D] border border-[#243324]/15 dark:border-white/15 font-mono text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold block text-[#526340] dark:text-[#A3B59E]">
                      Submission Progress Notes &amp; Summary:
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Detail engineering milestones achieved, simulation results, or revisions made..."
                      value={submissionForm.notes}
                      onChange={(e) => setSubmissionForm({ ...submissionForm, notes: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-[#FAF7F0] dark:bg-[#0E150D] border border-[#243324]/15 dark:border-white/15 text-xs"
                    />
                  </div>

                  <div className="pt-2 flex justify-end gap-2 border-t border-[#243324]/10 dark:border-white/10">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 rounded-xl border border-[#243324]/15 dark:border-white/15 hover:bg-[#243324]/10 text-xs font-semibold cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 disabled:opacity-50 text-white font-semibold text-xs inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{submitting ? 'Submitting...' : 'Submit Deliverables'}</span>
                    </button>
                  </div>
                </form>
              )}

              {/* MODE 2: REVIEW WORK */}
              {mode === 'review' && latestSubmission && (
                <div className="space-y-4">
                  <div className="p-3.5 rounded-xl bg-[#FAF7F0] dark:bg-[#0E150D] border border-[#243324]/10 dark:border-white/10 space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-[#1F2B1D] dark:text-white">
                      <span>Submitted by {latestSubmission.submittedByName || resolveUserName(latestSubmission.submittedBy)}</span>
                      <span className="font-mono text-[10.5px] text-[#526340]">
                        {new Date(latestSubmission.submittedAt).toLocaleString()}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                      {latestSubmission.driveUrl && (
                        <a
                          href={latestSubmission.driveUrl}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="p-2.5 rounded-lg bg-white dark:bg-[#162114] border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 font-semibold flex items-center justify-between text-xs"
                        >
                          <span className="flex items-center gap-1.5 truncate">
                            <FolderGit2 className="w-3.5 h-3.5 shrink-0" />
                            <span className="truncate">Google Drive Files</span>
                          </span>
                          <ExternalLink className="w-3 h-3 shrink-0" />
                        </a>
                      )}
                      {latestSubmission.gitUrl && (
                        <a
                          href={latestSubmission.gitUrl}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="p-2.5 rounded-lg bg-white dark:bg-[#162114] border border-indigo-500/30 text-indigo-800 dark:text-indigo-300 font-semibold flex items-center justify-between text-xs"
                        >
                          <span className="flex items-center gap-1.5 truncate">
                            <GitBranch className="w-3.5 h-3.5 shrink-0" />
                            <span className="truncate">GitHub Repository</span>
                          </span>
                          <ExternalLink className="w-3 h-3 shrink-0" />
                        </a>
                      )}
                    </div>

                    {latestSubmission.notes && (
                      <p className="text-[11px] text-[#3F543C] dark:text-[#CBD7C7] italic pt-1 border-t border-[#243324]/8">
                        &ldquo;{latestSubmission.notes}&rdquo;
                      </p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold block text-[#526340] dark:text-[#A3B59E]">
                      Mentor Feedback &amp; Review Remarks:
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Write evaluation feedback or specific requested revisions..."
                      value={reviewForm.feedback}
                      onChange={(e) => setReviewForm({ ...reviewForm, feedback: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-[#FAF7F0] dark:bg-[#0E150D] border border-[#243324]/15 dark:border-white/15 text-xs"
                    />
                  </div>

                  <div className="pt-2 flex flex-wrap items-center justify-end gap-2 border-t border-[#243324]/10 dark:border-white/10">
                    <button
                      type="button"
                      disabled={submitting}
                      onClick={() => handleReviewAction('changes_requested')}
                      className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Request Changes</span>
                    </button>

                    <button
                      type="button"
                      disabled={submitting}
                      onClick={() => handleReviewAction('approved')}
                      className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-semibold text-xs inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Approve Stage</span>
                    </button>
                  </div>
                </div>
              )}

              {/* MODE 3: CONFIGURE PHASE */}
              {mode === 'configure' && (
                <form onSubmit={handleSubmit} className="space-y-3.5">
                  <div className="space-y-1">
                    <label className="font-semibold block text-[#526340] dark:text-[#A3B59E]">
                      Stage Target Deadline (UTC):
                    </label>
                    <input
                      type="date"
                      required
                      value={phaseEditForm.deadline}
                      onChange={(e) => setPhaseEditForm({ ...phaseEditForm, deadline: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-[#FAF7F0] dark:bg-[#0E150D] border border-[#243324]/15 dark:border-white/15 font-semibold text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold block text-[#526340] dark:text-[#A3B59E]">
                      Engineering Deliverables Requirements Checklist:
                    </label>
                    <textarea
                      rows={4}
                      value={phaseEditForm.requirements}
                      onChange={(e) => setPhaseEditForm({ ...phaseEditForm, requirements: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-[#FAF7F0] dark:bg-[#0E150D] border border-[#243324]/15 dark:border-white/15 text-xs"
                    />
                  </div>

                  <div className="pt-2 flex justify-end gap-2 border-t border-[#243324]/10 dark:border-white/10">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 rounded-xl border border-[#243324]/15 hover:bg-[#243324]/10 text-xs font-semibold cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="px-5 py-2 rounded-xl bg-purple-700 hover:bg-purple-600 disabled:opacity-50 text-white font-semibold text-xs cursor-pointer shadow-xs"
                    >
                      Save Configuration
                    </button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
