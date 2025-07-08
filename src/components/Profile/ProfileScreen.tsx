
import React, { useState } from 'react';
import { User, Settings, Bell, Shield, HelpCircle, LogOut, Crown, Zap } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

const ProfileScreen = () => {
  const [isTrainerMode, setIsTrainerMode] = useState(false);
  const [notifications, setNotifications] = useState(true);

  const userStats = [
    { label: 'Dias Consecutivos', value: '7', color: 'text-fitflow-green' },
    { label: 'Treinos Completos', value: '45', color: 'text-blue-500' },
    { label: 'Calorias Queimadas', value: '12.4k', color: 'text-orange-500' },
    { label: 'Peso Perdido', value: '3.2kg', color: 'text-purple-500' }
  ];

  const trainerStats = [
    { label: 'Alunos Ativos', value: '23', color: 'text-fitflow-green' },
    { label: 'Treinos Criados', value: '156', color: 'text-blue-500' },
    { label: 'Avaliações', value: '4.9★', color: 'text-orange-500' },
    { label: 'Receita Mensal', value: 'R$ 2.8k', color: 'text-purple-500' }
  ];

  const menuItems = [
    { icon: Settings, label: 'Configurações', badge: null },
    { icon: Bell, label: 'Notificações', badge: null },
    { icon: Shield, label: 'Privacidade', badge: null },
    { icon: Crown, label: 'Plano Premium', badge: 'Novo' },
    { icon: HelpCircle, label: 'Ajuda & Suporte', badge: null },
  ];

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="animate-slide-up">
        <h2 className="text-2xl font-bold mb-1">Perfil</h2>
        <p className="text-muted-foreground">Gerencie sua conta e configurações</p>
      </div>

      {/* User Profile Card */}
      <Card className="p-6 shadow-card animate-scale-in">
        <div className="flex items-center gap-4 mb-4">
          <Avatar className="w-16 h-16">
            <AvatarFallback className="bg-fitflow-green text-white text-xl font-bold">
              JP
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="text-xl font-bold">João Paulo Silva</h3>
            <p className="text-muted-foreground">joao.silva@email.com</p>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="secondary" className="text-xs">
                {isTrainerMode ? 'Personal Trainer' : 'Usuário Premium'}
              </Badge>
              {!isTrainerMode && (
                <Badge className="bg-fitflow-green text-white text-xs">
                  <Crown size={10} className="mr-1" />
                  Premium
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Mode Switch */}
        <div className="border-t pt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Zap className={`${isTrainerMode ? 'text-fitflow-green' : 'text-muted-foreground'}`} size={20} />
              <div>
                <h4 className="font-semibold">Modo Personal Trainer</h4>
                <p className="text-sm text-muted-foreground">
                  {isTrainerMode ? 'Gerencie seus alunos e treinos' : 'Ative para acessar ferramentas profissionais'}
                </p>
              </div>
            </div>
            <Switch
              checked={isTrainerMode}
              onCheckedChange={setIsTrainerMode}
            />
          </div>
        </div>
      </Card>

      {/* Stats */}
      <Card className="p-6 shadow-card animate-slide-up">
        <h3 className="text-lg font-semibold mb-4">
          {isTrainerMode ? 'Estatísticas Profissionais' : 'Suas Estatísticas'}
        </h3>
        <div className="grid grid-cols-2 gap-4">
          {(isTrainerMode ? trainerStats : userStats).map((stat, index) => (
            <div key={index} className="text-center p-3 bg-muted/30 rounded-lg">
              <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
              <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* Trainer-specific Section */}
      {isTrainerMode && (
        <Card className="p-6 shadow-card animate-slide-up">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Crown className="text-fitflow-green" size={20} />
            Ferramentas do Personal
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="h-auto p-4 flex flex-col gap-2">
              <User size={24} className="text-fitflow-green" />
              <span className="text-sm font-medium">Meus Alunos</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col gap-2">
              <Settings size={24} className="text-blue-500" />
              <span className="text-sm font-medium">Criar Treino</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col gap-2">
              <Bell size={24} className="text-orange-500" />
              <span className="text-sm font-medium">Avaliações</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col gap-2">
              <Crown size={24} className="text-purple-500" />
              <span className="text-sm font-medium">Marketplace</span>
            </Button>
          </div>
        </Card>
      )}

      {/* Menu Items */}
      <div className="space-y-2 animate-slide-up">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <Card key={index} className="shadow-card hover:shadow-card-hover transition-smooth cursor-pointer">
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Icon size={20} className="text-muted-foreground" />
                  <span className="font-medium">{item.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  {item.badge && (
                    <Badge variant="secondary" className="text-xs">
                      {item.badge}
                    </Badge>
                  )}
                  {item.label === 'Notificações' && (
                    <Switch
                      checked={notifications}
                      onCheckedChange={setNotifications}
                      size="sm"
                    />
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Logout */}
      <Card className="shadow-card hover:shadow-card-hover transition-smooth cursor-pointer animate-slide-up">
        <div className="p-4 flex items-center gap-3">
          <LogOut size={20} className="text-red-500" />
          <span className="font-medium text-red-500">Sair da Conta</span>
        </div>
      </Card>

      {/* Version Info */}
      <div className="text-center text-sm text-muted-foreground animate-slide-up">
        FitFlow Pro v1.0.0
      </div>
    </div>
  );
};

export default ProfileScreen;
