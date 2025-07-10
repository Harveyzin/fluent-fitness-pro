import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Student {
  id: string;
  name: string;
  email: string;
  avatar: string;
  joinDate: string;
  lastWorkout: string;
  progress: number;
  plan: string;
  status: 'active' | 'inactive' | 'pending';
}

interface WorkoutTemplate {
  id: string;
  name: string;
  category: string;
  duration: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  exercises: number;
  description: string;
  price: number;
  rating: number;
  sales: number;
}

interface TrainerStats {
  totalStudents: number;
  activeStudents: number;
  totalWorkouts: number;
  monthlyRevenue: number;
  rating: number;
  completionRate: number;
}

interface TrainerContextType {
  students: Student[];
  workoutTemplates: WorkoutTemplate[];
  stats: TrainerStats;
  selectedStudent: Student | null;
  addStudent: (student: Omit<Student, 'id'>) => void;
  removeStudent: (studentId: string) => void;
  selectStudent: (student: Student | null) => void;
  createWorkoutTemplate: (template: Omit<WorkoutTemplate, 'id' | 'rating' | 'sales'>) => void;
  updateStudentProgress: (studentId: string, progress: number) => void;
}

const TrainerContext = createContext<TrainerContextType | undefined>(undefined);

export const useTrainer = (): TrainerContextType => {
  const context = useContext(TrainerContext);
  if (!context) {
    throw new Error('useTrainer must be used within a TrainerProvider');
  }
  return context;
};

export const TrainerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [students, setStudents] = useState<Student[]>([
    {
      id: '1',
      name: 'Ana Silva',
      email: 'ana.silva@email.com',
      avatar: 'AS',
      joinDate: '2024-01-15',
      lastWorkout: '2024-01-10',
      progress: 78,
      plan: 'Premium',
      status: 'active'
    },
    {
      id: '2',
      name: 'Carlos Santos',
      email: 'carlos.santos@email.com',
      avatar: 'CS',
      joinDate: '2024-02-01',
      lastWorkout: '2024-01-09',
      progress: 65,
      plan: 'Basic',
      status: 'active'
    },
    {
      id: '3',
      name: 'Maria Oliveira',
      email: 'maria.oliveira@email.com',
      avatar: 'MO',
      joinDate: '2024-01-20',
      lastWorkout: 'Never',
      progress: 0,
      plan: 'Premium',
      status: 'pending'
    }
  ]);

  const [workoutTemplates, setWorkoutTemplates] = useState<WorkoutTemplate[]>([
    {
      id: '1',
      name: 'HIIT Intenso',
      category: 'Cardio',
      duration: 30,
      difficulty: 'Advanced',
      exercises: 8,
      description: 'Treino de alta intensidade para queimar gordura',
      price: 29.99,
      rating: 4.8,
      sales: 156
    },
    {
      id: '2',
      name: 'Força Funcional',
      category: 'Strength',
      duration: 45,
      difficulty: 'Intermediate',
      exercises: 12,
      description: 'Desenvolvimento de força funcional para o dia a dia',
      price: 39.99,
      rating: 4.9,
      sales: 203
    }
  ]);

  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const stats: TrainerStats = {
    totalStudents: students.length,
    activeStudents: students.filter(s => s.status === 'active').length,
    totalWorkouts: 156,
    monthlyRevenue: 2850,
    rating: 4.9,
    completionRate: 87
  };

  const addStudent = (student: Omit<Student, 'id'>) => {
    const newStudent: Student = {
      ...student,
      id: Date.now().toString()
    };
    setStudents(prev => [...prev, newStudent]);
  };

  const removeStudent = (studentId: string) => {
    setStudents(prev => prev.filter(s => s.id !== studentId));
    if (selectedStudent?.id === studentId) {
      setSelectedStudent(null);
    }
  };

  const selectStudent = (student: Student | null) => {
    setSelectedStudent(student);
  };

  const createWorkoutTemplate = (template: Omit<WorkoutTemplate, 'id' | 'rating' | 'sales'>) => {
    const newTemplate: WorkoutTemplate = {
      ...template,
      id: Date.now().toString(),
      rating: 0,
      sales: 0
    };
    setWorkoutTemplates(prev => [...prev, newTemplate]);
  };

  const updateStudentProgress = (studentId: string, progress: number) => {
    setStudents(prev => prev.map(student => 
      student.id === studentId ? { ...student, progress } : student
    ));
  };

  return (
    <TrainerContext.Provider value={{
      students,
      workoutTemplates,
      stats,
      selectedStudent,
      addStudent,
      removeStudent,
      selectStudent,
      createWorkoutTemplate,
      updateStudentProgress
    }}>
      {children}
    </TrainerContext.Provider>
  );
};