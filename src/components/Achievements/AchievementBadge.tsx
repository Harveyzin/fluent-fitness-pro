import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';
import { Achievement } from '@/hooks/use-achievements';

interface AchievementBadgeProps {
  achievement: Achievement;
  size?: 'sm' | 'md' | 'lg';
  showProgress?: boolean;
}

const AchievementBadge = ({ achievement, size = 'md', showProgress = true }: AchievementBadgeProps) => {
  const isUnlocked = !!achievement.unlockedAt;
  const progressPercentage = (achievement.progress / achievement.maxProgress) * 100;

  const getRarityColor = (rarity: Achievement['rarity']) => {
    switch (rarity) {
      case 'common': return 'bg-gray-500';
      case 'rare': return 'bg-blue-500';
      case 'epic': return 'bg-purple-500';
      case 'legendary': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm': return 'w-12 h-12 text-lg';
      case 'md': return 'w-16 h-16 text-2xl';
      case 'lg': return 'w-20 h-20 text-3xl';
      default: return 'w-16 h-16 text-2xl';
    }
  };

  return (
    <Card className={`p-3 hover:shadow-card-hover transition-smooth ${isUnlocked ? '' : 'opacity-60'}`}>
      <div className="text-center space-y-2">
        <div className={`${getSizeClasses()} mx-auto rounded-full flex items-center justify-center ${isUnlocked ? getRarityColor(achievement.rarity) : 'bg-muted'} relative`}>
          <span className={isUnlocked ? 'text-white' : 'text-muted-foreground'}>
            {achievement.icon}
          </span>
          {isUnlocked && (
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-success rounded-full flex items-center justify-center">
              <span className="text-xs text-white">✓</span>
            </div>
          )}
        </div>
        
        <div className="space-y-1">
          <h4 className="font-semibold text-sm">{achievement.title}</h4>
          <p className="text-xs text-muted-foreground">{achievement.description}</p>
          
          {showProgress && !isUnlocked && (
            <div className="space-y-1">
              <Progress value={progressPercentage} className="h-1" />
              <p className="text-xs text-muted-foreground">
                {achievement.progress}/{achievement.maxProgress}
              </p>
            </div>
          )}
          
          {isUnlocked && (
            <Badge variant="secondary" className="text-xs">
              Desbloqueado
            </Badge>
          )}
          
          <Badge 
            variant="outline" 
            className={`text-xs ${getRarityColor(achievement.rarity)} text-white border-none`}
          >
            {achievement.rarity.charAt(0).toUpperCase() + achievement.rarity.slice(1)}
          </Badge>
        </div>
      </div>
    </Card>
  );
};

export default AchievementBadge;