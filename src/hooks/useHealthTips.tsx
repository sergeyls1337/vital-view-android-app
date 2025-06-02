
import { useMemo } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useWaterData } from './useWaterData';
import { useActivityData } from './useActivityData';
import { useSleepData } from './useSleepData';

interface HealthTip {
  id: string;
  text: string;
  color: string;
  icon: 'water' | 'steps' | 'sleep' | 'weight' | 'general';
}

export const useHealthTips = (weightData: any[]) => {
  const { t } = useLanguage();
  const { currentIntake, dailyGoal } = useWaterData();
  const { currentActivity, stepsProgress } = useActivityData();
  const { sleepEntries } = useSleepData();

  const tips = useMemo((): HealthTip[] => {
    const generatedTips: HealthTip[] = [];
    
    // Water tips
    const waterProgress = Math.min(100, Math.round((currentIntake / dailyGoal) * 100));
    const glassesNeeded = Math.ceil((dailyGoal - currentIntake) / 250);
    
    if (waterProgress < 50) {
      generatedTips.push({
        id: 'water-low',
        text: t('tips.water.low', { glasses: glassesNeeded }),
        color: 'bg-gradient-to-r from-blue-500 to-teal-500',
        icon: 'water',
      });
    } else if (waterProgress < 80) {
      generatedTips.push({
        id: 'water-good',
        text: t('tips.water.good'),
        color: 'bg-gradient-to-r from-teal-500 to-green-500',
        icon: 'water',
      });
    } else {
      generatedTips.push({
        id: 'water-excellent',
        text: t('tips.water.excellent'),
        color: 'bg-gradient-to-r from-green-500 to-emerald-500',
        icon: 'water',
      });
    }

    // Steps tips with more variety
    const stepsRemaining = Math.max(0, 10000 - (currentActivity.steps || 0));
    const currentSteps = currentActivity.steps || 0;
    
    if (stepsProgress === 0) {
      generatedTips.push({
        id: 'steps-start',
        text: t('tips.steps.start'),
        color: 'bg-gradient-to-r from-orange-500 to-red-500',
        icon: 'steps',
      });
    } else if (stepsProgress < 25) {
      generatedTips.push({
        id: 'steps-early',
        text: t('tips.steps.early'),
        color: 'bg-gradient-to-r from-yellow-500 to-orange-500',
        icon: 'steps',
      });
    } else if (stepsProgress < 50) {
      generatedTips.push({
        id: 'steps-quarter',
        text: t('tips.steps.quarter'),
        color: 'bg-gradient-to-r from-blue-500 to-purple-500',
        icon: 'steps',
      });
    } else if (stepsProgress < 80) {
      generatedTips.push({
        id: 'steps-progress',
        text: t('tips.steps.progress', { steps: stepsRemaining.toLocaleString() }),
        color: 'bg-gradient-to-r from-purple-500 to-pink-500',
        icon: 'steps',
      });
    } else if (stepsProgress < 100) {
      generatedTips.push({
        id: 'steps-close',
        text: t('tips.steps.close', { steps: stepsRemaining.toLocaleString() }),
        color: 'bg-gradient-to-r from-indigo-500 to-blue-500',
        icon: 'steps',
      });
    } else {
      generatedTips.push({
        id: 'steps-achieved',
        text: t('tips.steps.achieved'),
        color: 'bg-gradient-to-r from-green-500 to-teal-500',
        icon: 'steps',
      });
    }

    // Sleep tips with more context
    const latestSleep = sleepEntries.length > 0 ? sleepEntries[0] : null;
    const sleepHours = latestSleep ? latestSleep.hours : 0;
    
    if (sleepHours === 0) {
      generatedTips.push({
        id: 'sleep-track',
        text: t('tips.sleep.track'),
        color: 'bg-gradient-to-r from-indigo-500 to-purple-500',
        icon: 'sleep',
      });
    } else if (sleepHours < 6) {
      generatedTips.push({
        id: 'sleep-short',
        text: t('tips.sleep.short'),
        color: 'bg-gradient-to-r from-red-500 to-orange-500',
        icon: 'sleep',
      });
    } else if (sleepHours < 7) {
      generatedTips.push({
        id: 'sleep-low',
        text: t('tips.sleep.low'),
        color: 'bg-gradient-to-r from-orange-500 to-yellow-500',
        icon: 'sleep',
      });
    } else if (sleepHours <= 8) {
      generatedTips.push({
        id: 'sleep-good',
        text: t('tips.sleep.good'),
        color: 'bg-gradient-to-r from-green-500 to-blue-500',
        icon: 'sleep',
      });
    } else if (sleepHours <= 9) {
      generatedTips.push({
        id: 'sleep-optimal',
        text: t('tips.sleep.optimal'),
        color: 'bg-gradient-to-r from-emerald-500 to-teal-500',
        icon: 'sleep',
      });
    } else {
      generatedTips.push({
        id: 'sleep-long',
        text: t('tips.sleep.long'),
        color: 'bg-gradient-to-r from-purple-500 to-indigo-500',
        icon: 'sleep',
      });
    }

    // Weight tips with progress tracking
    if (weightData.length === 0) {
      generatedTips.push({
        id: 'weight-track',
        text: t('tips.weight.track'),
        color: 'bg-gradient-to-r from-pink-500 to-rose-500',
        icon: 'weight',
      });
    } else {
      const currentWeight = weightData[weightData.length - 1].weight;
      const goalWeight = 70;
      const difference = Math.abs(currentWeight - goalWeight);
      
      if (difference > 5) {
        generatedTips.push({
          id: 'weight-goal-far',
          text: t('tips.weight.goalFar', { amount: difference.toFixed(1) }),
          color: 'bg-gradient-to-r from-orange-500 to-red-500',
          icon: 'weight',
        });
      } else if (difference > 2) {
        generatedTips.push({
          id: 'weight-goal',
          text: t('tips.weight.goal', { amount: difference.toFixed(1) }),
          color: 'bg-gradient-to-r from-yellow-500 to-orange-500',
          icon: 'weight',
        });
      } else if (difference <= 1) {
        generatedTips.push({
          id: 'weight-achieved',
          text: t('tips.weight.achieved'),
          color: 'bg-gradient-to-r from-green-500 to-emerald-500',
          icon: 'weight',
        });
      } else {
        generatedTips.push({
          id: 'weight-maintain',
          text: t('tips.weight.maintain'),
          color: 'bg-gradient-to-r from-blue-500 to-green-500',
          icon: 'weight',
        });
      }
    }

    // More diverse general tips based on time and progress
    const hour = new Date().getHours();
    const dayOfWeek = new Date().getDay();
    const totalProgress = (waterProgress + stepsProgress) / 2;
    
    let generalTips = [];
    
    if (hour < 12) {
      generalTips = ['morning', 'energy', 'hydrate'];
    } else if (hour < 17) {
      generalTips = ['afternoon', 'move', 'balance'];
    } else {
      generalTips = ['evening', 'rest', 'reflect'];
    }
    
    if (dayOfWeek === 1) { // Monday
      generalTips.push('weekStart');
    } else if (dayOfWeek === 5) { // Friday
      generalTips.push('weekEnd');
    } else if (dayOfWeek === 0 || dayOfWeek === 6) { // Weekend
      generalTips.push('weekend');
    }
    
    if (totalProgress > 80) {
      generalTips.push('celebrate', 'consistency');
    } else if (totalProgress < 30) {
      generalTips.push('motivation', 'start');
    }
    
    // Select random tip but ensure variety
    const randomTip = generalTips[Math.floor(Date.now() / (1000 * 60 * 60 * 6)) % generalTips.length];
    
    if (randomTip && t(`tips.general.${randomTip}`)) {
      generatedTips.push({
        id: `general-${randomTip}`,
        text: t(`tips.general.${randomTip}`),
        color: 'bg-gradient-to-r from-violet-500 to-purple-500',
        icon: 'general',
      });
    }

    // Return 4-5 most relevant tips, prioritizing actionable ones
    return generatedTips.slice(0, Math.min(5, generatedTips.length));
  }, [currentIntake, dailyGoal, currentActivity.steps, stepsProgress, sleepEntries, weightData, t]);

  return tips;
};
