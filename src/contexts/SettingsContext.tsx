import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface NotificationSettings {
  workoutReminders: boolean;
  mealReminders: boolean;
  progressUpdates: boolean;
  weeklyReports: boolean;
  achievementAlerts: boolean;
  pushNotifications: boolean;
  emailNotifications: boolean;
}

export interface PrivacySettings {
  profileVisibility: 'public' | 'friends' | 'private';
  shareWorkouts: boolean;
  shareProgress: boolean;
  dataCollection: boolean;
  analytics: boolean;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: 'pt' | 'en' | 'es';
  units: 'metric' | 'imperial';
  weekStart: 'monday' | 'sunday';
  timeFormat: '12h' | '24h';
  isTrainerMode: boolean;
}

interface SettingsContextType {
  notifications: NotificationSettings;
  privacy: PrivacySettings;
  preferences: UserPreferences;
  isTrainerMode: boolean;
  updateNotifications: (settings: Partial<NotificationSettings>) => void;
  updatePrivacy: (settings: Partial<PrivacySettings>) => void;
  updatePreferences: (settings: Partial<UserPreferences>) => void;
  toggleTrainerMode: () => void;
  resetToDefaults: () => void;
  exportData: () => void;
  deleteAccount: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

const defaultNotifications: NotificationSettings = {
  workoutReminders: true,
  mealReminders: true,
  progressUpdates: true,
  weeklyReports: false,
  achievementAlerts: true,
  pushNotifications: true,
  emailNotifications: false
};

const defaultPrivacy: PrivacySettings = {
  profileVisibility: 'friends',
  shareWorkouts: true,
  shareProgress: false,
  dataCollection: true,
  analytics: false
};

const defaultPreferences: UserPreferences = {
  theme: 'system',
  language: 'pt',
  units: 'metric',
  weekStart: 'monday',
  timeFormat: '24h',
  isTrainerMode: false
};

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<NotificationSettings>(defaultNotifications);
  const [privacy, setPrivacy] = useState<PrivacySettings>(defaultPrivacy);
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences);

  const updateNotifications = (settings: Partial<NotificationSettings>) => {
    setNotifications(prev => ({ ...prev, ...settings }));
  };

  const updatePrivacy = (settings: Partial<PrivacySettings>) => {
    setPrivacy(prev => ({ ...prev, ...settings }));
  };

  const updatePreferences = (settings: Partial<UserPreferences>) => {
    setPreferences(prev => ({ ...prev, ...settings }));
  };

  const toggleTrainerMode = () => {
    setPreferences(prev => ({ ...prev, isTrainerMode: !prev.isTrainerMode }));
  };

  const resetToDefaults = () => {
    setNotifications(defaultNotifications);
    setPrivacy(defaultPrivacy);
    setPreferences(defaultPreferences);
  };

  const exportData = () => {
    // Simulate data export
    const data = {
      notifications,
      privacy,
      preferences,
      exportDate: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'fitflow-settings.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const deleteAccount = () => {
    // Simulate account deletion
    console.log('Account deletion requested');
  };

  return (
    <SettingsContext.Provider value={{
      notifications,
      privacy,
      preferences,
      isTrainerMode: preferences.isTrainerMode,
      updateNotifications,
      updatePrivacy,
      updatePreferences,
      toggleTrainerMode,
      resetToDefaults,
      exportData,
      deleteAccount
    }}>
      {children}
    </SettingsContext.Provider>
  );
};