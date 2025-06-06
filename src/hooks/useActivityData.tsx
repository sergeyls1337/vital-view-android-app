import { useState, useEffect } from "react";
import { DailyActivity, ActivityType } from "@/types/activity";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export const useActivityData = () => {
  const { user } = useAuth();
  const [isTracking, setIsTracking] = useState(false);
  const [activities, setActivities] = useState<DailyActivity[]>([]);
  const [stepsGoal, setStepsGoal] = useState(10000);
  const [newSteps, setNewSteps] = useState("");
  const [newStepsGoal, setNewStepsGoal] = useState("10000");
  const [selectedActivityType, setSelectedActivityType] = useState<ActivityType>("walking");
  const [loading, setLoading] = useState(true);
  
  // Helper function to get today's date string
  const getTodayDateString = () => {
    const today = new Date();
    return today.toISOString().split('T')[0]; // YYYY-MM-DD format
  };

  // Helper function to get day name from date
  const getDayName = (dateString: string) => {
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

  // Load user preferences
  const loadUserPreferences = async () => {
    if (!user) return;
    
    try {
      console.log("Loading user preferences for user:", user.id);
      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading user preferences:', error);
        return;
      }

      if (data) {
        console.log("Loaded user preferences:", data);
        setStepsGoal(data.steps_goal);
        setNewStepsGoal(data.steps_goal.toString());
      } else {
        console.log("Creating default preferences for new user");
        // Create default preferences for new user
        await supabase
          .from('user_preferences')
          .upsert({
            user_id: user.id,
            steps_goal: 10000,
            water_goal: 2000,
            sleep_goal: 8.0
          });
      }
    } catch (error) {
      console.error('Error loading user preferences:', error);
    }
  };

  // Load activities from Supabase
  const loadActivities = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      console.log("Loading activities for user:", user.id);
      const { data, error } = await supabase
        .from('activity_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (error) {
        console.error('Error loading activities:', error);
        setLoading(false);
        return;
      }

      console.log("Loaded activities:", data);
      const formattedActivities: DailyActivity[] = data.map(entry => ({
        date: entry.date,
        steps: entry.steps,
        distance: entry.distance,
        calories: entry.calories,
        duration: entry.duration
      }));

      setActivities(formattedActivities);

      // Ensure today's entry exists
      const todayDateString = getTodayDateString();
      const todayActivity = formattedActivities.find(a => a.date === todayDateString);
      
      if (!todayActivity) {
        await createTodayActivity();
      }
    } catch (error) {
      console.error('Error loading activities:', error);
    } finally {
      setLoading(false);
    }
  };

  // Create today's activity entry
  const createTodayActivity = async () => {
    if (!user) return;

    const todayDateString = getTodayDateString();
    
    try {
      const { data, error } = await supabase
        .from('activity_entries')
        .upsert({
          user_id: user.id,
          date: todayDateString,
          steps: 0,
          distance: 0,
          calories: 0,
          duration: 0
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating today activity:', error);
        return;
      }

      const newActivity: DailyActivity = {
        date: data.date,
        steps: data.steps,
        distance: data.distance,
        calories: data.calories,
        duration: data.duration
      };

      setActivities(prev => [newActivity, ...prev.filter(a => a.date !== todayDateString)]);
    } catch (error) {
      console.error('Error creating today activity:', error);
    }
  };

  useEffect(() => {
    if (user) {
      loadUserPreferences();
      loadActivities();
    } else {
      setActivities([]);
      setLoading(false);
    }
  }, [user]);

  const getCurrentActivity = () => {
    const todayDateString = getTodayDateString();
    const todayActivity = activities.find(a => a.date === todayDateString);
    return todayActivity || { steps: 0, distance: 0, calories: 0, duration: 0, date: todayDateString };
  };
  
  const currentActivity = getCurrentActivity();
  const stepsProgress = Math.min(100, Math.round((currentActivity.steps / stepsGoal) * 100));
  
  const updateCurrentActivity = async (updatedSteps: number) => {
    if (!user) return false;

    const todayDateString = getTodayDateString();
    const distance = +(updatedSteps * 0.0007).toFixed(1);
    const calories = Math.round(updatedSteps * 0.04);
    const duration = Math.round(updatedSteps * 0.01);
    
    try {
      console.log("Updating activity entry:", {
        user_id: user.id,
        date: todayDateString,
        steps: updatedSteps,
        distance,
        calories,
        duration
      });
      
      const { data, error } = await supabase
        .from('activity_entries')
        .upsert({
          user_id: user.id,
          date: todayDateString,
          steps: updatedSteps,
          distance,
          calories,
          duration
        })
        .select()
        .single();

      if (error) {
        console.error('Error updating activity:', error);
        return false;
      }

      console.log("Activity updated successfully:", data);
      const updatedActivity: DailyActivity = {
        date: data.date,
        steps: data.steps,
        distance: data.distance,
        calories: data.calories,
        duration: data.duration
      };

      setActivities(prev => [
        updatedActivity,
        ...prev.filter(a => a.date !== todayDateString)
      ]);
      
      return true;
    } catch (error) {
      console.error('Error updating activity:', error);
      return false;
    }
  };

  const handleIncreaseSteps = async () => {
    const newStepsCount = Math.max(0, currentActivity.steps + 100);
    await updateCurrentActivity(newStepsCount);
    toast({
      title: "Steps increased",
      description: `Added 100 steps. Total: ${newStepsCount.toLocaleString()}`,
    });
  };

  const handleDecreaseSteps = async () => {
    const newStepsCount = Math.max(0, currentActivity.steps - 100);
    await updateCurrentActivity(newStepsCount);
    toast({
      title: "Steps decreased",
      description: `Removed 100 steps. Total: ${newStepsCount.toLocaleString()}`,
    });
  };
  
  const handleAddActivity = async () => {
    if (!newSteps || isNaN(Number(newSteps))) {
      toast({
        title: "Invalid steps",
        description: "Please enter a valid number",
        variant: "destructive"
      });
      return false;
    }
    
    const steps = parseInt(newSteps);
    
    // Calculate approximate values based on steps and activity type
    let distance = +(steps * 0.0007).toFixed(1); // km
    let calories = Math.round(steps * 0.04); // kcal
    let duration = Math.round(steps * 0.01); // minutes
    
    // Adjust calculations based on activity type
    if (selectedActivityType === "running") {
      distance = +(steps * 0.0009).toFixed(1);
      calories = Math.round(steps * 0.06);
      duration = Math.round(steps * 0.008);
    } else if (selectedActivityType === "cycling") {
      distance = +(steps * 0.003).toFixed(1);
      calories = Math.round(steps * 0.05);
      duration = Math.round(steps * 0.015);
    }
    
    // Add to today's total
    const newTotalSteps = currentActivity.steps + steps;
    console.log("Adding activity, new total steps:", newTotalSteps);
    const success = await updateCurrentActivity(newTotalSteps);
    
    if (success) {
      setNewSteps("");
      
      toast({
        title: "Activity added",
        description: `Added ${steps} steps from ${selectedActivityType} to today's total`,
      });
      
      return true;
    } else {
      toast({
        title: "Error adding steps",
        description: "Failed to update activity data",
        variant: "destructive"
      });
      return false;
    }
  };
  
  const handleUpdateGoal = async () => {
    if (!newStepsGoal || isNaN(Number(newStepsGoal)) || !user) {
      toast({
        title: "Invalid goal",
        description: "Please enter a valid number",
        variant: "destructive"
      });
      return false;
    }
    
    const goal = parseInt(newStepsGoal);
    
    try {
      const { error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: user.id,
          steps_goal: goal
        });

      if (error) {
        console.error('Error updating steps goal:', error);
        toast({
          title: "Error",
          description: "Failed to update goal",
          variant: "destructive"
        });
        return false;
      }

      setStepsGoal(goal);
      
      toast({
        title: "Goal updated",
        description: `Your daily steps goal is now ${goal.toLocaleString()} steps`,
      });
      
      return true;
    } catch (error) {
      console.error('Error updating steps goal:', error);
      return false;
    }
  };
  
  const getWeeklyActivities = () => {
    const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const today = new Date();
    const currentDayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const mondayOffset = currentDayOfWeek === 0 ? -6 : 1 - currentDayOfWeek;
    
    return weekdays.map((day, index) => {
      const date = new Date(today);
      date.setDate(today.getDate() + mondayOffset + index);
      const dateString = date.toISOString().split('T')[0];
      
      const activity = activities.find(a => a.date === dateString);
      const steps = activity ? activity.steps : 0;
      const heightPercent = Math.min(90, Math.max(10, Math.round((steps / stepsGoal) * 100)));
      const isToday = dateString === getTodayDateString();
      
      return { day, steps, heightPercent, isToday, date: dateString };
    });
  };

  const getRecentActivities = () => {
    // Return the most recent 7 days of activities, sorted by date descending
    return [...activities]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 7)
      .map(activity => ({
        ...activity,
        day: getDayName(activity.date)
      }));
  };

  const getCurrentWeekStats = () => {
    const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const today = new Date();
    const currentDayOfWeek = today.getDay();
    const mondayOffset = currentDayOfWeek === 0 ? -6 : 1 - currentDayOfWeek;
    
    return weekdays.map((day, index) => {
      const date = new Date(today);
      date.setDate(today.getDate() + mondayOffset + index);
      const dateString = date.toISOString().split('T')[0];
      
      const activity = activities.find(a => a.date === dateString);
      
      return {
        day,
        date: dateString,
        steps: activity ? activity.steps : 0,
        calories: activity ? activity.calories : 0,
        distance: activity ? activity.distance : 0,
        duration: activity ? activity.duration : 0
      };
    });
  };

  // Get statistics for longer periods
  const getMonthlyStats = () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    return activities.filter(activity => {
      const activityDate = new Date(activity.date);
      return activityDate.getMonth() === currentMonth && activityDate.getFullYear() === currentYear;
    });
  };

  const getAllTimeStats = () => {
    const totalSteps = activities.reduce((sum, activity) => sum + activity.steps, 0);
    const totalDistance = activities.reduce((sum, activity) => sum + activity.distance, 0);
    const totalCalories = activities.reduce((sum, activity) => sum + activity.calories, 0);
    const activeDays = activities.filter(activity => activity.steps > 0).length;
    
    return {
      totalSteps,
      totalDistance,
      totalCalories,
      activeDays,
      averageStepsPerDay: activeDays > 0 ? Math.round(totalSteps / activeDays) : 0
    };
  };

  return {
    isTracking,
    setIsTracking,
    activities,
    stepsGoal,
    newSteps,
    setNewSteps,
    newStepsGoal,
    setNewStepsGoal,
    selectedActivityType,
    setSelectedActivityType,
    currentActivity,
    stepsProgress,
    loading,
    handleAddActivity,
    handleUpdateGoal,
    handleIncreaseSteps,
    handleDecreaseSteps,
    getWeeklyActivities,
    getRecentActivities,
    getCurrentWeekStats,
    getMonthlyStats,
    getAllTimeStats
  };
};
