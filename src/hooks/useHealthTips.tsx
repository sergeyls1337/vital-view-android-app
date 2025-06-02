
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
        color: 'bg-health-teal',
        icon: 'water',
      });
    } else if (waterProgress < 80) {
      generatedTips.push({
        id: 'water-good',
        text: t('tips.water.good'),
        color: 'bg-health-teal',
        icon: 'water',
      });
    } else {
      generatedTips.push({
        id: 'water-excellent',
        text: t('tips.water.excellent'),
        color: 'bg-health-teal',
        icon: 'water',
      });
    }

    // Steps tips
    const stepsRemaining = Math.max(0, 10000 - (currentActivity.steps || 0));
    
    if (stepsProgress === 0) {
      generatedTips.push({
        id: 'steps-start',
        text: t('tips.steps.start'),
        color: 'bg-health-blue',
        icon: 'steps',
      });
    } else if (stepsProgress < 80) {
      generatedTips.push({
        id: 'steps-progress',
        text: t('tips.steps.progress', { steps: stepsRemaining.toLocaleString() }),
        color: 'bg-health-blue',
        icon: 'steps',
      });
    } else if (stepsProgress < 100) {
      generatedTips.push({
        id: 'steps-close',
        text: t('tips.steps.close', { steps: stepsRemaining.toLocaleString() }),
        color: 'bg-health-blue',
        icon: 'steps',
      });
    } else {
      generatedTips.push({
        id: 'steps-achieved',
        text: t('tips.steps.achieved'),
        color: 'bg-health-green',
        icon: 'steps',
      });
    }

    // Sleep tips
    const latestSleep = sleepEntries.length > 0 ? sleepEntries[0] : null;
    const sleepHours = latestSleep ? latestSleep.hours : 0;
    
    if (sleepHours < 7) {
      generatedTips.push({
        id: 'sleep-short',
        text: t('tips.sleep.short'),
        color: 'bg-health-purple',
        icon: 'sleep',
      });
    } else if (sleepHours <= 8) {
      generatedTips.push({
        id: 'sleep-good',
        text: t('tips.sleep.good'),
        color: 'bg-health-purple',
        icon: 'sleep',
      });
    } else {
      generatedTips.push({
        id: 'sleep-long',
        text: t('tips.sleep.long'),
        color: 'bg-health-purple',
        icon: 'sleep',
      });
    }

    // Weight tips
    if (weightData.length === 0) {
      generatedTips.push({
        id: 'weight-track',
        text: t('tips.weight.track'),
        color: 'bg-health-orange',
        icon: 'weight',
      });
    } else {
      const currentWeight = weightData[weightData.length - 1].weight;
      const goalWeight = 70; // This could be made dynamic
      const difference = Math.abs(currentWeight - goalWeight);
      
      if (difference > 2) {
        generatedTips.push({
          id: 'weight-goal',
          text: t('tips.weight.goal', { amount: difference.toFixed(1) }),
          color: 'bg-health-orange',
          icon: 'weight',
        });
      } else {
        generatedTips.push({
          id: 'weight-maintain',
          text: t('tips.weight.maintain'),
          color: 'bg-health-green',
          icon: 'weight',
        });
      }
    }

    // Add some general tips randomly
    const generalTips = [
      'consistency', 'balance', 'celebrate', 'hydrate', 'move', 'rest'
    ];
    
    const randomTip = generalTips[Math.floor(Date.now() / (1000 * 60 * 60 * 24)) % generalTips.length];
    generatedTips.push({
      id: `general-${randomTip}`,
      text: t(`tips.general.${randomTip}`),
      color: 'bg-health-gradient',
      icon: 'general',
    });

    // Return only 3-4 most relevant tips
    return generatedTips.slice(0, 4);
  }, [currentIntake, dailyGoal, currentActivity.steps, stepsProgress, sleepEntries, weightData, t]);

  return tips;
};
