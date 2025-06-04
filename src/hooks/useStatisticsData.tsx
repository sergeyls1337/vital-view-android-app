
import { useState, useEffect } from 'react';
import { useActivityData } from './useActivityData';
import { useWaterData } from './useWaterData';
import { useSleepData } from './useSleepData';
import { useWeightData } from './useWeightData';
import { useWeightGoal } from './useWeightGoal';

export const useStatisticsData = () => {
  const { activities, getCurrentWeekStats } = useActivityData();
  const waterData = useWaterData();
  const { sleepEntries } = useSleepData();
  const { weightEntries, getCurrentWeight } = useWeightData();
  const { goalWeight } = useWeightGoal();

  const weekStats = getCurrentWeekStats();

  // Calculate trends (current week vs previous week)
  const getTrends = () => {
    const currentWeekSteps = weekStats.reduce((sum, day) => sum + day.steps, 0);
    const currentWeekWater = waterData.weeklyData.reduce((sum, day) => sum + day.amount, 0);
    const currentWeekSleep = sleepEntries.slice(0, 7).reduce((sum, entry) => sum + entry.hours, 0) / 7;
    const currentWeight = getCurrentWeight();

    // Mock previous week data for comparison (in real app, you'd track this)
    const previousWeekSteps = currentWeekSteps * 0.9;
    const previousWeekWater = currentWeekWater * 0.85;
    const previousWeekSleep = currentWeekSleep * 0.95;
    const previousWeight = currentWeight + 0.3;

    return [
      {
        metric: 'Steps',
        current: currentWeekSteps,
        previous: previousWeekSteps,
        unit: '',
        target: 70000
      },
      {
        metric: 'Water Intake',
        current: currentWeekWater / 1000,
        previous: previousWeekWater / 1000,
        unit: 'L',
        target: 14
      },
      {
        metric: 'Sleep',
        current: currentWeekSleep,
        previous: previousWeekSleep,
        unit: 'h',
        target: 8
      },
      {
        metric: 'Weight',
        current: currentWeight,
        previous: previousWeight,
        unit: 'kg',
        target: goalWeight
      }
    ];
  };

  // Calculate health score metrics
  const getHealthMetrics = () => {
    const weeklySteps = weekStats.reduce((sum, day) => sum + day.steps, 0);
    const weeklyWater = waterData.weeklyData.reduce((sum, day) => sum + day.amount, 0);
    const avgSleep = sleepEntries.slice(0, 7).reduce((sum, entry) => sum + entry.hours, 0) / 7;
    const currentWeight = getCurrentWeight();
    const bmi = currentWeight / Math.pow(1.75, 2); // Assuming average height

    return [
      { name: 'Activity', value: weeklySteps, weight: 0.3, optimal: 70000 },
      { name: 'Hydration', value: weeklyWater, weight: 0.2, optimal: 14000 },
      { name: 'Sleep', value: avgSleep * 7, weight: 0.3, optimal: 56 },
      { name: 'BMI', value: 100 - Math.abs(22 - bmi) * 10, weight: 0.2, optimal: 100 }
    ];
  };

  // Generate comparison data (you vs average user)
  const getComparisonData = () => [
    { category: 'Steps', yourValue: weekStats.reduce((sum, day) => sum + day.steps, 0) / 7, average: 8000, unit: '' },
    { category: 'Water', yourValue: waterData.weeklyData.reduce((sum, day) => sum + day.amount, 0) / 7000, average: 2.2, unit: 'L' },
    { category: 'Sleep', yourValue: sleepEntries.slice(0, 7).reduce((sum, entry) => sum + entry.hours, 0) / 7, average: 7.5, unit: 'h' },
    { category: 'Exercise', yourValue: activities.filter(a => Date.now() - new Date(a.date).getTime() < 7 * 24 * 60 * 60 * 1000).length, average: 3.5, unit: ' days' }
  ];

  // Generate achievements
  const getAchievements = () => {
    const weeklySteps = weekStats.reduce((sum, day) => sum + day.steps, 0);
    const consecutiveDays = Math.min(7, sleepEntries.filter(entry => entry.hours >= 7).length);
    
    return [
      {
        id: 'steps_10k',
        title: 'Step Master',
        description: 'Walk 10,000 steps in a day',
        icon: Trophy,
        color: 'bg-yellow-500',
        earned: weekStats.some(day => day.steps >= 10000),
        progress: Math.min(100, (Math.max(...weekStats.map(d => d.steps)) / 10000) * 100)
      },
      {
        id: 'hydration_week',
        title: 'Hydration Hero',
        description: 'Meet daily water goal for 7 days',
        icon: Droplets,
        color: 'bg-blue-500',
        earned: waterData.weeklyData.every(day => day.amount >= 2000),
        progress: (waterData.weeklyData.filter(day => day.amount >= 2000).length / 7) * 100
      },
      {
        id: 'sleep_consistent',
        title: 'Sleep Champion',
        description: 'Get 7+ hours of sleep for 5 consecutive days',
        icon: Moon,
        color: 'bg-purple-500',
        earned: consecutiveDays >= 5,
        progress: (consecutiveDays / 5) * 100
      },
      {
        id: 'weight_goal',
        title: 'Goal Achiever',
        description: 'Reach your target weight',
        icon: Target,
        color: 'bg-green-500',
        earned: Math.abs(getCurrentWeight() - goalWeight) <= 0.5,
        progress: Math.max(0, 100 - Math.abs(getCurrentWeight() - goalWeight) * 20)
      },
      {
        id: 'active_week',
        title: 'Weekly Warrior',
        description: 'Exercise 5 times in a week',
        icon: Zap,
        color: 'bg-orange-500',
        earned: activities.filter(a => Date.now() - new Date(a.date).getTime() < 7 * 24 * 60 * 60 * 1000).length >= 5,
        progress: Math.min(100, (activities.filter(a => Date.now() - new Date(a.date).getTime() < 7 * 24 * 60 * 60 * 1000).length / 5) * 100)
      },
      {
        id: 'streak_master',
        title: 'Streak Master',
        description: 'Maintain a 30-day activity streak',
        icon: Crown,
        color: 'bg-red-500',
        earned: false,
        progress: 73 // Mock progress
      }
    ];
  };

  return {
    trends: getTrends(),
    healthMetrics: getHealthMetrics(),
    comparisonData: getComparisonData(),
    achievements: getAchievements(),
    weekStats,
    totalActivities: activities.length,
    totalWaterIntake: waterData.weeklyData.reduce((sum, day) => sum + day.amount, 0),
    averageSleepHours: sleepEntries.length > 0 
      ? sleepEntries.reduce((sum, entry) => sum + entry.hours, 0) / sleepEntries.length 
      : 0,
    currentWeight: getCurrentWeight(),
    weightChange: getCurrentWeight() - (weightEntries.length > 0 ? weightEntries[0].weight : getCurrentWeight())
  };
};
