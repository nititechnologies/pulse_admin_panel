'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '@/components/Layout';
import { getArticles, deleteArticle, updateArticle, Article } from '@/lib/articles';
import { Search, Trash2, Eye, Calendar, User, Tag, ChevronDown, Check, FileText, Globe, X, ArrowUp, ArrowDown, ArrowUpDown } from 'lucide-react';
import { Timestamp } from 'firebase/firestore';

export default function ManageNewsPage() {
  const router = useRouter();
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
  
  // Sorting state
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

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

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const newStatus: 'published' | 'removed' = currentStatus === 'published' ? 'removed' : 'published';
    try {
      await updateArticle(id, { status: newStatus });
      setArticles(prevArticles => 
        prevArticles.map(article => 
          article.id === id 
            ? { ...article, status: newStatus }
            : article
        )
      );
    } catch (error) {
      console.error('Error updating article status:', error);
      alert('Failed to update article status');
    }
  };

  const handleReviewArticle = (article: Article) => {
    if (article.id) {
      router.push(`/news/${article.id}`);
    }
  };

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.journalistName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || 
                           (article.tags && article.tags.some(tag => tag.toLowerCase() === selectedCategory.toLowerCase()));
    const matchesStatus = selectedStatus === 'all' || article.status === selectedStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Sorting function
  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('desc');
    }
  };

  // Apply sorting
  const sortedArticles = [...filteredArticles].sort((a, b) => {
    if (!sortColumn) return 0;
    
    let aValue: string | number;
    let bValue: string | number;
    
    switch (sortColumn) {
      case 'title':
        aValue = a.title.toLowerCase();
        bValue = b.title.toLowerCase();
        break;
      case 'author':
        aValue = (a.journalistName || '').toLowerCase();
        bValue = (b.journalistName || '').toLowerCase();
        break;
      case 'published':
        try {
          // Handle Firestore Timestamp
          const aPublishedAt = a.publishedAt as string | Timestamp | undefined;
          const bPublishedAt = b.publishedAt as string | Timestamp | undefined;
          
          if (aPublishedAt && typeof aPublishedAt === 'object' && 'toDate' in aPublishedAt) {
            aValue = (aPublishedAt as Timestamp).toDate().getTime();
          } else if (aPublishedAt && typeof aPublishedAt === 'object' && 'toMillis' in aPublishedAt) {
            aValue = (aPublishedAt as Timestamp).toMillis();
          } else if (aPublishedAt) {
            aValue = new Date(aPublishedAt as string).getTime();
          } else {
            aValue = 0;
          }
          
          if (bPublishedAt && typeof bPublishedAt === 'object' && 'toDate' in bPublishedAt) {
            bValue = (bPublishedAt as Timestamp).toDate().getTime();
          } else if (bPublishedAt && typeof bPublishedAt === 'object' && 'toMillis' in bPublishedAt) {
            bValue = (bPublishedAt as Timestamp).toMillis();
          } else if (bPublishedAt) {
            bValue = new Date(bPublishedAt as string).getTime();
          } else {
            bValue = 0;
          }
        } catch (error) {
          aValue = 0;
          bValue = 0;
        }
        break;
      case 'category':
        aValue = (a.category || (a.tags && a.tags[0] ? a.tags[0] : '')).toLowerCase();
        bValue = (b.category || (b.tags && b.tags[0] ? b.tags[0] : '')).toLowerCase();
        break;
      case 'status':
        aValue = (a.status || 'published').toLowerCase();
        bValue = (b.status || 'published').toLowerCase();
        break;
      case 'views':
        aValue = a.views || 0;
        bValue = b.views || 0;
        break;
      case 'likes':
        aValue = a.likes || 0;
        bValue = b.likes || 0;
        break;
      case 'region':
        // Handle both regions array and single region for backward compatibility
        const aRegions = a.regions && a.regions.length > 0 ? a.regions : (a.region ? [a.region] : []);
        const bRegions = b.regions && b.regions.length > 0 ? b.regions : (b.region ? [b.region] : []);
        aValue = aRegions.length > 0 ? aRegions[0].toLowerCase() : '';
        bValue = bRegions.length > 0 ? bRegions[0].toLowerCase() : '';
        break;
      default:
        return 0;
    }
    
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const getSortIcon = (column: string) => {
    if (sortColumn !== column) {
      return <ArrowUpDown className="w-3 h-3 ml-1 text-slate-400" />;
    }
    return sortDirection === 'asc' 
      ? <ArrowUp className="w-3 h-3 ml-1 text-blue-600" />
      : <ArrowDown className="w-3 h-3 ml-1 text-blue-600" />;
  };

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

        {/* Articles Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
          {/* Header with Filters */}
          <div className="p-4 border-b border-slate-200 bg-gradient-to-br from-slate-50 to-white">
            <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-1.5 bg-blue-100 rounded-lg">
                  <FileText className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-800">Articles</h2>
                  <p className="text-xs text-slate-500">
                    {sortedArticles.length} {sortedArticles.length === 1 ? 'article' : 'articles'}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Filters Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              {/* Search */}
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search articles..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm text-slate-800 bg-white"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div>
                <div className="relative" ref={categoryDropdownRef}>
                  <button
                    type="button"
                    onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-left flex items-center justify-between text-xs transition-all duration-200"
                  >
                    <span className="text-slate-800 truncate">
                      {selectedCategory === 'all' ? 'All Categories' : selectedCategory}
                    </span>
                    <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform flex-shrink-0 ml-1 ${isCategoryDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {isCategoryDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-xl z-50 overflow-hidden max-h-60 overflow-y-auto">
                      <button
                        key="all"
                        onClick={() => { setSelectedCategory('all'); setIsCategoryDropdownOpen(false); }}
                        className="w-full px-3 py-2 text-left text-slate-800 hover:bg-blue-50 transition-colors flex items-center justify-between border-b border-slate-100 text-xs"
                      >
                        <span>All Categories</span>
                        {selectedCategory === 'all' && <Check className="w-3 h-3 text-blue-600" />}
                      </button>
                      {categoryOptions.filter(opt => opt !== 'all').map((category) => (
                        <button
                          key={category}
                          onClick={() => { setSelectedCategory(category); setIsCategoryDropdownOpen(false); }}
                          className="w-full px-3 py-2 text-left text-slate-800 hover:bg-blue-50 transition-colors flex items-center justify-between border-b border-slate-100 last:border-b-0 text-xs"
                        >
                          <span>{category}</span>
                          {selectedCategory === category && <Check className="w-3 h-3 text-blue-600" />}
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
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-left flex items-center justify-between text-xs transition-all duration-200"
                  >
                    <span className="text-slate-800 truncate">
                      {statusOptions.find(opt => opt.value === selectedStatus)?.label || 'All Status'}
                    </span>
                    <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform flex-shrink-0 ml-1 ${isStatusDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {isStatusDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-xl z-50 overflow-hidden">
                      {statusOptions.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => { setSelectedStatus(option.value); setIsStatusDropdownOpen(false); }}
                          className="w-full px-3 py-2 text-left text-slate-800 hover:bg-blue-50 transition-colors flex items-center justify-between border-b border-slate-100 last:border-b-0 text-xs"
                        >
                          <span>{option.label}</span>
                          {selectedStatus === option.value && <Check className="w-3 h-3 text-blue-600" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
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
          ) : sortedArticles.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-sm text-slate-600 mb-2">No articles found</p>
              <p className="text-xs text-slate-500">Create your first article to get started</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th 
                      className="px-4 py-2.5 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors"
                      onClick={() => handleSort('title')}
                    >
                      <div className="flex items-center">
                        Article
                        {getSortIcon('title')}
                      </div>
                    </th>
                    <th 
                      className="px-4 py-2.5 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors"
                      onClick={() => handleSort('author')}
                    >
                      <div className="flex items-center">
                        Author
                        {getSortIcon('author')}
                      </div>
                    </th>
                    <th 
                      className="px-4 py-2.5 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors"
                      onClick={() => handleSort('published')}
                    >
                      <div className="flex items-center">
                        Published
                        {getSortIcon('published')}
                      </div>
                    </th>
                    <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Tags
                    </th>
                    <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Regions
                    </th>
                    <th 
                      className="px-4 py-2.5 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors"
                      onClick={() => handleSort('status')}
                    >
                      <div className="flex items-center">
                        Status
                        {getSortIcon('status')}
                      </div>
                    </th>
                    <th 
                      className="px-4 py-2.5 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors"
                      onClick={() => handleSort('views')}
                    >
                      <div className="flex items-center">
                        Views
                        {getSortIcon('views')}
                      </div>
                    </th>
                    <th 
                      className="px-4 py-2.5 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors"
                      onClick={() => handleSort('likes')}
                    >
                      <div className="flex items-center">
                        Likes
                        {getSortIcon('likes')}
                      </div>
                    </th>
                    <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Dislikes
                    </th>
                    <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Bookmarks
                    </th>
                    <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-100">
                  {sortedArticles.map((article) => (
                    <tr 
                      key={article.id} 
                      onClick={() => handleReviewArticle(article)}
                      className="hover:bg-blue-50/30 transition-colors cursor-pointer group"
                    >
                      <td className="px-4 py-2.5 whitespace-nowrap">
                        <div className="flex items-center gap-2.5">
                          <div className="flex-shrink-0 h-9 w-9">
                            <img
                              className="h-9 w-9 rounded-lg object-cover ring-1 ring-slate-200"
                              src={article.imageUrl}
                              alt={article.title}
                              onError={(e) => {
                                e.currentTarget.src = 'https://via.placeholder.com/36x36?text=No+Image';
                              }}
                            />
                          </div>
                          <div className="min-w-0 flex-1 max-w-[200px]">
                            <div className="text-xs font-semibold text-slate-800 truncate group-hover:text-blue-600 transition-colors">
                              {article.title}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-2.5 whitespace-nowrap">
                        <div className="text-xs text-slate-700 truncate max-w-[120px]">
                          {article.journalistName && article.journalistName.trim() !== '' ? article.journalistName : 'N/A'}
                        </div>
                      </td>
                      <td className="px-4 py-2.5 whitespace-nowrap">
                        <div className="text-xs text-slate-700">
                          {(() => {
                            try {
                              let date: Date;
                              if (!article.publishedAt) {
                                return '—';
                              }
                              // Handle Firestore Timestamp
                              const publishedAt = article.publishedAt as string | Timestamp | undefined;
                              if (publishedAt && typeof publishedAt === 'object' && 'toDate' in publishedAt) {
                                date = (publishedAt as Timestamp).toDate();
                              } 
                              // Handle Timestamp with toMillis
                              else if (publishedAt && typeof publishedAt === 'object' && 'toMillis' in publishedAt) {
                                date = new Date((publishedAt as Timestamp).toMillis());
                              }
                              // Handle string or number
                              else {
                                date = new Date(article.publishedAt);
                              }
                              
                              // Check if date is valid
                              if (isNaN(date.getTime())) {
                                return '—';
                              }
                              
                              return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                            } catch (error) {
                              console.error('Error parsing publishedAt:', article.publishedAt, error);
                              return '—';
                            }
                          })()}
                        </div>
                      </td>
                      <td className="px-4 py-2.5">
                        <div className="flex flex-wrap gap-1.5 max-w-[250px]">
                          {article.tags && article.tags.length > 0 ? (
                            article.tags.map((tag, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-2.5 py-1 bg-blue-100 text-blue-800 rounded-md text-xs font-medium border border-blue-200 shadow-sm"
                              >
                                {tag}
                              </span>
                            ))
                          ) : article.category ? (
                            <span className="inline-flex items-center px-2.5 py-1 bg-blue-100 text-blue-800 rounded-md text-xs font-medium border border-blue-200 shadow-sm">
                              {article.category}
                            </span>
                          ) : (
                            <span className="text-xs text-slate-400">—</span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-2.5">
                        <div className="flex flex-wrap gap-1.5 max-w-[200px]">
                          {article.regions && article.regions.length > 0 ? (
                            article.regions.map((region, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-2.5 py-1 bg-green-100 text-green-800 rounded-md text-xs font-medium border border-green-200 shadow-sm"
                              >
                                {region}
                              </span>
                            ))
                          ) : article.region ? (
                            <span className="inline-flex items-center px-2.5 py-1 bg-green-100 text-green-800 rounded-md text-xs font-medium border border-green-200 shadow-sm">
                              {article.region}
                            </span>
                          ) : (
                            <span className="text-xs text-slate-400">—</span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-2.5 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${getStatusColor(article.status || 'published')}`}>
                            {(article.status || 'published').charAt(0).toUpperCase() + (article.status || 'published').slice(1)}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleStatus(article.id!, article.status || 'published');
                            }}
                            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-white ${
                              (article.status || 'published') === 'published' 
                                ? 'bg-emerald-500 focus:ring-emerald-500' 
                                : 'bg-slate-300 focus:ring-slate-400'
                            }`}
                          >
                            <span
                              className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform shadow-sm ${
                                (article.status || 'published') === 'published' ? 'translate-x-5' : 'translate-x-0.5'
                              }`}
                            />
                          </button>
                        </div>
                      </td>
                      <td className="px-4 py-2.5 whitespace-nowrap">
                        <div className="text-xs font-medium text-slate-700">
                          {(article.views || 0).toLocaleString()}
                        </div>
                      </td>
                      <td className="px-4 py-2.5 whitespace-nowrap">
                        <div className="text-xs font-medium text-slate-700">
                          {(article.likes || 0).toLocaleString()}
                        </div>
                      </td>
                      <td className="px-4 py-2.5 whitespace-nowrap">
                        <div className="text-xs font-medium text-slate-700">
                          {(article.dislikes || 0).toLocaleString()}
                        </div>
                      </td>
                      <td className="px-4 py-2.5 whitespace-nowrap">
                        <div className="text-xs font-medium text-slate-700">
                          {(article.bookmarkCount || 0).toLocaleString()}
                        </div>
                      </td>
                      <td className="px-4 py-2.5 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleReviewArticle(article);
                            }}
                            className="p-1.5 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                            title="View"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteArticle(article.id!);
                            }}
                            className="p-1.5 text-red-600 hover:bg-red-100 rounded transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Footer */}
          {sortedArticles.length > 0 && (
            <div className="px-4 py-3 border-t border-slate-200 bg-slate-50">
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-600">
                  Showing <span className="font-semibold">{sortedArticles.length}</span> of <span className="font-semibold">{articles.length}</span> articles
                </p>
              </div>
            </div>
          )}
        </div>

      </div>
    </Layout>
  );
}
