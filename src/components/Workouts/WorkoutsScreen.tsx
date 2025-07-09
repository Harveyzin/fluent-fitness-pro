
import React, { useState } from 'react';
import { Play, Plus, Clock, Target, Zap, Calendar, Edit, Trash2, Star } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useWorkout } from '@/contexts/WorkoutContext';
import ActiveWorkoutModal from './ActiveWorkoutModal';
import WorkoutCreatorModal from './WorkoutCreatorModal';
import ExerciseLibraryModal from './ExerciseLibraryModal';

const WorkoutsScreen = () => {
  const { workoutTemplates, startWorkout, workoutHistory, deleteWorkoutTemplate } = useWorkout();
  const [activeTab, setActiveTab] = useState('today');
  const [showActiveWorkout, setShowActiveWorkout] = useState(false);
  const [showWorkoutCreator, setShowWorkoutCreator] = useState(false);
  const [showExerciseLibrary, setShowExerciseLibrary] = useState(false);

  const todayTemplate = workoutTemplates[0]; // Use first template as today's workout

  const handleStartWorkout = (template = todayTemplate) => {
    startWorkout(template);
    setShowActiveWorkout(true);
  };

  const formatDate = (date: Date) => {
    const today = new Date();
    const diffTime = today.getTime() - date.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Hoje';
    if (diffDays === 1) return 'Ontem';
    return `${diffDays} dias atrás`;
  };

  const tabs = [
    { id: 'today', label: 'Hoje', icon: Calendar },
    { id: 'history', label: 'Histórico', icon: Clock },
    { id: 'create', label: 'Criar', icon: Plus }
  ];

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="animate-slide-up">
        <h2 className="text-2xl font-bold mb-1">Treinos</h2>
        <p className="text-muted-foreground">Acompanhe seu progresso físico</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-muted rounded-lg animate-scale-in">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-smooth ${
                activeTab === tab.id
                  ? 'bg-white text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Today's Workout */}
      {activeTab === 'today' && todayTemplate && (
        <div className="space-y-4 animate-slide-up">
          <Card className="p-6 shadow-card">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold">{todayTemplate.name}</h3>
                <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock size={14} />
                    {todayTemplate.duration}
                  </div>
                  <div className="flex items-center gap-1">
                    <Target size={14} />
                    {todayTemplate.exercises.length} exercícios
                  </div>
                </div>
              </div>
              <Badge variant="secondary">{todayTemplate.difficulty}</Badge>
            </div>
            
            <Button
              onClick={() => handleStartWorkout()}
              className="w-full bg-fitflow-green hover:bg-fitflow-green/90 text-white"
            >
              <Play size={20} className="mr-2" />
              Iniciar Treino
            </Button>
          </Card>

          <div className="space-y-3">
            <h4 className="font-semibold text-lg">Exercícios</h4>
            {todayTemplate.exercises.map((exercise, index) => (
              <Card key={index} className="p-4 shadow-card hover:shadow-card-hover transition-smooth">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-fitflow-green/10 rounded-lg flex items-center justify-center">
                      <span className="text-sm font-bold text-fitflow-green">{index + 1}</span>
                    </div>
                    <div>
                      <h5 className="font-semibold">{exercise.name}</h5>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                        <span>{exercise.sets}x{exercise.reps}</span>
                        <span>•</span>
                        <span>Descanso: {exercise.rest}</span>
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Play size={16} />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* No workouts created yet */}
      {activeTab === 'today' && !todayTemplate && (
        <div className="space-y-4 animate-slide-up">
          <Card className="p-8 text-center">
            <Target size={48} className="mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-semibold mb-2">Nenhum treino disponível</h3>
            <p className="text-muted-foreground mb-4">
              Crie seu primeiro treino para começar
            </p>
            <Button
              onClick={() => setShowWorkoutCreator(true)}
              className="bg-fitflow-green hover:bg-fitflow-green/90"
            >
              <Plus size={16} className="mr-2" />
              Criar Treino
            </Button>
          </Card>
        </div>
      )}

      {/* Workout History */}
      {activeTab === 'history' && (
        <div className="space-y-4 animate-slide-up">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Histórico de Treinos</h3>
            <Button variant="outline" size="sm">
              Ver Todos
            </Button>
          </div>
          
          {workoutHistory.map((workout, index) => (
            <Card key={index} className="p-4 shadow-card hover:shadow-card-hover transition-smooth cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                    <Zap size={20} className="text-blue-500" />
                  </div>
                  <div>
                    <h5 className="font-semibold">{workout.name}</h5>
                     <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                       <span>{formatDate(workout.date)}</span>
                       <span>•</span>
                       <span>{workout.duration} min</span>
                       <span>•</span>
                       <span>{workout.exercises} exercícios</span>
                     </div>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <Play size={16} />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Create Workout */}
      {activeTab === 'create' && (
        <div className="space-y-4 animate-slide-up">
          <h3 className="text-lg font-semibold">Criar Novo Treino</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <Card 
              onClick={() => setShowWorkoutCreator(true)}
              className="p-4 shadow-card hover:shadow-card-hover transition-smooth cursor-pointer"
            >
              <div className="text-center">
                <div className="w-12 h-12 bg-fitflow-green/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Target size={24} className="text-fitflow-green" />
                </div>
                <h4 className="font-semibold">Treino Personalizado</h4>
                <p className="text-xs text-muted-foreground mt-1">Crie do zero</p>
              </div>
            </Card>
            
            <Card 
              onClick={() => setShowExerciseLibrary(true)}
              className="p-4 shadow-card hover:shadow-card-hover transition-smooth cursor-pointer"
            >
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Zap size={24} className="text-blue-500" />
                </div>
                <h4 className="font-semibold">Biblioteca de Exercícios</h4>
                <p className="text-xs text-muted-foreground mt-1">Explore exercícios</p>
              </div>
            </Card>
          </div>

          {/* Existing Templates */}
          {workoutTemplates.length > 0 && (
            <div>
              <h4 className="font-semibold mb-3">Seus Treinos</h4>
              <div className="space-y-2">
                {workoutTemplates.map((template) => (
                  <Card key={template.id} className="p-4 shadow-card hover:shadow-card-hover transition-smooth">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-fitflow-green/10 rounded-lg flex items-center justify-center">
                          <Target size={20} className="text-fitflow-green" />
                        </div>
                        <div>
                          <h5 className="font-semibold">{template.name}</h5>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                            <span>{template.category}</span>
                            <span>•</span>
                            <span>{template.difficulty}</span>
                            <span>•</span>
                            <span>{template.exercises.length} exercícios</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          onClick={() => handleStartWorkout(template)}
                          variant="ghost"
                          size="sm"
                          className="text-fitflow-green hover:bg-fitflow-green/10"
                        >
                          <Play size={16} />
                        </Button>
                        <Button
                          onClick={() => deleteWorkoutTemplate(template.id)}
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modals */}
      <ActiveWorkoutModal 
        open={showActiveWorkout} 
        onClose={() => setShowActiveWorkout(false)} 
      />
      
      <WorkoutCreatorModal 
        open={showWorkoutCreator} 
        onClose={() => setShowWorkoutCreator(false)} 
      />
      
      <ExerciseLibraryModal 
        open={showExerciseLibrary} 
        onClose={() => setShowExerciseLibrary(false)} 
      />
    </div>
  );
};

export default WorkoutsScreen;
