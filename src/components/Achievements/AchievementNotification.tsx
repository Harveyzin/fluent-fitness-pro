import React, { useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, Trophy } from 'lucide-react';
import { Achievement } from '@/hooks/use-achievements';

interface AchievementNotificationProps {
  achievement: Achievement;
  onDismiss: () => void;
}

const AchievementNotification = ({ achievement, onDismiss }: AchievementNotificationProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss();
    }, 5000); // Auto dismiss after 5 seconds

    return () => clearTimeout(timer);
  }, [onDismiss]);

  const getRarityColor = (rarity: Achievement['rarity']) => {
    switch (rarity) {
      case 'common': return 'from-gray-400 to-gray-600';
      case 'rare': return 'from-blue-400 to-blue-600';
      case 'epic': return 'from-purple-400 to-purple-600';
      case 'legendary': return 'from-yellow-400 to-yellow-600';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in-right">
      <Card className={`p-4 w-80 border-2 bg-gradient-to-r ${getRarityColor(achievement.rarity)} text-white shadow-lg`}>
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <Trophy className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-sm">Conquista Desbloqueada!</h3>
              <p className="font-semibold text-lg">{achievement.title}</p>
              <p className="text-sm opacity-90">{achievement.description}</p>
              <div className="flex items-center space-x-2 mt-1">
                <span className="text-2xl">{achievement.icon}</span>
                <span className="text-xs font-medium bg-white/20 px-2 py-1 rounded">
                  {achievement.rarity.toUpperCase()}
                </span>
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onDismiss}
            className="text-white hover:bg-white/20 p-1"
          >
            <X size={16} />
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default AchievementNotification;