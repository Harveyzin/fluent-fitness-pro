import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { Card } from '@/components/ui/card';
import { useProgress } from '@/contexts/ProgressContext';

interface ProgressChartProps {
  type: 'weight' | 'calories' | 'workouts' | 'macros';
  title: string;
  height?: number;
}

const ProgressChart = ({ type, title, height = 300 }: ProgressChartProps) => {
  const { bodyProgress, workoutProgress, nutritionProgress, getFilteredData } = useProgress();

  const formatData = () => {
    switch (type) {
      case 'weight':
        return getFilteredData(bodyProgress).map(entry => ({
          date: entry.date.toLocaleDateString('pt-BR'),
          weight: entry.weight,
          bodyFat: entry.bodyFat || 0
        }));
      
      case 'calories':
        return getFilteredData(nutritionProgress).map(entry => ({
          date: entry.date.toLocaleDateString('pt-BR'),
          calories: entry.calories,
          target: 2200 // Meta de calorias
        }));
      
      case 'workouts':
        return getFilteredData(workoutProgress).map(entry => ({
          date: entry.date.toLocaleDateString('pt-BR'),
          duration: entry.duration,
          calories: entry.caloriesBurned,
          volume: entry.volume
        }));
      
      case 'macros':
        const latestNutrition = nutritionProgress[nutritionProgress.length - 1];
        if (!latestNutrition) return [];
        return [
          { name: 'Proteínas', value: latestNutrition.protein, color: '#10b981' },
          { name: 'Carboidratos', value: latestNutrition.carbs, color: '#3b82f6' },
          { name: 'Gorduras', value: latestNutrition.fat, color: '#f59e0b' }
        ];
      
      default:
        return [];
    }
  };

  const renderChart = () => {
    const data = formatData();

    switch (type) {
      case 'weight':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="date" 
                className="text-xs"
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                className="text-xs"
                tick={{ fontSize: 12 }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="weight" 
                stroke="hsl(var(--primary))" 
                strokeWidth={3}
                dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                name="Peso (kg)"
              />
              {data.some(d => d.bodyFat > 0) && (
                <Line 
                  type="monotone" 
                  dataKey="bodyFat" 
                  stroke="hsl(var(--secondary))" 
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--secondary))', strokeWidth: 2, r: 3 }}
                  name="Gordura (%)"
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        );

      case 'calories':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="date" 
                className="text-xs"
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                className="text-xs"
                tick={{ fontSize: 12 }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="calories" fill="hsl(var(--primary))" name="Calorias" radius={[4, 4, 0, 0]} />
              <Line 
                type="monotone" 
                dataKey="target" 
                stroke="hsl(var(--destructive))" 
                strokeWidth={2}
                strokeDasharray="5 5"
                name="Meta"
              />
            </BarChart>
          </ResponsiveContainer>
        );

      case 'workouts':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="date" 
                className="text-xs"
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                className="text-xs"
                tick={{ fontSize: 12 }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="duration" 
                stroke="hsl(var(--primary))" 
                strokeWidth={3}
                dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                name="Duração (min)"
              />
              <Line 
                type="monotone" 
                dataKey="calories" 
                stroke="hsl(var(--secondary))" 
                strokeWidth={2}
                dot={{ fill: 'hsl(var(--secondary))', strokeWidth: 2, r: 3 }}
                name="Calorias"
              />
            </LineChart>
          </ResponsiveContainer>
        );

      case 'macros':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        );

      default:
        return <div>Tipo de gráfico não suportado</div>;
    }
  };

  return (
    <Card className="p-6 shadow-card">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      {renderChart()}
    </Card>
  );
};

export default ProgressChart;