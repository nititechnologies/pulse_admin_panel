'use client';

import { User, Menu } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

interface HeaderProps {
  onToggleSidebar: () => void;
  title: string;
}

export default function Header({ onToggleSidebar, title }: HeaderProps) {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/auth');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <header className="bg-white border-b border-[#DCDCDC] h-16 flex items-center justify-between px-6 shadow-sm">
      {/* Left side */}
      <div className="flex items-center space-x-4">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-lg hover:bg-[#F0F0F0] transition-colors"
        >
          <Menu className="w-5 h-5 text-[#323232]" />
        </button>
        
        <div>
          <h1 className="text-xl font-semibold text-[#323232]">{title}</h1>
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
        {/* Profile Button */}
        <div className="relative">
          <button 
            onClick={() => router.push('/profile')}
            className="flex items-center space-x-3 p-2 rounded-lg hover:bg-[#F0F0F0] transition-colors"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-[#323232] to-black rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-medium text-[#323232]">Pulse</span>
          </button>
        </div>
      </div>
    </header>
  );
}
