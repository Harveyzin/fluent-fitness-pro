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
  },
  {
    id: '5',
    name: 'Supino Inclinado',
    category: 'Peito',
    targetMuscles: ['Peitoral Superior', 'Tríceps', 'Deltoides'],
    instructions: [
      'Ajuste o banco em 30-45 graus',
      'Posicione-se com os pés firmes no chão',
      'Segure a barra com pegada média',
      'Desça controladamente até o peito superior',
      'Empurre explosivamente para cima'
    ]
  },
  {
    id: '6',
    name: 'Remada Curvada',
    category: 'Costas',
    targetMuscles: ['Latíssimo', 'Romboides', 'Trapézio'],
    instructions: [
      'Fique em pé com joelhos levemente flexionados',
      'Incline o tronco para frente mantendo as costas retas',
      'Segure a barra com pegada pronada',
      'Puxe a barra em direção ao abdômen',
      'Controle o movimento na descida'
    ]
  },
  {
    id: '7',
    name: 'Leg Press',
    category: 'Pernas',
    targetMuscles: ['Quadríceps', 'Glúteos'],
    instructions: [
      'Sente-se no equipamento com as costas apoiadas',
      'Posicione os pés na plataforma na largura dos ombros',
      'Desça controladamente até 90 graus',
      'Empurre a plataforma de volta à posição inicial'
    ]
  },
  {
    id: '8',
    name: 'Rosca Direta',
    category: 'Braços',
    targetMuscles: ['Bíceps'],
    instructions: [
      'Fique em pé com os pés na largura dos ombros',
      'Segure a barra com pegada supinada',
      'Mantenha os cotovelos fixos ao lado do corpo',
      'Flexione os braços levando a barra ao peito',
      'Desça controladamente'
    ]
  },
  {
    id: '9',
    name: 'Elevação Lateral',
    category: 'Ombros',
    targetMuscles: ['Deltoides Medial'],
    instructions: [
      'Fique em pé com halteres nas mãos',
      'Mantenha os braços ligeiramente flexionados',
      'Eleve os braços lateralmente até a altura dos ombros',
      'Desça controladamente'
    ]
  },
  {
    id: '10',
    name: 'Flexão de Braço',
    category: 'Peito',
    targetMuscles: ['Peitoral', 'Tríceps', 'Core'],
    instructions: [
      'Posicione-se em prancha com mãos na largura dos ombros',
      'Mantenha o corpo alinhado',
      'Desça o peito em direção ao chão',
      'Empurre de volta à posição inicial'
    ]
  },
  {
    id: '11',
    name: 'Prancha',
    category: 'Core',
    targetMuscles: ['Core', 'Ombros'],
    instructions: [
      'Posicione-se em prancha com antebraços no chão',
      'Mantenha o corpo reto da cabeça aos pés',
      'Contraia o abdômen',
      'Mantenha a posição pelo tempo determinado'
    ]
  },
  {
    id: '12',
    name: 'Burpees',
    category: 'Cardio',
    targetMuscles: ['Corpo Todo'],
    instructions: [
      'Comece em pé',
      'Agache e coloque as mãos no chão',
      'Salte os pés para trás em prancha',
      'Faça uma flexão',
      'Salte os pés de volta e pule para cima'
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
  },
  {
    id: '2',
    name: 'Treino de Costas e Bíceps',
    category: 'Superiores',
    difficulty: 'Intermediário',
    duration: '50-65 min',
    description: 'Desenvolvimento completo das costas e bíceps',
    exercises: [
      { ...defaultExercises[2], sets: 4, reps: '8-10', rest: '90s' },
      { id: '10', name: 'Remada Curvada', category: 'Costas', targetMuscles: ['Latíssimo', 'Romboides'], instructions: [], sets: 4, reps: '8-10', rest: '90s' },
      { id: '11', name: 'Pulldown', category: 'Costas', targetMuscles: ['Latíssimo'], instructions: [], sets: 3, reps: '10-12', rest: '75s' },
      { id: '12', name: 'Rosca Direta', category: 'Bíceps', targetMuscles: ['Bíceps'], instructions: [], sets: 4, reps: '10-12', rest: '60s' },
      { id: '13', name: 'Rosca Martelo', category: 'Bíceps', targetMuscles: ['Bíceps', 'Antebraço'], instructions: [], sets: 3, reps: '12-15', rest: '60s' },
      { id: '14', name: 'Rosca Concentrada', category: 'Bíceps', targetMuscles: ['Bíceps'], instructions: [], sets: 3, reps: '12-15', rest: '45s' }
    ]
  },
  {
    id: '3',
    name: 'Treino de Pernas Completo',
    category: 'Inferiores',
    difficulty: 'Intermediário',
    duration: '60-75 min',
    description: 'Treino completo para quadríceps, posterior e glúteos',
    exercises: [
      { ...defaultExercises[1], sets: 4, reps: '8-12', rest: '120s' },
      { id: '15', name: 'Leg Press', category: 'Pernas', targetMuscles: ['Quadríceps', 'Glúteos'], instructions: [], sets: 4, reps: '12-15', rest: '90s' },
      { id: '16', name: 'Stiff', category: 'Pernas', targetMuscles: ['Posterior', 'Glúteos'], instructions: [], sets: 4, reps: '10-12', rest: '90s' },
      { id: '17', name: 'Cadeira Extensora', category: 'Pernas', targetMuscles: ['Quadríceps'], instructions: [], sets: 3, reps: '12-15', rest: '60s' },
      { id: '18', name: 'Mesa Flexora', category: 'Pernas', targetMuscles: ['Posterior'], instructions: [], sets: 3, reps: '12-15', rest: '60s' },
      { id: '19', name: 'Panturrilha em Pé', category: 'Pernas', targetMuscles: ['Panturrilha'], instructions: [], sets: 4, reps: '15-20', rest: '45s' }
    ]
  },
  {
    id: '4',
    name: 'Treino de Ombros e Trapézio',
    category: 'Superiores',
    difficulty: 'Intermediário',
    duration: '40-50 min',
    description: 'Desenvolvimento completo dos deltoides e trapézio',
    exercises: [
      { ...defaultExercises[3], sets: 4, reps: '8-10', rest: '90s' },
      { id: '20', name: 'Elevação Lateral', category: 'Ombros', targetMuscles: ['Deltoides'], instructions: [], sets: 4, reps: '12-15', rest: '60s' },
      { id: '21', name: 'Elevação Posterior', category: 'Ombros', targetMuscles: ['Deltoides Posterior'], instructions: [], sets: 3, reps: '12-15', rest: '60s' },
      { id: '22', name: 'Encolhimento', category: 'Ombros', targetMuscles: ['Trapézio'], instructions: [], sets: 4, reps: '12-15', rest: '60s' },
      { id: '23', name: 'Elevação Frontal', category: 'Ombros', targetMuscles: ['Deltoides Anterior'], instructions: [], sets: 3, reps: '12-15', rest: '45s' }
    ]
  },
  {
    id: '5',
    name: 'HIIT Cardio',
    category: 'Cardio',
    difficulty: 'Avançado',
    duration: '25-30 min',
    description: 'Treino intervalado de alta intensidade para queima de gordura',
    exercises: [
      { id: '24', name: 'Burpees', category: 'Cardio', targetMuscles: ['Corpo Todo'], instructions: [], sets: 4, reps: '30s', rest: '30s' },
      { id: '25', name: 'Mountain Climbers', category: 'Cardio', targetMuscles: ['Core', 'Cardio'], instructions: [], sets: 4, reps: '30s', rest: '30s' },
      { id: '26', name: 'Jump Squats', category: 'Cardio', targetMuscles: ['Pernas', 'Cardio'], instructions: [], sets: 4, reps: '30s', rest: '30s' },
      { id: '27', name: 'High Knees', category: 'Cardio', targetMuscles: ['Cardio'], instructions: [], sets: 4, reps: '30s', rest: '30s' },
      { id: '28', name: 'Plank Jacks', category: 'Cardio', targetMuscles: ['Core', 'Cardio'], instructions: [], sets: 4, reps: '30s', rest: '30s' }
    ]
  },
  {
    id: '6',
    name: 'Treino Funcional',
    category: 'Full Body',
    difficulty: 'Iniciante',
    duration: '35-45 min',
    description: 'Exercícios funcionais para o dia a dia',
    exercises: [
      { id: '29', name: 'Agachamento Livre', category: 'Funcional', targetMuscles: ['Pernas', 'Core'], instructions: [], sets: 3, reps: '12-15', rest: '60s' },
      { id: '30', name: 'Flexão de Braço', category: 'Funcional', targetMuscles: ['Peito', 'Tríceps'], instructions: [], sets: 3, reps: '8-12', rest: '60s' },
      { id: '31', name: 'Prancha', category: 'Funcional', targetMuscles: ['Core'], instructions: [], sets: 3, reps: '30-60s', rest: '60s' },
      { id: '32', name: 'Afundo', category: 'Funcional', targetMuscles: ['Pernas', 'Glúteos'], instructions: [], sets: 3, reps: '10-12', rest: '60s' },
      { id: '33', name: 'Superman', category: 'Funcional', targetMuscles: ['Lombar', 'Glúteos'], instructions: [], sets: 3, reps: '12-15', rest: '45s' }
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
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed ? { ...parsed, startTime: new Date(parsed.startTime) } : null;
    }
    return null;
  });
  
  const [workoutHistory, setWorkoutHistory] = useState<CompletedWorkout[]>(() => {
    const saved = localStorage.getItem('fitflow-workout-history');
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.map((workout: any) => ({ ...workout, date: new Date(workout.date) }));
    }
    return [
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