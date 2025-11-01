import Layout from '@/components/Layout';
import Link from 'next/link';
import { Newspaper, Upload, Settings, BarChart3 } from 'lucide-react';

export default function NewsPage() {
  const newsSections = [
    {
      title: 'Upload News',
      description: 'Create and publish new articles',
      icon: Upload,
      href: '/news/upload',
      color: 'blue',
    },
    {
      title: 'Manage News',
      description: 'Edit, delete, and organize existing articles',
      icon: Settings,
      href: '/news/manage',
      color: 'green',
    },
    {
      title: 'Analytics',
      description: 'View performance metrics and insights',
      icon: BarChart3,
      href: '/news/analytics',
      color: 'purple',
    },
  ];

  return (
    <Layout title="News Management">
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 shadow-lg text-white">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
              <Newspaper className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">News Management</h1>
              <p className="text-blue-100">Manage your news articles and content</p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total Articles</p>
                <p className="text-2xl font-bold text-slate-800 mt-1">1,234</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl">
                <Newspaper className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-sm font-medium text-emerald-600">+12%</span>
              <span className="text-sm text-slate-500 ml-2">from last month</span>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Published</p>
                <p className="text-2xl font-bold text-slate-800 mt-1">1,156</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-xl">
                <Upload className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-sm font-medium text-emerald-600">+8%</span>
              <span className="text-sm text-slate-500 ml-2">from last month</span>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total Views</p>
                <p className="text-2xl font-bold text-slate-800 mt-1">45,678</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-sm font-medium text-emerald-600">+23%</span>
              <span className="text-sm text-slate-500 ml-2">from last month</span>
            </div>
          </div>
        </div>

        {/* News Sections */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {newsSections.map((section, index) => {
            const Icon = section.icon;
            const colorConfig: Record<string, { bg: string; hoverBg: string; iconColor: string; border: string }> = {
              'blue': { bg: 'bg-blue-50', hoverBg: 'bg-blue-100', iconColor: 'text-blue-600', border: 'border-blue-300' },
              'green': { bg: 'bg-emerald-50', hoverBg: 'bg-emerald-100', iconColor: 'text-emerald-600', border: 'border-emerald-300' },
              'purple': { bg: 'bg-purple-50', hoverBg: 'bg-purple-100', iconColor: 'text-purple-600', border: 'border-purple-300' }
            };
            const config = colorConfig[section.color] || colorConfig['blue'];
            return (
              <Link
                key={index}
                href={section.href}
                className={`bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-lg transition-all duration-200 group hover:${config.border} hover:scale-[1.02]`}
              >
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-xl ${config.bg} group-hover:${config.hoverBg} transition-colors`}>
                    <Icon className={`w-6 h-6 ${config.iconColor}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-slate-800 group-hover:text-slate-900">
                      {section.title}
                    </h3>
                    <p className="text-sm text-slate-600 mt-1">
                      {section.description}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Recent Articles */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Recent Articles</h3>
          <div className="space-y-4">
            {[
              {
                title: 'Tech Trends 2024: What to Expect',
                author: 'John Doe',
                date: '2024-01-15',
                status: 'Published',
                views: '1,234',
              },
              {
                title: 'AI Revolution in Healthcare',
                author: 'Jane Smith',
                date: '2024-01-14',
                status: 'Published',
                views: '987',
              },
              {
                title: 'Sustainable Energy Solutions',
                author: 'Mike Johnson',
                date: '2024-01-13',
                status: 'Draft',
                views: '0',
              },
            ].map((article, index) => (
              <Link key={index} href="/news/manage" className="flex items-center justify-between p-4 border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-blue-300 transition-all">
                <div className="flex-1">
                  <h4 className="font-medium text-slate-800">{article.title}</h4>
                  <p className="text-sm text-slate-600">
                    By {article.author} • {article.date} • {article.views} views
                  </p>
                </div>
                <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                  article.status === 'Published' 
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                    : 'bg-amber-100 text-amber-800 border border-amber-200'
                }`}>
                  {article.status}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
