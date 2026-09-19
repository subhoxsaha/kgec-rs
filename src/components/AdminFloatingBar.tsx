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
    </>
  );
};

