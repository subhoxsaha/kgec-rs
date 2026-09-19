import React, { useState } from 'react';
import {
  Upload,
  RefreshCw,
  Sparkles,
  Zap,
  Hammer,
  Code,
  Plus,
  Trash2,
  Edit2,
  Check,
} from 'lucide-react';
import { useReportData } from '../../context/ReportDataContext';
import { EventPhoto } from '../../types';
import { compressImageFile } from '../../utils/imageUtils';
import {
  DEFAULT_TECHFEST_PHOTOS,
  DEFAULT_OTHER_ACTIVITIES_PHOTOS,
  DEFAULT_HACKATHON_PHOTOS,
} from '../../data/eventsData';
import { DeleteConfirmModal } from './DeleteConfirmModal';

type PhotoSubTab = 'techfest' | 'hackathon' | 'activities';

export const PhotosMediaEditor: React.FC = () => {
  const {
    techfestPhotos,
    activityPhotos,
    hackathonPhotos,
    updateTechfestPhoto,
    addTechfestPhoto,
    deleteTechfestPhoto,
    updateActivityPhoto,
    addActivityPhoto,
    deleteActivityPhoto,
    updateHackathonPhoto,
    addHackathonPhoto,
    deleteHackathonPhoto,
    resetPhotosToDefaults,
    showToast,
  } = useReportData();

  const [activeSubTab, setActiveSubTab] = useState<PhotoSubTab>('techfest');
  const [deleteTargetPhoto, setDeleteTargetPhoto] = useState<{
    id: string;
    title: string;
    category: PhotoSubTab;
  } | null>(null);

  const [isAddingPhoto, setIsAddingPhoto] = useState(false);
  const [editingPhotoId, setEditingPhotoId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editCategory, setEditCategory] = useState('');

  const [newPhoto, setNewPhoto] = useState({
    title: '',
    category: 'Arena Showcases',
    imageUrl: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?auto=format&fit=crop&w=1200&q=80',
    description: '',
  });

  const techfest = techfestPhotos && techfestPhotos.length > 0 ? techfestPhotos : DEFAULT_TECHFEST_PHOTOS;
  const activities = activityPhotos && activityPhotos.length > 0 ? activityPhotos : DEFAULT_OTHER_ACTIVITIES_PHOTOS;
  const hackathons = hackathonPhotos && hackathonPhotos.length > 0 ? hackathonPhotos : DEFAULT_HACKATHON_PHOTOS;

  const currentPhotos =
    activeSubTab === 'techfest' ? techfest : activeSubTab === 'hackathon' ? hackathons : activities;

  const handleEventFileUpload = (
    file: File,
    id: string,
    updateFn: (id: string, updates: Partial<EventPhoto>) => void,
    name: string
  ) => {
    if (!file.type.startsWith('image/')) {
      showToast('Please upload a valid image file');
      return;
    }
    compressImageFile(file, 1280, 1280, 0.82)
      .then((dataUrl) => {
        if (dataUrl) {
          updateFn(id, { imageUrl: dataUrl });
          showToast(`Photo for "${name}" updated!`);
        }
      })
      .catch(() => {
        showToast('Failed to process image file');
      });
  };

  const handleCreatePhoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPhoto.title.trim() || !newPhoto.imageUrl.trim()) {
      showToast('Title and Image URL are required');
      return;
    }

    const createdPhoto: EventPhoto = {
      id: `photo-${Date.now().toString(36)}`,
      title: newPhoto.title.trim(),
      category: newPhoto.category || 'Event',
      imageUrl: newPhoto.imageUrl.trim(),
      description: newPhoto.description || 'Captured live during event.',
    };

    if (activeSubTab === 'techfest') {
      addTechfestPhoto(createdPhoto);
    } else if (activeSubTab === 'activities') {
      addActivityPhoto(createdPhoto);
    } else if (activeSubTab === 'hackathon') {
      addHackathonPhoto(createdPhoto);
    }

    setIsAddingPhoto(false);
    setNewPhoto({
      title: '',
      category: 'Arena Showcases',
      imageUrl: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?auto=format&fit=crop&w=1200&q=80',
      description: '',
    });
    showToast('Photo added to gallery!');
  };

  const handleDeleteConfirm = () => {
    if (!deleteTargetPhoto) return;
    if (deleteTargetPhoto.category === 'techfest') {
      deleteTechfestPhoto(deleteTargetPhoto.id);
    } else if (deleteTargetPhoto.category === 'activities') {
      deleteActivityPhoto(deleteTargetPhoto.id);
    } else if (deleteTargetPhoto.category === 'hackathon') {
      deleteHackathonPhoto(deleteTargetPhoto.id);
    }
    setDeleteTargetPhoto(null);
    showToast('Photo removed from archive');
  };

  const getUpdateFn = () => {
    if (activeSubTab === 'techfest') return updateTechfestPhoto;
    if (activeSubTab === 'hackathon') return updateHackathonPhoto;
    return updateActivityPhoto;
  };

  return (
    <div className="space-y-4 text-[#243324] dark:text-[#F4EFE6]">
      {/* Universal Delete Confirmation Dialog */}
      <DeleteConfirmModal
        isOpen={!!deleteTargetPhoto}
        title="Delete Media Asset?"
        itemName={deleteTargetPhoto?.title || ''}
        itemType="gallery photo"
        warningText="Are you sure you want to permanently delete this event photo from the gallery archive? This cannot be undone unless reset to defaults."
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTargetPhoto(null)}
      />

      {/* Informative Header */}
      <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs flex items-start justify-between gap-2">
        <div className="flex items-start gap-2.5">
          <Sparkles className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold text-emerald-900 dark:text-emerald-200">
              Event Galleries &amp; Media Archives
            </p>
            <p className="text-[#3F543C] dark:text-[#CBD7C7] text-[11px] leading-relaxed">
              Manage live photography captures for TECHTIX Techfest arenas, ZYRO Hackathons, and outreach workshops.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setIsAddingPhoto(!isAddingPhoto)}
            className="px-2.5 py-1 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white font-medium text-[11px] flex items-center gap-1 cursor-pointer shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{isAddingPhoto ? 'Cancel' : 'Add Photo'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              resetPhotosToDefaults();
              showToast('Restored default gallery photos');
            }}
            className="text-[10px] px-2 py-1 rounded border border-[#243324]/15 dark:border-white/15 hover:bg-black/5 dark:hover:bg-white/5 flex items-center gap-1 cursor-pointer"
            title="Reset gallery photos to default"
          >
            <RefreshCw className="w-2.5 h-2.5" />
            <span className="hidden sm:inline">Reset Defaults</span>
          </button>
        </div>
      </div>

      {/* Sub-tabs Bar */}
      <div className="flex items-center gap-1 p-1 bg-[#E8E4DA] dark:bg-[#121B11] rounded-xl border border-[#243324]/10 dark:border-white/10 text-xs overflow-x-auto">
        <button
          type="button"
          onClick={() => {
            setActiveSubTab('techfest');
            setIsAddingPhoto(false);
          }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
            activeSubTab === 'techfest'
              ? 'bg-white dark:bg-[#1E2C1D] text-emerald-800 dark:text-emerald-300 shadow-2xs'
              : 'text-[#657351] dark:text-[#A3B59E] hover:text-[#1F2B1D]'
          }`}
        >
          <Zap className="w-3.5 h-3.5 text-amber-500" />
          <span>TECHTIX Techfest ({techfest.length})</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveSubTab('hackathon');
            setIsAddingPhoto(false);
          }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
            activeSubTab === 'hackathon'
              ? 'bg-white dark:bg-[#1E2C1D] text-emerald-800 dark:text-emerald-300 shadow-2xs'
              : 'text-[#657351] dark:text-[#A3B59E] hover:text-[#1F2B1D]'
          }`}
        >
          <Code className="w-3.5 h-3.5 text-purple-500" />
          <span>ZYRO Hackathon ({hackathons.length})</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveSubTab('activities');
            setIsAddingPhoto(false);
          }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
            activeSubTab === 'activities'
              ? 'bg-white dark:bg-[#1E2C1D] text-emerald-800 dark:text-emerald-300 shadow-2xs'
              : 'text-[#657351] dark:text-[#A3B59E] hover:text-[#1F2B1D]'
          }`}
        >
          <Hammer className="w-3.5 h-3.5 text-cyan-500" />
          <span>Workshops &amp; Labs ({activities.length})</span>
        </button>
      </div>

      {/* Add New Photo Form Drawer */}
      {isAddingPhoto && (
        <form
          onSubmit={handleCreatePhoto}
          className="p-4 rounded-xl bg-white dark:bg-[#1A2619] border border-emerald-500/30 shadow-md space-y-3"
        >
          <div className="flex items-center justify-between pb-2 border-b border-[#243324]/10 dark:border-white/10">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
              <Plus className="w-3.5 h-3.5" />
              <span>Add New {activeSubTab.toUpperCase()} Photo</span>
            </h4>
            <button
              type="button"
              onClick={() => setIsAddingPhoto(false)}
              className="text-xs text-neutral-400 hover:text-neutral-600 dark:hover:text-white"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-[11px] font-semibold text-[#526340] dark:text-[#A3B59E] mb-1">
                Photo Caption / Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g., Heavyweight Finals in Polycarbonate Cage"
                value={newPhoto.title}
                onChange={(e) => setNewPhoto({ ...newPhoto, title: e.target.value })}
                className="w-full px-2.5 py-1.5 rounded-lg bg-[#FAF7F0] dark:bg-[#111910] border border-[#243324]/15 dark:border-white/15"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#526340] dark:text-[#A3B59E] mb-1">
                Category / Event Arena
              </label>
              <input
                type="text"
                placeholder="e.g., RoboWars 30kg Arena"
                value={newPhoto.category}
                onChange={(e) => setNewPhoto({ ...newPhoto, category: e.target.value })}
                className="w-full px-2.5 py-1.5 rounded-lg bg-[#FAF7F0] dark:bg-[#111910] border border-[#243324]/15 dark:border-white/15"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[11px] font-semibold text-[#526340] dark:text-[#A3B59E] mb-1">
                Image URL *
              </label>
              <input
                type="url"
                required
                placeholder="https://..."
                value={newPhoto.imageUrl}
                onChange={(e) => setNewPhoto({ ...newPhoto, imageUrl: e.target.value })}
                className="w-full px-2.5 py-1.5 rounded-lg bg-[#FAF7F0] dark:bg-[#111910] border border-[#243324]/15 dark:border-white/15 font-mono text-xs"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[11px] font-semibold text-[#526340] dark:text-[#A3B59E] mb-1">
                Short Description
              </label>
              <input
                type="text"
                placeholder="Brief context of the photo..."
                value={newPhoto.description}
                onChange={(e) => setNewPhoto({ ...newPhoto, description: e.target.value })}
                className="w-full px-2.5 py-1.5 rounded-lg bg-[#FAF7F0] dark:bg-[#111910] border border-[#243324]/15 dark:border-white/15"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAddingPhoto(false)}
              className="px-3 py-1.5 rounded-lg border border-[#243324]/15 dark:border-white/15 text-xs font-medium cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white font-medium text-xs cursor-pointer shadow-xs"
            >
              Save Photo to Archive
            </button>
          </div>
        </form>
      )}

      {/* Grid of Photo Items */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {currentPhotos.map((item) => {
          const isEditing = editingPhotoId === item.id;
          const updateFn = getUpdateFn();

          return (
            <div
              key={item.id}
              className="p-3 rounded-xl bg-white dark:bg-[#1A2619] border border-[#243324]/10 dark:border-white/10 shadow-2xs space-y-2 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="relative aspect-16/10 rounded-lg overflow-hidden bg-black/40 border border-black/10">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover object-center"
                  />
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-xs text-[10px] font-mono text-white">
                    {item.category}
                  </span>
                </div>

                {isEditing ? (
                  <div className="space-y-2 text-xs">
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      placeholder="Title"
                      className="w-full px-2 py-1 rounded bg-[#FAF7F0] dark:bg-[#111910] border border-[#243324]/15 dark:border-white/15 text-xs"
                    />
                    <input
                      type="text"
                      value={editCategory}
                      onChange={(e) => setEditCategory(e.target.value)}
                      placeholder="Category"
                      className="w-full px-2 py-1 rounded bg-[#FAF7F0] dark:bg-[#111910] border border-[#243324]/15 dark:border-white/15 text-xs"
                    />
                    <div className="flex justify-end gap-1.5 pt-1">
                      <button
                        type="button"
                        onClick={() => setEditingPhotoId(null)}
                        className="px-2 py-1 rounded border border-[#243324]/15 text-[11px]"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          updateFn(item.id, { title: editTitle, category: editCategory });
                          setEditingPhotoId(null);
                          showToast('Photo caption updated!');
                        }}
                        className="px-2.5 py-1 rounded bg-emerald-700 text-white text-[11px] font-medium flex items-center gap-1"
                      >
                        <Check className="w-3 h-3" />
                        <span>Save</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <h5 className="font-semibold text-xs text-[#1F2B1D] dark:text-white line-clamp-1">
                      {item.title}
                    </h5>
                    <p className="text-[11px] text-[#657351] dark:text-[#A3B59E] line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                )}
              </div>

              {/* Action Bar */}
              <div className="flex items-center justify-between pt-2 border-t border-[#243324]/10 dark:border-white/10 text-xs">
                <div className="flex items-center gap-1.5">
                  <label className="p-1 rounded hover:bg-black/5 dark:hover:bg-white/5 text-[#4A5D44] dark:text-[#A3B59E] cursor-pointer" title="Upload new photo file">
                    <Upload className="w-3.5 h-3.5" />
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          handleEventFileUpload(e.target.files[0], item.id, updateFn, item.title);
                        }
                      }}
                    />
                  </label>

                  <button
                    type="button"
                    onClick={() => {
                      setEditingPhotoId(item.id);
                      setEditTitle(item.title);
                      setEditCategory(item.category);
                    }}
                    className="p-1 rounded hover:bg-black/5 dark:hover:bg-white/5 text-[#4A5D44] dark:text-[#A3B59E] cursor-pointer"
                    title="Edit caption"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setDeleteTargetPhoto({
                      id: item.id,
                      title: item.title,
                      category: activeSubTab,
                    })
                  }
                  className="p-1 rounded hover:bg-rose-500/10 text-rose-600 dark:text-rose-400 cursor-pointer"
                  title="Delete photo"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
