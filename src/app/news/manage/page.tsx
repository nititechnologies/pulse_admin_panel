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
    { value: 'removed', label: 'Removed' },
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

  const handleToggleStatus = (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'published' ? 'removed' : 'published';
    setArticles(prevArticles => 
      prevArticles.map(article => 
        article.id === id 
          ? { ...article, status: newStatus }
          : article
      )
    );
    console.log(`Article ${id} status updated to ${newStatus}`);
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
    const matchesCategory = selectedCategory === 'all' || 
                           (article.tags && article.tags.some(tag => tag.toLowerCase() === selectedCategory.toLowerCase()));
    const matchesStatus = selectedStatus === 'all' || article.status === selectedStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'removed':
        return 'bg-red-100 text-red-800';
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
        <div className="bg-white rounded-lg p-6 shadow-sm border border-[#DCDCDC]">
          <div>
            <h1 className="text-2xl font-bold text-[#323232]">Manage News Articles</h1>
            <p className="text-gray-600">Edit, delete, and organize your articles</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-[#DCDCDC]">
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
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-[#323232]"
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
                  <span className="text-[#323232]">
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
                  <span className="text-[#323232]">
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
        <div className="bg-white rounded-lg shadow-sm border border-[#DCDCDC]">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-[#323232]">
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
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Article
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Author
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Published
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredArticles.map((article) => (
                    <tr 
                      key={article.id} 
                      onClick={() => handleReviewArticle(article)}
                      className="hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <img
                              className="h-10 w-10 rounded-lg object-cover"
                              src={article.imageUrl}
                              alt={article.title}
                              onError={(e) => {
                                e.currentTarget.src = 'https://via.placeholder.com/40x40?text=No+Image';
                              }}
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-[#323232] max-w-xs truncate">
                              {article.title}
                            </div>
                            <div className="text-sm text-gray-500">
                              {article.views || 0} views
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {article.journalistName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(article.publishedAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {article.tags && article.tags.length > 0 ? article.tags[0] : 'No Category'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(article.status || 'published')}`}>
                            {(article.status || 'published').charAt(0).toUpperCase() + (article.status || 'published').slice(1)}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleStatus(article.id!, article.status || 'published');
                            }}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white ${
                              (article.status || 'published') === 'published' 
                                ? 'bg-green-500 focus:ring-green-500' 
                                : 'bg-red-500 focus:ring-red-500'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm ${
                                (article.status || 'published') === 'published' ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleReviewArticle(article);
                            }}
                            className="text-[#323232] hover:text-gray-600 transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteArticle(article.id!);
                            }}
                            className="text-red-600 hover:text-red-800 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-700">
                Showing 1 to {filteredArticles.length} of {filteredArticles.length} results
              </p>
              <div className="flex space-x-2">
                <button className="px-3 py-1 border border-[#DCDCDC] rounded text-sm text-[#323232] hover:bg-[#F0F0F0] transition-colors">
                  Previous
                </button>
                <button className="px-3 py-1 bg-gradient-to-r from-[#323232] to-black text-white rounded text-sm hover:from-black hover:to-[#323232] transition-colors">
                  1
                </button>
                <button className="px-3 py-1 border border-[#DCDCDC] rounded text-sm text-[#323232] hover:bg-[#F0F0F0] transition-colors">
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Review Modal */}
        {showReviewModal && selectedArticle && (
          <div className="fixed inset-0 backdrop-blur-xl flex items-center justify-center p-4 z-50">
          <div className="bg-gray-50 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
              {/* Modal Header */}
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-[#323232]">Article Review</h2>
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
                  <div className="border border-[#DCDCDC] rounded-xl overflow-hidden bg-white">
                    <div className="p-6 border-b border-gray-100">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-2xl font-bold text-[#323232] mb-3 leading-tight">
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
                              className="px-3 py-1 bg-white text-gray-700 rounded-full text-sm font-medium border border-[#DCDCDC]"
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
                        <h4 className="text-lg font-semibold text-[#323232] mb-4">Article Content</h4>
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
