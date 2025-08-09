import React, { useState } from 'react';
import { Crown, Check, Zap, Star, Shield, Smartphone } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

interface PremiumUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PremiumUpgradeModal = ({ isOpen, onClose }: PremiumUpgradeModalProps) => {
  const { toast } = useToast();
  const [selectedPlan, setSelectedPlan] = useState<string>('premium');

  const plans = [
    {
      id: 'basic',
      name: 'Basic',
      price: 'R$ 29,90',
      period: '/mês',
      description: 'Perfeito para iniciantes',
      features: [
        'Treinos básicos ilimitados',
        'Rastreamento de progresso',
        'Biblioteca de exercícios',
        'Histórico de treinos',
        'Timer de descanso',
        'Suporte por email'
      ],
      color: 'border-gray-200',
      buttonClass: 'border',
      popular: false
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 'R$ 49,90',
      period: '/mês',
      description: 'Mais popular entre nossos usuários',
      features: [
        'Tudo do plano Basic',
        'Módulo completo de nutrição',
        'Scanner de código de barras',
        'Gráficos de macronutrientes',
        'Planos nutricionais',
        'Relatórios nutricionais',
        'Metas personalizadas',
        'Suporte prioritário',
      ],
      color: 'border-fitflow-green',
      buttonClass: 'bg-fitflow-green text-white',
      popular: true
    },
    {
      id: 'pro',
      name: 'Professional',
      price: 'R$ 89,90',
      period: '/mês',
      description: 'Para personal trainers',
      features: [
        'Tudo do plano Premium',
        'Ferramentas de personal trainer',
        'Gestão de alunos ilimitada',
        'Anamnese completa dos alunos',
        'Bioimpedância e medições',
        'Marketplace de treinos',
        'Analytics profissionais',
        'Relatórios personalizados',
        'Suporte dedicado'
      ],
      color: 'border-purple-500',
      buttonClass: 'border border-purple-500 text-purple-500',
      popular: false
    }
  ];

  const premiumFeatures = [
    {
      icon: Zap,
      title: 'IA Personalizada',
      description: 'Treinos adaptados automaticamente ao seu progresso'
    },
    {
      icon: Star,
      title: 'Personal Trainers',
      description: 'Acesso direto a profissionais certificados'
    },
    {
      icon: Shield,
      title: 'Nutrição Avançada',
      description: 'Planos alimentares personalizados'
    },
    {
      icon: Smartphone,
      title: 'Sincronização',
      description: 'Dados sincronizados em todos os dispositivos'
    }
  ];

  const handleUpgrade = (planId: string) => {
    toast({
      title: "Upgrade Iniciado",
      description: `Redirecionando para o pagamento do plano ${plans.find(p => p.id === planId)?.name}...`
    });
    
    // Simular redirecionamento para pagamento
    setTimeout(() => {
      toast({
        title: "Upgrade Concluído!",
        description: "Bem-vindo ao FitFlow Premium! Aproveite todos os recursos.",
      });
      onClose();
    }, 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-center">
            <Crown className="text-fitflow-green" size={24} />
            Upgrade para Premium
          </DialogTitle>
          <DialogDescription>
            Escolha o plano ideal para sua jornada fitness e desbloqueie recursos avançados
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="plans" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="plans">Escolher Plano</TabsTrigger>
            <TabsTrigger value="features">Recursos Premium</TabsTrigger>
          </TabsList>

          <TabsContent value="plans" className="space-y-6 mt-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold mb-2">Escolha o plano ideal para você</h3>
              <p className="text-muted-foreground">Cancele a qualquer momento. Sem compromisso.</p>
            </div>

            <div className="grid gap-6">
              {plans.map((plan) => (
                <Card key={plan.id} className={`p-6 relative ${plan.color} ${selectedPlan === plan.id ? 'ring-2 ring-fitflow-green' : ''}`}>
                  {plan.popular && (
                    <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-fitflow-green text-white">
                      Mais Popular
                    </Badge>
                  )}
                  
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="text-xl font-bold mb-1">{plan.name}</h4>
                      <p className="text-sm text-muted-foreground">{plan.description}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">{plan.price}</div>
                      <div className="text-sm text-muted-foreground">{plan.period}</div>
                    </div>
                  </div>

                  <div className="space-y-3 mb-6">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <Check size={16} className="text-fitflow-green flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Button 
                    className={`w-full ${plan.buttonClass}`}
                    onClick={() => {
                      setSelectedPlan(plan.id);
                      handleUpgrade(plan.id);
                    }}
                    variant={plan.id === 'premium' ? 'default' : 'outline'}
                  >
                    {plan.id === 'basic' ? 'Downgrade' : 'Escolher Plano'}
                  </Button>
                </Card>
              ))}
            </div>

            <div className="text-center text-sm text-muted-foreground">
              <p>💳 Aceitamos cartão de crédito, débito e PIX</p>
              <p>🔒 Pagamento 100% seguro e criptografado</p>
            </div>
          </TabsContent>

          <TabsContent value="features" className="space-y-6 mt-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold mb-2">Recursos Exclusivos Premium</h3>
              <p className="text-muted-foreground">Tudo que você precisa para atingir seus objetivos</p>
            </div>

            <div className="grid gap-6">
              {premiumFeatures.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <Card key={index} className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-fitflow-green/10 rounded-lg">
                        <Icon className="text-fitflow-green" size={24} />
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">{feature.title}</h4>
                        <p className="text-muted-foreground">{feature.description}</p>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>

            <Card className="p-6 bg-gradient-to-r from-fitflow-green/10 to-blue-500/10">
              <div className="text-center">
                <Crown className="mx-auto text-fitflow-green mb-4" size={48} />
                <h3 className="text-xl font-bold mb-2">Transforme sua jornada fitness</h3>
                <p className="text-muted-foreground mb-6">
                  Junte-se a mais de 10.000 usuários que já transformaram suas vidas com o FitFlow Premium
                </p>
                <Button className="bg-fitflow-green text-white" onClick={() => handleUpgrade('premium')}>
                  Experimentar Premium por 7 dias grátis
                </Button>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default PremiumUpgradeModal;