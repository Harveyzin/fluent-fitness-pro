import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { useNutrition } from '@/contexts/NutritionContext';
import { useToast } from '@/hooks/use-toast';
import { Target, Zap, Wheat, Droplet } from 'lucide-react';

interface NutritionGoalsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NutritionGoalsModal = ({ isOpen, onClose }: NutritionGoalsModalProps) => {
  const { nutritionData, updateDailyGoals } = useNutrition();
  const { toast } = useToast();
  
  const [goals, setGoals] = useState({
    calories: nutritionData.dailyGoals.calories.toString(),
    protein: nutritionData.dailyGoals.protein.toString(),
    carbs: nutritionData.dailyGoals.carbs.toString(),
    fat: nutritionData.dailyGoals.fat.toString()
  });

  const handleSave = () => {
    const newGoals = {
      calories: parseInt(goals.calories),
      protein: parseInt(goals.protein),
      carbs: parseInt(goals.carbs),
      fat: parseInt(goals.fat)
    };

    updateDailyGoals(newGoals);
    toast({
      title: "Metas atualizadas",
      description: "Suas metas nutricionais foram salvas com sucesso."
    });
    onClose();
  };

  const calculateCaloriesFromMacros = () => {
    const protein = parseInt(goals.protein) || 0;
    const carbs = parseInt(goals.carbs) || 0;
    const fat = parseInt(goals.fat) || 0;
    return (protein * 4) + (carbs * 4) + (fat * 9);
  };

  const calculatedCalories = calculateCaloriesFromMacros();
  const targetCalories = parseInt(goals.calories) || 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Target className="text-fitflow-green" size={20} />
            Definir Metas Nutricionais
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="calories" className="flex items-center gap-2">
              <Zap size={16} className="text-orange-500" />
              Calorias (kcal)
            </Label>
            <Input
              id="calories"
              type="number"
              value={goals.calories}
              onChange={(e) => setGoals(prev => ({ ...prev, calories: e.target.value }))}
              placeholder="2200"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-2">
              <Label htmlFor="protein" className="flex items-center gap-1 text-xs">
                <Target size={12} className="text-red-500" />
                Proteína (g)
              </Label>
              <Input
                id="protein"
                type="number"
                value={goals.protein}
                onChange={(e) => setGoals(prev => ({ ...prev, protein: e.target.value }))}
                placeholder="120"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="carbs" className="flex items-center gap-1 text-xs">
                <Wheat size={12} className="text-blue-500" />
                Carboidratos (g)
              </Label>
              <Input
                id="carbs"
                type="number"
                value={goals.carbs}
                onChange={(e) => setGoals(prev => ({ ...prev, carbs: e.target.value }))}
                placeholder="200"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fat" className="flex items-center gap-1 text-xs">
                <Droplet size={12} className="text-purple-500" />
                Gordura (g)
              </Label>
              <Input
                id="fat"
                type="number"
                value={goals.fat}
                onChange={(e) => setGoals(prev => ({ ...prev, fat: e.target.value }))}
                placeholder="80"
              />
            </div>
          </div>

          {Math.abs(calculatedCalories - targetCalories) > 50 && (
            <Card className="p-3 bg-orange-50 border-orange-200">
              <p className="text-sm text-orange-800">
                ⚠️ Calorias dos macros ({calculatedCalories}) diferem da meta ({targetCalories})
              </p>
            </Card>
          )}

          <Card className="p-3 bg-muted/30">
            <h4 className="font-medium mb-2 text-sm">Distribuição Calórica</h4>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span>Proteína:</span>
                <span>{parseInt(goals.protein) * 4} kcal ({Math.round((parseInt(goals.protein) * 4 / targetCalories) * 100)}%)</span>
              </div>
              <div className="flex justify-between">
                <span>Carboidratos:</span>
                <span>{parseInt(goals.carbs) * 4} kcal ({Math.round((parseInt(goals.carbs) * 4 / targetCalories) * 100)}%)</span>
              </div>
              <div className="flex justify-between">
                <span>Gordura:</span>
                <span>{parseInt(goals.fat) * 9} kcal ({Math.round((parseInt(goals.fat) * 9 / targetCalories) * 100)}%)</span>
              </div>
            </div>
          </Card>

          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
            <Button onClick={handleSave} className="flex-1 bg-fitflow-green hover:bg-fitflow-green/90">
              Salvar Metas
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NutritionGoalsModal;