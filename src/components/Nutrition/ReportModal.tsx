
import React, { useState } from 'react';
import { BarChart3, X, Calendar, TrendingUp, Target } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useNutrition } from '@/contexts/NutritionContext';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ReportModal: React.FC<ReportModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('today');
  const { getDailyTotals, nutritionData } = useNutrition();
  const dailyTotals = getDailyTotals();

  const tabs = [
    { id: 'today', label: 'Hoje', icon: Calendar },
    { id: 'week', label: 'Semana', icon: TrendingUp },
    { id: 'goals', label: 'Metas', icon: Target }
  ];

  const macroData = [
    { 
      name: 'Calorias', 
      current: dailyTotals.calories, 
      target: nutritionData.dailyGoals.calories, 
      unit: 'kcal',
      color: 'bg-fitflow-green',
      percentage: Math.round((dailyTotals.calories / nutritionData.dailyGoals.calories) * 100)
    },
    { 
      name: 'Proteínas', 
      current: dailyTotals.protein, 
      target: nutritionData.dailyGoals.protein, 
      unit: 'g',
      color: 'bg-blue-500',
      percentage: Math.round((dailyTotals.protein / nutritionData.dailyGoals.protein) * 100)
    },
    { 
      name: 'Carboidratos', 
      current: dailyTotals.carbs, 
      target: nutritionData.dailyGoals.carbs, 
      unit: 'g',
      color: 'bg-orange-500',
      percentage: Math.round((dailyTotals.carbs / nutritionData.dailyGoals.carbs) * 100)
    },
    { 
      name: 'Gorduras', 
      current: dailyTotals.fat, 
      target: nutritionData.dailyGoals.fat, 
      unit: 'g',
      color: 'bg-purple-500',
      percentage: Math.round((dailyTotals.fat / nutritionData.dailyGoals.fat) * 100)
    }
  ];

  const weeklyData = [
    { day: 'Seg', calories: 1850, target: 2200 },
    { day: 'Ter', calories: 2100, target: 2200 },
    { day: 'Qua', calories: 1950, target: 2200 },
    { day: 'Qui', calories: 2300, target: 2200 },
    { day: 'Sex', calories: 2000, target: 2200 },
    { day: 'Sáb', calories: 2400, target: 2200 },
    { day: 'Dom', calories: dailyTotals.calories, target: 2200 }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center">
      <div className="bg-white w-full max-w-md h-[90vh] rounded-t-2xl p-6 animate-slide-up overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Relatório Nutricional</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X size={20} />
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-muted rounded-lg mb-6">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-smooth ${
                  activeTab === tab.id
                    ? 'bg-white text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon size={14} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Today's Report */}
        {activeTab === 'today' && (
          <div className="space-y-4">
            <Card className="p-4">
              <h4 className="font-semibold mb-3">Resumo do Dia</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-fitflow-green">{dailyTotals.calories}</div>
                  <div className="text-sm text-muted-foreground">Calorias</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-500">{nutritionData.items.length}</div>
                  <div className="text-sm text-muted-foreground">Itens</div>
                </div>
              </div>
            </Card>

            <div className="space-y-3">
              <h4 className="font-semibold">Macronutrientes</h4>
              {macroData.map((macro, index) => (
                <Card key={index} className="p-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">{macro.name}</span>
                    <span className="text-sm text-muted-foreground">
                      {macro.current}{macro.unit} / {macro.target}{macro.unit}
                    </span>
                  </div>
                  <Progress value={Math.min(macro.percentage, 100)} className="h-2" />
                  <div className="text-right mt-1">
                    <span className={`text-xs font-semibold ${macro.percentage >= 100 ? 'text-green-600' : 'text-orange-600'}`}>
                      {macro.percentage}%
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Weekly Report */}
        {activeTab === 'week' && (
          <div className="space-y-4">
            <Card className="p-4">
              <h4 className="font-semibold mb-3">Últimos 7 Dias</h4>
              <div className="space-y-3">
                {weeklyData.map((day, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="w-8 text-sm font-medium">{day.day}</span>
                      <div className="flex-1">
                        <Progress 
                          value={(day.calories / day.target) * 100} 
                          className="h-2 w-32" 
                        />
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">{day.calories} kcal</div>
                      <div className="text-xs text-muted-foreground">
                        {Math.round((day.calories / day.target) * 100)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-4">
              <h4 className="font-semibold mb-2">Média Semanal</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-xl font-bold text-fitflow-green">
                    {Math.round(weeklyData.reduce((sum, day) => sum + day.calories, 0) / 7)}
                  </div>
                  <div className="text-sm text-muted-foreground">Calorias/dia</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-blue-500">86%</div>
                  <div className="text-sm text-muted-foreground">Meta atingida</div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Goals Tab */}
        {activeTab === 'goals' && (
          <div className="space-y-4">
            <Card className="p-4">
              <h4 className="font-semibold mb-3">Metas Atuais</h4>
              <div className="space-y-3">
                {macroData.map((macro, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="font-medium">{macro.name}</span>
                    <span className="text-sm">{macro.target}{macro.unit}</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-4">
              <h4 className="font-semibold mb-3">Progresso das Metas</h4>
              <div className="space-y-3">
                {macroData.map((macro, index) => (
                  <div key={index} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>{macro.name}</span>
                      <span className={macro.percentage >= 100 ? 'text-green-600' : 'text-orange-600'}>
                        {macro.percentage}%
                      </span>
                    </div>
                    <Progress value={Math.min(macro.percentage, 100)} className="h-2" />
                  </div>
                ))}
              </div>
            </Card>

            <Button className="w-full bg-fitflow-green hover:bg-fitflow-green/90">
              Ajustar Metas
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportModal;
