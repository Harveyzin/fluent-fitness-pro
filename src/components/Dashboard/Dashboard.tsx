
import React from 'react';
import { Calendar, Target, Zap, TrendingUp, Plus, Bell } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

const Dashboard = () => {
  const today = new Date().toLocaleDateString('pt-BR', { 
    weekday: 'long', 
    day: 'numeric',
    month: 'long' 
  });

  const stats = [
    { label: 'Calorias', value: '1,847', target: '2,200', progress: 84, color: 'bg-fitflow-green' },
    { label: 'Proteínas', value: '89g', target: '120g', progress: 74, color: 'bg-blue-500' },
    { label: 'Carboidratos', value: '156g', target: '200g', progress: 78, color: 'bg-orange-500' },
    { label: 'Gorduras', value: '67g', target: '80g', progress: 84, color: 'bg-purple-500' },
  ];

  const quickActions = [
    { icon: Plus, label: 'Adicionar Refeição', color: 'bg-fitflow-green' },
    { icon: Dumbbell, label: 'Novo Treino', color: 'bg-blue-500' },
    { icon: Target, label: 'Definir Meta', color: 'bg-orange-500' },
    { icon: TrendingUp, label: 'Ver Progresso', color: 'bg-purple-500' },
  ];

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Welcome Section */}
      <div className="animate-slide-up">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Olá, João! 👋</h2>
            <p className="text-muted-foreground capitalize">{today}</p>
          </div>
          <Button variant="ghost" size="sm" className="relative">
            <Bell size={20} />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
          </Button>
        </div>
      </div>

      {/* Daily Progress Card */}
      <Card className="p-6 shadow-card hover:shadow-card-hover transition-smooth animate-scale-in">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Calendar className="text-fitflow-green" size={20} />
            Progresso do Dia
          </h3>
          <div className="text-right">
            <div className="text-2xl font-bold text-fitflow-green">84%</div>
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
          <Zap className="text-fitflow-green" size={20} />
          Ações Rápidas
        </h3>
        <div className="grid grid-cols-2 gap-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Card key={index} className="p-4 hover:shadow-card-hover transition-smooth cursor-pointer group">
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

      {/* Recent Activity */}
      <Card className="p-6 shadow-card animate-slide-up">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="text-fitflow-green" size={20} />
          Atividade Recente
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-2 border-b border-border/50">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-fitflow-green/10 rounded-lg flex items-center justify-center">
                <Apple size={16} className="text-fitflow-green" />
              </div>
              <div>
                <p className="font-medium text-sm">Almoço adicionado</p>
                <p className="text-xs text-muted-foreground">há 2 horas</p>
              </div>
            </div>
            <span className="text-sm font-medium text-fitflow-green">+520 cal</span>
          </div>
          
          <div className="flex items-center justify-between py-2 border-b border-border/50">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center">
                <Dumbbell size={16} className="text-blue-500" />
              </div>
              <div>
                <p className="font-medium text-sm">Treino de Peito</p>
                <p className="text-xs text-muted-foreground">há 3 horas</p>
              </div>
            </div>
            <span className="text-sm font-medium text-blue-500">45 min</span>
          </div>
          
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-orange-500/10 rounded-lg flex items-center justify-center">
                <Target size={16} className="text-orange-500" />
              </div>
              <div>
                <p className="font-medium text-sm">Meta de água atingida</p>
                <p className="text-xs text-muted-foreground">há 4 horas</p>
              </div>
            </div>
            <span className="text-sm font-medium text-orange-500">2.5L</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;
