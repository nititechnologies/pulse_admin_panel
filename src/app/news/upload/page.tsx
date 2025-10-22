'use client';

import { useState } from 'react';
import Layout from '@/components/Layout';
import RichTextEditor from '@/components/RichTextEditor';
import { addArticle } from '@/lib/articles';
import { testFirebaseConnection } from '@/lib/testFirebase';
import { Upload, Image, Save, Eye, Plus, X, Globe, Clock, User, Tag } from 'lucide-react';

export default function UploadNewsPage() {
  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    content: '',
    journalistName: '',
    category: '',
    region: '',
    source: '',
    imageUrl: '',
    readTime: 5,
    tags: [] as string[],
    publishedAt: new Date().toISOString(),
  });

  const [newTag, setNewTag] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
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
      if (!formData.category) {
        alert('Please select a category');
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
      
      const articleData = {
        title: formData.title.trim(),
        summary: formData.summary.trim(),
        content: formData.content.trim(),
        journalistName: formData.journalistName.trim(),
        category: formData.category,
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
        category: '',
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
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl">
                <Upload className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Create New Article</h1>
                <p className="text-gray-500 text-sm">Publish professional news content</p>
              </div>
            </div>
            <div className="flex space-x-3">
              <button 
                type="button"
                onClick={async () => {
                  const success = await testFirebaseConnection();
                  alert(success ? 'Firebase connection successful!' : 'Firebase connection failed!');
                }}
                className="px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors text-sm font-medium"
              >
                Test Firebase
              </button>
              <button 
                type="button"
                className="px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors text-sm font-medium"
              >
                <Eye className="w-4 h-4 inline mr-2" />
                Preview
              </button>
              <button 
                type="submit"
                form="article-form"
                disabled={isSubmitting}
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
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
        <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
          <form id="article-form" onSubmit={handleSubmit} className="space-y-8">
            {/* Title */}
            <div className="space-y-2">
              <label htmlFor="title" className="block text-sm font-semibold text-gray-900">
                Article Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-lg font-medium"
                placeholder="Enter compelling article title..."
                required
              />
            </div>

            {/* Summary */}
            <div className="space-y-2">
              <label htmlFor="summary" className="block text-sm font-semibold text-gray-900">
                Article Summary *
              </label>
              <textarea
                id="summary"
                name="summary"
                value={formData.summary}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                placeholder="Write a compelling summary that captures the essence of your article..."
                required
              />
            </div>

            {/* Article Content */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-900">
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
                <label htmlFor="journalistName" className="block text-sm font-semibold text-gray-900">
                  <User className="w-4 h-4 inline mr-2" />
                  Journalist Name *
                </label>
                <input
                  type="text"
                  id="journalistName"
                  name="journalistName"
                  value={formData.journalistName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Dr. Sarah Chen"
                  required
                />
              </div>

              {/* Category */}
              <div className="space-y-2">
                <label htmlFor="category" className="block text-sm font-semibold text-gray-900">
                  <Tag className="w-4 h-4 inline mr-2" />
                  Category *
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  required
                >
                  <option value="">Select category...</option>
                  <option value="Technology">Technology</option>
                  <option value="Business">Business</option>
                  <option value="Health">Health</option>
                  <option value="Sports">Sports</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Science">Science</option>
                  <option value="Politics">Politics</option>
                  <option value="World">World</option>
                </select>
              </div>

              {/* Region */}
              <div className="space-y-2">
                <label htmlFor="region" className="block text-sm font-semibold text-gray-900">
                  <Globe className="w-4 h-4 inline mr-2" />
                  Region *
                </label>
                <select
                  id="region"
                  name="region"
                  value={formData.region}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  required
                >
                  <option value="">Select region...</option>
                  <option value="World">World</option>
                  <option value="North America">North America</option>
                  <option value="Europe">Europe</option>
                  <option value="Asia">Asia</option>
                  <option value="Africa">Africa</option>
                  <option value="South America">South America</option>
                  <option value="Oceania">Oceania</option>
                </select>
              </div>
            </div>

            {/* Image URL */}
            <div className="space-y-2">
              <label htmlFor="imageUrl" className="block text-sm font-semibold text-gray-900">
                <Image className="w-4 h-4 inline mr-2" />
                Featured Image URL *
              </label>
              <div className="flex space-x-3">
                <input
                  type="url"
                  id="imageUrl"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleInputChange}
                  className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop"
                  required
                />
                <button
                  type="button"
                  className="px-6 py-3 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors font-medium"
                >
                  <Image className="w-4 h-4 inline mr-2" />
                  Upload
                </button>
              </div>
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-900">
                <Tag className="w-4 h-4 inline mr-2" />
                Tags
              </label>
              <div className="flex space-x-3">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Add a tag and press Enter..."
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  <Plus className="w-4 h-4 inline mr-2" />
                  Add
                </button>
              </div>
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {formData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
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
              )}
            </div>
          </form>
        </div>

        {/* Preview */}
        {formData.title && (
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <Eye className="w-5 h-5 mr-2 text-blue-600" />
              Article Preview
            </h3>
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              {/* Article Header */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 mb-3 leading-tight">{formData.title}</h2>
                    {formData.summary && (
                      <p className="text-gray-600 text-lg leading-relaxed">{formData.summary}</p>
                    )}
                  </div>
                  {formData.imageUrl && (
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
                  {formData.category && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                      {formData.category}
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
                  <div className="prose prose-sm max-w-none">
                    <pre className="whitespace-pre-wrap font-sans text-gray-700 leading-relaxed">
                      {formData.content}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
