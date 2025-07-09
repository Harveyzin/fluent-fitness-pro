import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useWorkout, Exercise } from '@/contexts/WorkoutContext';
import { Search, Plus, Target, Info } from 'lucide-react';

interface ExerciseLibraryModalProps {
  open: boolean;
  onClose: () => void;
  onSelectExercise?: (exercise: Exercise) => void;
  selectedExercises?: Exercise[];
}

const ExerciseLibraryModal = ({ 
  open, 
  onClose, 
  onSelectExercise,
  selectedExercises = []
}: ExerciseLibraryModalProps) => {
  const { exerciseLibrary } = useWorkout();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);

  const categories = ['Todos', 'Peito', 'Costas', 'Pernas', 'Ombros', 'Braços', 'Core'];

  const filteredExercises = exerciseLibrary.filter(exercise => {
    const matchesSearch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exercise.targetMuscles.some(muscle => 
                           muscle.toLowerCase().includes(searchTerm.toLowerCase())
                         );
    const matchesCategory = selectedCategory === 'Todos' || exercise.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSelectExercise = (exercise: Exercise) => {
    if (onSelectExercise) {
      onSelectExercise(exercise);
    }
  };

  const isSelected = (exerciseId: string) => {
    return selectedExercises.some(ex => ex.id === exerciseId);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Biblioteca de Exercícios</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[70vh]">
          {/* Left Panel - Exercise List */}
          <div className="lg:col-span-2 space-y-4">
            {/* Search and Filters */}
            <div className="space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
                <Input
                  placeholder="Buscar exercícios..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="flex gap-2 flex-wrap">
                {categories.map(category => (
                  <Button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>

            {/* Exercise List */}
            <ScrollArea className="h-[50vh]">
              <div className="space-y-2">
                {filteredExercises.map(exercise => (
                  <Card
                    key={exercise.id}
                    className={`p-3 cursor-pointer transition-smooth hover:shadow-card-hover ${
                      selectedExercise?.id === exercise.id ? 'ring-2 ring-fitflow-green' : ''
                    } ${isSelected(exercise.id) ? 'bg-fitflow-green/10 border-fitflow-green' : ''}`}
                    onClick={() => setSelectedExercise(exercise)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold">{exercise.name}</h4>
                          {isSelected(exercise.id) && (
                            <Badge variant="secondary" className="bg-fitflow-green text-white">
                              Selecionado
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {exercise.category} • {exercise.targetMuscles.join(', ')}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedExercise(exercise);
                          }}
                          variant="ghost"
                          size="sm"
                        >
                          <Info size={16} />
                        </Button>
                        {onSelectExercise && (
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSelectExercise(exercise);
                            }}
                            variant="outline"
                            size="sm"
                            disabled={isSelected(exercise.id)}
                          >
                            <Plus size={16} />
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
                
                {filteredExercises.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Target size={48} className="mx-auto mb-2 opacity-50" />
                    <p>Nenhum exercício encontrado</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>

          {/* Right Panel - Exercise Details */}
          <div className="space-y-4">
            {selectedExercise ? (
              <Card className="p-4 h-full">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-bold">{selectedExercise.name}</h3>
                    <Badge variant="secondary">{selectedExercise.category}</Badge>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Músculos Trabalhados</h4>
                    <div className="flex flex-wrap gap-1">
                      {selectedExercise.targetMuscles.map(muscle => (
                        <Badge key={muscle} variant="outline" className="text-xs">
                          {muscle}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {selectedExercise.instructions.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2">Instruções</h4>
                      <ScrollArea className="h-40">
                        <ol className="list-decimal list-inside space-y-2 text-sm">
                          {selectedExercise.instructions.map((instruction, index) => (
                            <li key={index} className="text-muted-foreground">
                              {instruction}
                            </li>
                          ))}
                        </ol>
                      </ScrollArea>
                    </div>
                  )}

                  {onSelectExercise && (
                    <Button
                      onClick={() => handleSelectExercise(selectedExercise)}
                      disabled={isSelected(selectedExercise.id)}
                      className="w-full bg-fitflow-green hover:bg-fitflow-green/90"
                    >
                      <Plus size={16} className="mr-2" />
                      {isSelected(selectedExercise.id) ? 'Já Selecionado' : 'Adicionar ao Treino'}
                    </Button>
                  )}
                </div>
              </Card>
            ) : (
              <Card className="p-4 h-full flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <Target size={48} className="mx-auto mb-2 opacity-50" />
                  <p>Selecione um exercício para ver os detalhes</p>
                </div>
              </Card>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button onClick={onClose} variant="outline">
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExerciseLibraryModal;