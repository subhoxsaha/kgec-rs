import React from 'react';
import {
  FolderGit2,
  GitBranch,
  ExternalLink,
  Clock,
  User,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  FileText,
  ShieldCheck,
  Calendar,
} from 'lucide-react';
import { PhaseSubmission, SubmissionReview } from '../../types';

interface FilePreviewCardProps {
  submission: PhaseSubmission;
  resolveUserName: (userId: string) => string;
  revisionNumber?: number;
  isLatest?: boolean;
}

export const FilePreviewCard: React.FC<FilePreviewCardProps> = ({
  submission,
  resolveUserName,
  revisionNumber,
  isLatest = false,
}) => {
  const latestReview = submission.reviews && submission.reviews.length > 0 ? submission.reviews[0] : null;

  return (
    <div
      className={`rounded-xl border transition-all space-y-3 p-4 ${
        isLatest
          ? 'bg-white dark:bg-[#162215] border-emerald-500/30 dark:border-emerald-500/30 shadow-xs'
          : 'bg-[#FAF8F5] dark:bg-[#0E160D] border-[#243324]/10 dark:border-white/10 opacity-95'
      }`}
    >
      {/* Card Header: Revision #, Submitter Identity, Timestamp & Late Tag */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-[#243324]/8 dark:border-white/8">
        <div className="flex items-center gap-2">
          {revisionNumber && (
            <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 font-mono font-bold text-[11px] border border-emerald-500/20">
              Rev #{revisionNumber}
            </span>
          )}
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#1F2B1D] dark:text-white">
            <div className="w-5 h-5 rounded-full bg-emerald-700 text-white font-bold flex items-center justify-center text-[10px] shrink-0">
              {(submission.submittedByName || resolveUserName(submission.submittedBy)).slice(0, 1).toUpperCase()}
            </div>
            <span>{submission.submittedByName || resolveUserName(submission.submittedBy)}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[11px] font-mono text-[#526340] dark:text-[#8E9F89]">
          {submission.isLate && (
            <span className="px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-800 dark:text-amber-300 font-semibold text-[10px] border border-amber-500/30 flex items-center gap-1">
              <Clock className="w-3 h-3 text-amber-600 dark:text-amber-400" />
              <span>Late Upload</span>
            </span>
          )}
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>
              {new Date(submission.submittedAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </span>
        </div>
      </div>

      {/* File Links / Asset Previews Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {submission.driveUrl ? (
          <a
            href={submission.driveUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="group p-3 rounded-xl bg-[#FAF7F0] dark:bg-[#121A11] border border-[#243324]/12 dark:border-white/10 hover:border-emerald-500/60 dark:hover:border-emerald-400/60 transition-all flex items-center justify-between text-xs"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <FolderGit2 className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="block font-bold text-[#1F2B1D] dark:text-white truncate group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                  Google Drive Asset
                </span>
                <span className="block text-[10.5px] font-mono text-[#526340] dark:text-[#8E9F89] truncate">
                  {submission.driveUrl.replace(/^https?:\/\//, '')}
                </span>
              </div>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-[#526340] dark:text-[#8E9F89] group-hover:text-emerald-600 shrink-0 ml-1.5" />
          </a>
        ) : null}

        {submission.gitUrl ? (
          <a
            href={submission.gitUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="group p-3 rounded-xl bg-[#FAF7F0] dark:bg-[#121A11] border border-[#243324]/12 dark:border-white/10 hover:border-indigo-500/60 dark:hover:border-indigo-400/60 transition-all flex items-center justify-between text-xs"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 flex items-center justify-center shrink-0">
                <GitBranch className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="block font-bold text-[#1F2B1D] dark:text-white truncate group-hover:text-indigo-700 dark:group-hover:text-indigo-400 transition-colors">
                  GitHub Repository
                </span>
                <span className="block text-[10.5px] font-mono text-[#526340] dark:text-[#8E9F89] truncate">
                  {submission.gitUrl.replace(/^https?:\/\//, '')}
                </span>
              </div>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-[#526340] dark:text-[#8E9F89] group-hover:text-indigo-600 shrink-0 ml-1.5" />
          </a>
        ) : null}
      </div>

      {/* Submitter Notes */}
      {submission.notes && (
        <div className="p-2.5 rounded-lg bg-[#FAF7F0] dark:bg-[#10170F] border border-[#243324]/8 dark:border-white/8 text-xs space-y-0.5">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#526340] dark:text-[#8E9F89] flex items-center gap-1">
            <FileText className="w-3 h-3 text-emerald-600" />
            <span>Submission Notes</span>
          </span>
          <p className="text-[#3F543C] dark:text-[#CBD7C7] text-[11.5px] leading-relaxed">
            {submission.notes}
          </p>
        </div>
      )}

      {/* Mentor Review Status & Feedback */}
      {latestReview && (
        <div
          className={`p-3 rounded-xl border text-xs space-y-1.5 ${
            latestReview.decision === 'approved'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-950 dark:text-emerald-200'
              : 'bg-amber-500/10 border-amber-500/30 text-amber-950 dark:text-amber-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="font-bold flex items-center gap-1.5">
              {latestReview.decision === 'approved' ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Approved by {resolveUserName(latestReview.reviewedBy)}</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Revision Requested by {resolveUserName(latestReview.reviewedBy)}</span>
                </>
              )}
            </span>
            <span className="text-[10.5px] font-mono opacity-80">
              {new Date(latestReview.reviewedAt).toLocaleDateString()}
            </span>
          </div>

          {latestReview.feedback && (
            <p className="text-[11px] leading-relaxed pl-5 border-l-2 border-current/30 italic">
              &ldquo;{latestReview.feedback}&rdquo;
            </p>
          )}
        </div>
      )}
    </div>
  );
};
