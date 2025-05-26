
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { dataService } from '@/services/dataService';

export const useUserSpecificData = (dataKey: string, defaultValue: any = null) => {
  const { user } = useAuth();
  const [data, setData] = useState(defaultValue);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setData(defaultValue);
      setLoading(false);
      return;
    }

    const loadData = async () => {
      try {
        const userData = await dataService.getUserData(user.id);
        setData(userData[dataKey] || defaultValue);
      } catch (error) {
        console.error(`Error loading ${dataKey}:`, error);
        setData(defaultValue);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user, dataKey, defaultValue]);

  const updateData = async (newData: any) => {
    if (!user) return;

    try {
      const userData = await dataService.getUserData(user.id);
      userData[dataKey] = newData;
      await dataService.saveUserData(user.id, userData);
      setData(newData);
    } catch (error) {
      console.error(`Error updating ${dataKey}:`, error);
    }
  };

  return { data, updateData, loading };
};
