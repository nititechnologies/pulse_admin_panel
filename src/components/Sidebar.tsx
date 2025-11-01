'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  Newspaper, 
  Megaphone, 
  ChevronDown,
  ChevronRight,
  Upload,
  Settings,
  Plus,
  Users,
  UserCheck
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export default function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const [expandedNews, setExpandedNews] = useState(true);
  const [expandedAds, setExpandedAds] = useState(true);
  const [expandedUsers, setExpandedUsers] = useState(true);

  const isActive = (path: string) => pathname === path;

  const menuItems = [
    {
      id: 'home',
      label: 'Home',
      icon: Home,
      path: '/',
    },
    {
      id: 'news',
      label: 'News',
      icon: Newspaper,
      path: '/news',
      submenu: [
        { label: 'Upload News', path: '/news/upload', icon: Upload },
        { label: 'Manage News', path: '/news/manage', icon: Settings },
      ],
    },
    {
      id: 'ads',
      label: 'Ads',
      icon: Megaphone,
      path: '/ads',
      submenu: [
        { label: 'Create Ad', path: '/ads/create', icon: Plus },
        { label: 'Manage Ads', path: '/ads/manage', icon: Settings },
      ],
    },
    {
      id: 'users',
      label: 'Manage Users',
      icon: UserCheck,
      path: '/users',
      submenu: [
        { label: 'All Users', path: '/users', icon: Users },
      ],
    },
  ];

  return (
    <div className={`fixed left-0 top-0 h-full bg-white border-r border-slate-200 transition-all duration-300 z-50 ${
      isOpen ? 'w-64' : 'w-16'
    }`}>
      {/* Logo */}
      <div className="flex items-center justify-center h-16 px-4 border-b border-slate-200 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 via-purple-500 to-cyan-500 rounded-lg flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-sm">P</span>
          </div>
          {isOpen && (
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">PULSE</span>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="mt-6 px-3">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const hasSubmenu = item.submenu && item.submenu.length > 0;
            const isExpanded = item.id === 'news' ? expandedNews : 
                             item.id === 'ads' ? expandedAds : 
                             item.id === 'users' ? expandedUsers : false;

            // Check if any submenu item is active
            const hasActiveSubmenu = hasSubmenu && item.submenu?.some(subItem => isActive(subItem.path));
            // Parent is only active if path matches AND no submenu item is active
            const isParentActive = hasSubmenu ? (isActive(item.path) && !hasActiveSubmenu) : isActive(item.path);

            return (
              <div key={item.id}>
                {hasSubmenu ? (
                  <div
                    className={`flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg cursor-pointer transition-colors ${
                      isParentActive
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md'
                        : 'text-slate-700 hover:bg-blue-50 hover:text-blue-600'
                    }`}
                    onClick={() => {
                      if (item.id === 'news') {
                        setExpandedNews(!expandedNews);
                      } else if (item.id === 'ads') {
                        setExpandedAds(!expandedAds);
                      } else if (item.id === 'users') {
                        setExpandedUsers(!expandedUsers);
                      }
                    }}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className="w-5 h-5" />
                      {isOpen && <span>{item.label}</span>}
                    </div>
                    {isOpen && (
                      <div>
                        {isExpanded ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href={item.path}
                    className={`flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      isActive(item.path)
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md'
                        : 'text-slate-700 hover:bg-blue-50 hover:text-blue-600'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className="w-5 h-5" />
                      {isOpen && <span>{item.label}</span>}
                    </div>
                  </Link>
                )}

                {/* Submenu */}
                {hasSubmenu && isExpanded && isOpen && (
                  <div className="ml-6 mt-1 space-y-1">
                    {item.submenu.map((subItem) => {
                      const SubIcon = subItem.icon;
                      return (
                        <Link
                          key={subItem.path}
                          href={subItem.path}
                          className={`flex items-center space-x-3 px-3 py-2 text-sm rounded-lg transition-colors ${
                            isActive(subItem.path)
                              ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md'
                              : 'text-slate-600 hover:bg-blue-50 hover:text-blue-600'
                          }`}
                        >
                          <SubIcon className="w-4 h-4" />
                          <span>{subItem.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </nav>

      {/* User info */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-200 bg-gradient-to-r from-blue-50 to-purple-50">
        {isOpen && (
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-md">
              <Users className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-800">Admin User</p>
              <p className="text-xs text-slate-500">admin@pulse.com</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
