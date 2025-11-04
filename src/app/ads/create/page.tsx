'use client';

import { useState } from 'react';
import Layout from '@/components/Layout';
import { Plus, Image, Save, X, Link as LinkIcon } from 'lucide-react';

export default function CreateAdPage() {
  const [formData, setFormData] = useState({
    title: '',
    imageUrl: '',
    redirectLink: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.imageUrl.trim()) {
      newErrors.imageUrl = 'Image URL is required';
    } else {
      try {
        new URL(formData.imageUrl);
      } catch {
        newErrors.imageUrl = 'Please enter a valid image URL';
      }
    }
    
    if (!formData.redirectLink.trim()) {
      newErrors.redirectLink = 'Redirecting link is required';
    } else {
      try {
        new URL(formData.redirectLink);
      } catch {
        newErrors.redirectLink = 'Please enter a valid redirecting link';
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
    console.log('Form submitted:', formData);
    // Here you would typically send the data to your backend
      // For example: await addAd(formData);
      
      // Reset form
      setFormData({
        title: '',
        imageUrl: '',
        redirectLink: '',
      });
      
      setErrors({});
      setShowSuccess(true);
      
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
        {/* Success Message */}
        {showSuccess && (
          <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg shadow-md mb-6">
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
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg shadow-md mb-6">
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
        <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 rounded-xl p-4 sm:p-5 shadow-lg text-white relative overflow-hidden mb-6">
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
              <button 
                type="submit"
                form="ad-form"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-4 sm:px-5 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg flex items-center justify-center text-sm"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin inline mr-2"></div>
                    Creating...
                  </>
                ) : (
                  <>
                <Save className="w-4 h-4 inline mr-2" />
                    Create Ad
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Form and Preview Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-0">
          {/* Form Section */}
          <div className="xl:col-span-2 space-y-4 lg:space-y-6 xl:pr-6">
            <div className="space-y-4 lg:space-y-6">
              <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden overflow-x-hidden">
                <form id="ad-form" onSubmit={handleSubmit} className="space-y-0 overflow-x-hidden">
                  {/* Section: Ad Details */}
                  <div className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Plus className="w-5 h-5 text-blue-600" />
                  </div>
            <div>
                    <h2 className="text-lg font-bold text-slate-800">Ad Details</h2>
                    <p className="text-xs text-slate-500">Enter the essential information</p>
                  </div>
                </div>

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

                {/* Image URL */}
                <div className="space-y-2">
                  <label htmlFor="imageUrl" className="block text-sm font-semibold text-slate-800 flex items-center">
                    <Image className="w-4 h-4 mr-2 text-blue-600" />
                Ad Image URL *
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
                    placeholder="https://images.example.com/ad-image.jpg"
                    style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}
                  />
                  {errors.imageUrl && (
                    <p className="text-sm text-red-600 flex items-center mt-1">
                      <X className="w-3 h-3 mr-1" />
                      {errors.imageUrl}
                    </p>
                  )}
            </div>

                {/* Redirecting Link */}
                <div className="space-y-2">
                  <label htmlFor="redirectLink" className="block text-sm font-semibold text-slate-800 flex items-center">
                    <LinkIcon className="w-4 h-4 mr-2 text-blue-600" />
                    Redirecting Link *
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
                    placeholder="https://example.com/landing-page"
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
                        <div className="flex-1 overflow-y-auto overflow-x-hidden bg-white scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent relative" style={{ minHeight: 0 }}>
                          {/* Ad Image - Full Height */}
                  {formData.imageUrl ? (
                            <div className="w-full h-full bg-slate-200 overflow-hidden relative">
                      <img
                        src={formData.imageUrl}
                        alt="Ad preview"
                                className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                                  const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                                  if (fallback) fallback.classList.remove('hidden');
                        }}
                      />
                              <div className="hidden w-full h-full bg-gray-200 flex items-center justify-center">
                        <div className="text-center text-gray-500">
                                  <Image className="w-8 h-8 mx-auto mb-1 text-gray-400" />
                                  <p className="text-xs">Image failed</p>
                                </div>
                              </div>
                              
                              {/* Overlay Content */}
                              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/60 to-transparent p-3">
                                {formData.title && (
                                  <h4 className="font-semibold text-white text-sm leading-tight break-words overflow-wrap-anywhere mb-2">
                                    {formData.title}
                                  </h4>
                                )}
                                {formData.redirectLink && (
                                  <p className="text-xs text-white/80 flex items-start gap-1">
                                    <LinkIcon className="w-3 h-3 mt-0.5 flex-shrink-0" />
                                    <span className="break-all">{formData.redirectLink}</span>
                                  </p>
                                )}
                                <div className="flex items-center justify-between text-xs text-white/70 mt-2 pt-2 border-t border-white/20">
                                  <span>Sponsored</span>
                                  <span>Learn More</span>
                        </div>
                      </div>
                              
                              {/* Ad Header Badge */}
                              <div className="absolute top-2 left-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-2 py-1 rounded text-xs font-medium">
                                Advertisement
                              </div>
                    </div>
                  ) : (
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <div className="text-center text-gray-500">
                                <Image className="w-8 h-8 mx-auto mb-1 text-gray-400" />
                                <p className="text-xs">No image</p>
                      </div>
                    </div>
                  )}
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
