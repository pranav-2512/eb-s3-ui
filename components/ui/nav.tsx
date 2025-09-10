'use client'

import * as React from 'react';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import Link from 'next/link';
import { Moon, Sun } from 'lucide-react';
import { useRole } from '@/contexts/RoleContext';

const roleLabels = {
  guest: { label: 'Guest', color: 'bg-blue-100 text-blue-700' },
  user: { label: 'User', color: 'bg-green-100 text-green-700' },
  admin: { label: 'Admin', color: 'bg-purple-100 text-purple-700' },
};

const NavBar: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const { role, setRole, setUserId } = useRole();

  return (
    <nav className="glass sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side - Logo and Title */}
          <div className='flex items-center gap-5'>
            <Link 
              href="https://www.youtube.com/@engineeringbinod" 
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 hover:scale-105 transition-transform"
            >
              <div className="p-1 rounded-xl">
                <Image
                  src="/eb_logo.png"
                  alt="EB Logo"
                  width={64}
                  height={60}
                  className="rounded-lg"
                  priority
                />
              </div>
            </Link>
            <div className='flex flex-col'>
              <h1 className='font-bold text-xl text-slate-800 dark:text-white'>
                EB Cloud Storage
              </h1>
              <span className='text-sm text-slate-600 dark:text-white/80'>
                backed by AWS S3
              </span>
            </div>
          </div>
          {/* Right side - Theme Toggle, Role Display, and User Button */}
          <div className='flex items-center gap-3'>
            {/* Show current role */}
            {role && (
              <span className={`px-3 py-1 rounded-lg font-semibold text-xs ${roleLabels[role].color}`}>
                {roleLabels[role].label}
                {role === 'admin' && (
                  <span className="ml-2 font-normal text-xs text-purple-700">(magic powers)</span>
                )}
              </span>
            )}

            {/* Admin role switcher */}
            {role === 'admin' && (
              <div className="flex gap-1 ml-2">
                {(['guest', 'user', 'admin'] as const).map(r => (
                  <button
                    key={r}
                    onClick={() => setRole(r)}
                    className={`px-2 py-1 rounded text-xs font-medium border ${
                      role === r
                        ? 'bg-purple-600 text-white border-purple-700'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-purple-100'
                    }`}
                  >
                    {roleLabels[r].label}
                  </button>
                ))}
              </div>
            )}

            {/* Theme toggle */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2.5 rounded-lg glass hover:brightness-110 transition-all"
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5 text-white" />
              ) : (
                <Moon className="h-5 w-5 text-slate-700" />
              )}
            </button>

            {/* Login/Logout Button */}
            <div className="glass p-1.5 rounded-lg">
              {role ? (
                <button
                  className="px-3 py-1.5 rounded text-sm font-medium bg-slate-600 text-white hover:bg-slate-700 transition"
                  onClick={() => {
                    // Clear all user data on logout
                    setRole(undefined);
                    setUserId(null);
                    // Clear all localStorage items
                    localStorage.removeItem('role');
                    localStorage.removeItem('realRole');
                    localStorage.removeItem('userId');
                    localStorage.removeItem('guestId');
                    localStorage.removeItem('adminId');
                    // Reload to show welcome screen
                    window.location.reload();
                  }}
                >
                  Logout
                </button>
              ) : (
                <button
                  className="px-3 py-1.5 rounded text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition"
                  onClick={() => window.location.reload()}
                >
                  Login
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;