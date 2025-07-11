import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Exercise {
  id: string;
  name: string;
  category: string;
  targetMuscles: string[];
  instructions: string[];
  sets?: number;
  reps?: string;
  rest?: string;
  completed?: boolean;
}

export interface WorkoutTemplate {
  id: string;
  name: string;
  category: string;
  difficulty: string;
  duration: string;
  exercises: Exercise[];
  description?: string;
}

export interface ActiveWorkout {
  template: WorkoutTemplate;
  startTime: Date;
  currentExerciseIndex: number;
  currentSet: number;
  isResting: boolean;
  restTimeLeft: number;
  completedSets: { exerciseId: string; setNumber: number; reps: number; weight?: number }[];
}

export interface CompletedWorkout {
  id: string;
  templateId: string;
  name: string;
  date: Date;
  duration: number;
  exercises: number;
  completedSets: number;
  totalReps: number;
}

interface WorkoutContextType {
  // Templates
  workoutTemplates: WorkoutTemplate[];
  createWorkoutTemplate: (template: Omit<WorkoutTemplate, 'id'>) => void;
  deleteWorkoutTemplate: (id: string) => void;
  
  // Active workout
  activeWorkout: ActiveWorkout | null;
  startWorkout: (template: WorkoutTemplate) => void;
  endWorkout: () => void;
  nextExercise: () => void;
  completeSet: (reps: number, weight?: number) => void;
  startRest: () => void;
  skipRest: () => void;
  
  // History
  workoutHistory: CompletedWorkout[];
  
  // Exercise library
  exerciseLibrary: Exercise[];
}

const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);

export const useWorkout = () => {
  const context = useContext(WorkoutContext);
  if (!context) {
    throw new Error('useWorkout must be used within a WorkoutProvider');
  }
  return context;
};

const defaultExercises: Exercise[] = [
  {
    id: '1',
    name: 'Supino Reto',
    category: 'Peito',
    targetMuscles: ['Peitoral', 'Tríceps', 'Deltoides'],
    instructions: [
      'Deite no banco com os pés apoiados no chão',
      'Segure a barra com pegada ligeiramente mais larga que os ombros',
      'Desça a barra controladamente até tocar o peito',
      'Empurre a barra de volta à posição inicial'
    ]
  },
  {
    id: '2',
    name: 'Agachamento',
    category: 'Pernas',
    targetMuscles: ['Quadríceps', 'Glúteos', 'Posterior'],
    instructions: [
      'Posicione os pés na largura dos ombros',
      'Desça como se fosse sentar em uma cadeira',
      'Mantenha o tronco ereto e joelhos alinhados',
      'Suba controladamente à posição inicial'
    ]
  },
  {
    id: '3',
    name: 'Puxada Frontal',
    category: 'Costas',
    targetMuscles: ['Latíssimo', 'Bíceps', 'Romboides'],
    instructions: [
      'Sente-se no equipamento com joelhos fixos',
      'Segure a barra com pegada pronada',
      'Puxe a barra até a altura do peito',
      'Controle o movimento na volta'
    ]
  },
  {
    id: '4',
    name: 'Desenvolvimento Militar',
    category: 'Ombros',
    targetMuscles: ['Deltoides', 'Tríceps'],
    instructions: [
      'Fique em pé com os pés na largura dos ombros',
      'Segure as barras na altura dos ombros',
      'Empurre para cima até estender completamente',
      'Desça controladamente'
    ]
  }
];

const defaultTemplates: WorkoutTemplate[] = [
  {
    id: '1',
    name: 'Treino de Peito e Tríceps',
    category: 'Superiores',
    difficulty: 'Intermediário',
    duration: '45-60 min',
    description: 'Treino focado no desenvolvimento do peitoral e tríceps',
    exercises: [
      { ...defaultExercises[0], sets: 4, reps: '8-10', rest: '90s' },
      { id: '5', name: 'Supino Inclinado', category: 'Peito', targetMuscles: ['Peitoral'], instructions: [], sets: 3, reps: '10-12', rest: '90s' },
      { id: '6', name: 'Crucifixo', category: 'Peito', targetMuscles: ['Peitoral'], instructions: [], sets: 3, reps: '12-15', rest: '60s' },
      { id: '7', name: 'Mergulho', category: 'Tríceps', targetMuscles: ['Tríceps'], instructions: [], sets: 3, reps: '10-12', rest: '60s' },
      { id: '8', name: 'Tríceps Testa', category: 'Tríceps', targetMuscles: ['Tríceps'], instructions: [], sets: 4, reps: '10-12', rest: '60s' },
      { id: '9', name: 'Tríceps Corda', category: 'Tríceps', targetMuscles: ['Tríceps'], instructions: [], sets: 3, reps: '12-15', rest: '45s' }
    ]
  }
];

export const WorkoutProvider = ({ children }: { children: ReactNode }) => {
  const [workoutTemplates, setWorkoutTemplates] = useState<WorkoutTemplate[]>(() => {
    const saved = localStorage.getItem('fitflow-workout-templates');
    return saved ? JSON.parse(saved) : defaultTemplates;
  });
  
  const [activeWorkout, setActiveWorkout] = useState<ActiveWorkout | null>(() => {
    const saved = localStorage.getItem('fitflow-active-workout');
    return saved ? JSON.parse(saved) : null;
  });
  
  const [workoutHistory, setWorkoutHistory] = useState<CompletedWorkout[]>(() => {
    const saved = localStorage.getItem('fitflow-workout-history');
    return saved ? JSON.parse(saved) : [
      {
        id: '1',
        templateId: '1',
        name: 'Treino de Costas',
        date: new Date(Date.now() - 24 * 60 * 60 * 1000),
        duration: 52,
        exercises: 7,
        completedSets: 21,
        totalReps: 245
      },
      {
        id: '2',
        templateId: '1',
        name: 'Treino de Pernas',
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        duration: 68,
        exercises: 8,
        completedSets: 24,
        totalReps: 312
      }
    ];
  });
  
  const [exerciseLibrary] = useState<Exercise[]>(defaultExercises);

  // Persist data to localStorage
  React.useEffect(() => {
    localStorage.setItem('fitflow-workout-templates', JSON.stringify(workoutTemplates));
  }, [workoutTemplates]);

  React.useEffect(() => {
    localStorage.setItem('fitflow-active-workout', JSON.stringify(activeWorkout));
  }, [activeWorkout]);

  React.useEffect(() => {
    localStorage.setItem('fitflow-workout-history', JSON.stringify(workoutHistory));
  }, [workoutHistory]);

  const createWorkoutTemplate = (template: Omit<WorkoutTemplate, 'id'>) => {
    const newTemplate: WorkoutTemplate = {
      ...template,
      id: Date.now().toString()
    };
    setWorkoutTemplates(prev => [...prev, newTemplate]);
  };

  const deleteWorkoutTemplate = (id: string) => {
    setWorkoutTemplates(prev => prev.filter(t => t.id !== id));
  };

  const startWorkout = (template: WorkoutTemplate) => {
    setActiveWorkout({
      template,
      startTime: new Date(),
      currentExerciseIndex: 0,
      currentSet: 1,
      isResting: false,
      restTimeLeft: 0,
      completedSets: []
    });
  };

  const endWorkout = () => {
    if (activeWorkout) {
      const duration = Math.round((Date.now() - activeWorkout.startTime.getTime()) / 1000 / 60);
      const completedWorkout: CompletedWorkout = {
        id: Date.now().toString(),
        templateId: activeWorkout.template.id,
        name: activeWorkout.template.name,
        date: new Date(),
        duration,
        exercises: activeWorkout.template.exercises.length,
        completedSets: activeWorkout.completedSets.length,
        totalReps: activeWorkout.completedSets.reduce((sum, set) => sum + set.reps, 0)
      };
      
      setWorkoutHistory(prev => [completedWorkout, ...prev]);
    }
    setActiveWorkout(null);
  };

  const nextExercise = () => {
    if (!activeWorkout) return;
    
    setActiveWorkout(prev => prev ? {
      ...prev,
      currentExerciseIndex: prev.currentExerciseIndex + 1,
      currentSet: 1,
      isResting: false,
      restTimeLeft: 0
    } : null);
  };

  const completeSet = (reps: number, weight?: number) => {
    if (!activeWorkout) return;
    
    const currentExercise = activeWorkout.template.exercises[activeWorkout.currentExerciseIndex];
    const newCompletedSet = {
      exerciseId: currentExercise.id,
      setNumber: activeWorkout.currentSet,
      reps,
      weight
    };

    setActiveWorkout(prev => prev ? {
      ...prev,
      completedSets: [...prev.completedSets, newCompletedSet],
      currentSet: prev.currentSet + 1
    } : null);
  };

  const startRest = () => {
    if (!activeWorkout) return;
    
    const currentExercise = activeWorkout.template.exercises[activeWorkout.currentExerciseIndex];
    const restSeconds = parseInt(currentExercise.rest?.replace('s', '') || '60');
    
    setActiveWorkout(prev => prev ? {
      ...prev,
      isResting: true,
      restTimeLeft: restSeconds
    } : null);
  };

  const skipRest = () => {
    setActiveWorkout(prev => prev ? {
      ...prev,
      isResting: false,
      restTimeLeft: 0
    } : null);
  };

  return (
    <WorkoutContext.Provider value={{
      workoutTemplates,
      createWorkoutTemplate,
      deleteWorkoutTemplate,
      activeWorkout,
      startWorkout,
      endWorkout,
      nextExercise,
      completeSet,
      startRest,
      skipRest,
      workoutHistory,
      exerciseLibrary
    }}>
      {children}
    </WorkoutContext.Provider>
  );
};