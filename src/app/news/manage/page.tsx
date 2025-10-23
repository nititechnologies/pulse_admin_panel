'use client';

import { useState, useEffect, useRef } from 'react';
import Layout from '@/components/Layout';
import { getArticles, deleteArticle, Article } from '@/lib/articles';
import { Search, Trash2, Eye, Calendar, User, Tag, ChevronDown, Check } from 'lucide-react';

export default function ManageNewsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const categoryDropdownRef = useRef(null);
  const statusDropdownRef = useRef(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);

  const categoryOptions = [
    'all',
    'Technical',
    'Political',
    'Education',
    'Health',
    'Sports',
    'Entertainment',
    'Business',
    'Science',
    'Environment',
    'Technology',
    'Economy',
    'Social',
    'International',
    'Local',
    'Breaking',
    'Analysis',
    'Opinion',
    'Investigative'
  ];

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'published', label: 'Published' },
    { value: 'draft', label: 'Draft' },
    { value: 'scheduled', label: 'Scheduled' }
  ];

  useEffect(() => {
    fetchArticles();
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target as Node)) {
        setIsCategoryDropdownOpen(false);
      }
      if (statusDropdownRef.current && !statusDropdownRef.current.contains(event.target as Node)) {
        setIsStatusDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const articlesData = await getArticles();
      setArticles(articlesData);
    } catch (error) {
      console.error('Error fetching articles:', error);
      setError('Failed to load articles');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteArticle = async (id: string) => {
    if (confirm('Are you sure you want to delete this article?')) {
      try {
        await deleteArticle(id);
        setArticles(articles.filter(article => article.id !== id));
        alert('Article deleted successfully');
      } catch (error) {
        console.error('Error deleting article:', error);
        alert('Failed to delete article');
      }
    }
  };

  const handleReviewArticle = (article: Article) => {
    setSelectedArticle(article);
    setShowReviewModal(true);
  };

  const closeReviewModal = () => {
    setShowReviewModal(false);
    setSelectedArticle(null);
  };

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.journalistName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || article.status === selectedStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Layout title="Manage News">
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Manage News Articles</h1>
            <p className="text-gray-600">Edit, delete, and organize your articles</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <div className="relative" ref={categoryDropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-left flex items-center justify-between text-sm"
                >
                  <span className="text-gray-900">
                    {selectedCategory === 'all' ? 'All Categories' : selectedCategory}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isCategoryDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isCategoryDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-50">
                    <button
                      key="all"
                      onClick={() => { setSelectedCategory('all'); setIsCategoryDropdownOpen(false); }}
                      className="w-full px-3 py-2 text-left text-white hover:bg-gray-700 first:rounded-t-lg last:rounded-b-lg flex items-center justify-between text-sm"
                    >
                      <span>All Categories</span>
                      {selectedCategory === 'all' && <Check className="w-3 h-3 text-white" />}
                    </button>
                    {categoryOptions.filter(opt => opt !== 'all').map((category) => (
                      <button
                        key={category}
                        onClick={() => { setSelectedCategory(category); setIsCategoryDropdownOpen(false); }}
                        className="w-full px-3 py-2 text-left text-white hover:bg-gray-700 first:rounded-t-lg last:rounded-b-lg flex items-center justify-between text-sm"
                      >
                        <span>{category}</span>
                        {selectedCategory === category && <Check className="w-3 h-3 text-white" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <div className="relative" ref={statusDropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-left flex items-center justify-between text-sm"
                >
                  <span className="text-gray-900">
                    {statusOptions.find(opt => opt.value === selectedStatus)?.label || 'All Status'}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isStatusDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isStatusDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-50">
                    {statusOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => { setSelectedStatus(option.value); setIsStatusDropdownOpen(false); }}
                        className="w-full px-3 py-2 text-left text-white hover:bg-gray-700 first:rounded-t-lg last:rounded-b-lg flex items-center justify-between text-sm"
                      >
                        <span>{option.label}</span>
                        {selectedStatus === option.value && <Check className="w-3 h-3 text-white" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Articles List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Articles ({filteredArticles.length})
            </h3>
          </div>
          
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading articles...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600 mb-4">{error}</p>
              <button 
                onClick={fetchArticles}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : filteredArticles.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">No articles found</p>
              <p className="text-sm text-gray-500">Create your first article to get started</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredArticles.map((article) => (
              <div key={article.id} className="p-6 hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => console.log('Edit article:', article.id)}>
                <div className="flex items-start space-x-4">
                  {/* Featured Image */}
                  <div className="flex-shrink-0">
                    <img
                      src={article.imageUrl}
                      alt={article.title}
                      className="w-20 h-20 object-cover rounded-lg"
                      onError={(e) => {
                        e.currentTarget.src = 'https://via.placeholder.com/80x80?text=No+Image';
                      }}
                    />
                  </div>

                  {/* Article Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">
                          {article.title}
                        </h4>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                          <span className="flex items-center">
                            <User className="w-3 h-3 mr-1" />
                            {article.journalistName}
                          </span>
                          <span>•</span>
                          <span className="flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            {new Date(article.publishedAt).toLocaleDateString()}
                          </span>
                          <span>•</span>
                          <span className="flex items-center">
                            <Tag className="w-3 h-3 mr-1" />
                            {article.category}
                          </span>
                          <span>•</span>
                          <span>{article.views || 0} views</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(article.status || 'published')}`}>
                            {(article.status || 'published').charAt(0).toUpperCase() + (article.status || 'published').slice(1)}
                          </span>
                          {article.tags && article.tags.length > 0 && (
                            <span className="text-xs text-gray-500">
                              {article.tags.slice(0, 2).join(', ')}
                              {article.tags.length > 2 && ` +${article.tags.length - 2} more`}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => handleReviewArticle(article)}
                          className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteArticle(article.id!)}
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            </div>
          )}

          {/* Pagination */}
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-700">
                Showing 1 to {filteredArticles.length} of {filteredArticles.length} results
              </p>
              <div className="flex space-x-2">
                <button className="px-3 py-1 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50">
                  Previous
                </button>
                <button className="px-3 py-1 bg-[#5E8BA8] text-white rounded text-sm hover:bg-[#4A6F8C] transition-colors">
                  1
                </button>
                <button className="px-3 py-1 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50">
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Review Modal */}
        {showReviewModal && selectedArticle && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
              {/* Modal Header */}
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Article Review</h2>
                <button
                  onClick={closeReviewModal}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                <div className="space-y-6">
                  {/* Article Header */}
                  <div className="border border-gray-200 rounded-xl overflow-hidden">
                    <div className="p-6 border-b border-gray-100">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-2xl font-bold text-gray-900 mb-3 leading-tight">
                            {selectedArticle.title}
                          </h3>
                          {selectedArticle.summary && (
                            <p className="text-gray-600 text-lg leading-relaxed">{selectedArticle.summary}</p>
                          )}
                        </div>
                        {selectedArticle.imageUrl && (
                          <div className="ml-6 flex-shrink-0">
                            <img
                              src={selectedArticle.imageUrl}
                              alt="Article preview"
                              className="w-40 h-32 object-cover rounded-lg shadow-sm"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                          </div>
                        )}
                      </div>
                      
                      {/* Article Meta */}
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                        {selectedArticle.journalistName && (
                          <span className="flex items-center">
                            <User className="w-4 h-4 mr-1" />
                            {selectedArticle.journalistName}
                          </span>
                        )}
                        <span className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {new Date(selectedArticle.publishedAt).toLocaleDateString()}
                        </span>
                        {selectedArticle.region && (
                          <span className="flex items-center">
                            <Tag className="w-4 h-4 mr-1" />
                            {selectedArticle.region}
                          </span>
                        )}
                        <span>{selectedArticle.views || 0} views</span>
                      </div>
                    </div>
                    
                    {/* Tags */}
                    {selectedArticle.tags && selectedArticle.tags.length > 0 && (
                      <div className="p-6 bg-gray-50">
                        <div className="flex flex-wrap gap-2">
                          {selectedArticle.tags.map((tag, index) => (
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
                    
                    {/* Article Content */}
                    {selectedArticle.content && (
                      <div className="p-6 border-t border-gray-100">
                        <h4 className="text-lg font-semibold text-gray-900 mb-4">Article Content</h4>
                        <div 
                          className="prose prose-sm max-w-none"
                          dangerouslySetInnerHTML={{ __html: selectedArticle.content }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
                <button
                  onClick={closeReviewModal}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
