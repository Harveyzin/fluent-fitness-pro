import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { FileText, Download, Mail, Share2, Calendar as CalendarIcon, Printer } from 'lucide-react';
import { useProgress } from '@/contexts/ProgressContext';
import { useWorkout } from '@/contexts/WorkoutContext';
import { useNutrition } from '@/contexts/NutritionContext';
import { toast } from '@/hooks/use-toast';

interface ReportConfig {
  type: 'weekly' | 'monthly' | 'custom';
  categories: string[];
  startDate: Date;
  endDate: Date;
  format: 'pdf' | 'excel' | 'csv';
  includeCharts: boolean;
  includeSummary: boolean;
  includeGoals: boolean;
}

const ReportGenerator = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [config, setConfig] = useState<ReportConfig>({
    type: 'weekly',
    categories: ['workouts', 'nutrition', 'progress'],
    startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    endDate: new Date(),
    format: 'pdf',
    includeCharts: true,
    includeSummary: true,
    includeGoals: true,
  });

  const { bodyProgress, nutritionProgress, workoutProgress } = useProgress();
  const { workoutHistory } = useWorkout();
  const { nutritionData } = useNutrition();

  const generateReportData = () => {
    const data = {
      period: {
        start: config.startDate,
        end: config.endDate,
        type: config.type
      },
      summary: {
        totalWorkouts: workoutHistory.filter(w => 
          w.date >= config.startDate && w.date <= config.endDate
        ).length,
        totalCalories: nutritionProgress
          .filter(n => n.date >= config.startDate && n.date <= config.endDate)
          .reduce((sum, n) => sum + n.calories, 0),
        avgWeight: bodyProgress
          .filter(b => b.date >= config.startDate && b.date <= config.endDate)
          .reduce((sum, b, _, arr) => sum + b.weight / arr.length, 0),
        goalsAchieved: 0 // Simplified
      },
      workouts: config.categories.includes('workouts') ? workoutHistory.filter(w => 
        w.date >= config.startDate && w.date <= config.endDate
      ) : [],
      nutrition: config.categories.includes('nutrition') ? nutritionProgress.filter(n => 
        n.date >= config.startDate && n.date <= config.endDate
      ) : [],
      progress: config.categories.includes('progress') ? bodyProgress.filter(b => 
        b.date >= config.startDate && b.date <= config.endDate
      ) : [],
      goals: config.includeGoals ? nutritionData.dailyGoals : null,
    };

    return data;
  };

  const downloadPDF = async () => {
    const data = generateReportData();
    
    // Create a simple HTML report
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>FitFlow Pro - Relatório</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { background: #10b981; color: white; padding: 20px; border-radius: 8px; }
            .section { margin: 20px 0; padding: 15px; border: 1px solid #e5e7eb; border-radius: 8px; }
            .metric { display: inline-block; margin: 10px; padding: 10px; background: #f3f4f6; border-radius: 4px; }
            table { width: 100%; border-collapse: collapse; margin: 10px 0; }
            th, td { border: 1px solid #e5e7eb; padding: 8px; text-align: left; }
            th { background: #f9fafb; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>FitFlow Pro - Relatório de Progresso</h1>
            <p>Período: ${config.startDate.toLocaleDateString('pt-BR')} - ${config.endDate.toLocaleDateString('pt-BR')}</p>
          </div>
          
          ${config.includeSummary ? `
          <div class="section">
            <h2>Resumo Geral</h2>
            <div class="metric">
              <strong>Total de Treinos:</strong> ${data.summary.totalWorkouts}
            </div>
            <div class="metric">
              <strong>Calorias Consumidas:</strong> ${data.summary.totalCalories.toLocaleString('pt-BR')}
            </div>
            <div class="metric">
              <strong>Peso Médio:</strong> ${data.summary.avgWeight.toFixed(1)}kg
            </div>
          </div>
          ` : ''}

          ${config.categories.includes('workouts') ? `
          <div class="section">
            <h2>Histórico de Treinos</h2>
            <table>
              <tr>
                <th>Data</th>
                <th>Treino</th>
                <th>Duração</th>
                <th>Exercícios</th>
              </tr>
              ${data.workouts.map(workout => `
                <tr>
                  <td>${workout.date.toLocaleDateString('pt-BR')}</td>
                  <td>${workout.name}</td>
                  <td>${workout.duration}min</td>
                  <td>${workout.exercises}</td>
                </tr>
              `).join('')}
            </table>
          </div>
          ` : ''}

          ${config.categories.includes('nutrition') ? `
          <div class="section">
            <h2>Progresso Nutricional</h2>
            <table>
              <tr>
                <th>Data</th>
                <th>Calorias</th>
                <th>Proteínas</th>
                <th>Carboidratos</th>
                <th>Gorduras</th>
              </tr>
              ${data.nutrition.map(nutritionItem => `
                <tr>
                  <td>${nutritionItem.date.toLocaleDateString('pt-BR')}</td>
                  <td>${nutritionItem.calories}</td>
                  <td>${nutritionItem.protein}g</td>
                  <td>${nutritionItem.carbs}g</td>
                  <td>${nutritionItem.fat}g</td>
                </tr>
              `).join('')}
            </table>
          </div>
          ` : ''}
        </body>
      </html>
    `;

    // Create a blob and download
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fitflow-relatorio-${config.startDate.toISOString().split('T')[0]}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadCSV = () => {
    const data = generateReportData();
    let csvContent = "data:text/csv;charset=utf-8,";
    
    // Add workout data
    if (config.categories.includes('workouts')) {
      csvContent += "TREINOS\n";
      csvContent += "Data,Treino,Duração,Exercícios\n";
      data.workouts.forEach(workout => {
        csvContent += `${workout.date.toLocaleDateString('pt-BR')},${workout.name},${workout.duration},${workout.exercises}\n`;
      });
      csvContent += "\n";
    }

    // Add nutrition data
    if (config.categories.includes('nutrition')) {
      csvContent += "NUTRIÇÃO\n";
      csvContent += "Data,Calorias,Proteínas,Carboidratos,Gorduras\n";
      data.nutrition.forEach(nutritionEntry => {
        csvContent += `${nutritionEntry.date.toLocaleDateString('pt-BR')},${nutritionEntry.calories},${nutritionEntry.protein},${nutritionEntry.carbs},${nutritionEntry.fat}\n`;
      });
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `fitflow-dados-${config.startDate.toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const generateReport = async () => {
    setIsGenerating(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate processing
      
      if (config.format === 'pdf') {
        await downloadPDF();
      } else if (config.format === 'csv') {
        downloadCSV();
      }
      
      toast({
        title: "Relatório gerado!",
        description: `Seu relatório em ${config.format.toUpperCase()} foi baixado com sucesso.`,
      });
      
      setIsOpen(false);
    } catch (error) {
      toast({
        title: "Erro ao gerar relatório",
        description: "Tente novamente em alguns momentos.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <FileText size={16} />
          Gerar Relatório
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText size={20} />
            Gerador de Relatórios
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Tipo de Relatório</Label>
              <Select 
                value={config.type} 
                onValueChange={(value: 'weekly' | 'monthly' | 'custom') => setConfig(prev => ({ ...prev, type: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">Semanal</SelectItem>
                  <SelectItem value="monthly">Mensal</SelectItem>
                  <SelectItem value="custom">Personalizado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Formato</Label>
              <Select 
                value={config.format} 
                onValueChange={(value: 'pdf' | 'excel' | 'csv') => setConfig(prev => ({ ...prev, format: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="csv">CSV</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label>Categorias Incluídas</Label>
            <div className="grid grid-cols-3 gap-2 mt-2">
              {['workouts', 'nutrition', 'progress'].map(category => (
                <Button
                  key={category}
                  variant={config.categories.includes(category) ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    setConfig(prev => ({
                      ...prev,
                      categories: prev.categories.includes(category)
                        ? prev.categories.filter(c => c !== category)
                        : [...prev.categories, category]
                    }));
                  }}
                >
                  {category === 'workouts' && '🏋️ Treinos'}
                  {category === 'nutrition' && '🍎 Nutrição'}
                  {category === 'progress' && '📈 Progresso'}
                </Button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Data Início</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start">
                    <CalendarIcon size={16} className="mr-2" />
                    {config.startDate.toLocaleDateString('pt-BR')}
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  <Calendar
                    mode="single"
                    selected={config.startDate}
                    onSelect={(date) => date && setConfig(prev => ({ ...prev, startDate: date }))}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <Label>Data Fim</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start">
                    <CalendarIcon size={16} className="mr-2" />
                    {config.endDate.toLocaleDateString('pt-BR')}
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  <Calendar
                    mode="single"
                    selected={config.endDate}
                    onSelect={(date) => date && setConfig(prev => ({ ...prev, endDate: date }))}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <Card className="p-4 bg-muted/30">
            <h4 className="font-medium mb-2">Opções Adicionais</h4>
            <div className="space-y-2">
              {[
                { key: 'includeCharts', label: '📊 Incluir Gráficos' },
                { key: 'includeSummary', label: '📋 Incluir Resumo' },
                { key: 'includeGoals', label: '🎯 Incluir Metas' }
              ].map(option => (
                <Button
                  key={option.key}
                  variant={(config as any)[option.key] ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    setConfig(prev => ({
                      ...prev,
                      [option.key]: !(prev as any)[option.key]
                    }));
                  }}
                  className="w-full justify-start"
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </Card>

          <div className="flex gap-2">
            <Button
              onClick={generateReport}
              disabled={isGenerating || config.categories.length === 0}
              className="flex-1"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin mr-2 w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
                  Gerando...
                </>
              ) : (
                <>
                  <Download size={16} className="mr-2" />
                  Gerar Relatório
                </>
              )}
            </Button>
            
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancelar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReportGenerator;