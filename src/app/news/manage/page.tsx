'use client';

import { useState, useEffect, useRef } from 'react';
import Layout from '@/components/Layout';
import { getArticles, deleteArticle, Article } from '@/lib/articles';
import { Search, Trash2, Eye, Calendar, User, Tag, ChevronDown, Check, FileText, Globe, X } from 'lucide-react';

export default function ManageNewsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const categoryDropdownRef = useRef<HTMLDivElement>(null);
  const statusDropdownRef = useRef<HTMLDivElement>(null);
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
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'removed':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'draft':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <Layout title="Manage News">
      <div className="max-w-7xl mx-auto space-y-6 pb-8">
        {/* Header */}
        <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 rounded-xl p-5 shadow-lg text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px] opacity-40"></div>
          <div className="relative z-10">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/20 backdrop-blur-md rounded-lg shadow-md border border-white/30">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Manage News Articles</h1>
                <p className="text-blue-100 text-xs">Edit, delete, and organize your articles</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-200 bg-gradient-to-br from-slate-50 to-white">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Search className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-800">Filters</h2>
                <p className="text-xs text-slate-500">Search and filter your articles</p>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search */}
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search articles..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-slate-800 bg-white"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div>
                <div className="relative" ref={categoryDropdownRef}>
                  <button
                    type="button"
                    onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-left flex items-center justify-between text-sm transition-all duration-200"
                  >
                    <span className="text-slate-800">
                      {selectedCategory === 'all' ? 'All Categories' : selectedCategory}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isCategoryDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {isCategoryDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden">
                      <button
                        key="all"
                        onClick={() => { setSelectedCategory('all'); setIsCategoryDropdownOpen(false); }}
                        className="w-full px-4 py-3 text-left text-slate-800 hover:bg-blue-50 transition-colors flex items-center justify-between border-b border-slate-100"
                      >
                        <span>All Categories</span>
                        {selectedCategory === 'all' && <Check className="w-4 h-4 text-blue-600" />}
                      </button>
                      {categoryOptions.filter(opt => opt !== 'all').map((category) => (
                        <button
                          key={category}
                          onClick={() => { setSelectedCategory(category); setIsCategoryDropdownOpen(false); }}
                          className="w-full px-4 py-3 text-left text-slate-800 hover:bg-blue-50 transition-colors flex items-center justify-between border-b border-slate-100 last:border-b-0"
                        >
                          <span>{category}</span>
                          {selectedCategory === category && <Check className="w-4 h-4 text-blue-600" />}
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
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-left flex items-center justify-between text-sm transition-all duration-200"
                  >
                    <span className="text-slate-800">
                      {statusOptions.find(opt => opt.value === selectedStatus)?.label || 'All Status'}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isStatusDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {isStatusDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden">
                      {statusOptions.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => { setSelectedStatus(option.value); setIsStatusDropdownOpen(false); }}
                          className="w-full px-4 py-3 text-left text-slate-800 hover:bg-blue-50 transition-colors flex items-center justify-between border-b border-slate-100 last:border-b-0"
                        >
                          <span>{option.label}</span>
                          {selectedStatus === option.value && <Check className="w-4 h-4 text-blue-600" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Articles List */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-200 bg-gradient-to-br from-slate-50 to-white">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-800">Articles</h2>
                <p className="text-xs text-slate-500">
                  {filteredArticles.length} {filteredArticles.length === 1 ? 'article' : 'articles'} found
                </p>
              </div>
            </div>
          </div>
          
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-sm text-slate-600">Loading articles...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-sm text-red-600 mb-4">{error}</p>
              <button 
                onClick={fetchArticles}
                className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium shadow-md"
              >
                Try Again
              </button>
            </div>
          ) : filteredArticles.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-sm text-slate-600 mb-2">No articles found</p>
              <p className="text-xs text-slate-500">Create your first article to get started</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-br from-slate-50 to-white border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Article
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Author
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Published
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {filteredArticles.map((article) => (
                    <tr 
                      key={article.id} 
                      onClick={() => handleReviewArticle(article)}
                      className="hover:bg-blue-50/50 transition-colors cursor-pointer"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-12 w-12">
                            <img
                              className="h-12 w-12 rounded-xl object-cover ring-2 ring-blue-100 shadow-sm"
                              src={article.imageUrl}
                              alt={article.title}
                              onError={(e) => {
                                e.currentTarget.src = 'https://via.placeholder.com/48x48?text=No+Image';
                              }}
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-semibold text-slate-800 max-w-xs truncate">
                              {article.title}
                            </div>
                            <div className="text-xs text-slate-500 mt-0.5">
                              {article.views || 0} views
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800">
                        {article.journalistName || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800">
                        {new Date(article.publishedAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {article.tags && article.tags.length > 0 ? (
                          <span className="inline-flex items-center px-2.5 py-1 bg-blue-100 text-blue-800 rounded-lg text-xs font-medium">
                            {article.tags[0]}
                          </span>
                        ) : (
                          <span className="text-xs text-slate-400">No Category</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(article.status || 'published')}`}>
                            {(article.status || 'published').charAt(0).toUpperCase() + (article.status || 'published').slice(1)}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleStatus(article.id!, article.status || 'published');
                            }}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white ${
                              (article.status || 'published') === 'published' 
                                ? 'bg-emerald-500 focus:ring-emerald-500' 
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
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View Article"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteArticle(article.id!);
                            }}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete Article"
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
          <div className="px-6 py-4 border-t border-slate-200 bg-gradient-to-br from-slate-50 to-white">
            <div className="flex items-center justify-between">
              <p className="text-xs text-slate-600">
                Showing 1 to {filteredArticles.length} of {filteredArticles.length} results
              </p>
              <div className="flex space-x-2">
                <button className="px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 hover:bg-white transition-colors font-medium">
                  Previous
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors shadow-md font-medium">
                  1
                </button>
                <button className="px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 hover:bg-white transition-colors font-medium">
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Review Modal */}
        {showReviewModal && selectedArticle && (
          <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
              {/* Modal Header */}
              <div className="p-6 border-b border-slate-200 bg-gradient-to-br from-slate-50 to-white flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Eye className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-800">Article Review</h2>
                    <p className="text-xs text-slate-500">Review article details</p>
                  </div>
                </div>
                <button
                  onClick={closeReviewModal}
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-8 overflow-y-auto max-h-[calc(90vh-160px)]">
                <div className="space-y-6">
                  {/* Article Header */}
                  <div className="border border-slate-200 rounded-xl overflow-hidden bg-gradient-to-br from-slate-50 to-white">
                    {/* Featured Image */}
                    {selectedArticle.imageUrl && (
                      <div className="w-full h-64 bg-slate-200 overflow-hidden">
                        <img
                          src={selectedArticle.imageUrl}
                          alt="Article preview"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                    
                    <div className="p-6">
                      <div className="mb-6">
                        <h3 className="text-2xl font-bold text-slate-900 mb-4 leading-tight">
                          {selectedArticle.title}
                        </h3>
                        {selectedArticle.summary && (
                          <p className="text-gray-600 text-base leading-relaxed mb-6">{selectedArticle.summary}</p>
                        )}
                        
                        {/* Article Meta */}
                        <div className="flex flex-wrap items-center gap-5 text-sm text-gray-600 pt-4 border-t border-gray-200">
                          {selectedArticle.journalistName && (
                            <span className="flex items-center font-medium">
                              <User className="w-4 h-4 mr-2 text-blue-600" />
                              {selectedArticle.journalistName}
                            </span>
                          )}
                          <span className="flex items-center">
                            <Calendar className="w-4 h-4 mr-2 text-blue-600" />
                            {new Date(selectedArticle.publishedAt).toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}
                          </span>
                          {selectedArticle.region && (
                            <span className="flex items-center">
                              <Globe className="w-4 h-4 mr-2 text-blue-600" />
                              {selectedArticle.region}
                            </span>
                          )}
                          <span className="text-slate-500">{selectedArticle.views || 0} views</span>
                        </div>
                      </div>
                      
                      {/* Tags */}
                      {selectedArticle.tags && selectedArticle.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-6">
                          {selectedArticle.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="px-4 py-1.5 bg-blue-100 text-blue-800 rounded-lg text-sm font-medium border border-blue-200"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                      
                      {/* Article Content */}
                      {selectedArticle.content && (
                        <div className="pt-6 border-t border-gray-200">
                          <div 
                            className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-blue-600 prose-strong:text-gray-900"
                            dangerouslySetInnerHTML={{ __html: selectedArticle.content }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-6 border-t border-slate-200 bg-gradient-to-br from-slate-50 to-white flex justify-end space-x-3">
                <button
                  onClick={closeReviewModal}
                  className="px-5 py-2 border border-slate-200 rounded-lg text-slate-700 hover:bg-white transition-colors text-sm font-medium shadow-sm"
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
