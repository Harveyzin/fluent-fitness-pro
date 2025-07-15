import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Bell, X, Settings, CheckCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'workout' | 'nutrition' | 'achievement' | 'reminder';
  scheduledTime: Date;
  isRead: boolean;
  isEnabled: boolean;
}

interface NotificationSettings {
  workoutReminders: boolean;
  nutritionReminders: boolean;
  achievementAlerts: boolean;
  dailyGoalReminders: boolean;
  morningMotivation: boolean;
  eveningReview: boolean;
}

const NotificationSystem = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [settings, setSettings] = useState<NotificationSettings>(() => {
    const saved = localStorage.getItem('fitflow-notification-settings');
    return saved ? JSON.parse(saved) : {
      workoutReminders: true,
      nutritionReminders: true,
      achievementAlerts: true,
      dailyGoalReminders: true,
      morningMotivation: true,
      eveningReview: true,
    };
  });
  const [showSettings, setShowSettings] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(false);

  useEffect(() => {
    // Request notification permission
    if ('Notification' in window) {
      if (Notification.permission === 'granted') {
        setPermissionGranted(true);
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
          setPermissionGranted(permission === 'granted');
        });
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('fitflow-notification-settings', JSON.stringify(settings));
  }, [settings]);

  const scheduleNotification = (title: string, message: string, type: Notification['type'], delay: number = 0) => {
    const notification: Notification = {
      id: Date.now().toString(),
      title,
      message,
      type,
      scheduledTime: new Date(Date.now() + delay),
      isRead: false,
      isEnabled: settings[`${type}Reminders` as keyof NotificationSettings] || settings.achievementAlerts
    };

    setNotifications(prev => [...prev, notification]);

    if (permissionGranted && notification.isEnabled) {
      setTimeout(() => {
        new Notification(title, {
          body: message,
          icon: '/favicon.ico',
          badge: '/favicon.ico',
          tag: type
        });

        toast({
          title,
          description: message,
          duration: 5000,
        });
      }, delay);
    }

    return notification.id;
  };

  const scheduleWorkoutReminder = () => {
    if (settings.workoutReminders) {
      const now = new Date();
      const tomorrow8AM = new Date(now);
      tomorrow8AM.setDate(now.getDate() + 1);
      tomorrow8AM.setHours(8, 0, 0, 0);
      
      const delay = tomorrow8AM.getTime() - now.getTime();
      
      scheduleNotification(
        'Hora do Treino! 💪',
        'Que tal começar o dia com um treino energizante?',
        'workout',
        delay
      );
    }
  };

  const scheduleNutritionReminder = () => {
    if (settings.nutritionReminders) {
      const delay = 4 * 60 * 60 * 1000; // 4 hours
      
      scheduleNotification(
        'Hidratação e Nutrição 🥗',
        'Lembre-se de registrar suas refeições e beber água!',
        'nutrition',
        delay
      );
    }
  };

  const scheduleDailyMotivation = () => {
    if (settings.morningMotivation) {
      const delay = 30 * 1000; // 30 seconds for demo
      
      scheduleNotification(
        'Motivação Diária ✨',
        'Cada dia é uma nova oportunidade para se superar!',
        'reminder',
        delay
      );
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const getUnreadCount = () => {
    return notifications.filter(n => !n.isRead).length;
  };

  const updateSetting = (key: keyof NotificationSettings, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="relative">
      <Button 
        variant="ghost" 
        size="sm" 
        className="relative"
        onClick={() => setShowSettings(!showSettings)}
      >
        <Bell size={20} />
        {getUnreadCount() > 0 && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-destructive rounded-full animate-pulse">
            <span className="sr-only">{getUnreadCount()} notificações não lidas</span>
          </div>
        )}
      </Button>

      {showSettings && (
        <div className="absolute top-full right-0 mt-2 w-80 z-50">
          <Card className="p-4 shadow-lg border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Bell size={16} />
                Notificações
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSettings(false)}
              >
                <X size={16} />
              </Button>
            </div>

            {!permissionGranted && (
              <div className="mb-4 p-3 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  Permita notificações para receber lembretes
                </p>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Configurações</h4>
                <div className="space-y-2">
                  {Object.entries(settings).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <span className="text-sm">
                        {key === 'workoutReminders' && 'Lembretes de Treino'}
                        {key === 'nutritionReminders' && 'Lembretes de Nutrição'}
                        {key === 'achievementAlerts' && 'Alertas de Conquistas'}
                        {key === 'dailyGoalReminders' && 'Lembretes de Metas'}
                        {key === 'morningMotivation' && 'Motivação Matinal'}
                        {key === 'eveningReview' && 'Revisão Noturna'}
                      </span>
                      <Button
                        variant={value ? "default" : "outline"}
                        size="sm"
                        onClick={() => updateSetting(key as keyof NotificationSettings, !value)}
                      >
                        {value ? <CheckCircle size={14} /> : <X size={14} />}
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Ações Rápidas</h4>
                <div className="space-y-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full justify-start"
                    onClick={scheduleWorkoutReminder}
                  >
                    🏋️ Agendar lembrete de treino
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full justify-start"
                    onClick={scheduleNutritionReminder}
                  >
                    🥗 Agendar lembrete nutricional
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full justify-start"
                    onClick={scheduleDailyMotivation}
                  >
                    ✨ Motivação diária
                  </Button>
                </div>
              </div>

              {notifications.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Recentes</h4>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {notifications.slice(-5).reverse().map(notification => (
                      <div 
                        key={notification.id}
                        className={`p-2 rounded border text-sm ${
                          notification.isRead ? 'opacity-60' : 'bg-primary/5'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="font-medium">{notification.title}</p>
                            <p className="text-xs text-muted-foreground">{notification.message}</p>
                          </div>
                          <div className="flex gap-1">
                            {!notification.isRead && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => markAsRead(notification.id)}
                              >
                                <CheckCircle size={12} />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteNotification(notification.id)}
                            >
                              <X size={12} />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default NotificationSystem;