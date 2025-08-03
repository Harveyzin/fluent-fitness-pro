import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useBioimpedance } from '@/contexts/BioimpedanceContext';
import { useToast } from '@/hooks/use-toast';

const bioimpedanceSchema = z.object({
  date: z.date(),
  weight: z.number().min(30).max(300),
  height: z.number().min(100).max(250),
  bodyFatPercentage: z.number().min(3).max(50),
  muscleMass: z.number().min(10).max(80),
  boneMass: z.number().min(1).max(10),
  waterPercentage: z.number().min(30).max(80),
  basalMetabolicRate: z.number().min(800).max(4000),
  visceralFat: z.number().min(1).max(30),
  metabolicAge: z.number().min(18).max(80),
  notes: z.string().optional()
});

type BioimpedanceFormData = z.infer<typeof bioimpedanceSchema>;

interface BioimpedanceFormProps {
  studentId: string;
  onSubmit?: () => void;
}

export const BioimpedanceForm: React.FC<BioimpedanceFormProps> = ({ studentId, onSubmit }) => {
  const { addMeasurement } = useBioimpedance();
  const { toast } = useToast();

  const form = useForm<BioimpedanceFormData>({
    resolver: zodResolver(bioimpedanceSchema),
    defaultValues: {
      date: new Date(),
      weight: 70,
      height: 170,
      bodyFatPercentage: 20,
      muscleMass: 30,
      boneMass: 3,
      waterPercentage: 55,
      basalMetabolicRate: 1500,
      visceralFat: 8,
      metabolicAge: 30,
      notes: ''
    }
  });

  const handleSubmit = (data: BioimpedanceFormData) => {
    addMeasurement({
      studentId,
      date: data.date,
      weight: data.weight,
      height: data.height,
      bodyFatPercentage: data.bodyFatPercentage,
      muscleMass: data.muscleMass,
      boneMass: data.boneMass,
      waterPercentage: data.waterPercentage,
      basalMetabolicRate: data.basalMetabolicRate,
      visceralFat: data.visceralFat,
      metabolicAge: data.metabolicAge,
      notes: data.notes
    });
    
    toast({
      title: "Medição Adicionada",
      description: "Nova medição de bioimpedância foi registrada com sucesso."
    });
    
    form.reset();
    onSubmit?.();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Data da Medição</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? format(field.value, "dd/MM/yyyy") : "Selecionar data"}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date > new Date()}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="weight"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Peso (kg)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.1"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="height"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Altura (cm)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="bodyFatPercentage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gordura Corporal (%)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.1"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="muscleMass"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Massa Muscular (kg)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.1"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="boneMass"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Massa Óssea (kg)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.1"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="waterPercentage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Água Corporal (%)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.1"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="basalMetabolicRate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Taxa Metabólica (kcal)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="visceralFat"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gordura Visceral</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="metabolicAge"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Idade Metabólica</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Observações</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Adicione observações sobre a medição..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          Salvar Medição
        </Button>
      </form>
    </Form>
  );
};