
import React, { useState } from 'react';
import { TrendingUp, Calendar, Award, Target } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

const ProgressScreen = () => {
  const [timeRange, setTimeRange] = useState('week');

  const stats = [
    { label: 'Peso Atual', value: '78.5', unit: 'kg', change: '-1.2', trend: 'down' },
    { label: 'IMC', value: '24.8', unit: '', change: '-0.3', trend: 'down' },
    { label: 'Gordura Corporal', value: '12.5', unit: '%', change: '-0.8', trend: 'down' },
    { label: 'Massa Muscular', value: '68.7', unit: 'kg', change: '+0.5', trend: 'up' }
  ];

  const weeklyGoals = [
    { name: 'Treinos Realizados', current: 4, target: 5, percentage: 80 },
    { name: 'Calorias Queimadas', current: 2800, target: 3500, percentage: 80 },
    { name: 'Proteína Diária', current: 6, target: 7, percentage: 86 },
    { name: 'Hidratação', current: 18, target: 21, percentage: 86 }
  ];

  const achievements = [
    { name: 'Primeira Semana', icon: '🏃', date: 'Há 2 semanas', completed: true },
    { name: 'Meta de Peso', icon: '⚖️', date: 'Há 1 semana', completed: true },
    { name: 'Consistency King', icon: '👑', date: 'Ontem', completed: true },
    { name: 'Músculo de Ferro', icon: '💪', date: 'Em progresso', completed: false }
  ];

  const timeRanges = [
    { id: 'week', label: '7 dias' },
    { id: 'month', label: '30 dias' },
    { id: 'quarter', label: '90 dias' },
    { id: 'year', label: '1 ano' }
  ];

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="animate-slide-up">
        <h2 className="text-2xl font-bold mb-1">Progresso</h2>
        <p className="text-muted-foreground">Acompanhe sua evolução</p>
      </div>

      {/* Time Range Selector */}
      <div className="flex gap-1 p-1 bg-muted rounded-lg animate-scale-in">
        {timeRanges.map((range) => (
          <button
            key={range.id}
            onClick={() => setTimeRange(range.id)}
            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-smooth ${
              timeRange === range.id
                ? 'bg-white text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {range.label}
          </button>
        ))}
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-4 animate-slide-up">
        {stats.map((stat, index) => (
          <Card key={index} className="p-4 shadow-card">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold">{stat.value}</span>
                <span className="text-sm text-muted-foreground">{stat.unit}</span>
              </div>
              <div className={`flex items-center gap-1 text-xs ${
                stat.trend === 'up' ? 'text-fitflow-green' : 'text-blue-500'
              }`}>
                <TrendingUp size={12} className={stat.trend === 'down' ? 'rotate-180' : ''} />
                <span>{stat.change} esta semana</span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Weekly Goals */}
      <Card className="p-6 shadow-card animate-slide-up">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Target className="text-fitflow-green" size={20} />
            Metas da Semana
          </h3>
          <span className="text-sm text-muted-foreground">83% completo</span>
        </div>
        
        <div className="space-y-4">
          {weeklyGoals.map((goal, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">{goal.name}</span>
                <span className="text-muted-foreground">
                  {goal.current} / {goal.target}
                </span>
              </div>
              <Progress value={goal.percentage} className="h-2" />
            </div>
          ))}
        </div>
      </Card>

      {/* Chart Placeholder */}
      <Card className="p-6 shadow-card animate-slide-up">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="text-fitflow-green" size={20} />
          Evolução do Peso
        </h3>
        <div className="h-48 bg-muted/30 rounded-lg flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <TrendingUp size={48} className="mx-auto mb-2 opacity-50" />
            <p>Gráfico de evolução</p>
            <p className="text-sm">Em desenvolvimento</p>
          </div>
        </div>
      </Card>

      {/* Achievements */}
      <Card className="p-6 shadow-card animate-slide-up">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Award className="text-fitflow-green" size={20} />
          Conquistas
        </h3>
        
        <div className="grid grid-cols-2 gap-3">
          {achievements.map((achievement, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg border-2 transition-smooth ${
                achievement.completed
                  ? 'border-fitflow-green bg-fitflow-green/5'
                  : 'border-dashed border-muted-foreground/30 bg-muted/20'
              }`}
            >
              <div className="text-center">
                <div className="text-2xl mb-1">{achievement.icon}</div>
                <h4 className={`font-semibold text-sm ${
                  achievement.completed ? 'text-fitflow-green' : 'text-muted-foreground'
                }`}>
                  {achievement.name}
                </h4>
                <p className="text-xs text-muted-foreground mt-1">{achievement.date}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Activity Summary */}
      <Card className="p-6 shadow-card animate-slide-up">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Calendar className="text-fitflow-green" size={20} />
          Resumo de Atividades
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between py-2 border-b border-border/50">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-fitflow-green/10 rounded-lg flex items-center justify-center">
                <span className="text-sm font-bold text-fitflow-green">7</span>
              </div>
              <span className="font-medium">Dias consecutivos</span>
            </div>
            <span className="text-sm text-fitflow-green font-semibold">🔥 Streak!</span>
          </div>
          
          <div className="flex items-center justify-between py-2 border-b border-border/50">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center">
                <span className="text-sm font-bold text-blue-500">12</span>
              </div>
              <span className="font-medium">Treinos completados</span>
            </div>
            <span className="text-sm text-muted-foreground">Neste mês</span>
          </div>
          
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-orange-500/10 rounded-lg flex items-center justify-center">
                <span className="text-sm font-bold text-orange-500">85</span>
              </div>
              <span className="font-medium">Média de aderência</span>
            </div>
            <span className="text-sm text-orange-500 font-semibold">Muito bom!</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ProgressScreen;
