
import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Food {
  id: string;
  name: string;
  calories_per_100g: number;
  protein_per_100g: number;
  carbs_per_100g: number;
  fat_per_100g: number;
  category: string;
}

export interface MealItem {
  food: Food;
  quantity: number; // in grams
  mealType: 'breakfast' | 'lunch' | 'snack' | 'dinner';
}

export interface NutritionData {
  items: MealItem[];
  dailyGoals: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

interface NutritionContextType {
  nutritionData: NutritionData;
  addMealItem: (item: MealItem) => void;
  removeMealItem: (itemId: string) => void;
  updateDailyGoals: (goals: Partial<NutritionData['dailyGoals']>) => void;
  getTotalsByMeal: (mealType: string) => {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  getDailyTotals: () => {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  searchFoods: (query: string) => Food[];
}

const NutritionContext = createContext<NutritionContextType | undefined>(undefined);

// Base de dados de alimentos simplificada
const FOODS_DATABASE: Food[] = [
  {
    id: '1',
    name: 'Banana',
    calories_per_100g: 89,
    protein_per_100g: 1.1,
    carbs_per_100g: 23,
    fat_per_100g: 0.3,
    category: 'Frutas'
  },
  {
    id: '2',
    name: 'Peito de Frango',
    calories_per_100g: 165,
    protein_per_100g: 31,
    carbs_per_100g: 0,
    fat_per_100g: 3.6,
    category: 'Proteínas'
  },
  {
    id: '3',
    name: 'Arroz Integral',
    calories_per_100g: 123,
    protein_per_100g: 2.6,
    carbs_per_100g: 23,
    fat_per_100g: 0.9,
    category: 'Carboidratos'
  },
  {
    id: '4',
    name: 'Ovos',
    calories_per_100g: 155,
    protein_per_100g: 13,
    carbs_per_100g: 1.1,
    fat_per_100g: 11,
    category: 'Proteínas'
  },
  {
    id: '5',
    name: 'Aveia',
    calories_per_100g: 389,
    protein_per_100g: 17,
    carbs_per_100g: 66,
    fat_per_100g: 7,
    category: 'Cereais'
  },
  {
    id: '6',
    name: 'Batata Doce',
    calories_per_100g: 86,
    protein_per_100g: 1.6,
    carbs_per_100g: 20,
    fat_per_100g: 0.1,
    category: 'Carboidratos'
  },
  {
    id: '7',
    name: 'Salmão',
    calories_per_100g: 208,
    protein_per_100g: 25,
    carbs_per_100g: 0,
    fat_per_100g: 12,
    category: 'Proteínas'
  },
  {
    id: '8',
    name: 'Brócolis',
    calories_per_100g: 34,
    protein_per_100g: 2.8,
    carbs_per_100g: 7,
    fat_per_100g: 0.4,
    category: 'Vegetais'
  }
];

export const NutritionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [nutritionData, setNutritionData] = useState<NutritionData>(() => {
    const saved = localStorage.getItem('fitflow-nutrition');
    return saved ? JSON.parse(saved) : {
      items: [],
      dailyGoals: {
        calories: 2200,
        protein: 120,
        carbs: 200,
        fat: 80
      }
    };
  });

  useEffect(() => {
    localStorage.setItem('fitflow-nutrition', JSON.stringify(nutritionData));
  }, [nutritionData]);

  const addMealItem = (item: MealItem) => {
    const newItem = {
      ...item,
      food: { ...item.food, id: `${item.food.id}-${Date.now()}` }
    };
    setNutritionData(prev => ({
      ...prev,
      items: [...prev.items, newItem]
    }));
  };

  const removeMealItem = (itemId: string) => {
    setNutritionData(prev => ({
      ...prev,
      items: prev.items.filter(item => item.food.id !== itemId)
    }));
  };

  const updateDailyGoals = (goals: Partial<NutritionData['dailyGoals']>) => {
    setNutritionData(prev => ({
      ...prev,
      dailyGoals: { ...prev.dailyGoals, ...goals }
    }));
  };

  const calculateNutrients = (food: Food, quantity: number) => ({
    calories: Math.round((food.calories_per_100g * quantity) / 100),
    protein: Math.round((food.protein_per_100g * quantity) / 100),
    carbs: Math.round((food.carbs_per_100g * quantity) / 100),
    fat: Math.round((food.fat_per_100g * quantity) / 100)
  });

  const getTotalsByMeal = (mealType: string) => {
    const mealItems = nutritionData.items.filter(item => item.mealType === mealType);
    return mealItems.reduce((totals, item) => {
      const nutrients = calculateNutrients(item.food, item.quantity);
      return {
        calories: totals.calories + nutrients.calories,
        protein: totals.protein + nutrients.protein,
        carbs: totals.carbs + nutrients.carbs,
        fat: totals.fat + nutrients.fat
      };
    }, { calories: 0, protein: 0, carbs: 0, fat: 0 });
  };

  const getDailyTotals = () => {
    return nutritionData.items.reduce((totals, item) => {
      const nutrients = calculateNutrients(item.food, item.quantity);
      return {
        calories: totals.calories + nutrients.calories,
        protein: totals.protein + nutrients.protein,
        carbs: totals.carbs + nutrients.carbs,
        fat: totals.fat + nutrients.fat
      };
    }, { calories: 0, protein: 0, carbs: 0, fat: 0 });
  };

  const searchFoods = (query: string): Food[] => {
    if (!query.trim()) return FOODS_DATABASE.slice(0, 8);
    
    return FOODS_DATABASE.filter(food =>
      food.name.toLowerCase().includes(query.toLowerCase()) ||
      food.category.toLowerCase().includes(query.toLowerCase())
    );
  };

  return (
    <NutritionContext.Provider value={{
      nutritionData,
      addMealItem,
      removeMealItem,
      updateDailyGoals,
      getTotalsByMeal,
      getDailyTotals,
      searchFoods
    }}>
      {children}
    </NutritionContext.Provider>
  );
};

export const useNutrition = () => {
  const context = useContext(NutritionContext);
  if (context === undefined) {
    throw new Error('useNutrition must be used within a NutritionProvider');
  }
  return context;
};
