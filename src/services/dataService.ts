
import { supabase } from '@/integrations/supabase/client';

interface UserData {
  activityData?: any;
  waterData?: any;
  sleepData?: any;
  weightData?: any;
  stepsGoal?: number;
}

export const dataService = {
  async getUserData(userId: string): Promise<UserData> {
    try {
      // For now, use localStorage as fallback until user_data table is available in types
      const localData = localStorage.getItem(`userData_${userId}`);
      if (localData) {
        return JSON.parse(localData);
      }
      return {};
    } catch (error) {
      console.error('Error fetching user data:', error);
      return {};
    }
  },

  async saveUserData(userId: string, data: UserData): Promise<void> {
    try {
      // For now, use localStorage until user_data table is available in types
      localStorage.setItem(`userData_${userId}`, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving user data:', error);
      throw error;
    }
  },

  async clearUserData(userId: string): Promise<void> {
    try {
      // Clear from localStorage
      localStorage.removeItem(`userData_${userId}`);
      
      // Also clear legacy localStorage data
      localStorage.removeItem("activityData");
      localStorage.removeItem("waterData");
      localStorage.removeItem("stepsGoal");
    } catch (error) {
      console.error('Error clearing user data:', error);
      throw error;
    }
  }
};
