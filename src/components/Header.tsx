'use client';

import { useState, useEffect, useRef } from 'react';
import { Bell, User, Menu, LogOut, Settings, FileText, DollarSign, Flag, Monitor } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

interface HeaderProps {
  onToggleSidebar: () => void;
  title: string;
}

export default function Header({ onToggleSidebar, title }: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();
  const notificationsRef = useRef<HTMLDivElement>(null);

  // Track read state of notifications
  const [readNotifications, setReadNotifications] = useState<Set<number>>(new Set());

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const notifications = [
    {
      id: 1,
      type: 'upload',
      title: 'New article uploaded: "Tech Trends 2024"',
      time: '2 minutes ago',
      icon: FileText,
      unread: true,
    },
    {
      id: 2,
      type: 'ad',
      title: 'New ad campaign submitted for approval',
      time: '15 minutes ago',
      icon: DollarSign,
      unread: true,
    },
    {
      id: 3,
      type: 'flagged',
      title: 'Article flagged by users for review',
      time: '1 hour ago',
      icon: Flag,
      unread: false,
    },
    {
      id: 4,
      type: 'system',
      title: 'System maintenance completed',
      time: '3 hours ago',
      icon: Monitor,
      unread: false,
    },
  ];

  // Handle notification click - mark as read
  const handleNotificationClick = (id: number) => {
    setReadNotifications(prev => new Set([...prev, id]));
  };

  // Calculate unread count
  const unreadCount = notifications.filter(n => !readNotifications.has(n.id)).length;

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/auth');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6 shadow-sm">
      {/* Left side */}
      <div className="flex items-center space-x-4">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <Menu className="w-5 h-5 text-gray-600" />
        </button>
        
        <div>
          <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
          <p className="text-sm text-gray-500">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center space-x-4">
        {/* Notifications */}
        <div className="relative" ref={notificationsRef}>
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-lg hover:bg-blue-50 transition-colors relative bg-[#9EC4D9] text-gray-700"
          >
            <Bell className="w-5 h-5 text-gray-700" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
            )}
          </button>
          
          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                <p className="text-sm text-gray-500">
                  {unreadCount === 0 ? 'No unread notifications' : `${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}`}
                </p>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {notifications.map((notification) => {
                  const Icon = notification.icon;
                  const isUnread = !readNotifications.has(notification.id);
                  return (
                    <div 
                      key={notification.id} 
                      onClick={() => handleNotificationClick(notification.id)}
                      className="p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-start space-x-3">
                        <div className="p-2 bg-gray-100 rounded-lg">
                          <Icon className="w-4 h-4 text-gray-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                          <p className="text-sm text-gray-500">{notification.time}</p>
                        </div>
                        {isUnread && (
                          <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Profile Button */}
        <div className="relative">
          <button 
            onClick={() => router.push('/profile')}
            className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="w-8 h-8 bg-[#5E8BA8] rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-medium text-gray-900">Pulse</span>
          </button>
        </div>
      </div>
    </header>
  );
}
