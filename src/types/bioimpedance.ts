export interface BioimpedanceData {
  id: string;
  studentId: string;
  date: Date;
  weight: number;
  height: number;
  bmi: number;
  bodyFatPercentage: number;
  muscleMass: number;
  boneMass: number;
  waterPercentage: number;
  basalMetabolicRate: number;
  visceralFat: number;
  metabolicAge: number;
  notes?: string;
}

export interface BioimpedanceGoals {
  targetWeight?: number;
  targetBodyFat?: number;
  targetMuscleMass?: number;
  targetDate?: Date;
}

export interface BioimpedanceProgress {
  current: BioimpedanceData;
  previous?: BioimpedanceData;
  trend: 'improving' | 'stable' | 'declining';
  changes: {
    weight: number;
    bodyFat: number;
    muscleMass: number;
  };
}