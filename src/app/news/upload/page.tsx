'use client';

import { useState } from 'react';
import Layout from '@/components/Layout';
import RichTextEditor from '@/components/RichTextEditor';
import { addArticle } from '@/lib/articles';
import { Upload, Image, Save, Plus, X, Globe, Tag, Check, FileText, Calendar } from 'lucide-react';

export default function UploadNewsPage() {
  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    content: '',
    imageUrl: '',
    tags: [] as string[],
    regions: [] as string[],
    publishedAt: new Date().toISOString(),
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showSuccess, setShowSuccess] = useState(false);

  const regionOptions = [
    'Eastern India',
    'North India',
    'Nagaland',
    'India',
    'International'
  ];

  const suggestedTags = [
    'Technical', 'Political', 'Education', 'Health', 'Sports', 'Entertainment',
    'Business', 'Science', 'Environment', 'Technology', 'Economy', 'Social',
    'International', 'Local', 'Breaking', 'Analysis', 'Opinion', 'Investigative'
  ];


  // Helper function to count words
  const countWords = (text: string): number => {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    let finalValue = value;
    
    // For title, limit to 20 words - truncate if exceeds
    if (name === 'title') {
      const words = value.trim().split(/\s+/).filter(word => word.length > 0);
      if (words.length > 20) {
        finalValue = words.slice(0, 20).join(' ');
      }
    }
    
    // For summary, limit to 50 words - truncate if exceeds
    if (name === 'summary') {
      const words = value.trim().split(/\s+/).filter(word => word.length > 0);
      if (words.length > 50) {
        finalValue = words.slice(0, 50).join(' ');
      }
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: finalValue
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const addSuggestedTag = (tag: string) => {
    if (!formData.tags.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
    }
  };

  const addRegion = (region: string) => {
    if (!formData.regions.includes(region)) {
    setFormData(prev => ({
      ...prev,
        regions: [...prev.regions, region]
    }));
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const removeRegion = (regionToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      regions: prev.regions.filter(region => region !== regionToRemove)
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    const titleWordCount = countWords(formData.title);
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (titleWordCount > 20) {
      newErrors.title = 'Title must be maximum 20 words';
    } else if (titleWordCount < 3) {
      newErrors.title = 'Title must be at least 3 words';
    }
    
    const summaryWordCount = countWords(formData.summary);
    if (!formData.summary.trim()) {
      newErrors.summary = 'Summary is required';
    } else if (summaryWordCount > 50) {
      newErrors.summary = 'Summary must be maximum 50 words';
    } else if (summaryWordCount < 10) {
      newErrors.summary = 'Summary must be at least 10 words';
    }
    
    if (!formData.content.trim()) {
      newErrors.content = 'Content is required';
    }
    
    if (formData.regions.length === 0) {
      newErrors.regions = 'Please select at least one region';
    }
    
    if (!formData.imageUrl.trim()) {
      newErrors.imageUrl = 'Image URL is required';
    } else {
      try {
        new URL(formData.imageUrl);
      } catch {
        newErrors.imageUrl = 'Please enter a valid URL';
      }
    }
    
    if (formData.tags.length === 0) {
      newErrors.tags = 'Please add at least one category';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    setShowSuccess(false);
    
    try {
      
      const articleData = {
        title: formData.title.trim(),
        summary: formData.summary.trim(),
        content: formData.content.trim(),
        journalistName: '', // Default empty since removed from form
        category: formData.tags.length > 0 ? formData.tags[0] : 'General',
        region: formData.regions.length > 0 ? formData.regions[0] : 'General',
        source: '', // Default empty since removed from form
        imageUrl: formData.imageUrl.trim(),
        readTime: 5, // Default value since removed from form
        tags: formData.tags,
        publishedAt: new Date(formData.publishedAt).toISOString(),
      };
      
      console.log('Saving article to Firebase:', articleData);
      
      // Save to Firebase
      const articleId = await addArticle(articleData);
      
      console.log('Article saved with ID:', articleId);
      console.log('Article data that was saved:', {
        ...articleData,
        id: articleId,
        createdAt: new Date().toISOString(),
        status: 'published',
        views: 0,
        likes: 0
      });
      
      // Reset form
      setFormData({
        title: '',
        summary: '',
        content: '',
        imageUrl: '',
        tags: [],
        regions: [],
        publishedAt: new Date().toISOString(),
      });
      
      setErrors({});
      setShowSuccess(true);
      
      // Scroll to top to show success message
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      // Hide success message after 5 seconds
      setTimeout(() => setShowSuccess(false), 5000);
    } catch (error) {
      console.error('Error creating article:', error);
      setErrors({ submit: 'Error creating article. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout title="Create Article">
      <div className="max-w-7xl mx-auto pb-8 px-4 sm:px-6 overflow-x-hidden">
        {/* Form and Preview Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-0">
          {/* Form Section */}
          <div className="xl:col-span-2 space-y-4 lg:space-y-6 xl:pr-6">
            <div className="space-y-4 lg:space-y-6">
            {/* Success Message */}
            {showSuccess && (
              <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg shadow-md">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Check className="h-5 w-5 text-green-500" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-green-800">
                      Article published successfully! You can view it in the Firebase database.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Error Message */}
            {errors.submit && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg shadow-md">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <X className="h-5 w-5 text-red-500" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-red-800">{errors.submit}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Header */}
            <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 rounded-xl p-4 sm:p-5 shadow-lg text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px] opacity-40"></div>
              <div className="relative z-10">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <div className="p-1.5 sm:p-2 bg-white/20 backdrop-blur-md rounded-lg shadow-md border border-white/30">
                      <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div>
                      <h1 className="text-xl sm:text-2xl font-bold text-white">Create New Article</h1>
                      <p className="text-blue-100 text-xs hidden sm:block">Craft and publish professional news content</p>
              </div>
            </div>
                  <div className="flex flex-wrap gap-2">
              <button 
                type="submit"
                form="article-form"
                disabled={isSubmitting}
                      className="w-full sm:w-auto px-4 sm:px-5 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg flex items-center justify-center text-sm"
              >
                {isSubmitting ? (
                  <>
                          <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin inline mr-2"></div>
                    Publishing...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 inline mr-2" />
                    Publish Article
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
            </div>
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden overflow-x-hidden">
          <form id="article-form" onSubmit={handleSubmit} className="space-y-0 overflow-x-hidden">
            {/* Section 1: Basic Information */}
            <div className="p-4 sm:p-6 lg:p-8 border-b border-slate-200 bg-gradient-to-br from-slate-50 to-white">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-800">Basic Information</h2>
                  <p className="text-xs text-slate-500">Start with the essential details</p>
          </div>
        </div>

              <div className="space-y-4 sm:space-y-6">
            {/* Title */}
            <div className="space-y-2">
                  <label htmlFor="title" className="block text-sm font-semibold text-slate-800 flex items-center justify-between">
                    <span>Article Title *</span>
                    <span className="text-xs font-normal text-slate-400">{countWords(formData.title)} / 20 words</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                    className={`w-full px-3 sm:px-4 py-2.5 sm:py-3.5 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm sm:text-base text-slate-800 bg-white overflow-x-hidden ${
                      errors.title ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-slate-200'
                    }`}
                    placeholder="Enter a compelling article title (max 20 words)..."
                    style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}
                  />
                  {errors.title && (
                    <p className="text-sm text-red-600 flex items-center mt-1">
                      <X className="w-3 h-3 mr-1" />
                      {errors.title}
                    </p>
                  )}
            </div>

            {/* Summary */}
            <div className="space-y-2">
                  <label htmlFor="summary" className="block text-sm font-semibold text-slate-800 flex items-center justify-between">
                    <span>Article Summary *</span>
                    <span className="text-xs font-normal text-slate-400">{countWords(formData.summary)} / 50 words</span>
              </label>
              <textarea
                id="summary"
                name="summary"
                value={formData.summary}
                onChange={handleInputChange}
                rows={4}
                    className={`w-full px-3 sm:px-4 py-2.5 sm:py-3.5 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none text-sm sm:text-base text-slate-800 bg-white overflow-x-hidden ${
                      errors.summary ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-slate-200'
                    }`}
                    placeholder="Write a compelling summary (max 50 words)..."
                    style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}
                  />
                  {errors.summary && (
                    <p className="text-sm text-red-600 flex items-center mt-1">
                      <X className="w-3 h-3 mr-1" />
                      {errors.summary}
                    </p>
                  )}
            </div>

            {/* Image URL */}
            <div className="space-y-2">
                  <label htmlFor="imageUrl" className="block text-sm font-semibold text-slate-800 flex items-center">
                    <Image className="w-4 h-4 mr-2 text-blue-600" />
                Featured Image URL *
              </label>
              <input
                type="url"
                id="imageUrl"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleInputChange}
                    className={`w-full px-3 sm:px-4 py-2.5 sm:py-3.5 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm sm:text-base text-slate-800 bg-white overflow-x-hidden ${
                      errors.imageUrl ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-slate-200'
                    }`}
                    placeholder="https://images.unsplash.com/photo-..."
                    style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}
                  />
                  {errors.imageUrl && (
                    <p className="text-sm text-red-600 flex items-center mt-1">
                      <X className="w-3 h-3 mr-1" />
                      {errors.imageUrl}
                    </p>
                  )}
                  {formData.imageUrl && !errors.imageUrl && (
                    <div className="mt-3">
                        <img
                          src={formData.imageUrl}
                        alt="Preview"
                        className="max-w-full h-48 object-cover rounded-xl border border-slate-200"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      </div>
                  )}
                    </div>
                      </div>
                    </div>
                    
            {/* Section 2: Article Content */}
            <div className="p-4 sm:p-6 lg:p-8 border-b border-slate-200">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-800">Article Content</h2>
                  <p className="text-xs text-slate-500">Write your full article content</p>
                        </div>
                      </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-800">
                  Content *
                </label>
                <div className={`overflow-x-hidden ${errors.content ? 'ring-2 ring-red-500 rounded-xl' : ''}`} style={{ maxWidth: '100%' }}>
                  <RichTextEditor
                    value={formData.content}
                    onChange={(content) => {
                      setFormData(prev => ({ ...prev, content }));
                      if (errors.content) {
                        setErrors(prev => {
                          const newErrors = { ...prev };
                          delete newErrors.content;
                          return newErrors;
                        });
                      }
                    }}
                    placeholder="Write your article content here... Use the toolbar above to format your text."
                        />
                      </div>
                {errors.content && (
                  <p className="text-sm text-red-600 flex items-center mt-2">
                    <X className="w-3 h-3 mr-1" />
                    {errors.content}
                  </p>
                    )}
                  </div>
            </div>

            {/* Section 3: Categories & Regions */}
            <div className="p-4 sm:p-6 lg:p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Tag className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-800">Categories & Regions</h2>
                  <p className="text-xs text-slate-500">Categorize your article and select where to show it</p>
                </div>
              </div>
              
              <div className="space-y-4 sm:space-y-6">
                {/* Categories Section */}
                <div className="space-y-3 sm:space-y-4">
                <div>
                    <h4 className="text-base font-semibold text-slate-700 mb-3 flex items-center">
                      <Tag className="w-4 h-4 mr-2 text-blue-600" />
                      Categories
                      {formData.tags.length > 0 && (
                        <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                          {formData.tags.length}
                        </span>
                      )}
                    </h4>
                  <div className="flex flex-wrap gap-2">
                      {suggestedTags.map((tag) => {
                        const isSelected = formData.tags.includes(tag);
                        return (
                      <button
                        key={tag}
                        type="button"
                            onClick={() => isSelected ? removeTag(tag) : addSuggestedTag(tag)}
                            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 border ${
                              isSelected
                                ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-blue-600 shadow-md hover:shadow-lg'
                                : 'bg-white text-slate-700 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 border-slate-200 shadow-sm hover:shadow'
                            }`}
                          >
                            <span className="flex items-center">
                              {isSelected ? (
                                <>
                                  <Check className="w-3 h-3 mr-1.5" />
                                  {tag}
                                </>
                              ) : (
                                <>
                                  <Plus className="w-3 h-3 mr-1.5" />
                                  {tag}
                                </>
                              )}
                            </span>
                      </button>
                        );
                      })}
                    </div>
                    {formData.tags.length === 0 && (
                      <p className="text-xs text-slate-500 italic mt-2">Click to select categories</p>
                    )}
                  </div>
                  
                  {errors.tags && (
                    <p className="text-sm text-red-600 flex items-center mt-2">
                      <X className="w-3 h-3 mr-1" />
                      {errors.tags}
                    </p>
                  )}
                </div>
                
                {/* Regions Section */}
                <div className="space-y-3 sm:space-y-4 pt-4 border-t border-slate-200">
                  <div>
                    <h4 className="text-base font-semibold text-slate-700 mb-3 flex items-center">
                      <Globe className="w-4 h-4 mr-2 text-green-600" />
                      Regions *
                      {formData.regions.length > 0 && (
                        <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                          {formData.regions.length}
                        </span>
                      )}
                      <span className="ml-2 text-xs font-normal text-slate-500">(Where to show)</span>
                    </h4>
                  <div className="flex flex-wrap gap-2">
                      {regionOptions.map((region) => {
                        const isSelected = formData.regions.includes(region);
                        return (
                        <button
                            key={region}
                          type="button"
                            onClick={() => isSelected ? removeRegion(region) : addRegion(region)}
                            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 border ${
                              isSelected
                                ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white border-green-600 shadow-md hover:shadow-lg'
                                : 'bg-white text-slate-700 hover:bg-green-50 hover:text-green-700 hover:border-green-300 border-slate-200 shadow-sm hover:shadow'
                            }`}
                          >
                            <span className="flex items-center">
                              {isSelected ? (
                                <>
                                  <Check className="w-3 h-3 mr-1.5" />
                                  {region}
                                </>
                              ) : (
                                <>
                                  <Plus className="w-3 h-3 mr-1.5" />
                                  {region}
                                </>
                              )}
                            </span>
                        </button>
                        );
                      })}
                    </div>
                    {formData.regions.length === 0 && (
                      <p className="text-xs text-slate-500 italic mt-2">Click to select regions</p>
                    )}
                  </div>
                  
                  {errors.regions && (
                    <p className="text-sm text-red-600 flex items-center mt-2">
                      <X className="w-3 h-3 mr-1" />
                      {errors.regions}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </form>
        </div>
            </div>
          </div>

          {/* Phone Mockup Preview - Hidden on mobile/tablet */}
          <div className="hidden xl:block lg:col-span-1">
            <div className="sticky overflow-x-hidden" style={{ 
              top: 'calc(64px + 1.5rem)', 
              height: 'calc(100vh - 64px - 3rem)', 
              maxWidth: '420px', 
              overflowX: 'hidden'
            }}>
              <div className="h-full flex flex-col items-center justify-center">
                {/* Phone Frame */}
                <div className="relative mx-auto flex-1 flex items-center justify-center min-h-0 w-full" style={{ width: '360px', maxWidth: '100%' }}>
                  {/* Phone Bezel - Outer Frame */}
                  <div className="bg-gradient-to-b from-slate-800 via-slate-900 to-slate-800 rounded-[3rem] p-3 shadow-2xl w-full h-full flex items-center justify-center relative">
                    {/* Side Buttons */}
                    <div className="absolute left-0 top-1/4 w-1 h-16 bg-slate-700 rounded-l-full"></div>
                    <div className="absolute left-0 top-2/4 w-1 h-20 bg-slate-700 rounded-l-full mt-4"></div>
                    <div className="absolute right-0 top-1/3 w-1 h-12 bg-slate-700 rounded-r-full"></div>
                    
                    {/* Screen Container */}
                    <div className="bg-black rounded-[2.5rem] p-1 w-full h-full flex items-center justify-center relative">
                      {/* Notch */}
                      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-slate-900 rounded-b-2xl z-20"></div>
                      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-28 h-5 bg-black rounded-b-xl z-30"></div>
                      {/* Camera/Speaker */}
                      <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-16 h-3 bg-slate-800 rounded-full z-40 flex items-center justify-center gap-1">
                        <div className="w-1 h-1 bg-slate-600 rounded-full"></div>
                        <div className="w-8 h-2 bg-slate-700 rounded-full"></div>
                        <div className="w-1 h-1 bg-slate-600 rounded-full"></div>
        </div>

                      {/* Screen */}
                      <div className="bg-white rounded-[2.25rem] overflow-hidden w-full h-full flex flex-col relative" style={{ maxHeight: '100%', overflowX: 'hidden' }}>
                        {/* Status Bar with Safe Area */}
                        <div className="bg-white pt-6 px-4 pb-2 flex items-center justify-between text-xs font-semibold text-slate-900 flex-shrink-0">
                          <span>9:41</span>
                          <div className="flex items-center gap-1">
                            <div className="flex gap-0.5">
                              <div className="w-1 h-1.5 bg-slate-900 rounded-full"></div>
                              <div className="w-1 h-2 bg-slate-900 rounded-full"></div>
                              <div className="w-1 h-2.5 bg-slate-900 rounded-full"></div>
                              <div className="w-1 h-1.5 bg-slate-400 rounded-full"></div>
                            </div>
                            <div className="w-6 h-3 border-2 border-slate-900 rounded-sm relative">
                              <div className="absolute inset-0.5 bg-slate-900 rounded-sm" style={{ width: '60%' }}></div>
                            </div>
                            <div className="w-1 h-1 bg-slate-900 rounded-full"></div>
                          </div>
                  </div>
                        
                        {/* Scrollable Content */}
                        <div className="flex-1 overflow-y-auto overflow-x-hidden bg-white scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent" style={{ minHeight: 0 }}>
                        {/* Featured Image */}
                        {formData.imageUrl ? (
                          <div className="w-full h-48 bg-slate-200 overflow-hidden">
                      <img
                        src={formData.imageUrl}
                        alt="Article preview"
                              className="w-full h-full object-cover"
                        onError={(e) => {
                                e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                        ) : (
                          <div className="w-full h-48 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                            <Image className="w-8 h-8 text-slate-400" />
                    </div>
                  )}
                        
                        {/* Article Content */}
                        <div className="p-4 overflow-x-hidden">
                          <h2 className="text-lg font-bold text-gray-900 mb-3 leading-tight break-words overflow-wrap-anywhere">
                            {formData.title || 'Article Title'}
                          </h2>
                          
                          {formData.summary && (
                            <p className="text-sm text-gray-600 leading-relaxed mb-4 break-words overflow-wrap-anywhere">{formData.summary}</p>
                          )}
                          
                          {/* Meta Info */}
                          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 pt-3 border-t border-gray-200 mb-3 break-words">
                            {formData.regions.length > 0 && (
                              <div className="flex items-center gap-1.5 break-words">
                                <Globe className="w-3 h-3 text-blue-600 flex-shrink-0" />
                                <span className="text-xs break-words overflow-wrap-anywhere">{formData.regions[0]}</span>
                                {formData.regions.length > 1 && (
                                  <span className="text-xs">+{formData.regions.length - 1}</span>
                  )}
                </div>
                            )}
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3 text-blue-600" />
                              {new Date(formData.publishedAt).toLocaleDateString('en-US', { 
                                month: 'short', 
                                day: 'numeric' 
                              })}
                            </span>
              </div>
              
              {/* Tags */}
              {formData.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mb-4">
                              {formData.tags.slice(0, 3).map((tag, index) => (
                      <span
                        key={index}
                                  className="px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-xs font-medium break-words overflow-wrap-anywhere"
                      >
                        #{tag}
                      </span>
                    ))}
                              {formData.tags.length > 3 && (
                                <span className="px-2 py-1 text-slate-500 text-xs">+{formData.tags.length - 3}</span>
                              )}
                </div>
              )}
              
                          {/* Content Preview */}
              {formData.content && (
                            <div className="pt-3 border-t border-gray-200 overflow-x-hidden">
                    <div 
                                className="prose prose-sm max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-blue-600 prose-strong:text-gray-900 break-words overflow-wrap-anywhere"
                                style={{ fontSize: '14px', wordBreak: 'break-word', overflowWrap: 'anywhere' }}
                                dangerouslySetInnerHTML={{ __html: formData.content }}
                    />
                  </div>
              )}
            </div>
          </div>
                        
                        {/* Home Indicator */}
                        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-slate-900 rounded-full z-30"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}