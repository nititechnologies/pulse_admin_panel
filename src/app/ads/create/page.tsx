'use client';

import { useState, useEffect, useRef } from 'react';
import Layout from '@/components/Layout';
import { Plus, Image, Save, X, Link as LinkIcon, Clock, Calendar, Upload } from 'lucide-react';
import { addAd, type Ad } from '@/lib/ads';
import { uploadImage } from '@/lib/storage';
import { Timestamp } from 'firebase/firestore';

export default function CreateAdPage() {
  const [formData, setFormData] = useState({
    title: '',
    imageUrl: '',
    redirectLink: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isScheduled, setIsScheduled] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [scheduledDateTime, setScheduledDateTime] = useState(() => {
    const date = new Date();
    date.setHours(date.getHours() + 1);
    date.setMinutes(0);
    return date.toISOString().slice(0, 16); // Format: YYYY-MM-DDTHH:mm
  });
  
  const [imageUploadMethod, setImageUploadMethod] = useState<'url' | 'upload'>('url');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check for scheduled content every minute (when page is open)
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        await fetch('/api/publish-scheduled', { method: 'POST' });
      } catch (error) {
        console.error('Error checking scheduled content:', error);
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, imageUrl: 'Please select a valid image file' }));
        return;
      }
      
      // Validate file size (max 1MB)
      if (file.size > 1 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, imageUrl: 'Image size must be less than 1MB' }));
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
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors.imageUrl;
      return newErrors;
    });
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (imageUploadMethod === 'url') {
      if (!formData.imageUrl.trim()) {
        newErrors.imageUrl = 'Image URL is required';
      } else {
        try {
          new URL(formData.imageUrl);
        } catch {
          newErrors.imageUrl = 'Please enter a valid image URL';
        }
      }
    } else {
      if (!imageFile) {
        newErrors.imageUrl = 'Please select an image file to upload';
      }
    }
    
    if (formData.redirectLink.trim()) {
      try {
        new URL(formData.redirectLink);
      } catch {
        newErrors.redirectLink = 'Please enter a valid redirecting link';
      }
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
      let imageUrl = formData.imageUrl.trim();
      
      // Upload image file if using file upload
      if (imageUploadMethod === 'upload' && imageFile) {
        setIsUploadingImage(true);
        try {
          imageUrl = await uploadImage(imageFile);
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
      }
      
      const adData: Omit<Ad, 'id' | 'createdAt' | 'updatedAt'> = {
        title: formData.title.trim(),
        imageUrl: imageUrl,
        redirectLink: formData.redirectLink.trim(),
      };

      // Add scheduledAt if scheduling is enabled
      if (isScheduled && scheduledDateTime) {
        const scheduledDate = new Date(scheduledDateTime);
        if (scheduledDate > new Date()) {
          adData.scheduledAt = Timestamp.fromDate(scheduledDate);
        }
      }

      console.log('Saving ad to Firebase:', adData);
      
      // Save to Firebase
      const adId = await addAd(adData);
      
      console.log('Ad saved with ID:', adId);
      
      // Reset form
      setFormData({
        title: '',
        imageUrl: '',
        redirectLink: '',
      });
      
      setIsScheduled(false);
      setImageFile(null);
      setImagePreview(null);
      setImageUploadMethod('url');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      setErrors({});
      setShowSuccess(true);
      
      // Show appropriate success message
      if (isScheduled) {
        const scheduledDate = new Date(scheduledDateTime);
        const message = `Ad scheduled successfully! It will be published on ${scheduledDate.toLocaleString()}`;
        console.log(message);
      }
      
      // Scroll to top to show success message
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      // Hide success message after 5 seconds
      setTimeout(() => setShowSuccess(false), 5000);
    } catch (error) {
      console.error('Error creating ad:', error);
      setErrors({ submit: 'Error creating ad. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout title="Create Ad">
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
                      <svg className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-green-800">
                        Ad created successfully!
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
                        <Plus className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div>
                        <h1 className="text-xl sm:text-2xl font-bold text-white">Create New Ad</h1>
                        <p className="text-blue-100 text-xs hidden sm:block">Create a simple advertisement</p>
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
                        form="ad-form"
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
                            {isScheduled ? 'Scheduling...' : 'Creating...'}
                          </>
                        ) : (
                          <>
                <Save className="w-4 h-4 inline mr-2" />
                            {isScheduled ? 'Schedule Ad' : 'Create Ad'}
                          </>
                        )}
              </button>
                    </div>
            </div>
          </div>
        </div>

              <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden overflow-x-hidden mb-6">
                <form id="ad-form" onSubmit={handleSubmit} className="space-y-0 overflow-x-hidden">
                  {/* Section: Ad Details */}
                  <div className="p-4 sm:p-6 lg:p-8 border-b border-slate-200 bg-gradient-to-br from-slate-50 to-white">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Plus className="w-5 h-5 text-blue-600" />
                      </div>
            <div>
                        <h2 className="text-lg font-bold text-slate-800">Ad Details</h2>
                        <p className="text-xs text-slate-500">Enter the essential information</p>
                      </div>
                    </div>

                    <div className="space-y-4 sm:space-y-6">
                      {/* Title */}
                      <div className="space-y-2">
                  <label htmlFor="title" className="block text-sm font-semibold text-slate-800">
                    Ad Title *
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
                    placeholder="Enter ad title..."
                    style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}
                  />
                  {errors.title && (
                    <p className="text-sm text-red-600 flex items-center mt-1">
                      <X className="w-3 h-3 mr-1" />
                      {errors.title}
                    </p>
                  )}
            </div>

                      {/* Image Input */}
                      <div className="space-y-3">
                        <label className="block text-sm font-semibold text-slate-800 flex items-center">
                          <Image className="w-4 h-4 mr-2 text-blue-600" />
                          Ad Image *
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
                            Upload
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
                              placeholder="https://images.example.com/ad-image.jpg"
                              style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}
                            />
                            {formData.imageUrl && !errors.imageUrl && (
                              <div className="mt-2">
                                <img
                                  src={formData.imageUrl}
                                  alt="Preview"
                                  className="max-w-full h-32 object-cover rounded-xl border border-slate-200"
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
                              ref={fileInputRef}
                              type="file"
                              id="imageFile"
                              accept="image/*"
                              onChange={handleFileChange}
                              className="hidden"
                            />
                            <label
                              htmlFor="imageFile"
                              className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 ${
                                errors.imageUrl
                                  ? 'border-red-300 bg-red-50'
                                  : imageFile
                                  ? 'border-blue-300 bg-blue-50'
                                  : 'border-slate-300 bg-slate-50 hover:border-blue-400 hover:bg-blue-50'
                              }`}
                            >
                              {imagePreview ? (
                                <div className="relative w-full h-full">
                                  <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="w-full h-full object-cover rounded-xl"
                />
                <button
                  type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setImageFile(null);
                                      setImagePreview(null);
                                      if (fileInputRef.current) {
                                        fileInputRef.current.value = '';
                                      }
                                    }}
                                    className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                                  >
                                    <X className="w-4 h-4" />
                </button>
              </div>
                              ) : (
                                <div className="flex flex-col items-center justify-center pt-5 pb-6 px-4">
                                  <Upload className="w-8 h-8 mb-2 text-slate-400" />
                                  <p className="mb-2 text-sm text-slate-600">
                                    <span className="font-semibold">Click to upload</span> or drag and drop
                                  </p>
                                  <p className="text-xs text-slate-500">PNG, JPG, GIF up to 1MB</p>
                                </div>
                              )}
                            </label>
                            {isUploadingImage && (
                              <div className="flex items-center justify-center py-2">
                                <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-2"></div>
                                <span className="text-sm text-slate-600">Uploading image...</span>
                              </div>
                            )}
                          </div>
                        )}

                        {errors.imageUrl && (
                          <p className="text-sm text-red-600 flex items-center">
                            <X className="w-3 h-3 mr-1" />
                            {errors.imageUrl}
                          </p>
                        )}
            </div>

                      {/* Redirecting Link */}
                      <div className="space-y-2">
                  <label htmlFor="redirectLink" className="block text-sm font-semibold text-slate-800 flex items-center">
                    <LinkIcon className="w-4 h-4 mr-2 text-blue-600" />
                    Redirecting Link <span className="text-xs font-normal text-slate-400 ml-1">(Optional)</span>
              </label>
                  <input
                    type="url"
                    id="redirectLink"
                    name="redirectLink"
                    value={formData.redirectLink}
                    onChange={handleInputChange}
                    className={`w-full px-3 sm:px-4 py-2.5 sm:py-3.5 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm sm:text-base text-slate-800 bg-white overflow-x-hidden ${
                      errors.redirectLink ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-slate-200'
                    }`}
                    placeholder="https://example.com/landing-page (Optional)"
                    style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}
                  />
                  {errors.redirectLink && (
                    <p className="text-sm text-red-600 flex items-center mt-1">
                      <X className="w-3 h-3 mr-1" />
                      {errors.redirectLink}
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
                  <h2 className="text-xl font-bold text-slate-800">Schedule Ad</h2>
                  <p className="text-xs text-slate-500">Choose when to publish this ad</p>
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
                  <strong className="text-blue-900">Note:</strong> The ad will be automatically published at the selected date and time. Make sure the time is in the future.
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
      </div>
    </Layout>
  );
}
