import React, { useState, useEffect } from 'react';
import {
  Database,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  HardDrive,
  Layers,
  ArrowUpRight,
  Server,
  Cloud,
  Check,
  Copy,
} from 'lucide-react';
import { fetchMongoDbStatus, syncCmsToMongoDB, fetchCmsFromMongoDB, MongoDbStatus } from '../../utils/storageManager';
import { useReportData } from '../../context/ReportDataContext';

export const MongoDbStatusWidget: React.FC = () => {
  const {
    metadata,
    sectionTexts,
    wings,
    roadmap,
    botProjects,
    techfestPhotos,
    activityPhotos,
    hackathonPhotos,
    teamMembers,
    showToast,
  } = useReportData();

  const [dbStatus, setDbStatus] = useState<MongoDbStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [lastLatency, setLastLatency] = useState<number | null>(null);
  const [copiedEnv, setCopiedEnv] = useState(false);

  const checkStatus = async (force = false) => {
    setLoading(true);
    const start = performance.now();
    try {
      const status = await fetchMongoDbStatus(force);
      const elapsed = Math.round(performance.now() - start);
      setDbStatus(status);
      setLastLatency(elapsed);
    } catch {
      setDbStatus({
        connected: false,
        uriConfigured: false,
        dbName: 'kgec_robotics',
        collections: [],
        error: 'Backend API offline',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkStatus();
    const interval = setInterval(checkStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleForceSync = async () => {
    setSyncing(true);
    const payload = {
      metadata,
      sectionTexts,
      wings,
      roadmap,
      botProjects,
      techfestPhotos,
      activityPhotos,
      hackathonPhotos,
      teamMembers,
      lastUpdated: new Date().toISOString(),
    };

    try {
      const res = await syncCmsToMongoDB(payload);
      if (res.success) {
        showToast(`Synced ${teamMembers.length} members & ${botProjects.length} bots to MongoDB`);
        checkStatus();
      } else {
        showToast(res.error || 'Sync completed with local fallback');
      }
    } catch (err: any) {
      showToast('Error syncing to MongoDB: ' + err.message);
    } finally {
      setSyncing(false);
    }
  };

  const handleCopyEnvExample = () => {
    const text = `MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/kgec_robotics?retryWrites=true&w=majority\nMONGODB_DB_NAME=kgec_robotics`;
    navigator.clipboard.writeText(text);
    setCopiedEnv(true);
    showToast('MongoDB .env example copied');
    setTimeout(() => setCopiedEnv(false), 2500);
  };

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#1A2619] border border-[#243324]/12 dark:border-white/12 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#243324]/8 dark:border-white/8">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-[#1F2B1D] dark:text-[#F4EFE6] font-display">
                MongoDB Database Engine
              </h3>
              {dbStatus?.connected ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  ONLINE • CONNECTED
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  LOCAL MEMORY CACHE
                </span>
              )}
            </div>
            <p className="text-xs text-[#657351] dark:text-[#9DAE9A] mt-0.5">
              Database: <span className="font-mono font-semibold text-emerald-800 dark:text-emerald-300">{dbStatus?.dbName || 'kgec_robotics'}</span>
              {lastLatency !== null && <span className="ml-2 text-[11px] font-mono">({lastLatency}ms ping)</span>}
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => checkStatus(true)}
            disabled={loading}
            className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg border border-[#243324]/15 dark:border-white/15 text-xs font-medium hover:bg-[#243324]/5 dark:hover:bg-white/5 transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            title="Refresh database status"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <button
            type="button"
            onClick={handleForceSync}
            disabled={syncing}
            className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <Cloud className={`w-3.5 h-3.5 ${syncing ? 'animate-bounce' : ''}`} />
            <span>{syncing ? 'Syncing...' : 'Sync to MongoDB'}</span>
          </button>
        </div>
      </div>

      {/* Grid of collections & stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
        <div className="p-2.5 rounded-xl bg-[#FAF7F2] dark:bg-[#142013] border border-[#243324]/8 dark:border-white/8">
          <div className="flex items-center justify-between text-[#657351] dark:text-[#9DAE9A]">
            <span className="font-mono text-[10px] uppercase">cms_state</span>
            <Layers className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <div className="text-base font-bold text-[#1F2B1D] dark:text-[#F4EFE6] font-mono mt-1">
            {dbStatus?.documentCounts?.cms_state ?? 1}
          </div>
          <p className="text-[10px] text-[#657351] dark:text-[#9DAE9A] mt-0.5">Master state doc</p>
        </div>

        <div className="p-2.5 rounded-xl bg-[#FAF7F2] dark:bg-[#142013] border border-[#243324]/8 dark:border-white/8">
          <div className="flex items-center justify-between text-[#657351] dark:text-[#9DAE9A]">
            <span className="font-mono text-[10px] uppercase">team_members</span>
            <Server className="w-3.5 h-3.5 text-indigo-600" />
          </div>
          <div className="text-base font-bold text-[#1F2B1D] dark:text-[#F4EFE6] font-mono mt-1">
            {dbStatus?.documentCounts?.team_members ?? teamMembers.length}
          </div>
          <p className="text-[10px] text-[#657351] dark:text-[#9DAE9A] mt-0.5">Mentors &amp; Leads</p>
        </div>

        <div className="p-2.5 rounded-xl bg-[#FAF7F2] dark:bg-[#142013] border border-[#243324]/8 dark:border-white/8">
          <div className="flex items-center justify-between text-[#657351] dark:text-[#9DAE9A]">
            <span className="font-mono text-[10px] uppercase">projects</span>
            <HardDrive className="w-3.5 h-3.5 text-cyan-600" />
          </div>
          <div className="text-base font-bold text-[#1F2B1D] dark:text-[#F4EFE6] font-mono mt-1">
            {dbStatus?.documentCounts?.projects ?? botProjects.length}
          </div>
          <p className="text-[10px] text-[#657351] dark:text-[#9DAE9A] mt-0.5">Bot specifications</p>
        </div>

        <div className="p-2.5 rounded-xl bg-[#FAF7F2] dark:bg-[#142013] border border-[#243324]/8 dark:border-white/8">
          <div className="flex items-center justify-between text-[#657351] dark:text-[#9DAE9A]">
            <span className="font-mono text-[10px] uppercase">messages_feedback</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-amber-600" />
          </div>
          <div className="text-base font-bold text-[#1F2B1D] dark:text-[#F4EFE6] font-mono mt-1">
            {dbStatus?.documentCounts?.messages_feedback ?? 0}
          </div>
          <p className="text-[10px] text-[#657351] dark:text-[#9DAE9A] mt-0.5">Visitor inquiries</p>
        </div>
      </div>

      {/* Error Banner when Atlas connection has an issue */}
      {dbStatus?.error && !dbStatus.connected && (
        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold text-amber-950 dark:text-amber-100">
              Database Connection Notice
            </p>
            <p className="text-[11px] leading-relaxed text-amber-900/90 dark:text-amber-200/90 font-mono">
              {dbStatus.error}
            </p>
          </div>
        </div>
      )}

      {/* Info Notice & .env helper */}
      <div className="p-3 rounded-xl bg-emerald-500/8 dark:bg-emerald-500/10 border border-emerald-500/20 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div className="space-y-0.5">
          <p className="font-medium text-[#1F2B1D] dark:text-[#F4EFE6]">
            {dbStatus?.connected
              ? '✓ MongoDB cluster is actively syncing CMS modifications, robotics telemetry, and messages.'
              : 'MongoDB is configured with automatic failover to high-capacity local IndexedDB & in-memory caching.'}
          </p>
          <p className="text-[11px] text-[#657351] dark:text-[#CBD7C7]">
            To connect an external MongoDB Atlas cluster, set <code className="font-mono font-bold">MONGODB_URI</code> in environment secrets.
          </p>
        </div>

        <button
          type="button"
          onClick={handleCopyEnvExample}
          className="shrink-0 px-2.5 py-1 rounded-md bg-white dark:bg-[#1F301E] border border-[#243324]/15 dark:border-white/15 text-[11px] font-medium text-[#243324] dark:text-[#E6F4E2] hover:bg-emerald-50 dark:hover:bg-emerald-950/40 flex items-center gap-1 transition-colors cursor-pointer"
        >
          {copiedEnv ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
          <span>{copiedEnv ? 'Copied .env' : 'Copy .env Config'}</span>
        </button>
      </div>
    </div>
  );
};
