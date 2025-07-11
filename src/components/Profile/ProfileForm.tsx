import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const profileFormSchema = z.object({
  name: z.string()
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(50, 'Nome deve ter no máximo 50 caracteres'),
  email: z.string()
    .email('Email inválido')
    .min(1, 'Email é obrigatório'),
  age: z.string()
    .min(1, 'Idade é obrigatória'),
  gender: z.enum(['male', 'female', 'other'], {
    required_error: 'Selecione um gênero'
  }),
  weight: z.string()
    .min(1, 'Peso é obrigatório'),
  height: z.string()
    .min(1, 'Altura é obrigatória'),
  activityLevel: z.enum(['sedentary', 'light', 'moderate', 'very_active', 'extra_active'], {
    required_error: 'Selecione um nível de atividade'
  }),
  goal: z.enum(['lose_weight', 'maintain', 'gain_muscle', 'improve_fitness'], {
    required_error: 'Selecione um objetivo'
  })
});

const profileDataSchema = z.object({
  name: z.string()
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(50, 'Nome deve ter no máximo 50 caracteres'),
  email: z.string()
    .email('Email inválido')
    .min(1, 'Email é obrigatório'),
  age: z.number()
    .min(16, 'Idade deve estar entre 16 e 100 anos')
    .max(100, 'Idade deve estar entre 16 e 100 anos'),
  gender: z.enum(['male', 'female', 'other']),
  weight: z.number()
    .min(30, 'Peso deve estar entre 30 e 300 kg')
    .max(300, 'Peso deve estar entre 30 e 300 kg'),
  height: z.number()
    .min(100, 'Altura deve estar entre 100 e 250 cm')
    .max(250, 'Altura deve estar entre 100 e 250 cm'),
  activityLevel: z.enum(['sedentary', 'light', 'moderate', 'very_active', 'extra_active']),
  goal: z.enum(['lose_weight', 'maintain', 'gain_muscle', 'improve_fitness'])
});

type ProfileFormData = z.infer<typeof profileFormSchema>;
type ProfileData = z.infer<typeof profileDataSchema>;

interface ProfileFormProps {
  initialData?: Partial<ProfileData>;
  onSubmit: (data: ProfileData) => void;
  isLoading?: boolean;
}

const ProfileForm = ({ initialData, onSubmit, isLoading = false }: ProfileFormProps) => {
  const { toast } = useToast();
  
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid, isDirty }
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: initialData?.name || '',
      email: initialData?.email || '',
      age: typeof initialData?.age === 'number' ? initialData.age.toString() : '',
      gender: initialData?.gender || undefined,
      weight: typeof initialData?.weight === 'number' ? initialData.weight.toString() : '',
      height: typeof initialData?.height === 'number' ? initialData.height.toString() : '',
      activityLevel: initialData?.activityLevel || undefined,
      goal: initialData?.goal || undefined
    },
    mode: 'onChange'
  });

  const watchedGender = watch('gender');
  const watchedActivityLevel = watch('activityLevel');
  const watchedGoal = watch('goal');

  const handleFormSubmit = (formData: ProfileFormData) => {
    try {
      // Transform form data to profile data
      const profileData: ProfileData = {
        ...formData,
        age: parseInt(formData.age),
        weight: parseFloat(formData.weight),
        height: parseInt(formData.height)
      };

      // Validate the transformed data
      const validatedData = profileDataSchema.parse(profileData);
      
      onSubmit(validatedData);
      toast({
        title: "Perfil atualizado",
        description: "Suas informações foram salvas com sucesso.",
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
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Nome */}
          <div className="space-y-2">
            <Label htmlFor="name">Nome Completo</Label>
            <Input
              id="name"
              {...register('name')}
              placeholder="Seu nome completo"
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              {...register('email')}
              placeholder="seu.email@exemplo.com"
              className={errors.email ? 'border-red-500' : ''}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          {/* Idade */}
          <div className="space-y-2">
            <Label htmlFor="age">Idade</Label>
            <Input
              id="age"
              type="number"
              {...register('age')}
              placeholder="25"
              min="16"
              max="100"
              className={errors.age ? 'border-red-500' : ''}
            />
            {errors.age && (
              <p className="text-sm text-red-500">{errors.age.message}</p>
            )}
          </div>

          {/* Gênero */}
          <div className="space-y-2">
            <Label>Gênero</Label>
            <Select
              value={watchedGender}
              onValueChange={(value) => setValue('gender', value as any, { shouldValidate: true })}
            >
              <SelectTrigger className={errors.gender ? 'border-red-500' : ''}>
                <SelectValue placeholder="Selecione seu gênero" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Masculino</SelectItem>
                <SelectItem value="female">Feminino</SelectItem>
                <SelectItem value="other">Outro</SelectItem>
              </SelectContent>
            </Select>
            {errors.gender && (
              <p className="text-sm text-red-500">{errors.gender.message}</p>
            )}
          </div>

          {/* Peso */}
          <div className="space-y-2">
            <Label htmlFor="weight">Peso (kg)</Label>
            <Input
              id="weight"
              type="number"
              step="0.1"
              {...register('weight')}
              placeholder="70.5"
              min="30"
              max="300"
              className={errors.weight ? 'border-red-500' : ''}
            />
            {errors.weight && (
              <p className="text-sm text-red-500">{errors.weight.message}</p>
            )}
          </div>

          {/* Altura */}
          <div className="space-y-2">
            <Label htmlFor="height">Altura (cm)</Label>
            <Input
              id="height"
              type="number"
              {...register('height')}
              placeholder="175"
              min="100"
              max="250"
              className={errors.height ? 'border-red-500' : ''}
            />
            {errors.height && (
              <p className="text-sm text-red-500">{errors.height.message}</p>
            )}
          </div>
        </div>

        {/* Nível de Atividade */}
        <div className="space-y-2">
          <Label>Nível de Atividade</Label>
          <Select
            value={watchedActivityLevel}
            onValueChange={(value) => setValue('activityLevel', value as any, { shouldValidate: true })}
          >
            <SelectTrigger className={errors.activityLevel ? 'border-red-500' : ''}>
              <SelectValue placeholder="Selecione seu nível de atividade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sedentary">Sedentário (pouco ou nenhum exercício)</SelectItem>
              <SelectItem value="light">Leve (exercícios leves 1-3 dias/semana)</SelectItem>
              <SelectItem value="moderate">Moderado (exercícios moderados 3-5 dias/semana)</SelectItem>
              <SelectItem value="very_active">Muito Ativo (exercícios intensos 6-7 dias/semana)</SelectItem>
              <SelectItem value="extra_active">Extremamente Ativo (exercícios muito intensos, trabalho físico)</SelectItem>
            </SelectContent>
          </Select>
          {errors.activityLevel && (
            <p className="text-sm text-red-500">{errors.activityLevel.message}</p>
          )}
        </div>

        {/* Objetivo */}
        <div className="space-y-2">
          <Label>Objetivo Principal</Label>
          <Select
            value={watchedGoal}
            onValueChange={(value) => setValue('goal', value as any, { shouldValidate: true })}
          >
            <SelectTrigger className={errors.goal ? 'border-red-500' : ''}>
              <SelectValue placeholder="Selecione seu objetivo principal" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="lose_weight">Perder Peso</SelectItem>
              <SelectItem value="maintain">Manter Peso</SelectItem>
              <SelectItem value="gain_muscle">Ganhar Massa Muscular</SelectItem>
              <SelectItem value="improve_fitness">Melhorar Condicionamento</SelectItem>
            </SelectContent>
          </Select>
          {errors.goal && (
            <p className="text-sm text-red-500">{errors.goal.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={!isValid || !isDirty || isLoading}
            className="bg-fitflow-green hover:bg-fitflow-green/90"
          >
            {isLoading ? 'Salvando...' : 'Salvar Alterações'}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default ProfileForm;