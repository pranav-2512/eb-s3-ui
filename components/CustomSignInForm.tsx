'use client';

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Shield, Eye, ArrowLeft } from 'lucide-react';
import { useRole } from '@/contexts/RoleContext';
import { SignIn } from '@clerk/nextjs';

type LoginMode = 'selection' | 'guest' | 'user' | 'admin';

export default function CustomSignInForm() {
  const [mode, setMode] = useState<LoginMode>('selection');
  const [guestCredentials, setGuestCredentials] = useState({ username: 'guest', password: 'guest0000' });
  const [adminCredentials, setAdminCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const { role, setRole } = useRole();

  const handleGuestLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Guest login attempt:', guestCredentials);
    if (guestCredentials.username === 'guest' && guestCredentials.password === 'guest0000') {
      console.log('Guest credentials valid, setting role to guest');
      setRole('guest');
      setError('');
      // Force a page refresh to ensure the role change takes effect
      setTimeout(() => {
        window.location.reload();
      }, 100);
    } else {
      setError('Invalid guest credentials. Use: guest / guest0000');
    }
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const adminUsername = process.env.NEXT_PUBLIC_ADMIN_USERNAME || 'pranav2512';
    const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'pranav@210522';
    
    console.log('Admin login attempt:', adminCredentials);
    console.log('Expected credentials:', { adminUsername, adminPassword });
    
    if (adminCredentials.username === adminUsername && adminCredentials.password === adminPassword) {
      console.log('Admin credentials valid, setting role to admin');
      setRole('admin');
      setError('');
      // Force a page refresh to ensure the role change takes effect
      setTimeout(() => {
        window.location.reload();
      }, 100);
    } else {
      setError('Invalid admin credentials');
    }
  };

  const resetForm = () => {
    setMode('selection');
    setGuestCredentials({ username: '', password: '' });
    setAdminCredentials({ username: '', password: '' });
    setError('');
  };

  // If user already has a role set (guest or admin), don't show login form
  if (role === 'guest' || role === 'admin') {
    return null; // This will allow the main interface to show
  }

  if (mode === 'user') {
    return (
      <div className="grid place-items-center flex-1">
        <div className="w-full max-w-md">
          <div className="mb-4">
            <Button
              onClick={resetForm}
              variant="outline"
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Login Options
            </Button>
          </div>
          <SignIn routing="hash" />
        </div>
      </div>
    );
  }

  if (mode === 'selection') {
    return (
      <div className="grid place-items-center flex-1">
        <Card className="w-full max-w-2xl mx-4">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">
                Welcome to EB Cloud Storage
              </h2>
              <p className="text-slate-600 dark:text-slate-300">
                Choose your login method to access the storage system
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Guest Login */}
              <div
                className="p-6 border-2 border-blue-200 dark:border-blue-700 rounded-lg cursor-pointer 
                         hover:border-blue-300 dark:hover:border-blue-600 transition-all 
                         hover:bg-blue-50 dark:hover:bg-blue-900/20"
                onClick={() => setMode('guest')}
              >
                <div className="text-center">
                  <Eye className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-2">
                    Guest Access
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
                    View files without account
                  </p>
                  <ul className="text-xs text-slate-500 dark:text-slate-400 space-y-1">
                    <li>✅ View files</li>
                    <li>❌ Download files</li>
                    <li>❌ Upload files</li>
                    <li>❌ Create folders</li>
                  </ul>
                </div>
              </div>

              {/* User Login */}
              <div
                className="p-6 border-2 border-green-200 dark:border-green-700 rounded-lg cursor-pointer 
                         hover:border-green-300 dark:hover:border-green-600 transition-all 
                         hover:bg-green-50 dark:hover:bg-green-900/20"
                onClick={() => setMode('user')}
              >
                <div className="text-center">
                  <User className="w-12 h-12 text-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-2">
                    User Access
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
                    Full file management
                  </p>
                  <ul className="text-xs text-slate-500 dark:text-slate-400 space-y-1">
                    <li>✅ View files</li>
                    <li>✅ Download files</li>
                    <li>✅ Upload files</li>
                    <li>✅ Create folders</li>
                  </ul>
                </div>
              </div>

              {/* Admin Login */}
              <div
                className="p-6 border-2 border-purple-200 dark:border-purple-700 rounded-lg cursor-pointer 
                         hover:border-purple-300 dark:hover:border-purple-600 transition-all 
                         hover:bg-purple-50 dark:hover:bg-purple-900/20"
                onClick={() => setMode('admin')}
              >
                <div className="text-center">
                  <Shield className="w-12 h-12 text-purple-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-2">
                    Admin Access
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
                    Complete system control
                  </p>
                  <ul className="text-xs text-slate-500 dark:text-slate-400 space-y-1">
                    <li>✅ All permissions</li>
                    <li>✅ Delete files/folders</li>
                    <li>✅ Manage users</li>
                    <li>✅ System settings</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (mode === 'guest') {
    return (
      <div className="grid place-items-center flex-1">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="p-8">
            <div className="mb-6">
              <Button
                onClick={resetForm}
                variant="outline"
                className="flex items-center gap-2 mb-4"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Login Options
              </Button>
              <div className="text-center">
                <Eye className="w-16 h-16 text-blue-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">
                  Guest Login
                </h2>
                <p className="text-slate-600 dark:text-slate-300">
                  Enter guest credentials to view files
                </p>
              </div>
            </div>

            <form onSubmit={handleGuestLogin} className="space-y-4">
              <div>
                <Label htmlFor="guest-username">Username</Label>
                <Input
                  id="guest-username"
                  type="text"
                  value={guestCredentials.username}
                  onChange={(e) => setGuestCredentials({ ...guestCredentials, username: e.target.value })}
                  placeholder="Enter guest username"
                  required
                />
              </div>
              <div>
                <Label htmlFor="guest-password">Password</Label>
                <Input
                  id="guest-password"
                  type="password"
                  value={guestCredentials.password}
                  onChange={(e) => setGuestCredentials({ ...guestCredentials, password: e.target.value })}
                  placeholder="Enter guest password"
                  required
                />
              </div>
              {error && (
                <div className="text-red-500 text-sm text-center">{error}</div>
              )}
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                Login as Guest
              </Button>
              <Button 
                type="button"
                onClick={() => {
                  console.log('Quick guest login');
                  setRole('guest');
                  setError('');
                  setTimeout(() => {
                    window.location.reload();
                  }, 100);
                }}
                className="w-full mt-2 bg-green-600 hover:bg-green-700"
              >
                🚀 Quick Guest Access
              </Button>
            </form>

            <div className="mt-4 text-center text-xs text-slate-500">
              <p>Default credentials: guest / guest0000</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (mode === 'admin') {
    return (
      <div className="grid place-items-center flex-1">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="p-8">
            <div className="mb-6">
              <Button
                onClick={resetForm}
                variant="outline"
                className="flex items-center gap-2 mb-4"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Login Options
              </Button>
              <div className="text-center">
                <Shield className="w-16 h-16 text-purple-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">
                  Admin Login
                </h2>
                <p className="text-slate-600 dark:text-slate-300">
                  Enter admin credentials for full access
                </p>
              </div>
            </div>

            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div>
                <Label htmlFor="admin-username">Username</Label>
                <Input
                  id="admin-username"
                  type="text"
                  value={adminCredentials.username}
                  onChange={(e) => setAdminCredentials({ ...adminCredentials, username: e.target.value })}
                  placeholder="Enter admin username"
                  required
                />
              </div>
              <div>
                <Label htmlFor="admin-password">Password</Label>
                <Input
                  id="admin-password"
                  type="password"
                  value={adminCredentials.password}
                  onChange={(e) => setAdminCredentials({ ...adminCredentials, password: e.target.value })}
                  placeholder="Enter admin password"
                  required
                />
              </div>
              {error && (
                <div className="text-red-500 text-sm text-center">{error}</div>
              )}
              <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700">
                Login as Admin
              </Button>
            </form>

            <div className="mt-4 text-center text-xs text-slate-500">
              <p>Admin credentials are configured in environment variables</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
}
