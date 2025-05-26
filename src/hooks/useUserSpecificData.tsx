
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { dataService } from '@/services/dataService';

interface UseUserSpecificDataProps<T> {
  dataKey: string;
  defaultValue: T;
}

export function useUserSpecificData<T>({ dataKey, defaultValue }: UseUserSpecificDataProps<T>) {
  const { user } = useAuth();
  const [data, setData] = useState<T>(defaultValue);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const loadData = async () => {
      try {
        const userData = await dataService.getUserData(user.id);
        const specificData = userData[dataKey as keyof typeof userData];
        setData(specificData || defaultValue);
      } catch (error) {
        console.error(`Error loading ${dataKey}:`, error);
        setData(defaultValue);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user, dataKey, defaultValue]);

  const saveData = async (newData: T) => {
    if (!user) return;

    try {
      const userData = await dataService.getUserData(user.id);
      userData[dataKey as keyof typeof userData] = newData;
      await dataService.saveUserData(user.id, userData);
      setData(newData);
    } catch (error) {
      console.error(`Error saving ${dataKey}:`, error);
    }
  };

  return { data, setData: saveData, loading };
}
