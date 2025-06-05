
import { useState, useEffect } from "react";
import { DailyActivity, ActivityType } from "@/types/activity";
import { toast } from "@/hooks/use-toast";

export const useActivityData = () => {
  const [isTracking, setIsTracking] = useState(false);
  const [activities, setActivities] = useState<DailyActivity[]>([]);
  const [stepsGoal, setStepsGoal] = useState(10000);
  const [newSteps, setNewSteps] = useState("");
  const [newStepsGoal, setNewStepsGoal] = useState("10000");
  const [selectedActivityType, setSelectedActivityType] = useState<ActivityType>("walking");
  
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

  useEffect(() => {
    // Load activities from localStorage
    const savedActivities = localStorage.getItem("activityData");
    if (savedActivities) {
      const parsedActivities = JSON.parse(savedActivities);
      
      // Check if we need to create a new day entry
      const todayDateString = getTodayDateString();
      const todayActivity = parsedActivities.find((a: DailyActivity) => a.date === todayDateString);
      
      if (!todayActivity) {
        // Create new entry for today with zero steps
        const newTodayActivity = {
          date: todayDateString,
          steps: 0,
          distance: 0,
          calories: 0,
          duration: 0
        };
        const updatedActivities = [...parsedActivities, newTodayActivity];
        setActivities(updatedActivities);
        localStorage.setItem("activityData", JSON.stringify(updatedActivities));
      } else {
        setActivities(parsedActivities);
      }
    } else {
      // Create initial activity for today
      const todayDateString = getTodayDateString();
      const initialActivity = {
        date: todayDateString,
        steps: 0,
        distance: 0,
        calories: 0,
        duration: 0
      };
      setActivities([initialActivity]);
      localStorage.setItem("activityData", JSON.stringify([initialActivity]));
    }
    
    // Load user's custom goal from localStorage
    const savedGoal = localStorage.getItem("stepsGoal");
    if (savedGoal) {
      setStepsGoal(parseInt(savedGoal));
    }
  }, []);
  
  const getCurrentActivity = () => {
    const todayDateString = getTodayDateString();
    const todayActivity = activities.find(a => a.date === todayDateString);
    return todayActivity || { steps: 0, distance: 0, calories: 0, duration: 0, date: todayDateString };
  };
  
  const currentActivity = getCurrentActivity();
  const stepsProgress = Math.min(100, Math.round((currentActivity.steps / stepsGoal) * 100));
  
  const updateCurrentActivity = (updatedSteps: number) => {
    const todayDateString = getTodayDateString();
    const distance = +(updatedSteps * 0.0007).toFixed(1);
    const calories = Math.round(updatedSteps * 0.04);
    const duration = Math.round(updatedSteps * 0.01);
    
    const updatedActivity = {
      date: todayDateString,
      steps: updatedSteps,
      distance,
      calories,
      duration,
    };
    
    // Find and update today's activity or add new one
    const updatedActivities = [...activities];
    const todayIndex = updatedActivities.findIndex(a => a.date === todayDateString);
    
    if (todayIndex >= 0) {
      updatedActivities[todayIndex] = updatedActivity;
    } else {
      updatedActivities.push(updatedActivity);
    }
    
    setActivities(updatedActivities);
    localStorage.setItem("activityData", JSON.stringify(updatedActivities));
  };

  const handleIncreaseSteps = () => {
    const newStepsCount = Math.max(0, currentActivity.steps + 100);
    updateCurrentActivity(newStepsCount);
    toast({
      title: "Steps increased",
      description: `Added 100 steps. Total: ${newStepsCount.toLocaleString()}`,
    });
  };

  const handleDecreaseSteps = () => {
    const newStepsCount = Math.max(0, currentActivity.steps - 100);
    updateCurrentActivity(newStepsCount);
    toast({
      title: "Steps decreased",
      description: `Removed 100 steps. Total: ${newStepsCount.toLocaleString()}`,
    });
  };
  
  const handleAddActivity = () => {
    if (!newSteps || isNaN(Number(newSteps))) {
      toast({
        title: "Invalid steps",
        description: "Please enter a valid number",
        variant: "destructive"
      });
      return;
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
    updateCurrentActivity(newTotalSteps);
    
    setNewSteps("");
    
    toast({
      title: "Activity added",
      description: `Added ${steps} steps from ${selectedActivityType} to today's total`,
    });
    
    return true;
  };
  
  const handleUpdateGoal = () => {
    if (!newStepsGoal || isNaN(Number(newStepsGoal))) {
      toast({
        title: "Invalid goal",
        description: "Please enter a valid number",
        variant: "destructive"
      });
      return false;
    }
    
    const goal = parseInt(newStepsGoal);
    setStepsGoal(goal);
    localStorage.setItem("stepsGoal", String(goal));
    
    toast({
      title: "Goal updated",
      description: `Your daily steps goal is now ${goal.toLocaleString()} steps`,
    });
    
    return true;
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
