
import React, { useState } from 'react';
import { Search, Plus, Camera, BarChart3, Clock } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';

const NutritionScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const meals = [
    {
      name: 'Café da Manhã',
      time: '08:00',
      calories: 320,
      items: ['Aveia com banana', 'Café com leite'],
      color: 'bg-orange-500'
    },
    {
      name: 'Almoço',
      time: '12:30',
      calories: 520,
      items: ['Frango grelhado', 'Arroz integral', 'Salada'],
      color: 'bg-fitflow-green'
    },
    {
      name: 'Lanche',
      time: '15:00',
      calories: 0,
      items: [],
      color: 'bg-blue-500'
    },
    {
      name: 'Jantar',
      time: '19:00',
      calories: 0,
      items: [],
      color: 'bg-purple-500'
    }
  ];

  const macros = [
    { name: 'Calorias', current: 840, target: 2200, unit: 'kcal', color: 'bg-fitflow-green' },
    { name: 'Proteínas', current: 45, target: 120, unit: 'g', color: 'bg-blue-500' },
    { name: 'Carboidratos', current: 89, target: 200, unit: 'g', color: 'bg-orange-500' },
    { name: 'Gorduras', current: 23, target: 80, unit: 'g', color: 'bg-purple-500' }
  ];

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="animate-slide-up">
        <h2 className="text-2xl font-bold mb-1">Nutrição</h2>
        <p className="text-muted-foreground">Acompanhe sua alimentação diária</p>
      </div>

      {/* Macros Overview */}
      <Card className="p-6 shadow-card animate-scale-in">
        <div className="grid grid-cols-2 gap-4">
          {macros.map((macro, index) => {
            const percentage = (macro.current / macro.target) * 100;
            return (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">{macro.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {macro.current}{macro.unit} / {macro.target}{macro.unit}
                  </span>
                </div>
                <Progress value={percentage} className="h-2" />
                <div className="text-right">
                  <span className="text-xs font-semibold text-fitflow-green">
                    {Math.round(percentage)}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Search Bar */}
      <div className="animate-slide-up">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
          <Input
            placeholder="Buscar alimentos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-12"
          />
        </div>
        
        <div className="flex gap-2 mt-4">
          <Button variant="outline" className="flex-1" size="sm">
            <Camera size={16} className="mr-2" />
            Scanner
          </Button>
          <Button variant="outline" className="flex-1" size="sm">
            <BarChart3 size={16} className="mr-2" />
            Relatório
          </Button>
        </div>
      </div>

      {/* Meals */}
      <div className="space-y-4 animate-slide-up">
        <h3 className="text-lg font-semibold">Refeições do Dia</h3>
        
        {meals.map((meal, index) => (
          <Card key={index} className="shadow-card hover:shadow-card-hover transition-smooth">
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${meal.color}`}></div>
                  <div>
                    <h4 className="font-semibold">{meal.name}</h4>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock size={12} />
                      {meal.time}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-fitflow-green">{meal.calories} kcal</div>
                  <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                    <Plus size={12} className="mr-1" />
                    Adicionar
                  </Button>
                </div>
              </div>
              
              {meal.items.length > 0 ? (
                <div className="space-y-1">
                  {meal.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="text-sm text-muted-foreground flex items-center justify-between">
                      <span>• {item}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-muted-foreground italic">
                  Nenhum alimento adicionado
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Quick Add Foods */}
      <Card className="p-4 shadow-card animate-slide-up">
        <h4 className="font-semibold mb-3">Alimentos Frequentes</h4>
        <div className="grid grid-cols-2 gap-2">
          {['Banana', 'Peito de Frango', 'Arroz Integral', 'Ovos'].map((food, index) => (
            <Button key={index} variant="outline" size="sm" className="justify-start">
              <Plus size={14} className="mr-2" />
              {food}
            </Button>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default NutritionScreen;
