import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useBioimpedance } from '@/contexts/BioimpedanceContext';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface BioimpedanceChartProps {
  studentId: string;
}

export const BioimpedanceChart: React.FC<BioimpedanceChartProps> = ({ studentId }) => {
  const { getStudentData } = useBioimpedance();
  const [timeRange, setTimeRange] = useState<'3months' | '6months' | '1year' | 'all'>('6months');
  
  const allData = getStudentData(studentId);
  
  const filterDataByRange = () => {
    const now = new Date();
    const cutoffDate = new Date();
    
    switch (timeRange) {
      case '3months':
        cutoffDate.setMonth(now.getMonth() - 3);
        break;
      case '6months':
        cutoffDate.setMonth(now.getMonth() - 6);
        break;
      case '1year':
        cutoffDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        return allData;
    }
    
    return allData.filter(data => new Date(data.date) >= cutoffDate);
  };

  const chartData = filterDataByRange()
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map(data => ({
      ...data,
      dateFormatted: format(new Date(data.date), 'dd/MM', { locale: ptBR })
    }));

  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Gráfico de Evolução</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            Nenhuma medição encontrada para o período selecionado.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Evolução da Bioimpedância</CardTitle>
        <Select value={timeRange} onValueChange={(value: any) => setTimeRange(value)}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="3months">3 meses</SelectItem>
            <SelectItem value="6months">6 meses</SelectItem>
            <SelectItem value="1year">1 ano</SelectItem>
            <SelectItem value="all">Todos</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="weight" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="weight">Peso & IMC</TabsTrigger>
            <TabsTrigger value="composition">Composição</TabsTrigger>
            <TabsTrigger value="muscle">Massa Muscular</TabsTrigger>
            <TabsTrigger value="metabolism">Metabolismo</TabsTrigger>
          </TabsList>

          <TabsContent value="weight" className="space-y-4">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="dateFormatted" 
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis yAxisId="weight" orientation="left" />
                  <YAxis yAxisId="bmi" orientation="right" />
                  <Tooltip 
                    labelFormatter={(value, payload) => {
                      if (payload && payload[0]) {
                        return format(new Date(payload[0].payload.date), 'dd/MM/yyyy', { locale: ptBR });
                      }
                      return value;
                    }}
                  />
                  <Legend />
                  <Line 
                    yAxisId="weight"
                    type="monotone" 
                    dataKey="weight" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    name="Peso (kg)"
                  />
                  <Line 
                    yAxisId="bmi"
                    type="monotone" 
                    dataKey="bmi" 
                    stroke="hsl(var(--secondary))" 
                    strokeWidth={2}
                    name="IMC"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="composition" className="space-y-4">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="dateFormatted" tick={{ fontSize: 12 }} />
                  <YAxis />
                  <Tooltip 
                    labelFormatter={(value, payload) => {
                      if (payload && payload[0]) {
                        return format(new Date(payload[0].payload.date), 'dd/MM/yyyy', { locale: ptBR });
                      }
                      return value;
                    }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="bodyFatPercentage" 
                    stroke="#ef4444" 
                    strokeWidth={2}
                    name="Gordura (%)"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="waterPercentage" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    name="Água (%)"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="visceralFat" 
                    stroke="#f59e0b" 
                    strokeWidth={2}
                    name="Gordura Visceral"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="muscle" className="space-y-4">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="dateFormatted" tick={{ fontSize: 12 }} />
                  <YAxis />
                  <Tooltip 
                    labelFormatter={(value, payload) => {
                      if (payload && payload[0]) {
                        return format(new Date(payload[0].payload.date), 'dd/MM/yyyy', { locale: ptBR });
                      }
                      return value;
                    }}
                  />
                  <Legend />
                  <Bar dataKey="muscleMass" fill="hsl(var(--primary))" name="Massa Muscular (kg)" />
                  <Bar dataKey="boneMass" fill="hsl(var(--secondary))" name="Massa Óssea (kg)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="metabolism" className="space-y-4">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="dateFormatted" tick={{ fontSize: 12 }} />
                  <YAxis yAxisId="bmr" orientation="left" />
                  <YAxis yAxisId="age" orientation="right" />
                  <Tooltip 
                    labelFormatter={(value, payload) => {
                      if (payload && payload[0]) {
                        return format(new Date(payload[0].payload.date), 'dd/MM/yyyy', { locale: ptBR });
                      }
                      return value;
                    }}
                  />
                  <Legend />
                  <Line 
                    yAxisId="bmr"
                    type="monotone" 
                    dataKey="basalMetabolicRate" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    name="Taxa Metabólica (kcal)"
                  />
                  <Line 
                    yAxisId="age"
                    type="monotone" 
                    dataKey="metabolicAge" 
                    stroke="hsl(var(--destructive))" 
                    strokeWidth={2}
                    name="Idade Metabólica"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};