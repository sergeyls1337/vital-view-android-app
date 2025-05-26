import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'uk';

interface Translation {
  [key: string]: string | Translation;
}

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

const translations: Record<Language, Translation> = {
  en: {
    common: {
      loading: 'Loading...',
      save: 'Save',
      cancel: 'Cancel',
      edit: 'Edit',
      delete: 'Delete',
      confirm: 'Confirm',
      back: 'Back',
      next: 'Next',
      close: 'Close',
      submit: 'Submit',
    },
    auth: {
      signIn: 'Sign In',
      signUp: 'Sign Up',
      signOut: 'Sign Out',
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      username: 'Username',
      forgotPassword: 'Forgot Password?',
      resetPassword: 'Reset Password',
      createAccount: 'Create Account',
      alreadyHaveAccount: 'Already have an account?',
      dontHaveAccount: "Don't have an account?",
    },
    dashboard: {
      hello: 'Hello',
      todaysActivity: "Today's Activity",
      dailyGoal: 'Daily Goal',
      steps: 'Steps',
      water: 'Water',
      sleep: 'Sleep',
      weight: 'Weight',
      calories: 'Calories',
      liters: 'liters',
      hours: 'hours',
      current: 'Current',
      goal: 'Goal',
      trackWeight: 'Track Weight',
      todaysTips: "Today's Tips",
    },
    profile: {
      yourProfile: 'Your Profile',
      manageInfo: 'Manage your personal information',
      editProfile: 'Edit Profile',
      saveChanges: 'Save Changes',
      name: 'Name',
      height: 'Height',
      age: 'Age',
      gender: 'Gender',
      healthGoals: 'Health Goals',
      goalWeight: 'Goal Weight',
      goalSleep: 'Goal Sleep',
      goalSteps: 'Goal Steps',
      goalWater: 'Goal Water',
      notSet: 'Not set',
      targetWeight: 'Target Weight',
      targetSleep: 'Target Sleep',
      dailyStepsTarget: 'Daily Steps Target',
      dailyWaterTarget: 'Daily Water Target',
      resetStatistics: 'Reset All Statistics',
    },
    navigation: {
      home: 'Home',
      activity: 'Activity',
      water: 'Water',
      sleep: 'Sleep',
      weight: 'Weight',
      profile: 'Profile',
    },
    settings: {
      settings: 'Settings',
      language: 'Language',
      theme: 'Theme',
      light: 'Light',
      dark: 'Dark',
      system: 'System',
      contactDeveloper: 'Contact Developer',
      feedback: 'Feedback',
    },
    feedback: {
      description: 'Share your thoughts and suggestions',
      subject: 'Subject',
      message: 'Message',
      sent: 'Feedback sent successfully!',
      error: 'Failed to send feedback. Please try again.',
    },
  },
  uk: {
    common: {
      loading: 'Завантаження...',
      save: 'Зберегти',
      cancel: 'Скасувати',
      edit: 'Редагувати',
      delete: 'Видалити',
      confirm: 'Підтвердити',
      back: 'Назад',
      next: 'Далі',
      close: 'Закрити',
      submit: 'Надіслати',
    },
    auth: {
      signIn: 'Увійти',
      signUp: 'Зареєструватися',
      signOut: 'Вийти',
      email: 'Електронна пошта',
      password: 'Пароль',
      confirmPassword: 'Підтвердити пароль',
      username: "Ім'я користувача",
      forgotPassword: 'Забули пароль?',
      resetPassword: 'Скинути пароль',
      createAccount: 'Створити акаунт',
      alreadyHaveAccount: 'Вже є акаунт?',
      dontHaveAccount: 'Немає акаунту?',
    },
    dashboard: {
      hello: 'Привіт',
      todaysActivity: 'Сьогоднішня активність',
      dailyGoal: 'Денна ціль',
      steps: 'Кроки',
      water: 'Вода',
      sleep: 'Сон',
      weight: 'Вага',
      calories: 'Калорії',
      liters: 'літрів',
      hours: 'годин',
      current: 'Поточна',
      goal: 'Ціль',
      trackWeight: 'Відстежити вагу',
      todaysTips: 'Поради дня',
    },
    profile: {
      yourProfile: 'Ваш профіль',
      manageInfo: 'Керуйте своєю особистою інформацією',
      editProfile: 'Редагувати профіль',
      saveChanges: 'Зберегти зміни',
      name: "Ім'я",
      height: 'Зріст',
      age: 'Вік',
      gender: 'Стать',
      healthGoals: 'Цілі здоров\'я',
      goalWeight: 'Цільова вага',
      goalSleep: 'Цільовий сон',
      goalSteps: 'Цільові кроки',
      goalWater: 'Цільова вода',
      notSet: 'Не встановлено',
      targetWeight: 'Цільова вага',
      targetSleep: 'Цільовий сон',
      dailyStepsTarget: 'Денна ціль кроків',
      dailyWaterTarget: 'Денна ціль води',
      resetStatistics: 'Скинути всю статистику',
    },
    navigation: {
      home: 'Головна',
      activity: 'Активність',
      water: 'Вода',
      sleep: 'Сон',
      weight: 'Вага',
      profile: 'Профіль',
    },
    settings: {
      settings: 'Налаштування',
      language: 'Мова',
      theme: 'Тема',
      light: 'Світла',
      dark: 'Темна',
      system: 'Системна',
      contactDeveloper: 'Зв\'язатися з розробником',
      feedback: 'Зворотний зв\'язок',
    },
    feedback: {
      description: 'Поділіться своїми думками та пропозиціями',
      subject: 'Тема',
      message: 'Повідомлення',
      sent: 'Зворотний зв\'язок успішно надіслано!',
      error: 'Не вдалося надіслати зворотний зв\'язок. Спробуйте ще раз.',
    },
  },
};

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('healthtrack-language');
    return (saved as Language) || 'en';
  });

  useEffect(() => {
    localStorage.setItem('healthtrack-language', language);
  }, [language]);

  const t = (key: string): string => {
    const keys = key.split('.');
    let current: any = translations[language];
    
    for (const k of keys) {
      if (current && typeof current === 'object' && k in current) {
        current = current[k];
      } else {
        // Fallback to English if translation not found
        current = translations.en;
        for (const fallbackKey of keys) {
          if (current && typeof current === 'object' && fallbackKey in current) {
            current = current[fallbackKey];
          } else {
            return key; // Return key if no translation found
          }
        }
        break;
      }
    }
    
    return typeof current === 'string' ? current : key;
  };

  const value = {
    language,
    setLanguage,
    t,
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};
