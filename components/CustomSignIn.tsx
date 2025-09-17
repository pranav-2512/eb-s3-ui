'use client';

import React, { useState } from 'react';
import { SignIn, useUser } from '@clerk/nextjs';
import RoleSelector from './RoleSelector';
import { useRole } from '@/contexts/RoleContext';

export default function CustomSignIn() {
  const { isSignedIn } = useUser();
  const { role, setRole } = useRole();
  const [showRoleSelector, setShowRoleSelector] = useState(false);

  // If user is signed in, show role selector
  if (isSignedIn && role === 'guest' && !showRoleSelector) {
    setShowRoleSelector(true);
  }

  const handleRoleSelect = (selectedRole: 'guest' | 'user') => {
    setRole(selectedRole);
    setShowRoleSelector(false);
  };

  if (showRoleSelector) {
    return <RoleSelector onRoleSelect={handleRoleSelect} />;
  }

  return (
    <div className="grid place-items-center flex-1">
      <SignIn routing="hash" />
    </div>
  );
}
