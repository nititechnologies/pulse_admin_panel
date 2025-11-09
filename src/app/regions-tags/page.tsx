'use client';

import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Tag, Globe, Plus, X, Edit2, Trash2, Save, Check, ChevronUp, ChevronDown } from 'lucide-react';
import { 
  getTags, 
  addTag, 
  updateTag, 
  deleteTag,
  getRegions,
  addRegion,
  updateRegion,
  deleteRegion,
  type Tag as TagType,
  type Region as RegionType
} from '@/lib/tagsAndRegions';

export default function RegionsTagsPage() {
  const [tags, setTags] = useState<TagType[]>([]);
  const [regions, setRegions] = useState<RegionType[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'tags' | 'regions'>('tags');
  
  // Tag management
  const [newTagName, setNewTagName] = useState('');
  const [editingTagId, setEditingTagId] = useState<string | null>(null);
  const [editingTagName, setEditingTagName] = useState('');
  const [isAddingTag, setIsAddingTag] = useState(false);
  
  // Region management
  const [newRegionName, setNewRegionName] = useState('');
  const [editingRegionId, setEditingRegionId] = useState<string | null>(null);
  const [editingRegionName, setEditingRegionName] = useState('');
  const [isAddingRegion, setIsAddingRegion] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [tagsData, regionsData] = await Promise.all([
        getTags(),
        getRegions()
      ]);
      setTags(tagsData);
      setRegions(regionsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Tag handlers
  const handleAddTag = async () => {
    if (!newTagName.trim()) return;
    
    setIsAddingTag(true);
    try {
      await addTag(newTagName);
      setNewTagName('');
      await loadData();
    } catch (error) {
      console.error('Error adding tag:', error);
    } finally {
      setIsAddingTag(false);
    }
  };

  const handleEditTag = (tag: TagType) => {
    setEditingTagId(tag.id!);
    setEditingTagName(tag.name);
  };

  const handleSaveTag = async (id: string) => {
    if (!editingTagName.trim()) return;
    
    try {
      await updateTag(id, editingTagName);
      setEditingTagId(null);
      setEditingTagName('');
      await loadData();
    } catch (error) {
      console.error('Error updating tag:', error);
    }
  };

  const handleDeleteTag = async (id: string) => {
    if (!confirm('Are you sure you want to delete this tag?')) return;
    
    try {
      await deleteTag(id);
      await loadData();
    } catch (error) {
      console.error('Error deleting tag:', error);
    }
  };

  // Region handlers
  const handleAddRegion = async () => {
    if (!newRegionName.trim()) return;
    
    setIsAddingRegion(true);
    try {
      // New regions are added at the end (priority = regions.length, so first is 0, second is 1, etc.)
      const newPriority = regions.length;
      await addRegion(newRegionName, newPriority);
      setNewRegionName('');
      await loadData();
    } catch (error) {
      console.error('Error adding region:', error);
    } finally {
      setIsAddingRegion(false);
    }
  };

  const handleEditRegion = (region: RegionType) => {
    setEditingRegionId(region.id!);
    setEditingRegionName(region.name);
  };

  const handleSaveRegion = async (id: string) => {
    if (!editingRegionName.trim()) return;
    
    try {
      // Keep the same priority when just editing the name
      const region = regions.find(r => r.id === id);
      const currentPriority = region?.priority ?? regions.length;
      await updateRegion(id, editingRegionName, currentPriority);
      setEditingRegionId(null);
      setEditingRegionName('');
      await loadData();
    } catch (error) {
      console.error('Error updating region:', error);
    }
  };

  const handleMoveRegion = async (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return; // Already at top
    if (direction === 'down' && index === regions.length - 1) return; // Already at bottom

    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    const region = regions[index];
    const swapRegion = regions[swapIndex];

    // Calculate new priorities based on position
    // Priority = index (so index 0 = priority 0, index 1 = priority 1, etc.)
    const newPriorityForRegion = swapIndex; // Region moves to swapIndex position
    const newPriorityForSwap = index; // SwapRegion moves to index position

    // Optimistically update local state for instant visual feedback
    const newRegions = [...regions];
    newRegions[index] = { ...region, priority: newPriorityForRegion };
    newRegions[swapIndex] = { ...swapRegion, priority: newPriorityForSwap };
    // Re-sort the array by priority (ascending)
    newRegions.sort((a, b) => {
      const priorityA = a.priority ?? 0;
      const priorityB = b.priority ?? 0;
      if (priorityA !== priorityB) {
        return priorityA - priorityB; // Lower priority first (0, 1, 2, ...)
      }
      return (a.name || '').localeCompare(b.name || '');
    });
    setRegions(newRegions);

    try {
      // Update both regions with new priorities in the database
      await Promise.all([
        updateRegion(region.id!, region.name, newPriorityForRegion),
        updateRegion(swapRegion.id!, swapRegion.name, newPriorityForSwap)
      ]);
      // Reload to ensure consistency
      await loadData();
    } catch (error) {
      console.error('Error moving region:', error);
      // Revert on error
      await loadData();
    }
  };

  const handleDeleteRegion = async (id: string) => {
    if (!confirm('Are you sure you want to delete this region?')) return;
    
    try {
      await deleteRegion(id);
      await loadData();
    } catch (error) {
      console.error('Error deleting region:', error);
    }
  };

  if (loading) {
    return (
      <Layout title="Regions & Tags">
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Regions & Tags">
      <div className="max-w-7xl mx-auto pb-8 px-4 sm:px-6 overflow-x-hidden">
        {/* Header */}
        <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 rounded-xl p-4 sm:p-5 shadow-lg text-white relative overflow-hidden mb-6">
          <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px] opacity-40"></div>
          <div className="relative z-10">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/20 backdrop-blur-md rounded-lg shadow-md border border-white/30">
                <Tag className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-white">Manage Regions & Tags</h1>
                <p className="text-blue-100 text-xs hidden sm:block">Manage news categories and regions</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 mb-6">
          <div className="flex border-b border-slate-200">
            <button
              onClick={() => setActiveTab('tags')}
              className={`flex-1 px-6 py-4 text-sm font-semibold transition-all duration-200 flex items-center justify-center ${
                activeTab === 'tags'
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'
              }`}
            >
              <Tag className="w-4 h-4 mr-2" />
              Tags / Categories
              <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                {tags.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('regions')}
              className={`flex-1 px-6 py-4 text-sm font-semibold transition-all duration-200 flex items-center justify-center ${
                activeTab === 'regions'
                  ? 'text-green-600 border-b-2 border-green-600 bg-green-50'
                  : 'text-slate-600 hover:text-green-600 hover:bg-slate-50'
              }`}
            >
              <Globe className="w-4 h-4 mr-2" />
              Regions
              <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                {regions.length}
              </span>
            </button>
          </div>

          {/* Tags Tab */}
          {activeTab === 'tags' && (
            <div className="p-4 sm:p-6 lg:p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Tag className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-800">News Categories / Tags</h2>
                  <p className="text-xs text-slate-500">Manage tags used for categorizing news articles</p>
                </div>
              </div>

              {/* Add Tag */}
              <div className="mb-6">
                <input
                  type="text"
                  value={newTagName}
                  onChange={(e) => setNewTagName(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && newTagName.trim()) {
                      handleAddTag();
                    }
                  }}
                  placeholder="Type tag name and press Enter..."
                  className="w-full px-4 py-2.5 border-2 border-dashed border-slate-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all duration-200 text-sm text-slate-800 bg-white hover:border-blue-400"
                />
              </div>

              {/* Tags List */}
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <div
                    key={tag.id}
                    className="px-4 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2"
                  >
                    {editingTagId === tag.id ? (
                      <>
                        <input
                          type="text"
                          value={editingTagName}
                          onChange={(e) => setEditingTagName(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              handleSaveTag(tag.id!);
                            } else if (e.key === 'Escape') {
                              setEditingTagId(null);
                              setEditingTagName('');
                            }
                          }}
                          className="px-2 py-1 text-sm text-slate-800 rounded-full bg-white border border-slate-300 focus:ring-2 focus:ring-blue-300 focus:outline-none focus:border-blue-300 min-w-[100px]"
                          autoFocus
                        />
                        <button
                          onClick={() => handleSaveTag(tag.id!)}
                          className="p-1 hover:bg-white/20 rounded-full transition-colors"
                          title="Save"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setEditingTagId(null);
                            setEditingTagName('');
                          }}
                          className="p-1 hover:bg-white/20 rounded-full transition-colors"
                          title="Cancel"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <>
                        <span className="text-sm font-medium">{tag.name}</span>
                        <button
                          onClick={() => handleEditTag(tag)}
                          className="p-1 hover:bg-white/20 rounded-full transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteTag(tag.id!)}
                          className="p-1 hover:bg-white/20 rounded-full transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </>
                    )}
                  </div>
                ))}
                {tags.length === 0 && (
                  <p className="text-sm text-slate-500 italic">No tags yet. Type a tag name above and press Enter to add!</p>
                )}
              </div>
            </div>
          )}

          {/* Regions Tab */}
          {activeTab === 'regions' && (
            <div className="p-4 sm:p-6 lg:p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Globe className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-800">Regions</h2>
                  <p className="text-xs text-slate-500">Manage regions where news articles can be shown</p>
                </div>
              </div>

              {/* Add Region */}
              <div className="mb-6">
                <input
                  type="text"
                  value={newRegionName}
                  onChange={(e) => setNewRegionName(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && newRegionName.trim()) {
                      handleAddRegion();
                    }
                  }}
                  placeholder="Type region name and press Enter..."
                  className="w-full px-4 py-2.5 border-2 border-dashed border-slate-300 rounded-full focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:outline-none transition-all duration-200 text-sm text-slate-800 bg-white hover:border-green-400"
                />
              </div>

              {/* Regions List */}
              <div className="flex flex-wrap gap-2">
                {regions.map((region, index) => (
                  <div
                    key={region.id}
                    className="px-4 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2"
                  >
                    {editingRegionId === region.id ? (
                      <>
                        <input
                          type="text"
                          value={editingRegionName}
                          onChange={(e) => setEditingRegionName(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              handleSaveRegion(region.id!);
                            } else if (e.key === 'Escape') {
                              setEditingRegionId(null);
                              setEditingRegionName('');
                            }
                          }}
                          className="px-2 py-1 text-sm text-slate-800 rounded-full bg-white border border-slate-300 focus:ring-2 focus:ring-green-300 focus:outline-none focus:border-green-300 min-w-[100px]"
                          autoFocus
                        />
                        <button
                          onClick={() => handleSaveRegion(region.id!)}
                          className="p-1 hover:bg-white/20 rounded-full transition-colors"
                          title="Save"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setEditingRegionId(null);
                            setEditingRegionName('');
                          }}
                          className="p-1 hover:bg-white/20 rounded-full transition-colors"
                          title="Cancel"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <>
                        <div className="flex flex-col gap-0.5">
                          <button
                            onClick={() => handleMoveRegion(index, 'up')}
                            disabled={index === 0}
                            className={`p-0.5 rounded transition-colors ${
                              index === 0 
                                ? 'opacity-30 cursor-not-allowed' 
                                : 'hover:bg-white/20'
                            }`}
                            title="Move up"
                          >
                            <ChevronUp className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => handleMoveRegion(index, 'down')}
                            disabled={index === regions.length - 1}
                            className={`p-0.5 rounded transition-colors ${
                              index === regions.length - 1 
                                ? 'opacity-30 cursor-not-allowed' 
                                : 'hover:bg-white/20'
                            }`}
                            title="Move down"
                          >
                            <ChevronDown className="w-3 h-3" />
                          </button>
                        </div>
                        <span className="text-sm font-medium">{region.name}</span>
                        <button
                          onClick={() => handleEditRegion(region)}
                          className="p-1 hover:bg-white/20 rounded-full transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteRegion(region.id!)}
                          className="p-1 hover:bg-white/20 rounded-full transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </>
                    )}
                  </div>
                ))}
                {regions.length === 0 && (
                  <p className="text-sm text-slate-500 italic">No regions yet. Type a region name above and press Enter to add!</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

