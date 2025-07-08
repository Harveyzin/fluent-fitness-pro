
import React, { useState } from 'react';
import { Search, Plus, X } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNutrition, Food } from '@/contexts/NutritionContext';

interface AddFoodModalProps {
  isOpen: boolean;
  onClose: () => void;
  mealType: 'breakfast' | 'lunch' | 'snack' | 'dinner';
}

const AddFoodModal: React.FC<AddFoodModalProps> = ({ isOpen, onClose, mealType }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);
  const [quantity, setQuantity] = useState('100');
  const { searchFoods, addMealItem } = useNutrition();

  const searchResults = searchFoods(searchQuery);

  const handleAddFood = () => {
    if (selectedFood && quantity) {
      addMealItem({
        food: selectedFood,
        quantity: parseInt(quantity),
        mealType
      });
      setSelectedFood(null);
      setQuantity('100');
      setSearchQuery('');
      onClose();
    }
  };

  const calculateNutrients = (food: Food, qty: number) => ({
    calories: Math.round((food.calories_per_100g * qty) / 100),
    protein: Math.round((food.protein_per_100g * qty) / 100),
    carbs: Math.round((food.carbs_per_100g * qty) / 100),
    fat: Math.round((food.fat_per_100g * qty) / 100)
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center">
      <div className="bg-white w-full max-w-md h-[80vh] rounded-t-2xl p-6 animate-slide-up">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Adicionar Alimento</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X size={20} />
          </Button>
        </div>

        {!selectedFood ? (
          <>
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
              <Input
                placeholder="Buscar alimentos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto">
              {searchResults.map((food) => (
                <Card 
                  key={food.id} 
                  className="p-3 cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => setSelectedFood(food)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{food.name}</h4>
                      <p className="text-sm text-muted-foreground">{food.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{food.calories_per_100g} kcal</p>
                      <p className="text-xs text-muted-foreground">por 100g</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </>
        ) : (
          <div className="space-y-4">
            <Card className="p-4">
              <h4 className="font-semibold text-lg">{selectedFood.name}</h4>
              <p className="text-muted-foreground">{selectedFood.category}</p>
            </Card>

            <div>
              <Label htmlFor="quantity">Quantidade (gramas)</Label>
              <Input
                id="quantity"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="mt-1"
              />
            </div>

            {quantity && (
              <Card className="p-4">
                <h5 className="font-medium mb-2">Informações Nutricionais</h5>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>Calorias: <span className="font-medium">{calculateNutrients(selectedFood, parseInt(quantity)).calories} kcal</span></div>
                  <div>Proteínas: <span className="font-medium">{calculateNutrients(selectedFood, parseInt(quantity)).protein}g</span></div>
                  <div>Carboidratos: <span className="font-medium">{calculateNutrients(selectedFood, parseInt(quantity)).carbs}g</span></div>
                  <div>Gorduras: <span className="font-medium">{calculateNutrients(selectedFood, parseInt(quantity)).fat}g</span></div>
                </div>
              </Card>
            )}

            <div className="flex gap-2 pt-4">
              <Button variant="outline" onClick={() => setSelectedFood(null)} className="flex-1">
                Voltar
              </Button>
              <Button onClick={handleAddFood} className="flex-1">
                <Plus size={16} className="mr-2" />
                Adicionar
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddFoodModal;
