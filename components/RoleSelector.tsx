'use client';

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Eye } from 'lucide-react';

interface RoleSelectorProps {
  onRoleSelect: (role: 'guest' | 'user') => void;
}

export default function RoleSelector({ onRoleSelect }: RoleSelectorProps) {
  const [selectedRole, setSelectedRole] = useState<'guest' | 'user' | null>(null);
  const [showGuestMessage, setShowGuestMessage] = useState(false);

  const handleContinue = () => {
    if (selectedRole) {
      onRoleSelect(selectedRole);
    } else {
      // If nothing selected, default to guest and show message
      setShowGuestMessage(true);
      setTimeout(() => {
        onRoleSelect('guest');
      }, 2000);
    }
  };

  if (showGuestMessage) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <Card className="max-w-md mx-4">
          <CardContent className="p-8 text-center">
            <div className="mb-4">
              <Eye className="w-16 h-16 text-blue-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">
                Welcome as Guest!
              </h2>
              <p className="text-slate-600 dark:text-slate-300">
                We've kept you as a guest. Please enjoy your time and explore the project.
                You can view files but won't be able to download, upload, or create folders.
              </p>
            </div>
            <div className="animate-pulse">
              <p className="text-sm text-slate-500">Redirecting you in a moment...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="max-w-2xl mx-4">
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">
              Choose Your Access Level
            </h2>
            <p className="text-slate-600 dark:text-slate-300">
              Select how you'd like to access EB Cloud Storage
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Guest Option */}
            <div
              className={`p-6 border-2 rounded-lg cursor-pointer transition-all ${
                selectedRole === 'guest'
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
              }`}
              onClick={() => setSelectedRole('guest')}
            >
              <div className="text-center">
                <Eye className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-2">
                  Guest Access
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
                  View files and explore the project
                </p>
                <ul className="text-xs text-slate-500 dark:text-slate-400 space-y-1">
                  <li>✅ View files</li>
                  <li>❌ Download files</li>
                  <li>❌ Upload files</li>
                  <li>❌ Create folders</li>
                </ul>
              </div>
            </div>

            {/* User Option */}
            <div
              className={`p-6 border-2 rounded-lg cursor-pointer transition-all ${
                selectedRole === 'user'
                  ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                  : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
              }`}
              onClick={() => setSelectedRole('user')}
            >
              <div className="text-center">
                <User className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-2">
                  User Access
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
                  Full access to manage your files
                </p>
                <ul className="text-xs text-slate-500 dark:text-slate-400 space-y-1">
                  <li>✅ View files</li>
                  <li>✅ Download files</li>
                  <li>✅ Upload files</li>
                  <li>✅ Create folders</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="text-center">
            <Button
              onClick={handleContinue}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white"
            >
              Continue
            </Button>
            <p className="text-xs text-slate-500 mt-2">
              {selectedRole 
                ? `Selected: ${selectedRole === 'guest' ? 'Guest Access' : 'User Access'}`
                : 'Nothing selected? We\'ll set you as a guest automatically'
              }
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
