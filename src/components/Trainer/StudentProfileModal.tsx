import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  User, 
  Mail, 
  Calendar, 
  Activity, 
  TrendingUp, 
  Plus,
  Scale,
  Target,
  Award
} from 'lucide-react';
import { useTrainer } from '@/contexts/TrainerContext';
import { useBioimpedance } from '@/contexts/BioimpedanceContext';
import { BioimpedanceForm } from '@/components/Bioimpedance/BioimpedanceForm';
import { BioimpedanceChart } from '@/components/Bioimpedance/BioimpedanceChart';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

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

interface StudentProfileModalProps {
  student: Student | null;
  isOpen: boolean;
  onClose: () => void;
}

export const StudentProfileModal: React.FC<StudentProfileModalProps> = ({
  student,
  isOpen,
  onClose
}) => {
  const [showBioForm, setShowBioForm] = useState(false);
  const { getLatestMeasurement, getStudentProgress } = useBioimpedance();

  if (!student) return null;

  const latestMeasurement = getLatestMeasurement(student.id);
  const progress = getStudentProgress(student.id);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Ativo';
      case 'inactive': return 'Inativo';
      case 'pending': return 'Pendente';
      default: return status;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'declining': return <TrendingUp className="h-4 w-4 text-red-600 rotate-180" />;
      default: return <TrendingUp className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback>{student.avatar}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-semibold">{student.name}</h2>
              <p className="text-sm text-muted-foreground">{student.email}</p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="general" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="general">Informações Gerais</TabsTrigger>
            <TabsTrigger value="health">Anamnese</TabsTrigger>
            <TabsTrigger value="bioimpedance">Bioimpedância</TabsTrigger>
            <TabsTrigger value="progress">Progresso</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Dados Pessoais
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{student.email}</span>
                  </div>
                  {student.phone && (
                    <div className="flex items-center gap-2">
                      <span className="h-4 w-4 text-muted-foreground">📱</span>
                      <span className="text-sm">{student.phone}</span>
                    </div>
                  )}
                  {student.age && (
                    <div className="flex items-center gap-2">
                      <span className="h-4 w-4 text-muted-foreground">🎂</span>
                      <span className="text-sm">{student.age} anos</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      Desde {format(new Date(student.joinDate), 'dd/MM/yyyy', { locale: ptBR })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Último treino: {student.lastWorkout}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(student.status)}>
                      {getStatusText(student.status)}
                    </Badge>
                    <Badge variant="outline">{student.plan}</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Progresso Geral
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progresso geral</span>
                      <span>{student.progress}%</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${student.progress}%` }}
                      />
                    </div>
                    {progress && (
                      <div className="mt-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Tendência</span>
                          <div className="flex items-center gap-1">
                            {getTrendIcon(progress.trend)}
                            <span className="text-sm capitalize">{progress.trend}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {latestMeasurement && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Scale className="h-5 w-5" />
                    Última Medição de Bioimpedância
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold">{latestMeasurement.weight} kg</p>
                      <p className="text-sm text-muted-foreground">Peso</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold">{latestMeasurement.bmi}</p>
                      <p className="text-sm text-muted-foreground">IMC</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold">{latestMeasurement.bodyFatPercentage}%</p>
                      <p className="text-sm text-muted-foreground">Gordura</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold">{latestMeasurement.muscleMass} kg</p>
                      <p className="text-sm text-muted-foreground">Músculo</p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Medido em {format(new Date(latestMeasurement.date), 'dd/MM/yyyy', { locale: ptBR })}
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="health" className="space-y-4">
            <div className="grid gap-4">
              {/* Health Conditions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    🏥 Condições de Saúde
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {student.healthData?.conditions && student.healthData.conditions.length > 0 ? (
                    <div className="space-y-2">
                      {student.healthData.conditions.map((condition, index) => (
                        <div key={index} className="p-2 bg-red-50 border border-red-200 rounded text-sm">
                          {condition}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">Nenhuma condição de saúde reportada</p>
                  )}
                </CardContent>
              </Card>

              {/* Medications */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    💊 Medicamentos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {student.healthData?.medications && student.healthData.medications.length > 0 ? (
                    <div className="space-y-2">
                      {student.healthData.medications.map((medication, index) => (
                        <div key={index} className="p-2 bg-blue-50 border border-blue-200 rounded text-sm">
                          {medication}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">Nenhum medicamento em uso</p>
                  )}
                </CardContent>
              </Card>

              {/* Injuries and Limitations */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    🩹 Lesões e Limitações
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <h5 className="font-medium text-sm mb-2">Lesões:</h5>
                      {student.healthData?.injuries && student.healthData.injuries.length > 0 ? (
                        <div className="space-y-1">
                          {student.healthData.injuries.map((injury, index) => (
                            <div key={index} className="p-2 bg-orange-50 border border-orange-200 rounded text-sm">
                              {injury}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">Nenhuma lesão reportada</p>
                      )}
                    </div>
                    
                    <div>
                      <h5 className="font-medium text-sm mb-2">Limitações:</h5>
                      {student.fitnessData?.limitations && student.fitnessData.limitations.length > 0 ? (
                        <div className="space-y-1">
                          {student.fitnessData.limitations.map((limitation, index) => (
                            <div key={index} className="p-2 bg-yellow-50 border border-yellow-200 rounded text-sm">
                              {limitation}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">Nenhuma limitação reportada</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Emergency Contact */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    🚨 Contato de Emergência
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {student.healthData?.emergencyContact ? (
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Nome:</span>
                        <span className="text-sm font-medium">{student.healthData.emergencyContact.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Telefone:</span>
                        <span className="text-sm font-medium">{student.healthData.emergencyContact.phone}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Parentesco:</span>
                        <span className="text-sm font-medium">{student.healthData.emergencyContact.relationship}</span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">Contato de emergência não cadastrado</p>
                  )}
                </CardContent>
              </Card>

              {/* Fitness Goals and Preferences */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    🎯 Objetivos e Preferências
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <h5 className="font-medium text-sm mb-2">Objetivos:</h5>
                      {student.fitnessData?.goals && student.fitnessData.goals.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {student.fitnessData.goals.map((goal, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {goal}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">Objetivos não definidos</p>
                      )}
                    </div>
                    
                    <div>
                      <h5 className="font-medium text-sm mb-2">Preferências:</h5>
                      {student.fitnessData?.preferences && student.fitnessData.preferences.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {student.fitnessData.preferences.map((preference, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {preference}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">Preferências não definidas</p>
                      )}
                    </div>

                    <div>
                      <h5 className="font-medium text-sm mb-2">Experiência:</h5>
                      <Badge className="text-xs">
                        {student.fitnessData?.experience === 'beginner' ? 'Iniciante' :
                         student.fitnessData?.experience === 'intermediate' ? 'Intermediário' :
                         student.fitnessData?.experience === 'advanced' ? 'Avançado' : 'Não definido'}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="bioimpedance" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Histórico de Bioimpedância</h3>
              <Button 
                onClick={() => setShowBioForm(!showBioForm)}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Nova Medição
              </Button>
            </div>

            {showBioForm && (
              <Card>
                <CardHeader>
                  <CardTitle>Adicionar Nova Medição</CardTitle>
                </CardHeader>
                <CardContent>
                  <BioimpedanceForm 
                    studentId={student.id} 
                    onSubmit={() => setShowBioForm(false)}
                  />
                </CardContent>
              </Card>
            )}

            <BioimpedanceChart studentId={student.id} />
          </TabsContent>

          <TabsContent value="progress" className="space-y-4">
            {progress ? (
              <div className="grid gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Evolução Recente
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-primary">
                          {progress.changes.weight > 0 ? '+' : ''}{progress.changes.weight.toFixed(1)} kg
                        </p>
                        <p className="text-sm text-muted-foreground">Peso</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-destructive">
                          {progress.changes.bodyFat > 0 ? '+' : ''}{progress.changes.bodyFat.toFixed(1)}%
                        </p>
                        <p className="text-sm text-muted-foreground">Gordura</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-600">
                          {progress.changes.muscleMass > 0 ? '+' : ''}{progress.changes.muscleMass.toFixed(1)} kg
                        </p>
                        <p className="text-sm text-muted-foreground">Músculo</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-8">
                  <p className="text-muted-foreground">Nenhum dados de progresso disponível.</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Adicione medições de bioimpedância para acompanhar o progresso.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="workouts" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Histórico de Treinos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center text-muted-foreground py-8">
                  Histórico de treinos será implementado em breve.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};