'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { User2, ShieldCheck, Eye, LogIn } from 'lucide-react';
import { useRole } from '@/contexts/RoleContext';

type WelcomeMode = 'welcome' | 'guest' | 'user' | 'admin';

export default function WelcomeScreen() {
  const [mode, setMode] = useState<WelcomeMode>('welcome');
  const { setRole, setUserId } = useRole();
  const adminUserRef = useRef<HTMLInputElement>(null);
  const adminPassRef = useRef<HTMLInputElement>(null);
  const userUserRef = useRef<HTMLInputElement>(null);
  const userPassRef = useRef<HTMLInputElement>(null);

  const handleUserLogin = async () => {
    const username = userUserRef.current?.value || '';
    const password = userPassRef.current?.value || '';
    
    try {
      // Call API endpoint to validate user credentials
      const response = await fetch('/api/validate-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      
      const result = await response.json();
      
      if (result.valid) {
        setRole('user');
        setUserId(result.userId || 'user/user001');
        setTimeout(() => {
          window.location.reload();
        }, 100);
      } else {
        alert('Invalid user credentials');
      }
    } catch (error) {
      console.error('User login error:', error);
      alert('Failed to validate user credentials. Please try again.');
    }
  };

  const handleGuestLogin = () => {
    setRole('guest');
    setUserId('guest/guest000');
  };

  const handleAdminLogin = async () => {
    const username = adminUserRef.current?.value || '';
    const password = adminPassRef.current?.value || '';
    
    try {
      // Call API endpoint to validate admin credentials
      const response = await fetch('/api/validate-admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      
      const result = await response.json();
      
      if (result.valid) {
        setRole('admin');
        setUserId(result.adminId || 'admin/admin001');
        setTimeout(() => {
          window.location.reload();
        }, 100);
      } else {
        alert('Invalid admin credentials');
      }
    } catch (error) {
      console.error('Admin login error:', error);
      alert('Failed to validate admin credentials. Please try again.');
    }
  };

  // --- UI ---
  if (mode === 'welcome') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-100 to-pink-100 dark:from-[#0a1020] dark:via-[#181c2f] dark:to-[#2a1a3a] p-2">
        <div className="w-full max-w-3xl rounded-2xl shadow-xl bg-white/95 dark:bg-[#181c2f]/95 px-4 py-8 flex flex-col gap-6">
          <div className="text-center mb-1">
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-1">
              Welcome to <span className="text-purple-600 dark:text-purple-400">EB Cloud Storage</span>
            </h1>
            <p className="text-base md:text-lg text-slate-600 dark:text-slate-300 font-medium">
              Choose your access mode to get started
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Guest */}
            <div className="flex flex-col items-center rounded-xl border border-blue-200 dark:border-blue-700 bg-white/80 dark:bg-[#23263a]/80 shadow hover:shadow-lg transition-all hover:border-blue-400 dark:hover:border-blue-400 p-5 group">
              <Eye className="w-8 h-8 text-blue-600 dark:text-blue-400 mb-2 group-hover:scale-110 transition-transform" />
              <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-1">Guest</h3>
              <ul className="mb-4 space-y-0.5 text-xs text-center">
                <li className="flex items-center gap-1 justify-center">
                  <span className="text-green-500">✔</span> View files
                </li>
                <li className="flex items-center gap-1 justify-center">
                  <span className="text-red-400">✖</span> Download
                </li>
                <li className="flex items-center gap-1 justify-center">
                  <span className="text-red-400">✖</span> Upload
                </li>
                <li className="flex items-center gap-1 justify-center">
                  <span className="text-red-400">✖</span> Create folders
                </li>
              </ul>
              <Button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center justify-center gap-2 text-xs py-2"
                onClick={handleGuestLogin}
              >
                <LogIn className="w-4 h-4" /> Continue
              </Button>
            </div>
            {/* User */}
            <div className="flex flex-col items-center rounded-xl border border-green-200 dark:border-green-700 bg-white/80 dark:bg-[#23263a]/80 shadow hover:shadow-lg transition-all hover:border-green-400 dark:hover:border-green-400 p-5 group">
              <User2 className="w-8 h-8 text-green-600 dark:text-green-400 mb-2 group-hover:scale-110 transition-transform" />
              <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-1">User</h3>
              <ul className="mb-4 space-y-0.5 text-xs text-center">
                <li className="flex items-center gap-1 justify-center">
                  <span className="text-green-500">✔</span> View
                </li>
                <li className="flex items-center gap-1 justify-center">
                  <span className="text-green-500">✔</span> Download
                </li>
                <li className="flex items-center gap-1 justify-center">
                  <span className="text-green-500">✔</span> Upload
                </li>
                <li className="flex items-center gap-1 justify-center">
                  <span className="text-green-500">✔</span> Create folders
                </li>
              </ul>
              <Button
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold flex items-center justify-center gap-2 text-xs py-2"
                onClick={() => setMode('user')}
              >
                <LogIn className="w-4 h-4" /> Continue
              </Button>
            </div>
            {/* Admin */}
            <div className="flex flex-col items-center rounded-xl border border-purple-200 dark:border-purple-700 bg-white/80 dark:bg-[#23263a]/80 shadow hover:shadow-lg transition-all hover:border-purple-400 dark:hover:border-purple-400 p-5 group">
              <ShieldCheck className="w-8 h-8 text-purple-600 dark:text-purple-400 mb-2 group-hover:scale-110 transition-transform" />
              <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-1">Admin</h3>
              <ul className="mb-4 space-y-0.5 text-xs text-center">
                <li className="flex items-center gap-1 justify-center">
                  <span className="text-green-500">✔</span> All permissions
                </li>
                <li className="flex items-center gap-1 justify-center">
                  <span className="text-green-500">✔</span> Delete files/folders
                </li>
                <li className="flex items-center gap-1 justify-center">
                  <span className="text-green-500">✔</span> Manage users
                </li>
                <li className="flex items-center gap-1 justify-center">
                  <span className="text-green-500">✔</span> System settings
                </li>
              </ul>
              <Button
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold flex items-center justify-center gap-2 text-xs py-2"
                onClick={() => setMode('admin')}
              >
                <LogIn className="w-4 h-4" /> Continue
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (mode === 'user') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-100 to-pink-100 dark:from-[#0a1020] dark:via-[#181c2f] dark:to-[#2a1a3a] p-2">
        <div className="w-full max-w-xs rounded-xl shadow-xl bg-white/95 dark:bg-[#181c2f]/95 px-4 py-8 flex flex-col gap-4">
          <div className="flex flex-col items-center mb-2">
            <Image src="/Eb_Logo.png" alt="EB Logo" width={40} height={40} className="rounded-xl mb-2" />
            <User2 className="w-8 h-8 text-green-600 dark:text-green-400 mb-2" />
            <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-1">
              User Login
            </h2>
            <p className="text-slate-500 dark:text-slate-300 text-center text-xs">
              Enter your user credentials
            </p>
          </div>
          <input
            ref={userUserRef}
            type="text"
            placeholder="Username"
            className="w-full px-3 py-2 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent mb-2"
          />
          <input
            ref={userPassRef}
            type="password"
            placeholder="Password"
            className="w-full px-3 py-2 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent mb-3"
          />
          <Button
            onClick={handleUserLogin}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold flex items-center justify-center gap-2 py-2 text-base"
          >
            <LogIn className="w-4 h-4" /> Login as User
          </Button>
          <Button
            onClick={() => setMode('welcome')}
            variant="outline"
            className="w-full text-xs"
          >
            ← Back to Options
          </Button>
        </div>
      </div>
    );
  }

  if (mode === 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-100 to-pink-100 dark:from-[#0a1020] dark:via-[#181c2f] dark:to-[#2a1a3a] p-2">
        <div className="w-full max-w-xs rounded-xl shadow-xl bg-white/95 dark:bg-[#181c2f]/95 px-4 py-8 flex flex-col gap-4">
          <div className="flex flex-col items-center mb-2">
            <Image src="/Eb_Logo.png" alt="EB Logo" width={40} height={40} className="rounded-xl mb-2" />
            <ShieldCheck className="w-8 h-8 text-purple-600 dark:text-purple-400 mb-2" />
            <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-1">
              Admin Login
            </h2>
            <p className="text-slate-500 dark:text-slate-300 text-center text-xs">
              Enter your admin credentials
            </p>
          </div>
          <input
            ref={adminUserRef}
            type="text"
            placeholder="Username"
            className="w-full px-3 py-2 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent mb-2"
          />
          <input
            ref={adminPassRef}
            type="password"
            placeholder="Password"
            className="w-full px-3 py-2 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent mb-3"
          />
          <Button
            onClick={handleAdminLogin}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold flex items-center justify-center gap-2 py-2 text-base"
          >
            <LogIn className="w-4 h-4" /> Login as Admin
          </Button>
          <Button
            onClick={() => setMode('welcome')}
            variant="outline"
            className="w-full text-xs"
          >
            ← Back to Options
          </Button>
        </div>
      </div>
    );
  }

  return null;
}
