
import { useState, useEffect, useRef } from "react";
import { toast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

export const useWaterReminder = () => {
  const { t } = useLanguage();
  const [isReminderActive, setIsReminderActive] = useState(false);
  const [intervalMinutes, setIntervalMinutes] = useState(60);
  const [nextReminderTime, setNextReminderTime] = useState<Date | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Load reminder settings from localStorage on mount
  useEffect(() => {
    const savedReminder = localStorage.getItem('waterReminderSettings');
    if (savedReminder) {
      const settings = JSON.parse(savedReminder);
      if (settings.isActive && settings.intervalMinutes) {
        setIntervalMinutes(settings.intervalMinutes);
        startReminder(settings.intervalMinutes);
      }
    }
  }, []);

  const calculateNextReminderTime = (minutes: number) => {
    const next = new Date();
    next.setMinutes(next.getMinutes() + minutes);
    return next;
  };

  const startReminder = (minutes: number) => {
    // Clear any existing reminder
    stopReminder();
    
    setIntervalMinutes(minutes);
    setIsReminderActive(true);
    
    const nextTime = calculateNextReminderTime(minutes);
    setNextReminderTime(nextTime);
    
    // Save to localStorage
    localStorage.setItem('waterReminderSettings', JSON.stringify({
      isActive: true,
      intervalMinutes: minutes,
      nextReminderTime: nextTime.toISOString()
    }));
    
    // Set up the interval
    intervalRef.current = setInterval(() => {
      // Request notification permission if not granted
      if (Notification.permission === 'granted') {
        new Notification(t('water.reminderNotificationTitle'), {
          body: t('water.reminderNotificationBody'),
          icon: '/favicon.ico',
          badge: '/favicon.ico',
          tag: 'water-reminder'
        });
      }
      
      // Show toast notification as fallback
      toast({
        title: "💧 " + t('water.reminderNotificationTitle'),
        description: t('water.reminderNotificationBody'),
        duration: 5000,
      });
      
      // Update next reminder time
      const nextTime = calculateNextReminderTime(minutes);
      setNextReminderTime(nextTime);
      
      // Update localStorage
      localStorage.setItem('waterReminderSettings', JSON.stringify({
        isActive: true,
        intervalMinutes: minutes,
        nextReminderTime: nextTime.toISOString()
      }));
    }, minutes * 60 * 1000);
    
    // Show confirmation toast
    toast({
      title: "⏰ Reminder Set",
      description: `You'll be reminded every ${minutes} minutes to drink water`,
      duration: 3000,
    });
    
    console.log(`Water reminder set for every ${minutes} minutes`);
  };

  const stopReminder = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsReminderActive(false);
    setNextReminderTime(null);
    
    // Update localStorage
    localStorage.setItem('waterReminderSettings', JSON.stringify({
      isActive: false,
      intervalMinutes: intervalMinutes
    }));
    
    toast({
      title: "🔕 Reminder Stopped",
      description: "Water reminders have been disabled",
      duration: 2000,
    });
    
    console.log('Water reminder stopped');
  };

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return false;
  };

  const getTimeUntilNextReminder = () => {
    if (!nextReminderTime || !isReminderActive) return null;
    
    const now = new Date();
    const timeDiff = nextReminderTime.getTime() - now.getTime();
    
    if (timeDiff <= 0) return null;
    
    const minutes = Math.floor(timeDiff / (1000 * 60));
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
    
    return { minutes, seconds };
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
    nextReminderTime,
    startReminder,
    stopReminder,
    requestNotificationPermission,
    getTimeUntilNextReminder
  };
};
