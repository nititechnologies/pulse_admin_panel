'use client';

import { useState, useEffect, useRef } from 'react';
import Layout from '@/components/Layout';
import RichTextEditor from '@/components/RichTextEditor';
import { addArticle, type Article } from '@/lib/articles';
import { getTags, getRegions, type Tag as TagType, type Region as RegionType } from '@/lib/tagsAndRegions';
import { useAuth } from '@/contexts/AuthContext';
import { Upload, Image, Save, Plus, X, Globe, Tag, Check, FileText, Calendar, Clock, Youtube, Link as LinkIcon } from 'lucide-react';
import { Timestamp } from 'firebase/firestore';
import { uploadImage } from '@/lib/storage';

export default function UploadNewsPage() {
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    content: '',
    imageUrl: '',
    youtubeVideoUrl: '',
    tags: [] as string[],
    regions: [] as string[],
    publishedAt: new Date().toISOString(),
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [isScheduled, setIsScheduled] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [scheduledDateTime, setScheduledDateTime] = useState(() => {
    const date = new Date();
    date.setHours(date.getHours() + 1);
    date.setMinutes(0);
    return date.toISOString().slice(0, 16); // Format: YYYY-MM-DDTHH:mm
  });

  // Image upload state
  const [imageUploadMethod, setImageUploadMethod] = useState<'url' | 'upload'>('url');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const imageFileInputRef = useRef<HTMLInputElement>(null);

  // Tags and Regions from Firebase
  const [availableTags, setAvailableTags] = useState<TagType[]>([]);
  const [availableRegions, setAvailableRegions] = useState<RegionType[]>([]);
  const [loadingTags, setLoadingTags] = useState(true);

  // Fetch tags and regions from Firebase
  useEffect(() => {
    const loadTagsAndRegions = async () => {
      try {
        setLoadingTags(true);
        const [tagsData, regionsData] = await Promise.all([
          getTags(),
          getRegions()
        ]);
        setAvailableTags(tagsData);
        setAvailableRegions(regionsData);
      } catch (error) {
        console.error('Error loading tags and regions:', error);
      } finally {
        setLoadingTags(false);
      }
    };

    loadTagsAndRegions();
  }, []);

  // Check for scheduled articles every minute (when page is open)
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        await fetch('/api/publish-scheduled', { method: 'POST' });
      } catch (error) {
        console.error('Error checking scheduled articles:', error);
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  // Convert to simple string arrays for easy use
  const regionOptions = availableRegions.map(r => r.name);
  const suggestedTags = availableTags.map(t => t.name);


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

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, imageUrl: 'Please select a valid image file' }));
        return;
      }
      
      // Validate file size (max 1MB)
      if (file.size > 1 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, imageUrl: 'Image size must be 1MB or less' }));
        return;
      }
      
      setImageFile(file);
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.imageUrl;
        return newErrors;
      });
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageMethodChange = (method: 'url' | 'upload') => {
    setImageUploadMethod(method);
    setImageFile(null);
    setImagePreview(null);
    setFormData(prev => ({ ...prev, imageUrl: '' }));
    if (imageFileInputRef.current) {
      imageFileInputRef.current.value = '';
    }
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors.imageUrl;
      return newErrors;
    });
  };

  // Add tag
  const addSuggestedTag = (tag: string) => {
    if (!formData.tags.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
    }
  };

  // Add region
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
    
    // Validate that either image OR video is provided
    const hasImage = imageUploadMethod === 'url' 
      ? formData.imageUrl.trim() 
      : imageFile !== null;
    const hasVideo = formData.youtubeVideoUrl.trim() !== '';
    
    if (!hasImage && !hasVideo) {
      newErrors.imageUrl = 'Either an image or a YouTube video URL is required';
      newErrors.youtubeVideoUrl = 'Either an image or a YouTube video URL is required';
    } else {
      // Validate image if provided
      if (hasImage) {
        if (imageUploadMethod === 'url') {
    if (!formData.imageUrl.trim()) {
      newErrors.imageUrl = 'Image URL is required';
    } else {
      try {
        new URL(formData.imageUrl);
      } catch {
        newErrors.imageUrl = 'Please enter a valid URL';
            }
          }
        } else {
          if (!imageFile) {
            newErrors.imageUrl = 'Please select an image file to upload';
          }
        }
      }
      
      // Validate video URL if provided
      if (hasVideo) {
        try {
          new URL(formData.youtubeVideoUrl);
        } catch {
          newErrors.youtubeVideoUrl = 'Please enter a valid YouTube URL';
        }
      }
    }
    
    if (formData.tags.length === 0) {
      newErrors.tags = 'Please add at least one category';
    }

    // Validate scheduled date if scheduling is enabled
    if (isScheduled) {
      if (!scheduledDateTime) {
        newErrors.scheduledDateTime = 'Please select a scheduled date and time';
      } else {
        const scheduledDate = new Date(scheduledDateTime);
        if (scheduledDate <= new Date()) {
          newErrors.scheduledDateTime = 'Scheduled time must be in the future';
        }
      }
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
      let imageUrl = '';
      
      // Upload image file if using file upload
      if (imageUploadMethod === 'upload' && imageFile) {
        setIsUploadingImage(true);
        try {
          imageUrl = await uploadImage(imageFile, `articles/${Date.now()}_${imageFile.name}`);
          console.log('Image uploaded successfully:', imageUrl);
        } catch (uploadError) {
          console.error('Error uploading image:', uploadError);
          setErrors({ submit: 'Failed to upload image. Please try again.' });
          setIsUploadingImage(false);
          setIsSubmitting(false);
          return;
        } finally {
          setIsUploadingImage(false);
        }
      } else if (imageUploadMethod === 'url') {
        imageUrl = formData.imageUrl.trim();
      }
      
      // Get journalist name from user account
      const journalistName = user?.displayName || 
                           user?.email?.split('@')[0] || 
                           'Anonymous';
      
      // Build article data, only including fields that have values
      type ArticleInput = Omit<Article, 'id' | 'createdAt' | 'updatedAt'>;
      const articleData: Partial<ArticleInput> & {
        title: string;
        summary: string;
        content: string;
        journalistName: string;
        regions: string[];
        tags: string[];
        publishedAt: string;
      } = {
        title: formData.title.trim(),
        summary: formData.summary.trim(),
        content: formData.content.trim(),
        journalistName: journalistName,
        regions: formData.regions.length > 0 ? formData.regions : [],
        tags: formData.tags,
        publishedAt: new Date(formData.publishedAt).toISOString(),
      };

      // Only add imageUrl if it has a value (Firebase doesn't allow undefined)
      if (imageUrl && imageUrl.trim()) {
        articleData.imageUrl = imageUrl.trim();
      }

      // Only add youtubeVideoUrl if it has a value
      const videoUrl = formData.youtubeVideoUrl.trim();
      if (videoUrl) {
        articleData.youtubeVideoUrl = videoUrl;
      }

      // Add scheduledAt if scheduling is enabled
      if (isScheduled && scheduledDateTime) {
        const scheduledDate = new Date(scheduledDateTime);
        if (scheduledDate > new Date()) {
          articleData.scheduledAt = Timestamp.fromDate(scheduledDate);
        }
      }
      
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
        youtubeVideoUrl: '',
        tags: [],
        regions: [],
        publishedAt: new Date().toISOString(),
      });
      
      setImageFile(null);
      setImagePreview(null);
      setImageUploadMethod('url');
      if (imageFileInputRef.current) {
        imageFileInputRef.current.value = '';
      }
      
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
        {/* Form Layout */}
        <div className="max-w-4xl mx-auto">
          {/* Form Section */}
          <div className="space-y-4 lg:space-y-6">
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
                  <div className="flex flex-col sm:flex-row flex-wrap gap-3">
              <button 
                type="button"
                      onClick={() => setShowScheduleModal(true)}
                      className="w-full sm:w-auto px-4 sm:px-5 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all duration-200 font-semibold border border-white/20 shadow-md hover:shadow-lg flex items-center justify-center text-sm"
              >
                      <Clock className="w-4 h-4 inline mr-2" />
                      Schedule
              </button>
              <button 
                type="submit"
                form="article-form"
                disabled={isSubmitting || isUploadingImage}
                      className="w-full sm:w-auto px-4 sm:px-5 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg flex items-center justify-center text-sm"
              >
                {isUploadingImage ? (
                  <>
                          <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin inline mr-2"></div>
                          Uploading...
                  </>
                ) : isSubmitting ? (
                  <>
                          <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin inline mr-2"></div>
                          {isScheduled ? 'Scheduling...' : 'Publishing...'}
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 inline mr-2" />
                          {isScheduled ? 'Schedule Article' : 'Publish Article'}
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

            {/* Image Input */}
            <div className="space-y-3">
                  <label className="block text-sm font-semibold text-slate-800 flex items-center">
                    <Image className="w-4 h-4 mr-2 text-blue-600" />
                Featured Image (Required if no video)
              </label>
              
              {/* Method Toggle */}
              <div className="flex gap-2 p-1 bg-slate-100 rounded-lg">
                <button
                  type="button"
                  onClick={() => handleImageMethodChange('url')}
                  className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center justify-center ${
                    imageUploadMethod === 'url'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-slate-600 hover:text-slate-800'
                  }`}
                >
                  <LinkIcon className="w-4 h-4 mr-1.5" />
                  URL
                </button>
                <button
                  type="button"
                  onClick={() => handleImageMethodChange('upload')}
                  className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center justify-center ${
                    imageUploadMethod === 'upload'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-slate-600 hover:text-slate-800'
                  }`}
                >
                  <Upload className="w-4 h-4 mr-1.5" />
                  Upload (Max 1MB)
                </button>
              </div>

              {/* URL Input */}
              {imageUploadMethod === 'url' && (
                <div className="space-y-2">
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
              )}

              {/* File Upload */}
              {imageUploadMethod === 'upload' && (
                <div className="space-y-2">
                  <input
                    ref={imageFileInputRef}
                    type="file"
                    id="imageFile"
                    accept="image/*"
                    onChange={handleImageFileChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="imageFile"
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 mb-2 text-slate-400" />
                      <p className="mb-2 text-sm text-slate-500">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-slate-400">PNG, JPG, GIF up to 1MB</p>
                    </div>
                  </label>
                  {imagePreview && (
                    <div className="mt-3">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="max-w-full h-48 object-cover rounded-xl border border-slate-200"
                      />
                    </div>
                  )}
                  {imageFile && (
                    <p className="text-xs text-slate-600 mt-2">
                      Selected: {imageFile.name} ({(imageFile.size / 1024).toFixed(2)} KB)
                    </p>
                  )}
                  {errors.imageUrl && (
                    <p className="text-sm text-red-600 flex items-center mt-1">
                      <X className="w-3 h-3 mr-1" />
                      {errors.imageUrl}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* YouTube Video URL */}
            <div className="space-y-2">
                  <label htmlFor="youtubeVideoUrl" className="block text-sm font-semibold text-slate-800 flex items-center">
                    <Youtube className="w-4 h-4 mr-2 text-red-600" />
                YouTube Video URL (Required if no image)
              </label>
              <input
                type="url"
                id="youtubeVideoUrl"
                name="youtubeVideoUrl"
                value={formData.youtubeVideoUrl}
                onChange={handleInputChange}
                    className={`w-full px-3 sm:px-4 py-2.5 sm:py-3.5 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm sm:text-base text-slate-800 bg-white overflow-x-hidden ${
                      errors.youtubeVideoUrl ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-slate-200'
                    }`}
                    placeholder="https://www.youtube.com/watch?v=..."
                    style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}
                  />
                  {errors.youtubeVideoUrl && (
                    <p className="text-sm text-red-600 flex items-center mt-1">
                      <X className="w-3 h-3 mr-1" />
                      {errors.youtubeVideoUrl}
                    </p>
                  )}
                  {formData.youtubeVideoUrl && !errors.youtubeVideoUrl && (
                    <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <p className="text-xs text-slate-600 mb-2">YouTube video will be embedded in the article</p>
                      <p className="text-xs text-slate-500 break-all">{formData.youtubeVideoUrl}</p>
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
                      {loadingTags ? (
                        <div className="flex items-center text-sm text-slate-500">
                          <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-2"></div>
                          Loading tags...
                        </div>
                      ) : suggestedTags.length > 0 ? (
                        suggestedTags.map((tag) => {
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
                        })
                      ) : (
                        <p className="text-xs text-slate-500 italic">No tags available. Add tags in the Regions & Tags section.</p>
                      )}
                    </div>
                    {formData.tags.length === 0 && !loadingTags && suggestedTags.length > 0 && (
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
                      {loadingTags ? (
                        <div className="flex items-center text-sm text-slate-500">
                          <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin mr-2"></div>
                          Loading regions...
                        </div>
                      ) : regionOptions.length > 0 ? (
                        regionOptions.map((region) => {
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
                        })
                      ) : (
                        <p className="text-xs text-slate-500 italic">No regions available. Add regions in the Regions & Tags section.</p>
                      )}
                    </div>
                    {formData.regions.length === 0 && !loadingTags && regionOptions.length > 0 && (
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
        </div>
      </div>

      {/* Schedule Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowScheduleModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Clock className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-800">Schedule Article</h2>
                  <p className="text-xs text-slate-500">Choose when to publish this article</p>
                </div>
              </div>
              <button
                onClick={() => setShowScheduleModal(false)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-600" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-2">
                    Select Date & Time *
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {/* Date Input */}
                    <div className="space-y-1">
                      <label htmlFor="scheduleDate" className="block text-xs font-medium text-slate-600">
                        Date
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="date"
                          id="scheduleDate"
                          value={scheduledDateTime.split('T')[0]}
                          onChange={(e) => {
                            const time = scheduledDateTime.split('T')[1] || '12:00';
                            setScheduledDateTime(`${e.target.value}T${time}`);
                          }}
                          min={new Date().toISOString().split('T')[0]}
                          className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 text-sm text-slate-800 bg-white ${
                            errors.scheduledDateTime ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-slate-200'
                          }`}
                        />
                      </div>
                    </div>
                    
                    {/* Time Input */}
                    <div className="space-y-1">
                      <label htmlFor="scheduleTime" className="block text-xs font-medium text-slate-600">
                        Time
                      </label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="time"
                          id="scheduleTime"
                          value={scheduledDateTime.split('T')[1] || '12:00'}
                          onChange={(e) => {
                            const date = scheduledDateTime.split('T')[0] || new Date().toISOString().split('T')[0];
                            setScheduledDateTime(`${date}T${e.target.value}`);
                          }}
                          className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 text-sm text-slate-800 bg-white ${
                            errors.scheduledDateTime ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-slate-200'
                          }`}
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Preview */}
                  <div className="mt-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
                    <p className="text-xs font-medium text-purple-900 mb-1">Scheduled for:</p>
                    <p className="text-sm font-semibold text-purple-700">
                      {new Date(scheduledDateTime).toLocaleString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true
                      })}
                    </p>
                  </div>
                  
                  {errors.scheduledDateTime && (
                    <p className="text-sm text-red-600 flex items-center mt-2">
                      <X className="w-3 h-3 mr-1" />
                      {errors.scheduledDateTime}
                    </p>
                  )}
                </div>
                
                <p className="text-xs text-slate-500 bg-blue-50 p-3 rounded-lg border border-blue-200">
                  <strong className="text-blue-900">Note:</strong> The article will be automatically published at the selected date and time. Make sure the time is in the future.
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowScheduleModal(false);
                    setIsScheduled(false);
                    setScheduledDateTime(() => {
                      const date = new Date();
                      date.setHours(date.getHours() + 1);
                      date.setMinutes(0);
                      return date.toISOString().slice(0, 16);
                    });
                  }}
                  className="flex-1 px-4 py-2.5 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-all duration-200 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const scheduledDate = new Date(scheduledDateTime);
                    if (scheduledDate <= new Date()) {
                      setErrors({ scheduledDateTime: 'Scheduled time must be in the future' });
                      return;
                    }
                    setIsScheduled(true);
                    setShowScheduleModal(false);
                    setErrors({});
                  }}
                  className="flex-1 px-4 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all duration-200 font-semibold shadow-md hover:shadow-lg flex items-center justify-center"
                >
                  <Clock className="w-4 h-4 mr-2" />
                  Set Schedule
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}