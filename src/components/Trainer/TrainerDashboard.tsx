import React from 'react';
import { Users, TrendingUp, Star, DollarSign, Award, Target } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { useTrainer } from '@/contexts/TrainerContext';

interface TrainerDashboardProps {
  onManageStudents: () => void;
  onCreateWorkout: () => void;
  onMarketplace: () => void;
}

const TrainerDashboard = ({ onManageStudents, onCreateWorkout, onMarketplace }: TrainerDashboardProps) => {
  const { students, stats } = useTrainer();

  const recentStudents = students.slice(0, 3);

  const statCards = [
    {
      title: 'Alunos Ativos',
      value: stats.activeStudents,
      total: stats.totalStudents,
      icon: Users,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Treinos Criados',
      value: stats.totalWorkouts,
      icon: TrendingUp,
      color: 'text-fitflow-green',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Avaliação Média',
      value: `${stats.rating}★`,
      icon: Star,
      color: 'text-orange-500',
      bgColor: 'bg-orange-50'
    },
    {
      title: 'Receita Mensal',
      value: `R$ ${stats.monthlyRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="animate-slide-up">
        <h2 className="text-2xl font-bold mb-1">Dashboard do Personal</h2>
        <p className="text-muted-foreground">Gerencie seus alunos e treinos profissionalmente</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4 animate-scale-in">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="p-4 shadow-card">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <Icon size={20} className={stat.color} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-lg font-bold">
                    {stat.value}
                    {stat.total && <span className="text-sm text-muted-foreground">/{stat.total}</span>}
                  </p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <Card className="p-6 shadow-card animate-slide-up">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Target className="text-fitflow-green" size={20} />
          Ações Rápidas
        </h3>
        <div className="grid grid-cols-1 gap-3">
          <Button onClick={onManageStudents} className="h-auto p-4 justify-start gap-3">
            <Users size={20} />
            <div className="text-left">
              <div className="font-medium">Gerenciar Alunos</div>
              <div className="text-sm opacity-75">Visualizar progresso e adicionar novos alunos</div>
            </div>
          </Button>
          <Button onClick={onCreateWorkout} variant="outline" className="h-auto p-4 justify-start gap-3">
            <Award size={20} />
            <div className="text-left">
              <div className="font-medium">Criar Treino</div>
              <div className="text-sm text-muted-foreground">Desenvolver novos programas de exercícios</div>
            </div>
          </Button>
          <Button onClick={onMarketplace} variant="outline" className="h-auto p-4 justify-start gap-3">
            <DollarSign size={20} />
            <div className="text-left">
              <div className="font-medium">Marketplace</div>
              <div className="text-sm text-muted-foreground">Vender treinos e gerenciar produtos</div>
            </div>
          </Button>
        </div>
      </Card>

      {/* Recent Students */}
      <Card className="p-6 shadow-card animate-slide-up">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Alunos Recentes</h3>
          <Button variant="ghost" size="sm" onClick={onManageStudents}>
            Ver Todos
          </Button>
        </div>
        <div className="space-y-4">
          {recentStudents.map((student) => (
            <div key={student.id} className="flex items-center gap-4 p-3 bg-muted/30 rounded-lg">
              <Avatar className="w-10 h-10">
                <AvatarFallback className="bg-fitflow-green text-white text-sm font-bold">
                  {student.avatar}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-medium truncate">{student.name}</p>
                  <Badge 
                    variant={student.status === 'active' ? 'default' : 'secondary'} 
                    className="text-xs"
                  >
                    {student.status === 'active' ? 'Ativo' : 'Pendente'}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Progress value={student.progress} className="flex-1 h-2" />
                  <span className="text-xs text-muted-foreground">{student.progress}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default TrainerDashboard;