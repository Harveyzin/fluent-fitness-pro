import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Target, Zap, Wheat, Droplet } from 'lucide-react';

const nutritionGoalsFormSchema = z.object({
  calories: z.string().min(1, 'Meta de calorias é obrigatória'),
  protein: z.string().min(1, 'Meta de proteína é obrigatória'),
  carbs: z.string().min(1, 'Meta de carboidratos é obrigatória'),
  fat: z.string().min(1, 'Meta de gordura é obrigatória'),
  water: z.string().optional()
});

const nutritionGoalsDataSchema = z.object({
  calories: z.number()
    .min(1200, 'Calorias devem estar entre 1200 e 5000')
    .max(5000, 'Calorias devem estar entre 1200 e 5000'),
  protein: z.number()
    .min(50, 'Proteína deve estar entre 50 e 300g')
    .max(300, 'Proteína deve estar entre 50 e 300g'),
  carbs: z.number()
    .min(50, 'Carboidratos devem estar entre 50 e 500g')
    .max(500, 'Carboidratos devem estar entre 50 e 500g'),
  fat: z.number()
    .min(30, 'Gordura deve estar entre 30 e 200g')
    .max(200, 'Gordura deve estar entre 30 e 200g'),
  water: z.number()
    .min(1000, 'Água deve estar entre 1000 e 5000ml')
    .max(5000, 'Água deve estar entre 1000 e 5000ml')
    .optional()
});

type NutritionGoalsFormData = z.infer<typeof nutritionGoalsFormSchema>;
type NutritionGoalsData = z.infer<typeof nutritionGoalsDataSchema>;

interface NutritionGoalsFormProps {
  initialData?: Partial<NutritionGoalsData>;
  onSubmit: (data: NutritionGoalsData) => void;
  isLoading?: boolean;
}

const NutritionGoalsForm = ({ initialData, onSubmit, isLoading = false }: NutritionGoalsFormProps) => {
  const { toast } = useToast();
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid, isDirty }
  } = useForm<NutritionGoalsFormData>({
    resolver: zodResolver(nutritionGoalsFormSchema),
    defaultValues: {
      calories: typeof initialData?.calories === 'number' ? initialData.calories.toString() : '2200',
      protein: typeof initialData?.protein === 'number' ? initialData.protein.toString() : '120',
      carbs: typeof initialData?.carbs === 'number' ? initialData.carbs.toString() : '200',
      fat: typeof initialData?.fat === 'number' ? initialData.fat.toString() : '80',
      water: typeof initialData?.water === 'number' ? initialData.water.toString() : '2000'
    },
    mode: 'onChange'
  });

  const watchedValues = watch();

  const calculateCaloriesFromMacros = () => {
    const protein = parseInt(watchedValues.protein || '0');
    const carbs = parseInt(watchedValues.carbs || '0');
    const fat = parseInt(watchedValues.fat || '0');
    
    // Protein and carbs = 4 cal/g, fat = 9 cal/g
    return (protein * 4) + (carbs * 4) + (fat * 9);
  };

  const calculatedCalories = calculateCaloriesFromMacros();
  const targetCalories = parseInt(watchedValues.calories || '0');
  const caloriesDifference = Math.abs(calculatedCalories - targetCalories);

  const handleFormSubmit = (formData: NutritionGoalsFormData) => {
    try {
      // Transform form data to nutrition data
      const nutritionData: NutritionGoalsData = {
        calories: parseInt(formData.calories),
        protein: parseInt(formData.protein),
        carbs: parseInt(formData.carbs),
        fat: parseInt(formData.fat),
        water: formData.water ? parseInt(formData.water) : 2000
      };

      // Validate the transformed data
      const validatedData = nutritionGoalsDataSchema.parse(nutritionData);
      
      onSubmit(validatedData);
      toast({
        title: "Metas atualizadas",
        description: "Suas metas nutricionais foram salvas com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Dados inválidos. Verifique as informações e tente novamente.",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Metas Nutricionais Diárias</h3>
        <p className="text-sm text-muted-foreground">
          Defina suas metas de macronutrientes para um acompanhamento preciso
        </p>
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        {/* Calories Goal */}
        <div className="space-y-2">
          <Label htmlFor="calories" className="flex items-center gap-2">
            <Zap size={16} className="text-fitflow-orange" />
            Meta de Calorias (kcal)
          </Label>
          <Input
            id="calories"
            type="number"
            {...register('calories')}
            placeholder="2200"
            min="1200"
            max="5000"
            className={errors.calories ? 'border-red-500' : ''}
          />
          {errors.calories && (
            <p className="text-sm text-red-500">{errors.calories.message}</p>
          )}
          <p className="text-xs text-muted-foreground">
            Recomendado: 1800-2500 kcal para adultos ativos
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Protein Goal */}
          <div className="space-y-2">
            <Label htmlFor="protein" className="flex items-center gap-2">
              <Target size={16} className="text-fitflow-red" />
              Proteína (g)
            </Label>
            <Input
              id="protein"
              type="number"
              {...register('protein')}
              placeholder="120"
              min="50"
              max="300"
              className={errors.protein ? 'border-red-500' : ''}
            />
            {errors.protein && (
              <p className="text-sm text-red-500">{errors.protein.message}</p>
            )}
            <p className="text-xs text-muted-foreground">
              {watchedValues.protein ? `${(parseInt(watchedValues.protein) * 4)} kcal` : '0 kcal'}
            </p>
          </div>

          {/* Carbs Goal */}
          <div className="space-y-2">
            <Label htmlFor="carbs" className="flex items-center gap-2">
              <Wheat size={16} className="text-fitflow-blue" />
              Carboidratos (g)
            </Label>
            <Input
              id="carbs"
              type="number"
              {...register('carbs')}
              placeholder="200"
              min="50"
              max="500"
              className={errors.carbs ? 'border-red-500' : ''}
            />
            {errors.carbs && (
              <p className="text-sm text-red-500">{errors.carbs.message}</p>
            )}
            <p className="text-xs text-muted-foreground">
              {watchedValues.carbs ? `${(parseInt(watchedValues.carbs) * 4)} kcal` : '0 kcal'}
            </p>
          </div>

          {/* Fat Goal */}
          <div className="space-y-2">
            <Label htmlFor="fat" className="flex items-center gap-2">
              <Droplet size={16} className="text-fitflow-purple" />
              Gordura (g)
            </Label>
            <Input
              id="fat"
              type="number"
              {...register('fat')}
              placeholder="80"
              min="30"
              max="200"
              className={errors.fat ? 'border-red-500' : ''}
            />
            {errors.fat && (
              <p className="text-sm text-red-500">{errors.fat.message}</p>
            )}
            <p className="text-xs text-muted-foreground">
              {watchedValues.fat ? `${(parseInt(watchedValues.fat) * 9)} kcal` : '0 kcal'}
            </p>
          </div>
        </div>

        {/* Water Goal */}
        <div className="space-y-2">
          <Label htmlFor="water" className="flex items-center gap-2">
            <Droplet size={16} className="text-blue-500" />
            Meta de Água (ml) - Opcional
          </Label>
          <Input
            id="water"
            type="number"
            {...register('water')}
            placeholder="2000"
            min="1000"
            max="5000"
            className={errors.water ? 'border-red-500' : ''}
          />
          {errors.water && (
            <p className="text-sm text-red-500">{errors.water.message}</p>
          )}
          <p className="text-xs text-muted-foreground">
            Recomendado: 2000-3000ml por dia para adultos
          </p>
        </div>

        {/* Macros vs Calories Validation */}
        {caloriesDifference > 100 && (
          <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <p className="text-sm text-orange-800">
              <strong>⚠️ Atenção:</strong> As calorias dos macronutrientes ({calculatedCalories} kcal) 
              não batem com sua meta de calorias ({targetCalories} kcal). 
              Diferença: {caloriesDifference} kcal.
            </p>
          </div>
        )}

        {/* Macros Breakdown */}
        <div className="p-4 bg-muted/30 rounded-lg">
          <h4 className="font-medium mb-2">Resumo das Metas</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Calorias</p>
              <p className="font-medium">{targetCalories} kcal</p>
            </div>
            <div>
              <p className="text-muted-foreground">Proteína</p>
              <p className="font-medium">{watchedValues.protein}g ({Math.round((parseInt(watchedValues.protein || '0') * 4 / targetCalories) * 100)}%)</p>
            </div>
            <div>
              <p className="text-muted-foreground">Carboidratos</p>
              <p className="font-medium">{watchedValues.carbs}g ({Math.round((parseInt(watchedValues.carbs || '0') * 4 / targetCalories) * 100)}%)</p>
            </div>
            <div>
              <p className="text-muted-foreground">Gordura</p>
              <p className="font-medium">{watchedValues.fat}g ({Math.round((parseInt(watchedValues.fat || '0') * 9 / targetCalories) * 100)}%)</p>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={!isValid || !isDirty || isLoading}
            className="bg-fitflow-green hover:bg-fitflow-green/90"
          >
            {isLoading ? 'Salvando...' : 'Salvar Metas'}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default NutritionGoalsForm;