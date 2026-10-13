import React, { useState } from 'react';
import {
  Sparkles,
  ChevronDown,
  ChevronUp,
  Bot,
  Search,
  Copy,
  Download,
  RefreshCw,
  FolderTree,
  Check,
} from 'lucide-react';
import { useReportData } from '../../context/ReportDataContext';
import { fetchStaticProjectsData } from '../../utils/teamUtils';

export const ProjectsEditor: React.FC = () => {
  const { botProjects, updateBotProject, showToast } = useReportData();

  const [expandedProjectId, setExpandedProjectId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedProjectsJson, setCopiedProjectsJson] = useState(false);
  const [isSyncingProjects, setIsSyncingProjects] = useState(false);

  const handleCopyProjectsJson = () => {
    navigator.clipboard.writeText(JSON.stringify(botProjects, null, 2));
    setCopiedProjectsJson(true);
    showToast('Copied projects configuration to clipboard!');
    setTimeout(() => setCopiedProjectsJson(false), 2500);
  };

  const handleDownloadProjectsJson = () => {
    const blob = new Blob([JSON.stringify(botProjects, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'projects.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Downloaded projects.json');
  };

  const handleReloadProjectsFile = async () => {
    setIsSyncingProjects(true);
    try {
      const data = await fetchStaticProjectsData();
      if (Array.isArray(data) && data.length > 0) {
        data.forEach((p) => {
          updateBotProject(p.id, p);
        });
        showToast(`Synced ${data.length} projects from /public/data/projects.json`);
      }
    } catch {
      showToast('Could not reload from /public/data/projects.json');
    } finally {
      setIsSyncingProjects(false);
    }
  };

  // Filtered list
  const filteredProjects = botProjects.filter((p) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.codename.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.status.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-4 text-[#243324] dark:text-[#F4EFE6]">
      {/* Static File Architecture Banner */}
      <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-emerald-950 dark:text-emerald-200">
        <div className="flex items-start gap-2.5">
          <FolderTree className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <p className="font-bold">
              Hardcoded Fleet Architecture: <code className="font-mono bg-emerald-500/20 px-1.5 py-0.5 rounded text-[11px]">public/data/projects.json</code> &amp; <code className="font-mono bg-emerald-500/20 px-1.5 py-0.5 rounded text-[11px]">public/projects/</code>
            </p>
            <p className="text-[11px] text-[#3F543C] dark:text-[#CBD7C7] leading-relaxed">
              All combat machines, rovers, and autonomous builds are loaded directly from hardcoded static assets.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
          <button
            type="button"
            onClick={handleReloadProjectsFile}
            disabled={isSyncingProjects}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-white dark:bg-[#20301F] border border-emerald-500/40 hover:bg-emerald-50 text-[11px] font-semibold text-emerald-900 dark:text-emerald-200 cursor-pointer shadow-2xs"
            title="Reload data from /public/data/projects.json"
          >
            <RefreshCw className={`w-3 h-3 ${isSyncingProjects ? 'animate-spin' : ''}`} />
            <span>Reload file</span>
          </button>
          <button
            type="button"
            onClick={handleCopyProjectsJson}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-800 hover:bg-emerald-700 text-[11px] font-semibold text-white cursor-pointer shadow-2xs"
            title="Copy JSON configuration for public/data/projects.json"
          >
            {copiedProjectsJson ? <Check className="w-3 h-3 text-emerald-300" /> : <Copy className="w-3 h-3" />}
            <span>{copiedProjectsJson ? 'Copied' : 'Copy JSON'}</span>
          </button>
          <button
            type="button"
            onClick={handleDownloadProjectsJson}
            className="p-1 rounded bg-white dark:bg-[#20301F] border border-emerald-500/40 hover:bg-emerald-50 text-emerald-900 dark:text-emerald-200 cursor-pointer"
            title="Download projects.json"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Top Banner & Info Strip */}
      <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start gap-2.5">
          <Bot className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400 mt-0.5" />
          <div>
            <p className="text-emerald-950 dark:text-emerald-200 font-semibold">
              Flagship Robotics Fleet &amp; Specifications (Read-Only)
            </p>
            <p className="text-emerald-800/80 dark:text-emerald-300/80 text-[11px]">
              {botProjects.length} active combat robots, rovers, and autonomous machines in catalog.
            </p>
          </div>
        </div>

        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-semibold bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border border-emerald-500/20">
          <Sparkles className="w-3 h-3" />
          <span>{botProjects.length} Bots Loaded</span>
        </span>
      </div>

      {/* Search & Filter Bar */}
      <div className="relative">
        <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#657351] dark:text-[#A3B59E]" />
        <input
          type="text"
          placeholder="Filter projects by name, codename, category, or status..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-white dark:bg-[#1A2619] border border-[#243324]/15 dark:border-white/15 text-xs placeholder:text-[#657351]/70"
        />
      </div>

      {/* Projects Read-Only Catalog */}
      <div className="space-y-3">
        {filteredProjects.map((project, idx) => {
          const isExpanded = expandedProjectId === project.id;

          return (
            <div
              key={project.id}
              className="p-3.5 rounded-xl bg-white dark:bg-[#1A2619] border border-[#243324]/10 dark:border-white/10 shadow-2xs space-y-3 transition-all"
            >
              {/* Project Card Header Strip */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-12 h-10 rounded-lg overflow-hidden bg-black/10 shrink-0 border border-black/10">
                    <img
                      src={project.imageUrl || undefined}
                      alt={project.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=600&q=80';
                      }}
                    />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h4 className="font-bold text-xs truncate text-[#1F2B1D] dark:text-white">
                        {project.name}
                      </h4>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#243324]/10 dark:bg-white/10 text-[#526340] dark:text-[#A3B59E]">
                        {project.codename}
                      </span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded-full font-semibold bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border border-emerald-500/20">
                        {project.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#657351] dark:text-[#9FB19A] truncate mt-0.5">
                      {project.weightClass} &bull; {project.wingName} &bull; {project.podiumsCount} Podiums
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => setExpandedProjectId(isExpanded ? null : project.id)}
                    className="p-1.5 rounded-lg border border-[#243324]/15 dark:border-white/15 text-xs font-medium hover:bg-[#243324]/10 dark:hover:bg-white/10 flex items-center gap-1 cursor-pointer"
                    title={isExpanded ? 'Collapse specifications' : 'View specifications'}
                  >
                    <span className="text-[11px] font-medium text-emerald-800 dark:text-emerald-400">
                      {isExpanded ? 'Hide Specs' : 'View Specs'}
                    </span>
                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" /> : <ChevronDown className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />}
                  </button>
                </div>
              </div>

              {/* Expanded Detailed Specs (Read-Only) */}
              {isExpanded && (
                <div className="pt-3 border-t border-[#243324]/10 dark:border-white/10 space-y-3 text-xs animate-in fade-in duration-150">
                  {/* Key Metadata */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                    <div className="p-2 rounded bg-[#FAF7F0] dark:bg-[#111910] border border-[#243324]/10 dark:border-white/10">
                      <span className="text-[9px] text-[#657351] dark:text-[#A3B59E] uppercase font-bold block">Division</span>
                      <span className="font-semibold">{project.wingName}</span>
                    </div>
                    <div className="p-2 rounded bg-[#FAF7F0] dark:bg-[#111910] border border-[#243324]/10 dark:border-white/10">
                      <span className="text-[9px] text-[#657351] dark:text-[#A3B59E] uppercase font-bold block">Weight Class</span>
                      <span className="font-semibold">{project.weightClass}</span>
                    </div>
                    <div className="p-2 rounded bg-[#FAF7F0] dark:bg-[#111910] border border-[#243324]/10 dark:border-white/10">
                      <span className="text-[9px] text-[#657351] dark:text-[#A3B59E] uppercase font-bold block">Podiums</span>
                      <span className="font-semibold text-amber-700 dark:text-amber-400 font-mono">{project.podiumsCount} Honors</span>
                    </div>
                    <div className="p-2 rounded bg-[#FAF7F0] dark:bg-[#111910] border border-[#243324]/10 dark:border-white/10">
                      <span className="text-[9px] text-[#657351] dark:text-[#A3B59E] uppercase font-bold block">Tagline</span>
                      <span className="font-semibold truncate block" title={project.tagline}>{project.tagline}</span>
                    </div>
                  </div>

                  {/* Hardware Specifications Grid */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#526340] dark:text-[#A3B59E] block">
                      Hardware Specifications
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                      <div className="p-2 rounded bg-[#FAF7F0] dark:bg-[#111910] border border-[#243324]/10 dark:border-white/10">
                        <span className="text-[9px] text-[#657351] dark:text-[#A3B59E] block">Chassis Material</span>
                        <span className="font-mono text-[11px] font-medium">{project.specs?.chassisMaterial || 'N/A'}</span>
                      </div>
                      <div className="p-2 rounded bg-[#FAF7F0] dark:bg-[#111910] border border-[#243324]/10 dark:border-white/10">
                        <span className="text-[9px] text-[#657351] dark:text-[#A3B59E] block">Controller Unit</span>
                        <span className="font-mono text-[11px] font-medium">{project.specs?.controller || 'N/A'}</span>
                      </div>
                      <div className="p-2 rounded bg-[#FAF7F0] dark:bg-[#111910] border border-[#243324]/10 dark:border-white/10">
                        <span className="text-[9px] text-[#657351] dark:text-[#A3B59E] block">Weapon / Actuator</span>
                        <span className="font-mono text-[11px] font-medium">{project.specs?.actuatorsOrWeapon || 'N/A'}</span>
                      </div>
                      <div className="p-2 rounded bg-[#FAF7F0] dark:bg-[#111910] border border-[#243324]/10 dark:border-white/10">
                        <span className="text-[9px] text-[#657351] dark:text-[#A3B59E] block">Power System</span>
                        <span className="font-mono text-[11px] font-medium">{project.specs?.power || 'N/A'}</span>
                      </div>
                      <div className="p-2 rounded bg-[#FAF7F0] dark:bg-[#111910] border border-[#243324]/10 dark:border-white/10">
                        <span className="text-[9px] text-[#657351] dark:text-[#A3B59E] block">Weight</span>
                        <span className="font-mono text-[11px] font-medium">{project.specs?.weight || 'N/A'}</span>
                      </div>
                      <div className="p-2 rounded bg-[#FAF7F0] dark:bg-[#111910] border border-[#243324]/10 dark:border-white/10">
                        <span className="text-[9px] text-[#657351] dark:text-[#A3B59E] block">Speed</span>
                        <span className="font-mono text-[11px] font-medium">{project.specs?.speed || 'N/A'}</span>
                      </div>
                      <div className="p-2 rounded bg-[#FAF7F0] dark:bg-[#111910] border border-[#243324]/10 dark:border-white/10 sm:col-span-2">
                        <span className="text-[9px] text-[#657351] dark:text-[#A3B59E] block">Dimensions</span>
                        <span className="font-mono text-[11px] font-medium">{project.specs?.dimensions || 'N/A'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Narrative Descriptions */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 rounded bg-[#FAF7F0] dark:bg-[#111910] border border-[#243324]/10 dark:border-white/10">
                      <span className="block text-[9px] font-bold text-[#657351] dark:text-[#A3B59E] mb-1">
                        Overview Description
                      </span>
                      <p className="text-[#3F543C] dark:text-[#CBD7C7] leading-relaxed">
                        {project.description}
                      </p>
                    </div>

                    <div className="p-2.5 rounded bg-[#FAF7F0] dark:bg-[#111910] border border-[#243324]/10 dark:border-white/10">
                      <span className="block text-[9px] font-bold text-[#657351] dark:text-[#A3B59E] mb-1">
                        Architecture Technical Summary
                      </span>
                      <p className="text-[#3F543C] dark:text-[#CBD7C7] leading-relaxed">
                        {project.architectureSummary}
                      </p>
                    </div>
                  </div>

                  {/* Key Features List */}
                  {project.keyFeatures && project.keyFeatures.length > 0 && (
                    <div>
                      <span className="block text-[10px] font-bold uppercase tracking-wider text-[#526340] dark:text-[#A3B59E] mb-1.5">
                        Key Engineering Highlights
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {project.keyFeatures.map((feat, fIdx) => (
                          <span
                            key={fIdx}
                            className="inline-flex items-center px-2 py-0.5 rounded-md bg-[#243324]/10 dark:bg-white/10 text-[11px]"
                          >
                            {feat}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {filteredProjects.length === 0 && (
          <div className="p-8 text-center bg-white dark:bg-[#1A2619] rounded-xl border border-[#243324]/10 dark:border-white/10 text-xs text-[#657351]">
            No projects matched your search &ldquo;{searchQuery}&rdquo;.
          </div>
        )}
      </div>
    </div>
  );
};
