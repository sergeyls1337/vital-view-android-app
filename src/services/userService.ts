
import { supabase } from '@/integrations/supabase/client';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  height?: number;
  weight?: number;
  age?: number;
  gender?: string;
  goalWeight?: number;
  goalSleep?: number;
  goalSteps?: number;
  goalWater?: number;
}

export const userService = {
  currentUser: null as User | null,

  async login(email: string, password: string): Promise<User> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw error;
    
    const user = await this.getCurrentUser();
    if (!user) throw new Error("Failed to get user data");
    
    return user;
  },

  async logout(): Promise<void> {
    await supabase.auth.signOut();
    this.currentUser = null;
  },

  async getCurrentUser(): Promise<User | null> {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      
      if (!authUser) {
        this.currentUser = null;
        return null;
      }

      // Get profile data from the profiles table
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (profile) {
        this.currentUser = {
          id: profile.id,
          name: profile.full_name || profile.username,
          email: authUser.email || '',
          height: 175,
          weight: 75,
          age: 30,
          gender: "Not specified",
          goalWeight: 70,
          goalSleep: 8,
          goalSteps: 10000,
          goalWater: 2.5,
        };
      }

      return this.currentUser;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  },

  async updateProfile(updates: Partial<User>): Promise<User> {
    const currentUser = await this.getCurrentUser();
    if (!currentUser) throw new Error("No user logged in");
    
    // Update profile in Supabase
    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: updates.name,
        updated_at: new Date().toISOString(),
      })
      .eq('id', currentUser.id);

    if (error) throw error;

    const updatedUser = { ...currentUser, ...updates };
    this.currentUser = updatedUser;
    
    return updatedUser;
  }
};
