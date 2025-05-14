
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
  
  useEffect(() => {
    // Load activities from localStorage
    const savedActivities = localStorage.getItem("activityData");
    if (savedActivities) {
      setActivities(JSON.parse(savedActivities));
    } else {
      // Default activity if nothing is saved
      const today = new Date().toLocaleDateString('en-US', { weekday: 'short' });
      const initialActivity = {
        date: today,
        steps: 7384,
        distance: 5.2,
        calories: 326,
        duration: 47
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
    return activities.length > 0 ? activities[activities.length - 1] : { steps: 0, distance: 0, calories: 0, duration: 0, date: "" };
  };
  
  const currentActivity = getCurrentActivity();
  const stepsProgress = Math.min(100, Math.round((currentActivity.steps / stepsGoal) * 100));
  
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
    
    const today = new Date().toLocaleDateString('en-US', { weekday: 'short' });
    
    const newActivity = {
      date: today,
      steps,
      distance,
      calories,
      duration,
      activityType: selectedActivityType
    };
    
    const updatedActivities = [...activities, newActivity];
    setActivities(updatedActivities);
    localStorage.setItem("activityData", JSON.stringify(updatedActivities));
    
    setNewSteps("");
    
    toast({
      title: "Activity added",
      description: `Added ${steps} steps from ${selectedActivityType} to your activity log`,
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
    const today = new Date().getDay(); // 0 is Sunday
    const todayIndex = today === 0 ? 6 : today - 1; // Convert to 0-indexed Monday start
    
    return weekdays.map((day, index) => {
      const activity = activities.find(a => a.date === day);
      const steps = activity ? activity.steps : 0;
      const heightPercent = Math.min(90, Math.max(10, Math.round((steps / stepsGoal) * 100)));
      const isToday = index === todayIndex;
      
      return { day, steps, heightPercent, isToday };
    });
  };

  const getRecentActivities = () => {
    // Return the most recent 5 activities
    return [...activities].reverse().slice(0, 5);
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
    getWeeklyActivities,
    getRecentActivities
  };
};
