
import { useState, useEffect, useRef } from "react";
import { toast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

export const useWaterReminder = () => {
  const { t } = useLanguage();
  const [isReminderActive, setIsReminderActive] = useState(false);
  const [intervalMinutes, setIntervalMinutes] = useState(60);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startReminder = (minutes: number) => {
    // Clear any existing reminder
    stopReminder();
    
    setIntervalMinutes(minutes);
    setIsReminderActive(true);
    
    // Set up the interval
    intervalRef.current = setInterval(() => {
      // Request notification permission if not granted
      if (Notification.permission === 'granted') {
        new Notification(t('water.reminderNotificationTitle'), {
          body: t('water.reminderNotificationBody'),
          icon: '/favicon.ico',
          badge: '/favicon.ico'
        });
      }
      
      // Show toast notification as fallback
      toast({
        title: t('water.reminderNotificationTitle'),
        description: t('water.reminderNotificationBody'),
      });
    }, minutes * 60 * 1000);
    
    console.log(`Water reminder set for every ${minutes} minutes`);
  };

  const stopReminder = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsReminderActive(false);
    console.log('Water reminder stopped');
  };

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return false;
  };

  // Clean up interval on component unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    isReminderActive,
    intervalMinutes,
    startReminder,
    stopReminder,
    requestNotificationPermission
  };
};
