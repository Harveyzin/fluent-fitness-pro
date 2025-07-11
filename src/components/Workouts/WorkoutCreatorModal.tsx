import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useWorkout, Exercise, WorkoutTemplate } from '@/contexts/WorkoutContext';
import { Plus, Trash2, Edit, Target, Clock, Zap } from 'lucide-react';
import ExerciseLibraryModal from './ExerciseLibraryModal';

interface WorkoutCreatorModalProps {
  open: boolean;
  onClose: () => void;
  editingTemplate?: WorkoutTemplate | null;
}

const WorkoutCreatorModal = ({ open, onClose, editingTemplate }: WorkoutCreatorModalProps) => {
  const { createWorkoutTemplate } = useWorkout();
  const [name, setName] = useState(editingTemplate?.name || '');
  const [category, setCategory] = useState(editingTemplate?.category || 'Superiores');
  const [difficulty, setDifficulty] = useState(editingTemplate?.difficulty || 'Iniciante');
  const [description, setDescription] = useState(editingTemplate?.description || '');
  const [exercises, setExercises] = useState<Exercise[]>(editingTemplate?.exercises || []);
  const [showExerciseLibrary, setShowExerciseLibrary] = useState(false);
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);

  const categories = ['Superiores', 'Inferiores', 'Push', 'Pull', 'Legs', 'Full Body', 'Cardio'];
  const difficulties = ['Iniciante', 'Intermediário', 'Avançado'];

  const handleAddExercise = (exercise: Exercise) => {
    const newExercise: Exercise = {
      ...exercise,
      sets: 3,
      reps: '8-12',
      rest: '60s'
    };
    setExercises(prev => [...prev, newExercise]);
    setShowExerciseLibrary(false);
  };

  const handleRemoveExercise = (index: number) => {
    setExercises(prev => prev.filter((_, i) => i !== index));
  };

  const handleEditExercise = (index: number, updatedExercise: Exercise) => {
    setExercises(prev => prev.map((ex, i) => i === index ? updatedExercise : ex));
    setEditingExercise(null);
  };

  const handleSaveWorkout = () => {
    if (!name.trim() || exercises.length === 0) return;

    const estimatedDuration = exercises.length * 4; // Rough estimate: 4 minutes per exercise
    const durationStr = estimatedDuration < 60 ? `${estimatedDuration} min` : `${Math.round(estimatedDuration / 60)}h ${estimatedDuration % 60}min`;

    const template: Omit<WorkoutTemplate, 'id'> = {
      name,
      category,
      difficulty,
      duration: durationStr,
      description,
      exercises
    };

    createWorkoutTemplate(template);
    onClose();
    
    // Reset form
    setName('');
    setCategory('Superiores');
    setDifficulty('Iniciante');
    setDescription('');
    setExercises([]);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingTemplate ? 'Editar Treino' : 'Criar Novo Treino'}
            </DialogTitle>
            <DialogDescription>
              {editingTemplate 
                ? 'Modifique os exercícios e configurações do seu treino'
                : 'Monte um treino personalizado selecionando exercícios e definindo séries'
              }
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nome do Treino</Label>
                <Input
                  id="name"
                  placeholder="Ex: Treino de Peito e Tríceps"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Categoria</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Dificuldade</Label>
                  <Select value={difficulty} onValueChange={setDifficulty}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {difficulties.map(diff => (
                        <SelectItem key={diff} value={diff}>{diff}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="description">Descrição (opcional)</Label>
                <Input
                  id="description"
                  placeholder="Descreva o objetivo do treino..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </div>

            {/* Exercises */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Exercícios ({exercises.length})</h3>
                <Button
                  onClick={() => setShowExerciseLibrary(true)}
                  variant="outline"
                  size="sm"
                >
                  <Plus size={16} className="mr-2" />
                  Adicionar Exercício
                </Button>
              </div>

              {exercises.length === 0 ? (
                <Card className="p-8 text-center">
                  <Target size={48} className="mx-auto mb-4 text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground">
                    Nenhum exercício adicionado ainda
                  </p>
                  <Button
                    onClick={() => setShowExerciseLibrary(true)}
                    variant="outline"
                    className="mt-4"
                  >
                    <Plus size={16} className="mr-2" />
                    Adicionar Primeiro Exercício
                  </Button>
                </Card>
              ) : (
                <ScrollArea className="h-60">
                  <div className="space-y-3">
                    {exercises.map((exercise, index) => (
                      <Card key={`${exercise.id}-${index}`} className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold">{exercise.name}</h4>
                            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Target size={14} />
                                {exercise.sets} séries
                              </div>
                              <div className="flex items-center gap-1">
                                <Zap size={14} />
                                {exercise.reps} reps
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock size={14} />
                                {exercise.rest}
                              </div>
                            </div>
                            <div className="flex gap-1 mt-2">
                              {exercise.targetMuscles.map(muscle => (
                                <Badge key={muscle} variant="outline" className="text-xs">
                                  {muscle}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              onClick={() => setEditingExercise(exercise)}
                              variant="ghost"
                              size="sm"
                            >
                              <Edit size={16} />
                            </Button>
                            <Button
                              onClick={() => handleRemoveExercise(index)}
                              variant="ghost"
                              size="sm"
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 size={16} />
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button onClick={onClose} variant="outline">
                Cancelar
              </Button>
              <Button
                onClick={handleSaveWorkout}
                disabled={!name.trim() || exercises.length === 0}
                className="bg-fitflow-green hover:bg-fitflow-green/90"
              >
                {editingTemplate ? 'Salvar Alterações' : 'Criar Treino'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Exercise Library Modal */}
      <ExerciseLibraryModal
        open={showExerciseLibrary}
        onClose={() => setShowExerciseLibrary(false)}
        onSelectExercise={handleAddExercise}
        selectedExercises={exercises}
      />

      {/* Edit Exercise Modal */}
      {editingExercise && (
        <Dialog open={!!editingExercise} onOpenChange={() => setEditingExercise(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Editar Exercício</DialogTitle>
              <DialogDescription>
                Ajuste as séries, repetições e tempo de descanso para este exercício
              </DialogDescription>
            </DialogHeader>
            <ExerciseEditForm
              exercise={editingExercise}
              onSave={(updatedExercise) => {
                const index = exercises.findIndex(ex => ex.id === editingExercise.id);
                if (index !== -1) {
                  handleEditExercise(index, updatedExercise);
                }
              }}
              onCancel={() => setEditingExercise(null)}
            />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

// Exercise Edit Form Component
const ExerciseEditForm = ({ 
  exercise, 
  onSave, 
  onCancel 
}: { 
  exercise: Exercise;
  onSave: (exercise: Exercise) => void;
  onCancel: () => void;
}) => {
  const [sets, setSets] = useState(exercise.sets?.toString() || '3');
  const [reps, setReps] = useState(exercise.reps || '8-12');
  const [rest, setRest] = useState(exercise.rest || '60s');

  const handleSave = () => {
    onSave({
      ...exercise,
      sets: parseInt(sets),
      reps,
      rest
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <h4 className="font-semibold mb-2">{exercise.name}</h4>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <Label htmlFor="sets">Séries</Label>
            <Input
              id="sets"
              type="number"
              value={sets}
              onChange={(e) => setSets(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="reps">Repetições</Label>
            <Input
              id="reps"
              placeholder="8-12"
              value={reps}
              onChange={(e) => setReps(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="rest">Descanso</Label>
            <Input
              id="rest"
              placeholder="60s"
              value={rest}
              onChange={(e) => setRest(e.target.value)}
            />
          </div>
        </div>
      </div>
      
      <div className="flex justify-end gap-2">
        <Button onClick={onCancel} variant="outline">
          Cancelar
        </Button>
        <Button onClick={handleSave} className="bg-fitflow-green hover:bg-fitflow-green/90">
          Salvar
        </Button>
      </div>
    </div>
  );
};

export default WorkoutCreatorModal;