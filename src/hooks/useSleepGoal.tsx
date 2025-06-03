
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export const useSleepGoal = () => {
  const { user } = useAuth();
  const [sleepGoal, setSleepGoal] = useState(8); // Default 8 hours

  useEffect(() => {
    if (user) {
      const saved = localStorage.getItem(`sleepGoal_${user.id}`);
      if (saved) {
        setSleepGoal(parseFloat(saved));
      }
    }
  }, [user]);

  const updateSleepGoal = (newGoal: number) => {
    setSleepGoal(newGoal);
    if (user) {
      localStorage.setItem(`sleepGoal_${user.id}`, newGoal.toString());
    }
  };

  return {
    sleepGoal,
    updateSleepGoal
  };
};
