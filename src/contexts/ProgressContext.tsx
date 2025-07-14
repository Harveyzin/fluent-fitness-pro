import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface ProgressEntry {
  date: Date;
  weight: number;
  bodyFat?: number;
  muscle?: number;
  measurements?: {
    chest: number;
    waist: number;
    hips: number;
    arms: number;
    thighs: number;
  };
}

export interface WorkoutProgress {
  date: Date;
  workoutName: string;
  duration: number;
  caloriesBurned: number;
  exercisesCompleted: number;
  volume: number; // total weight lifted
}

export interface NutritionProgress {
  date: Date;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  water: number; // in ml
}

export type TimeFilter = '7d' | '30d' | '90d' | '1y' | 'all';

interface ProgressContextType {
  bodyProgress: ProgressEntry[];
  workoutProgress: WorkoutProgress[];
  nutritionProgress: NutritionProgress[];
  timeFilter: TimeFilter;
  addBodyProgress: (entry: Omit<ProgressEntry, 'date'>) => void;
  addWorkoutProgress: (entry: Omit<WorkoutProgress, 'date'>) => void;
  addNutritionProgress: (entry: Omit<NutritionProgress, 'date'>) => void;
  setTimeFilter: (filter: TimeFilter) => void;
  getFilteredData: <T extends { date: Date }>(data: T[]) => T[];
  generateReport: (type: 'body' | 'workout' | 'nutrition') => any;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export const useProgress = () => {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
};

// Sample data
const sampleBodyProgress: ProgressEntry[] = [
  { date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), weight: 75.2, bodyFat: 18.5 },
  { date: new Date(Date.now() - 23 * 24 * 60 * 60 * 1000), weight: 74.8, bodyFat: 18.2 },
  { date: new Date(Date.now() - 16 * 24 * 60 * 60 * 1000), weight: 74.5, bodyFat: 17.9 },
  { date: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000), weight: 74.2, bodyFat: 17.6 },
  { date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), weight: 73.9, bodyFat: 17.3 }
];

const sampleWorkoutProgress: WorkoutProgress[] = [
  { date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), workoutName: 'Peito e Tríceps', duration: 52, caloriesBurned: 320, exercisesCompleted: 6, volume: 2450 },
  { date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), workoutName: 'Costas e Bíceps', duration: 48, caloriesBurned: 298, exercisesCompleted: 7, volume: 2280 },
  { date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), workoutName: 'Pernas', duration: 65, caloriesBurned: 415, exercisesCompleted: 8, volume: 3120 }
];

const sampleNutritionProgress: NutritionProgress[] = [
  { date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), calories: 2150, protein: 145, carbs: 220, fat: 85, water: 2500 },
  { date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), calories: 2200, protein: 150, carbs: 240, fat: 88, water: 2800 },
  { date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), calories: 1980, protein: 135, carbs: 195, fat: 82, water: 2200 }
];

export const ProgressProvider = ({ children }: { children: ReactNode }) => {
  const [bodyProgress, setBodyProgress] = useState<ProgressEntry[]>(() => {
    const saved = localStorage.getItem('fitflow-body-progress');
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.map((entry: any) => ({ ...entry, date: new Date(entry.date) }));
    }
    return sampleBodyProgress;
  });
  
  const [workoutProgress, setWorkoutProgress] = useState<WorkoutProgress[]>(() => {
    const saved = localStorage.getItem('fitflow-workout-progress');
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.map((entry: any) => ({ ...entry, date: new Date(entry.date) }));
    }
    return sampleWorkoutProgress;
  });
  
  const [nutritionProgress, setNutritionProgress] = useState<NutritionProgress[]>(() => {
    const saved = localStorage.getItem('fitflow-nutrition-progress');
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.map((entry: any) => ({ ...entry, date: new Date(entry.date) }));
    }
    return sampleNutritionProgress;
  });
  
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('30d');

  // Persist data to localStorage
  React.useEffect(() => {
    localStorage.setItem('fitflow-body-progress', JSON.stringify(bodyProgress));
  }, [bodyProgress]);

  React.useEffect(() => {
    localStorage.setItem('fitflow-workout-progress', JSON.stringify(workoutProgress));
  }, [workoutProgress]);

  React.useEffect(() => {
    localStorage.setItem('fitflow-nutrition-progress', JSON.stringify(nutritionProgress));
  }, [nutritionProgress]);

  const addBodyProgress = (entry: Omit<ProgressEntry, 'date'>) => {
    setBodyProgress(prev => [...prev, { ...entry, date: new Date() }]);
  };

  const addWorkoutProgress = (entry: Omit<WorkoutProgress, 'date'>) => {
    setWorkoutProgress(prev => [...prev, { ...entry, date: new Date() }]);
  };

  const addNutritionProgress = (entry: Omit<NutritionProgress, 'date'>) => {
    setNutritionProgress(prev => [...prev, { ...entry, date: new Date() }]);
  };

  const getFilteredData = <T extends { date: Date }>(data: T[]): T[] => {
    const now = new Date();
    const filterDays = {
      '7d': 7,
      '30d': 30,
      '90d': 90,
      '1y': 365,
      'all': Infinity
    };

    const days = filterDays[timeFilter];
    if (days === Infinity) return data;

    const cutoffDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
    return data.filter(entry => entry.date >= cutoffDate);
  };

  const generateReport = (type: 'body' | 'workout' | 'nutrition') => {
    switch (type) {
      case 'body':
        const filteredBody = getFilteredData(bodyProgress);
        return {
          totalEntries: filteredBody.length,
          weightChange: filteredBody.length > 1 ? 
            filteredBody[filteredBody.length - 1].weight - filteredBody[0].weight : 0,
          avgWeight: filteredBody.reduce((sum, entry) => sum + entry.weight, 0) / filteredBody.length
        };
      case 'workout':
        const filteredWorkouts = getFilteredData(workoutProgress);
        return {
          totalWorkouts: filteredWorkouts.length,
          totalDuration: filteredWorkouts.reduce((sum, entry) => sum + entry.duration, 0),
          totalCalories: filteredWorkouts.reduce((sum, entry) => sum + entry.caloriesBurned, 0),
          avgDuration: filteredWorkouts.reduce((sum, entry) => sum + entry.duration, 0) / filteredWorkouts.length
        };
      case 'nutrition':
        const filteredNutrition = getFilteredData(nutritionProgress);
        return {
          totalDays: filteredNutrition.length,
          avgCalories: filteredNutrition.reduce((sum, entry) => sum + entry.calories, 0) / filteredNutrition.length,
          avgProtein: filteredNutrition.reduce((sum, entry) => sum + entry.protein, 0) / filteredNutrition.length
        };
      default:
        return {};
    }
  };

  return (
    <ProgressContext.Provider value={{
      bodyProgress,
      workoutProgress,
      nutritionProgress,
      timeFilter,
      addBodyProgress,
      addWorkoutProgress,
      addNutritionProgress,
      setTimeFilter,
      getFilteredData,
      generateReport
    }}>
      {children}
    </ProgressContext.Provider>
  );
};