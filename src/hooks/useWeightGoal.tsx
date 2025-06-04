
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export const useWeightGoal = () => {
  const { user } = useAuth();
  const [goalWeight, setGoalWeight] = useState(70); // Default goal

  useEffect(() => {
    if (user) {
      const saved = localStorage.getItem(`weightGoal_${user.id}`);
      if (saved) {
        setGoalWeight(parseFloat(saved));
      }
    }
  }, [user]);

  const updateGoalWeight = (newGoal: number) => {
    setGoalWeight(newGoal);
    if (user) {
      localStorage.setItem(`weightGoal_${user.id}`, newGoal.toString());
    }
  };

  return {
    goalWeight,
    updateGoalWeight
  };
};
