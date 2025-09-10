'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type Role = 'guest' | 'user' | 'admin' | undefined;

const RoleContext = createContext<{
  role: Role;
  setRole: (role: Role) => void;
  realRole: Role;
  setRealRole: (role: Role) => void;
  permissions: any;
  userId: string | null;
  setUserId: (id: string | null) => void;
  isLoading: boolean;
}>({
  role: undefined,
  setRole: () => {},
  realRole: undefined,
  setRealRole: () => {},
  permissions: {},
  userId: null,
  setUserId: () => {},
  isLoading: true,
});

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [role, setRoleState] = useState<Role>(undefined);
  const [realRole, setRealRoleState] = useState<Role>(undefined);
  const [userId, setUserIdState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load from localStorage on mount
  useEffect(() => {
    const storedRole = localStorage.getItem('role') as Role;
    const storedRealRole = localStorage.getItem('realRole') as Role;
    const storedUserId = localStorage.getItem('userId') || localStorage.getItem('guestId') || localStorage.getItem('adminId');
    
    if (storedRole) setRoleState(storedRole);
    if (storedRealRole) setRealRoleState(storedRealRole);
    if (storedUserId) setUserIdState(storedUserId);
    
    setIsLoading(false);
  }, []);


  // Save to localStorage on change
  useEffect(() => {
    if (role) localStorage.setItem('role', role);
    else localStorage.removeItem('role');
  }, [role]);
  
  useEffect(() => {
    if (realRole) localStorage.setItem('realRole', realRole);
    else localStorage.removeItem('realRole');
  }, [realRole]);
  
  useEffect(() => {
    if (userId) {
      // Store in appropriate localStorage key based on role
      if (role === 'guest') localStorage.setItem('guestId', userId);
      else if (role === 'admin') localStorage.setItem('adminId', userId);
      else localStorage.setItem('userId', userId);
    } else {
      localStorage.removeItem('userId');
      localStorage.removeItem('guestId');
      localStorage.removeItem('adminId');
    }
  }, [userId, role]);

  // Admin superpower: realRole stays 'admin', role can be switched
  const setRole = (newRole: Role) => {
    if (realRole === 'admin' && newRole !== 'admin') {
      setRoleState(newRole);
    } else {
      setRoleState(newRole);
      setRealRoleState(newRole);
    }
  };

  const setUserId = (id: string | null) => {
    setUserIdState(id);
  };

  // Example permissions logic
  const permissions = {
    canView: !!role,
    canDownload: role === 'user' || role === 'admin',
    canUpload: role === 'user' || role === 'admin',
    canCreateFolder: role === 'user' || role === 'admin',
    canDelete: role === 'admin',
    canManageUsers: role === 'admin',
  };

  return (
    <RoleContext.Provider value={{ 
      role, 
      setRole, 
      realRole, 
      setRealRole: setRealRoleState, 
      permissions, 
      userId, 
      setUserId, 
      isLoading 
    }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  return useContext(RoleContext);
}
