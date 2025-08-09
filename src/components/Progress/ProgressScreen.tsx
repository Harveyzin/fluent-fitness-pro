
import React, { useState } from 'react';
import { TrendingUp, Target, Calendar, Trophy, Plus, Filter, Download, BarChart3 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useProgress, TimeFilter } from '@/contexts/ProgressContext';
import ProgressChart from '@/components/Charts/ProgressChart';
import { useToast } from '@/hooks/use-toast';

const ProgressScreen = () => {
  const { timeFilter, setTimeFilter, generateReport, addBodyProgress } = useProgress();
  const { toast } = useToast();
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [showAddMeasurementDialog, setShowAddMeasurementDialog] = useState(false);
  const [newWeight, setNewWeight] = useState('');
  const [newBodyFat, setNewBodyFat] = useState('');

  const stats = [
    { label: 'Peso Atual', value: '73.5kg', change: '-2.1kg', positive: true },
    { label: 'IMC', value: '22.8', change: 'Normal', positive: true },
    { label: 'Gordura Corporal', value: '15.2%', change: '-1.8%', positive: true },
    { label: 'Massa Muscular', value: '62.1kg', change: '+0.7kg', positive: true }
  ];

  const weeklyGoals = [
    { name: 'Treinos', current: 4, target: 5, unit: 'treinos' },
    { name: 'Calorias', current: 2100, target: 2200, unit: 'kcal/dia' },
    { name: 'Proteína', current: 140, target: 150, unit: 'g/dia' },
    { name: 'Água', current: 2.2, target: 2.5, unit: 'L/dia' }
  ];

  const achievements = [
    { title: '7 Dias Consecutivos', description: 'Treinou por uma semana seguida', icon: '🔥', date: 'Hoje' },
    { title: 'Meta de Peso', description: 'Atingiu 74kg como planejado', icon: '🎯', date: 'Ontem' },
    { title: 'Personal Record', description: 'Novo recorde no supino: 80kg', icon: '💪', date: '3 dias atrás' }
  ];

  const handleAddMeasurement = () => {
    if (newWeight) {
      addBodyProgress({
        weight: parseFloat(newWeight),
        bodyFat: newBodyFat ? parseFloat(newBodyFat) : undefined
      });
      setNewWeight('');
      setNewBodyFat('');
      setShowAddMeasurementDialog(false);
      toast({
        title: "Medição adicionada",
        description: "Sua nova medição foi registrada com sucesso.",
      });
    }
  };

  const handleGenerateReport = (type: 'body' | 'workout' | 'nutrition') => {
    const report = generateReport(type);
    console.log('Relatório gerado:', report);
    toast({
      title: "Relatório gerado",
      description: `Relatório de ${type} foi processado com sucesso.`,
    });
  };

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between animate-slide-up">
        <div>
          <h2 className="text-2xl font-bold mb-1">Progresso</h2>
          <p className="text-muted-foreground">Acompanhe sua evolução</p>
        </div>
        <div className="flex gap-2">
          <Select value={timeFilter} onValueChange={(value: TimeFilter) => setTimeFilter(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">7 dias</SelectItem>
              <SelectItem value="30d">30 dias</SelectItem>
              <SelectItem value="90d">90 dias</SelectItem>
              <SelectItem value="1y">1 ano</SelectItem>
              <SelectItem value="all">Tudo</SelectItem>
            </SelectContent>
          </Select>
          <Dialog open={showReportDialog} onOpenChange={setShowReportDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <BarChart3 size={16} className="mr-2" />
                Relatórios
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Gerar Relatórios</DialogTitle>
              </DialogHeader>
              <div className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => {
                    handleGenerateReport('body');
                    setShowReportDialog(false);
                  }}
                >
                  <Download size={16} className="mr-2" />
                  Relatório Corporal
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => {
                    handleGenerateReport('workout');
                    setShowReportDialog(false);
                  }}
                >
                  <Download size={16} className="mr-2" />
                  Relatório de Treinos
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => {
                    handleGenerateReport('nutrition');
                    setShowReportDialog(false);
                  }}
                >
                  <Download size={16} className="mr-2" />
                  Relatório Nutricional
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          <Dialog open={showAddMeasurementDialog} onOpenChange={setShowAddMeasurementDialog}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus size={16} className="mr-2" />
                Nova Medição
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adicionar Nova Medição</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Peso (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newWeight}
                    onChange={(e) => setNewWeight(e.target.value)}
                    className="w-full p-2 border rounded-md"
                    placeholder="73.5"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Gordura Corporal (%) - Opcional</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newBodyFat}
                    onChange={(e) => setNewBodyFat(e.target.value)}
                    className="w-full p-2 border rounded-md"
                    placeholder="15.2"
                  />
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => setShowAddMeasurementDialog(false)}
                  >
                    Cancelar
                  </Button>
                  <Button 
                    className="flex-1"
                    onClick={handleAddMeasurement}
                    disabled={!newWeight}
                  >
                    Salvar
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-4 animate-slide-up">
        {stats.map((stat, index) => (
          <Card key={index} className="p-4 shadow-card">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold">{stat.value}</span>
              </div>
              <div className={`flex items-center gap-1 text-xs ${
                stat.positive ? 'text-fitflow-green' : 'text-blue-500'
              }`}>
                <TrendingUp size={12} className={!stat.positive ? 'rotate-180' : ''} />
                <span>{stat.change}</span>
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
          {weeklyGoals.map((goal, index) => {
            const percentage = Math.round((goal.current / goal.target) * 100);
            return (
              <div key={index} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{goal.name}</span>
                  <span className="text-muted-foreground">
                    {goal.current} / {goal.target} {goal.unit}
                  </span>
                </div>
                <Progress value={percentage} className="h-2" />
              </div>
            );
          })}
        </div>
      </Card>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-slide-up">
        <ProgressChart type="weight" title="Evolução do Peso" />
        <ProgressChart type="workouts" title="Performance nos Treinos" />
      </div>

      {/* Achievements */}
      <Card className="p-6 shadow-card animate-slide-up">
        <div className="flex items-center gap-3 mb-4">
          <Trophy className="text-yellow-500" size={24} />
          <h3 className="text-lg font-semibold">Conquistas Recentes</h3>
        </div>
        <div className="space-y-3">
          {achievements.map((achievement, index) => (
            <div key={index} className="flex items-center gap-4 p-3 bg-muted/30 rounded-lg">
              <div className="text-2xl">{achievement.icon}</div>
              <div className="flex-1">
                <h4 className="font-medium">{achievement.title}</h4>
                <p className="text-sm text-muted-foreground">{achievement.description}</p>
              </div>
              <Badge variant="secondary" className="text-xs">
                {achievement.date}
              </Badge>
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
