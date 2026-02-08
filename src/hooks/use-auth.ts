'use client';

import { useState, useEffect, useCallback } from 'react';

const ADMIN_KEY_STORAGE = 'keymaster_admin_key';

export const useAuth = () => {
  const [adminKey, setAdminKey] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storedKey = window.localStorage.getItem(ADMIN_KEY_STORAGE);
      if (storedKey) {
        setAdminKey(storedKey);
      }
    } catch (error) {
      console.error('Failed to read admin key from localStorage', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveAdminKey = useCallback((key: string) => {
    try {
      window.localStorage.setItem(ADMIN_KEY_STORAGE, key);
      setAdminKey(key);
    } catch (error) {
      console.error('Failed to save admin key to localStorage', error);
    }
  }, []);

  const logout = useCallback(() => {
    try {
      window.localStorage.removeItem(ADMIN_KEY_STORAGE);
      setAdminKey(null);
    } catch (error) {
      console.error('Failed to remove admin key from localStorage', error);
    }
  }, []);

  return { adminKey, setAdminKey: saveAdminKey, logout, isLoading };
};
