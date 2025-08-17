import React from 'react';
import { Trash2 } from 'lucide-react';
import { RestrictedButton } from '@/components/ui/restricted-button';

interface MemoizedFoodItemProps {
  item: {
    food: {
      id: string;
      name: string;
      calories_per_100g: number;
    };
    quantity: number;
  };
  isTrainerMode: boolean;
  onRemove: (foodId: string) => void;
}

const MemoizedFoodItem = React.memo(({ item, isTrainerMode, onRemove }: MemoizedFoodItemProps) => {
  const calories = Math.round((item.food.calories_per_100g * item.quantity) / 100);
  
  return (
    <div className="flex items-center justify-between bg-gray-50 rounded p-2">
      <div className="flex-1">
        <span className="text-sm font-medium">{item.food.name}</span>
        <div className="text-xs text-muted-foreground">
          {item.quantity}g • {calories} kcal
        </div>
      </div>
      <RestrictedButton
        variant="ghost"
        size="sm"
        onClick={() => onRemove(item.food.id)}
        className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
        isRestricted={isTrainerMode}
        tooltip="Remover alimentos disponível apenas no modo personal"
      >
        <Trash2 size={14} />
      </RestrictedButton>
    </div>
  );
});

MemoizedFoodItem.displayName = 'MemoizedFoodItem';

export default MemoizedFoodItem;