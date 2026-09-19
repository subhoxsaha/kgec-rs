import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, ShieldAlert, X, Cpu, CheckCircle2, LogOut, Sparkles, GraduationCap } from 'lucide-react';
import { useReportData } from '../context/ReportDataContext';
import { triggerGoogleOAuth } from '../lib/googleAuth';

export const BackdoorLoginModal: React.FC = () => {
  const {
    isBackdoorModalOpen,
    closeBackdoorModal,
    loginWithGoogleUser,
    logoutAdmin,
    googleUser,
    isAdminLoggedIn,
    isStudentLoggedIn,
    openEditor,
  } = useReportData();

  const [error, setError] = useState<string | null>(null);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  if (!isBackdoorModalOpen) return null;

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    setError(null);
    try {
      const user = await triggerGoogleOAuth();
      loginWithGoogleUser(user);
    } catch (err: any) {
      console.warn('Google Sign-In notice:', err);
      const msg = err?.message || '';
      if (msg.includes('popup_closed_by_user') || msg.includes('user_cancel')) {
        setError('Google sign-in popup was closed before completing authentication.');
      } else {
        setError(msg || 'Google authentication could not be completed.');
      }
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeBackdoorModal}
          className="fixed inset-0 bg-[#0A1009]/80 backdrop-blur-md transition-opacity"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: 'spring', duration: 0.4, bounce: 0.15 }}
          className="relative w-full max-w-md bg-[#FAF7F0] dark:bg-[#1A2619] rounded-[2rem] border border-[#243324]/15 dark:border-white/15 shadow-2xl p-6 sm:p-8 text-[#1F2B1D] dark:text-[#F4EFE6] z-10 overflow-hidden"
        >
          {/* Decorative glow */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

          {/* Close Button */}
          <button
            type="button"
            onClick={closeBackdoorModal}
            className="absolute top-5 right-5 p-2 rounded-full text-[#657351] dark:text-[#A3B59E] hover:bg-[#243324]/10 dark:hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close authentication modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="space-y-3 mb-6">
            <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-[#E8E2D4] dark:bg-[#253924] text-emerald-800 dark:text-emerald-300 border border-[#243324]/10 dark:border-white/10 shadow-xs">
              <Cpu className="w-6 h-6" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-[#657351] dark:text-[#A3B59E]">
                  KGEC Robotics Society
                </span>
              </div>
              <h3 className="font-display text-2xl sm:text-3xl text-[#1F2B1D] dark:text-[#F4EFE6] font-normal mt-1">
                Authentication Portal
              </h3>
              <p className="text-xs sm:text-sm text-[#52664C] dark:text-[#CBD7C7] font-light mt-1.5 leading-relaxed">
                Sign in securely with your Google account. Society administration is reserved for verified admin credentials.
              </p>
            </div>
          </div>

          {/* Currently Signed-In User State */}
          {googleUser ? (
            <div className="space-y-4 mb-6">
              <div className="p-4 rounded-2xl bg-white dark:bg-[#152014] border border-[#243324]/15 dark:border-white/15 shadow-xs space-y-3">
                <div className="flex items-center gap-3">
                  {googleUser.picture ? (
                    <img
                      src={googleUser.picture}
                      alt={googleUser.name}
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 rounded-full border-2 border-emerald-600/50 shadow-xs object-cover shrink-0"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-emerald-800 text-white flex items-center justify-center font-bold text-base shrink-0">
                      {googleUser.name?.charAt(0) || 'U'}
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-semibold text-[#1F2B1D] dark:text-white truncate">
                        {googleUser.name}
                      </h4>
                      {isAdminLoggedIn ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-500/30">
                          <ShieldCheck className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                          Admin
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-600/15 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30">
                          <GraduationCap className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                          Student
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#657351] dark:text-[#A3B59E] truncate font-mono">
                      {googleUser.email}
                    </p>
                  </div>
                </div>

                <div className="text-xs pt-1 border-t border-[#243324]/10 dark:border-white/10 text-[#52664C] dark:text-[#CBD7C7]">
                  {isAdminLoggedIn ? (
                    <p className="text-emerald-700 dark:text-emerald-300 font-medium flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                      Full Administrator Privileges Active (CMS enabled)
                    </p>
                  ) : (
                    <p className="text-neutral-600 dark:text-neutral-300">
                      Student Access: You are signed in as a community member. Content editor is restricted to society administrators.
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {isAdminLoggedIn && (
                  <button
                    type="button"
                    onClick={() => {
                      closeBackdoorModal();
                      openEditor('metrics');
                    }}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-800 dark:bg-emerald-700 hover:bg-emerald-900 dark:hover:bg-emerald-600 text-white font-medium text-xs transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Open Content Editor</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={logoutAdmin}
                  className="py-2.5 px-4 rounded-xl border border-red-500/30 hover:bg-red-500/10 text-red-600 dark:text-red-400 font-medium text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          ) : (
            /* Primary Sign-In Section */
            <div className="space-y-4 mb-6">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isGoogleLoading}
                className="w-full py-3.5 px-4 rounded-2xl bg-white dark:bg-[#152014] hover:bg-neutral-50 dark:hover:bg-[#1E2D1D] text-[#1F2B1D] dark:text-white border-2 border-[#243324]/20 dark:border-white/20 hover:border-emerald-600 dark:hover:border-emerald-500 font-semibold text-sm transition-all shadow-md flex items-center justify-center gap-3 cursor-pointer disabled:opacity-60 group"
              >
                {isGoogleLoading ? (
                  <span className="animate-spin w-5 h-5 border-2 border-emerald-600 border-t-transparent rounded-full" />
                ) : (
                  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                )}
                <span className="group-hover:translate-x-0.5 transition-transform">
                  Continue with Google
                </span>
              </button>

              {error && (
                <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-500/30 text-xs text-red-600 dark:text-red-400 font-medium flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
