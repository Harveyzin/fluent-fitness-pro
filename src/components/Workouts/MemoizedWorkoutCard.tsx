import React from 'react';
import { Play, Trash2, Zap } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RestrictedButton } from '@/components/ui/restricted-button';

interface WorkoutTemplate {
  id: string;
  name: string;
  description?: string;
  duration: string;
  exercises: any[];
  difficulty: string;
  category: string;
}

interface MemoizedWorkoutCardProps {
  template: WorkoutTemplate;
  isTrainerMode: boolean;
  onStart: (template: WorkoutTemplate) => void;
  onDelete: (templateId: string) => void;
}

const MemoizedWorkoutCard = React.memo(({ template, isTrainerMode, onStart, onDelete }: MemoizedWorkoutCardProps) => {
  return (
    <Card className="p-4 shadow-card hover:shadow-card-hover transition-smooth">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-fitflow-green/10 rounded-lg flex items-center justify-center">
            <Zap size={24} className="text-fitflow-green" />
          </div>
          <div>
            <h5 className="font-semibold">{template.name}</h5>
            <p className="text-xs text-muted-foreground mb-1">{template.description || 'Sem descrição'}</p>
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
            onClick={() => onStart(template)}
            variant="ghost"
            size="sm"
            className="text-fitflow-green hover:bg-fitflow-green/10"
          >
            <Play size={16} />
          </Button>
          <RestrictedButton
            onClick={() => onDelete(template.id)}
            variant="ghost"
            size="sm"
            className="text-destructive hover:bg-destructive/10"
            isRestricted={isTrainerMode}
            tooltip="Deletar treinos disponível apenas no modo personal"
          >
            <Trash2 size={16} />
          </RestrictedButton>
        </div>
      </div>
    </Card>
  );
});

MemoizedWorkoutCard.displayName = 'MemoizedWorkoutCard';

export default MemoizedWorkoutCard;