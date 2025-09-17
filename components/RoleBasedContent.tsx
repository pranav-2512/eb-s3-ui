'use client';

import React from 'react';
// import { SignedOut, SignedIn } from '@clerk/nextjs';
import { useRole } from '@/contexts/RoleContext';
import WelcomeScreen from './WelcomeScreen';

interface RoleBasedContentProps {
  children: React.ReactNode;
}

export default function RoleBasedContent({ children }: RoleBasedContentProps) {
  const { role, isLoading } = useRole();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-300">Loading...</p>
        </div>
      </div>
    );
  }

  // If user has a role, show the main content
  if (role && !isLoading) {
    return <main className="flex-1">{children}</main>;
  }

  // Show welcome screen for new users or when no role is set
  return <WelcomeScreen />;
}
