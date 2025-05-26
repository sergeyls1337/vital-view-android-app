
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
      const { data, error } = await supabase
        .from('user_data')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
        throw error;
      }
      
      return data ? JSON.parse(data.data) : {};
    } catch (error) {
      console.error('Error fetching user data:', error);
      return {};
    }
  },

  async saveUserData(userId: string, data: UserData): Promise<void> {
    try {
      const { error } = await supabase
        .from('user_data')
        .upsert({
          user_id: userId,
          data: JSON.stringify(data),
          updated_at: new Date().toISOString()
        });
      
      if (error) throw error;
    } catch (error) {
      console.error('Error saving user data:', error);
      throw error;
    }
  },

  async clearUserData(userId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('user_data')
        .delete()
        .eq('user_id', userId);
      
      if (error) throw error;
    } catch (error) {
      console.error('Error clearing user data:', error);
      throw error;
    }
  }
};
