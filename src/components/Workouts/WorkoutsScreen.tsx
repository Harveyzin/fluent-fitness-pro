
import React, { useState } from 'react';
import { Play, Plus, Clock, Target, Zap, Calendar, Edit, Trash2, Star } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useWorkout } from '@/contexts/WorkoutContext';
import ActiveWorkoutModal from './ActiveWorkoutModal';
import WorkoutCreatorModal from './WorkoutCreatorModal';
import ExerciseLibraryModal from './ExerciseLibraryModal';
import WorkoutStatsCard from './WorkoutStatsCard';

const WorkoutsScreen = () => {
  const { workoutTemplates, startWorkout, workoutHistory, deleteWorkoutTemplate } = useWorkout();
  const [activeTab, setActiveTab] = useState('today');
  const [showActiveWorkout, setShowActiveWorkout] = useState(false);
  const [showWorkoutCreator, setShowWorkoutCreator] = useState(false);
  const [showExerciseLibrary, setShowExerciseLibrary] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Todos');

  // Seleciona um treino recomendado baseado no dia da semana
  const getTodayWorkout = () => {
    const dayOfWeek = new Date().getDay();
    const workoutRotation = [
      workoutTemplates.find(t => t.category === 'Superiores') || workoutTemplates[0], // Domingo
      workoutTemplates.find(t => t.category === 'Inferiores') || workoutTemplates[0], // Segunda
      workoutTemplates.find(t => t.category === 'Superiores') || workoutTemplates[0], // Terça
      workoutTemplates.find(t => t.category === 'Inferiores') || workoutTemplates[0], // Quarta
      workoutTemplates.find(t => t.category === 'Superiores') || workoutTemplates[0], // Quinta
      workoutTemplates.find(t => t.category === 'Full Body') || workoutTemplates[0], // Sexta
      workoutTemplates.find(t => t.category === 'Cardio') || workoutTemplates[0], // Sábado
    ];
    return workoutRotation[dayOfWeek] || workoutTemplates[0];
  };

  const todayTemplate = getTodayWorkout();

  const categories = ['Todos', 'Superiores', 'Inferiores', 'Full Body', 'Cardio'];
  
  const filteredTemplates = selectedCategory === 'Todos' 
    ? workoutTemplates 
    : workoutTemplates.filter(t => t.category === selectedCategory);

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
          {/* Recommended Workout Card */}
          <Card className="p-6 shadow-card">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-xl font-bold">{todayTemplate.name}</h3>
                  <Badge className="bg-fitflow-green text-white">Recomendado</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{todayTemplate.description}</p>
                <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock size={14} />
                    {todayTemplate.duration}
                  </div>
                  <div className="flex items-center gap-1">
                    <Target size={14} />
                    {todayTemplate.exercises.length} exercícios
                  </div>
                  <Badge variant="outline">{todayTemplate.category}</Badge>
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

          {/* Workout Stats */}
          <WorkoutStatsCard />

          {/* All Available Workouts */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-lg">Todos os Treinos</h4>
              <div className="flex gap-2 overflow-x-auto">
                {categories.map(category => (
                  <Button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    className="whitespace-nowrap"
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="grid gap-3">
              {filteredTemplates.map((template) => (
                <Card key={template.id} className="p-4 shadow-card hover:shadow-card-hover transition-smooth">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-fitflow-green/10 rounded-lg flex items-center justify-center">
                        <Zap size={24} className="text-fitflow-green" />
                      </div>
                      <div>
                        <h5 className="font-semibold">{template.name}</h5>
                        <p className="text-xs text-muted-foreground mb-1">{template.description}</p>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span>{template.duration}</span>
                          <span>•</span>
                          <span>{template.exercises.length} exercícios</span>
                          <span>•</span>
                          <Badge variant="outline" className="text-xs">{template.difficulty}</Badge>
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
                        <span>•</span>
                        <span>{exercise.targetMuscles.join(', ')}</span>
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
                       <span>•</span>
                       <span>{workout.totalReps} reps</span>
                     </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-fitflow-green">
                    {Math.round(workout.duration * 8)} kcal
                  </div>
                  <div className="text-xs text-muted-foreground">queimadas</div>
                </div>
              </div>
            </Card>
          ))}
          
          {workoutHistory.length === 0 && (
            <Card className="p-8 text-center">
              <Clock size={48} className="mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="font-semibold mb-2">Nenhum treino realizado</h3>
              <p className="text-muted-foreground mb-4">
                Complete seu primeiro treino para ver o histórico aqui
              </p>
              <Button onClick={() => setActiveTab('today')}>
                Começar Primeiro Treino
              </Button>
            </Card>
          )}
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
              
              {/* Category Filter */}
              <div className="flex gap-2 mb-4 overflow-x-auto">
                {categories.map(category => (
                  <Button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    className="whitespace-nowrap"
                  >
                    {category}
                  </Button>
                ))}
              </div>
              
              <div className="space-y-2">
                {filteredTemplates.map((template) => (
                  <Card key={template.id} className="p-4 shadow-card hover:shadow-card-hover transition-smooth">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-fitflow-green/10 rounded-lg flex items-center justify-center">
                          <Target size={20} className="text-fitflow-green" />
                        </div>
                        <div>
                          <h5 className="font-semibold">{template.name}</h5>
                          <p className="text-xs text-muted-foreground">{template.description}</p>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                            <span>{template.category}</span>
                            <span>•</span>
                            <span>{template.difficulty}</span>
                            <span>•</span>
                            <span>{template.exercises.length} exercícios</span>
                            <span>•</span>
                            <span>{template.duration}</span>
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
              
              {filteredTemplates.length === 0 && selectedCategory !== 'Todos' && (
                <Card className="p-6 text-center">
                  <Target size={32} className="mx-auto mb-2 text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground">
                    Nenhum treino encontrado na categoria "{selectedCategory}"
                  </p>
                </Card>
              )}
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
