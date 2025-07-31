"use client";

import { useUserDataStore } from "@/lib/store";
import { useEffect, useState } from "react";

interface LocalStorageData {
  token: string | null;
  userData: {
    state: {
      user: {
        firstName: string;
        lastName: string;
        role: string;
        companyId?: string;
      };
    };
  } | null;
}

export default function AuthDebug() {
  const user = useUserDataStore((state) => state.user);
  const isLoggedIn = useUserDataStore((state) => state.isLoggedIn);
  const [localStorageData, setLocalStorageData] = useState<LocalStorageData | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user-data-storage');
    
    setLocalStorageData({
      token,
      userData: userData ? JSON.parse(userData) : null
    });
  }, [user, isLoggedIn]);

  if (process.env.NODE_ENV === 'production') return null;

  return (
    <div className="fixed bottom-4 right-4 bg-black text-white p-4 rounded-lg text-xs max-w-md z-50">
      <h3 className="font-bold mb-2">Auth Debug</h3>
      <div className="space-y-1">
        <div>isLoggedIn: {isLoggedIn ? 'true' : 'false'}</div>
        <div>User: {user ? `${user.firstName} ${user.lastName}` : 'null'}</div>
        <div>Role: {user?.role || 'null'}</div>
        <div>CompanyId: {user?.companyId || 'null'}</div>
        <div>Token: {localStorageData?.token ? 'exists' : 'null'}</div>
      </div>
    </div>
  );
} 