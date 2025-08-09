import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Target, Zap, TrendingUp } from 'lucide-react';
import { useWorkout } from '@/contexts/WorkoutContext';

const WorkoutStatsCard = () => {
  const { workoutHistory } = useWorkout();

  const stats = {
    totalWorkouts: workoutHistory.length,
    totalTime: workoutHistory.reduce((sum, w) => sum + w.duration, 0),
    totalReps: workoutHistory.reduce((sum, w) => sum + w.totalReps, 0),
    avgDuration: workoutHistory.length > 0 ? Math.round(workoutHistory.reduce((sum, w) => sum + w.duration, 0) / workoutHistory.length) : 0,
    thisWeek: workoutHistory.filter(w => {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return w.date >= weekAgo;
    }).length,
    streak: 7 // Simplified streak calculation
  };

  const statItems = [
    {
      icon: Target,
      label: 'Treinos Completos',
      value: stats.totalWorkouts,
      color: 'text-fitflow-green',
      bgColor: 'bg-fitflow-green/10'
    },
    {
      icon: Clock,
      label: 'Tempo Total',
      value: `${Math.floor(stats.totalTime / 60)}h ${stats.totalTime % 60}m`,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10'
    },
    {
      icon: Zap,
      label: 'Esta Semana',
      value: stats.thisWeek,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10'
    },
    {
      icon: TrendingUp,
      label: 'Sequência',
      value: `${stats.streak} dias`,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10'
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {statItems.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className="p-3 shadow-card">
            <div className="flex items-center gap-2">
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <Icon size={16} className={stat.color} />
              </div>
              <div>
                <div className="text-lg font-bold">{stat.value}</div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default WorkoutStatsCard;