import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sliders, LogOut, Check, ShieldCheck, GraduationCap, Briefcase, Cpu } from 'lucide-react';
import { useReportData } from '../context/ReportDataContext';
import { ROLE_CONFIG } from '../types';

export const AdminFloatingBar: React.FC = () => {
  const {
    isAdminLoggedIn,
    isStudentLoggedIn,
    googleUser,
    openEditor,
    logoutAdmin,
    currentUserProfile,
    setIsApplicationFormOpen,
    toastMessage,
  } = useReportData();

  const userRole = currentUserProfile?.role || (isAdminLoggedIn ? 'admin' : 'member');
  const roleCfg = ROLE_CONFIG[userRole] || ROLE_CONFIG.member;

  return (
    <>
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-6 left-6 z-[120] max-w-sm px-4 py-3 rounded-2xl bg-[#1F2B1D] dark:bg-[#1C2C1B] text-[#F4EFE6] border border-white/15 shadow-2xl flex items-center gap-3 pointer-events-none"
          >
            <div className="p-1.5 rounded-full bg-emerald-500/20 text-emerald-400">
              <Check className="w-4 h-4" />
            </div>
            <span className="text-xs font-medium leading-tight">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Admin & Member Dock when authenticated */}
      <AnimatePresence>
        {isAdminLoggedIn && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-40 flex items-center gap-2 p-1.5 rounded-full bg-[#1F2B1D]/95 dark:bg-[#1A2619]/95 backdrop-blur-md text-white border border-amber-500/40 shadow-2xl"
          >
            {googleUser && googleUser.picture ? (
              <img
                src={googleUser.picture}
                alt={googleUser.name}
                referrerPolicy="no-referrer"
                className="w-6 h-6 rounded-full border border-amber-400 object-cover shrink-0 ml-1"
                title={`Admin: ${googleUser.name} (${googleUser.email})`}
              />
            ) : (
              <div className="w-6 h-6 rounded-full bg-amber-600 text-white flex items-center justify-center shrink-0 ml-1">
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
            )}

            <button
              onClick={() => openEditor('overview')}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-white/15 transition-all text-xs font-medium cursor-pointer"
              title="Open Website Content Management System"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
              </span>
              <Sliders className="w-3.5 h-3.5 text-amber-300" />
              <span className="tracking-wide">
                <span className="hidden sm:inline">{googleUser?.name?.split(' ')[0] || 'Admin'} • </span>Admin CMS
              </span>
            </button>

            <div className="h-4 w-px bg-white/20" />

            <button
              onClick={logoutAdmin}
              className="p-1.5 rounded-full hover:bg-red-500/25 text-white/70 hover:text-red-300 transition-colors cursor-pointer"
              title="Sign out of Google Admin session"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}

        {isStudentLoggedIn && !isAdminLoggedIn && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-40 flex items-center gap-2 p-1.5 rounded-full bg-[#1F2B1D]/95 dark:bg-[#1A2619]/95 backdrop-blur-md text-white border border-emerald-500/30 shadow-xl"
          >
            {googleUser && googleUser.picture ? (
              <img
                src={googleUser.picture}
                alt={googleUser.name}
                referrerPolicy="no-referrer"
                className="w-6 h-6 rounded-full border border-emerald-400 object-cover shrink-0 ml-1"
              />
            ) : (
              <div className="w-6 h-6 rounded-full bg-emerald-700 text-white flex items-center justify-center shrink-0 ml-1">
                <GraduationCap className="w-3.5 h-3.5" />
              </div>
            )}

            <button
              onClick={() => setIsApplicationFormOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full hover:bg-white/10 transition-colors text-xs font-medium cursor-pointer text-[#D5E1D2]"
              title="View & Edit Application Profile"
            >
              <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full border ${roleCfg.bgColor} ${roleCfg.textColor} ${roleCfg.borderColor}`}>
                {roleCfg.label}
              </span>
              <span>{googleUser?.name?.split(' ')[0] || 'Member'}</span>
            </button>

            <div className="h-4 w-px bg-white/20" />

            <button
              onClick={logoutAdmin}
              className="p-1.5 rounded-full hover:bg-red-500/25 text-white/70 hover:text-red-300 transition-colors cursor-pointer"
              title="Sign out"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

