import React, { useState } from 'react';
import {
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Image as ImageIcon,
  Bot,
  Award,
  Layers,
  Wrench,
  Search,
} from 'lucide-react';
import { useReportData } from '../../context/ReportDataContext';
import { BotProject } from '../../types';
import { DeleteConfirmModal } from './DeleteConfirmModal';

export const ProjectsEditor: React.FC = () => {
  const { botProjects, addBotProject, updateBotProject, deleteBotProject, showToast } =
    useReportData();

  const [isAddingProject, setIsAddingProject] = useState(false);
  const [expandedProjectId, setExpandedProjectId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // New Project Form State
  const [newProject, setNewProject] = useState<Partial<BotProject>>({
    name: '',
    codename: '',
    tagline: '',
    imageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80',
    imageAlt: '',
    wingId: 'mechatronics',
    wingName: 'Mechatronics & Combat Division',
    category: 'Combat Robotics',
    weightClass: '30kg Middleweight',
    status: 'Operational Fleet',
    podiumsCount: 1,
    featuredAward: 'National Podium',
    description: '',
    architectureSummary: '',
    specs: {
      chassisMaterial: 'Hardox 500 & Aircraft Aluminum',
      controller: 'STM32 Microcontroller & High-Amp ESC',
      actuatorsOrWeapon: 'High-torque brushless drive with kinetic drum',
      power: '6S High-C LiPo Battery Pack',
      weight: '29.8 kg',
      dimensions: '520 x 460 x 200 mm',
      speed: '22 km/h',
    },
    keyFeatures: ['Custom CNC-milled chassis', 'Sub-millisecond radio telemetry', 'Impact-absorbing armor'],
  });

  const [newFeatureInput, setNewFeatureInput] = useState('');

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProject.name?.trim()) {
      showToast('Project name is required');
      return;
    }

    const id = `bot-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
    const fullProject: BotProject = {
      id,
      name: newProject.name.trim(),
      codename: newProject.codename?.trim() || newProject.name.toUpperCase().replace(/\s+/g, '-'),
      tagline: newProject.tagline?.trim() || 'High-performance robotics system',
      imageUrl:
        newProject.imageUrl?.trim() ||
        'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80',
      imageAlt: newProject.imageAlt || newProject.name,
      wingId: newProject.wingId || 'mechatronics',
      wingName: newProject.wingName || 'Mechatronics & Combat Division',
      category: newProject.category || 'Combat Robotics',
      weightClass: newProject.weightClass || '30kg Middleweight',
      status: newProject.status || 'Operational Fleet',
      podiumsCount: Number(newProject.podiumsCount) || 0,
      featuredAward: newProject.featuredAward || '',
      description: newProject.description || 'Custom autonomous and combat robot engineered by KGEC Robotics Society.',
      architectureSummary:
        newProject.architectureSummary || 'Integrated embedded control, custom PCB, and modular mechanics.',
      specs: {
        chassisMaterial: newProject.specs?.chassisMaterial || 'Aircraft Grade Aluminum',
        controller: newProject.specs?.controller || 'STM32 / ESP32',
        actuatorsOrWeapon: newProject.specs?.actuatorsOrWeapon || 'High-torque DC & Brushless',
        power: newProject.specs?.power || 'High-drain LiPo',
        weight: newProject.specs?.weight || '15-30 kg',
        dimensions: newProject.specs?.dimensions || '500 x 400 x 200 mm',
        speed: newProject.specs?.speed || '20 km/h',
      },
      keyFeatures:
        newProject.keyFeatures && newProject.keyFeatures.length > 0
          ? newProject.keyFeatures
          : ['Custom powertrain', 'Low-latency telemetry', 'Reinforced impact structure'],
    };

    addBotProject(fullProject);
    setIsAddingProject(false);
    setExpandedProjectId(id);
    // Reset form
    setNewProject({
      name: '',
      codename: '',
      tagline: '',
      imageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80',
      wingId: 'mechatronics',
      wingName: 'Mechatronics & Combat Division',
      category: 'Combat Robotics',
      weightClass: '30kg Middleweight',
      status: 'Operational Fleet',
      podiumsCount: 1,
      featuredAward: 'National Podium',
      description: '',
      architectureSummary: '',
      specs: {
        chassisMaterial: 'Hardox 500 & Aircraft Aluminum',
        controller: 'STM32 Microcontroller & High-Amp ESC',
        actuatorsOrWeapon: 'High-torque brushless drive with kinetic drum',
        power: '6S High-C LiPo Battery Pack',
        weight: '29.8 kg',
        dimensions: '520 x 460 x 200 mm',
        speed: '22 km/h',
      },
      keyFeatures: ['Custom CNC-milled chassis', 'Sub-millisecond radio telemetry', 'Impact-absorbing armor'],
    });
  };

  const handleAddFeatureToNew = () => {
    if (!newFeatureInput.trim()) return;
    setNewProject((prev) => ({
      ...prev,
      keyFeatures: [...(prev.keyFeatures || []), newFeatureInput.trim()],
    }));
    setNewFeatureInput('');
  };

  const handleRemoveFeatureFromNew = (idx: number) => {
    setNewProject((prev) => ({
      ...prev,
      keyFeatures: (prev.keyFeatures || []).filter((_, i) => i !== idx),
    }));
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

  const projectToDelete = botProjects.find((p) => p.id === deleteConfirmId);

  return (
    <div className="space-y-4 text-[#243324] dark:text-[#F4EFE6]">
      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!deleteConfirmId}
        title="Delete Robotic Fleet System?"
        itemName={projectToDelete?.name || ''}
        itemType="robot project"
        warningText="Are you sure you want to permanently delete this robot? It will be removed from the fleet directory, specifications catalog, and live showcase."
        onConfirm={() => {
          if (deleteConfirmId) {
            deleteBotProject(deleteConfirmId);
            setDeleteConfirmId(null);
          }
        }}
        onCancel={() => setDeleteConfirmId(null)}
      />

      {/* Top Banner & Action Controls */}
      <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start gap-2.5">
          <Bot className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400 mt-0.5" />
          <div>
            <p className="text-emerald-950 dark:text-emerald-200 font-semibold">
              Flagship Robotics Fleet &amp; Projects Manager
            </p>
            <p className="text-emerald-800/80 dark:text-emerald-300/80 text-[11px]">
              {botProjects.length} active combat robots, rovers, and autonomous machines in deployment.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsAddingProject(!isAddingProject)}
          className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white font-medium text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-xs shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{isAddingProject ? 'Close Form' : 'Add New Project'}</span>
        </button>
      </div>

      {/* Add New Project Modal / Panel */}
      {isAddingProject && (
        <form
          onSubmit={handleCreateProject}
          className="p-4 rounded-xl bg-white dark:bg-[#1A2619] border-2 border-emerald-600 dark:border-emerald-400 shadow-md space-y-3.5 text-xs animate-in fade-in duration-200"
        >
          <div className="flex items-center justify-between border-b border-[#243324]/10 dark:border-white/10 pb-2.5">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded bg-emerald-700 text-white">
                <Plus className="w-3.5 h-3.5" />
              </span>
              <h3 className="font-bold text-sm text-[#1F2B1D] dark:text-white">
                Register New Robotic System / Fleet Bot
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setIsAddingProject(false)}
              className="text-[#657351] hover:text-[#1F2B1D] cursor-pointer p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Primary Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <div>
              <label className="block text-[10px] font-bold uppercase text-[#526340] dark:text-[#A3B59E] mb-1">
                Project Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. KRS Aegis V3"
                value={newProject.name || ''}
                onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                className="w-full px-2.5 py-1.5 rounded-lg bg-[#FAF7F0] dark:bg-[#111910] border border-[#243324]/15 dark:border-white/15 font-semibold"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase text-[#526340] dark:text-[#A3B59E] mb-1">
                Codename
              </label>
              <input
                type="text"
                placeholder="e.g. AEGIS-03"
                value={newProject.codename || ''}
                onChange={(e) => setNewProject({ ...newProject, codename: e.target.value })}
                className="w-full px-2.5 py-1.5 rounded-lg bg-[#FAF7F0] dark:bg-[#111910] border border-[#243324]/15 dark:border-white/15 font-mono"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase text-[#526340] dark:text-[#A3B59E] mb-1">
                Category
              </label>
              <select
                value={newProject.category || 'Combat Robotics'}
                onChange={(e) => setNewProject({ ...newProject, category: e.target.value })}
                className="w-full px-2.5 py-1.5 rounded-lg bg-[#FAF7F0] dark:bg-[#111910] border border-[#243324]/15 dark:border-white/15"
              >
                <option value="Combat Robotics">Combat Robotics</option>
                <option value="Autonomous Rover">Autonomous Rover</option>
                <option value="Autonomous Drone / UAV">Autonomous Drone / UAV</option>
                <option value="Precision Micro-Robotics">Precision Micro-Robotics</option>
                <option value="Bio-Inspired Robotics">Bio-Inspired Robotics</option>
                <option value="Robo-Soccer / Sports">Robo-Soccer / Sports</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase text-[#526340] dark:text-[#A3B59E] mb-1">
                Technical Wing
              </label>
              <select
                value={newProject.wingId || 'mechatronics'}
                onChange={(e) => {
                  const wingId = e.target.value;
                  const wingNameMap: Record<string, string> = {
                    mechatronics: 'Mechatronics & Combat Division',
                    autonomous: 'Autonomous Systems & AI',
                    embedded: 'Embedded Systems & IoT',
                    aeromodelling: 'Aeromodelling & Drones',
                  };
                  setNewProject({
                    ...newProject,
                    wingId,
                    wingName: wingNameMap[wingId] || 'Technical Division',
                  });
                }}
                className="w-full px-2.5 py-1.5 rounded-lg bg-[#FAF7F0] dark:bg-[#111910] border border-[#243324]/15 dark:border-white/15"
              >
                <option value="mechatronics">Mechatronics & Combat Division</option>
                <option value="autonomous">Autonomous Systems & AI</option>
                <option value="embedded">Embedded Systems & IoT</option>
                <option value="aeromodelling">Aeromodelling & Drones</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase text-[#526340] dark:text-[#A3B59E] mb-1">
                Weight Class
              </label>
              <input
                type="text"
                placeholder="e.g. 30kg Middleweight"
                value={newProject.weightClass || ''}
                onChange={(e) => setNewProject({ ...newProject, weightClass: e.target.value })}
                className="w-full px-2.5 py-1.5 rounded-lg bg-[#FAF7F0] dark:bg-[#111910] border border-[#243324]/15 dark:border-white/15"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase text-[#526340] dark:text-[#A3B59E] mb-1">
                Operational Status
              </label>
              <select
                value={newProject.status || 'Operational Fleet'}
                onChange={(e) => setNewProject({ ...newProject, status: e.target.value })}
                className="w-full px-2.5 py-1.5 rounded-lg bg-[#FAF7F0] dark:bg-[#111910] border border-[#243324]/15 dark:border-white/15 font-medium"
              >
                <option value="Operational Fleet">Operational Fleet</option>
                <option value="Active R&D">Active R&D</option>
                <option value="National Champion">National Champion</option>
                <option value="Championship Veteran">Championship Veteran</option>
                <option value="Prototype Testing">Prototype Testing</option>
              </select>
            </div>
          </div>

          {/* Tagline & Awards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <div className="sm:col-span-2">
              <label className="block text-[10px] font-bold uppercase text-[#526340] dark:text-[#A3B59E] mb-1">
                Sub-headline Tagline
              </label>
              <input
                type="text"
                placeholder="e.g. 30kg High-Kinetic Vertical Spinner Drum with Titanium Armor"
                value={newProject.tagline || ''}
                onChange={(e) => setNewProject({ ...newProject, tagline: e.target.value })}
                className="w-full px-2.5 py-1.5 rounded-lg bg-[#FAF7F0] dark:bg-[#111910] border border-[#243324]/15 dark:border-white/15"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase text-[#526340] dark:text-[#A3B59E] mb-1">
                National Podiums Count
              </label>
              <input
                type="number"
                value={newProject.podiumsCount || 0}
                onChange={(e) => setNewProject({ ...newProject, podiumsCount: Number(e.target.value) || 0 })}
                className="w-full px-2.5 py-1.5 rounded-lg bg-[#FAF7F0] dark:bg-[#111910] border border-[#243324]/15 dark:border-white/15 font-mono"
              />
            </div>

            <div className="sm:col-span-3">
              <label className="block text-[10px] font-bold uppercase text-[#526340] dark:text-[#A3B59E] mb-1">
                Featured Award / Milestone
              </label>
              <input
                type="text"
                placeholder="e.g. 1st Place Champion - Techfest IIT Bombay & Robowars IIT Kharagpur"
                value={newProject.featuredAward || ''}
                onChange={(e) => setNewProject({ ...newProject, featuredAward: e.target.value })}
                className="w-full px-2.5 py-1.5 rounded-lg bg-[#FAF7F0] dark:bg-[#111910] border border-[#243324]/15 dark:border-white/15"
              />
            </div>
          </div>

          {/* Photo & Live Preview */}
          <div className="p-3 rounded-lg bg-[#FAF7F0] dark:bg-[#111910] border border-[#243324]/10 dark:border-white/10 space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="w-20 h-16 rounded-lg overflow-hidden bg-black/10 shrink-0 border border-black/10">
                <img
                  src={newProject.imageUrl || ''}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=600&q=80';
                  }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <label className="block text-[10px] font-bold uppercase text-[#526340] dark:text-[#A3B59E] mb-1">
                  Project Photo URL
                </label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={newProject.imageUrl || ''}
                  onChange={(e) => setNewProject({ ...newProject, imageUrl: e.target.value })}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-[#1A2619] border border-[#243324]/15 dark:border-white/15 font-mono text-[11px]"
                />
              </div>
            </div>
          </div>

          {/* Technical Specs Accordion Grid */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold uppercase text-[#526340] dark:text-[#A3B59E]">
              Hardware Specifications
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
              <div>
                <span className="text-[9px] text-[#657351] dark:text-[#A3B59E]">Chassis Material</span>
                <input
                  type="text"
                  placeholder="Hardox 500 & 7075 Aluminum"
                  value={newProject.specs?.chassisMaterial || ''}
                  onChange={(e) =>
                    setNewProject({
                      ...newProject,
                      specs: { ...newProject.specs!, chassisMaterial: e.target.value },
                    })
                  }
                  className="w-full px-2 py-1 rounded bg-[#FAF7F0] dark:bg-[#111910] border border-[#243324]/15 dark:border-white/15 text-[11px]"
                />
              </div>

              <div>
                <span className="text-[9px] text-[#657351] dark:text-[#A3B59E]">Controller Unit</span>
                <input
                  type="text"
                  placeholder="STM32F405 / VESC 6 MkVI"
                  value={newProject.specs?.controller || ''}
                  onChange={(e) =>
                    setNewProject({
                      ...newProject,
                      specs: { ...newProject.specs!, controller: e.target.value },
                    })
                  }
                  className="w-full px-2 py-1 rounded bg-[#FAF7F0] dark:bg-[#111910] border border-[#243324]/15 dark:border-white/15 text-[11px]"
                />
              </div>

              <div>
                <span className="text-[9px] text-[#657351] dark:text-[#A3B59E]">Weapon / Actuators</span>
                <input
                  type="text"
                  placeholder="6kW Brushless Drum (12,000 RPM)"
                  value={newProject.specs?.actuatorsOrWeapon || ''}
                  onChange={(e) =>
                    setNewProject({
                      ...newProject,
                      specs: { ...newProject.specs!, actuatorsOrWeapon: e.target.value },
                    })
                  }
                  className="w-full px-2 py-1 rounded bg-[#FAF7F0] dark:bg-[#111910] border border-[#243324]/15 dark:border-white/15 text-[11px]"
                />
              </div>

              <div>
                <span className="text-[9px] text-[#657351] dark:text-[#A3B59E]">Power System</span>
                <input
                  type="text"
                  placeholder="6S 5000mAh 120C LiPo"
                  value={newProject.specs?.power || ''}
                  onChange={(e) =>
                    setNewProject({
                      ...newProject,
                      specs: { ...newProject.specs!, power: e.target.value },
                    })
                  }
                  className="w-full px-2 py-1 rounded bg-[#FAF7F0] dark:bg-[#111910] border border-[#243324]/15 dark:border-white/15 text-[11px]"
                />
              </div>

              <div>
                <span className="text-[9px] text-[#657351] dark:text-[#A3B59E]">Weight</span>
                <input
                  type="text"
                  placeholder="29.8 kg"
                  value={newProject.specs?.weight || ''}
                  onChange={(e) =>
                    setNewProject({
                      ...newProject,
                      specs: { ...newProject.specs!, weight: e.target.value },
                    })
                  }
                  className="w-full px-2 py-1 rounded bg-[#FAF7F0] dark:bg-[#111910] border border-[#243324]/15 dark:border-white/15 text-[11px]"
                />
              </div>

              <div>
                <span className="text-[9px] text-[#657351] dark:text-[#A3B59E]">Dimensions</span>
                <input
                  type="text"
                  placeholder="540 x 480 x 210 mm"
                  value={newProject.specs?.dimensions || ''}
                  onChange={(e) =>
                    setNewProject({
                      ...newProject,
                      specs: { ...newProject.specs!, dimensions: e.target.value },
                    })
                  }
                  className="w-full px-2 py-1 rounded bg-[#FAF7F0] dark:bg-[#111910] border border-[#243324]/15 dark:border-white/15 text-[11px]"
                />
              </div>

              <div>
                <span className="text-[9px] text-[#657351] dark:text-[#A3B59E]">Top Speed</span>
                <input
                  type="text"
                  placeholder="24 km/h"
                  value={newProject.specs?.speed || ''}
                  onChange={(e) =>
                    setNewProject({
                      ...newProject,
                      specs: { ...newProject.specs!, speed: e.target.value },
                    })
                  }
                  className="w-full px-2 py-1 rounded bg-[#FAF7F0] dark:bg-[#111910] border border-[#243324]/15 dark:border-white/15 text-[11px]"
                />
              </div>
            </div>
          </div>

          {/* Description & Narrative */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div>
              <label className="block text-[10px] font-bold uppercase text-[#526340] dark:text-[#A3B59E] mb-1">
                Project Overview Description
              </label>
              <textarea
                rows={2}
                placeholder="Brief technical description for project showcase cards..."
                value={newProject.description || ''}
                onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                className="w-full px-2.5 py-1.5 rounded-lg bg-[#FAF7F0] dark:bg-[#111910] border border-[#243324]/15 dark:border-white/15 leading-relaxed text-xs"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase text-[#526340] dark:text-[#A3B59E] mb-1">
                Architecture Technical Summary
              </label>
              <textarea
                rows={2}
                placeholder="In-depth architecture details for the modal view..."
                value={newProject.architectureSummary || ''}
                onChange={(e) => setNewProject({ ...newProject, architectureSummary: e.target.value })}
                className="w-full px-2.5 py-1.5 rounded-lg bg-[#FAF7F0] dark:bg-[#111910] border border-[#243324]/15 dark:border-white/15 leading-relaxed text-xs"
              />
            </div>
          </div>

          {/* Key Features Chips */}
          <div>
            <label className="block text-[10px] font-bold uppercase text-[#526340] dark:text-[#A3B59E] mb-1">
              Key Engineering Features (Bullet Points)
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {newProject.keyFeatures?.map((feat, fIdx) => (
                <span
                  key={fIdx}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#243324]/10 dark:bg-white/10 text-[11px]"
                >
                  <span>{feat}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveFeatureFromNew(fIdx)}
                    className="text-rose-500 hover:text-rose-700 cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add another feature point..."
                value={newFeatureInput}
                onChange={(e) => setNewFeatureInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddFeatureToNew();
                  }
                }}
                className="flex-1 px-2.5 py-1.5 rounded-lg bg-[#FAF7F0] dark:bg-[#111910] border border-[#243324]/15 dark:border-white/15 text-xs"
              />
              <button
                type="button"
                onClick={handleAddFeatureToNew}
                className="px-3 py-1.5 rounded-lg bg-[#243324]/10 dark:bg-white/10 hover:bg-[#243324]/20 text-xs font-medium cursor-pointer"
              >
                Add Feature
              </button>
            </div>
          </div>

          {/* Submit Actions */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#243324]/10 dark:border-white/10">
            <button
              type="button"
              onClick={() => setIsAddingProject(false)}
              className="px-3 py-1.5 rounded-lg border border-[#243324]/20 dark:border-white/20 hover:bg-black/5 text-xs font-medium cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Deploy &amp; Save Project</span>
            </button>
          </div>
        </form>
      )}

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

      {/* Projects List with Inline Comprehensive Editing */}
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
                      src={project.imageUrl}
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
                    title={isExpanded ? 'Collapse editor' : 'Edit project specs'}
                  >
                    <Edit2 className="w-3 h-3 text-emerald-700 dark:text-emerald-400" />
                    <span className="hidden sm:inline text-[11px]">{isExpanded ? 'Done' : 'Edit Specs'}</span>
                    {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeleteConfirmId(project.id)}
                    className="p-1.5 rounded-lg border border-rose-500/30 text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 cursor-pointer"
                    title="Delete project"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Expanded Detailed Editor Form */}
              {isExpanded && (
                <div className="pt-3 border-t border-[#243324]/10 dark:border-white/10 space-y-3 text-xs animate-in fade-in duration-150">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold text-[#526340] dark:text-[#A3B59E] mb-0.5">
                        Project Name
                      </label>
                      <input
                        type="text"
                        value={project.name}
                        onChange={(e) => updateBotProject(project.id, { name: e.target.value })}
                        className="w-full px-2 py-1 rounded bg-[#FAF7F0] dark:bg-[#111910] border border-[#243324]/15 dark:border-white/15 font-semibold"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-[#526340] dark:text-[#A3B59E] mb-0.5">
                        Codename
                      </label>
                      <input
                        type="text"
                        value={project.codename}
                        onChange={(e) => updateBotProject(project.id, { codename: e.target.value })}
                        className="w-full px-2 py-1 rounded bg-[#FAF7F0] dark:bg-[#111910] border border-[#243324]/15 dark:border-white/15 font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-[#526340] dark:text-[#A3B59E] mb-0.5">
                        Status
                      </label>
                      <select
                        value={project.status || 'Operational Fleet'}
                        onChange={(e) => updateBotProject(project.id, { status: e.target.value })}
                        className="w-full px-2 py-1 rounded bg-[#FAF7F0] dark:bg-[#111910] border border-[#243324]/15 dark:border-white/15"
                      >
                        <option value="Operational Fleet">Operational Fleet</option>
                        <option value="Active R&D">Active R&D</option>
                        <option value="National Champion">National Champion</option>
                        <option value="Championship Veteran">Championship Veteran</option>
                        <option value="Prototype Testing">Prototype Testing</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-[#526340] dark:text-[#A3B59E] mb-0.5">
                        Category
                      </label>
                      <input
                        type="text"
                        value={project.category}
                        onChange={(e) => updateBotProject(project.id, { category: e.target.value })}
                        className="w-full px-2 py-1 rounded bg-[#FAF7F0] dark:bg-[#111910] border border-[#243324]/15 dark:border-white/15"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-[#526340] dark:text-[#A3B59E] mb-0.5">
                        Weight Class
                      </label>
                      <input
                        type="text"
                        value={project.weightClass}
                        onChange={(e) => updateBotProject(project.id, { weightClass: e.target.value })}
                        className="w-full px-2 py-1 rounded bg-[#FAF7F0] dark:bg-[#111910] border border-[#243324]/15 dark:border-white/15"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-[#526340] dark:text-[#A3B59E] mb-0.5">
                        Podiums Won
                      </label>
                      <input
                        type="number"
                        value={project.podiumsCount}
                        onChange={(e) => updateBotProject(project.id, { podiumsCount: Number(e.target.value) || 0 })}
                        className="w-full px-2 py-1 rounded bg-[#FAF7F0] dark:bg-[#111910] border border-[#243324]/15 dark:border-white/15 font-mono"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[10px] font-bold text-[#526340] dark:text-[#A3B59E] mb-0.5">
                        Tagline
                      </label>
                      <input
                        type="text"
                        value={project.tagline}
                        onChange={(e) => updateBotProject(project.id, { tagline: e.target.value })}
                        className="w-full px-2 py-1 rounded bg-[#FAF7F0] dark:bg-[#111910] border border-[#243324]/15 dark:border-white/15"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-[#526340] dark:text-[#A3B59E] mb-0.5">
                        Featured Award
                      </label>
                      <input
                        type="text"
                        value={project.featuredAward || ''}
                        onChange={(e) => updateBotProject(project.id, { featuredAward: e.target.value })}
                        className="w-full px-2 py-1 rounded bg-[#FAF7F0] dark:bg-[#111910] border border-[#243324]/15 dark:border-white/15"
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <label className="block text-[10px] font-bold text-[#526340] dark:text-[#A3B59E] mb-0.5">
                        Image URL
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="url"
                          value={project.imageUrl || ''}
                          onChange={(e) => updateBotProject(project.id, { imageUrl: e.target.value })}
                          className="flex-1 px-2 py-1 rounded bg-[#FAF7F0] dark:bg-[#111910] border border-[#243324]/15 dark:border-white/15 font-mono text-[11px]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Hardware Specs */}
                  <div className="p-2.5 rounded-lg bg-[#FAF7F0] dark:bg-[#111910] border border-[#243324]/10 dark:border-white/10 space-y-1.5">
                    <span className="block text-[10px] font-bold uppercase text-[#526340] dark:text-[#A3B59E]">
                      Technical Specifications
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                      <div>
                        <span className="text-[9px] text-[#657351] dark:text-[#A3B59E]">Chassis Material</span>
                        <input
                          type="text"
                          value={project.specs?.chassisMaterial || ''}
                          onChange={(e) =>
                            updateBotProject(project.id, {
                              specs: { ...project.specs, chassisMaterial: e.target.value },
                            })
                          }
                          className="w-full px-2 py-1 rounded bg-white dark:bg-[#1A2619] border border-[#243324]/15 dark:border-white/15 text-[11px]"
                        />
                      </div>

                      <div>
                        <span className="text-[9px] text-[#657351] dark:text-[#A3B59E]">Controller</span>
                        <input
                          type="text"
                          value={project.specs?.controller || ''}
                          onChange={(e) =>
                            updateBotProject(project.id, {
                              specs: { ...project.specs, controller: e.target.value },
                            })
                          }
                          className="w-full px-2 py-1 rounded bg-white dark:bg-[#1A2619] border border-[#243324]/15 dark:border-white/15 text-[11px]"
                        />
                      </div>

                      <div>
                        <span className="text-[9px] text-[#657351] dark:text-[#A3B59E]">Actuators/Weapon</span>
                        <input
                          type="text"
                          value={project.specs?.actuatorsOrWeapon || ''}
                          onChange={(e) =>
                            updateBotProject(project.id, {
                              specs: { ...project.specs, actuatorsOrWeapon: e.target.value },
                            })
                          }
                          className="w-full px-2 py-1 rounded bg-white dark:bg-[#1A2619] border border-[#243324]/15 dark:border-white/15 text-[11px]"
                        />
                      </div>

                      <div>
                        <span className="text-[9px] text-[#657351] dark:text-[#A3B59E]">Power</span>
                        <input
                          type="text"
                          value={project.specs?.power || ''}
                          onChange={(e) =>
                            updateBotProject(project.id, {
                              specs: { ...project.specs, power: e.target.value },
                            })
                          }
                          className="w-full px-2 py-1 rounded bg-white dark:bg-[#1A2619] border border-[#243324]/15 dark:border-white/15 text-[11px]"
                        />
                      </div>

                      <div>
                        <span className="text-[9px] text-[#657351] dark:text-[#A3B59E]">Weight</span>
                        <input
                          type="text"
                          value={project.specs?.weight || ''}
                          onChange={(e) =>
                            updateBotProject(project.id, {
                              specs: { ...project.specs, weight: e.target.value },
                            })
                          }
                          className="w-full px-2 py-1 rounded bg-white dark:bg-[#1A2619] border border-[#243324]/15 dark:border-white/15 text-[11px]"
                        />
                      </div>

                      <div>
                        <span className="text-[9px] text-[#657351] dark:text-[#A3B59E]">Speed</span>
                        <input
                          type="text"
                          value={project.specs?.speed || ''}
                          onChange={(e) =>
                            updateBotProject(project.id, {
                              specs: { ...project.specs, speed: e.target.value },
                            })
                          }
                          className="w-full px-2 py-1 rounded bg-white dark:bg-[#1A2619] border border-[#243324]/15 dark:border-white/15 text-[11px]"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <span className="text-[9px] text-[#657351] dark:text-[#A3B59E]">Dimensions</span>
                        <input
                          type="text"
                          value={project.specs?.dimensions || ''}
                          onChange={(e) =>
                            updateBotProject(project.id, {
                              specs: { ...project.specs, dimensions: e.target.value },
                            })
                          }
                          className="w-full px-2 py-1 rounded bg-white dark:bg-[#1A2619] border border-[#243324]/15 dark:border-white/15 text-[11px]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Narrative Descriptions */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <span className="block text-[9px] font-bold text-[#657351] dark:text-[#A3B59E] mb-0.5">
                        Overview Description
                      </span>
                      <textarea
                        rows={2}
                        value={project.description}
                        onChange={(e) => updateBotProject(project.id, { description: e.target.value })}
                        className="w-full px-2 py-1 rounded bg-[#FAF7F0] dark:bg-[#111910] border border-[#243324]/15 dark:border-white/15 text-xs"
                      />
                    </div>

                    <div>
                      <span className="block text-[9px] font-bold text-[#657351] dark:text-[#A3B59E] mb-0.5">
                        Architecture Technical Summary
                      </span>
                      <textarea
                        rows={2}
                        value={project.architectureSummary}
                        onChange={(e) => updateBotProject(project.id, { architectureSummary: e.target.value })}
                        className="w-full px-2 py-1 rounded bg-[#FAF7F0] dark:bg-[#111910] border border-[#243324]/15 dark:border-white/15 text-xs"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-1">
                    <button
                      type="button"
                      onClick={() => setExpandedProjectId(null)}
                      className="px-3 py-1 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold cursor-pointer"
                    >
                      Done Editing
                    </button>
                  </div>
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
