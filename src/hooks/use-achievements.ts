import { useState, useEffect } from 'react';
import { useProgress } from '@/contexts/ProgressContext';
import { useWorkout } from '@/contexts/WorkoutContext';
import { useNutrition } from '@/contexts/NutritionContext';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: Date;
  progress: number;
  maxProgress: number;
  category: 'workout' | 'nutrition' | 'consistency' | 'milestone';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_workout',
    title: 'Primeiro Treino',
    description: 'Complete seu primeiro treino',
    icon: '🏋️',
    progress: 0,
    maxProgress: 1,
    category: 'workout',
    rarity: 'common'
  },
  {
    id: 'week_streak',
    title: 'Semana Consistente',
    description: 'Treine por 7 dias seguidos',
    icon: '🔥',
    progress: 0,
    maxProgress: 7,
    category: 'consistency',
    rarity: 'rare'
  },
  {
    id: 'calories_goal',
    title: 'Meta Calórica',
    description: 'Atinja sua meta de calorias por 5 dias',
    icon: '🎯',
    progress: 0,
    maxProgress: 5,
    category: 'nutrition',
    rarity: 'common'
  },
  {
    id: 'weight_loss_5kg',
    title: 'Primeira Meta',
    description: 'Perca 5kg do peso inicial',
    icon: '⚖️',
    progress: 0,
    maxProgress: 5,
    category: 'milestone',
    rarity: 'epic'
  },
  {
    id: 'hundred_workouts',
    title: 'Centenário',
    description: 'Complete 100 treinos',
    icon: '💪',
    progress: 0,
    maxProgress: 100,
    category: 'workout',
    rarity: 'legendary'
  },
  {
    id: 'protein_master',
    title: 'Mestre das Proteínas',
    description: 'Atinja meta de proteína por 30 dias',
    icon: '🥩',
    progress: 0,
    maxProgress: 30,
    category: 'nutrition',
    rarity: 'epic'
  }
];

export const useAchievements = () => {
  const [achievements, setAchievements] = useState<Achievement[]>(() => {
    const saved = localStorage.getItem('fitflow-achievements');
    return saved ? JSON.parse(saved) : ACHIEVEMENTS;
  });

  const [newUnlocks, setNewUnlocks] = useState<Achievement[]>([]);
  const { workoutHistory } = useWorkout();
  const { nutritionProgress, bodyProgress } = useProgress();
  const { getDailyTotals, nutritionData } = useNutrition();

  const checkAchievements = () => {
    const updatedAchievements = achievements.map(achievement => {
      let progress = achievement.progress;
      let unlockedAt = achievement.unlockedAt;

      switch (achievement.id) {
        case 'first_workout':
          progress = workoutHistory.length > 0 ? 1 : 0;
          break;

        case 'week_streak':
          // Simplified streak calculation
          const recentWorkouts = workoutHistory.slice(-7);
          progress = recentWorkouts.length;
          break;

        case 'calories_goal':
          // Count days meeting calorie goal
          const dailyTotals = getDailyTotals();
          const metGoal = dailyTotals.calories >= nutritionData.dailyGoals.calories;
          progress = Math.min(progress + (metGoal ? 1 : 0), achievement.maxProgress);
          break;

        case 'weight_loss_5kg':
          if (bodyProgress.length >= 2) {
            const initialWeight = bodyProgress[0].weight;
            const currentWeight = bodyProgress[bodyProgress.length - 1].weight;
            const weightLoss = initialWeight - currentWeight;
            progress = Math.max(0, Math.min(weightLoss, achievement.maxProgress));
          }
          break;

        case 'hundred_workouts':
          progress = workoutHistory.length;
          break;

        case 'protein_master':
          // Simplified protein goal tracking
          const proteinMet = dailyTotals.protein >= nutritionData.dailyGoals.protein;
          progress = Math.min(progress + (proteinMet ? 1 : 0), achievement.maxProgress);
          break;
      }

      // Check if achievement is newly unlocked
      if (progress >= achievement.maxProgress && !achievement.unlockedAt) {
        unlockedAt = new Date();
        setNewUnlocks(prev => [...prev, { ...achievement, unlockedAt, progress }]);
      }

      return { ...achievement, progress, unlockedAt };
    });

    setAchievements(updatedAchievements);
  };

  const clearNewUnlocks = () => {
    setNewUnlocks([]);
  };

  const getUnlockedAchievements = () => {
    return achievements.filter(a => a.unlockedAt);
  };

  const getProgress = () => {
    const total = achievements.length;
    const unlocked = getUnlockedAchievements().length;
    return { unlocked, total, percentage: (unlocked / total) * 100 };
  };

  useEffect(() => {
    checkAchievements();
  }, [workoutHistory.length, nutritionProgress.length, bodyProgress.length]);

  useEffect(() => {
    localStorage.setItem('fitflow-achievements', JSON.stringify(achievements));
  }, [achievements]);

  return {
    achievements,
    newUnlocks,
    clearNewUnlocks,
    getUnlockedAchievements,
    getProgress,
    checkAchievements
  };
};