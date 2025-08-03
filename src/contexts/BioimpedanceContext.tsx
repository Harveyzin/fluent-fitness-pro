import React, { createContext, useContext, useState, ReactNode } from 'react';
import { BioimpedanceData, BioimpedanceGoals, BioimpedanceProgress } from '@/types/bioimpedance';

interface BioimpedanceContextType {
  data: BioimpedanceData[];
  goals: Record<string, BioimpedanceGoals>;
  addMeasurement: (measurement: Omit<BioimpedanceData, 'id' | 'bmi'>) => void;
  updateGoals: (studentId: string, goals: BioimpedanceGoals) => void;
  getStudentData: (studentId: string) => BioimpedanceData[];
  getStudentProgress: (studentId: string) => BioimpedanceProgress | null;
  getLatestMeasurement: (studentId: string) => BioimpedanceData | null;
}

const BioimpedanceContext = createContext<BioimpedanceContextType | undefined>(undefined);

export const useBioimpedance = (): BioimpedanceContextType => {
  const context = useContext(BioimpedanceContext);
  if (!context) {
    throw new Error('useBioimpedance must be used within a BioimpedanceProvider');
  }
  return context;
};

const calculateBMI = (weight: number, height: number): number => {
  const heightInMeters = height / 100;
  return Number((weight / (heightInMeters * heightInMeters)).toFixed(1));
};

export const BioimpedanceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [data, setData] = useState<BioimpedanceData[]>([
    {
      id: '1',
      studentId: '1',
      date: new Date('2024-01-01'),
      weight: 75.2,
      height: 175,
      bmi: 24.6,
      bodyFatPercentage: 18.5,
      muscleMass: 32.8,
      boneMass: 3.2,
      waterPercentage: 58.4,
      basalMetabolicRate: 1680,
      visceralFat: 8,
      metabolicAge: 28,
      notes: 'Início do programa'
    },
    {
      id: '2',
      studentId: '1',
      date: new Date('2024-01-15'),
      weight: 74.8,
      height: 175,
      bmi: 24.4,
      bodyFatPercentage: 17.8,
      muscleMass: 33.2,
      boneMass: 3.2,
      waterPercentage: 59.1,
      basalMetabolicRate: 1695,
      visceralFat: 7,
      metabolicAge: 27,
      notes: 'Evolução positiva'
    }
  ]);

  const [goals, setGoals] = useState<Record<string, BioimpedanceGoals>>({
    '1': {
      targetWeight: 72,
      targetBodyFat: 15,
      targetMuscleMass: 35,
      targetDate: new Date('2024-06-01')
    }
  });

  const addMeasurement = (measurement: Omit<BioimpedanceData, 'id' | 'bmi'>) => {
    const bmi = calculateBMI(measurement.weight, measurement.height);
    const newMeasurement: BioimpedanceData = {
      ...measurement,
      id: Date.now().toString(),
      bmi
    };
    setData(prev => [...prev, newMeasurement]);
  };

  const updateGoals = (studentId: string, newGoals: BioimpedanceGoals) => {
    setGoals(prev => ({
      ...prev,
      [studentId]: newGoals
    }));
  };

  const getStudentData = (studentId: string): BioimpedanceData[] => {
    return data.filter(measurement => measurement.studentId === studentId)
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  const getLatestMeasurement = (studentId: string): BioimpedanceData | null => {
    const studentData = getStudentData(studentId);
    return studentData.length > 0 ? studentData[0] : null;
  };

  const getStudentProgress = (studentId: string): BioimpedanceProgress | null => {
    const studentData = getStudentData(studentId);
    if (studentData.length < 1) return null;

    const current = studentData[0];
    const previous = studentData.length > 1 ? studentData[1] : undefined;

    if (!previous) {
      return {
        current,
        trend: 'stable',
        changes: { weight: 0, bodyFat: 0, muscleMass: 0 }
      };
    }

    const changes = {
      weight: current.weight - previous.weight,
      bodyFat: current.bodyFatPercentage - previous.bodyFatPercentage,
      muscleMass: current.muscleMass - previous.muscleMass
    };

    const trend = changes.bodyFat < -1 && changes.muscleMass > 0 ? 'improving' :
                 changes.bodyFat > 1 && changes.muscleMass < -0.5 ? 'declining' : 'stable';

    return { current, previous, trend, changes };
  };

  return (
    <BioimpedanceContext.Provider value={{
      data,
      goals,
      addMeasurement,
      updateGoals,
      getStudentData,
      getStudentProgress,
      getLatestMeasurement
    }}>
      {children}
    </BioimpedanceContext.Provider>
  );
};