import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useWorkout } from '@/contexts/WorkoutContext';
import { useTimer } from '@/hooks/use-timer';
import { Play, Pause, SkipForward, Check, X, Timer, Target, Weight, Volume2 } from 'lucide-react';

interface ActiveWorkoutModalProps {
  open: boolean;
  onClose: () => void;
}

const ActiveWorkoutModal = ({ open, onClose }: ActiveWorkoutModalProps) => {
  const { activeWorkout, endWorkout, nextExercise, completeSet, startRest, skipRest } = useWorkout();
  const { 
    timeElapsed, 
    restTime, 
    isResting, 
    isRunning,
    startTimer, 
    pauseTimer, 
    startRest: startRestTimer, 
    skipRest: skipRestTimer,
    formatTime,
    playSound 
  } = useTimer();
  const [reps, setReps] = useState('');
  const [weight, setWeight] = useState('');

  useEffect(() => {
    if (open && activeWorkout && !isRunning) {
      startTimer();
      playSound('start');
    }
  }, [open, activeWorkout, startTimer, isRunning, playSound]);

  const handleCompleteSet = () => {
    if (reps) {
      completeSet(parseInt(reps), weight ? parseFloat(weight) : undefined);
      setReps('');
      setWeight('');
      
      // Start rest timer
      const restDuration = parseInt(currentExercise?.rest?.replace(/\D/g, '') || '60');
      startRestTimer(restDuration);
      playSound('rest');
    }
  };

  const handleSkipRest = () => {
    skipRestTimer();
    skipRest();
  };

  const handleEndWorkout = () => {
    endWorkout();
    playSound('finish');
    onClose();
  };


  if (!activeWorkout) return null;

  const currentExercise = activeWorkout.template.exercises[activeWorkout.currentExerciseIndex];
  const isLastExercise = activeWorkout.currentExerciseIndex >= activeWorkout.template.exercises.length - 1;
  const currentSets = activeWorkout.completedSets.filter(s => s.exerciseId === currentExercise.id);
  const totalSets = currentExercise.sets || 3;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Treino Ativo</span>
            <Badge variant="secondary" className="flex items-center gap-1">
              <Timer size={14} />
              {formatTime(timeElapsed)}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Workout Progress */}
          <Card className="p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold">{activeWorkout.template.name}</h3>
              <span className="text-sm text-muted-foreground">
                {activeWorkout.currentExerciseIndex + 1} / {activeWorkout.template.exercises.length}
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-fitflow-green h-2 rounded-full transition-smooth"
                style={{
                  width: `${((activeWorkout.currentExerciseIndex + 1) / activeWorkout.template.exercises.length) * 100}%`
                }}
              />
            </div>
          </Card>

          {/* Enhanced Rest Timer */}
          {isResting && (
            <Card className="p-4 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border-blue-500/20 animate-pulse">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2 animate-scale-in">
                  {formatTime(restTime)}
                </div>
                <p className="text-sm text-muted-foreground mb-3">Tempo de descanso</p>
                
                <div className="flex gap-2 justify-center">
                  <Button
                    onClick={handleSkipRest}
                    variant="outline"
                    size="sm"
                    className="border-blue-500 text-blue-600 hover:bg-blue-500/10"
                  >
                    Pular Descanso
                  </Button>
                  
                  <Button
                    onClick={() => playSound('start')}
                    variant="ghost"
                    size="sm"
                    className="text-blue-600"
                  >
                    <Volume2 size={16} />
                  </Button>
                </div>
                
                {restTime <= 10 && restTime > 0 && (
                  <div className="mt-2 text-xs text-orange-600 font-medium animate-bounce">
                    ⏰ Quase pronto!
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Current Exercise */}
          {!isResting && currentExercise && (
            <Card className="p-4">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-bold">{currentExercise.name}</h3>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                    <div className="flex items-center gap-1">
                      <Target size={14} />
                      {currentExercise.reps}
                    </div>
                    <div className="flex items-center gap-1">
                      <Timer size={14} />
                      Descanso: {currentExercise.rest}
                    </div>
                  </div>
                </div>

                {/* Sets Progress */}
                <div>
                  <p className="text-sm font-medium mb-2">
                    Série {activeWorkout.currentSet} de {totalSets}
                  </p>
                  <div className="flex gap-2 mb-3">
                    {Array.from({ length: totalSets }).map((_, index) => (
                      <div
                        key={index}
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                          index < currentSets.length
                            ? 'bg-fitflow-green text-white'
                            : index === activeWorkout.currentSet - 1
                            ? 'bg-blue-500 text-white'
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {index < currentSets.length ? (
                          <Check size={14} />
                        ) : (
                          index + 1
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Input Form */}
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm font-medium">Repetições</label>
                      <Input
                        type="number"
                        placeholder="Ex: 12"
                        value={reps}
                        onChange={(e) => setReps(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Peso (kg)</label>
                      <Input
                        type="number"
                        placeholder="Ex: 50"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                      />
                    </div>
                  </div>

                  <Button
                    onClick={handleCompleteSet}
                    disabled={!reps}
                    className="w-full bg-fitflow-green hover:bg-fitflow-green/90"
                  >
                    <Check size={16} className="mr-2" />
                    Completar Série
                  </Button>
                </div>

                {/* Previous Sets */}
                {currentSets.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-2">Séries Anteriores</p>
                    <div className="space-y-1">
                      {currentSets.map((set, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between text-sm bg-muted/50 rounded p-2"
                        >
                          <span>Série {set.setNumber}</span>
                          <span>{set.reps} reps {set.weight ? `× ${set.weight}kg` : ''}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2">
            {activeWorkout.currentSet > totalSets && !isLastExercise && (
              <Button
                onClick={nextExercise}
                className="flex-1 bg-blue-500 hover:bg-blue-600"
              >
                <SkipForward size={16} className="mr-2" />
                Próximo Exercício
              </Button>
            )}
            
            {(activeWorkout.currentSet > totalSets && isLastExercise) && (
              <Button
                onClick={handleEndWorkout}
                className="flex-1 bg-fitflow-green hover:bg-fitflow-green/90"
              >
                <Check size={16} className="mr-2" />
                Finalizar Treino
              </Button>
            )}
            
            {activeWorkout.currentSet <= totalSets && (
              <Button
                onClick={() => {
                  if (isRunning) {
                    pauseTimer();
                  } else {
                    startTimer();
                  }
                }}
                variant="outline"
                className="flex-1"
              >
                {isRunning ? <Pause size={16} className="mr-2" /> : <Play size={16} className="mr-2" />}
                {isRunning ? 'Pausar' : 'Continuar'}
              </Button>
            )}
            
            <Button
              onClick={handleEndWorkout}
              variant="outline"
              className="border-destructive text-destructive hover:bg-destructive/10"
            >
              <X size={16} className="mr-2" />
              Cancelar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ActiveWorkoutModal;