
import React, { useState } from 'react';
import { Play, Plus, Clock, Target, Zap, Calendar } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const WorkoutsScreen = () => {
  const [activeTab, setActiveTab] = useState('today');

  const todayWorkout = {
    name: 'Treino de Peito e Tríceps',
    duration: '45-60 min',
    exercises: 6,
    level: 'Intermediário',
    completed: false
  };

  const exercises = [
    { name: 'Supino Reto', sets: '4x8-10', rest: '90s', completed: false },
    { name: 'Supino Inclinado', sets: '3x10-12', rest: '90s', completed: false },
    { name: 'Crucifixo', sets: '3x12-15', rest: '60s', completed: false },
    { name: 'Mergulho', sets: '3x10-12', rest: '60s', completed: false },
    { name: 'Tríceps Testa', sets: '4x10-12', rest: '60s', completed: false },
    { name: 'Tríceps Corda', sets: '3x12-15', rest: '45s', completed: false }
  ];

  const workoutHistory = [
    { name: 'Treino de Costas', date: 'Ontem', duration: '52 min', exercises: 7 },
    { name: 'Treino de Pernas', date: '2 dias atrás', duration: '68 min', exercises: 8 },
    { name: 'Treino de Ombros', date: '3 dias atrás', duration: '45 min', exercises: 6 }
  ];

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
      {activeTab === 'today' && (
        <div className="space-y-4 animate-slide-up">
          <Card className="p-6 shadow-card">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold">{todayWorkout.name}</h3>
                <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock size={14} />
                    {todayWorkout.duration}
                  </div>
                  <div className="flex items-center gap-1">
                    <Target size={14} />
                    {todayWorkout.exercises} exercícios
                  </div>
                </div>
              </div>
              <Badge variant="secondary">{todayWorkout.level}</Badge>
            </div>
            
            <Button className="w-full bg-fitflow-green hover:bg-fitflow-green/90 text-white">
              <Play size={20} className="mr-2" />
              Iniciar Treino
            </Button>
          </Card>

          <div className="space-y-3">
            <h4 className="font-semibold text-lg">Exercícios</h4>
            {exercises.map((exercise, index) => (
              <Card key={index} className="p-4 shadow-card hover:shadow-card-hover transition-smooth">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-fitflow-green/10 rounded-lg flex items-center justify-center">
                      <span className="text-sm font-bold text-fitflow-green">{index + 1}</span>
                    </div>
                    <div>
                      <h5 className="font-semibold">{exercise.name}</h5>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                        <span>{exercise.sets}</span>
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
                      <span>{workout.date}</span>
                      <span>•</span>
                      <span>{workout.duration}</span>
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
            <Card className="p-4 shadow-card hover:shadow-card-hover transition-smooth cursor-pointer">
              <div className="text-center">
                <div className="w-12 h-12 bg-fitflow-green/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Target size={24} className="text-fitflow-green" />
                </div>
                <h4 className="font-semibold">Treino Personalizado</h4>
                <p className="text-xs text-muted-foreground mt-1">Crie do zero</p>
              </div>
            </Card>
            
            <Card className="p-4 shadow-card hover:shadow-card-hover transition-smooth cursor-pointer">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Zap size={24} className="text-blue-500" />
                </div>
                <h4 className="font-semibold">Template</h4>
                <p className="text-xs text-muted-foreground mt-1">Use um modelo</p>
              </div>
            </Card>
          </div>
          
          <Card className="p-4 shadow-card">
            <h4 className="font-semibold mb-3">Templates Populares</h4>
            <div className="space-y-2">
              {['Push Pull Legs', 'Upper Lower Split', 'Full Body', 'Bro Split'].map((template, index) => (
                <Button key={index} variant="outline" className="w-full justify-start">
                  <Plus size={16} className="mr-2" />
                  {template}
                </Button>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default WorkoutsScreen;
