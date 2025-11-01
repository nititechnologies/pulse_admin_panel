'use client';

import { useState, useRef, useEffect } from 'react';
import Layout from '@/components/Layout';
import RichTextEditor from '@/components/RichTextEditor';
import { addArticle } from '@/lib/articles';
import { Upload, Image, Save, Eye, Plus, X, Globe, Clock, User, Tag, ChevronDown, Check } from 'lucide-react';

export default function UploadNewsPage() {
  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    content: '',
    journalistName: '',
    region: '',
    source: '',
    imageUrl: '',
    readTime: 5,
    tags: [] as string[],
    publishedAt: new Date().toISOString(),
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [isRegionDropdownOpen, setIsRegionDropdownOpen] = useState(false);
  const regionDropdownRef = useRef<HTMLDivElement>(null);

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

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (regionDropdownRef.current && !regionDropdownRef.current.contains(event.target as Node)) {
        setIsRegionDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };


  const addSuggestedTag = (tag: string) => {
    if (!formData.tags.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
    }
  };

  const handleRegionSelect = (region: string) => {
    setFormData(prev => ({
      ...prev,
      region
    }));
    setIsRegionDropdownOpen(false);
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleImagePreview = () => {
    if (formData.imageUrl.trim()) {
      setShowImagePreview(!showImagePreview);
    } else {
      alert('Please enter an image URL first');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Validate required fields
      if (!formData.title.trim()) {
        alert('Please enter a title');
        setIsSubmitting(false);
        return;
      }
      if (!formData.summary.trim()) {
        alert('Please enter a summary');
        setIsSubmitting(false);
        return;
      }
      if (!formData.content.trim()) {
        alert('Please enter article content');
        setIsSubmitting(false);
        return;
      }
      if (!formData.journalistName.trim()) {
        alert('Please enter journalist name');
        setIsSubmitting(false);
        return;
      }
      if (!formData.region) {
        alert('Please select a region');
        setIsSubmitting(false);
        return;
      }
      if (!formData.imageUrl.trim()) {
        alert('Please enter an image URL');
        setIsSubmitting(false);
        return;
      }
      if (formData.tags.length === 0) {
        alert('Please add at least one tag');
        setIsSubmitting(false);
        return;
      }
      
      const articleData = {
        title: formData.title.trim(),
        summary: formData.summary.trim(),
        content: formData.content.trim(),
        journalistName: formData.journalistName.trim(),
        category: formData.tags.length > 0 ? formData.tags[0] : 'General',
        region: formData.region,
        source: formData.source.trim(),
        imageUrl: formData.imageUrl.trim(),
        readTime: formData.readTime,
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
        journalistName: '',
        region: '',
        source: '',
        imageUrl: '',
        readTime: 5,
        tags: [],
        publishedAt: new Date().toISOString(),
      });
      
      alert('Article published successfully! You can view it in the Firebase database.');
    } catch (error) {
      console.error('Error creating article:', error);
      alert('Error creating article. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout title="Create Article">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 shadow-lg text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <Upload className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Create New Article</h1>
                <p className="text-blue-100 text-sm">Publish professional news content</p>
              </div>
            </div>
            <div className="flex space-x-3">
              <button 
                type="button"
                onClick={handleImagePreview}
                className="px-6 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-white hover:bg-white/30 transition-colors font-medium flex items-center"
              >
                <Image className="w-4 h-4 mr-2" />
                {showImagePreview ? 'Hide Preview' : 'Show Preview'}
              </button>
              <button 
                type="submit"
                form="article-form"
                disabled={isSubmitting}
                className="px-6 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-all duration-200 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin inline mr-2"></div>
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

        {/* Form */}
        <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-200">
          <form id="article-form" onSubmit={handleSubmit} className="space-y-8">
            {/* Title */}
            <div className="space-y-2">
              <label htmlFor="title" className="block text-sm font-semibold text-slate-800">
                Article Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-lg font-medium text-slate-800 bg-white"
                placeholder="Enter compelling article title..."
                required
              />
            </div>

            {/* Summary */}
            <div className="space-y-2">
              <label htmlFor="summary" className="block text-sm font-semibold text-slate-800">
                Article Summary *
              </label>
              <textarea
                id="summary"
                name="summary"
                value={formData.summary}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none text-slate-800 bg-white"
                placeholder="Write a compelling summary that captures the essence of your article..."
                required
              />
            </div>

            {/* Article Content */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-800">
                Article Content *
              </label>
              <RichTextEditor
                value={formData.content}
                onChange={(content) => setFormData(prev => ({ ...prev, content }))}
                placeholder="Write your article content here..."
              />
            </div>

            {/* Basic Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Journalist Name */}
              <div className="space-y-2">
                <label htmlFor="journalistName" className="block text-sm font-semibold text-slate-800">
                  <User className="w-4 h-4 inline mr-2 text-blue-600" />
                  Journalist Name *
                </label>
                <input
                  type="text"
                  id="journalistName"
                  name="journalistName"
                  value={formData.journalistName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-slate-800 bg-white"
                  placeholder="Dr. Sarah Chen"
                  required
                />
              </div>


              {/* Region */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-800">
                  <Globe className="w-4 h-4 inline mr-2 text-blue-600" />
                  Region *
                </label>
                <div className="relative" ref={regionDropdownRef}>
                  <button
                    type="button"
                    onClick={() => setIsRegionDropdownOpen(!isRegionDropdownOpen)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-left flex items-center justify-between"
                  >
                    <span className="text-slate-800">
                      {formData.region || 'Select region...'}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isRegionDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {isRegionDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-slate-800 border border-slate-700 rounded-lg shadow-lg z-50">
                      {regionOptions.map((region) => (
                        <button
                          key={region}
                          type="button"
                          onClick={() => handleRegionSelect(region)}
                          className="w-full px-4 py-3 text-left text-white hover:bg-slate-700 first:rounded-t-lg last:rounded-b-lg flex items-center justify-between"
                        >
                          <span>{region}</span>
                          {formData.region === region && (
                            <Check className="w-3 h-3 text-white" />
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Image URL */}
            <div className="space-y-2">
              <label htmlFor="imageUrl" className="block text-sm font-semibold text-slate-800">
                <Image className="w-4 h-4 inline mr-2 text-blue-600" />
                Featured Image URL *
              </label>
              <input
                type="url"
                id="imageUrl"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-slate-800 bg-white"
                placeholder="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop"
                required
              />
            </div>
              
            {/* Article Preview with Image */}
            {showImagePreview && formData.imageUrl && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">How your article will look:</h4>
                <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
                  {/* Article Header */}
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h2 className="text-2xl font-bold text-gray-900 mb-3 leading-tight">
                          {formData.title || 'Article Title'}
                        </h2>
                        {formData.summary && (
                          <p className="text-gray-600 text-lg leading-relaxed">{formData.summary}</p>
                        )}
                      </div>
                      <div className="ml-6 flex-shrink-0">
                        <img
                          src={formData.imageUrl}
                          alt="Article preview"
                          className="w-32 h-24 object-cover rounded-lg"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      </div>
                    </div>
                    
                    {/* Article Meta */}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                        {formData.journalistName && (
                          <span className="flex items-center">
                            <User className="w-4 h-4 mr-1" />
                            {formData.journalistName}
                          </span>
                        )}
                        {formData.source && (
                          <span>Source: {formData.source}</span>
                        )}
                        {formData.readTime && (
                          <span className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {formData.readTime} min read
                          </span>
                        )}
                        {formData.region && (
                          <span className="flex items-center">
                            <Globe className="w-4 h-4 mr-1" />
                            {formData.region}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {/* Tags */}
                    {formData.tags.length > 0 && (
                      <div className="p-6 bg-gray-50">
                        <div className="flex flex-wrap gap-2">
                          {formData.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-white text-gray-700 rounded-full text-sm font-medium border border-gray-200"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Article Content Preview */}
                    {formData.content && (
                      <div className="p-6 border-t border-gray-100">
                        <h4 className="text-lg font-semibold text-gray-900 mb-4">Content Preview</h4>
                        <div 
                          className="prose prose-sm max-w-none"
                          dangerouslySetInnerHTML={{ __html: formData.content }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

            {/* Categories */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-800">
                <Tag className="w-4 h-4 inline mr-2 text-blue-600" />
                Category *
              </label>
              <p className="text-sm text-slate-600">Select categories from the suggestions below</p>
              
              {/* Suggested Categories */}
              <div className="space-y-3">
                <div>
                  <h4 className="text-sm font-medium text-slate-700 mb-2">Suggested Categories:</h4>
                  <div className="flex flex-wrap gap-2">
                    {suggestedTags.map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => addSuggestedTag(tag)}
                        disabled={formData.tags.includes(tag)}
                        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors border ${
                          formData.tags.includes(tag)
                            ? 'bg-blue-100 text-blue-800 border-blue-200 cursor-not-allowed'
                            : 'bg-slate-100 text-slate-700 hover:bg-blue-100 hover:text-blue-800 border-slate-200'
                        }`}
                      >
                        {formData.tags.includes(tag) ? '✓ ' : ''}{tag}
                      </button>
                    ))}
                  </div>
                </div>
                
              </div>
              
              {/* Selected Categories */}
              {formData.tags.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-slate-700 mb-2">Selected Categories ({formData.tags.length}):</h4>
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium border border-blue-200"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="ml-2 text-blue-600 hover:text-blue-800"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </form>
        </div>

        {/* Preview */}
        {(formData.title || formData.imageUrl) && (
          <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-200">
            <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
              <Eye className="w-5 h-5 mr-2 text-blue-600" />
              Article Preview
            </h3>
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              {/* Article Header */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 mb-3 leading-tight">
                      {formData.title || 'Article Title'}
                    </h2>
                    {formData.summary && (
                      <p className="text-gray-600 text-lg leading-relaxed">{formData.summary}</p>
                    )}
                  </div>
                  {formData.imageUrl && (
                    <div className="ml-6 flex-shrink-0">
                      <img
                        src={formData.imageUrl}
                        alt="Article preview"
                        className="w-40 h-32 object-cover rounded-lg shadow-sm"
                        onError={(e) => {
                          e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYwIiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDE2MCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxNjAiIGhlaWdodD0iMTI4IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik02NCA0OEg5NlY4MEg2NFY0OFoiIGZpbGw9IiM5Q0EzQUYiLz4KPHBhdGggZD0iTTQ4IDY0SDExMlY5Nkg0OFY2NFoiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+';
                          e.currentTarget.alt = 'Image failed to load';
                        }}
                      />
                    </div>
                  )}
                </div>
                
                {/* Article Meta */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                  {formData.journalistName && (
                    <span className="flex items-center">
                      <User className="w-4 h-4 mr-1" />
                      {formData.journalistName}
                    </span>
                  )}
                  {formData.source && (
                    <span>Source: {formData.source}</span>
                  )}
                  {formData.readTime && (
                    <span className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {formData.readTime} min read
                    </span>
                  )}
                  {formData.region && (
                    <span className="flex items-center">
                      <Globe className="w-4 h-4 mr-1" />
                      {formData.region}
                    </span>
                  )}
                </div>
              </div>
              
              {/* Tags */}
              {formData.tags.length > 0 && (
                <div className="p-6 bg-gray-50">
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-white text-gray-700 rounded-full text-sm font-medium border border-gray-200"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Article Content Preview */}
              {formData.content && (
                  <div className="p-6 border-t border-gray-100">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Content Preview</h4>
                    <div 
                      className="prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: formData.content }}
                    />
                  </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
