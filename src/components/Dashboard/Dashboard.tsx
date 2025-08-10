
import React, { useState } from 'react';
import { Calendar, Target, Zap, TrendingUp, Plus, Bell, Dumbbell, Apple, Trophy, User } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { LoadingSkeleton } from '@/components/ui/loading-skeleton';
import { useNutrition } from '@/contexts/NutritionContext';
import { useAchievements } from '@/hooks/use-achievements';
import AchievementBadge from '@/components/Achievements/AchievementBadge';
import AchievementNotification from '@/components/Achievements/AchievementNotification';
import NotificationSystem from '@/components/Notifications/NotificationSystem';

interface DashboardProps {
  onTabChange: (tab: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onTabChange }) => {
  const { getDailyTotals, nutritionData } = useNutrition();
  const { achievements, newUnlocks, clearNewUnlocks, getProgress } = useAchievements();
  const [isLoading, setIsLoading] = useState(false);
  const dailyTotals = getDailyTotals();
  const achievementProgress = getProgress();
  
  const today = new Date().toLocaleDateString('pt-BR', { 
    weekday: 'long', 
    day: 'numeric',
    month: 'long' 
  });

  const stats = [
    { 
      label: 'Calorias', 
      value: dailyTotals.calories.toString(), 
      target: nutritionData.dailyGoals.calories.toString(), 
      progress: Math.min((dailyTotals.calories / nutritionData.dailyGoals.calories) * 100, 100), 
      color: 'bg-primary' 
    },
    { 
      label: 'Proteínas', 
      value: `${dailyTotals.protein}g`, 
      target: `${nutritionData.dailyGoals.protein}g`, 
      progress: Math.min((dailyTotals.protein / nutritionData.dailyGoals.protein) * 100, 100), 
      color: 'bg-blue-500' 
    },
    { 
      label: 'Carboidratos', 
      value: `${dailyTotals.carbs}g`, 
      target: `${nutritionData.dailyGoals.carbs}g`, 
      progress: Math.min((dailyTotals.carbs / nutritionData.dailyGoals.carbs) * 100, 100), 
      color: 'bg-orange-500' 
    },
    { 
      label: 'Gorduras', 
      value: `${dailyTotals.fat}g`, 
      target: `${nutritionData.dailyGoals.fat}g`, 
      progress: Math.min((dailyTotals.fat / nutritionData.dailyGoals.fat) * 100, 100), 
      color: 'bg-purple-500' 
    },
  ];

  const quickActions = [
    { 
      icon: Plus, 
      label: 'Adicionar Refeição', 
      color: 'bg-primary',
      action: () => onTabChange('nutrition')
    },
    { 
      icon: Dumbbell, 
      label: 'Novo Treino', 
      color: 'bg-blue-500',
      action: () => onTabChange('workouts')
    },
    { 
      icon: Target, 
      label: 'Ver Progresso', 
      color: 'bg-orange-500',
      action: () => onTabChange('progress')
    },
    { 
      icon: User, 
      label: 'Meu Perfil', 
      color: 'bg-purple-500',
      action: () => onTabChange('profile')
    },
  ];

  const overallProgress = Math.round(
    (dailyTotals.calories / nutritionData.dailyGoals.calories) * 100
  );

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6 space-y-6">
        <LoadingSkeleton variant="card" />
        <LoadingSkeleton variant="chart" />
        <div className="grid grid-cols-2 gap-4">
          <LoadingSkeleton variant="card" />
          <LoadingSkeleton variant="card" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-6 max-w-4xl">
      {/* Welcome Section */}
      <div className="animate-slide-up">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">Olá, João! 👋</h2>
            <p className="text-muted-foreground capitalize text-sm md:text-base">{today}</p>
          </div>
          <NotificationSystem />
        </div>
      </div>

      {/* Daily Progress Card */}
      <Card className="p-6 shadow-card hover:shadow-card-hover transition-smooth animate-scale-in">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Calendar className="text-primary" size={20} />
            Progresso do Dia
          </h3>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary">{overallProgress}%</div>
            <p className="text-sm text-muted-foreground">do objetivo</p>
          </div>
        </div>
        
        <div className="space-y-4">
          {stats.map((stat, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">{stat.label}</span>
                <span className="text-muted-foreground">{stat.value} / {stat.target}</span>
              </div>
              <Progress value={stat.progress} className="h-2" />
            </div>
          ))}
        </div>
      </Card>

      {/* Quick Actions */}
      <div className="animate-slide-up">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Zap className="text-primary" size={20} />
          Ações Rápidas
        </h3>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Card 
                key={index} 
                className="p-4 hover:shadow-card-hover transition-smooth cursor-pointer group"
                onClick={action.action}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-lg ${action.color} flex items-center justify-center group-hover:scale-110 transition-smooth`}>
                    <Icon size={20} className="text-white" />
                  </div>
                  <span className="font-medium text-sm">{action.label}</span>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Achievements Section */}
      <div className="animate-slide-up">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Trophy className="text-primary" size={20} />
            Conquistas Recentes
          </h3>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onTabChange('progress')}
          >
            Ver Todas
          </Button>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {achievements
            .filter(a => a.unlockedAt)
            .slice(-4)
            .map(achievement => (
              <AchievementBadge 
                key={achievement.id} 
                achievement={achievement} 
                size="sm" 
                showProgress={false}
              />
            ))}
        </div>
        
        <Card className="p-4 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-yellow-500/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-foreground">Progresso das Conquistas</p>
              <p className="text-sm text-muted-foreground">
                {achievementProgress.unlocked} de {achievementProgress.total} desbloqueadas
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-yellow-600">
                {Math.round(achievementProgress.percentage)}%
              </div>
              <Progress 
                value={achievementProgress.percentage} 
                className="w-24 h-2 mt-1" 
              />
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="p-6 shadow-card animate-slide-up">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="text-primary" size={20} />
          Atividade Recente
        </h3>
        <div className="space-y-4">
          {nutritionData.items.slice(-3).reverse().map((item, index) => (
            <div key={index} className="flex items-center justify-between py-2 border-b border-border/50">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Apple size={16} className="text-primary" />
                </div>
                <div>
                  <p className="font-medium text-sm">{item.food.name} adicionado</p>
                  <p className="text-xs text-muted-foreground">
                    {item.mealType === 'breakfast' ? 'Café da manhã' :
                     item.mealType === 'lunch' ? 'Almoço' :
                     item.mealType === 'snack' ? 'Lanche' : 'Jantar'}
                  </p>
                </div>
              </div>
              <span className="text-sm font-medium text-primary">
                +{Math.round((item.food.calories_per_100g * item.quantity) / 100)} cal
              </span>
            </div>
          ))}
          
          {nutritionData.items.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Apple size={32} className="mx-auto mb-2 opacity-30" />
              <p>Nenhuma atividade recente</p>
              <p className="text-xs">Adicione seus primeiros alimentos!</p>
            </div>
          )}
        </div>
      </Card>

      {/* Achievement Notifications */}
      {newUnlocks.map(achievement => (
        <AchievementNotification
          key={achievement.id}
          achievement={achievement}
          onDismiss={clearNewUnlocks}
        />
      ))}
    </div>
  );
};

export default Dashboard;
