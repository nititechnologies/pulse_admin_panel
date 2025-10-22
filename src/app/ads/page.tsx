import Layout from '@/components/Layout';
import Link from 'next/link';
import { Megaphone, Plus, Settings, BarChart3 } from 'lucide-react';

export default function AdsPage() {
  const adsSections = [
    {
      title: 'Create Ad',
      description: 'Design and launch new advertising campaigns',
      icon: Plus,
      href: '/ads/create',
      color: 'blue',
    },
    {
      title: 'Manage Ads',
      description: 'Edit, pause, and organize existing campaigns',
      icon: Settings,
      href: '/ads/manage',
      color: 'green',
    },
  ];

  return (
    <Layout title="Ads Management">
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-green-50 rounded-lg">
              <Megaphone className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Ads Management</h1>
              <p className="text-gray-600">Manage your advertising campaigns and promotions</p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Campaigns</p>
                <p className="text-2xl font-bold text-gray-900">89</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <Megaphone className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-sm font-medium text-green-600">+23%</span>
              <span className="text-sm text-gray-500 ml-2">from last month</span>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Impressions</p>
                <p className="text-2xl font-bold text-gray-900">2.4M</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <BarChart3 className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-sm font-medium text-green-600">+18%</span>
              <span className="text-sm text-gray-500 ml-2">from last month</span>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Click-Through Rate</p>
                <p className="text-2xl font-bold text-gray-900">3.2%</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-sm font-medium text-green-600">+0.5%</span>
              <span className="text-sm text-gray-500 ml-2">from last month</span>
            </div>
          </div>
        </div>

        {/* Ads Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {adsSections.map((section, index) => {
            const Icon = section.icon;
            return (
              <Link
                key={index}
                href={section.href}
                className={`bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 group ${
                  section.color === 'blue' ? 'hover:border-blue-300' :
                  section.color === 'green' ? 'hover:border-green-300' :
                  'hover:border-purple-300'
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-lg ${
                    section.color === 'blue' ? 'bg-blue-50 group-hover:bg-blue-100' :
                    section.color === 'green' ? 'bg-green-50 group-hover:bg-green-100' :
                    'bg-purple-50 group-hover:bg-purple-100'
                  }`}>
                    <Icon className={`w-6 h-6 ${
                      section.color === 'blue' ? 'text-blue-600' :
                      section.color === 'green' ? 'text-green-600' :
                      'text-purple-600'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-gray-700">
                      {section.title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {section.description}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Recent Campaigns */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Campaigns</h3>
          <div className="space-y-4">
            {[
              {
                title: 'Summer Sale 2024',
                type: 'Banner Ad',
                status: 'Active',
                impressions: '125,000',
                clicks: '3,750',
                ctr: '3.0%',
                budget: '$5,000',
                spent: '$3,200',
              },
              {
                title: 'Tech Product Launch',
                type: 'Video Ad',
                status: 'Active',
                impressions: '89,000',
                clicks: '2,670',
                ctr: '3.0%',
                budget: '$8,000',
                spent: '$5,600',
              },
              {
                title: 'Holiday Promotion',
                type: 'Display Ad',
                status: 'Paused',
                impressions: '45,000',
                clicks: '1,350',
                ctr: '3.0%',
                budget: '$3,000',
                spent: '$1,800',
              },
            ].map((campaign, index) => (
              <Link key={index} href="/ads/manage" className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="font-medium text-gray-900">{campaign.title}</h4>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      campaign.status === 'Active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {campaign.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">Type:</span> {campaign.type}
                    </div>
                    <div>
                      <span className="font-medium">Impressions:</span> {campaign.impressions}
                    </div>
                    <div>
                      <span className="font-medium">Clicks:</span> {campaign.clicks}
                    </div>
                    <div>
                      <span className="font-medium">CTR:</span> {campaign.ctr}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">${campaign.spent}</p>
                  <p className="text-xs text-gray-500">of ${campaign.budget}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
