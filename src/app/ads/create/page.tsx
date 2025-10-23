'use client';

import { useState, useRef, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Plus, Image, DollarSign, Save, Eye, ChevronDown, Check } from 'lucide-react';

export default function CreateAdPage() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    budget: '',
    duration: '',
    imageUrl: '',
    status: 'draft',
  });

  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const statusDropdownRef = useRef(null);

  const statusOptions = [
    { value: 'draft', label: 'Draft' },
    { value: 'active', label: 'Active' },
    { value: 'paused', label: 'Paused' },
    { value: 'scheduled', label: 'Scheduled' }
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (statusDropdownRef.current && !statusDropdownRef.current.contains(event.target as Node)) {
        setIsStatusDropdownOpen(false);
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

  const handleStatusSelect = (status: string) => {
    setFormData(prev => ({
      ...prev,
      status
    }));
    setIsStatusDropdownOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Here you would typically send the data to your backend
  };

  return (
    <Layout title="Create Ad">
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-blue-50 rounded-lg">
                <Plus className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Create New Ad Campaign</h1>
                <p className="text-gray-600">Design and launch a new advertising campaign</p>
              </div>
            </div>
            <div className="flex space-x-3">
              <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                <Eye className="w-4 h-4 inline mr-2" />
                Preview
              </button>
              <button 
                onClick={handleSubmit}
                className="px-4 py-2 bg-[#5E8BA8] text-white rounded-lg hover:bg-[#4A6F8C] transition-colors"
              >
                <Save className="w-4 h-4 inline mr-2" />
                Create Campaign
              </button>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Campaign Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                placeholder="Enter campaign title..."
                required
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Campaign Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                placeholder="Describe your campaign..."
                required
              />
            </div>

            {/* Budget and Duration */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-2">
                  Budget ($)
                </label>
                <input
                  type="number"
                  id="budget"
                  name="budget"
                  value={formData.budget}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  placeholder="Enter budget amount..."
                  min="0"
                  step="0.01"
                />
              </div>

              <div>
                <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-2">
                  Campaign Duration (days)
                </label>
                <input
                  type="number"
                  id="duration"
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  placeholder="Enter duration in days..."
                  min="1"
                />
              </div>
            </div>

            {/* Ad Image */}
            <div>
              <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-2">
                Ad Image URL *
              </label>
              <div className="flex space-x-3">
                <input
                  type="url"
                  id="imageUrl"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleInputChange}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  placeholder="https://example.com/image.jpg"
                  required
                />
                <button
                  type="button"
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Image className="w-4 h-4 inline mr-2" />
                  Upload
                </button>
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Campaign Status
              </label>
              <div className="relative" ref={statusDropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-left flex items-center justify-between text-gray-900"
                >
                  <span>
                    {statusOptions.find(opt => opt.value === formData.status)?.label || 'Draft'}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isStatusDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isStatusDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-50">
                    {statusOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => handleStatusSelect(option.value)}
                        className="w-full px-3 py-2 text-left text-white hover:bg-gray-700 first:rounded-t-lg last:rounded-b-lg flex items-center justify-between"
                      >
                        <span>{option.label}</span>
                        {formData.status === option.value && <Check className="w-3 h-3 text-white" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </form>
        </div>

        {/* Preview */}
        {(formData.title || formData.imageUrl) && (
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Ad Preview</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-center text-sm text-gray-500 mb-3">How your ad will appear:</div>
              
              {/* Ad Preview Container */}
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm max-w-md mx-auto">
                {/* Ad Header */}
                <div className="bg-blue-600 text-white px-4 py-2 text-sm font-medium">
                  Advertisement
                </div>
                
                {/* Ad Content */}
                <div className="p-4">
                  {formData.imageUrl ? (
                    <div className="space-y-3">
                      <img
                        src={formData.imageUrl}
                        alt="Ad preview"
                        className="w-full h-48 object-cover rounded-lg"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                      <div className="hidden bg-gray-200 h-48 rounded-lg flex items-center justify-center">
                        <div className="text-center text-gray-500">
                          <Image className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                          <p className="text-sm">Image failed to load</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gray-200 h-48 rounded-lg flex items-center justify-center">
                      <div className="text-center text-gray-500">
                        <Image className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                        <p className="text-sm">No image provided</p>
                      </div>
                    </div>
                  )}
                  
                  {formData.title && (
                    <div className="mt-4">
                      <h4 className="font-semibold text-gray-900 text-lg leading-tight">{formData.title}</h4>
                      {formData.description && (
                        <p className="text-gray-600 text-sm mt-2 leading-relaxed">{formData.description}</p>
                      )}
                    </div>
                  )}
                </div>
                
                {/* Ad Footer */}
                <div className="bg-gray-50 px-4 py-2 border-t border-gray-200">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Sponsored Content</span>
                    <span>Learn More</span>
                  </div>
                </div>
              </div>
              
              {/* Campaign Info */}
              <div className="mt-4 text-center">
                <div className="inline-flex items-center space-x-4 text-sm text-gray-500 bg-gray-100 rounded-lg px-4 py-2">
                  {formData.budget && <span>Budget: ${formData.budget}</span>}
                  {formData.duration && <span>Duration: {formData.duration} days</span>}
                  {formData.status && <span>Status: {formData.status}</span>}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
