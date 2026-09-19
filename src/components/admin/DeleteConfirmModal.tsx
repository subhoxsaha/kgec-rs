import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  title?: string;
  itemName: string;
  itemType?: string;
  warningText?: string;
  confirmButtonText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  title = 'Confirm Deletion',
  itemName,
  itemType = 'item',
  warningText,
  confirmButtonText = 'Delete Forever',
  onConfirm,
  onCancel,
}) => {
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onCancel();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
        {/* Dark Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onCancel}
          className="fixed inset-0 bg-black/75 backdrop-blur-xs transition-opacity"
        />

        {/* Modal Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 15 }}
          transition={{ type: 'spring', damping: 26, stiffness: 320 }}
          className="relative w-full max-w-md rounded-2xl bg-[#FAF8F4] dark:bg-[#152014] text-[#1F2B1D] dark:text-[#F4EFE6] shadow-[0_20px_60px_rgba(0,0,0,0.45)] border border-rose-500/30 overflow-hidden z-10"
        >
          {/* Header Accent Bar */}
          <div className="h-1.5 w-full bg-gradient-to-r from-rose-600 via-amber-500 to-rose-600" />

          <div className="p-6">
            <div className="flex items-start gap-4">
              {/* Alert Warning Icon */}
              <div className="w-12 h-12 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0 shadow-inner">
                <AlertTriangle className="w-6 h-6" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono uppercase font-bold tracking-wider text-rose-600 dark:text-rose-400">
                    Delete Confirmation
                  </span>
                  <button
                    type="button"
                    onClick={onCancel}
                    className="p-1 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-white transition-colors cursor-pointer"
                    title="Close"
                    aria-label="Close"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <h3 className="text-lg font-bold text-[#1F2B1D] dark:text-[#F4EFE6] mt-0.5 leading-snug">
                  {title}
                </h3>
              </div>
            </div>

            {/* Target Item Highlight */}
            <div className="mt-4 p-3 rounded-xl bg-white dark:bg-[#1A2619] border border-[#243324]/10 dark:border-white/10 shadow-2xs">
              <div className="text-[10px] uppercase font-mono tracking-wider text-[#657351] dark:text-[#9DAE9A]">
                Target {itemType}:
              </div>
              <div className="text-sm font-semibold text-[#1F2B1D] dark:text-[#F4EFE6] truncate mt-0.5">
                &ldquo;{itemName}&rdquo;
              </div>
            </div>

            {/* Warning Text */}
            <p className="mt-3 text-xs text-[#526340] dark:text-[#A3B59E] leading-relaxed">
              {warningText ||
                `Are you sure you want to permanently delete this ${itemType}? This record will be erased immediately from the local database and public website.`}
            </p>

            {/* Modal Actions */}
            <div className="mt-6 flex items-center justify-end gap-2.5 pt-3 border-t border-[#243324]/10 dark:border-white/10">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 rounded-xl border border-[#243324]/20 dark:border-white/15 text-xs font-semibold text-[#3D4F3B] dark:text-[#CBD5C8] hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={onConfirm}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white text-xs font-bold shadow-md shadow-rose-600/30 flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{confirmButtonText}</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
