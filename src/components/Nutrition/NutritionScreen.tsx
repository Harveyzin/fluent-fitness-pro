
import React, { useState } from 'react';
import { Search, Plus, Camera, BarChart3, Clock, Trash2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import ProgressChart from '@/components/Charts/ProgressChart';
import { useNutrition } from '@/contexts/NutritionContext';
import AddFoodModal from './AddFoodModal';
import ScannerModal from './ScannerModal';
import ReportModal from './ReportModal';

const NutritionScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [scannerOpen, setScannerOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [selectedMealType, setSelectedMealType] = useState<'breakfast' | 'lunch' | 'snack' | 'dinner'>('breakfast');
  
  const { nutritionData, getDailyTotals, getTotalsByMeal, removeMealItem, searchFoods, addMealItem } = useNutrition();
  const dailyTotals = getDailyTotals();

  const meals = [
    {
      id: 'breakfast',
      name: 'Café da Manhã',
      time: '08:00',
      color: 'bg-orange-500'
    },
    {
      id: 'lunch',
      name: 'Almoço',
      time: '12:30',
      color: 'bg-fitflow-green'
    },
    {
      id: 'snack',
      name: 'Lanche',
      time: '15:00',
      color: 'bg-blue-500'
    },
    {
      id: 'dinner',
      name: 'Jantar',
      time: '19:00',
      color: 'bg-purple-500'
    }
  ];

  const macros = [
    { 
      name: 'Calorias', 
      current: dailyTotals.calories, 
      target: nutritionData.dailyGoals.calories, 
      unit: 'kcal', 
      color: 'bg-fitflow-green' 
    },
    { 
      name: 'Proteínas', 
      current: dailyTotals.protein, 
      target: nutritionData.dailyGoals.protein, 
      unit: 'g', 
      color: 'bg-blue-500' 
    },
    { 
      name: 'Carboidratos', 
      current: dailyTotals.carbs, 
      target: nutritionData.dailyGoals.carbs, 
      unit: 'g', 
      color: 'bg-orange-500' 
    },
    { 
      name: 'Gorduras', 
      current: dailyTotals.fat, 
      target: nutritionData.dailyGoals.fat, 
      unit: 'g', 
      color: 'bg-purple-500' 
    }
  ];

  const handleAddFood = (mealType: 'breakfast' | 'lunch' | 'snack' | 'dinner') => {
    setSelectedMealType(mealType);
    setModalOpen(true);
  };

  const handleQuickAdd = (foodName: string) => {
    const foods = searchFoods(foodName);
    if (foods.length > 0) {
      addMealItem({
        food: foods[0],
        quantity: 100,
        mealType: 'snack'
      });
    }
  };

  const searchResults = searchQuery ? searchFoods(searchQuery) : [];

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="animate-slide-up">
        <h2 className="text-2xl font-bold mb-1">Nutrição</h2>
        <p className="text-muted-foreground">Acompanhe sua alimentação diária</p>
      </div>

      {/* Macros Overview */}
      <Card className="p-6 shadow-card animate-scale-in">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Metas Diárias</h3>
          <Button variant="outline" size="sm" onClick={() => setGoalsOpen(true)}>
            <Target size={16} className="mr-2" />
            Ajustar
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {macros.map((macro, index) => {
            const percentage = macro.target > 0 ? (macro.current / macro.target) * 100 : 0;
            return (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">{macro.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {macro.current}{macro.unit} / {macro.target}{macro.unit}
                  </span>
                </div>
                <Progress value={Math.min(percentage, 100)} className="h-2" />
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

      {/* Macros Chart */}
      <div className="animate-slide-up">
        <ProgressChart type="macros" title="Distribuição de Macronutrientes Hoje" height={250} />
      </div>

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
        
        {searchResults.length > 0 && (
          <Card className="mt-2 p-2 max-h-40 overflow-y-auto">
            {searchResults.map((food) => (
              <div 
                key={food.id} 
                className="p-2 hover:bg-gray-50 rounded cursor-pointer"
                onClick={() => {
                  setSelectedMealType('snack');
                  setModalOpen(true);
                }}
              >
                <div className="flex justify-between">
                  <span className="font-medium">{food.name}</span>
                  <span className="text-sm text-muted-foreground">{food.calories_per_100g} kcal/100g</span>
                </div>
              </div>
            ))}
          </Card>
        )}
        
        <div className="flex gap-2 mt-4">
          <Button 
            variant="outline" 
            className="flex-1" 
            size="sm"
            onClick={() => setScannerOpen(true)}
          >
            <Camera size={16} className="mr-2" />
            Scanner
          </Button>
          <Button 
            variant="outline" 
            className="flex-1" 
            size="sm"
            onClick={() => setReportOpen(true)}
          >
            <BarChart3 size={16} className="mr-2" />
            Relatório
          </Button>
        </div>
      </div>

      {/* Meals */}
      <div className="space-y-4 animate-slide-up">
        <h3 className="text-lg font-semibold">Refeições do Dia</h3>
        
        {meals.map((meal) => {
          const mealTotals = getTotalsByMeal(meal.id);
          const mealItems = nutritionData.items.filter(item => item.mealType === meal.id);
          
          return (
            <Card key={meal.id} className="shadow-card hover:shadow-card-hover transition-smooth">
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
                    <div className="font-semibold text-fitflow-green">{mealTotals.calories} kcal</div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 px-2 text-xs"
                      onClick={() => handleAddFood(meal.id as any)}
                    >
                      <Plus size={12} className="mr-1" />
                      Adicionar
                    </Button>
                  </div>
                </div>
                
                {mealItems.length > 0 ? (
                  <div className="space-y-2">
                    {mealItems.map((item, itemIndex) => (
                      <div key={itemIndex} className="flex items-center justify-between bg-gray-50 rounded p-2">
                        <div className="flex-1">
                          <span className="text-sm font-medium">{item.food.name}</span>
                          <div className="text-xs text-muted-foreground">
                            {item.quantity}g • {Math.round((item.food.calories_per_100g * item.quantity) / 100)} kcal
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeMealItem(item.food.id)}
                          className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                        >
                          <Trash2 size={14} />
                        </Button>
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
          );
        })}
      </div>

      {/* Quick Add Foods */}
      <Card className="p-4 shadow-card animate-slide-up">
        <h4 className="font-semibold mb-3">Alimentos Frequentes</h4>
        <div className="grid grid-cols-2 gap-2">
          {['Banana', 'Peito de Frango', 'Arroz Integral', 'Ovos'].map((food, index) => (
            <Button 
              key={index} 
              variant="outline" 
              size="sm" 
              className="justify-start"
              onClick={() => handleQuickAdd(food)}
            >
              <Plus size={14} className="mr-2" />
              {food}
            </Button>
          ))}
        </div>
      </Card>

      <AddFoodModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        mealType={selectedMealType}
      />

      <ScannerModal
        isOpen={scannerOpen}
        onClose={() => setScannerOpen(false)}
      />

      <ReportModal
        isOpen={reportOpen}
        onClose={() => setReportOpen(false)}
      />

      <NutritionGoalsModal
        isOpen={goalsOpen}
        onClose={() => setGoalsOpen(false)}
      />
    </div>
  );
};

export default NutritionScreen;
